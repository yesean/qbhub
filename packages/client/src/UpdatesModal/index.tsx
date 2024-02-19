import { Box, Heading, Link } from '@chakra-ui/react';
import { MDXComponents } from 'mdx/types';
import { useEffect } from 'react';

import QBHubModal from '../components/QBHubModal';
import { useModalContext } from '../providers/ModalContext';
import Content from './updates.mdx';
import { checkHasUserViewedLatestUpdate, saveLastSeenUpdate } from './utils';

const mdxComponents: MDXComponents = {
  a: ({ children, ...props }) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Link color="cyan.600" isExternal {...props}>
      {children}
    </Link>
  ),
  h2: ({ children }) => (
    <Heading as="h2" mb={2} size="md">
      {children}
    </Heading>
  ),
  h3: ({ children }) => (
    <Heading as="h3" color="gray.700" size="sm">
      {children}
    </Heading>
  ),
  p: ({ children }) => (
    <Box mb={2}>
      <p>{children}</p>
    </Box>
  ),
  ul: ({ children }) => (
    <Box mb={2} ml={6}>
      <ul>{children}</ul>
    </Box>
  ),
};

type UpdatesModalProps = {
  closeModal: () => void;
  isOpen: boolean;
};

const UpdatesModal = ({ closeModal, isOpen }: UpdatesModalProps) => {
  const { openUpdatesModal } = useModalContext();

  // immediately open latest updates if the user hasn't seen it
  useEffect(() => {
    if (!checkHasUserViewedLatestUpdate()) {
      openUpdatesModal();
      saveLastSeenUpdate();
    }
  }, [openUpdatesModal]);

  return (
    <QBHubModal closeModal={closeModal} isOpen={isOpen} title="Updates 🚀">
      <Content components={mdxComponents} />
    </QBHubModal>
  );
};

export default UpdatesModal;
