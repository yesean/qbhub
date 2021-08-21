import { Categories, Difficulties } from './types';

export const CATEGORIES = [
  { label: 'Science', value: Categories.Science },
  { label: 'Literature', value: Categories.Literature },
  { label: 'History', value: Categories.History },
  { label: 'Fine Arts', value: Categories['Fine Arts'] },
  { label: 'Philosophy', value: Categories.Philosophy },
  { label: 'Social Science', value: Categories['Social Science'] },
  { label: 'Geography', value: Categories.Geography },
  { label: 'Mythology', value: Categories.Mythology },
  { label: 'Religion', value: Categories.Religion },
  { label: 'Current Events', value: Categories['Current Events'] },
  { label: 'Trash', value: Categories.Trash },
];

export const DIFFICULTIES = [
  { label: 'Middle School', value: Difficulties['Middle School'] },
  { label: 'Easy High School', value: Difficulties['Easy High School'] },
  { label: 'Regular High School', value: Difficulties['Regular High School'] },
  { label: 'Hard High School', value: Difficulties['Hard High School'] },
  {
    label: 'National High School',
    value: Difficulties['National High School'],
  },
  { label: 'Easy College', value: Difficulties['Easy College'] },
  { label: 'Regular College', value: Difficulties['Regular College'] },
  { label: 'Hard College', value: Difficulties['Hard College'] },
  { label: 'Open', value: Difficulties.Open },
];
