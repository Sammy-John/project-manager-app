exports.up = function(knex) {
    return knex.schema.createTable('task_categories', function(table) {
        table.increments('id').primary();
        table.string('name').unique().notNullable();
        table.text('description'); // Explanation of category
    }).then(() => {
        // Insert predefined task categories
        return knex('task_categories').insert([
            { name: 'Development', description: 'Writing code, debugging, testing, refactoring.' },
            { name: 'Design & UI/UX', description: 'Wireframing, prototyping, UI/UX design.' },
            { name: 'Research & Planning', description: 'Requirements gathering, architecture.' },
            { name: 'Deployment & Maintenance', description: 'Hosting, updates, bug fixes.' },
            { name: 'Client & Business Work', description: 'Meetings, reports, documentation.' }
        ]);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('task_categories');
};
