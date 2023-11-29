import { BellIcon } from '@chakra-ui/icons';
import { Container, Text } from '@chakra-ui/react';
import React, { Fragment } from 'react';
import { parseHTMLString } from '../../utils/string';

type Props = {
  words: { bold: boolean; word: string }[];
  indices?: { buzz?: number; visible?: number };
  visibleRef?: React.RefObject<HTMLParagraphElement>;
};

const Bell = ({ shouldDisplay }: { shouldDisplay: boolean }) => {
  if (!shouldDisplay) return null;

  return (
    <Container
      color="cyan.500"
      m={0}
      p={0}
      w="auto"
      display="inline-flex"
      alignItems="center"
      whiteSpace="pre"
      verticalAlign="bottom"
    >
      <BellIcon w={4} h={4} />
      <Text display="inline"> </Text>
    </Container>
  );
};

const FormattedQuestion = ({
  words,
  indices: { buzz = -1, visible = words.length } = {},
  visibleRef,
}: Props) => (
  <>
    {words.map((w, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <Fragment key={`${w}${i}`}>
        <Text
          ref={i === visible ? visibleRef : undefined}
          display="inline-block"
          whiteSpace="break-spaces"
          visibility={i <= visible ? 'visible' : 'hidden'}
          fontWeight={w.bold ? 'bold' : 'normal'}
        >
          {parseHTMLString(w.word)}{' '}
        </Text>
        <Bell shouldDisplay={i === buzz} />
      </Fragment>
    ))}
  </>
);

export default FormattedQuestion;
