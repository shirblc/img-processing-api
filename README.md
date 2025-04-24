# Image Processing API

[![CircleCI](https://circleci.com/gh/shirblc/img-processing-api.svg?style=shield)](https://circleci.com/gh/shirblc/img-processing-api.svg)
[![codecov](https://codecov.io/gh/shirblc/img-processing-api/graph/badge.svg)](https://codecov.io/gh/shirblc/img-processing-api)

## Version

Version 1.

## Requirements

- Node.js

## Installation and Usage

### Developers

1. Download or clone the repo.
2. cd into the project directory.
3. Run `npm install` to install dependencies.
4. Run `npm run start` to start the local server.
5. The server should now be running at `localhost:3000`.

### Available Endpoints

#### GET /images

**Description:** Returns a resized image, based on the given image name, height and width.

**Query Parameters:**

- name (string) - The name of the image to resize. The full size image with the given name needs to be in the `src/assets/full` folder before making the request.
- height (number) - Optional. The height of the resized output image.
- width (number) - Optional. The width of the resized output image.

**Response:** The endpoint returns the resized image file with the given sizes.

**Potential Response Codes:**

- 200 - A successful fetch. The image is included in the response.
- 400 - Returned when there's no image name in the query parameters.
- 404 - Returned when the full size image doesn't exist in the source folder.
- 500 - Returned when any other error occurs.

## Contents

### Routes

- **images** - Contains images-related routes.

### Utilities

- **logger** - Includes a configured Winston logger and logging middleware for Express.
- **validation** - Includes a middleware for validating the query parameters for the GET /images endpoint.

## Dependencies

### Main Dependencies

1. **Express** - This project uses Express as the main framework for the server. For more information, check the [Express website](https://expressjs.com).
2. **Sharp** - This project uses Sharp for resizing the images to the size given by the user. For more information, check the [Sharp docs](https://sharp.pixelplumbing.com).
3. **Winston** - This project uses Winston for logging. The primary logger used throughout the app is a Winston logger, which allows creating a production logger. For more information, check the [Winston repository](https://github.com/winstonjs/winston).
4. **TypeScript** - The project is written entirely in TypeScript. For more information, check the [TypeScript website](https://www.typescriptlang.org).

### Linting Dependencies

1. **Prettier** - This project uses prettier for code formatting. For more information, check the [Prettier website](https://prettier.io).
2. **ESLint** - This project uses ESLint for linting. For more information, check the [ESLint website](https://eslint.org). Included packages:

   - **eslint**
   - **eslint-config-prettier** - prettier configuration to ensure ESLint and prettier don't conflict.
   - **eslint-plugin-jasmine** - for linting Jasmine tests
   - **typescript-eslint** - TypeScript configuration and plugins for ESLint.

### Testing Dependencies

This project's tests are run using Jasmine and Supertest. Thus, testing requires several packages:

1. **Jasmine** - An open-source behaviour-driven testing framework. For more information, check Jasmine's [official site](https://jasmine.github.io). Included packages:

   - **jasmine**
   - **jasmine-spec-reporter**
   - **@types/jasmine** - A typed version, required in order to write TypeScript tests.

2. **Supertest** - An open-source HTTP test agent for easier API testing. Used to test the Express server's responses. For more information, check the [Supertest repository](https://github.com/ladjs/supertest).

   - **supertest**
   - **@types/supertest**

3. **nyc** - The command line interface for Istanbul - an instrumenter for JavaScript. Is used to calculate code coverage from tests. For more information, check the [nyc repository](https://github.com/istanbuljs/nyc).

   - **nyc**
   - **source-map-support** - allows nyc to map the compiled tests and code back to the source code to calculate the coverage of the TypeScript files.
   - **@istanbuljs/nyc-config-typescript** - default nyc config for TypeScript projects.

4. **image-size** - a lightweight utility for calculating the size of images. Is used in unit tests for testing that the API correctly resizes the response. For more information, check the [image-size repository](https://github.com/image-size/image-size).

## Testing

### Writing Tests

Tests are written in TypeScript and are placed in the `test` directory. Test files' names follow this format `<tested file's name>.spec.ts`, and the testing folder's structure mirrors the source folder's structure for easier access.

### Running Tests

Running tests is done through the dedicated npm command, which you can run using `npm run test`. The command runs three different commands:

1. `test:compile` - Compiles the tests and source code. Since Jasmine doesn't support TypeScript, the original TypeScript source code needs to be compiled to JavaScript before tests can run.
2. `test:setup` - Runs a small helper script for copying the default images from the source folder to the spec folder, where tests run. This ensures we can rely on these default images when writing tests.
3. `jasmine` - The command that actually runs Jasmine on the compiled JavaScript.

You can also run tests with coverage using `npm run coverage`.

## Known Issues

There are no current issues at the time.
