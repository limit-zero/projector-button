# Projector Power Button

This project requires [Yarn](https://yarnpkg.com/en/docs/install) and [NodeJS 10](https://nodejs.org/en/download/).

## Installation
- Clone this repository
- From the project root, install dependencies via `yarn install`
- When developing, run `yarn dev`
- When serving in production, run `yarn serve`
- The service is now available on `http://localhost:4999` or whatever port you configure

## Setup
You must specify your projector's `USERNAME` and `PASSWORD` values using environment variables. The easiest way to set these is to create a `.env` file in the root of the project:

```
USERNAME=usernamehere
PASSWORD=passwordhere
```

You can also change the default port using the `PORT` environment variable.

## Usage
Once the service is running, you can power on a projector by visiting `http://localhost:/[projector-host-name]`.
For example: `http://localhost:4999/your-projector.your-domain.com`
