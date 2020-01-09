const fs = require('fs');
const request = require('request');

class CardgameDbToThronetekiConverter {
    convert({ pathToPackFile, cyclePrefix }) {
        let pack = JSON.parse(fs.readFileSync(pathToPackFile));

        this.cyclePrefix = cyclePrefix;

        return this.getCGDBData(pack.cgdbId)
            .then(cards => {
                let currentPackCards = cards.filter(card => this.cleanUpField(card.setname).toLowerCase() === pack.name.toLowerCase()).map(card => this.convertCard(card));
                currentPackCards.sort((a, b) => a.code < b.code ? -1 : 1);

                if(currentPackCards.length == 0) {
                    console.error('Cards corresponding to', pack.name, 'have not been released yet on CGDB.');
                    return;
                }

                pack.cards = currentPackCards;

                fs.writeFileSync(pathToPackFile, JSON.stringify(pack, null, 4) + '\n');
                console.log('Import of cards for', pack.name, 'has been completed.');
            });
    }

    getCGDBData(id) {
        const url = `http://www.cardgamedb.com/deckbuilders/gameofthrones2ndedition/database/GT${id}-db.jgz`;

        return new Promise((resolve, reject) => {
            request.get(url, { gzip: true }, function(error, res, body) {
                if(error) {
                    return reject(error);
                }

                // Get rid of the preceding 'cards = ' and trailing semi-colon
                let jsonText = body.substr(8, body.length - 9);
                resolve(JSON.parse(jsonText));
            });
        });
    }

    convertCard(cardData) {
        let text = this.formatTextField(cardData.text);

        let modifierMatch = text.match(/<b>.*\[\+.*\]<\/b>/);
        if(modifierMatch) {
            const pattern = /\[\+(.+?)\]/g;
            let modifiers = '';
            let match;
            while((match = pattern.exec(modifierMatch[0])) !== null) {
                modifiers += '+' + match[1].trim() + '.';
            }
            modifiers = modifiers.replace('gold', 'Income').replace('initiative', 'Initiative').replace('reserve', 'Reserve').replace('claim', 'Claim');
            text = text.replace(modifierMatch[0], modifiers);
        }

        let limit = this.getDefaultDeckLimit(cardData.type.toLowerCase());
        let limitMatch = text.match(/\n.*Deck Limit: (\d+).?/);
        if(limitMatch) {
            limit = parseInt(limitMatch[1]);
            text = text.replace(limitMatch[0], '');
        }

        let card = {};
        card.code = `${this.cyclePrefix}${cardData.num}`;
        card.type = cardData.type.toLowerCase();
        card.name = this.cleanUpField(cardData.name);

        if(['attachment', 'character', 'location'].includes(card.type)) {
            card.unique = cardData.unique === 'Y';
        }

        card.faction = this.lookupFaction(cardData);
        if(card.faction !== 'neutral') {
            card.loyal = cardData.loyal === 'L';
        }

        if(card.type === 'plot') {
            card.plotStats = {
                income: this.getIntField(cardData.gold),
                initiative: this.getIntField(cardData.initiative),
                claim: this.getIntField(cardData.claim),
                reserve: this.getIntField(cardData.reserve)
            };
        }

        if(['attachment', 'character', 'event', 'location'].includes(card.type)) {
            card.cost = this.getIntField(cardData.cost);
        }

        if(card.type === 'character') {
            card.icons = {
                military: cardData.military === 'Y',
                intrigue: cardData.intrigue === 'Y',
                power: cardData.power === 'Y'
            };
            card.strength = this.getIntField(cardData.strength);
        }

        card.traits = this.cleanUpField(cardData.traits).split('.').filter(trait => trait !== '').map(trait => trait.trim());
        card.text = this.cleanUpField(text);
        card.deckLimit = limit;

        card.illustrator = this.cleanUpField(cardData.illustrator);

        return card;
    }

    formatTextField(text) {
        text = text.replace(/<em class='bbc'><strong class='bbc'>/gi, '<i>').replace(/<\/strong><\/em>/gi, '</i>');
        text = text.replace(/<br\s*\/>/gi, '\n');
        text = text.replace(/<strong class='bbc'>/gi, '<b>').replace(/<\/strong>/gi, '</b>').replace(/<em class='bbc'>/gi, '<i>').replace(/<\/em>/gi, '</i>');
        text = text.replace(/<\/(i|b)>:/gi, function(match, element) {
            return `:</${element}>`;
        });
        text = text.replace(/(\s+)<\/(b|i)>/g, function(match, spacing, element) {
            return `</${element}>${spacing}`;
        });
        text = text.replace(/<(b|i)>(\s+)/g, function(match, element, spacing) {
            return `${spacing}<${element}>`;
        });
        text = text.replace(/<(b|i)><\/(b|i)>/g, '');
        text = text.replace(/\[.+?\]/g, function(match) {
            return match.toLowerCase();
        });
        // Remove keyword definitions
        text = text.replace(/<i>\(.+?\)<\/i>/gi, '');
        // Remove card designer since it's a separate field
        text = text.replace(/\n<b>Card design.*<\/b>/gi, '');
        // Move spaces outside of elements
        text = text.replace(/(\s+)<\/.+?>/gi, function(match) {
            return match.trim() + ' ';
        });
        text = text.replace(/( )+\n/gi, '\n');
        text = text.replace('[night\'s watch]', '[thenightswatch]');
        return text;
    }

    lookupFaction(cardData) {
        const Factions = ['baratheon', 'greyjoy', 'lannister', 'martell', 'neutral', 'stark', 'targaryen', 'thenightswatch', 'tyrell'];
        return Factions.find(faction => cardData[faction] === 'Y');
    }

    getDefaultDeckLimit(type) {
        if(type === 'agenda') {
            return 1;
        }

        if(type === 'plot') {
            return 2;
        }

        return 3;
    }

    getIntField(text) {
        if(text === 'X' || text === '-') {
            return text;
        }

        return parseInt(text);
    }

    cleanUpField(text) {
        const replacements = [
            { original: /“/g, replace: '"' },
            { original: /”/g, replace: '"' },
            { original: /&ldquo;/g, replace: '"' },
            { original: /&rdquo;/g, replace: '"' },
            { original: /’/g, replace: '\'' },
            { original: /&rsquo;/g, replace: '\'' },
            { original: /&#39;/g, replace: '\'' }
        ];

        return replacements.reduce((text, r) => text.replace(r.original, r.replace), text).trim();
    }
}

module.exports = CardgameDbToThronetekiConverter;
