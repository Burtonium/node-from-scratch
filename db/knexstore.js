'use strict';

var knex = require('./knex.js');
var assert = require('assert');

class KnexStore {
    constructor(table) {
        assert(table, 'Table name required.');
        this.table = table;
    }

    findAll() {
        return knex(this.table).select();
    }

    findWhere(criterion) {
        return knex(this.table).where(criterion);
    }

    findOne(criterion) {
        if (!criterion) {
            return this.findAll().first();
        }
        return knex(this.table).where(criterion).first();
    }
    
    deleteWhere(criterion) {
        return knex(this.table).where(criterion).del();
    }

    insert(object) {
        return knex(this.table).insert(object).returning('*');
    }

    update(object) {
        return knex(this.table).where({
            id: object.id
        }).update(object).returning('*');
    }
}

module.exports = function(table){
    return new KnexStore(table);
};
