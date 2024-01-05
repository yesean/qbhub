import {
  Box,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { selectTossupReader } from '../TossupReader/tossupReaderSlice';
import TealButton from '../components/buttons/TealButton';
import TossupHistorySummary from './TossupHistorySummary';
import TossupResults from './TossupResults';

type TossupHistoryModalProps = {
  closeModal: () => void;
  isOpen: boolean;
};

const TossupHistoryModal: React.FC<
  React.PropsWithChildren<TossupHistoryModalProps>
> = ({ closeModal, isOpen }) => {
  const { results } = useSelector(selectTossupReader);

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
        <ModalBody display="flex" flexDirection="column" gap={4}>
          <Box flexShrink={0}>
            <TossupHistorySummary />
          </Box>
          <TossupResults results={results} />
        </ModalBody>
        <ModalFooter>
          <TealButton onClick={closeModal}>Done</TealButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TossupHistoryModal;
