import { Box, Heading, Link } from '@chakra-ui/react';
import { MDXComponents } from 'mdx/types';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import Modal from '../Modal';
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
  ul: ({ children }) => (
    <Box ml={6} mb={2}>
      <ul>{children}</ul>
    </Box>
  ),
  p: ({ children }) => (
    <Box mb={2}>
      <p>{children}</p>
    </Box>
  ),
};

const Updates = () => {
  const { isOpen } = useAppSelector(selectUpdatesModal);
  const dispatch = useAppDispatch();
  const closeModal = () => dispatch(close());

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} title="Updates 🚀">
      <Content components={mdxComponents} />
    </Modal>
  );
};

export default Updates;
