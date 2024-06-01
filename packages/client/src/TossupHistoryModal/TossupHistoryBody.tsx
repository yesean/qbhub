import QuestionHistoryBody from '../components/QuestionHistoryModal/QuestionHistoryBody';
import TossupResults from './TossupResults';
import TossupResultsLineChart from './TossupResultsLineChart';

const TABS = [
  {
    content: <TossupResults />,
    label: 'Tossups',
    panelProps: {
      p: 0,
    },
  },
  {
    content: <TossupResultsLineChart />,
    label: 'Line Chart',
  },
];

export default function TossupHistoryBody() {
  return <QuestionHistoryBody tabs={TABS} />;
}
