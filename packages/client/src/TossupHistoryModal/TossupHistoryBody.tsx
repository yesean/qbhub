import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { selectTossupReader } from '../TossupReader/tossupReaderSlice';
import TossupResults from './TossupResults';
import TossupResultsLineChart from './TossupResultsLineChart';

export default function TossupHistoryBody() {
  const { results } = useSelector(selectTossupReader);

  return (
    <Tabs display="flex" flexDirection="column" h="100%">
      <TabList>
        <Tab>Tossups</Tab>
        <Tab>Chart</Tab>
      </TabList>
      <TabPanels flexGrow={1} minH={0}>
        <TabPanel maxH="100%" overflow="auto" p={0}>
          <TossupResults results={results} />
        </TabPanel>
        <TabPanel boxSizing="border-box" h="100%">
          <TossupResultsLineChart results={results} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
