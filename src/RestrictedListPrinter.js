const ThronetekiCardData = require('./ThronetekiCardData');

class RestrictedListPrinter {
    constructor() {
        this.cardData = new ThronetekiCardData();
        this.restrictedList = require('../restricted-list.json');
    }

    buildOutput() {
        let output = '';

        const currentList = this.restrictedList[this.restrictedList.length - 1];

        output += `${currentList.name} (${currentList.date})\n`;
        output += '============================================\n';
        output += '\n';

        output += this.buildOutputForFormat('joust');
        output += this.buildOutputForFormat('melee');

        return output;
    }

    buildOutputForFormat(formatName) {
        let output = '';

        const currentList = this.restrictedList[this.restrictedList.length - 1];
        const rules = currentList.formats.find(format => format.name === formatName);

        const restricted = rules.restricted.map(code => this.cardData.getCardByCode(code));
        const banned = (rules.banned || []).map(code => this.cardData.getCardByCode(code));

        const factions = ['thenightswatch', 'greyjoy', 'targaryen', 'tyrell', 'lannister', 'baratheon', 'martell', 'stark', 'neutral'];

        output += `${formatName.toUpperCase()}\n`;
        output += '--------------------------------------------\n';
        let podIndex = 0;
        for(const pod of rules.pods) {
            if(pod.restricted) {
                continue;
            }

            podIndex += 1;
            output += `Pod ${podIndex}\n`;
            const podCards = pod.cards.map(code => this.cardData.getCardByCode(code));
            for(const card of podCards) {
                output += `---> ${this.formatCard(card)}\n`;
            }
            output += '\n';
        }
        for(const faction of factions) {
            output += `${faction}:\n`;

            const cards = restricted.filter(card => card.faction === faction);
            for(const card of cards) {
                output += `${this.formatCard(card)}\n`;

                const pod = (rules.pods || []).find(pod => pod.restricted === card.code);
                if(pod) {
                    const podCards = pod.cards.map(code => this.cardData.getCardByCode(code));
                    for(const card of podCards) {
                        output += `---> ${this.formatCard(card)}\n`;
                    }
                }
            }
            output += '\n';
        }

        output += 'Banned:\n';
        for(const card of banned) {
            output += `${this.formatCard(card)}\n`;
        }

        output += '\n\n';

        return output;
    }

    formatCard(card) {
        return `${card.name} (${card.packName}) - ${card.code}`;
    }
}

module.exports = RestrictedListPrinter;