/* eslint-disable react/jsx-props-no-spreading */
import { Button, HStack, Input, useNumberInput } from '@chakra-ui/react';
import { MAX_TOURNAMENT_YEAR, MIN_TOURNAMENT_YEAR } from '../utils/constants';

type YearInputProps = {
  value: number;
  onChange: (_: string, arg: number) => void;
};

const YearInput = ({ value, onChange }: YearInputProps) => {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      min: MIN_TOURNAMENT_YEAR,
      max: MAX_TOURNAMENT_YEAR,
      value,
      onChange,
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  return (
    <HStack w={44}>
      <Button {...dec}>-</Button>
      <Input textAlign="center" {...input} />
      <Button {...inc}>+</Button>
    </HStack>
  );
};

export default YearInput;
