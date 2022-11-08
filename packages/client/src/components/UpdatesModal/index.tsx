import {
  Container,
  Heading,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { MDXComponents } from 'mdx/types';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { TealButton } from '../buttons';
import Content from './updates.mdx';
import { close, selectUpdatesModal } from './updatesModalSlice';

const mdxComponents: MDXComponents = {
  h2: ({ children }) => (
    <Heading as="h2" size="md" mb={2}>
      {children}
    </Heading>
  ),
  h3: ({ children }) => (
    <Heading as="h3" size="sm" color="gray.700">
      {children}
    </Heading>
  ),
  a: ({ children, ...props }) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Link color="cyan.600" isExternal {...props}>
      {children}
    </Link>
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
        <ModalHeader color="black">
          <Heading as="h1" size="xl" textAlign="center">
            Updates 🚀
          </Heading>
        </ModalHeader>
        <ModalBody pt={0} display="flex" flexDirection="column">
          <Container px={6}>
            <Content components={mdxComponents} />
          </Container>
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
