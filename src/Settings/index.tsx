import {
  Box,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Select, { OptionsType } from 'react-select';
import { useAppDispatch } from '../app/hooks';
import { TealButton } from '../components/buttons';
import { useKeyboardShortcut } from '../hooks/keyboard';
import {
  Category,
  Difficulty,
  Subcategory,
  Tournament,
} from '../types/questions';
import {
  CATEGORIES,
  DIFFICULTIES,
  MAX_TOURNAMENT_YEAR,
  MIN_TOURNAMENT_YEAR,
  SUBCATEGORIES,
  TOURNAMENTS,
} from '../utils/constants';
import {
  close,
  selectSettings,
  updateCategories,
  updateDifficulties,
  updateFromYear,
  updateReadingSpeed,
  updateSubcategories,
  updateTournaments,
} from './settingsSlice';

const SettingsModal: React.FC<React.PropsWithChildren<unknown>> = () => {
  const {
    readingSpeed,
    categories,
    subcategories,
    difficulties,
    tournaments,
    fromYear,
    isOpen,
  } = useSelector(selectSettings);
  const dispatch = useAppDispatch();
  const closeModal = () => dispatch(close());
  useKeyboardShortcut('Escape', closeModal);

  const onReadingSpeedChange = (value: number) =>
    dispatch(updateReadingSpeed(value));

  const categoriesInSelect = categories.map((c) => ({
    value: c,
    label: Category[c],
  }));
  const onCategoriesChange = (
    options: OptionsType<{ label: string; value: Category }>,
  ) => {
    const newCategories = options.map((o) => o.value);
    dispatch(updateCategories(newCategories));
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
  };

  const tournamentsToDisplay = useMemo(
    () => TOURNAMENTS.filter(({ year }) => year >= fromYear),
    [fromYear],
  );
  const tournamentsInSelect = tournaments.map((t) => ({
    value: t,
    label: Tournament[t],
  }));
  const onTournamentsChange = (
    options: OptionsType<{ label: string; value: Tournament }>,
  ) => {
    const newTournaments = options.map((o) => o.value);
    dispatch(updateTournaments(newTournaments));
  };

  const onFromYearChange = (_: any, year: number) => {
    dispatch(updateFromYear(year));
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
          <Box mb={4}>
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
          <Box mb={4}>
            <Heading size="sm" mb={2} color="gray.800">
              Tournaments
            </Heading>
            <Select
              isMulti
              name="tournaments"
              options={tournamentsToDisplay}
              value={tournamentsInSelect}
              onChange={onTournamentsChange}
            />
          </Box>
          <Box>
            <Heading size="sm" mb={2} color="gray.800">
              From Year
            </Heading>
            <NumberInput
              value={fromYear}
              onChange={onFromYearChange}
              step={1}
              min={MIN_TOURNAMENT_YEAR}
              max={MAX_TOURNAMENT_YEAR}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
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
