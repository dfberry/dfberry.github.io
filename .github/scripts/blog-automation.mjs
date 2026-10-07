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

function buildRepoContextSummary(repoContext) {
  if (!repoContext) {
    return '';
  }

  try {
    const items = JSON.parse(repoContext);
    if (!Array.isArray(items) || !items.length) {
      return '';
    }

    return [
      'Relevant repository context:',
      ...items.map((item) => {
        const label = item.type || 'Update';
        const state = item.state ? ` (${item.state})` : '';
        const summary = item.body ? ` — ${excerpt(item.body, 140)}` : '';
        return `- ${label} #${item.number}${state}: ${item.title}${summary}`;
      }),
      '',
    ].join('\n');
  } catch {
    return `Relevant repository context:\n${repoContext}\n\n`;
  }
}

function buildDraftPrompt(issue, repoContext = '') {
  const repoSummary = buildRepoContextSummary(repoContext);

  return [
    'You are a thoughtful editorial assistant helping turn repository activity into an engaging developer blog post.',
    'Write in first person with a warm, practical, human voice that feels like a real post from Dina Berry.',
    'Treat the issue as a seed for the story, not as a checklist or issue dump.',
    'Use markdown headings and paragraphs only; do not add front matter or a title line.',
    'Do not simply restate the issue bullets or enumerate tasks. Instead, identify the likely themes, tensions, and lessons behind the work.',
    'Synthesize the issue and the repository context into a coherent narrative: explain the problem, why it matters, what changed, and what the reader should take away.',
    '',
    `Issue title: ${issue.title}`,
    `Issue number: ${issue.number}`,
    `Issue labels: ${issue.labels.join(', ') || 'none'}`,
    '',
    'Issue notes:',
    issueSummary(issue),
    '',
    repoSummary || 'Repository context: none provided.',
    'Writing workflow:',
    '1. Identify 2-4 meaningful themes or patterns in the issue and the surrounding repo activity.',
    '2. Explain the practical stakes and tradeoffs in a way that helps a reader understand the context.',
    '3. Draft a polished blog body with a strong hook, a few narrative sections, and a reflective close.',
    '',
    'Requirements:',
    '- Start with a strong hook that feels personal and grounded.',
    '- Include a few short sections that explain the idea, the tradeoffs, and why it matters.',
    '- Keep the writing grounded in the issue and repo context without inventing specific facts that are not present.',
    '- End with a reflective close or next steps that invite the reader to think further.',
    '- Avoid issue trackers, bullet-heavy summaries, and a flat changelog tone.',
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

async function fetchRepoContext(issue) {
  const number = Number(issue.number);
  if (!number) {
    return '';
  }

  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  };

  const candidates = [
    `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/issues?state=all&per_page=10&sort=updated&direction=desc`,
    `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/issues?state=all&labels=blog&per_page=10&sort=updated&direction=desc`,
  ];

  for (const url of candidates) {
    try {
      const response = await fetch(url, {headers});
      if (!response.ok) {
        continue;
      }

      const items = await response.json();
      if (!Array.isArray(items) || items.length === 0) {
        continue;
      }

      return JSON.stringify(
        items
          .filter((item) => item && item.number !== number && !item.pull_request)
          .slice(0, 5)
          .map((item) => ({
            number: item.number,
            title: item.title,
            body: item.body || '',
            state: item.state,
            type: item.pull_request ? 'PR' : 'Issue',
          })),
      );
    } catch {
      continue;
    }
  }

  return '';
}

async function generateDraftBody(issue, token, model = defaultModel) {
  if (!token) {
    return fallbackDraftBody(issue);
  }

  try {
    const repoContext = await fetchRepoContext(issue);
    return await callModel({
      token,
      model,
      prompt: buildDraftPrompt(issue, repoContext),
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
