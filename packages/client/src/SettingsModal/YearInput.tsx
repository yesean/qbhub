/* eslint-disable react/jsx-props-no-spreading */
import { Button, HStack, Input, useNumberInput } from '@chakra-ui/react';
import {
  MAX_TOURNAMENT_YEAR,
  MIN_TOURNAMENT_YEAR,
} from '../utils/settings/constants';

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
      allowMouseWheel: true,
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  return (
    <HStack w={44}>
      <Button {...dec}>-</Button>
      <Input {...input} textAlign="center" />
      <Button {...inc}>+</Button>
    </HStack>
  );
};

export default YearInput;
