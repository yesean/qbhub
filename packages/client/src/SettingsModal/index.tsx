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
    data: map[key],
    label: map[key].name,
    value: key,
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
  closeModal: () => void;
  isOpen: boolean;
};

const SettingsModal: React.FC<React.PropsWithChildren<SettingsModalProps>> = ({
  closeModal,
  isOpen,
}) => {
  const { setSettings, settings } = useSettings();

  const {
    categories,
    difficulties,
    fromYear,
    readingSpeed,
    subcategories,
    tournaments,
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
    <QBHubModal closeModal={closeModal} isOpen={isOpen} title="Settings">
      <Flex direction="column" gap={4}>
        <Box>
          <Heading color="gray.800" mb={2} size="sm">
            Reading Speed
          </Heading>
          <Slider
            aria-label="tossup reading speed"
            colorScheme="cyan"
            defaultValue={readingSpeed ?? DEFAULT_READING_SPEED}
            max={100}
            min={0}
            onChangeEnd={onReadingSpeedChange}
            step={5}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb bg="gray.500" />
          </Slider>
        </Box>
        <SettingsMultiSelect
          label="Category"
          onChange={onCategoriesChange}
          options={categoriesForSelect}
          value={categoriesInSelect}
        />
        <SettingsMultiSelect
          label="Subcategories"
          onChange={onSubcategoriesChange}
          options={subcategoriesForSelect}
          value={subcategoriesInSelect}
        />
        <SettingsMultiSelect
          label="Difficulties"
          onChange={onDifficultiesChange}
          options={difficultiesForSelect}
          value={difficultiesInSelect}
        />
        <SettingsMultiSelect
          label="Tournaments"
          onChange={onTournamentsChange}
          options={filteredTournamentsForSelect}
          value={tournamentsInSelect}
        />
        <Box>
          <Heading color="gray.800" mb={2} size="sm">
            From Year
          </Heading>
          <Flex gap={4}>
            <YearInput
              onChange={onFromYearChange}
              value={fromYear ?? MIN_TOURNAMENT_YEAR}
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
  onChange: (value: Options<{ data: U; label: string; value: T }>) => void;
  options: { data: U; label: string; value: T }[];
  value: { data: U; label: string; value: T }[];
};

function SettingsMultiSelect<T, U>({
  label,
  ...rest
}: SettingsMultiSelectProps<T, U>) {
  return (
    <Box>
      <Heading color="gray.800" mb={2} size="sm">
        {label}
      </Heading>
      <Select isMulti name={label} {...rest} {...selectMenuProps} />
    </Box>
  );
}

export default SettingsModal;
