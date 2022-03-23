import { Link, LinkProps } from '@chakra-ui/react';

type LinkButtonProps = {
  href: string;
  download: string;
} & LinkProps;

const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  download,
  children,
  ...rest
}) => {
  return (
    <Link
      href={href}
      download={download}
      p={3}
      borderRadius="5px"
      bg="cyan.400"
      color="gray.50"
      fontWeight="semibold"
      _hover={{
        textDecor: 'none',
        bg: 'cyan.500',
      }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    >
      {children}
    </Link>
  );
};

export default LinkButton;
