import {
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { TealButton } from '../buttons';
import Content from './updates.mdx';
import { close, selectUpdatesModal } from './updatesModalSlice';

const mdxComponents = {
  h1: ({ children }) => (
    <Heading as="h1" size="xl">
      {children}
    </Heading>
  ),
  h2: ({ children }) => (
    <Heading as="h2" size="lg">
      {children}
    </Heading>
  ),
  h3: ({ children }) => (
    <Heading as="h3" size="md">
      {children}
    </Heading>
  ),
  h4: ({ children }) => (
    <Heading as="h4" size="sm">
      {children}
    </Heading>
  ),
};

const Updates = () => {
  const { isOpen } = useAppSelector(selectUpdatesModal);
  const dispatch = useAppDispatch();
  const closeModal = () => dispatch(close());

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      size="6xl"
      scrollBehavior="inside"
      isCentered
    >
      <ModalOverlay />
      <ModalContent m={4} maxW="600px" maxH="max(75vh, 600px)">
        <ModalHeader color="black">Updates 🚀</ModalHeader>
        <ModalBody pt={0} display="flex" flexDirection="column">
          <Content components={mdxComponents} />
        </ModalBody>
        <ModalFooter>
          <TealButton mr={3} onClick={closeModal}>
            Done
          </TealButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Updates;
