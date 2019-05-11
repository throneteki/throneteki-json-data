const fs = require('fs');
const path = require('path');
const ThronetekiCardData = require('../src/ThronetekiCardData.js');

class ThronetekiToThronesDbConverter {
    constructor(thronesDbPath) {
        this.thronetekiData = new ThronetekiCardData();
        this.thronesDbPath = thronesDbPath;
    }

    convert() {
        for(let pack of this.thronetekiData.packs) {
            this.convertPack(pack);
        }
    }

    convertPack(pack) {
        let thronesDbPackPath = path.join(this.thronesDbPath, 'pack', pack.code + '.json');
        let thronesDbPack = this.loadExistingThronesDbPack(thronesDbPackPath);
        let output = pack.cards.map(card => this.convertCard(card, pack.code, thronesDbPack));
        output.sort((a, b) => a.position < b.position ? -1 : 1);
        fs.writeFileSync(thronesDbPackPath, JSON.stringify(output, null, 4) + '\n');
    }

    loadExistingThronesDbPack(packPath) {
        if(fs.existsSync(packPath)) {
            return require(packPath);
        }

        return [];
    }

    convertCard(thronetekiCard, packCode, thronesDbPack) {
        let thronesDbCard = thronesDbPack.find(c => c.code === thronetekiCard.code) || {};
        let position = parseInt(thronetekiCard.code.substring(2), 10);

        if(thronetekiCard.type === 'plot') {
            thronesDbCard.claim = this.convertXValue(thronetekiCard.plotStats.claim);
        }
        thronesDbCard.code = thronetekiCard.code;
        if(['attachment', 'character', 'event', 'location'].includes(thronetekiCard.type)) {
            thronesDbCard.cost = thronetekiCard.cost.toString();
        }
        thronesDbCard.deck_limit = thronetekiCard.deckLimit;
        if(thronetekiCard.designer) {
            thronesDbCard.designer = thronetekiCard.designer;
        }
        thronesDbCard.faction_code = thronetekiCard.faction;
        thronesDbCard.flavor = thronetekiCard.flavor || '';
        if(packCode !== 'VDS') {
            thronesDbCard.illustrator = thronetekiCard.illustrator;
        }
        if(thronetekiCard.type === 'plot') {
            thronesDbCard.income = this.convertXValue(thronetekiCard.plotStats.income);
            thronesDbCard.initiative = this.convertXValue(thronetekiCard.plotStats.initiative);
        }
        if(thronetekiCard.type === 'character') {
            thronesDbCard.is_intrigue = thronetekiCard.icons.intrigue;
        }
        thronesDbCard.is_loyal = !!thronetekiCard.loyal;
        if(thronetekiCard.type === 'character') {
            thronesDbCard.is_military = thronetekiCard.icons.military;
        }
        if(thronetekiCard.type === 'character') {
            thronesDbCard.is_power = thronetekiCard.icons.power;
        }
        thronesDbCard.is_unique = !!thronetekiCard.unique;
        thronesDbCard.name = thronetekiCard.name;
        this.setMissingProperty(thronesDbCard, 'octgn_id', null);
        thronesDbCard.pack_code = packCode;
        thronesDbCard.position = position;
        this.setMissingProperty(thronesDbCard, 'quantity', 3);
        if(thronetekiCard.type === 'plot') {
            thronesDbCard.reserve = this.convertXValue(thronetekiCard.plotStats.reserve);
        }
        if(thronetekiCard.type === 'character') {
            thronesDbCard.strength = this.convertXValue(thronetekiCard.strength);
        }
        thronesDbCard.text = thronetekiCard.text;
        thronesDbCard.traits = thronetekiCard.traits.length === 0 ? '' : thronetekiCard.traits.join('. ') + '.';
        thronesDbCard.type_code = thronetekiCard.type;
        return thronesDbCard;
    }

    setMissingProperty(card, property, value) {
        if(card[property] !== undefined) {
            return;
        }

        card[property] = value;
    }

    convertXValue(value) {
        if(['X', '-'].includes(value)) {
            return null;
        }

        return value;
    }
}

module.exports = ThronetekiToThronesDbConverter;
