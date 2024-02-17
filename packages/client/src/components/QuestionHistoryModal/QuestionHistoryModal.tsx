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
import TealButton from '../buttons/TealButton';

type QuestionHistoryModalProps = {
  body: React.ReactElement;
  closeModal: () => void;
  isOpen: boolean;
  summaryHeader: React.ReactElement;
};

export default function QuestionHistoryModal({
  body,
  closeModal,
  isOpen,
  summaryHeader,
}: QuestionHistoryModalProps) {
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
        <ModalHeader>Bonus History</ModalHeader>
        <ModalBody>
          <Flex direction="column" gap={4} h="100%">
            <Box flexShrink={0}>{summaryHeader}</Box>
            {body}
          </Flex>
        </ModalBody>
        <ModalFooter>
          <TealButton onClick={closeModal}>Done</TealButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
