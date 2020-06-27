const ThronetekiCardData = require('./ThronetekiCardData');

class RestrictedListPrinter {
    constructor() {
        this.cardData = new ThronetekiCardData();
        this.restrictedList = require('../restricted-list.json');
    }

    buildOutput() {
        let output = '';

        const currentList = this.restrictedList[this.restrictedList.length - 1];
        const joustRules = currentList.formats.find(format => format.name === 'joust');

        const restricted = joustRules.restricted.map(code => this.cardData.getCardByCode(code));
        const banned = (joustRules.banned || []).map(code => this.cardData.getCardByCode(code));

        const factions = ['thenightswatch', 'greyjoy', 'targaryen', 'tyrell', 'lannister', 'baratheon', 'martell', 'stark', 'neutral'];

        output += `${currentList.issuer} v${currentList.version} (${currentList.date})\n`;
        output += '--------------------------------------------\n';
        for(const faction of factions) {
            output += `${faction}:\n`;

            const cards = restricted.filter(card => card.faction === faction);
            for(const card of cards) {
                output += `${this.formatCard(card)}\n`;

                const pod = joustRules.pods.find(pod => pod.restricted === card.code);
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

        return output;
    }

    formatCard(card) {
        return `${card.name} (${card.packName}) - ${card.code}`;
    }
}

module.exports = RestrictedListPrinter;