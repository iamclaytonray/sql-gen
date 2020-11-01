# Code Gen

Generates TypeScript & GraphQL typings from a valid MySQL schema.

### Getting Started

Clone the repo

```sh
git clone git@github.com:iamclaytonray/sql-gen.git
```

Install deps

```sh
yarn
```

Copy the `.env.example` into `.env`. Make sure to update the DB_URL var with a valid MySQL URL.

```sh
cp .env.example .env
```

Generate

```sh
yarn nps gen
```
