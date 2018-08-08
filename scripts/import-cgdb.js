const path = require('path');
const CardgameDbToThronetekiConverter = require('../src/CardgameDbToThronetekiConverter');

let converter = new CardgameDbToThronetekiConverter();

converter.convert({
    pathToPackFile: path.join(process.cwd(), process.argv[2]),
    cyclePrefix: process.argv[3]
});
