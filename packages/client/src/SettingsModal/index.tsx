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
import Select, { Options } from 'react-select';
import QBHubModal from '../components/QBHubModal';
import { useKeyboardShortcut } from '../hooks/keyboard';
import { useSettings } from '../hooks/useSettings';
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

// prevent select dropdown from getting overlapped, especially on mobile
const selectMenuProps = {
  menuPortalTarget: document.body,
  styles: { menuPortal: (base: CSSObject) => ({ ...base, zIndex: 9999 }) },
};

const categoriesForSelect = CATEGORIES.map(toSelect(CATEGORY_MAP));
const subcategoriesForSelect = SUBCATEGORIES.map(toSelect(SUBCATEGORY_MAP));
const difficultiesForSelect = DIFFICULTIES.map(toSelect(DIFFICULTY_MAP));
const tournamentsForSelect = TOURNAMENTS.map(toSelect(TOURNAMENT_MAP));

type SettingsModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

const SettingsModal: React.FC<React.PropsWithChildren<SettingsModalProps>> = ({
  isOpen,
  closeModal,
}) => {
  const { settings, setSettings } = useSettings();

  useKeyboardShortcut('Escape', closeModal);

  const {
    categories,
    subcategories,
    difficulties,
    tournaments,
    fromYear,
    readingSpeed,
  } = settings;

  const filteredTournamentsForSelect = tournamentsForSelect.filter(({ data }) =>
    isTournamentValid(data, settings),
  );

  const categoriesInSelect = categories.map(toSelect(CATEGORY_MAP));
  const subcategoriesInSelect = subcategories.map(toSelect(SUBCATEGORY_MAP));
  const difficultiesInSelect = difficulties.map(toSelect(DIFFICULTY_MAP));
  const tournamentsInSelect = tournaments.map(toSelect(TOURNAMENT_MAP));

  const onReadingSpeedChange = (value: number) => {
    setSettings({ readingSpeed: value });
  };

  const onCategoriesChange = (
    options: Options<{ label: string; value: Category }>,
  ) => {
    const newCategories = options.map((o) => o.value);
    setSettings({ categories: newCategories });
  };

  const onSubcategoriesChange = (
    options: Options<{ label: string; value: Subcategory }>,
  ) => {
    const newSubcategories = options.map((o) => o.value);
    setSettings({ subcategories: newSubcategories });
  };

  const onDifficultiesChange = (
    options: Options<{ label: string; value: Difficulty }>,
  ) => {
    const newDifficulties = options.map((o) => o.value);
    setSettings({ difficulties: newDifficulties });
  };

  const onTournamentsChange = (
    options: Options<{ label: string; value: Tournament }>,
  ) => {
    const newTournaments = options.map((o) => o.value);
    setSettings({ tournaments: newTournaments });
  };

  const onFromYearChange = (_: any, year: number) =>
    setSettings({ fromYear: year });

  const resetFromYear = () => setSettings({ fromYear: MIN_TOURNAMENT_YEAR });

  return (
    <QBHubModal isOpen={isOpen} closeModal={closeModal} title="Settings">
      <Flex direction="column" gap={4}>
        <Box>
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
        <SettingsMultiSelect
          label="Category"
          options={categoriesForSelect}
          value={categoriesInSelect}
          onChange={onCategoriesChange}
        />
        <SettingsMultiSelect
          label="Subcategories"
          options={subcategoriesForSelect}
          value={subcategoriesInSelect}
          onChange={onSubcategoriesChange}
        />
        <SettingsMultiSelect
          label="Difficulties"
          options={difficultiesForSelect}
          value={difficultiesInSelect}
          onChange={onDifficultiesChange}
        />
        <SettingsMultiSelect
          label="Tournaments"
          options={filteredTournamentsForSelect}
          value={tournamentsInSelect}
          onChange={onTournamentsChange}
        />
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
      </Flex>
    </QBHubModal>
  );
};

type SettingsMultiSelectProps<T, U> = {
  label: string;
  options: { label: string; value: T; data: U }[];
  value: { label: string; value: T; data: U }[];
  onChange: (value: Options<{ label: string; value: T; data: U }>) => void;
};

function SettingsMultiSelect<T, U>({
  label,
  ...rest
}: SettingsMultiSelectProps<T, U>) {
  return (
    <Box>
      <Heading size="sm" mb={2} color="gray.800">
        {label}
      </Heading>
      <Select isMulti name={label} {...rest} {...selectMenuProps} />
    </Box>
  );
}

export default SettingsModal;
