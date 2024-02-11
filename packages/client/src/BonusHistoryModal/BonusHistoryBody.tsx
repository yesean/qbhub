import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { selectBonusReader } from '../BonusReader/bonusReaderSlice';
import BonusResults from './BonusResults';
import BonusResultsLineChart from './BonusResultsLineChart';

export default function BonusHistoryBody() {
  const { results } = useSelector(selectBonusReader);

  return (
    <Tabs display="flex" flexDirection="column" h="100%" isLazy>
      <TabList>
        <Tab>Bonuses</Tab>
        <Tab>Chart</Tab>
      </TabList>
      <TabPanels flexGrow={1} minH={0}>
        <TabPanel maxH="100%" overflow="auto" p={0}>
          <BonusResults />
        </TabPanel>
        <TabPanel h="100%">
          <BonusResultsLineChart results={results} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
