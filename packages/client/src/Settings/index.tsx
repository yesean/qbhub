/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  Button,
  Flex,
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
import { CSSObject } from '@emotion/react';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Select, { Options } from 'react-select';
import { TealButton } from '../components/buttons';
import { useKeyboardShortcut } from '../hooks/keyboard';
import { useAppDispatch } from '../redux/hooks';
import {
  Category,
  Difficulty,
  QuestionParameter,
  Subcategory,
  Tournament,
} from '../types/questions';
import {
  CATEGORIES,
  CATEGORY_MAP,
  DIFFICULTIES,
  DIFFICULTY_MAP,
  MIN_TOURNAMENT_YEAR,
  SUBCATEGORIES,
  SUBCATEGORY_MAP,
  TOURNAMENTS,
  TOURNAMENT_MAP,
} from '../utils/constants';
import { validateFromYear } from '../utils/settings';
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
import YearInput from './YearInput';

const toSelect =
  <T extends QuestionParameter, U extends { name: string }>(
    map: Record<T, U>,
  ) =>
    (key: T) => ({
      label: map[key].name,
      value: key,
      data: map[key],
    });

const categoriesForSelect = CATEGORIES.map(toSelect(CATEGORY_MAP));
const subcategoriesForSelect = SUBCATEGORIES.map(toSelect(SUBCATEGORY_MAP));
const difficultiesForSelect = DIFFICULTIES.map(toSelect(DIFFICULTY_MAP));
const tournamentsForSelect = TOURNAMENTS.map(toSelect(TOURNAMENT_MAP));

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

  const categoriesInSelect = categories.map(toSelect(CATEGORY_MAP));
  const onCategoriesChange = (
    options: Options<{ label: string; value: Category }>,
  ) => {
    const newCategories = options.map((o) => o.value);
    dispatch(updateCategories(newCategories));
  };

  const subcategoriesInSelect = subcategories.map(toSelect(SUBCATEGORY_MAP));
  const onSubcategoriesChange = (
    options: Options<{ label: string; value: Subcategory }>,
  ) => {
    const newSubcategories = options.map((o) => o.value);
    dispatch(updateSubcategories(newSubcategories));
  };

  const difficultiesInSelect = difficulties.map(toSelect(DIFFICULTY_MAP));
  const onDifficultiesChange = (
    options: Options<{ label: string; value: Difficulty }>,
  ) => {
    const newDifficulties = options.map((o) => o.value);
    dispatch(updateDifficulties(newDifficulties));
  };

  const filteredTournamentsForSelect = useMemo(
    () =>
      tournamentsForSelect.filter(
        ({ data: { year, difficulty } }) =>
          year >= fromYear &&
          (difficulties.length === 0 || difficulties.includes(difficulty)),
      ),
    [difficulties, fromYear],
  );
  const tournamentsInSelect = tournaments.map(toSelect(TOURNAMENT_MAP));
  const onTournamentsChange = (
    options: Options<{ label: string; value: Tournament }>,
  ) => {
    const newTournaments = options.map((o) => o.value);
    dispatch(updateTournaments(newTournaments));
  };

  const onFromYearChange = (_: any, year: number) => {
    if (!validateFromYear(year)) return;

    dispatch(updateFromYear(year));
  };

  // prevent select dropdown from getting overlapped, especially on mobile
  const selectMenuProps = {
    menuPortalTarget: document.body,
    styles: { menuPortal: (base: CSSObject) => ({ ...base, zIndex: 9999 }) },
  };

  const resetFromYear = () => dispatch(updateFromYear(MIN_TOURNAMENT_YEAR));
  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="6xl" isCentered>
      <ModalOverlay />
      <ModalContent m={4} maxW="600px" maxH="max(75vh, 600px)">
        <ModalHeader>Settings</ModalHeader>
        <ModalBody overflow="auto">
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
              options={categoriesForSelect}
              value={categoriesInSelect}
              onChange={onCategoriesChange}
              {...selectMenuProps}
            />
          </Box>
          <Box mb={4}>
            <Heading size="sm" mb={2} color="gray.800">
              Subcategory
            </Heading>
            <Select
              isMulti
              name="subcategories"
              options={subcategoriesForSelect}
              value={subcategoriesInSelect}
              onChange={onSubcategoriesChange}
              {...selectMenuProps}
            />
          </Box>
          <Box mb={4}>
            <Heading size="sm" mb={2} color="gray.800">
              Difficulty
            </Heading>
            <Select
              isMulti
              name="difficulties"
              options={difficultiesForSelect}
              value={difficultiesInSelect}
              onChange={onDifficultiesChange}
              {...selectMenuProps}
            />
          </Box>
          <Box mb={4}>
            <Heading size="sm" mb={2} color="gray.800">
              Tournaments
            </Heading>
            <Select
              isMulti
              name="tournaments"
              options={filteredTournamentsForSelect}
              value={tournamentsInSelect}
              onChange={onTournamentsChange}
              {...selectMenuProps}
            />
          </Box>
          <Box>
            <Heading size="sm" mb={2} color="gray.800">
              From Year
            </Heading>
            <Flex gap={4}>
              <YearInput value={fromYear} onChange={onFromYearChange} />
              <Button onClick={resetFromYear}>All Years</Button>
            </Flex>
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
