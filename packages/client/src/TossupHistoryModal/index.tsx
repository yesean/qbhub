import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import TealButton from '../components/buttons/TealButton';
import TossupHistorySummary from './TossupHistorySummary';
import TossupResults from './TossupResults';

type TossupHistoryModalProps = {
  closeModal: () => void;
  isOpen: boolean;
};

export default function TossupHistoryModal({
  closeModal,
  isOpen,
}: TossupHistoryModalProps) {
  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={closeModal}
      scrollBehavior="inside"
      size="6xl"
    >
      <ModalOverlay />
      <ModalContent h="max(75vh, 600px)" m={4} w="min(90vw, 1400px)">
        <ModalHeader>Tossup History</ModalHeader>
        <ModalBody>
          <Flex direction="column" gap={4} h="100%">
            <Box flexShrink={0}>
              <TossupHistorySummary />
            </Box>
            <TossupResults />
          </Flex>
        </ModalBody>
        <ModalFooter>
          <TealButton onClick={closeModal}>Done</TealButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
