exports.up = function(knex) {
    return knex.schema.table('tasks', function(table) {
        table.integer('category_id').unsigned();
        table.foreign('category_id').references('id').inTable('task_categories');
    });
};

exports.down = function(knex) {
    return knex.schema.table('tasks', function(table) {
        table.dropColumn('category_id');
    });
};
