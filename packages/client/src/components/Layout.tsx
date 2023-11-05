import { Center, Flex } from '@chakra-ui/react';
import usePageHeight from '../hooks/usePageHeight';
import Footer from './Footer';
import Header from './Header';

type Props = {
  children: React.ReactNode;
};

export default ({ children }: Props) => {
  const pageHeight = usePageHeight();

  return (
    <Flex direction="column" h={pageHeight}>
      <Header />
      <Center flexDir="column" overflow="auto" flex={1} px={3}>
        {children}
      </Center>
      <Footer />
    </Flex>
  );
};