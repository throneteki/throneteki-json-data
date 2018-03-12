const fs = require('fs');
const path = require('path');

class ThronetekiCardData {
    constructor() {
        this.packs = this.loadPacks();
        this.cardCountByName = this.createCardCountIndex(this.packs);
    }

    loadPacks() {
        let packFiles = fs.readdirSync(path.join(__dirname, '..', 'packs')).filter(file => file.endsWith('.json'));
        return packFiles.map(file => require(path.join(__dirname, '..', 'packs', file)));
    }

    createCardCountIndex(packs) {
        let cardsByName = {};

        for(let pack of packs) {
            for(let card of pack.cards) {
                cardsByName[card.name] = (cardsByName[card.name] || 0) + 1;
            }
        }

        return cardsByName;
    }

    hasMultipleCardsByName(name) {
        return this.cardCountByName[name] > 1;
    }
}

module.exports = ThronetekiCardData;
