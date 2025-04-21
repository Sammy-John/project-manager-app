exports.up = function(knex) {
    return knex.schema.createTable('project_categories', function(table) {
        table.increments('id').primary();
        table.string('name').unique().notNullable();
        table.text('description'); // Explanation of category
    }).then(() => {
        // Insert predefined categories
        return knex('project_categories').insert([
            { name: 'Web Development', description: 'Websites, Web Apps, CMS, Landing Pages.' },
            { name: 'Mobile App Development', description: 'Android, iOS, React Native, PWA.' },
            { name: 'Desktop Application Development', description: 'Windows, Mac, Linux Apps.' },
            { name: 'Game Development', description: '2D/3D Games, Unity, Godot, Unreal Engine.' },
            { name: 'API & Backend Development', description: 'REST APIs, GraphQL, Databases.' },
            { name: 'DevOps & Cloud Infrastructure', description: 'AWS, Azure, Docker, Kubernetes.' },
            { name: 'AI & Machine Learning', description: 'AI Models, NLP, Chatbots, Analytics.' },
            { name: 'Data Science & Analytics', description: 'Business Intelligence Dashboards.' },
            { name: 'Cybersecurity & IT Security', description: 'Security Audits, Pen Testing.' },
            { name: 'Technical Documentation & Writing', description: 'Guides, API Docs, Reports.' },
            { name: 'UI/UX Design & Prototyping', description: 'Wireframing, Figma, Adobe XD.' },
            { name: 'Automation & Scripting', description: 'Task Automation, IT Scripts.' },
            { name: 'Templates & Reusable Components', description: 'UI Component Libraries.' },
            { name: 'Consulting & Training', description: 'Code Reviews, Software Consultation.' },
            { name: 'Other', description: 'Any project that doesn’t fit the above categories.' }
        ]);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('project_categories');
};
