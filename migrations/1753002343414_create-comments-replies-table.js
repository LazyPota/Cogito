exports.up = (pgm) => {
    pgm.createTable("comment_replies", {
        id: "id",
        comment_id: {
            type: "integer",
            notNull: true,
            references: '"post_comments"',
            onDelete: "cascade",
        },
        user_id: {
            type: "integer",
            notNull: true,
            references: '"users"',
            onDelete: "cascade",
        },
        content: { type: "text", notNull: true },
        is_deleted: { type: "boolean", notNull: true, default: false },
        created_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable("comment_replies");
};
