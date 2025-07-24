exports.up = (pgm) => {
    pgm.createTable("chat_sessions", {
        id: {
            type: "serial",
            primaryKey: true,
        },
        user_id: {
            type: "integer",
            notNull: true,
        },
        created_at: {
            type: "timestamp",
            default: pgm.func("current_timestamp"),
        },
    });

    pgm.addConstraint("chat_sessions", "fk_chat_sessions_user_id", {
        foreignKeys: {
            columns: "user_id",
            references: "users(id)",
            onDelete: "CASCADE",
        },
    });

    pgm.createTable("chats", {
        id: {
            type: "serial",
            primaryKey: true,
        },
        session_id: {
            type: "integer",
            notNull: true,
            references: "chat_sessions(id)",
            onDelete: "CASCADE",
        },
        role: {
            type: "text",
            notNull: true,
        },
        content: {
            type: "text",
            notNull: true,
        },
        created_at: {
            type: "timestamp",
            default: pgm.func("current_timestamp"),
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable("chats");
    pgm.dropTable("chat_sessions");
};
