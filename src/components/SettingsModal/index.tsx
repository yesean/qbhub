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
import Select, { OptionsType } from 'react-select';

import { CATEGORIES, DIFFICULTIES } from '../../constants';
import { Categories, Difficulties } from '../../types';

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categoriesSelected: Categories[];
  setCategoriesSelected: React.Dispatch<React.SetStateAction<Categories[]>>;
  difficultiesSelected: Difficulties[];
  setDifficultiesSelected: React.Dispatch<React.SetStateAction<Difficulties[]>>;
};

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  categoriesSelected,
  setCategoriesSelected,
  difficultiesSelected,
  setDifficultiesSelected,
}) => {
  const categoriesInSelect = categoriesSelected.map((c) => ({
    value: c,
    label: Categories[c],
  }));
  const onCategoriesChange = (
    values: OptionsType<{ label: string; value: Categories }>
  ) => {
    setCategoriesSelected(values.map((v) => v.value));
  };
  const difficultiesInSelect = difficultiesSelected.map((d) => ({
    value: d,
    label: Difficulties[d],
  }));
  const onDifficultiesChange = (
    values: OptionsType<{ label: string; value: Difficulties }>
  ) => {
    setDifficultiesSelected(values.map((v) => v.value));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent m={4}>
        <ModalHeader>Settings</ModalHeader>
        <ModalBody>
          <Box mb={4}>
            <Select
              isMulti
              name="categories"
              options={CATEGORIES}
              value={categoriesInSelect}
              onChange={onCategoriesChange}
            />
          </Box>
          <Box>
            <Select
              isMulti
              name="difficulties"
              options={DIFFICULTIES}
              value={difficultiesInSelect}
              onChange={onDifficultiesChange}
            />
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
