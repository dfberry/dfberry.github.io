import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..', '..');
const websiteRoot = path.join(repoRoot, 'website');

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

function renderDraftMarkdown(issue) {
  const today = new Date().toISOString().slice(0, 10);
  const slug = slugify(issue.title);
  const summary = excerpt(issue.body || issue.title);
  const sourceNotes = issueLines(issue).join('\n');

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

# ${issue.title}

This draft starts from GitHub issue #${issue.number} and turns the request into a publishable blog post outline.

## What the issue asked for

${sourceNotes || 'No additional notes were supplied on the issue.'}

## Proposed structure

1. Capture the idea in GitHub issues with the \`blog\` label.
2. Review the idea on the weekly schedule.
3. Expand the notes into a full post draft and open a PR.

## Why this matters

The goal is to keep a steady weekly publishing loop without losing the original idea trail.

## Next steps

- Refine the outline into the final article.
- Add supporting examples, links, and screenshots.
- Merge the PR when the post is ready to publish.
`;
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
    await writeFile(filePath, renderDraftMarkdown(issue));
    return;
  }

  throw new Error(`Unknown mode: ${mode}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
