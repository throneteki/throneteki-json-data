const path = require('path');

class ThronesDbCardData {
    constructor(pathToImportDir) {
        this.packs = this.loadPacks(pathToImportDir);
    }

    loadPacks(pathToImportDir) {
        let packs = require(path.join(pathToImportDir, 'packs.json'));

        for(let pack of packs) {
            pack.cards = require(path.join(pathToImportDir, 'pack', pack.code + '.json'));
        }

        return packs;
    }
}

module.exports = ThronesDbCardData;
