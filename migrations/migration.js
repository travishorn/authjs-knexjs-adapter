export const up = (knex) => {
  return knex.schema
    .createTable("User", (table) => {
      table.uuid("id").defaultTo(knex.raw("(UUID())"));
      table.text("name");
      table.text("email").unique();
      table.timestamp("emailVerified");
      table.text("image");

      table.primary("id");
    })
    .createTable("Session", (table) => {
      table.uuid("id").defaultTo(knex.raw("(UUID())"));
      table.timestamp("expires");
      table.text("sessionToken").notNullable().unique();
      table.uuid("userId");

      table.primary("id");

      table.foreign("userId").references("id").on("User");
    })
    .createTable("Account", (table) => {
      table.uuid("id").defaultTo(knex.raw("(UUID())"));
      table.uuid("userId");
      table.text("type").notNullable();
      table.text("provider").notNullable();
      table.text("providerAccountId").notNullable();
      table.text("refresh_token");
      table.text("access_token");
      table.bigInteger("expires_at");
      table.text("token_type");
      table.text("scope");
      table.text("id_token");
      table.text("session_state");

      table.primary("id");

      table.unique(["provider", "providerAccountId"]);

      table.foreign("userId").references("id").on("User");
    })
    .createTable("VerificationToken", (table) => {
      table.text("identifier");
      table.string("token", 255);
      table.timestamp("expires").notNullable();

      table.primary("token");

      table.unique(["token", "identifier"]);
    });
};

export const down = (knex) => {
  return knex.schema
    .dropTable("VerificationToken")
    .dropTable("Account")
    .dropTable("Session")
    .dropTable("User");
};
