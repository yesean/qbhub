/* eslint-disable react/jsx-props-no-spreading */
import { Button, HStack, Input, useNumberInput } from '@chakra-ui/react';
import {
  MAX_TOURNAMENT_YEAR,
  MIN_TOURNAMENT_YEAR,
} from '../utils/settings/constants';

type YearInputProps = {
  onChange: (_: string, arg: number) => void;
  value: number;
};

const YearInput = ({ onChange, value }: YearInputProps) => {
  const { getDecrementButtonProps, getIncrementButtonProps, getInputProps } =
    useNumberInput({
      allowMouseWheel: true,
      max: MAX_TOURNAMENT_YEAR,
      min: MIN_TOURNAMENT_YEAR,
      onChange,
      value,
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
