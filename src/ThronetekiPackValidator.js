const Validator = require('jsonschema').Validator;
const ValidTextReplacements = require('./ValidTextReplacements.js');

class ThronetekiPackValidator {
    constructor() {
        this.packSchema = require('../pack.schema.json');
        this.validator = this.createValidator();
    }

    createValidator() {
        let cardSchema = require('../card.schema.json');
        let validator = new Validator();

        validator.addSchema(this.packSchema, '/pack.schema.json');
        validator.addSchema(cardSchema, '/card.schema.json');

        return validator;
    }

    validate(pack) {
        let results = this.validator.validate(pack, this.packSchema, { nestedErrors: true });
        let manualCardErrors = this.getErrorsForCards(pack.cards);
        return {
            errors: manualCardErrors.concat(results.errors.map(error => this.addCardInfoToError(pack, error))),
            valid: results.valid && manualCardErrors.length === 0
        };
    }

    getErrorsForCards(cards) {
        let errors = [];

        for(let card of cards) {
            if(card.type === 'character') {
                if(card.strength === undefined) {
                    errors.push(`'${card.name} (${card.code})' - strength is required for characters`);
                }
                if(card.icons === undefined) {
                    errors.push(`'${card.name} (${card.code})' - icons is required for characters`);
                }
            }
            if(card.type === 'plot') {
                if(card.plotStats === undefined) {
                    errors.push(`'${card.name} (${card.code})' - plotStats is required for plots`);
                }
            }
            if(['attachment', 'character', 'event', 'location'].includes(card.type)) {
                if(card.cost === undefined) {
                    errors.push(`'${card.name} (${card.code})' - cost is required for draw cards`);
                }
            }
            if(['attachment', 'character', 'location'].includes(card.type)) {
                if(card.unique === undefined) {
                    errors.push(`'${card.name} (${card.code})' - unique is required for attachments, characters, and locations`);
                }
            }
            if(card.faction !== 'neutral') {
                if(card.loyal === undefined) {
                    errors.push(`'${card.name} (${card.code})' - loyal is required when faction is non-neutral`);
                }
            }
            let replacements = card.text.match(/\[(.+?)\]/gm);
            if(replacements) {
                let unknownReplacements = replacements.map(r => r.slice(1, -1)).filter(r => !ValidTextReplacements.includes(r));
                if(unknownReplacements.length !== 0) {
                    errors.push(`'${card.name} (${card.code})' - text contains unknown replacement values: ${unknownReplacements.join(', ')}`);
                }
            }
        }

        return errors;
    }

    addCardInfoToError(pack, error) {
        let message = error.toString();
        let match = message.match(/instance\.cards\[(\d+)\]/);
        if(!match) {
            return message;
        }

        let cardIndex = parseInt(match[1]);
        let card = pack.cards[cardIndex];

        return message.replace(match[0], `'${card.name} (${card.code})'`);
    }
}

module.exports = ThronetekiPackValidator;
