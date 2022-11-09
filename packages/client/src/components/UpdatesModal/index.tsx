import { Box, Heading, Link } from '@chakra-ui/react';
import { MDXComponents } from 'mdx/types';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { localStorageKeys } from '../../utils/constants';
import { restore, save } from '../../utils/storage';
import Modal from '../Modal';
import Content from './updates.mdx';
import { close, open, selectUpdatesModal } from './updatesModalSlice';

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

const LATEST_UPDATE = '11-08-2022';
const checkLastSeenUpdate = () => {
  const lastSeenUpdate = JSON.parse(
    restore(localStorageKeys.LAST_SEEN_UPDATE) ?? '{}',
  );
  return lastSeenUpdate === LATEST_UPDATE;
};
const saveLastSeenUpdate = () => {
  if (!checkLastSeenUpdate()) {
    save(localStorageKeys.LAST_SEEN_UPDATE, LATEST_UPDATE);
  }
};

const Updates = () => {
  const { isOpen } = useAppSelector(selectUpdatesModal);
  const dispatch = useAppDispatch();
  const closeModal = () => {
    dispatch(close());
    saveLastSeenUpdate();
  };

  // immediately open latest updates if the user hasn't seen it
  useEffect(() => {
    const openModal = () => dispatch(open());
    if (!checkLastSeenUpdate()) {
      openModal();
    }
  }, [dispatch]);

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} title="Updates 🚀">
      <Content components={mdxComponents} />
    </Modal>
  );
};

export default Updates;
