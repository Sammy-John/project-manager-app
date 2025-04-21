exports.up = function(knex) {
    return knex.schema.createTable('invoice_items', (table) => {
      table.increments('id').primary();
      table.integer('invoice_id').unsigned().references('id').inTable('invoices').onDelete('CASCADE');
      table.integer('task_id').unsigned().references('id').inTable('tasks').onDelete('SET NULL');
      table.text('description').notNullable();
      table.integer('quantity').defaultTo(1);
      table.decimal('rate', 10, 2).notNullable();
      table.decimal('total', 10, 2).notNullable(); // ❌ No more computed column
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('invoice_items');
  };
  