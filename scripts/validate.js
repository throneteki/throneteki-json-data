const fs = require('fs');
const path = require('path');
const ThronetekiPackValidator = require('../src/ThronetekiPackValidator.js');
const ThronetekiRestrictedListValidator = require('../src/ThronetekiRestrictedListValidator.js');

let validator = new ThronetekiPackValidator();
let directory = path.join(__dirname, '../packs');
let packFiles = fs.readdirSync(directory).filter(file => file.endsWith('.json'));

let valid = true;

for(let file of packFiles) {
    let pack = require(path.join(directory, file));
    let result = validator.validate(pack);
    if(!result.valid) {
        console.error(`Errors in ${file}:\n${result.errors.join('\n')}`);
        valid = false;
    }
}

let restrictedListValidator = new ThronetekiRestrictedListValidator();
let restrictedList = require('../restricted-list.json');
let restrictedListResult = restrictedListValidator.validate(restrictedList);

if(!restrictedListResult.valid) {
    console.error(`Errors in restricted-list.json:\n${restrictedListResult.errors.join('\n')}`);
    valid = false;
}

if(valid) {
    console.log('Validation complete, no errors.');
} else {
    console.log('Validation complete, please correct the above errors.');
    process.exit(1);
}
