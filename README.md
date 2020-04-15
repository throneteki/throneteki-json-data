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

## Importing from CGDB
Once the pack data is available on CGDB, it can be imported to the throneteki-json-data format by running:
```
npm run import-cgdb packs/packFileName.json cycleCode
# Example: npm run import-cgdb packs/SoD.json 10
```

The local pack file must already exist - the import script uses the the `cgdbId` field in the pack data to look up the corresponding data on CGDB. After the import is complete, close review of the `text` field for cards may be necessary as the CGDB format is a bit more loose than what is used here and on ThronesDB.

[![Travis Build](https://travis-ci.org/ystros/throneteki-json-data.svg?branch=master)](https://travis-ci.org/ystros/throneteki-json-data)
