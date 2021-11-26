import {
  Heading,
  Kbd,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { ROUTES } from '../../utils/routes';
import TealButton from '../TealButton';
import { close, selectInfoModal } from './infoModalSlice';

type Shortcut = {
  label: string;
  description: string | JSX.Element;
};

const globalShortcuts = [
  {
    label: '?',
    description: (
      <>
        Open <strong>Info</strong> (current popup)
      </>
    ),
  },
  {
    label: 's',
    description: (
      <>
        Open <strong>Settings</strong>
      </>
    ),
  },
  {
    label: '1',
    description: (
      <>
        Go to <strong>Tossup Reader</strong>
      </>
    ),
  },
  {
    label: '2',
    description: (
      <>
        Go to <strong>Frequency List</strong>
      </>
    ),
  },
  {
    label: '3',
    description: (
      <>
        Go to <strong>Clue Generator</strong>
      </>
    ),
  },
];

const readerShortcuts = [
  { label: 'n', description: 'Start reading / Next question' },
  { label: 'space', description: 'Buzz' },
  { label: 'h', description: 'Open question history' },
];

const freqShortcuts = [
  { label: 'p/←', description: 'Previous page' },
  { label: 'n/→', description: 'Next page' },
];

const cluesShortcuts = [{ label: '/', description: 'Search for answers' }];

const InfoModal: React.FC = () => {
  const { pathname } = useLocation();
  const infoModal = useSelector(selectInfoModal);
  const dispatch = useAppDispatch();

  const closeModal = () => dispatch(close());

  const renderTable = (shortcuts: Shortcut[]) => (
    <Table variant="simple" mb={4}>
      <Thead>
        <Tr>
          <Th>Key</Th>
          <Th>Action</Th>
        </Tr>
      </Thead>
      <Tbody>
        {shortcuts.map(({ label, description }) => (
          <Tr>
            <Td>
              <Kbd>{label}</Kbd>
            </Td>
            <Td>
              <Text>{description}</Text>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );

  const renderLocalShortcuts = () => {
    if (pathname.startsWith(ROUTES.reader.root)) {
      return (
        <>
          <Heading size="sm">Reader</Heading>
          {renderTable(readerShortcuts)}
        </>
      );
    }
    if (pathname.startsWith(ROUTES.freq.root)) {
      return (
        <>
          <Heading size="sm">Frequency List</Heading>
          {renderTable(freqShortcuts)}
        </>
      );
    }
    if (pathname.startsWith(ROUTES.clues.root)) {
      return (
        <>
          <Heading size="sm">Clues Generator</Heading>
          {renderTable(cluesShortcuts)}
        </>
      );
    }
    return null;
  };

  return (
    <Modal
      isOpen={infoModal.isOpen}
      onClose={closeModal}
      size="6xl"
      scrollBehavior="inside"
      isCentered
    >
      <ModalOverlay />
      <ModalContent m={4} maxH="max(75vh, 600px)">
        <ModalHeader color="black">Info</ModalHeader>
        <ModalBody pt={0} display="flex" flexDirection="column">
          {renderLocalShortcuts()}
          <Heading size="sm" color="gray.800">
            Global
          </Heading>
          {renderTable(globalShortcuts)}
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

export default InfoModal;
