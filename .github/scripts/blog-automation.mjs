import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..', '..');
const websiteRoot = path.join(repoRoot, 'website');
const modelsEndpoint = 'https://models.github.ai/inference/chat/completions';
const defaultModel = 'anthropic/claude-sonnet-4.6';

function slugify(value) {
  const slug = value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

  return slug || 'blog-idea';
}

function excerpt(text, maxLength = 160) {
  const normalized = text.replace(/\r\n/g, '\n').trim();
  if (!normalized) {
    return '';
  }

  const firstParagraph = normalized.split(/\n\s*\n/)[0].replace(/\s+/g, ' ').trim();
  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }

  return `${firstParagraph.slice(0, maxLength - 1).trimEnd()}…`;
}

function normalizeBody(text) {
  return (text || '')
    .replace(/\r\n/g, '\n')
    .trim()
    .replace(/\n{3,}/g, '\n\n');
}

function yamlList(values) {
  return values.map((value) => `  - "${String(value).replace(/"/g, '\\"')}"`).join('\n');
}

function issueLines(issue) {
  const body = normalizeBody(issue.body);
  if (!body) {
    return ['No additional notes were supplied on the issue.'];
  }

  return body.split('\n').map((line) => line.trimEnd());
}

function issueSummary(issue) {
  const body = normalizeBody(issue.body);
  if (body) {
    return body;
  }

  return issue.title;
}

function buildDraftPrompt(issue) {
  return [
    'You are helping write a personal, engaging blog post for Dina Berry.',
    'Write in first person with a thoughtful, practical, human voice.',
    'Turn the issue into a real blog draft instead of a checklist.',
    'Use markdown headings and paragraphs only; do not add front matter or a title line.',
    'Keep the tone warm, specific, and reflective.',
    'Do not simply restate the issue bullets. Expand the idea into a narrative that sounds like a real blog post.',
    '',
    `Issue title: ${issue.title}`,
    `Issue number: ${issue.number}`,
    `Issue labels: ${issue.labels.join(', ') || 'none'}`,
    '',
    'Issue notes:',
    issueSummary(issue),
    '',
    'Requirements:',
    '- Start with a strong hook that feels personal.',
    '- Include a few short sections that explain the idea, the tradeoffs, and why it matters.',
    '- Keep the writing grounded in the issue without inventing specific facts that are not present.',
    '- End with a reflective close or next steps.',
    '',
    'Return only the markdown body.',
  ].join('\n');
}

function fallbackDraftBody(issue) {
  const summary = issueSummary(issue);

  return `I keep coming back to the same pattern: a small idea starts as a note in an issue, then turns into something worth sharing.\n\n${summary}\n\n## Why this idea matters\n\nThis is the kind of topic that works best when I can connect it to a real workflow, a real constraint, and a real result. That keeps the post personal instead of generic.\n\n## What I would explore\n\nI would show the practical steps, the tradeoffs, and the parts that matter most when someone tries this for themselves.\n\n## Closing thought\n\nThe best posts are the ones that feel useful because they come from experience, not just a list of requirements.`;
}

function renderCaptureMarkdown(issue) {
  const labels = issue.labels || [];
  const capturedAt = new Date().toISOString();

  return `---
issue_number: ${issue.number}
issue_url: ${issue.url}
captured_at: ${capturedAt}
title: "${issue.title.replace(/"/g, '\\"')}"
labels:
${yamlList(labels.length ? labels : ['blog'])}
---

# Issue #${issue.number}

${issue.title}

## Source notes

${issueLines(issue).map((line) => line.length ? line : '').join('\n')}
`;
}

function renderDraftMarkdown(issue, body) {
  const today = new Date().toISOString().slice(0, 10);
  const slug = slugify(issue.title);
  const summary = excerpt(issue.body || issue.title);
  const draftBody = (body || '').trim() || fallbackDraftBody(issue);

  return `---
slug: /${today}-${slug}
date: ${today}
title: "${issue.title.replace(/"/g, '\\"')}"
description: "${(summary || issue.title).replace(/"/g, '\\"')}"
tags:
  - ai
  - blog
  - github-actions
  - workflows
keywords:
  - blog automation
  - issue to blog post
  - weekly content workflow
---

${draftBody}
`;
}

async function callModel({token, model, prompt}) {
  const response = await fetch(modelsEndpoint, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You write blog posts in a personal, engaging, first-person voice for an AI-focused developer audience.',
        },
        {role: 'user', content: prompt},
      ],
      temperature: 0.8,
      max_tokens: 2500,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`GitHub Models API returned ${response.status} ${response.statusText}: ${text}`);
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error('Model response did not contain message content');
  }

  return content;
}

async function generateDraftBody(issue, token, model = defaultModel) {
  if (!token) {
    return fallbackDraftBody(issue);
  }

  try {
    return await callModel({
      token,
      model,
      prompt: buildDraftPrompt(issue),
    });
  } catch (error) {
    console.error(`Model call failed: ${error.message}`);
    return fallbackDraftBody(issue);
  }
}

async function main() {
  const mode = process.argv[2];
  const issue = {
    number: Number(process.env.ISSUE_NUMBER),
    title: process.env.ISSUE_TITLE || 'Untitled blog idea',
    body: process.env.ISSUE_BODY || '',
    url: process.env.ISSUE_URL || '',
    labels: (process.env.ISSUE_LABELS || '')
      .split(',')
      .map((label) => label.trim())
      .filter(Boolean),
  };

  if (!issue.number) {
    throw new Error('ISSUE_NUMBER is required.');
  }

  if (mode === 'capture') {
    const filePath = path.join(websiteRoot, 'internal', 'blog-captures', `issue-${issue.number}.md`);
    await mkdir(path.dirname(filePath), {recursive: true});
    await writeFile(filePath, renderCaptureMarkdown(issue));
    return;
  }

  if (mode === 'draft') {
    const filePath = path.join(websiteRoot, 'blog', `${new Date().toISOString().slice(0, 10)}-${slugify(issue.title)}.md`);
    const body = await generateDraftBody(issue, process.env.GITHUB_TOKEN, process.env.MODEL || defaultModel);
    await writeFile(filePath, renderDraftMarkdown(issue, body));
    return;
  }

  throw new Error(`Unknown mode: ${mode}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

export {
  buildDraftPrompt,
  fallbackDraftBody,
  generateDraftBody,
  renderDraftMarkdown,
};
