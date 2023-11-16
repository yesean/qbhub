import { Box, Center, Heading, Text } from '@chakra-ui/react';
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
          <Heading size="md" pos="relative" color="gray.700">
            <Text pos="absolute" left="-1rem">
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
        <Heading size="xl" mb={4}>
          {label}
        </Heading>
        {content}
      </Box>
    );
  };

  return (
    <Center flexDir="column" overflow="auto" w="100%">
      <Box
        overflow="auto"
        px="10%"
        minW="350px"
        boxSizing="border-box"
        maxW="120rem"
      >
        {headers.map(renderHeaderContent)}
      </Box>
    </Center>
  );
};

export default About;
