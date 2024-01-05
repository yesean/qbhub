/* eslint-disable react/no-array-index-key */
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
import BonusHistorySummary from './BonusHistorySummary';
import BonusResults from './BonusResults';

type BonusHistoryModalProps = {
  closeModal: () => void;
  isOpen: boolean;
};

export default function BonusHistoryModal({
  closeModal,
  isOpen,
}: BonusHistoryModalProps) {
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
            <Box flexShrink={0}>
              <BonusHistorySummary />
            </Box>
            <BonusResults />
          </Flex>
        </ModalBody>
        <ModalFooter>
          <TealButton mr={3} onClick={closeModal}>
            Done
          </TealButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
