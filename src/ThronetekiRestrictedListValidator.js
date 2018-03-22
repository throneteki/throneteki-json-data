const Validator = require('jsonschema').Validator;

class ThronetekiRestrictedListValidator {
    constructor() {
        this.schema = require('../restricted-list.schema.json');
        this.validator = new Validator();
    }

    validate(restrictedList) {
        let results = this.validator.validate(restrictedList, this.schema, { nestedErrors: true });
        return {
            errors: results.errors.map(error => error.toString()),
            valid: results.valid
        };
    }
}

module.exports = ThronetekiRestrictedListValidator;
