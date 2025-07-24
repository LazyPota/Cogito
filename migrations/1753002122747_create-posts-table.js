exports.up = (pgm) => {
    pgm.createTable("posts", {
        id: "id",
        user_id: {
            type: "integer",
            notNull: true,
            references: '"users"',
            onDelete: "cascade",
        },
        content: { type: "text", notNull: true },
        share_count: { type: "integer", notNull: true, default: 0 },
        created_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },
        updated_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable("posts");
};
