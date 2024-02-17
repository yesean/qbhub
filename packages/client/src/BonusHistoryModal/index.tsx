import QuestionHistoryModal from '../components/QuestionHistoryModal/QuestionHistoryModal';
import BonusHistoryBody from './BonusHistoryBody';
import BonusHistorySummary from './BonusHistorySummary';

type BonusHistoryModalProps = {
  closeModal: () => void;
  isOpen: boolean;
};

export default function BonusHistoryModal(props: BonusHistoryModalProps) {
  return (
    <QuestionHistoryModal
      {...props}
      body={<BonusHistoryBody />}
      summaryHeader={<BonusHistorySummary />}
    />
  );
}
