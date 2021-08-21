import { Container, Text } from '@chakra-ui/react';

const Question: React.FC = () => {
  return (
    <Container
      maxW="container.md"
      bg="gray.100"
      w="100%"
      mb={4}
      p={4}
      borderRadius="md"
    >
      <Text pl={2} pr={2}>
        Either HPLC or a form of this technique using fiber optics is used to
        monitor the dissolution profile of pharmaceuticals. In this technique,
        the octant rule can be used to predict the sign of the Cotton effect,
        which is used to distinguish between enantiomers. This technique is used
        to determine association constants between host and guest molecules via
        the Benesi–Hildebrand method. The ratio of two measurements obtained via
        this technique is between (*) 1.7 and 2 for pure samples of DNA.
        Depending on whether the compound being imaged is homo- or
        hetero-annular, a base value of 214 or 253 is used to predict the
        wavelength maximum in this technique, which typically occurs due to a
        HOMO–LUMO transition. The Woodward–Fieser rules are used to predict the
        results of this technique, which is particularly useful for systems with
        extended conjugation. For 10 points, name this form of spectroscopy that
        uses wavelengths slightly shorter than infrared spectroscopy.
      </Text>
    </Container>
  );
};

export default Question;
