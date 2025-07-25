/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
    pgm.createTable("issues", {
        id: "id",
        title: { type: "varchar(255)", notNull: true, unique: true },
        description: { type: "text", notNull: true },
        contra_description: { type: "text", notNull: false },
        pro_description: { type: "text", notNull: false },
        image: { type: "varchar(255)", notNull: false },
        created_at: {
            type: "timestamp",
            default: pgm.func("current_timestamp"),
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable("issues");
};
