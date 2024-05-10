# AgileAce - Server

This is the server-side application for AgileAce, a planning poker-like application.

## Technologies Used

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Socket.IO](https://socket.io/)

## Getting Started

1. Install the dependencies:

```sh
npm install
```

2. Build the project:

```sh
npm run build
```

3. Start the server:

```sh
npm run start
```

## Project Structure

- `src/server.ts`: This is the main server file.
- `public/index.html`: This is the public HTML file served by the server.

## Dependencies

- `express`: A fast, unopinionated, minimalist web framework for Node.js.
- `socket.io`: Enables real-time bidirectional event-based communication.

## Dev Dependencies

- `@types/express`: TypeScript definitions for Express.js.
- `@types/node`: TypeScript definitions for Node.js.
- `@types/socket.io`: TypeScript definitions for Socket.IO.
- `ts-node`: TypeScript execution and REPL for Node.js, with source map support.
- `typescript`: A language for application-scale JavaScript development.

## Scripts

- `build`: Compiles the TypeScript files into JavaScript.
- `start`: Starts the server using ts-node.

## License

This project is licensed under the ISC license.