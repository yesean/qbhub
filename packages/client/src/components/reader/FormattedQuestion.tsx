import { BellIcon } from '@chakra-ui/icons';
import { Container, Text } from '@chakra-ui/react';
import { FormattedWord } from '@qbhub/types';
import React, { Fragment } from 'react';
import { parseHTMLString } from '../../utils/string';

const Bell = ({ shouldDisplay }: { shouldDisplay: boolean }) => {
  if (!shouldDisplay) return null;

  return (
    <Container
      alignItems="center"
      color="cyan.500"
      display="inline-flex"
      m={0}
      p={0}
      verticalAlign="bottom"
      w="auto"
      whiteSpace="pre"
    >
      <BellIcon h={4} w={4} />
      <Text display="inline"> </Text>
    </Container>
  );
};

type Props = {
  words: FormattedWord[];
  indices?: { buzz?: number; visible?: number };
  visibleRef?: React.RefObject<HTMLParagraphElement>;
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
          fontWeight={w.isBold ? 'bold' : 'normal'}
          visibility={i <= visible ? 'visible' : 'hidden'}
          whiteSpace="break-spaces"
        >
          {parseHTMLString(w.value)}{' '}
        </Text>
        <Bell shouldDisplay={i === buzz} />
      </Fragment>
    ))}
  </>
);

export default FormattedQuestion;
