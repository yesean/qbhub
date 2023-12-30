import { Box, Heading } from '@chakra-ui/react';

type ClueDisplayHeadlineProps = {
  headline: string;
  leadingText: string;
};

export default function ClueDisplayHeadline({
  headline,
  leadingText,
}: ClueDisplayHeadlineProps) {
  return (
    <Heading
      as="h2"
      lineHeight="1.5"
      maxW="600px"
      px={4}
      size="md"
      textAlign="center"
    >
      {leadingText}{' '}
      <Box as="span" bg="cyan.200" borderRadius="sm" p={1}>
        {headline}
      </Box>
    </Heading>
  );
}
