import { useState } from 'react';
import { Button, Flex } from '@chakra-ui/react';

import Header from './components/Header';
import Body from './components/Body';
import SettingsModal from './components/SettingsModal';
import { Category, Difficulty } from './types';
import { fetchTossup } from './services/tossupService';

const App: React.FC = () => {
  const [text, setText] = useState('');
  const [answer, setAnswer] = useState('');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [categoriesSelected, setCategoriesSelected] = useState<Category[]>([
    Category.Science,
    Category.Literature,
  ]);
  const [difficultiesSelected, setDifficultiesSelected] = useState<
    Difficulty[]
  >([Difficulty['Easy College'], Difficulty['Regular College']]);

  const refreshTossup = () => {
    fetchTossup(categoriesSelected, difficultiesSelected).then((tossups) => {
      setText(tossups[0].text);
      setAnswer(tossups[0].answer);
    });
  };

  return (
    <>
      <Flex direction="column" h="100vh">
        <Header onClickSettingsIcon={() => setIsSettingsModalOpen(true)} />
        <Body text={text} answer={answer} />
        <Button onClick={refreshTossup}>Fetch</Button>
      </Flex>
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        categoriesSelected={categoriesSelected}
        setCategoriesSelected={setCategoriesSelected}
        difficultiesSelected={difficultiesSelected}
        setDifficultiesSelected={setDifficultiesSelected}
      />
    </>
  );
};

export default App;
