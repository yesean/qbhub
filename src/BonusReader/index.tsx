import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextBonus, ReaderStatus, selectBonusReader } from './bonusReaderSlice';

const BonusReader: React.FC = () => {
  const {
    status,
    current: { bonus },
  } = useSelector(selectBonusReader);
  const dispatch = useDispatch();

  console.log('bonus:', bonus);
  useEffect(() => {
    if (status === ReaderStatus.idle && Object.keys(bonus).length === 0) {
      dispatch(nextBonus());
    }
  }, [bonus, dispatch, status]);

  if (Object.keys(bonus).length === 0) return <>loading</>;

  return (
    <div>
      {bonus.leadin}
      <hr />
      {bonus.parts.map((bn) => (
        <div key={bn.number}>
          <div>{bn.text}</div>
          <div>ANSWER: {bn.answer}</div>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default BonusReader;
