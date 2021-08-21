import { Categories, Difficulties } from './types';

export const CATEGORIES = [
  { label: 'Mythology', value: Categories.Mythology },
  { label: 'Literature', value: Categories.Literature },
  { label: 'Trash', value: Categories.Trash },
  { label: 'Science', value: Categories.Science },
  { label: 'History', value: Categories.History },
  { label: 'Religion', value: Categories.Religion },
  { label: 'Geography', value: Categories.Geography },
  { label: 'Fine Arts', value: Categories.FineArts },
  { label: 'Social Science', value: Categories.SocialScience },
  { label: 'Philosophy', value: Categories.Philosophy },
  { label: 'Current Events', value: Categories.CurrentEvents },
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
