import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { ComponentProps } from 'react';

type QuestionHistoryBodyTab = {
  content: React.ReactElement;
  label: string;
  panelProps?: ComponentProps<typeof TabPanel>;
};

type QuestionHistoryBodyProps = {
  tabs: QuestionHistoryBodyTab[];
};

/**
 * Component for rendering question history modal tabs
 */
export default function QuestionHistoryBody({
  tabs,
}: QuestionHistoryBodyProps) {
  return (
    <Tabs display="flex" flexDirection="column" h="100%" isLazy>
      <TabList>
        {tabs.map(({ label }) => (
          <Tab key={label}>{label}</Tab>
        ))}
      </TabList>
      <TabPanels flexGrow={1} minH={0}>
        {tabs.map(({ content, label, panelProps }) => (
          <TabPanel key={label} h="100%" overflow="auto" {...panelProps}>
            {content}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}
