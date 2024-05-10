# AgileAce

AgileAce is a planning poker-like application. This repository is divided into two main components: the Client and the Server.

## Client

The client-side of AgileAce is built using the following technologies:

- [React.js](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

You can find the client-side code in the [Client](Client/) directory.

## Server

The server-side of AgileAce is built using the following technologies:

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Socket.IO](https://socket.io/)

You can find the server-side code in the [Server](Server/) directory.

## Notes

- This project is setup to make use of [Conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) which is validate with a husky hook
- Pull requests are also following the Conventional commit structure for the titles which is validate by (gh_pr_title_validation)[https://github.com/Ruandv/gh_pr_title_validation] action with the regex value of `^(fix|feat|chore|build\(deps\)|chore\(deps-dev\))(!)?:\ .+`