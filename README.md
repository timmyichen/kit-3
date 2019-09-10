# Keep In Touch

Keep in Touch is a simple social network for sharing contact information.

# Motivation

My college friends and I enjoyed writing each other letters and sending each
other postcards when we went abroad, but being college students, we moved
around every year. Having to ask each other whether they still lived at address
X was tiring, and ruined any potential mail-based surprises. We built KIT as a
way to make life easier for both sender and receiver. Sender no longer has to
ask everyone for their updated contact info (called "Deets" on KIT), and
receivers no longer have to individually tell all their friends about their
new deets.

# Codebase

The entire stack is TypeScript. The following technologies are used...

on the client:

- React
- Next.js
- GraphQL Apollo
- Semantic UI React for UI components

on the server:

- Express
- PostgresQL + Sequelize
- GraphQL for querying / mutations

In addition, we use [graphql-codegen](https://github.com/dotansimha/graphql-code-generator)
to generate schemas and React hooks for GraphQL mutations and queries.

# Dev Setup

A development environment for this requires some setup, as it uses Google Cloud
Storage for profile images. Docker will set up a local postgres database to
use.

Production keys are the same format prefixed with `PROD_`.

Your Google Cloud Storage auth json file should go under `config/gcs-owner.json`.

```
docker-compose up
```

On first run, also run all existing migrations on the database by running:

```
docker-compose exec app npm run db:migrate
```

OR run the seed script (this will also migrate):

```
docker-compose exec app npm run dev:seed
```

You can also connect to the local database by running:

```
docker-compose exec db psql -U postgres -d postgres
```

Both of the previous commands require that `docker-compose up` be running.

# Testing

To run tests, run:

```
docker-compose exec app npm run jest:watch
```

To run a test for a particular file, run:

```
docker-compose exec app npm run jest:watch path/to/file
```

To turn watchmode off, just remove `:watch`

# Deployment

Assuming you're already set up with Google Apps Engine, deploying is as simple as:

`npm run prod:db:migrate` to run migrations on the production server
`npm run next:build` to build a production next app
`gcloud app deploy` to deploy to GAE.

# Misc Notes

to get aliases working on vscode see: https://github.com/Microsoft/vscode/issues/50329
