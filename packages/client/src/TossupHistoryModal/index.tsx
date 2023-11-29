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
import { selectTossupReader } from '../TossupReader/tossupReaderSlice';
import TealButton from '../components/buttons/TealButton';
import TossupResults from './TossupResults';

const scoreHeaders = ['15', '10', '-5', 'Points'];

type TossupHistoryModalProps = {
  closeModal: () => void;
  isOpen: boolean;
};

const TossupHistoryModal: React.FC<
  React.PropsWithChildren<TossupHistoryModalProps>
> = ({ closeModal, isOpen }) => {
  const { results } = useSelector(selectTossupReader);

  const powers = results.filter((r) => r.score === TossupScore.power).length;
  const tens = results.filter((r) => r.score === TossupScore.ten).length;
  const negs = results.filter((r) => r.score === TossupScore.neg).length;
  const points = results.reduce((acc, r) => acc + r.score, 0);

  const scoreBody = [powers, tens, negs, points];

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={closeModal}
      scrollBehavior="inside"
      size="6xl"
    >
      <ModalOverlay />
      <ModalContent h="max(75vh, 600px)" m={4} w="min(90vw, 1400px)">
        <ModalHeader>Tossup History</ModalHeader>
        <ModalBody display="flex" flexDirection="column" pt={0}>
          <Table mb={4} variant="simple">
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
