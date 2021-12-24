import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { headers } from './constants';

const About = () => {
  const renderHeaderContent = ({
    label,
    subheaders,
    text,
  }: typeof headers[number]) => {
    let content;
    if (subheaders !== undefined) {
      content = subheaders.map((sub) => (
        <Box key={sub.label} mb={4}>
          <Heading size="md" color="gray.600">
            ▶ {sub.label}
          </Heading>
          <Text fontFamily="IBM Plex Sans, sans-serif">{sub.text}</Text>
        </Box>
      ));
    } else {
      content = <Text fontFamily="IBM Plex Sans, sans-serif">{text}</Text>;
    }

    return (
      <Box key={label} mb={8}>
        <Heading size="xl" mb={4}>
          {label}
        </Heading>
        {content}
      </Box>
    );
  };

  return (
    <Flex flexDir="column" overflow="auto" maxW="container.lg">
      <Box overflow="auto" px={8}>
        {headers.map(renderHeaderContent)}
      </Box>
    </Flex>
  );
};

export default About;
