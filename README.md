# QBHub

## Overview

[QBHub](https://qbhub.io) is a collection of tools for practicing/studying
[Quizbowl](https://www.naqt.com/about/quiz-bowl.html#:~:text=What%20Is%20Quiz%20Bowl%3F,individual%20players%20rather%20than%20teams.).
Its main features are:

- [Tossup Reader](https://qbhub.io/reader/tossup)
  - Interactive single-player question reader
    ([Protobowl](https://protobowl.com)-esque)
  - Comprehensive question set with QuizDB-style question filtering e.g.
    (sub)category, difficulty, tournament
  - Robust scoring system, detailed question history, and real-time stats
- [Bonus Reader](https://qbhub.io/reader/bonus)
  - same as Tossup Reader but for bonuses
- [Frequency List Generator](https://qbhub.io/freq)
  - Generates a list of answerlines on-demand, sorted by frequency
  - Answerlines can be filtered using QuizDB-style filters
- [Clue Generator](https://qbhub.io/clues/search)
  - Generates a list of clues for an answerline, sorted by relevance
  - NLP-based clue generation finds a set of unique, but important clues
  - Utilizes QuizDB-style filters
- Intelligent Question Filtering
  - QuizDB-style question filters available to each page
  - Global filters shared betweeen pages, saved across sessions

## Goals

- **Simple Design Language**: Minimal, functional, easy to use
- **Mobile Friendly**: Looks and feels the same on mobile
- **Keyboard Navigable**: Provide the option to use the keyboard as much as
  possible

## Monorepo

QBHub is organized as a monorepo with 3 packages:

- [client](https://github.com/yesean/qbhub/tree/main/packages/client) (React
  frontend)
- [server](https://github.com/yesean/qbhub/tree/main/packages/server)
  (Node/Express backend, PostgreSQL database)
- [types](https://github.com/yesean/qbhub/tree/main/packages/types) (shared
  types between `client` and `server`)

We use [Yarn workspaces](https://yarnpkg.com/features/workspaces) and
[TypeScript project references](https://www.typescriptlang.org/docs/handbook/project-references.html)
to manage the monorepo. The entire codebase is written in end-to-end TypeScript
with shared TypeScript and ESLint configurations.

## Getting Started

1. Clone the repo to your machine
2. In the root directory, run `yarn` to install dependencies and setup the
   monorepo
3. Run `yarn dev` to start a dev server on `localhost:3000`
4. `yarn lint` and `yarn test` to lint and test the codebase
5. Run `yarn build` to build the entire project
