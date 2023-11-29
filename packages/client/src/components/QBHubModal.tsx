import {
  Modal as ChakraModal,
  Heading,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import usePageHeight from '../hooks/usePageHeight';
import TealButton from './buttons/TealButton';

type Props = {
  children: ReactNode;
  closeModal: () => void;
  isOpen: boolean;
  title: string;
};

export default function QBHubModal({
  children,
  closeModal,
  isOpen,
  title: heading,
}: Props) {
  const pageHeight = usePageHeight();

  return (
    <ChakraModal
      isOpen={isOpen}
      onClose={closeModal}
      size="6xl"
      scrollBehavior="inside"
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        m={4}
        w="min(90vw, 1400px)"
        maxW="600px"
        maxH={`max(0.75 * ${pageHeight}px, 500px)`}
        containerProps={{
          h: `${pageHeight}px`,
        }}
      >
        <ModalHeader color="black">
          <Heading as="h1" size="xl" textAlign="center">
            {heading}
          </Heading>
        </ModalHeader>
        <ModalBody display="flex" flexDirection="column">
          {children}
        </ModalBody>
        <ModalFooter>
          <TealButton mr={3} onClick={closeModal}>
            Done
          </TealButton>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
}
