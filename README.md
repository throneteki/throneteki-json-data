# throneteki-json-data

Card data used by The Iron Throne / throneteki. Each JSON file in the `packs` directory should correspond to a pack or expansion for A Game of Thrones: The Card Game 2nd Edition. Initial data set pulled from https://github.com/Alsciende/thronesdb-json-data

## Getting started

```
npm install
```

## Validating

To validate all card data against the schema, run:

```
npm test
```

## Exporting to thronesdb-json-data

To export the card data to the ThronesDB data format, run:
```
npm run export path/to/thronesdb-json-data
```

This will create any new pack files necessary as well as update existing packs with missing card data. Fields that are not included in this schema (such as `flavor` and `illustrator`) will need to be manually updated in the exported data. Additionally, if it is a new pack, you'll need to add the pack info to `packs.json` for thronesdb-json-data.
