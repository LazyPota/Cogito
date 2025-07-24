exports.up = (pgm) => {
    pgm.createTable("users", {
        id: "id",
        username: { type: "varchar(100)", notNull: true, unique: true },
        email: { type: "varchar(255)", notNull: true, unique: true },
        password: { type: "varchar(255)", notNull: true },
        points: { type: "integer", notNull: true, default: 0 },
        created_at: {
            type: "timestamp",
            default: pgm.func("current_timestamp"),
        },
        updated_at: {
            type: "timestamp",
            default: pgm.func("current_timestamp"),
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable("users");
};
