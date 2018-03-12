class ThronesDbToThronetekiConverter {
    convert(packs) {
        return packs.map(pack => this.convertPack(pack));
    }

    convertPack(pack) {
        return {
            cgdbId: pack.cgdb_id,
            code: pack.code,
            name: pack.name,
            releaseDate: pack.date_release,
            cards: pack.cards.map(card => this.convertCard(card))
        };
    }

    convertCard(card) {
        let properties = { };
        properties.code = card.code;
        properties.type = card.type_code;
        properties.name = card.name;

        if(['attachment', 'character', 'location'].includes(card.type_code)) {
            properties.unique = card.is_unique;
        }

        properties.faction = card.faction_code;

        if(card.faction_code !== 'neutral') {
            properties.loyal = card.is_loyal;
        }

        properties.cost = card.cost;

        if(card.type_code === 'character') {
            properties.icons = {
                military: card.is_military,
                intrigue: card.is_intrigue,
                power: card.is_power
            };
            properties.strength = card.strength;
        } else if(card.type_code === 'plot') {
            properties.plotStats = {
                income: card.income,
                initiative: card.initiative,
                claim: card.claim,
                reserve: card.reserve
            };
        }

        properties.traits = this.parseTraits(card.traits);
        properties.text = card.text;
        properties.deckLimit = card.deck_limit;

        return properties;
    }

    parseTraits(traits) {
        return traits.split('.').map(trait => trait.trim()).filter(trait => trait !== '');
    }
}

module.exports = ThronesDbToThronetekiConverter;
