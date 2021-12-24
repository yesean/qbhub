import { Kbd, Link } from '@chakra-ui/react';
import { Fragment } from 'react';
import { zip } from '../utils/array';

const toStringFragments = (str: string) => <Fragment key={str}>{str}</Fragment>;

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
    text: 'QBHub is a Quizbowl platform that provides a collection of useful tools for studying and playing quizbowl. It was built with a focus on rich functionality combined with a clean, minimal design language.',
  },
  {
    label: 'Tools',
    subheaders: [
      {
        label: 'Tossup Reader',
        text: 'A fully featured tossup reader with powers and prompts. Keeps track of score and a detailed history of buzzes. The tossups can be dynamically filtered by question settings (such as category or difficulty).',
      },
      {
        label: 'Bonus Reader',
        text: 'Coming soon!',
      },
      {
        label: 'Frequency List',
        text: 'Retrieves commonly asked answerlines, sorted by frequency. The answers can be dynamically filtered by question settings (such as category or difficulty).',
      },
      {
        label: 'Clues Generator',
        text: 'Retrieves commonly used clues, sorted by relevance. The clues can be dynamically filtered by question settings (such as category or difficulty).',
      },
    ],
  },
  {
    label: 'Features',
    subheaders: [
      {
        label: 'Minimalist Interface',
        text: 'QBHub strives for simplicity and ease of use. It tries to not to be overloaded with features and graphics, opting for practicality and common use cases. This lends itself well to mobile responsiveness and being well suited for all screen sizes.',
      },
      {
        label: 'Powerful Question Filtering',
        text: replaceKbd`Each tool has extensive question filtering that allows you to do things such as read Science Biology and History tossups of college difficulty or get the most frequent Fine Arts answerlines of high school difficulty. This allows you to tailor the tools towards your subject specialty and difficulty level. The question settings are global to all the tools and can be changed by clicking the Settings button in the top right or pressing the ${'s'} key.`,
      },
      {
        label: 'Keyboard Navigation',
        text: replaceKbd`Each tool provides keyboard shortcuts for convenience and power users. Global keyboard shortcuts are provided for navigating through the entire site and between tools. Shortcuts for each tool can be found by pressing the Info button in the bottom right or pressing the ${'?'} key. QBHub also strives to be web accessible and follow WCAG guidelines.`,
      },
      {
        label: 'Dark Mode',
        text: 'Coming soon!',
      },
    ],
  },
  {
    label: 'Motivation',
    text: replaceLinks`With the compilation of the QuizDB database, I knew there was potential for useful features but the existing Quizbowl resources lacked what I wanted. QuizDB is excellent for viewing questions but lacks other features, Protobowl has a great question reader but lacks packet selection and has a clunky interface (IMO), and the other sites seemed similarly lacking in various regards. Also prior to QBHub, I developed some small offline text processing utilities that I wanted to port to a more accessible interface like the web. QBHub also seemed like a fun project to try out some new technologies (Redux, ChakraUI) and polish my web development skills. Originally, QBHub started off simply as a tossup reader with an interface similar to ${{
      label: 'typings.gg',
      href: 'https://typings.gg/',
    }}, but I later on began adding more features, eventually morphing QBHub into what it is now.`,
  },
  {
    label: 'FAQ',
    subheaders: [
      {
        label: 'How are the clues generated?',
        text: replaceLinks`The backend uses various NLP techniques to parse tossups into clues and score the clues by relevance. More details can be found ${{
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
        label: 'Can I get a copy of the database?',
        text: replaceLinks`Sure! A copy of the PostgreSQL dump can be found ${{
          label: 'here',
          href: 'https://www.dropbox.com/sh/5jiw5isl5bbk1b5/AAAnsj4Pl9ZYhgY9NYtccT3Ta?dl=0',
        }}.`,
      },
    ],
  },
  {
    label: 'Contributing',
    text: replaceLinks`Contributions are welcome! If you want to file an issue, open a PR, or just browse the source code, you can do that ${{
      label: 'here',
      href: 'https:github.com/yesean/qbhub-client',
    }}. The same for the backend can be found ${{
      label: 'here',
      href: 'https://github.com/yesean/qbhub-server',
    }}. You can also leave general feedback on this ${{
      label: 'form',
      href: 'https://docs.google.com/forms/d/e/1FAIpQLSfmLBEXd_p_j_t8M7qvGGC5fC5_B0a0DKCWy6K7YWjOyHA7Hg/viewform?usp=sf_link',
    }}.`,
  },
];
