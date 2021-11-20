import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Kbd,
  Text,
} from '@chakra-ui/react';
import TealButton from '../TealButton';

type KeyboardShortcutsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      scrollBehavior="inside"
      isCentered
    >
      <ModalOverlay />
      <ModalContent m={4} maxH="max(75vh, 600px)">
        <ModalHeader>Keyboard Shortcuts</ModalHeader>
        <ModalBody pt={0} display="flex" flexDirection="column">
          <Table variant="simple" mb={4}>
            <Thead>
              <Tr>
                <Th>Key</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>
                  <Kbd>n</Kbd>
                </Td>
                <Td>
                  <Text> start reading / next question</Text>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Kbd>space</Kbd>
                </Td>
                <Td>buzz in to answer</Td>
              </Tr>
            </Tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <TealButton mr={3} onClick={onClose}>
            Done
          </TealButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default KeyboardShortcutsModal;
