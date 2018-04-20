const Validator = require('jsonschema').Validator;

class BasicValidator {
    constructor(schema) {
        this.schema = schema;
        this.validator = new Validator();
    }

    validate(data) {
        let results = this.validator.validate(data, this.schema, { nestedErrors: true });
        return {
            errors: results.errors.map(error => error.toString()),
            valid: results.valid
        };
    }
}

module.exports = BasicValidator;
