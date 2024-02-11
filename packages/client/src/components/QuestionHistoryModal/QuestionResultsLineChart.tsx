import { Box } from '@chakra-ui/react';
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

type QuestionResultsLineChartDatum = {
  index: number;
  score: number;
};

type QuestionResultsLineChartProps = {
  data: QuestionResultsLineChartDatum[];
  tooltipLabelFormatter: (index: number) => string;
  xAxisLabel: string;
  yAxisLabel: string;
};

/**
 * Component for rendering question results in a line chart
 */
export default function QuestionResultsLineChart({
  data,
  tooltipLabelFormatter,
  xAxisLabel,
  yAxisLabel,
}: QuestionResultsLineChartProps) {
  return (
    <Box h="100%" w="100%">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis
            dataKey="index"
            height={70}
            interval="equidistantPreserveStart"
            label={xAxisLabel}
            tickCount={10}
          />
          <YAxis>
            <Label angle={-90} position="insideLeft" value={yAxisLabel} />
          </YAxis>
          <Tooltip labelFormatter={tooltipLabelFormatter} />
          <Legend />
          <Line dataKey="score" type="monotone" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
