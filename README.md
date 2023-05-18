# Auth.js Knex.js Adapter

An adapter for Auth.js/NextAuth.js to allow you to connect to any database
service via Knex.js.

## Installation

Install the package as a dependency in your project.

```sh
npm install authjs-knexjs-adapter
```

Import it into `pages/api/auth/[...nextauth].ts`, give it a Knex.js database
connection, and set it as the `adapter` in your `NextAuth()` configuration.

```javascript
import NextAuth from "next-auth";
import knex from "knex";
import { KnexAdapter } from "authjs-knexjs-adapter";

const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? "3306", 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
});

export default NextAuth({
  adapter: KnexAdapter(db),
  providers: [ /* your providers */ ],
});
```

## Database Schema

Auth.js requires a specific database schema. Use the following Knex.js
migration to create it. Note: This migration is configured for MariaDB. It may
work out-of-the-box with other database engines, or you may need to modify it
according to your application.

```javascript
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
```

## License

The MIT License

Copyright 2023 Travis Horn

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the “Software”), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
