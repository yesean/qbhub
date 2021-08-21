import { Categories, Difficulties } from './types';

export const CATEGORIES = [
  { label: 'Science', value: Categories.Science },
  { label: 'Literature', value: Categories.Literature },
  { label: 'History', value: Categories.History },
  { label: 'Fine Arts', value: Categories.FineArts },
  { label: 'Philosophy', value: Categories.Philosophy },
  { label: 'Social Science', value: Categories.SocialScience },
  { label: 'Geography', value: Categories.Geography },
  { label: 'Mythology', value: Categories.Mythology },
  { label: 'Religion', value: Categories.Religion },
  { label: 'Current Events', value: Categories.CurrentEvents },
  { label: 'Trash', value: Categories.Trash },
];

export const DIFFICULTIES = [
  { label: 'Middle School', value: Difficulties.MiddleSchool },
  { label: 'Easy High School', value: Difficulties.EasyHighSchool },
  { label: 'Regular High School', value: Difficulties.RegularHighSchool },
  { label: 'Hard High School', value: Difficulties.HardHighSchool },
  { label: 'National High School', value: Difficulties.NationalHighSchool },
  { label: 'Easy College', value: Difficulties.EasyCollege },
  { label: 'Regular College', value: Difficulties.RegularCollege },
  { label: 'Hard College', value: Difficulties.HardCollege },
  { label: 'Open', value: Difficulties.Open },
];
