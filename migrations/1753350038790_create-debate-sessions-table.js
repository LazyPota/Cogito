/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
    pgm.createTable("debate_sessions", {
        id: "id",
        issue_id: {
            type: "integer",
            notNull: true,
            references: '"issues"',
            onDelete: "cascade",
        },
        pro_user_id: {
            type: "integer",
            references: '"users"',
            onDelete: "set null",
        },
        contra_user_id: {
            type: "integer",
            references: '"users"',
            onDelete: "set null",
        },
        is_vs_ai: {
            type: "boolean",
            notNull: true,
            default: true,
        },
        session_name: {
            type: "varchar(100)",
            notNull: true,
        },
        created_at: {
            type: "timestamp",
            default: pgm.func("current_timestamp"),
        },
        updated_at: {
            type: "timestamp",
            default: pgm.func("current_timestamp"),
        },
    });

    pgm.addConstraint(
        "debate_sessions",
        "check_either_pro_or_contra_present",
        `CHECK (
      (is_vs_ai = true AND (pro_user_id IS NOT NULL OR contra_user_id IS NOT NULL)) OR
      (is_vs_ai = false AND pro_user_id IS NOT NULL AND contra_user_id IS NOT NULL)
    )`
    );
};

exports.down = (pgm) => {
    pgm.dropTable("debate_sessions");
};
