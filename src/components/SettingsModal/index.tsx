import { useContext } from 'react';
import {
  Box,
  Button,
  FormLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react';
import Select, { OptionsType } from 'react-select';

import {
  CATEGORIES,
  DIFFICULTIES,
  SUBCATEGORIES,
  SUBCATEGORY_MAP,
} from '../../constants';
import { TossupSettingsContext } from '../../services/TossupSettingsContext';
import { Category, Difficulty, Subcategory } from '../../types';
import {
  setInitialCategories,
  setInitialDifficulties,
  setInitialReadingSpeed,
  setInitialSubcategories,
} from '../../services/utils';

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    readingSpeed,
    setReadingSpeed,
    categoriesSelected,
    setCategoriesSelected,
    subcategoriesSelected,
    setSubcategoriesSelected,
    difficultiesSelected,
    setDifficultiesSelected,
  } = useContext(TossupSettingsContext);

  const onReadingSpeedChange = (value: number) => {
    setReadingSpeed(value);
    setInitialReadingSpeed(value);
  };

  const categoriesInSelect = categoriesSelected.map((c) => ({
    value: c,
    label: Category[c],
  }));
  const onCategoriesChange = (
    options: OptionsType<{ label: string; value: Category }>,
  ) => {
    const values = options.map((o) => o.value);
    setCategoriesSelected(values);
    setSubcategoriesSelected((scs) =>
      scs.filter((sc) => values.includes(SUBCATEGORY_MAP[sc])),
    );
    setInitialCategories(values);
  };
  const subcategoriesInSelect = subcategoriesSelected.map((c) => ({
    value: c,
    label: Subcategory[c],
  }));
  const onSubcategoriesChange = (
    options: OptionsType<{ label: string; value: Subcategory }>,
  ) => {
    const values = options.map((o) => o.value);
    setSubcategoriesSelected(values);
    setInitialSubcategories(values);
  };
  const difficultiesInSelect = difficultiesSelected.map((d) => ({
    value: d,
    label: Difficulty[d],
  }));
  const onDifficultiesChange = (
    options: OptionsType<{ label: string; value: Difficulty }>,
  ) => {
    const values = options.map((o) => o.value);
    setDifficultiesSelected(values);
    setInitialDifficulties(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent m={4}>
        <ModalHeader>Settings</ModalHeader>
        <ModalBody>
          <Box mb={4}>
            <FormLabel>Reading Speed</FormLabel>
            <Slider
              aria-label="tossup reading speed"
              colorScheme="cyan"
              min={0}
              max={100}
              step={5}
              defaultValue={readingSpeed}
              onChange={onReadingSpeedChange}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>
          <Box mb={4}>
            <FormLabel>Category</FormLabel>
            <Select
              isMulti
              name="categories"
              options={CATEGORIES}
              value={categoriesInSelect}
              onChange={onCategoriesChange}
            />
          </Box>
          <Box mb={4}>
            <FormLabel>Subcategory</FormLabel>
            <Select
              isMulti
              name="subcategories"
              options={SUBCATEGORIES.filter(
                (sc) =>
                  categoriesInSelect.length === 0 ||
                  categoriesInSelect.some((c) => c.value === sc.category),
              )}
              value={subcategoriesInSelect}
              onChange={onSubcategoriesChange}
            />
          </Box>
          <Box>
            <FormLabel>Difficulty</FormLabel>
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
