# Dina Berry

## Website with simple search

This website uses Docusaurus with local search to provide a simple website. 

## Install

```
npm install
```

## Run

```
npm run local
```

![](./static/img/basic-site.png)

## Control left nav

The appearance of an item in the left nav is based on a new file in the `./docs` directory. 

The ordering of an item in the directory is controlled in each file's metadata `sidebar_position: 1`. The absence of the property means file are sorted in alpahnum order.

## Publish to dev.to

1. Push to GitHub, wait for pipelines to complete.
2. View site on GitHub pages
3. Go to profile for Dev.to.
4. Under settings, on extension page, fetch RSS feed. Then go back to dashboard and see it there. 
5. Blog post is in drafts, review it to make sure images and code blocks display correctly.
6. Code blocks may need to be recopied because they don't have end of lines.
7. Change publish from false to true in the top metadata.