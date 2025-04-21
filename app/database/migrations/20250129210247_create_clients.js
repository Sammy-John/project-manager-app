exports.up = function(knex) {
    return knex.schema.createTable('clients', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').unique();
      table.string('company');
      table.string('phone');
      table.text('address');
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('clients');
  };
  