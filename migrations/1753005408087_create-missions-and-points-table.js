exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('missions', {
    id: 'id',
    type: { type: 'varchar(20)', notNull: true }, // daily, weekly, once
    title: { type: 'text', notNull: true },
    description: { type: 'text' },
    action: { type: 'varchar(50)', notNull: true }, // like_post, comment_post, register, post, chatbot
    target: { type: 'integer', notNull: true },
    point: { type: 'integer', notNull: true },
  });

  pgm.createTable('user_missions', {
    id: 'id',
    user_id: { type: 'integer', references: 'users(id)', onDelete: 'cascade' },
    mission_id: { type: 'integer', references: 'missions(id)', onDelete: 'cascade' },
    progress: { type: 'integer', default: 0 },
    completed: { type: 'boolean', default: false },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });

  pgm.createTable('point_histories', {
    id: 'id',
    user_id: { type: 'integer', references: 'users(id)', onDelete: 'cascade' },
    mission_id: { type: 'integer', references: 'missions(id)' },
    points: { type: 'integer', notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });
};

exports.down = pgm => {
  pgm.dropTable('point_histories');
  pgm.dropTable('user_missions');
  pgm.dropTable('missions');
};
