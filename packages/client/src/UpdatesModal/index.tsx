import { Box, Heading, Link } from '@chakra-ui/react';
import { MDXComponents } from 'mdx/types';
import { useEffect } from 'react';
import QBHubModal from '../components/QBHubModal';
import { useModalContext } from '../providers/ModalContext';
import Content from './updates.mdx';
import { checkHasUserViewedLatestUpdate, saveLastSeenUpdate } from './utils';

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

type UpdatesModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

const UpdatesModal = ({ isOpen, closeModal }: UpdatesModalProps) => {
  const { openUpdatesModal } = useModalContext();

  // immediately open latest updates if the user hasn't seen it
  useEffect(() => {
    if (!checkHasUserViewedLatestUpdate()) {
      openUpdatesModal();
      saveLastSeenUpdate();
    }
  }, [openUpdatesModal]);

  return (
    <QBHubModal isOpen={isOpen} closeModal={closeModal} title="Updates 🚀">
      <Content components={mdxComponents} />
    </QBHubModal>
  );
};

export default UpdatesModal;
