import { Box } from '@chakra-ui/react';
import { BonusResult } from '@qbhub/types';
import { getRange } from '@qbhub/utils';
import { useMemo } from 'react';
import {
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getBonusResultsSummary } from '../utils/bonus';

type BonusResultsLineChartProps = {
  results: BonusResult[];
};

export default function BonusResultsLineChart({
  results,
}: BonusResultsLineChartProps) {
  const data = useMemo(
    () =>
      getRange(0, results.length).map((index) => ({
        index,
        score: getBonusResultsSummary(results.toReversed().slice(0, index))
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
            label="Bonus"
            tickCount={10}
          />
          <YAxis>
            <Label angle={-90} position="insideLeft" value="Score" />
          </YAxis>
          <Tooltip labelFormatter={(value) => `After ${value} bonuses`} />
          <Legend />
          <Line dataKey="score" type="monotone" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
