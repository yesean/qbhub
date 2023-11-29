import { Center, Flex } from '@chakra-ui/react';
import usePageHeight from '../hooks/usePageHeight';
import Footer from './Footer';
import Header from './Header';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const pageHeight = usePageHeight();

  return (
    <Flex direction="column" h={pageHeight}>
      <Header />
      <Center flex={1} flexDir="column" overflow="auto" px={3}>
        {children}
      </Center>
      <Footer />
    </Flex>
  );
}
