import { Container, Heading, Text } from '@chakra-ui/react';

const intro =
  "QBHub is a collection of nice quizbowl tools that I've always wanted.";
const About = () => {
  return (
    <Container>
      <Heading size="4xl" mb={2}>
        About
      </Heading>
      <Heading size="2xl">Motivation</Heading>
      <Text>{intro}</Text>
      <Heading size="2xl">Features</Heading>
      <Heading size="2xl">Upcoming</Heading>
      <Heading size="2xl">FAQ</Heading>
    </Container>
  );
};

export default About;
