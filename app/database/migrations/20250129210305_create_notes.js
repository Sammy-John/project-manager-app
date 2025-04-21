exports.up = function(knex) {
    return knex.schema.createTable('notes', (table) => {
      table.increments('id').primary();
      table.integer('project_id').unsigned().references('id').inTable('projects').onDelete('CASCADE');
      table.text('content').notNullable();
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('notes');
  };
  