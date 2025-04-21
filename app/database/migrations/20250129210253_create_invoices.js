exports.up = function(knex) {
    return knex.schema.createTable('invoices', (table) => {
      table.increments('id').primary();
      table.integer('project_id').unsigned().references('id').inTable('projects').onDelete('SET NULL');
      table.integer('client_id').unsigned().references('id').inTable('clients').onDelete('SET NULL');
      table.decimal('amount', 10, 2).notNullable();
      table.string('currency').defaultTo('USD');
      table.enu('status', ['Pending', 'Paid', 'Overdue']).defaultTo('Pending');
      table.date('due_date').notNullable();
      table.string('invoice_number').unique().notNullable();
      table.enu('payment_method', ['Bank Transfer', 'PayPal', 'Stripe']);
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('invoices');
  };
  