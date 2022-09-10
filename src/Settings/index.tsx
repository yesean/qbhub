import {
  Box,
  Heading,
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
import { useDispatch, useSelector } from 'react-redux';
import Select, { OptionsType } from 'react-select';
import { TealButton } from '../components/buttons';
import { useKeyboardShortcut } from '../hooks/keyboard';
import { Category, Difficulty, Subcategory } from '../types/questions';
import {
  CATEGORIES,
  DIFFICULTIES,
  SUBCATEGORIES,
  SUBCATEGORY_MAP,
} from '../utils/constants';
import {
  saveCategories,
  saveDifficulties,
  saveReadingSpeed,
  saveSubcategories,
} from '../utils/settings';
import {
  close,
  selectSettings,
  updateCategories,
  updateDifficulties,
  updateReadingSpeed,
  updateSubcategories,
} from './settingsSlice';

const SettingsModal: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { readingSpeed, categories, subcategories, difficulties, isOpen } =
    useSelector(selectSettings);
  const dispatch = useDispatch();

  const closeModal = () => dispatch(close());

  useKeyboardShortcut('Escape', closeModal);

  const onReadingSpeedChange = (value: number) => {
    dispatch(updateReadingSpeed(value));
    saveReadingSpeed(value);
  };

  const categoriesInSelect = categories.map((c) => ({
    value: c,
    label: Category[c],
  }));
  const onCategoriesChange = (
    options: OptionsType<{ label: string; value: Category }>,
  ) => {
    const newCategories = options.map((o) => o.value);
    dispatch(updateCategories(newCategories));
    saveCategories(newCategories);

    const newSubcategories = subcategories.filter(
      (sc) => !newCategories.includes(SUBCATEGORY_MAP[sc]),
    );
    dispatch(updateSubcategories(newSubcategories));
    saveSubcategories(newSubcategories);
  };

  const subcategoriesInSelect = subcategories.map((c) => ({
    value: c,
    label: Subcategory[c],
  }));
  const onSubcategoriesChange = (
    options: OptionsType<{ label: string; value: Subcategory }>,
  ) => {
    const newSubcategories = options.map((o) => o.value);
    dispatch(updateSubcategories(newSubcategories));
    saveSubcategories(newSubcategories);

    const categoriesToExclude = new Set(
      newSubcategories.map((sc) => SUBCATEGORY_MAP[sc]),
    );
    const newCategories = categories.filter((c) => !categoriesToExclude.has(c));
    dispatch(updateCategories(newCategories));
    saveCategories(newCategories);
  };

  const difficultiesInSelect = difficulties.map((d) => ({
    value: d,
    label: Difficulty[d],
  }));
  const onDifficultiesChange = (
    options: OptionsType<{ label: string; value: Difficulty }>,
  ) => {
    const newDifficulties = options.map((o) => o.value);
    dispatch(updateDifficulties(newDifficulties));
    saveDifficulties(newDifficulties);
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="6xl" isCentered>
      <ModalOverlay />
      <ModalContent m={4} maxW="600px" maxH="max(75vh, 600px)">
        <ModalHeader>Settings</ModalHeader>
        <ModalBody>
          <Box mb={4}>
            <Heading size="sm" mb={2} color="gray.800">
              Reading Speed
            </Heading>
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
              <SliderThumb bg="gray.500" />
            </Slider>
          </Box>
          <Box mb={4}>
            <Heading size="sm" mb={2} color="gray.800">
              Category
            </Heading>
            <Select
              isMulti
              name="categories"
              options={CATEGORIES}
              value={categoriesInSelect}
              onChange={onCategoriesChange}
            />
          </Box>
          <Box mb={4}>
            <Heading size="sm" mb={2} color="gray.800">
              Subcategory
            </Heading>
            <Select
              isMulti
              name="subcategories"
              options={SUBCATEGORIES}
              value={subcategoriesInSelect}
              onChange={onSubcategoriesChange}
            />
          </Box>
          <Box>
            <Heading size="sm" mb={2} color="gray.800">
              Difficulty
            </Heading>
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
          <TealButton mr={3} onClick={closeModal}>
            Done
          </TealButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SettingsModal;
