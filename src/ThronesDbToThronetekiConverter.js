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
        properties.octgnId = card.octgn_id;
        properties.quantity = card.quantity;

        if(['attachment', 'character', 'location'].includes(card.type_code)) {
            properties.unique = card.is_unique;
        }

        properties.faction = card.faction_code;

        if(card.faction_code !== 'neutral') {
            properties.loyal = card.is_loyal;
        }

        if(['X', '-'].includes(card.cost)) {
            properties.cost = card.cost;
        } else if(card.cost) {
            properties.cost = parseInt(card.cost);
        }

        if(card.type_code === 'character') {
            properties.icons = {
                military: card.is_military,
                intrigue: card.is_intrigue,
                power: card.is_power
            };
            properties.strength = this.translateXValue(card.strength);
        } else if(card.type_code === 'plot') {
            properties.plotStats = {
                income: this.translateXValue(card.income),
                initiative: this.translateXValue(card.initiative),
                claim: this.translateXValue(card.claim),
                reserve: this.translateXValue(card.reserve)
            };
        }

        properties.traits = this.parseTraits(card.traits);
        properties.text = card.text;

        if(card.designer) {
            properties.designer = card.designer;
        }

        if(card.flavor && card.flavor.length > 0) {
            properties.flavor = card.flavor;
        }

        properties.deckLimit = card.deck_limit;

        if(card.illustrator) {
            properties.illustrator = card.illustrator;
        }

        return properties;
    }

    translateXValue(value) {
        if(value === null) {
            return 'X';
        }

        return value;
    }

    parseTraits(traits) {
        return traits.split('.').map(trait => trait.trim()).filter(trait => trait !== '');
    }
}

module.exports = ThronesDbToThronetekiConverter;
