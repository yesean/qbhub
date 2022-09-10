import {
  Category,
  Difficulty,
  Subcategory,
  Tournament,
} from '../types/questions';

export const CATEGORY_MAP = {
  [Category['Current Events']]: { name: 'Current Events' },
  [Category['Fine Arts']]: { name: 'Fine Arts' },
  [Category.Geography]: { name: 'Geography' },
  [Category.History]: { name: 'History' },
  [Category.Literature]: { name: 'Literature' },
  [Category.Mythology]: { name: 'Mythology' },
  [Category.Philosophy]: { name: 'Philosophy' },
  [Category.Religion]: { name: 'Religion' },
  [Category.Science]: { name: 'Science' },
  [Category['Social Science']]: { name: 'Social Science' },
  [Category.Trash]: { name: 'Trash' },
};

export const SUBCATEGORY_MAP = {
  [Subcategory['Current Events American']]: {
    name: 'Current Events American',
    category: Category['Current Events'],
  },
  [Subcategory['Current Events Other']]: {
    name: 'Current Events Other',
    category: Category['Current Events'],
  },
  [Subcategory['Fine Arts American']]: {
    name: 'Fine Arts American',
    category: Category['Fine Arts'],
  },
  [Subcategory['Fine Arts Audiovisual']]: {
    name: 'Fine Arts Audiovisual',
    category: Category['Fine Arts'],
  },
  [Subcategory['Fine Arts Auditory']]: {
    name: 'Fine Arts Auditory',
    category: Category['Fine Arts'],
  },
  [Subcategory['Fine Arts British']]: {
    name: 'Fine Arts British',
    category: Category['Fine Arts'],
  },
  [Subcategory['Fine Arts European']]: {
    name: 'Fine Arts European',
    category: Category['Fine Arts'],
  },
  [Subcategory['Fine Arts Opera']]: {
    name: 'Fine Arts Opera',
    category: Category['Fine Arts'],
  },
  [Subcategory['Fine Arts Other']]: {
    name: 'Fine Arts Other',
    category: Category['Fine Arts'],
  },
  [Subcategory['Fine Arts Visual']]: {
    name: 'Fine Arts Visual',
    category: Category['Fine Arts'],
  },
  [Subcategory['Fine Arts World']]: {
    name: 'Fine Arts World',
    category: Category['Fine Arts'],
  },
  [Subcategory['Geography American']]: {
    name: 'Geography American',
    category: Category.Geography,
  },
  [Subcategory['Geography World']]: {
    name: 'Geography World',
    category: Category.Geography,
  },
  [Subcategory['History American']]: {
    name: 'History American',
    category: Category.History,
  },
  [Subcategory['History British']]: {
    name: 'History British',
    category: Category.History,
  },
  [Subcategory['History Classical']]: {
    name: 'History Classical',
    category: Category.History,
  },
  [Subcategory['History European']]: {
    name: 'History European',
    category: Category.History,
  },
  [Subcategory['History Other']]: {
    name: 'History Other',
    category: Category.History,
  },
  [Subcategory['History World']]: {
    name: 'History World',
    category: Category.History,
  },
  [Subcategory['Literature American']]: {
    name: 'Literature American',
    category: Category.Literature,
  },
  [Subcategory['Literature British']]: {
    name: 'Literature British',
    category: Category.Literature,
  },
  [Subcategory['Literature Classical']]: {
    name: 'Literature Classical',
    category: Category.Literature,
  },
  [Subcategory['Literature European']]: {
    name: 'Literature European',
    category: Category.Literature,
  },
  [Subcategory['Literature Other']]: {
    name: 'Literature Other',
    category: Category.Literature,
  },
  [Subcategory['Literature World']]: {
    name: 'Literature World',
    category: Category.Literature,
  },
  [Subcategory['Mythology American']]: {
    name: 'Mythology American',
    category: Category.Mythology,
  },
  [Subcategory['Mythology Chinese']]: {
    name: 'Mythology Chinese',
    category: Category.Mythology,
  },
  [Subcategory['Mythology Egyptian']]: {
    name: 'Mythology Egyptian',
    category: Category.Mythology,
  },
  [Subcategory['Mythology Greco-Roman']]: {
    name: 'Mythology Greco-Roman',
    category: Category.Mythology,
  },
  [Subcategory['Mythology Indian']]: {
    name: 'Mythology Indian',
    category: Category.Mythology,
  },
  [Subcategory['Mythology Japanese']]: {
    name: 'Mythology Japanese',
    category: Category.Mythology,
  },
  [Subcategory['Mythology Norse']]: {
    name: 'Mythology Norse',
    category: Category.Mythology,
  },
  [Subcategory['Mythology Other']]: {
    name: 'Mythology Other',
    category: Category.Mythology,
  },
  [Subcategory['Mythology Other East Asian']]: {
    name: 'Mythology Other East Asian',
    category: Category.Mythology,
  },
  [Subcategory['Philosophy American']]: {
    name: 'Philosophy American',
    category: Category.Philosophy,
  },
  [Subcategory['Philosophy Classical']]: {
    name: 'Philosophy Classical',
    category: Category.Philosophy,
  },
  [Subcategory['Philosophy East Asian']]: {
    name: 'Philosophy East Asian',
    category: Category.Philosophy,
  },
  [Subcategory['Philosophy European']]: {
    name: 'Philosophy European',
    category: Category.Philosophy,
  },
  [Subcategory['Philosophy Other']]: {
    name: 'Philosophy Other',
    category: Category.Philosophy,
  },
  [Subcategory['Religion American']]: {
    name: 'Religion American',
    category: Category.Religion,
  },
  [Subcategory['Religion Christianity']]: {
    name: 'Religion Christianity',
    category: Category.Religion,
  },
  [Subcategory['Religion East Asian']]: {
    name: 'Religion East Asian',
    category: Category.Religion,
  },
  [Subcategory['Religion Islam']]: {
    name: 'Religion Islam',
    category: Category.Religion,
  },
  [Subcategory['Religion Judaism']]: {
    name: 'Religion Judaism',
    category: Category.Religion,
  },
  [Subcategory['Religion Other']]: {
    name: 'Religion Other',
    category: Category.Religion,
  },
  [Subcategory['Science American']]: {
    name: 'Science American',
    category: Category.Science,
  },
  [Subcategory['Science Biology']]: {
    name: 'Science Biology',
    category: Category.Science,
  },
  [Subcategory['Science Chemistry']]: {
    name: 'Science Chemistry',
    category: Category.Science,
  },
  [Subcategory['Science Computer Science']]: {
    name: 'Science Computer Science',
    category: Category.Science,
  },
  [Subcategory['Science Math']]: {
    name: 'Science Math',
    category: Category.Science,
  },
  [Subcategory['Science Other']]: {
    name: 'Science Other',
    category: Category.Science,
  },
  [Subcategory['Science Physics']]: {
    name: 'Science Physics',
    category: Category.Science,
  },
  [Subcategory['Science World']]: {
    name: 'Science World',
    category: Category.Science,
  },
  [Subcategory['Social Science American']]: {
    name: 'Social Science American',
    category: Category['Social Science'],
  },
  [Subcategory['Social Science Anthropology']]: {
    name: 'Social Science Anthropology',
    category: Category['Social Science'],
  },
  [Subcategory['Social Science Economics']]: {
    name: 'Social Science Economics',
    category: Category['Social Science'],
  },
  [Subcategory['Social Science Linguistics']]: {
    name: 'Social Science Linguistics',
    category: Category['Social Science'],
  },
  [Subcategory['Social Science Other']]: {
    name: 'Social Science Other',
    category: Category['Social Science'],
  },
  [Subcategory['Social Science Political Science']]: {
    name: 'Social Science Political Science',
    category: Category['Social Science'],
  },
  [Subcategory['Social Science Psychology']]: {
    name: 'Social Science Psychology',
    category: Category['Social Science'],
  },
  [Subcategory['Social Science Sociology']]: {
    name: 'Social Science Sociology',
    category: Category['Social Science'],
  },
  [Subcategory['Trash American']]: {
    name: 'Trash American',
    category: Category.Trash,
  },
  [Subcategory['Trash Movies']]: {
    name: 'Trash Movies',
    category: Category.Trash,
  },
  [Subcategory['Trash Music']]: {
    name: 'Trash Music',
    category: Category.Trash,
  },
  [Subcategory['Trash Other']]: {
    name: 'Trash Other',
    category: Category.Trash,
  },
  [Subcategory['Trash Sports']]: {
    name: 'Trash Sports',
    category: Category.Trash,
  },
  [Subcategory['Trash Television']]: {
    name: 'Trash Television',
    category: Category.Trash,
  },
  [Subcategory['Trash Video Games']]: {
    name: 'Trash Video Games',
    category: Category.Trash,
  },
};

export const DIFFICULTY_MAP = {
  [Difficulty['Middle School']]: { name: 'Middle School' },
  [Difficulty['Easy High School']]: { name: 'Easy High School' },
  [Difficulty['Regular High School']]: { name: 'Regular High School' },
  [Difficulty['Hard High School']]: { name: 'Hard High School' },
  [Difficulty['National High School']]: { name: 'National High School' },
  [Difficulty['Easy College']]: { name: 'Easy College' },
  [Difficulty['Regular College']]: { name: 'Regular College' },
  [Difficulty['Hard College']]: { name: 'Hard College' },
  [Difficulty.Open]: { name: 'Open' },
};

export const TOURNAMENT_MAP = {
  [Tournament['2020 CALISTO']]: {
    name: '2020 CALISTO',
    year: 2020,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2020 Oxford Online']]: {
    name: '2020 Oxford Online',
    year: 2020,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2020 Terrapin']]: {
    name: '2020 Terrapin',
    year: 2020,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['Tree of Clues']]: {
    name: 'Tree of Clues',
    year: 2020,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2019 ACF Fall']]: {
    name: '2019 ACF Fall',
    year: 2019,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2019 ACF Regionals']]: {
    name: '2019 ACF Regionals',
    year: 2019,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2019 BHSAT']]: {
    name: '2019 BHSAT',
    year: 2019,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2019 Chicago Open']]: {
    name: '2019 Chicago Open',
    year: 2019,
    difficulty: Difficulty.Open,
  },
  [Tournament['2019 Early Fall Tournament (EFT)']]: {
    name: '2019 Early Fall Tournament (EFT)',
    year: 2019,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2019 HFT XIV']]: {
    name: '2019 HFT XIV',
    year: 2019,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2019 ILLIAC']]: {
    name: '2019 ILLIAC',
    year: 2019,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2019 LOGIC']]: {
    name: '2019 LOGIC',
    year: 2019,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2019 NASAT']]: {
    name: '2019 NASAT',
    year: 2019,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2019 PACE NSC']]: {
    name: '2019 PACE NSC',
    year: 2019,
    difficulty: Difficulty['National High School'],
  },
  [Tournament['2019 PIANO']]: {
    name: '2019 PIANO',
    year: 2019,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2019 Prison Bowl']]: {
    name: '2019 Prison Bowl',
    year: 2019,
    difficulty: Difficulty['National High School'],
  },
  [Tournament['2019 Richard Montgomery Blair Academic Tournament']]: {
    name: '2019 Richard Montgomery Blair Academic Tournament',
    year: 2019,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2019 Spartan Housewrite']]: {
    name: '2019 Spartan Housewrite',
    year: 2019,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2019 Terrapin']]: {
    name: '2019 Terrapin',
    year: 2019,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2019 The Unanswered Question']]: {
    name: '2019 The Unanswered Question',
    year: 2019,
    difficulty: Difficulty.Open,
  },
  [Tournament['2018 ACF Fall']]: {
    name: '2018 ACF Fall',
    year: 2018,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2018 ACF Nationals']]: {
    name: '2018 ACF Nationals',
    year: 2018,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2018 ACF Regionals']]: {
    name: '2018 ACF Regionals',
    year: 2018,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2018 BHSAT']]: {
    name: '2018 BHSAT',
    year: 2018,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2018 Cambridge Open']]: {
    name: '2018 Cambridge Open',
    year: 2018,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2018 Chicago Open']]: {
    name: '2018 Chicago Open',
    year: 2018,
    difficulty: Difficulty.Open,
  },
  [Tournament['2018 Chicago Open Trash']]: {
    name: '2018 Chicago Open Trash',
    year: 2018,
    difficulty: Difficulty.Open,
  },
  [Tournament['2018 CMST']]: {
    name: '2018 CMST',
    year: 2018,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2018 Early Fall Tournament (EFT)']]: {
    name: '2018 Early Fall Tournament (EFT)',
    year: 2018,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2018 FACTS']]: {
    name: '2018 FACTS',
    year: 2018,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2018 Great Lakes Regional Academic Championship (GLRAC)']]: {
    name: '2018 Great Lakes Regional Academic Championship (GLRAC)',
    year: 2018,
    difficulty: Difficulty['Easy High School'],
  },
  [Tournament['2018 HFT XIII']]: {
    name: '2018 HFT XIII',
    year: 2018,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2018 Historature']]: {
    name: '2018 Historature',
    year: 2018,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2018 HORROR 1']]: {
    name: '2018 HORROR 1',
    year: 2018,
    difficulty: Difficulty.Open,
  },
  [Tournament['2018 IMSAnity 5']]: {
    name: '2018 IMSAnity 5',
    year: 2018,
    difficulty: Difficulty['National High School'],
  },
  [Tournament['2018 Montgomery Blair Academic Tournament (MBAT)']]: {
    name: '2018 Montgomery Blair Academic Tournament (MBAT)',
    year: 2018,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2018 NASAT']]: {
    name: '2018 NASAT',
    year: 2018,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2018 PACE NSC']]: {
    name: '2018 PACE NSC',
    year: 2018,
    difficulty: Difficulty['National High School'],
  },
  [Tournament['2018 Penn Bowl']]: {
    name: '2018 Penn Bowl',
    year: 2018,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2018 Prison Bowl XI']]: {
    name: '2018 Prison Bowl XI',
    year: 2018,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2018 RAPTURE']]: {
    name: '2018 RAPTURE',
    year: 2018,
    difficulty: Difficulty.Open,
  },
  [Tournament['2018 Scattergories 2']]: {
    name: '2018 Scattergories 2',
    year: 2018,
    difficulty: Difficulty.Open,
  },
  [Tournament['2018 SMT']]: {
    name: '2018 SMT',
    year: 2018,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2018 Sun God Invitational']]: {
    name: '2018 Sun God Invitational',
    year: 2018,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament.FILM]: {
    name: 'FILM',
    year: 2018,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['Words and Objects']]: {
    name: 'Words and Objects',
    year: 2018,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament.WORLDSTAR]: {
    name: 'WORLDSTAR',
    year: 2018,
    difficulty: Difficulty.Open,
  },
  [Tournament['2017 ACF Fall']]: {
    name: '2017 ACF Fall',
    year: 2017,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2017 ACF Nationals']]: {
    name: '2017 ACF Nationals',
    year: 2017,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2017 ACF Regionals']]: {
    name: '2017 ACF Regionals',
    year: 2017,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2017 BHSAT']]: {
    name: '2017 BHSAT',
    year: 2017,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2017 Chicago Open']]: {
    name: '2017 Chicago Open',
    year: 2017,
    difficulty: Difficulty.Open,
  },
  [Tournament['2017 Early Fall Tournament (EFT)']]: {
    name: '2017 Early Fall Tournament (EFT)',
    year: 2017,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2017 EMT']]: {
    name: '2017 EMT',
    year: 2017,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2017 Fine Arts Common Links']]: {
    name: '2017 Fine Arts Common Links',
    year: 2017,
    difficulty: Difficulty.Open,
  },
  [Tournament['2017 FRENCH']]: {
    name: '2017 FRENCH',
    year: 2017,
    difficulty: Difficulty.Open,
  },
  [Tournament['2017 Geography Monstrosity']]: {
    name: '2017 Geography Monstrosity',
    year: 2017,
    difficulty: Difficulty.Open,
  },
  [Tournament['2017 GSAC XXV']]: {
    name: '2017 GSAC XXV',
    year: 2017,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2017 HFT XII']]: {
    name: '2017 HFT XII',
    year: 2017,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2017 History Bee Nationals']]: {
    name: '2017 History Bee Nationals',
    year: 2017,
    difficulty: Difficulty['National High School'],
  },
  [Tournament["2017 It's Lit"]]: {
    name: "2017 It's Lit",
    year: 2017,
    difficulty: Difficulty.Open,
  },
  [Tournament['2017 JAKOB']]: {
    name: '2017 JAKOB',
    year: 2017,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2017 Jordaens Visual Arts']]: {
    name: '2017 Jordaens Visual Arts',
    year: 2017,
    difficulty: Difficulty.Open,
  },
  [Tournament['2017 Letras']]: {
    name: '2017 Letras',
    year: 2017,
    difficulty: Difficulty.Open,
  },
  [Tournament['2017 LIST (Ladue Invitational Spring Tournament) VI']]: {
    name: '2017 LIST (Ladue Invitational Spring Tournament) VI',
    year: 2017,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2017 MASSOLIT']]: {
    name: '2017 MASSOLIT',
    year: 2017,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2017 Math Monstrosity']]: {
    name: '2017 Math Monstrosity',
    year: 2017,
    difficulty: Difficulty.Open,
  },
  [Tournament['2017 NASAT']]: {
    name: '2017 NASAT',
    year: 2017,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2017 Naveed Bork Memorial Tournament']]: {
    name: '2017 Naveed Bork Memorial Tournament',
    year: 2017,
    difficulty: Difficulty.Open,
  },
  [Tournament['2017 PACE NSC']]: {
    name: '2017 PACE NSC',
    year: 2017,
    difficulty: Difficulty['National High School'],
  },
  [Tournament['2017 Penn Bowl']]: {
    name: '2017 Penn Bowl',
    year: 2017,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2017 Philly Cheesteak']]: {
    name: '2017 Philly Cheesteak',
    year: 2017,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2017 Prison Bowl X']]: {
    name: '2017 Prison Bowl X',
    year: 2017,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2017 RMBCT']]: {
    name: '2017 RMBCT',
    year: 2017,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2017 Scattergories']]: {
    name: '2017 Scattergories',
    year: 2017,
    difficulty: Difficulty.Open,
  },
  [Tournament['2017 Sivakumar Day Inter-Nationals']]: {
    name: '2017 Sivakumar Day Inter-Nationals',
    year: 2017,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2017 (This) Tournament is a Crime']]: {
    name: '2017 (This) Tournament is a Crime',
    year: 2017,
    difficulty: Difficulty.Open,
  },
  [Tournament['2017 WAO II']]: {
    name: '2017 WAO II',
    year: 2017,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2017 WHAQ II']]: {
    name: '2017 WHAQ II',
    year: 2017,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2017 XENOPHON']]: {
    name: '2017 XENOPHON',
    year: 2017,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['GRAB BAG']]: {
    name: 'GRAB BAG',
    year: 2017,
    difficulty: Difficulty.Open,
  },
  [Tournament['2016 A Bit of Lit']]: {
    name: '2016 A Bit of Lit',
    year: 2016,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2016 ACF Fall']]: {
    name: '2016 ACF Fall',
    year: 2016,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2016 ACF Nationals']]: {
    name: '2016 ACF Nationals',
    year: 2016,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2016 ACF Regionals']]: {
    name: '2016 ACF Regionals',
    year: 2016,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2016 ACF Regionals ']]: {
    name: '2016 ACF Regionals ',
    year: 2016,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2016 A Culture of Improvement']]: {
    name: '2016 A Culture of Improvement',
    year: 2016,
    difficulty: Difficulty.Open,
  },
  [Tournament['2016 BHSAT']]: {
    name: '2016 BHSAT',
    year: 2016,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2016 Chicago Open']]: {
    name: '2016 Chicago Open',
    year: 2016,
    difficulty: Difficulty.Open,
  },
  [Tournament['2016 Christmas Present']]: {
    name: '2016 Christmas Present',
    year: 2016,
    difficulty: Difficulty.Open,
  },
  [Tournament['2016 CLEAR II']]: {
    name: '2016 CLEAR II',
    year: 2016,
    difficulty: Difficulty.Open,
  },
  [Tournament['2016 Delta Burke']]: {
    name: '2016 Delta Burke',
    year: 2016,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2016 Early Fall Tournament (EFT)']]: {
    name: '2016 Early Fall Tournament (EFT)',
    year: 2016,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2016 Geography Monstrosity']]: {
    name: '2016 Geography Monstrosity',
    year: 2016,
    difficulty: Difficulty.Open,
  },
  [Tournament['2016 HFT XI']]: {
    name: '2016 HFT XI',
    year: 2016,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2016 Listory']]: {
    name: '2016 Listory',
    year: 2016,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2016 MLK']]: {
    name: '2016 MLK',
    year: 2016,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2016 MUT']]: {
    name: '2016 MUT',
    year: 2016,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2016 MYSTERIUM']]: {
    name: '2016 MYSTERIUM',
    year: 2016,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2016 NASAT']]: {
    name: '2016 NASAT',
    year: 2016,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2016 PACE NSC']]: {
    name: '2016 PACE NSC',
    year: 2016,
    difficulty: Difficulty['National High School'],
  },
  [Tournament['2016 Penn Bowl']]: {
    name: '2016 Penn Bowl',
    year: 2016,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2016 Scobol Solo']]: {
    name: '2016 Scobol Solo',
    year: 2016,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2016 SCOP MS 6']]: {
    name: '2016 SCOP MS 6',
    year: 2016,
    difficulty: Difficulty['Middle School'],
  },
  [Tournament['"2016 ""stanford housewrite"""']]: {
    name: '"2016 ""stanford housewrite"""',
    year: 2016,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2016 Terrapin']]: {
    name: '2016 Terrapin',
    year: 2016,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2016 WAO']]: {
    name: '2016 WAO',
    year: 2016,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2016 WHAQ I']]: {
    name: '2016 WHAQ I',
    year: 2016,
    difficulty: Difficulty['Easy High School'],
  },
  [Tournament.GRAPHIC]: {
    name: 'GRAPHIC',
    year: 2016,
    difficulty: Difficulty.Open,
  },
  [Tournament['2015 ACF Fall']]: {
    name: '2015 ACF Fall',
    year: 2015,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2015 ACF Nationals']]: {
    name: '2015 ACF Nationals',
    year: 2015,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2015 ACF Regionals']]: {
    name: '2015 ACF Regionals',
    year: 2015,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2015 ACF Regionals ']]: {
    name: '2015 ACF Regionals ',
    year: 2015,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2015 BASK']]: {
    name: '2015 BASK',
    year: 2015,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2015 BHSAT']]: {
    name: '2015 BHSAT',
    year: 2015,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament["2015 BISB (Brookwood Invitational Scholars' Bowl)"]]: {
    name: "2015 BISB (Brookwood Invitational Scholars' Bowl)",
    year: 2015,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2015 Chicago Open']]: {
    name: '2015 Chicago Open',
    year: 2015,
    difficulty: Difficulty.Open,
  },
  [Tournament['2015 Chicago Open History']]: {
    name: '2015 Chicago Open History',
    year: 2015,
    difficulty: Difficulty.Open,
  },
  [Tournament['2015 Chicago Open Visual Arts']]: {
    name: '2015 Chicago Open Visual Arts',
    year: 2015,
    difficulty: Difficulty.Open,
  },
  [Tournament['2015 Claude Shannon Memorial Tournament']]: {
    name: '2015 Claude Shannon Memorial Tournament',
    year: 2015,
    difficulty: Difficulty.Open,
  },
  [Tournament['2015 Delta Burke']]: {
    name: '2015 Delta Burke',
    year: 2015,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2015 Geography Monstrosity']]: {
    name: '2015 Geography Monstrosity',
    year: 2015,
    difficulty: Difficulty.Open,
  },
  [Tournament['2015 George Oppen']]: {
    name: '2015 George Oppen',
    year: 2015,
    difficulty: Difficulty.Open,
  },
  [Tournament['2015 GSAC XXIII']]: {
    name: '2015 GSAC XXIII',
    year: 2015,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2015 HFT X']]: {
    name: '2015 HFT X',
    year: 2015,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2015 Maryland Fall']]: {
    name: '2015 Maryland Fall',
    year: 2015,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2015 Missouri Open']]: {
    name: '2015 Missouri Open',
    year: 2015,
    difficulty: Difficulty.Open,
  },
  [Tournament['2015 MUT']]: {
    name: '2015 MUT',
    year: 2015,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2015 NASAT']]: {
    name: '2015 NASAT',
    year: 2015,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2015 NASAT ']]: {
    name: '2015 NASAT ',
    year: 2015,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2015 PACE NSC']]: {
    name: '2015 PACE NSC',
    year: 2015,
    difficulty: Difficulty['National High School'],
  },
  [Tournament['2015 Penn Bowl']]: {
    name: '2015 Penn Bowl',
    year: 2015,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2015 Prison Bowl VIII']]: {
    name: '2015 Prison Bowl VIII',
    year: 2015,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2015 RILKE']]: {
    name: '2015 RILKE',
    year: 2015,
    difficulty: Difficulty.Open,
  },
  [Tournament['2015 SCOP MS 5']]: {
    name: '2015 SCOP MS 5',
    year: 2015,
    difficulty: Difficulty['Middle School'],
  },
  [Tournament['2015 SHEIKH']]: {
    name: '2015 SHEIKH',
    year: 2015,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2015 STIMPY']]: {
    name: '2015 STIMPY',
    year: 2015,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2015 VCU Open']]: {
    name: '2015 VCU Open',
    year: 2015,
    difficulty: Difficulty.Open,
  },
  [Tournament['2015 VICO']]: {
    name: '2015 VICO',
    year: 2015,
    difficulty: Difficulty.Open,
  },
  [Tournament['2015 We Have Never Been Modern']]: {
    name: '2015 We Have Never Been Modern',
    year: 2015,
    difficulty: Difficulty.Open,
  },
  [Tournament['2014 ACF Fall']]: {
    name: '2014 ACF Fall',
    year: 2014,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2014 ACF Fall ']]: {
    name: '2014 ACF Fall ',
    year: 2014,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2014 ACF Nationals']]: {
    name: '2014 ACF Nationals',
    year: 2014,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2014 ACF Regionals']]: {
    name: '2014 ACF Regionals',
    year: 2014,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2014 ACF Regionals 2014']]: {
    name: '2014 ACF Regionals 2014',
    year: 2014,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2014 BELLOCO']]: {
    name: '2014 BELLOCO',
    year: 2014,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2014 BHSAT']]: {
    name: '2014 BHSAT',
    year: 2014,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2014 Cane Ridge Revival']]: {
    name: '2014 Cane Ridge Revival',
    year: 2014,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2014 Cheyne American History People']]: {
    name: '2014 Cheyne American History People',
    year: 2014,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2014 Cheyne American Thought']]: {
    name: '2014 Cheyne American Thought',
    year: 2014,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2014 Chicago Open']]: {
    name: '2014 Chicago Open',
    year: 2014,
    difficulty: Difficulty.Open,
  },
  [Tournament['2014 College History Bowl']]: {
    name: '2014 College History Bowl',
    year: 2014,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2014 DEES']]: {
    name: '2014 DEES',
    year: 2014,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2014 Delta Burke']]: {
    name: '2014 Delta Burke',
    year: 2014,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2014 Geography Monstrosity']]: {
    name: '2014 Geography Monstrosity',
    year: 2014,
    difficulty: Difficulty.Open,
  },
  [Tournament['2014 Gorilla Lit']]: {
    name: '2014 Gorilla Lit',
    year: 2014,
    difficulty: Difficulty.Open,
  },
  [Tournament['2014 GSAC']]: {
    name: '2014 GSAC',
    year: 2014,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2014 ICCS']]: {
    name: '2014 ICCS',
    year: 2014,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2014 LIST IV']]: {
    name: '2014 LIST IV',
    year: 2014,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2014 Masonic']]: {
    name: '2014 Masonic',
    year: 2014,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2014 Mavis Gallant Memorial']]: {
    name: '2014 Mavis Gallant Memorial',
    year: 2014,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2014 Michigan Fall Tournament']]: {
    name: '2014 Michigan Fall Tournament',
    year: 2014,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2014 MUT']]: {
    name: '2014 MUT',
    year: 2014,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2014 NASAT']]: {
    name: '2014 NASAT',
    year: 2014,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2014 NASAT ']]: {
    name: '2014 NASAT ',
    year: 2014,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2014 New Trier Scobol Solo']]: {
    name: '2014 New Trier Scobol Solo',
    year: 2014,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2014 PACE NSC']]: {
    name: '2014 PACE NSC',
    year: 2014,
    difficulty: Difficulty['National High School'],
  },
  [Tournament['2014 Padawan']]: {
    name: '2014 Padawan',
    year: 2014,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2014 PADAWAN']]: {
    name: '2014 PADAWAN',
    year: 2014,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2014 Penn Bowl']]: {
    name: '2014 Penn Bowl',
    year: 2014,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2014 Prison Bowl']]: {
    name: '2014 Prison Bowl',
    year: 2014,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2014 SCOP Novice']]: {
    name: '2014 SCOP Novice',
    year: 2014,
    difficulty: Difficulty['Easy High School'],
  },
  [Tournament['2014 SUBMIT']]: {
    name: '2014 SUBMIT',
    year: 2014,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2014 VCU Open']]: {
    name: '2014 VCU Open',
    year: 2014,
    difficulty: Difficulty.Open,
  },
  [Tournament['2014 VCU Open ']]: {
    name: '2014 VCU Open ',
    year: 2014,
    difficulty: Difficulty.Open,
  },
  [Tournament['Lederberg Memorial Science Tournament 2: Daughter Cell']]: {
    name: 'Lederberg Memorial Science Tournament 2: Daughter Cell',
    year: 2014,
    difficulty: Difficulty.Open,
  },
  [Tournament['2013 ACF Fall']]: {
    name: '2013 ACF Fall',
    year: 2013,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2013 ACF Nationals']]: {
    name: '2013 ACF Nationals',
    year: 2013,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2013 ACF Nationals ']]: {
    name: '2013 ACF Nationals ',
    year: 2013,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2013 ACF Regionals']]: {
    name: '2013 ACF Regionals',
    year: 2013,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2013 Angels in the Architecture']]: {
    name: '2013 Angels in the Architecture',
    year: 2013,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2013 Arrabal']]: {
    name: '2013 Arrabal',
    year: 2013,
    difficulty: Difficulty.Open,
  },
  [Tournament['2013 BHSAT']]: {
    name: '2013 BHSAT',
    year: 2013,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2013 Brookwood Invitational Scholars Bowl']]: {
    name: '2013 Brookwood Invitational Scholars Bowl',
    year: 2013,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2013 Cheyne American History']]: {
    name: '2013 Cheyne American History',
    year: 2013,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2013 Chicago Open']]: {
    name: '2013 Chicago Open',
    year: 2013,
    difficulty: Difficulty.Open,
  },
  [Tournament['2013 Collaborative MS Tournament']]: {
    name: '2013 Collaborative MS Tournament',
    year: 2013,
    difficulty: Difficulty['Middle School'],
  },
  [Tournament['2013 Collegiate Novice']]: {
    name: '2013 Collegiate Novice',
    year: 2013,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2013 Delta Burke']]: {
    name: '2013 Delta Burke',
    year: 2013,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2013 Dragoon']]: {
    name: '2013 Dragoon',
    year: 2013,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2013 DRAGOON']]: {
    name: '2013 DRAGOON',
    year: 2013,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2013 Geography Monstrosity']]: {
    name: '2013 Geography Monstrosity',
    year: 2013,
    difficulty: Difficulty.Open,
  },
  [Tournament['2013 GSAC']]: {
    name: '2013 GSAC',
    year: 2013,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2013 JAMES']]: {
    name: '2013 JAMES',
    year: 2013,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2013 LIST III']]: {
    name: '2013 LIST III',
    year: 2013,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2013 Maggie Walker GSAC']]: {
    name: '2013 Maggie Walker GSAC',
    year: 2013,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2013 Michigan Fall Tournament']]: {
    name: '2013 Michigan Fall Tournament',
    year: 2013,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2013 MUT']]: {
    name: '2013 MUT',
    year: 2013,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2013 NASAT']]: {
    name: '2013 NASAT',
    year: 2013,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2013 NTSS']]: {
    name: '2013 NTSS',
    year: 2013,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2013 PACE NSC']]: {
    name: '2013 PACE NSC',
    year: 2013,
    difficulty: Difficulty['National High School'],
  },
  [Tournament['2013 Penn Bowl']]: {
    name: '2013 Penn Bowl',
    year: 2013,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2013 Prison Bowl']]: {
    name: '2013 Prison Bowl',
    year: 2013,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament["2013 Schindler's Lit"]]: {
    name: "2013 Schindler's Lit",
    year: 2013,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2013 Scobol Solo']]: {
    name: '2013 Scobol Solo',
    year: 2013,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2013 SCOP Novice']]: {
    name: '2013 SCOP Novice',
    year: 2013,
    difficulty: Difficulty['Easy High School'],
  },
  [Tournament['2013 Terrapin']]: {
    name: '2013 Terrapin',
    year: 2013,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2013 VCU Closed']]: {
    name: '2013 VCU Closed',
    year: 2013,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2013 VCU Closed ']]: {
    name: '2013 VCU Closed ',
    year: 2013,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2013 VCU Open']]: {
    name: '2013 VCU Open',
    year: 2013,
    difficulty: Difficulty.Open,
  },
  [Tournament['2013 Western Invitational Tournament']]: {
    name: '2013 Western Invitational Tournament',
    year: 2013,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['Scobol Solo']]: {
    name: 'Scobol Solo',
    year: 2013,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2012 2012 Penn-ance']]: {
    name: '2012 2012 Penn-ance',
    year: 2012,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2012 ACF Fall']]: {
    name: '2012 ACF Fall',
    year: 2012,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2012 ACF Nationals']]: {
    name: '2012 ACF Nationals',
    year: 2012,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2012 ACF Nationals ']]: {
    name: '2012 ACF Nationals ',
    year: 2012,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2012 ACF Regionals']]: {
    name: '2012 ACF Regionals',
    year: 2012,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2012 ACF Regionals ']]: {
    name: '2012 ACF Regionals ',
    year: 2012,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2012 ANFORTAS']]: {
    name: '2012 ANFORTAS',
    year: 2012,
    difficulty: Difficulty.Open,
  },
  [Tournament['2012 BARGE']]: {
    name: '2012 BARGE',
    year: 2012,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2012 BHSAT']]: {
    name: '2012 BHSAT',
    year: 2012,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2012 Cheyne American History']]: {
    name: '2012 Cheyne American History',
    year: 2012,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2012 Chicago Open']]: {
    name: '2012 Chicago Open',
    year: 2012,
    difficulty: Difficulty.Open,
  },
  [Tournament['2012 Collaborative MS Tournament']]: {
    name: '2012 Collaborative MS Tournament',
    year: 2012,
    difficulty: Difficulty['Middle School'],
  },
  [Tournament['2012 College History Bowl']]: {
    name: '2012 College History Bowl',
    year: 2012,
    difficulty: Difficulty.Open,
  },
  [Tournament['2012 Collegiate Novice']]: {
    name: '2012 Collegiate Novice',
    year: 2012,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2012 Delta Burke']]: {
    name: '2012 Delta Burke',
    year: 2012,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2012 Geography Monstrosity']]: {
    name: '2012 Geography Monstrosity',
    year: 2012,
    difficulty: Difficulty.Open,
  },
  [Tournament['2012 Harvard Fall Tournament']]: {
    name: '2012 Harvard Fall Tournament',
    year: 2012,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2012 Illinois Fall Tournament']]: {
    name: '2012 Illinois Fall Tournament',
    year: 2012,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2012 KABO']]: {
    name: '2012 KABO',
    year: 2012,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2012 LIST (Ladue Invitational Spring Tournament)']]: {
    name: '2012 LIST (Ladue Invitational Spring Tournament)',
    year: 2012,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2012 Maggie Walker GSAC']]: {
    name: '2012 Maggie Walker GSAC',
    year: 2012,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2012 Minnesota Open']]: {
    name: '2012 Minnesota Open',
    year: 2012,
    difficulty: Difficulty.Open,
  },
  [Tournament['2012 MUT']]: {
    name: '2012 MUT',
    year: 2012,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2012 NASAT']]: {
    name: '2012 NASAT',
    year: 2012,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2012 PACE NSC']]: {
    name: '2012 PACE NSC',
    year: 2012,
    difficulty: Difficulty['National High School'],
  },
  [Tournament['2012 Peaceful Resolution']]: {
    name: '2012 Peaceful Resolution',
    year: 2012,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2012 Penn-ance']]: {
    name: '2012 Penn-ance',
    year: 2012,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2012 Penn Bowl']]: {
    name: '2012 Penn Bowl',
    year: 2012,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2012 Prison Bowl']]: {
    name: '2012 Prison Bowl',
    year: 2012,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2012 Prison Bowl ']]: {
    name: '2012 Prison Bowl ',
    year: 2012,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2012 QUARK']]: {
    name: '2012 QUARK',
    year: 2012,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2012 RAVE']]: {
    name: '2012 RAVE',
    year: 2012,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2012 SCOP Novice']]: {
    name: '2012 SCOP Novice',
    year: 2012,
    difficulty: Difficulty['Easy High School'],
  },
  [Tournament['2012 WELD']]: {
    name: '2012 WELD',
    year: 2012,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2012 YMIR']]: {
    name: '2012 YMIR',
    year: 2012,
    difficulty: Difficulty.Open,
  },
  [Tournament['2011 2011 Minnesota Open']]: {
    name: '2011 2011 Minnesota Open',
    year: 2011,
    difficulty: Difficulty.Open,
  },
  [Tournament['2011 ACF Fall']]: {
    name: '2011 ACF Fall',
    year: 2011,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2011 ACF Fall ']]: {
    name: '2011 ACF Fall ',
    year: 2011,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2011 ACF Nationals']]: {
    name: '2011 ACF Nationals',
    year: 2011,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2011 ACF Regionals']]: {
    name: '2011 ACF Regionals',
    year: 2011,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2011 BHSAT']]: {
    name: '2011 BHSAT',
    year: 2011,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2011 Cheyne 1980s American History']]: {
    name: '2011 Cheyne 1980s American History',
    year: 2011,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2011 Cheyne American History']]: {
    name: '2011 Cheyne American History',
    year: 2011,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2011 Chicago Open']]: {
    name: '2011 Chicago Open',
    year: 2011,
    difficulty: Difficulty.Open,
  },
  [Tournament['2011 Chicago Open History']]: {
    name: '2011 Chicago Open History',
    year: 2011,
    difficulty: Difficulty.Open,
  },
  [Tournament['2011 Collaborative MS Tournament']]: {
    name: '2011 Collaborative MS Tournament',
    year: 2011,
    difficulty: Difficulty['Middle School'],
  },
  [Tournament['2011 Collegiate Novice']]: {
    name: '2011 Collegiate Novice',
    year: 2011,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2011 Delta Burke']]: {
    name: '2011 Delta Burke',
    year: 2011,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2011 Geography Monstrosity']]: {
    name: '2011 Geography Monstrosity',
    year: 2011,
    difficulty: Difficulty.Open,
  },
  [Tournament['2011 Guerrilla at ICT']]: {
    name: '2011 Guerrilla at ICT',
    year: 2011,
    difficulty: Difficulty.Open,
  },
  [Tournament['2011 HSAPQ Colonia 2']]: {
    name: '2011 HSAPQ Colonia 2',
    year: 2011,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2011 HSAPQ National History Bowl']]: {
    name: '2011 HSAPQ National History Bowl',
    year: 2011,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2011 HSAPQ Tournament 15']]: {
    name: '2011 HSAPQ Tournament 15',
    year: 2011,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2011 HSAPQ Tournament 16']]: {
    name: '2011 HSAPQ Tournament 16',
    year: 2011,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2011 HSAPQ Tournament 17']]: {
    name: '2011 HSAPQ Tournament 17',
    year: 2011,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2011 HSAPQ VHSL Districts']]: {
    name: '2011 HSAPQ VHSL Districts',
    year: 2011,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2011 HSAPQ VHSL Regionals']]: {
    name: '2011 HSAPQ VHSL Regionals',
    year: 2011,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2011 HSAPQ VHSL Regular Season']]: {
    name: '2011 HSAPQ VHSL Regular Season',
    year: 2011,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2011 HSAPQ VHSL States']]: {
    name: '2011 HSAPQ VHSL States',
    year: 2011,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2011 Illinois Open']]: {
    name: '2011 Illinois Open',
    year: 2011,
    difficulty: Difficulty.Open,
  },
  [Tournament['2011 Illinois Wissenschaftslehre']]: {
    name: '2011 Illinois Wissenschaftslehre',
    year: 2011,
    difficulty: Difficulty.Open,
  },
  [Tournament['2011 Maggie Walker GSAC']]: {
    name: '2011 Maggie Walker GSAC',
    year: 2011,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2011 MAGNI']]: {
    name: '2011 MAGNI',
    year: 2011,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2011 Minnesota Open']]: {
    name: '2011 Minnesota Open',
    year: 2011,
    difficulty: Difficulty.Open,
  },
  [Tournament['2011 Missiles of October']]: {
    name: '2011 Missiles of October',
    year: 2011,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2011 MUT']]: {
    name: '2011 MUT',
    year: 2011,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2011 NASAT']]: {
    name: '2011 NASAT',
    year: 2011,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2011 PACE NSC']]: {
    name: '2011 PACE NSC',
    year: 2011,
    difficulty: Difficulty['National High School'],
  },
  [Tournament['2011 Penn Bowl']]: {
    name: '2011 Penn Bowl',
    year: 2011,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2011 Prison Bowl']]: {
    name: '2011 Prison Bowl',
    year: 2011,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2011 SACK']]: {
    name: '2011 SACK',
    year: 2011,
    difficulty: Difficulty.Open,
  },
  [Tournament['2011 SCOP Novice']]: {
    name: '2011 SCOP Novice',
    year: 2011,
    difficulty: Difficulty['Easy High School'],
  },
  [Tournament['2011 St. Anselms and Torrey Pines']]: {
    name: '2011 St. Anselms and Torrey Pines',
    year: 2011,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2011 Terrapin Invitational']]: {
    name: '2011 Terrapin Invitational',
    year: 2011,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2011 The Bob Loblaw Law Bowl']]: {
    name: '2011 The Bob Loblaw Law Bowl',
    year: 2011,
    difficulty: Difficulty.Open,
  },
  [Tournament['2011 VCU Open']]: {
    name: '2011 VCU Open',
    year: 2011,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2010 2010 ACF Fall']]: {
    name: '2010 2010 ACF Fall',
    year: 2010,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2010 ACF Fall']]: {
    name: '2010 ACF Fall',
    year: 2010,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2010 ACF Nationals']]: {
    name: '2010 ACF Nationals',
    year: 2010,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2010 ACF Novice']]: {
    name: '2010 ACF Novice',
    year: 2010,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2010 ACF Regionals']]: {
    name: '2010 ACF Regionals',
    year: 2010,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2010 ACF Winter']]: {
    name: '2010 ACF Winter',
    year: 2010,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2010 ANGST']]: {
    name: '2010 ANGST',
    year: 2010,
    difficulty: Difficulty.Open,
  },
  [Tournament['2010 BELFAST Arts']]: {
    name: '2010 BELFAST Arts',
    year: 2010,
    difficulty: Difficulty.Open,
  },
  [Tournament['2010 Chicago Open']]: {
    name: '2010 Chicago Open',
    year: 2010,
    difficulty: Difficulty.Open,
  },
  [Tournament['2010 Chicago Open Arts']]: {
    name: '2010 Chicago Open Arts',
    year: 2010,
    difficulty: Difficulty.Open,
  },
  [Tournament['2010 Chicago Open Literature']]: {
    name: '2010 Chicago Open Literature',
    year: 2010,
    difficulty: Difficulty.Open,
  },
  [Tournament['2010 Collaborative MS Tournament']]: {
    name: '2010 Collaborative MS Tournament',
    year: 2010,
    difficulty: Difficulty['Middle School'],
  },
  [Tournament['2010 Delta Burke']]: {
    name: '2010 Delta Burke',
    year: 2010,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2010 Early Fall Tournament (EFT)']]: {
    name: '2010 Early Fall Tournament (EFT)',
    year: 2010,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2010 Fall Kickoff Tournament']]: {
    name: '2010 Fall Kickoff Tournament',
    year: 2010,
    difficulty: Difficulty['Easy High School'],
  },
  [Tournament['2010 Fall Novice']]: {
    name: '2010 Fall Novice',
    year: 2010,
    difficulty: Difficulty['Easy High School'],
  },
  [Tournament['2010 GDS Ben Cooper Memorial']]: {
    name: '2010 GDS Ben Cooper Memorial',
    year: 2010,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2010 Geography Monstrosity 2']]: {
    name: '2010 Geography Monstrosity 2',
    year: 2010,
    difficulty: Difficulty.Open,
  },
  [Tournament['2010 Guerrilla at ICT']]: {
    name: '2010 Guerrilla at ICT',
    year: 2010,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2010 Harvard International']]: {
    name: '2010 Harvard International',
    year: 2010,
    difficulty: Difficulty.Open,
  },
  [Tournament['2010 Julius Civilis Classics Tournament']]: {
    name: '2010 Julius Civilis Classics Tournament',
    year: 2010,
    difficulty: Difficulty.Open,
  },
  [Tournament['2010 Maggie Walker GSAC']]: {
    name: '2010 Maggie Walker GSAC',
    year: 2010,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2010 MELD']]: {
    name: '2010 MELD',
    year: 2010,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2010 Minnesota Open']]: {
    name: '2010 Minnesota Open',
    year: 2010,
    difficulty: Difficulty.Open,
  },
  [Tournament['2010 MUT']]: {
    name: '2010 MUT',
    year: 2010,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2010 NASAT']]: {
    name: '2010 NASAT',
    year: 2010,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2010 NTSS']]: {
    name: '2010 NTSS',
    year: 2010,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2010 PACE NSC']]: {
    name: '2010 PACE NSC',
    year: 2010,
    difficulty: Difficulty['National High School'],
  },
  [Tournament['2010 Penn Bowl']]: {
    name: '2010 Penn Bowl',
    year: 2010,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2010 Princeton Buzzerfest']]: {
    name: '2010 Princeton Buzzerfest',
    year: 2010,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2010 Prison Bowl']]: {
    name: '2010 Prison Bowl',
    year: 2010,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2010 SCOP Novice']]: {
    name: '2010 SCOP Novice',
    year: 2010,
    difficulty: Difficulty['Easy High School'],
  },
  [Tournament['2010 Sun n Fun']]: {
    name: '2010 Sun n Fun',
    year: 2010,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2010 THUNDER II']]: {
    name: '2010 THUNDER II',
    year: 2010,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2010 TJ NAREN']]: {
    name: '2010 TJ NAREN',
    year: 2010,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2010 T-Party']]: {
    name: '2010 T-Party',
    year: 2010,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2010 VCU Open (Saturday)']]: {
    name: '2010 VCU Open (Saturday)',
    year: 2010,
    difficulty: Difficulty.Open,
  },
  [Tournament['2010 VCU Open (Sunday)']]: {
    name: '2010 VCU Open (Sunday)',
    year: 2010,
    difficulty: Difficulty.Open,
  },
  [Tournament['2010 Wild Kingdom']]: {
    name: '2010 Wild Kingdom',
    year: 2010,
    difficulty: Difficulty.Open,
  },
  [Tournament['2009 ACF Fall']]: {
    name: '2009 ACF Fall',
    year: 2009,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2009 ACF Nationals']]: {
    name: '2009 ACF Nationals',
    year: 2009,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2009 ACF Regionals']]: {
    name: '2009 ACF Regionals',
    year: 2009,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2009 ACF Winter']]: {
    name: '2009 ACF Winter',
    year: 2009,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2009 ACF Winter ']]: {
    name: '2009 ACF Winter ',
    year: 2009,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2009 BATE']]: {
    name: '2009 BATE',
    year: 2009,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2009 Chicago Open']]: {
    name: '2009 Chicago Open',
    year: 2009,
    difficulty: Difficulty.Open,
  },
  [Tournament['2009 Chicago Open Literature']]: {
    name: '2009 Chicago Open Literature',
    year: 2009,
    difficulty: Difficulty.Open,
  },
  [Tournament['2009 Chipola Lit + Fine Arts']]: {
    name: '2009 Chipola Lit + Fine Arts',
    year: 2009,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2009 DAFT']]: {
    name: '2009 DAFT',
    year: 2009,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2009 Fall Kickoff Tournament']]: {
    name: '2009 Fall Kickoff Tournament',
    year: 2009,
    difficulty: Difficulty['Easy High School'],
  },
  [Tournament['2009 Fall Novice']]: {
    name: '2009 Fall Novice',
    year: 2009,
    difficulty: Difficulty['Easy High School'],
  },
  [Tournament['2009 FICHTE']]: {
    name: '2009 FICHTE',
    year: 2009,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2009 From Here To Eternity']]: {
    name: '2009 From Here To Eternity',
    year: 2009,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2009 Gaddis II']]: {
    name: '2009 Gaddis II',
    year: 2009,
    difficulty: Difficulty.Open,
  },
  [Tournament['2009 Geography Monstrosity']]: {
    name: '2009 Geography Monstrosity',
    year: 2009,
    difficulty: Difficulty.Open,
  },
  [Tournament['2009 HFT']]: {
    name: '2009 HFT',
    year: 2009,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2009 HSAPQ 4Q1']]: {
    name: '2009 HSAPQ 4Q1',
    year: 2009,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2009 HSAPQ 4Q2']]: {
    name: '2009 HSAPQ 4Q2',
    year: 2009,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2009 HSAPQ NASAT Tryout Set']]: {
    name: '2009 HSAPQ NASAT Tryout Set',
    year: 2009,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2009 HSAPQ Tournament 10']]: {
    name: '2009 HSAPQ Tournament 10',
    year: 2009,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2009 HSAPQ Tournament 11']]: {
    name: '2009 HSAPQ Tournament 11',
    year: 2009,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2009 HSAPQ Tournament 8']]: {
    name: '2009 HSAPQ Tournament 8',
    year: 2009,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2009 HSAPQ Tournament 9']]: {
    name: '2009 HSAPQ Tournament 9',
    year: 2009,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2009 Mahfouz Memorial Lit']]: {
    name: '2009 Mahfouz Memorial Lit',
    year: 2009,
    difficulty: Difficulty.Open,
  },
  [Tournament['2009 Minnesota Open KLEE Fine Arts']]: {
    name: '2009 Minnesota Open KLEE Fine Arts',
    year: 2009,
    difficulty: Difficulty.Open,
  },
  [Tournament['2009 Minnesota Open Lit']]: {
    name: '2009 Minnesota Open Lit',
    year: 2009,
    difficulty: Difficulty.Open,
  },
  [Tournament['2009 MUT']]: {
    name: '2009 MUT',
    year: 2009,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2009 MW GSAC XVII']]: {
    name: '2009 MW GSAC XVII',
    year: 2009,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2009 NTV']]: {
    name: '2009 NTV',
    year: 2009,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2009 PACE NSC']]: {
    name: '2009 PACE NSC',
    year: 2009,
    difficulty: Difficulty['National High School'],
  },
  [Tournament['2009 Prison Bowl']]: {
    name: '2009 Prison Bowl',
    year: 2009,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2009 RMP Fest']]: {
    name: '2009 RMP Fest',
    year: 2009,
    difficulty: Difficulty.Open,
  },
  [Tournament['2009 The Experiment II']]: {
    name: '2009 The Experiment II',
    year: 2009,
    difficulty: Difficulty.Open,
  },
  [Tournament['2009 THUNDER']]: {
    name: '2009 THUNDER',
    year: 2009,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2009 Tyrone Slothrop Literature Singles']]: {
    name: '2009 Tyrone Slothrop Literature Singles',
    year: 2009,
    difficulty: Difficulty.Open,
  },
  [Tournament['2009 U. of Georgia CCC']]: {
    name: '2009 U. of Georgia CCC',
    year: 2009,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2009 VCU Open']]: {
    name: '2009 VCU Open',
    year: 2009,
    difficulty: Difficulty.Open,
  },
  [Tournament['2008 ACF Fall']]: {
    name: '2008 ACF Fall',
    year: 2008,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2008 ACF Fall ']]: {
    name: '2008 ACF Fall ',
    year: 2008,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2008 ACF Nationals']]: {
    name: '2008 ACF Nationals',
    year: 2008,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2008 ACF Regionals']]: {
    name: '2008 ACF Regionals',
    year: 2008,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2008 Chicago Open Literature']]: {
    name: '2008 Chicago Open Literature',
    year: 2008,
    difficulty: Difficulty.Open,
  },
  [Tournament['2008 Chitin']]: {
    name: '2008 Chitin',
    year: 2008,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2008 FICHTE']]: {
    name: '2008 FICHTE',
    year: 2008,
    difficulty: Difficulty['Hard College'],
  },
  [Tournament['2008 Gaddis I']]: {
    name: '2008 Gaddis I',
    year: 2008,
    difficulty: Difficulty.Open,
  },
  [Tournament['2008 HFT']]: {
    name: '2008 HFT',
    year: 2008,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2008 HSAPQ 4Q 1']]: {
    name: '2008 HSAPQ 4Q 1',
    year: 2008,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2008 HSAPQ ACF 1']]: {
    name: '2008 HSAPQ ACF 1',
    year: 2008,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2008 HSAPQ ACF 2']]: {
    name: '2008 HSAPQ ACF 2',
    year: 2008,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2008 HSAPQ ACF 3']]: {
    name: '2008 HSAPQ ACF 3',
    year: 2008,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2008 HSAPQ NSC 1']]: {
    name: '2008 HSAPQ NSC 1',
    year: 2008,
    difficulty: Difficulty['National High School'],
  },
  [Tournament['2008 HSAPQ NSC 2']]: {
    name: '2008 HSAPQ NSC 2',
    year: 2008,
    difficulty: Difficulty['National High School'],
  },
  [Tournament['2008 MUT']]: {
    name: '2008 MUT',
    year: 2008,
    difficulty: Difficulty['Easy College'],
  },
  [Tournament['2008 NNT']]: {
    name: '2008 NNT',
    year: 2008,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2008 NTV']]: {
    name: '2008 NTV',
    year: 2008,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2008 PACE NSC']]: {
    name: '2008 PACE NSC',
    year: 2008,
    difficulty: Difficulty['National High School'],
  },
  [Tournament['2008 Prison Bowl']]: {
    name: '2008 Prison Bowl',
    year: 2008,
    difficulty: Difficulty['Hard High School'],
  },
  [Tournament['2008 QuAC I']]: {
    name: '2008 QuAC I',
    year: 2008,
    difficulty: Difficulty['Regular High School'],
  },
  [Tournament['2008 RMP Fest']]: {
    name: '2008 RMP Fest',
    year: 2008,
    difficulty: Difficulty.Open,
  },
  [Tournament['2007 ACF Regionals']]: {
    name: '2007 ACF Regionals',
    year: 2007,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2007 The Experiment']]: {
    name: '2007 The Experiment',
    year: 2007,
    difficulty: Difficulty.Open,
  },
  [Tournament['2006 ACF Regionals']]: {
    name: '2006 ACF Regionals',
    year: 2006,
    difficulty: Difficulty['Regular College'],
  },
  [Tournament['2005 Teitler Myth Singles']]: {
    name: '2005 Teitler Myth Singles',
    year: 2005,
    difficulty: Difficulty.Open,
  },
};

export const CATEGORIES = Object.keys(CATEGORY_MAP).map(
  Number,
) as unknown as Category[];
export const SUBCATEGORIES = Object.keys(SUBCATEGORY_MAP).map(
  Number,
) as unknown as Subcategory[];
export const DIFFICULTIES = Object.keys(DIFFICULTY_MAP).map(
  Number,
) as unknown as Difficulty[];
export const TOURNAMENTS = Object.keys(TOURNAMENT_MAP).map(
  Number,
) as unknown as Tournament[];

export const MIN_TOURNAMENT_YEAR = 2005;
export const MAX_TOURNAMENT_YEAR = 2020;

export const READING_SPEED_LS_KEY = 'reading_speed';
export const CATEGORIES_LS_KEY = 'categories';
export const SUBCATEGORIES_LS_KEY = 'subcategories';
export const DIFFICULTIES_LS_KEY = 'difficulties';
export const TOURNAMENTS_LS_KEY = 'tournaments';
export const FROM_YEAR_LS_KEY = 'from_year';

export const DEFAULT_READING_SPEED = 60;
