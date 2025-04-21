exports.up = function(knex) {
    return knex.schema.createTable('activity_log', (table) => {
      table.increments('id').primary();
      table.integer('project_id').unsigned().references('id').inTable('projects').onDelete('CASCADE');
      table.integer('task_id').unsigned().references('id').inTable('tasks').onDelete('CASCADE');
      table.integer('invoice_id').unsigned().references('id').inTable('invoices').onDelete('CASCADE');
      table.text('description').notNullable(); // Example: "Task moved to In Progress"
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('activity_log');
  };
  