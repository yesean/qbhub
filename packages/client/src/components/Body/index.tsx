import { Center } from '@chakra-ui/react';
import { Navigate, Route, Routes } from 'react-router-dom';
import About from '../../About';
import BonusReader from '../../BonusReader';
import Answers from '../../CluesGenerator/Answers';
import Clues from '../../CluesGenerator/Clues';
import Search from '../../CluesGenerator/Search';
import FrequencyList from '../../FrequencyList';
import TossupReader from '../../TossupReader';

const Body: React.FC<React.PropsWithChildren<unknown>> = () => (
  <Center flexDir="column" overflow="auto" flex={1} px={3}>
    <Routes>
      <Route path="reader/tossup" element={<TossupReader />} />
      <Route path="reader/bonus" element={<BonusReader />} />
      <Route path="freq" element={<FrequencyList />} />
      <Route path="clues">
        <Route path="search" element={<Search />} />
        <Route path="search/:answer" element={<Answers />} />
        <Route path="display/:answer" element={<Clues />} />
        <Route path="*" element={<Navigate to="search" />} />
      </Route>
      <Route path="about" element={<About />} />
      <Route path="*" element={<Navigate to="reader/tossup" />} />
    </Routes>
  </Center>
);

export default Body;
