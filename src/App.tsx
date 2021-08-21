import { useState } from 'react';
import { Flex } from '@chakra-ui/react';

import Header from './components/Header';
import Body from './components/Body';
import SettingsModal from './components/SettingsModal';
import { Categories, Difficulties } from './types';

const App: React.FC = () => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [categoriesSelected, setCategoriesSelected] = useState<Categories[]>([
    Categories.Science,
    Categories.Literature,
  ]);
  const [difficultiesSelected, setDifficultiesSelected] = useState<
    Difficulties[]
  >([Difficulties['Easy College'], Difficulties['Regular College']]);

  return (
    <>
      <Flex direction="column" h="100vh">
        <Header onClickSettingsIcon={() => setIsSettingsModalOpen(true)} />
        <Body />
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
