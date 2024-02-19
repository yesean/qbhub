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
import { Category, Difficulty, Subcategory, Tournament } from '@qbhub/types';
import Select, { Options } from 'react-select';

import QBHubModal from '../components/QBHubModal';
import { useSettings } from '../hooks/useSettings';
import {
  CATEGORIES,
  CATEGORY_METADATA_BY_CATEGORY,
  DIFFICULTIES,
  DIFFICULTY_METADATA_BY_DIFFICULTY,
  SUBCATEGORIES,
  SUBCATEGORY_METADATA_BY_SUBCATEGORY,
  TOURNAMENT_METADATA_BY_TOURNAMENT,
  TOURNAMENTS,
} from '../utils/constants';
import {
  DEFAULT_READING_SPEED,
  MIN_TOURNAMENT_YEAR,
} from '../utils/settings/constants';
import { isTournamentValid } from '../utils/settings/validate';
import YearInput from './YearInput';

const categoryOptions = CATEGORIES.map(({ category, label }) => ({
  label,
  value: category,
}));
const subcategoryOptions = SUBCATEGORIES.map(({ label, subcategory }) => ({
  label,
  value: subcategory,
}));
const difficultyOptions = DIFFICULTIES.map(({ difficulty, label }) => ({
  label,
  value: difficulty,
}));
const tournamentOptions = TOURNAMENTS.map(({ label, tournament }) => ({
  label,
  value: tournament,
}));

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

  const filteredTournamentsForSelect = tournamentOptions.filter(({ value }) => {
    const tournamentMetadata = TOURNAMENT_METADATA_BY_TOURNAMENT[value];
    return isTournamentValid(tournamentMetadata, settings);
  });

  const categoriesInSelect = categories.map((category) => ({
    label: CATEGORY_METADATA_BY_CATEGORY[category].label,
    value: category,
  }));
  const subcategoriesInSelect = subcategories.map((subcategory) => ({
    label: SUBCATEGORY_METADATA_BY_SUBCATEGORY[subcategory].label,
    value: subcategory,
  }));
  const difficultiesInSelect = difficulties.map((difficulty) => ({
    label: DIFFICULTY_METADATA_BY_DIFFICULTY[difficulty].label,
    value: difficulty,
  }));
  const tournamentsInSelect = tournaments.map((tournament) => ({
    label: TOURNAMENT_METADATA_BY_TOURNAMENT[tournament].label,
    value: tournament,
  }));

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
            onChange={onReadingSpeedChange}
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
          options={categoryOptions}
          value={categoriesInSelect}
        />
        <SettingsMultiSelect
          label="Subcategories"
          onChange={onSubcategoriesChange}
          options={subcategoryOptions}
          value={subcategoriesInSelect}
        />
        <SettingsMultiSelect
          label="Difficulties"
          onChange={onDifficultiesChange}
          options={difficultyOptions}
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

// prevent select dropdown from getting overlapped, especially on mobile
const SELECT_MENU_PROPS = {
  menuPortalTarget: document.body,
  styles: { menuPortal: (base: CSSObject) => ({ ...base, zIndex: 9999 }) },
};

type SettingsMultiSelectProps<T> = {
  label: string;
  onChange: (value: Options<{ label: string; value: T }>) => void;
  options: { label: string; value: T }[];
  value: { label: string; value: T }[];
};

function SettingsMultiSelect<T>({
  label,
  ...rest
}: SettingsMultiSelectProps<T>) {
  return (
    <Box>
      <Heading color="gray.800" mb={2} size="sm">
        {label}
      </Heading>
      <Select isMulti name={label} {...rest} {...SELECT_MENU_PROPS} />
    </Box>
  );
}

export default SettingsModal;
