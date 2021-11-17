# QBHub Server

The QBHub Server provides the REST API and backend for QBHub. The questions
are from a modified [QuizDB](https://www.quizdb.org/about) dump.

## Prerequisites

- `node`
- `yarn`
- `PostgreSQL`

## Installation

1. Install the necessary prerequisites
2. Clone the repository to your system
3. Run `yarn` to install the dependencies
4. _(TODO: Add instructions on setting up database.)_
5. Run `yarn start` to start the server
6. Try entering
   [http://localhost:3001/api/tossups?limit=10](http://localhost:3001/api/tossups?limit=10) in your browser!

## Features

### Querying Tossups

The `/tossups` endpoint allows users to query tossups with parameters like
category, difficulty, etc.

### Generating Frequency Lists

The `/freq` endpoint allows users to query the most common answerlines with
parameters like category, difficulty, etc.

### Generating Clues (Experimental)

The `/clues` endpoint allows users to query a unique set of clues for an
answerline with parameters like category, difficulty, etc. The clue generation
algorithm isn't perfect and should be used as an _approximate_ heuristic. The
algorithm and scoring system are based on
[`tf-idf`](https://en.wikipedia.org/wiki/Tf%E2%80%93idf). The exact procedure
can be found [here](src/utils/clues.ts).

## Usage

Coming soon...
