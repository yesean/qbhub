import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import Select from 'react-select';

import { CATEGORIES, DIFFICULTIES } from '../../constants';

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent m={4}>
        <ModalHeader>Settings</ModalHeader>
        <ModalBody>
          <Box mb={4}>
            <Select isMulti name="categories" options={CATEGORIES} />
          </Box>
          <Box>
            <Select isMulti name="difficulties" options={DIFFICULTIES} />
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="cyan" mr={3} onClick={onClose}>
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SettingsModal;
