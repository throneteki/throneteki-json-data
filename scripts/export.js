const path = require('path');
const ThronetekiToThronesDbConverter = require('../src/ThronetekiToThronesDbConverter.js');

let exportDir = path.join(process.cwd(), process.argv[2]);
let converter = new ThronetekiToThronesDbConverter(exportDir);
converter.convert();

console.log('Updated thronesdb-json-data');
