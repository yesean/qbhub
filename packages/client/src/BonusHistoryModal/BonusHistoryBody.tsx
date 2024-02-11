import QuestionHistoryBody from '../components/QuestionHistoryModal/QuestionHistoryBody';
import BonusResults from './BonusResults';
import BonusResultsLineChart from './BonusResultsLineChart';

const TABS = [
  {
    content: BonusResults,
    label: 'Bonuses',
    panelProps: {
      p: 0,
    },
  },
  {
    content: BonusResultsLineChart,
    label: 'Line Chart',
  },
];

export default function BonusHistoryBody() {
  return <QuestionHistoryBody tabs={TABS} />;
}
