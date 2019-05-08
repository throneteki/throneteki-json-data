const Validator = require('jsonschema').Validator;

class ThronetekiCyclesValidator {
    constructor({ packFiles }) {
        this.cyclesSchema = require('../cycles.schema.json');
        this.validator = this.createValidator();
        this.packFiles = packFiles || [];
    }

    createValidator() {
        let validator = new Validator();
        validator.addSchema(this.cyclesSchema, '/cycles.schema.json');
        return validator;
    }

    validate(cycles) {
        let results = this.validator.validate(cycles, this.cyclesSchema, { nestedErrors: true });
        let manualErrors = this.getErrorsForCycles(cycles);
        return {
            errors: manualErrors.concat(results.errors.map(error => this.addCycleInfoToError(cycles, error))),
            valid: results.valid && manualErrors.length === 0
        };
    }

    getErrorsForCycles(cycles) {
        let errors = [];
        let referencedPacks = [];
        let uniqueCycles = new Set();

        for(let cycle of cycles) {
            if(uniqueCycles.has(cycle.id)) {
                errors.push(`Cycle ${cycle.name} (${cycle.id}) must have a unique ID`);
            }

            uniqueCycles.add(cycle.id);

            for(let pack of cycle.packs) {
                let pathFileName = `${pack}.json`;
                if(!this.packFiles.includes(pathFileName)) {
                    errors.push(`Cycle ${cycle.name} (${cycle.id}) references pack ${pack} but there is no JSON file`);
                }
                referencedPacks.push(pathFileName);
            }
        }

        let unreferencedPacks = this.packFiles.filter(packFile => !referencedPacks.includes(packFile));

        for(let packFile of unreferencedPacks) {
            errors.push(`Pack file ${packFile} is not referenced in a cycle`);
        }

        return errors;
    }

    addCycleInfoToError(cycles, error) {
        let message = error.toString();
        let match = message.match(/instance\[(\d+)\]/);
        if(!match) {
            return message;
        }

        let cycleIndex = parseInt(match[1]);
        let cycle = cycles[cycleIndex];

        return message.replace(match[0], `'${cycle.name} (${cycle.id})'`);
    }
}

module.exports = ThronetekiCyclesValidator;
