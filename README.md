# Home Library Service

> Home Library Service! `Users` can create, read, update, delete data about `Artists`, `Tracks` and `Albums`, add them to `Favorites` in their own Home Library!

> Implemented PostgreSQL database as source of data for your application and Prisma to communicate with your database.

> Implement Authentication and Authorization with JWT (Access and Refresh tokens)

---

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/Wolf-Den1994/nodejs2022Q2-service
```

## Go to project root directory

```
cd nodejs2022Q2-service
```

## Installing NPM modules

```
npm install
```

## Change name file

```
.env.copy -> .env
```

## Running application

```
npm run docker
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

---

## Docker scan

For scan service

```
npm run docker:scan:app
```

For scan db

```
npm run docker:scan:db
```

---

## Testing

After application running open new terminal and enter:

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

---

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging

---

## Used technologies:
- TypeScript
- docker
- nestjs
- swagger
- class-validator
- uuid
- dotenv
- jest
- eslint
- prettier
- node.js version: 16 LTS

---

## Authors:
 *[Denis Karazan](https://github.com/Wolf-Den1994)*