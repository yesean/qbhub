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
import { useAppDispatch } from '../../app/hooks';
import TealButton from '../TealButton';
import { close, selectInfoModal } from './infoModalSlice';

type Shortcut = {
  label: string;
  description: string;
};

const globalShortcuts = [
  { label: '?', description: 'Open Info modal (current popup)' },
  { label: '1', description: 'Go to Tossup Reader' },
  { label: '2', description: 'Go to Frequency List' },
  { label: '3', description: 'Go to Clue Generator' },
];

const readerShortcuts = [
  { label: 'n', description: 'Start reading / Next question' },
  { label: 'space', description: 'Buzz' },
];

const freqShortcuts = [
  { label: 'p/←', description: 'Previous page' },
  { label: 'n/→', description: 'Next page' },
];

const InfoModal: React.FC = () => {
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
        <ModalHeader>Keyboard Shortcuts</ModalHeader>
        <ModalBody pt={0} display="flex" flexDirection="column">
          <Heading size="md">Global</Heading>
          {renderTable(globalShortcuts)}
          <Heading size="md">Reader</Heading>
          {renderTable(readerShortcuts)}
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
