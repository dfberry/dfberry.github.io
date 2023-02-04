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

The ordering of an item in the directory is controlled in each file's metadata `sidebar_position: 1`. The absense of the property means file are sorted in alpahnum order.