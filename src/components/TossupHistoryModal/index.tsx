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
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/hooks';
import { selectTossupReader } from '../../TossupReader/tossupReaderSlice';
import { TossupScore } from '../../types/tossups';
import { renderQuestion } from '../../utils/questionReader';
import { parseHTMLString } from '../../utils/string';
import TealButton from '../TealButton';
import { close, selectTossupHistoryModal } from './tossupHistoryModalSlice';

const TossupHistoryModal: React.FC = () => {
  const dispatch = useAppDispatch();

  const { results } = useSelector(selectTossupReader);
  const { isOpen } = useSelector(selectTossupHistoryModal);
  const closeModal = () => dispatch(close());

  const powers = results.filter((r) => r.score === TossupScore.power).length;
  const tens = results.filter((r) => r.score === TossupScore.ten).length;
  const negs = results.filter((r) => r.score === TossupScore.neg).length;
  const points = results.reduce((acc, r) => acc + r.score, 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      size="6xl"
      scrollBehavior="inside"
      isCentered
    >
      <ModalOverlay />
      <ModalContent m={4} maxW="min(90vw, 1400px)" maxH="max(75vh, 600px)">
        <ModalHeader>Tossup History</ModalHeader>
        <ModalBody pt={0} display="flex" flexDirection="column">
          <Table variant="simple" mb={4}>
            <Thead>
              <Tr>
                <Th>15</Th>
                <Th>10</Th>
                <Th>-5</Th>
                <Th>Points</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>{powers}</Td>
                <Td>{tens}</Td>
                <Td>{negs}</Td>
                <Td>{points}</Td>
              </Tr>
            </Tbody>
          </Table>
          <Table
            variant="simple"
            display="block"
            pos="relative"
            overflow="auto"
          >
            <Thead pos="sticky" top={0} bg="white">
              <Tr>
                <Th>Score</Th>
                <Th>Input</Th>
                <Th>Answer</Th>
                <Th>Question</Th>
                <Th>Tournament</Th>
              </Tr>
            </Thead>
            <Tbody zIndex={-1}>
              {results.map((r) => (
                <Tr
                  key={r.tossup.formattedAnswer}
                  backgroundColor={r.score > 0 ? 'green.200' : 'red.200'}
                >
                  <Td>{r.score}</Td>
                  <Td>{r.userAnswer}</Td>
                  <Td>{parseHTMLString(r.tossup.formattedAnswer)}</Td>
                  <Td>
                    {renderQuestion(
                      r.buzz.textWithBuzz,
                      r.buzz.index,
                      r.buzz.textWithBuzz.length,
                    )}
                  </Td>
                  <Td>{r.tossup.tournament}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
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
