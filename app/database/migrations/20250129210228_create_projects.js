exports.up = function(knex) {
    return knex.schema.createTable('projects', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.text('description');
      table.integer('client_id').unsigned().references('id').inTable('clients').onDelete('SET NULL');
      table.date('deadline');
      table.enu('priority', ['Low', 'Medium', 'High', 'Urgent']);
      table.enu('status', ['Active', 'Completed', 'Archived']);
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('projects');
  };
  