/* eslint-disable react/no-array-index-key */
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { TossupScore } from '@qbhub/types';
import { useSelector } from 'react-redux';
import { TealButton } from '../components/buttons';
import { useAppDispatch } from '../redux/hooks';
import { selectTossupReader } from '../TossupReader/tossupReaderSlice';
import { close, selectTossupHistoryModal } from './tossupHistoryModalSlice';
import TossupResults from './TossupResults';

const scoreHeaders = ['15', '10', '-5', 'Points'];

const TossupHistoryModal: React.FC<React.PropsWithChildren<unknown>> = () => {
  const dispatch = useAppDispatch();
  const { results } = useSelector(selectTossupReader);
  const { isOpen } = useSelector(selectTossupHistoryModal);

  const closeModal = () => dispatch(close());

  const powers = results.filter((r) => r.score === TossupScore.power).length;
  const tens = results.filter((r) => r.score === TossupScore.ten).length;
  const negs = results.filter((r) => r.score === TossupScore.neg).length;
  const points = results.reduce((acc, r) => acc + r.score, 0);

  const scoreBody = [powers, tens, negs, points];

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      size="6xl"
      scrollBehavior="inside"
      isCentered
    >
      <ModalOverlay />
      <ModalContent m={4} w="min(90vw, 1400px)" h="max(75vh, 600px)">
        <ModalHeader>Tossup History</ModalHeader>
        <ModalBody pt={0} display="flex" flexDirection="column">
          <Table variant="simple" mb={4}>
            <Thead>
              <Tr>
                {scoreHeaders.map((header, i) => (
                  <Th key={i}>{header}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                {scoreBody.map((score, i) => (
                  <Td key={i}>{score}</Td>
                ))}
              </Tr>
            </Tbody>
          </Table>
          <TossupResults results={results} />
        </ModalBody>
        <ModalFooter>
          <TealButton mr={3} onClick={closeModal}>
            Done
          </TealButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TossupHistoryModal;
