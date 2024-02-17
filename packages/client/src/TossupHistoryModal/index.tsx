import QuestionHistoryModal from '../components/QuestionHistoryModal/QuestionHistoryModal';
import TossupHistoryBody from './TossupHistoryBody';
import TossupHistorySummary from './TossupHistorySummary';

type TossupHistoryModalProps = {
  closeModal: () => void;
  isOpen: boolean;
};

export default function TossupHistoryModal(props: TossupHistoryModalProps) {
  return (
    <QuestionHistoryModal
      {...props}
      body={<TossupHistoryBody />}
      summaryHeader={<TossupHistorySummary />}
    />
  );
}
