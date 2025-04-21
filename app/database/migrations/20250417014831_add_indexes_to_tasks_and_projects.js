exports.up = function(knex) {
    return knex.schema
      .table('tasks', table => {
        table.index('project_id');
        table.index('category_id');
        table.index('status');
        table.index('priority');
        table.index('deadline');
      })
      .table('projects', table => {
        table.index('category_id');
      });
  };
  
  exports.down = function(knex) {
    return knex.schema
      .table('tasks', table => {
        table.dropIndex('project_id');
        table.dropIndex('category_id');
        table.dropIndex('status');
        table.dropIndex('priority');
        table.dropIndex('deadline');
      })
      .table('projects', table => {
        table.dropIndex('category_id');
      });
  };
  