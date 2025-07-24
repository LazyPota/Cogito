/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
    pgm.createTable("debates", {
        id: "id",
        session_id: {
            type: "integer",
            notNull: true,
            references: '"debate_sessions"',
            onDelete: "cascade",
        },
        sender_user_id: {
            type: "integer",
            references: '"users"',
            onDelete: "set null",
        },
        sender_role: {
            type: "varchar(10)",
            notNull: true,
            check: "sender_role IN ('pro', 'contra', 'ai')",
        },
        message_original: {
            type: "text",
            notNull: true,
        },
        message_translated: {
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
    pgm.dropTable("debates");
};
