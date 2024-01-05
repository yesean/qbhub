import { Box } from '@chakra-ui/react';

/**
 * Rounded gray scrollable container for question reader content. Uses 2 boxes
 * to prevent overflow content from overlapping with padding.
 */
export default function QuestionContentContainer({
  children,
  ...otherProps
}: React.ComponentProps<typeof Box>) {
  return (
    <Box bg="gray.100" borderRadius="md" overflow="auto" p={4} {...otherProps}>
      <Box h="100%" overflow="auto">
        {children}
      </Box>
    </Box>
  );
}
