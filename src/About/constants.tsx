import { Kbd, Link } from '@chakra-ui/react';
import { Fragment } from 'react';
import { zip } from '../utils/array';

const toStringFragments = (str: string, i: number) => (
  <Fragment key={`${str}${i}`}>{str}</Fragment>
);

const replaceLinks = (
  strings: TemplateStringsArray,
  ...links: { label: string; href: string }[]
) => {
  const fragments = strings.map(toStringFragments);
  const linkElements = links.map(({ label, href }) => (
    <Link key={`${label}${href}`} href={href} color="cyan.600" isExternal>
      {label}
    </Link>
  ));
  return zip(fragments, linkElements).flat().slice(0, -1);
};

const replaceKbd = (strings: TemplateStringsArray, ...keys: string[]) => {
  const fragments = strings.map(toStringFragments);
  const keyElements = keys.map((key) => <Kbd key={`${key}`}>{key}</Kbd>);
  return zip(fragments, keyElements).flat().slice(0, -1);
};

export const headers = [
  {
    label: 'What is QBHub?',
    text: replaceLinks`QBHub is a ${{
      label: 'Quizbowl',
      href: 'https://www.naqt.com/about/quiz-bowl.html',
    }} platform that provides a collection of useful tools for studying and playing quizbowl. It was built with a focus on rich functionality combined with a clean, beautiful design language.`,
  },
  {
    label: 'Tools 🛠',
    subheaders: [
      {
        label: 'Tossup Reader',
        text: 'A fully featured tossup reader with powers and prompts. Keeps track of score and a detailed history of buzzes + stats. The tossups can be dynamically filtered by question settings (such as category or difficulty).',
      },
      {
        label: 'Bonus Reader',
        text: 'A fully featured bonus reader that keeps track of score and a detailed history of questions + stats. Just like the Tossup Reader, but for bonuses.',
      },
      {
        label: 'Frequency List',
        text: 'Retrieves commonly asked answerlines, sorted by frequency. Useful for scoping out "canon" or common topics for a particular subject or difficulty level. The answers can be dynamically filtered by question settings (such as category or difficulty).',
      },
      {
        label: 'Clues Generator',
        text: 'Retrieves commonly used clues for a given answerline, sorted by relevance. Useful for identifying important/need-to-know clues about a particular topic. The clues can be dynamically filtered by question settings (such as category or difficulty).',
      },
    ],
  },
  {
    label: 'Features 🚀',
    subheaders: [
      {
        label: 'Global Question Filtering',
        text: replaceKbd`Each tool features the same extensive question filtering that allows you to read college difficulty Biology/History tossups, obtain the most common high school Fine Arts answerlines, get all high school/college clues for entropy, and so many more possibilities. This allows you to tailor the tools towards your subject specialty and difficulty level. The question settings are persisted across all the tools and can be changed at any time by clicking the Settings button in the top right or pressing the ${'s'} key.`,
      },
      {
        label: 'Purposeful UI',
        text: 'QBHub strives for simplicity and ease of use. We try to be purposeful in our design language, opting for practicality and common use cases.',
      },
      {
        label: 'Mobile Friendly',
        text: 'Usability on phones and smaller screen sizes was a top priority, so tools should look and work great on phones!',
      },
      {
        label: 'Keyboard Navigation',
        text: replaceKbd`Each tool provides keyboard shortcuts for convenience and power users. For example, the reader shamelessly follows Protobowl's shortcuts, using ${'space'} to buzz and ${'n'} to continue. Global keyboard shortcuts are provided for navigating through the entire site and between tools. Shortcuts for each tool can be found by pressing the Info button in the bottom right or pressing the ${'?'} key. We value web accessibility and following WCAG guidelines.`,
      },
      {
        label: 'Dark Mode',
        text: 'Coming soon!',
      },
    ],
  },
  {
    label: 'Motivation ⚛',
    text: replaceLinks`With the compilation of the QuizDB database, there was potential for useful features but the existing Quizbowl resources lacked what I envisioned. QuizDB is an excellent question browser but lacks interactivity, Protobowl has a great question reader but lacks packet selection and has a clunky interface, and other sites seemed similarly lacking in various regards. The amount of technology-driven QB tooling felt lacking, especially when you consider the huge amount of data and computional power that exists today. Prior to QBHub, I developed a few text processing utilities that I wanted to port to a more accessible interface like the web. More importantly, QBHub seemed like a fun project to try out some new technologies (Redux, ChakraUI) and polish my web dev skills. Originally, QBHub was planned to be a simple tossup reader with a ${{
      label: 'typings.gg-like',
      href: 'https://typings.gg/',
    }} interface, but the more I worked on it, the more I enjoyed it. As a result, I began adding more features, eventually morphing QBHub into what it is now.`,
  },
  {
    label: 'FAQ 💭',
    subheaders: [
      {
        label: 'What are the generated clues?',
        text: replaceLinks`Using some statistical NLP techniques and lots of data, we parse tossups into clues and score the clues amongst themselves by relevancy. While these generated clues aren't perfect and won't fully replace traditional studying methods, the clues are a very good heuristic for identifying important/popular concepts and more importantly, pointing someone in the right direction, especially if they are totally new to a topic. More details can be found ${{
          label: 'here',
          href: 'https://github.com/yesean/qbhub-server#generating-clues-experimental',
        }}.`,
      },
      {
        label: 'Why was my answer marked incorrect?',
        text: replaceLinks`We try our best to parse all of the acceptable answers from an answerline, but it isn’t perfect. We mainly follow the ${{
          label: 'ACF guidelines',
          href: 'https://acf-quizbowl.com/packet-submission-checklist.pdf',
        }}, but many answerlines (especially from older packets) use different formats and in general, answerlines can be tricky to parse and occasionally answers may be missed.`,
      },
      {
        label: 'Why wasn’t my answer prompted?',
        text: 'Same as above.',
      },
      {
        label: 'Will there be a multiplayer version of the Tossup reader?',
        text: replaceLinks`Probably not, QBHub is intended to be a personal studying tool. A multiplayer reader isn't really in line with the goals of this site and would be better suited for in-person packet reading. Plus, there are already some pretty good options out there: ${{
          label: 'Protobowl',
          href: 'https://protobowl.com/',
        }}, ${{
          label: 'QBReader',
          href: 'https://www.qbreader.org/',
        }}.`,
      },
      {
        label: 'What is QBHub built with?',
        text: replaceLinks`We use ${{
          label: 'React',
          href: 'https://reactjs.org/',
        }} to build the UI, with components provided by ${{
          label: 'Chakra UI',
          href: 'https://chakra-ui.com/',
        }}. The backend is powered by ${{
          label: 'Node',
          href: 'https://nodejs.org/en/',
        }} + ${{ label: 'Express', href: 'https://expressjs.com/' }} + ${{
          label: 'PostgreSQL',
          href: 'https://www.postgresql.org/',
        }}, all running on a DigitalOcean droplet.`,
      },
      {
        label: 'Where are the questions from?',
        text: replaceLinks`Thanks to the amazing work from QuizDB and Quinterest, ${{
          label: 'their database table',
          href: 'https://s3.console.aws.amazon.com/s3/buckets/quizdb-public/?region=us-east-1&tab=objects',
        }} provides an enormous collection of questions, correctly tagged and labeled. We utilize the QuizDB question bank and add some extra metadata, to help power tools like the Clue Generator.`,
      },
      {
        label: 'Can I get a copy of the database?',
        text: replaceLinks`Sure! A copy of the modified QuizDB PostgreSQL dump can be found ${{
          label: 'here',
          href: 'https://www.dropbox.com/sh/5jiw5isl5bbk1b5/AAAnsj4Pl9ZYhgY9NYtccT3Ta?dl=0',
        }}.`,
      },
      {
        label: "What's next for QBHub?",
        text: replaceLinks`The biggest things that come to mind are adding dark mode support and adding more analytics to the question readers. I think having advanced stats and data visualizations for tossups and bonuses would be pretty cool. There's also some boring dev stuff too like cleaning up code, polishing up documentation, improving the build system, etc. And if you have any suggestions, please open a ${{
          label: 'GitHub issue',
          href: 'https://github.com/yesean/qbhub-client/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=',
        }} or fill out the ${{
          label: 'feedback form',
          href: 'https://docs.google.com/forms/d/e/1FAIpQLSfmLBEXd_p_j_t8M7qvGGC5fC5_B0a0DKCWy6K7YWjOyHA7Hg/viewform?usp=sf_link',
        }}! Your thoughts are much appreciated!`,
      },
    ],
  },
  {
    label: 'Contributing 🤝',
    text: replaceLinks`Contributions are welcome! If you want to file an issue, open a PR, or just browse the source code, here is the ${{
      label: 'UI',
      href: 'https:github.com/yesean/qbhub-client',
    }} and ${{
      label: 'backend',
      href: 'https://github.com/yesean/qbhub-server',
    }}. You can also leave any general feedback on this ${{
      label: 'form',
      href: 'https://docs.google.com/forms/d/e/1FAIpQLSfmLBEXd_p_j_t8M7qvGGC5fC5_B0a0DKCWy6K7YWjOyHA7Hg/viewform?usp=sf_link',
    }}. I realize the documentation isn't the best, but feel free to reach out on the form and I'll be happy to go over it.`,
  },
];
