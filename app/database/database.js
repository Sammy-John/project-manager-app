const path = require('path');
const knex = require('knex');
const config = require('../../knexfile');

const environment = process.env.NODE_ENV || 'development';

// Modify the filename to be an absolute path
if (config[environment].client === 'sqlite3') {
  config[environment].connection.filename = path.resolve(__dirname, '../database/freelance_manager.sqlite');
}

const db = knex(config[environment]);
module.exports = db;
