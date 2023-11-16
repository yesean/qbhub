import {
  Heading,
  Kbd,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import Modal from '../components/Modal';
import { useAppDispatch } from '../redux/hooks';
import { usePage } from '../utils/routes';
import { close, selectInfoModal } from './infoModalSlice';

type Shortcut = {
  label: string | string[];
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
        Go to <strong>Bonus Reader</strong>
      </>
    ),
  },
  {
    label: '3',
    description: (
      <>
        Go to <strong>Frequency List</strong>
      </>
    ),
  },
  {
    label: '4',
    description: (
      <>
        Go to <strong>Clue Generator</strong>
      </>
    ),
  },
  {
    label: '5',
    description: (
      <>
        Go to <strong>About</strong>
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
  { label: ['p', '←'], description: 'Previous page' },
  { label: ['n', '→'], description: 'Next page' },
];

const InfoModal: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { isOpen } = useSelector(selectInfoModal);
  const dispatch = useAppDispatch();
  const page = usePage();

  const closeModal = () => dispatch(close());

  const renderShortcutLabel = (label: string | string[]) => {
    if (Array.isArray(label)) {
      return label.map((l) => (
        <Kbd key={l} mr={1}>
          {l}
        </Kbd>
      ));
    }
    return <Kbd>{label}</Kbd>;
  };
  const renderTable = (shortcuts: Shortcut[]) => (
    <Table variant="simple" mb={4} style={{ tableLayout: 'fixed' }}>
      <colgroup>
        <col style={{ width: '25%' }} />
        <col style={{ width: '75%' }} />
      </colgroup>
      <Thead>
        <Tr>
          <Th>Key</Th>
          <Th>Action</Th>
        </Tr>
      </Thead>
      <Tbody>
        {shortcuts.map(({ label, description }) => (
          <Tr key={Array.isArray(label) ? label[0] : label}>
            <Td>{renderShortcutLabel(label)}</Td>
            <Td>
              <Text>{description}</Text>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );

  const renderLocalShortcuts = () => {
    if (page.isReader) {
      return (
        <>
          <Heading size="sm">Reader Shortcuts</Heading>
          {renderTable(readerShortcuts)}
        </>
      );
    }
    if (page.isFrequencyList) {
      return (
        <>
          <Heading size="sm">Frequency List Shortcuts</Heading>
          {renderTable(freqShortcuts)}
        </>
      );
    }
    return null;
  };

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} title="Info">
      {renderLocalShortcuts()}
      <Heading size="sm" color="gray.800">
        Global Shortcuts
      </Heading>
      {renderTable(globalShortcuts)}
    </Modal>
  );
};

export default InfoModal;
