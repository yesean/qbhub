import { Box } from '@chakra-ui/react';
import { TossupResult } from '@qbhub/types';
import { getRange } from '@qbhub/utils';
import { useMemo } from 'react';
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getTossupResultsSummary } from '../utils/tossup';

type TossupResultsLineChartProps = {
  results: TossupResult[];
};

export default function TossupResultsLineChart({
  results,
}: TossupResultsLineChartProps) {
  const data = useMemo(
    () =>
      getRange(0, results.length).map((index) => ({
        index,
        score: getTossupResultsSummary(results.toReversed().slice(0, index))
          .score,
      })),
    [results],
  );

  return (
    <Box h="100%" w="100%">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis
            dataKey="index"
            height={70}
            interval="equidistantPreserveStart"
            label="Tossup number"
            tickCount={10}
          />
          <YAxis />
          <Tooltip labelFormatter={(value) => `After ${value} tossups`} />
          <Legend />
          <Line dataKey="score" type="monotone" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
