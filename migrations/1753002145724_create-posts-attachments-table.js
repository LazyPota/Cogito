exports.up = (pgm) => {
    pgm.createTable("post_attachments", {
        id: "id",
        post_id: {
            type: "integer",
            notNull: true,
            references: '"posts"',
            onDelete: "cascade",
        },
        url: { type: "text", notNull: true },
        type: { type: "varchar(10)", notNull: true, default: "'image'" },
        created_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable("post_attachments");
};
