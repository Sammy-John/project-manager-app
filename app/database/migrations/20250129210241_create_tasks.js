exports.up = function(knex) {
    return knex.schema.createTable('tasks', (table) => {
      table.increments('id').primary();
      table.integer('project_id').unsigned().references('id').inTable('projects').onDelete('CASCADE');
      table.string('title').notNullable();
      table.text('description');
      table.enu('status', ['To-Do', 'In Progress', 'Review', 'Completed']).defaultTo('To-Do');
      table.date('deadline');
      table.enu('priority', ['Low', 'Medium', 'High', 'Urgent']);
      table.integer('estimated_time'); // Estimated time in hours
      table.integer('time_spent').defaultTo(0); // Actual time spent in minutes
      table.integer('depends_on').unsigned().references('id').inTable('tasks').onDelete('SET NULL'); // Task dependencies
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('tasks');
  };
  