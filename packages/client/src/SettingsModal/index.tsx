/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  Button,
  Flex,
  Heading,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react';
import { CSSObject } from '@emotion/react';
import {
  Category,
  Difficulty,
  SelectableQuestionParameter,
  Subcategory,
  Tournament,
} from '@qbhub/types';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Select, { Options } from 'react-select';
import Modal from '../components/Modal';
import { useKeyboardShortcut } from '../hooks/keyboard';
import { useSettings } from '../hooks/useSettings';
import { useAppDispatch } from '../redux/hooks';
import {
  CATEGORIES,
  CATEGORY_MAP,
  DIFFICULTIES,
  DIFFICULTY_MAP,
  SUBCATEGORIES,
  SUBCATEGORY_MAP,
  TOURNAMENTS,
  TOURNAMENT_MAP,
} from '../utils/constants';
import {
  DEFAULT_READING_SPEED,
  MIN_TOURNAMENT_YEAR,
} from '../utils/settings/constants';
import { isTournamentValid } from '../utils/settings/validate';
import { close, selectSettings } from './settingsSlice';
import YearInput from './YearInput';

const toSelect =
  <T extends SelectableQuestionParameter, U extends { name: string }>(
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
  const { isOpen } = useSelector(selectSettings);
  const { settings, setSettings } = useSettings();
  const {
    categories,
    subcategories,
    difficulties,
    tournaments,
    fromYear,
    readingSpeed,
  } = settings;
  const dispatch = useAppDispatch();
  const closeModal = () => dispatch(close());
  useKeyboardShortcut('Escape', closeModal);

  const onReadingSpeedChange = (value: number) => {
    setSettings({ readingSpeed: value });
  };

  const categoriesInSelect = categories.map(toSelect(CATEGORY_MAP));
  const onCategoriesChange = (
    options: Options<{ label: string; value: Category }>,
  ) => {
    const newCategories = options.map((o) => o.value);
    setSettings({ categories: newCategories });
  };

  const subcategoriesInSelect = subcategories.map(toSelect(SUBCATEGORY_MAP));
  const onSubcategoriesChange = (
    options: Options<{ label: string; value: Subcategory }>,
  ) => {
    const newSubcategories = options.map((o) => o.value);
    setSettings({ subcategories: newSubcategories });
  };

  const difficultiesInSelect = difficulties.map(toSelect(DIFFICULTY_MAP));
  const onDifficultiesChange = (
    options: Options<{ label: string; value: Difficulty }>,
  ) => {
    const newDifficulties = options.map((o) => o.value);
    setSettings({ difficulties: newDifficulties });
  };

  const filteredTournamentsForSelect = useMemo(
    () =>
      tournamentsForSelect.filter(({ data }) =>
        isTournamentValid(data, settings),
      ),
    [settings],
  );
  const tournamentsInSelect = tournaments.map(toSelect(TOURNAMENT_MAP));
  const onTournamentsChange = (
    options: Options<{ label: string; value: Tournament }>,
  ) => {
    const newTournaments = options.map((o) => o.value);
    setSettings({ tournaments: newTournaments });
  };

  const onFromYearChange = (_: any, year: number) =>
    setSettings({ fromYear: year });

  const resetFromYear = () => setSettings({ fromYear: MIN_TOURNAMENT_YEAR });

  // prevent select dropdown from getting overlapped, especially on mobile
  const selectMenuProps = {
    menuPortalTarget: document.body,
    styles: { menuPortal: (base: CSSObject) => ({ ...base, zIndex: 9999 }) },
  };

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} title="Settings">
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
          defaultValue={readingSpeed ?? DEFAULT_READING_SPEED}
          onChangeEnd={onReadingSpeedChange}
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
          <YearInput
            value={fromYear ?? MIN_TOURNAMENT_YEAR}
            onChange={onFromYearChange}
          />
          <Button onClick={resetFromYear}>All Years</Button>
        </Flex>
      </Box>
    </Modal>
  );
};

export default SettingsModal;
