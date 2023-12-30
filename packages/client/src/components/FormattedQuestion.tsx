import { BellIcon } from '@chakra-ui/icons';
import { Container, Text } from '@chakra-ui/react';
import { FormattedWord } from '@qbhub/types';
import React, { Fragment } from 'react';
import { parseHTMLString } from '../utils/string';

export type FormattedQuestionProps = {
  words: FormattedWord[];
  buzzIndex?: number;
  visibleIndex?: number;
  visibleRef?: React.RefObject<HTMLParagraphElement>;
};

export default function FormattedQuestion({
  words,
  buzzIndex = -1,
  visibleIndex = words.length,
  visibleRef,
}: FormattedQuestionProps) {
  return (
    <>
      {words.map((word, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={`${word}${index}`}>
          <Text
            ref={index === visibleIndex ? visibleRef : undefined}
            display="inline-block"
            fontWeight={word.isBold ? 'bold' : 'normal'}
            visibility={index <= visibleIndex ? 'visible' : 'hidden'}
            whiteSpace="break-spaces"
          >
            {parseHTMLString(word.value)}{' '}
          </Text>
          <Bell shouldDisplay={index === buzzIndex} />
        </Fragment>
      ))}
    </>
  );
}

type BellProps = {
  shouldDisplay: boolean;
};

function Bell({ shouldDisplay }: BellProps) {
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
}
