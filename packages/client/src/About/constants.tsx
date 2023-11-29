import { Kbd, Link } from '@chakra-ui/react';
import { Fragment } from 'react';
import { zip } from '../utils/array';

const toStringFragments = (str: string, i: number) => (
  <Fragment key={`${str}${i}`}>{str}</Fragment>
);

const replaceLinks = (
  strings: TemplateStringsArray,
  ...links: { href: string; label: string }[]
) => {
  const fragments = strings.map(toStringFragments);
  const linkElements = links.map(({ href, label }) => (
    <Link key={`${label}${href}`} color="cyan.600" href={href} isExternal>
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
    text: replaceLinks`QBHub is a suite of digital tools that leverage the web and computing power for studying and playing ${{
      href: 'https://www.naqt.com/about/quiz-bowl.html',
      label: 'Quizbowl',
    }}. Each tool is built with a focus on rich functionality combined with a pleasant user interface.`,
  },
  {
    label: 'Tools 🛠',
    subheaders: [
      {
        label: 'Tossup Reader',
        text: 'A fully featured tossup reader with powers, prompts, configurable reading speed, and automated judging. Keeps track of score along with a detailed history of buzzes + stats. The tossup question filters can be precisely configured by Difficulty, Category, Tournament, etc. You can think of it as Protobowl + QuizDB questions and filters + looks and feels much nicer. Excellent on mobile too.',
      },
      {
        label: 'Bonus Reader',
        text: 'Like the Tossup Reader, but for bonuses.',
      },
      {
        label: 'Frequency List',
        text: replaceLinks`Dynamically retrieves tossup answerlines, sorted by frequency. Like the Tossup Reader, the pool of answerlines can be precisely filtered. Useful for scoping out the ${{
          href: 'https://www.qbwiki.com/wiki/Canon',
          label: 'canon',
        }} of a particular subject or difficulty level.`,
      },
      {
        label: 'Clue Generator',
        text: 'Dynamically retrieves commonly used clues for a given answerline, sorted by relevance. Like the Tossup Reader, the pool of clues can be precisely filtered. Useful for identifying important/need-to-know clues about a particular topic.',
      },
    ],
  },
  {
    label: 'Features 🚀',
    subheaders: [
      {
        label: 'Powerful Question Filtering',
        text: replaceKbd`Questions can be filtered by Category, Subcategory, Difficulty, and Tournament. If you've used QuizDB, the options will feel very familiar and on top of that, QBHub also adds an additional From Year filter, which allows you to select questions only written after 2015, for example. This can be pretty handy as some of the older questions can be a bit outdated at this point. These filters are shared across all of the tools, including the Frequency List and Clue Generator. This means you can search for the top high school History answerlines or even discover the most relevant collegiate clues for Pablo Neruda (which might be different from the top high school clues). The fine granularity allows you to tailor the tools towards your subject specialty and difficulty level. The question settings are saved between sessions and can be changed at any time by clicking the Settings button or pressing the ${'s'} key.`,
      },
      {
        label: 'Intelligent Filters',
        text: 'Besides customizability, the question filters work together to build your desired settings as quickly as possible. Selecting one option will automatically validate and restrict other options to avoid any contradictions. For instance, if you currently have the Science Category and you select the Biology Subcategory, QBHub will automatically remove the Science Category filter, as it understands you want to narrow your subject matter. Similarly, selecting a Category will automatically remove its corresponding Subcategories, as in this case, it knows you are trying to broaden your search. Other filters do similar things, for example, the Date and Difficulty filter will both automatically restrict the possible tournaments you can select. All of this together allows you to throw together a complex filter at any time with minimal effort.',
      },
      {
        label: 'Clean, Simple Design Language',
        text: 'QBHub focuses on simplicity and ease of use. Rather than providing a million configuration options and overloading the user with information, we try to be purposeful in our design language, opting for practicality and common use cases.',
      },
      {
        label: 'Mobile Friendly',
        text: 'Mobile devices and smaller screen sizes are a top priority, so every tool should look just as stunning and functional on phones!',
      },
      {
        label: 'Keyboard Navigation',
        text: replaceKbd`Some tasks are just more convenient with a few keypresses and we agree! Each tool provides keyboard shortcuts for better ergonomics and increased usability. The Question Reader has shortcuts for buzzing and advancing question, the Frequency List pages can be pressed through, the Settings modal can be toggled and edited without ever having to touch the mouse, and you can even toggle between the Tools themselves. All active keyboard shortcuts are always available by either pressing the ${'?'} key or clicking Info button in the bottom right.`,
      },
      {
        label: 'Dark Mode',
        text: 'Coming soon!',
      },
    ],
  },
  {
    label: 'Motivation ⚛',
    text: replaceLinks`When ${{
      href: 'https://www.quizdb.org/',
      label: 'QuizDB',
    }} was first released, I knew there was potential for many useful features but the existing Quizbowl resources were all lacking in some way. There were: no bonus readers, a few random hand-compiled frequency lists, and not much data-backed tooling. QuizDB is an excellent question viewer but lacks interactivity. Protobowl is a fun question reader but lacks packet selection, has a clunky interface, and can be quite buggy at times. Other sites were similarly lackluster due to bugginess, limited features, or a less attractive interface. As a result, I decided to try and satisfy these demands myself, with a goal of building a feature-rich question reader that was still clean and visually appealing. Another goal I had was to leverage the web and modern computing to generate valuable information from large datasets, that if done manually, would be much more difficult. And at the very least, QBHub seemed like a fun way of trying out some new technologies (Redux, ChakraUI) and polishing my web dev skills. QBHub was originally planned to be a tossup reader with a ${{
      href: 'https://typings.gg/',
      label: 'typings.gg',
    }}-like interface, but the more I worked on it, the more I enjoyed and believed in it. As time went on, I added more features, eventually morphing QBHub into what it is now.`,
  },
  {
    label: 'FAQ 💭',
    subheaders: [
      {
        label: 'What are the generated clues?',
        text: replaceLinks`Using statistical NLP and lots of data, we parse tossups into clues and score the clues amongst themselves by relevancy. While these generated clues aren't perfect and won't fully replace traditional studying methods, they are a really good heuristic for identifying important/popular concepts and more importantly, pointing someone in the right direction, especially if they are totally new to a topic. More details can be found ${{
          href: 'https://github.com/yesean/qbhub/tree/main/packages/server#generating-clues-experimental',
          label: 'here',
        }}.`,
      },
      {
        label: 'Why was my answer marked incorrect?',
        text: replaceLinks`We try our best to figure out all of the acceptable answers from an answerline, but parsing answerlines is hard. We mainly follow the ${{
          href: 'https://acf-quizbowl.com/packet-submission-checklist.pdf',
          label: 'ACF guidelines',
        }}, but many answerlines, especially from older packets, use different formats and have confusing wordings that trip up the parser. Determining all acceptable and promptable answers can be tricky (even for a human moderator sometimes!), so we simply accept the occasional miss and try to be right for the most part. Also, accounting for typos in user inputs is another challenging task, but luckily there are already some ${{
          href: 'https://www.wikiwand.com/en/String_metric',
          label: 'robust methods',
        }} of dealing with this (QBHub uses the Dice coefficient for string comparison).`,
      },
      {
        label: 'Why wasn’t my answer prompted?',
        text: 'Same as above.',
      },
      {
        label: 'Will there be a multiplayer version of the Question Readers?',
        text: replaceLinks`Probably not, QBHub is intended to be a personal studying tool. A multiplayer reader isn't really in line with the goals of this site and would be better suited for in-person packet reading. Plus, there are already some pretty good options out there: ${{
          href: 'https://protobowl.com/',
          label: 'Protobowl',
        }}, ${{
          href: 'https://www.qbreader.org/',
          label: 'QBReader',
        }}.`,
      },
      {
        label: 'What is the QBHub tech stack?',
        text: replaceLinks`The UI is built with ${{
          href: 'https://reactjs.org/',
          label: 'React',
        }} + ${{
          href: 'https://chakra-ui.com/',
          label: 'Chakra UI',
        }}. The backend is powered by ${{
          href: 'https://nodejs.org/en/',
          label: 'Node',
        }} + ${{ href: 'https://expressjs.com/', label: 'Express' }} + ${{
          href: 'https://www.postgresql.org/',
          label: 'PostgreSQL',
        }}, all running on a DigitalOcean droplet.`,
      },
      {
        label: 'Where are the questions from?',
        text: replaceLinks`Thanks to the amazing work from QuizDB and Quinterest, ${{
          href: 'https://s3.console.aws.amazon.com/s3/buckets/quizdb-public/?region=us-east-1&tab=objects',
          label: 'their public database',
        }} provides an enormous collection of questions, correctly tagged and labeled. We self-host the latest QuizDB archive with some additional self-added metadata, to help power some of the more advanced tools like the Frequency List and Clue Generator.`,
      },
      {
        label: 'Can I get a copy of the database?',
        text: replaceLinks`Sure! ${{
          href: 'https://www.dropbox.com/sh/5jiw5isl5bbk1b5/AAAnsj4Pl9ZYhgY9NYtccT3Ta?dl=0',
          label: 'Here',
        }} is a copy of the latest modified QuizDB PostgreSQL dump.`,
      },
      {
        label: "What's next for QBHub?",
        text: replaceLinks`The biggest things that come to mind are adding dark mode support and adding more analytics to the question readers. I think having more advanced stats and data visualizations for tossups and bonuses would be pretty cool. There's also some boring dev stuff too like cleaning up code, polishing up documentation, improving the build system, etc. And if you have any suggestions, please open a ${{
          href: 'https://github.com/yesean/qbhub/issues/new/choose',
          label: 'GitHub issue',
        }} or fill out the ${{
          href: 'https://docs.google.com/forms/d/e/1FAIpQLSfmLBEXd_p_j_t8M7qvGGC5fC5_B0a0DKCWy6K7YWjOyHA7Hg/viewform?usp=sf_link',
          label: 'feedback form',
        }}! Your thoughts are much appreciated!`,
      },
    ],
  },
  {
    label: 'Contributing 🤝',
    text: replaceLinks`Contributions are welcome! If you want to file an issue, open a PR, or browse the source code, ${{
      href: 'https:github.com/yesean/qbhub',
      label: 'QBHub',
    }} is fully open source. The documentation is always improving, but feel free to reach out on the form and I'll be happy to discuss anything QBHub related, like app architecture or how a feature was implemented. If coding isn't your thing, but you still enjoyed using QBHub, you can show your support by ${{
      href: 'https://www.buymeacoffee.com/qbhub',
      label: 'buying me a coffee',
    }}! As much I love doing it, maintaining and developing this site as a college student requires a lot of time and effort, and on top of that, renting a server costs money. Any contribution would mean a lot and go a long way towards making QBHub even more amazing!`,
  },
];
