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
import QBHubModal from '../components/QBHubModal';
import { usePage } from '../utils/routes';

type Shortcut = {
  description: JSX.Element | string;
  label: string[] | string;
};

const globalShortcuts = [
  {
    description: (
      <>
        Open <strong>Info</strong> (current popup)
      </>
    ),
    label: '?',
  },
  {
    description: (
      <>
        Open <strong>Settings</strong>
      </>
    ),
    label: 's',
  },
  {
    description: (
      <>
        Go to <strong>Tossup Reader</strong>
      </>
    ),
    label: '1',
  },
  {
    description: (
      <>
        Go to <strong>Bonus Reader</strong>
      </>
    ),
    label: '2',
  },
  {
    description: (
      <>
        Go to <strong>Frequency List</strong>
      </>
    ),
    label: '3',
  },
  {
    description: (
      <>
        Go to <strong>Clue Generator</strong>
      </>
    ),
    label: '4',
  },
  {
    description: (
      <>
        Go to <strong>About</strong>
      </>
    ),
    label: '5',
  },
];

const readerShortcuts = [
  { description: 'Start reading / Next question', label: 'n' },
  { description: 'Buzz', label: 'space' },
  { description: 'Open question history', label: 'h' },
];

const freqShortcuts = [
  { description: 'Previous page', label: ['p', '←'] },
  { description: 'Next page', label: ['n', '→'] },
];

type InfoModalProps = {
  closeModal: () => void;
  isOpen: boolean;
};

const InfoModal: React.FC<React.PropsWithChildren<InfoModalProps>> = ({
  closeModal,
  isOpen,
}) => {
  const page = usePage();

  const renderShortcutLabel = (label: string[] | string) => {
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
        {shortcuts.map(({ description, label }) => (
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
    <QBHubModal isOpen={isOpen} closeModal={closeModal} title="Info">
      {renderLocalShortcuts()}
      <Heading size="sm" color="gray.800">
        Global Shortcuts
      </Heading>
      {renderTable(globalShortcuts)}
    </QBHubModal>
  );
};

export default InfoModal;
