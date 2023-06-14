# Auth.js Knex.js Adapter

An adapter for Auth.js/NextAuth.js to allow you to connect to any database
service via Knex.js.

<p align="center">
  <img src="./logo.png" />
</p>

## Installation

Install the package as a dependency in your project.

```sh
npm install authjs-knexjs-adapter
```

### Next.js

Import it into `pages/api/auth/[...nextauth].ts`, give it a Knex.js database
connection, and set it as the `adapter` in your `NextAuth()` configuration.

```javascript
import { KnexAdapter } from "authjs-knexjs-adapter";
import knex from "knex";
import NextAuth from "next-auth";

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

### SvelteKit

Import it into `src/hooks.server.js`, give it a Knex.js database connection, and
set it as the `adapter` in your `SvelteKitAuth` configuration.

```javascript
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } from '$env/static/private';
import { KnexAdapter } from 'authjs-knexjs-adapter';
import { SvelteKitAuth } from '@auth/sveltekit';
import knex from "knex";

const db = knex({
	client: 'mysql2',
	connection: {
		host: DB_HOST,
		port: parseInt(DB_PORT ?? '3306', 10),
		user: DB_USER,
		password: DB_PASSWORD,
		database: DB_DATABASE
	}
});

export const handle = SvelteKitAuth({
	trustHost: true,
	adapter: KnexAdapter(db),
	providers: [ /* your providers */ ],
});
```

## Database Schema

Auth.js requires a specific database schema. There are two options provided here
to create this schema:

- [A Knex.js migration file](./migrations/migration.js)
- [A schema dump SQL file](./migrations/migration.sql)

Use either option or create the database schema some other way.

Note: These files are configured for MariaDB. They may work out-of-the-box with
other database engines, or you may need to modify them according to your
application.

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
