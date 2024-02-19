import { Box, Center, Heading, Text } from '@chakra-ui/react';

import { headers } from './constants';

const About = () => {
  const renderHeaderContent = ({
    label,
    subheaders,
    text,
  }: (typeof headers)[number]) => {
    let content;
    if (subheaders !== undefined) {
      content = subheaders.map((sub) => (
        <Box key={sub.label} mb={4}>
          <Heading color="gray.700" pos="relative" size="md">
            <Text left="-1rem" pos="absolute">
              •
            </Text>
            {sub.label}
          </Heading>
          <Text>{sub.text}</Text>
        </Box>
      ));
    } else {
      content = <Text>{text}</Text>;
    }

    return (
      <Box key={label} mb={8}>
        <Heading mb={4} size="xl">
          {label}
        </Heading>
        {content}
      </Box>
    );
  };

  return (
    <Center flexDir="column" overflow="auto" w="100%">
      <Box
        boxSizing="border-box"
        maxW="120rem"
        minW="350px"
        overflow="auto"
        px="10%"
      >
        {headers.map(renderHeaderContent)}
      </Box>
    </Center>
  );
};

export default About;
