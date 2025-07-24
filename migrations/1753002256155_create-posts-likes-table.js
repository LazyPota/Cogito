exports.up = (pgm) => {
    pgm.createTable("post_likes", {
        id: "id",
        post_id: {
            type: "integer",
            notNull: true,
            references: '"posts"',
            onDelete: "cascade",
        },
        user_id: {
            type: "integer",
            notNull: true,
            references: '"users"',
            onDelete: "cascade",
        },
        created_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },
    });

    pgm.addConstraint("post_likes", "unique_post_like", {
        unique: ["post_id", "user_id"],
    });
};

exports.down = (pgm) => {
    pgm.dropTable("post_likes");
};
