const fs = require('fs');
const path = require('path');
const ThronesDbCardData = require('../src/ThronesDbCardData.js');
const ThronesDbToThronetekiConverter = require('../src/ThronesDbToThronetekiConverter.js');

let importDir = path.join(process.cwd(), process.argv[2]);
let thronesDbData = new ThronesDbCardData(importDir);
let converter = new ThronesDbToThronetekiConverter();
let convertedPacks = converter.convert(thronesDbData.packs);

let packDir = path.join(process.cwd(), 'packs');
if(!fs.existsSync(packDir)) {
    fs.mkdirSync(packDir);
}

for(let pack of convertedPacks) {
    fs.writeFileSync(path.join(packDir, pack.code + '.json'), JSON.stringify(pack, null, 4));
}
