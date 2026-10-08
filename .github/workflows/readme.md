# Notes on workflows

## Compile agentic action into lock file

```
cd /Users/geraldinefberry/repos/project-dfberry/repos/dfberry.github.io-2

gh extension install github/gh-aw
gh aw compile --verbose
```

Note: If there’s a mismatch between the generated agentic workflow and the existing YAML files; that mismatch is often the reason scheduled runs silently skip.

## When did the action last run

```
gh run list --workflow "Draft weekly blog post"
```

## Logging

If we want to make debugging easier, the workflow should log:

```
echo "event=${GITHUB_EVENT_NAME}"
echo "ref=${GITHUB_REF}"
gh issue list --label blog --state open
echo "workflow path is on default branch?"
```