const fs = require('fs');
const path = require('path');

class ThronetekiCardData {
    constructor() {
        this.packs = this.loadPacks();
        this.cardMap = this.createCardMap(this.packs);
    }

    loadPacks() {
        let packFiles = fs.readdirSync(path.join(__dirname, '..', 'packs')).filter(file => file.endsWith('.json'));
        return packFiles.map(file => require(path.join(__dirname, '..', 'packs', file)));
    }

    getCardByCode(code) {
        return this.cardMap.get(code);
    }

    createCardMap(packs) {
        const cardMap = new Map();

        for(const pack of packs) {
            for(const card of pack.cards) {
                card.packName = pack.name;
                cardMap.set(card.code, card);
            }
        }

        return cardMap;
    }
}

module.exports = ThronetekiCardData;
