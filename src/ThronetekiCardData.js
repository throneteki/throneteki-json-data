const fs = require('fs');
const path = require('path');

class ThronetekiCardData {
    constructor() {
        this.packs = this.loadPacks();
    }

    loadPacks() {
        let packFiles = fs.readdirSync(path.join(__dirname, '..', 'packs')).filter(file => file.endsWith('.json'));
        return packFiles.map(file => require(path.join(__dirname, '..', 'packs', file)));
    }
}

module.exports = ThronetekiCardData;
