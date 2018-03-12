const fs = require('fs');
const path = require('path');
const Validator = require('jsonschema').Validator;

class ThronetekiPackValidator {
    constructor() {
        this.packSchema = require('../pack.schema.json');
        this.validator = this.createValidator();
    }

    createValidator() {
        let cardSchema = require('../card.schema.json');
        let validator = new Validator();

        validator.addSchema(this.packSchema, '/pack.schema.json');
        validator.addSchema(cardSchema, '/card.schema.json')

        return validator;
    }

    validate(pack) {
        let results = this.validator.validate(pack, this.packSchema, { nestedErrors: true });
        return {
            errors: results.errors.map(error => this.addCardInfoToError(pack, error)),
            valid: results.valid
        }
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
