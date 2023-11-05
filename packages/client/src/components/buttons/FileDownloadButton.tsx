import { DownloadIcon } from '@chakra-ui/icons';
import { Box, Link, LinkProps } from '@chakra-ui/react';
import { BaseButtonProps } from './base';

export type FileDownloadButtonProps = LinkProps & {
  href: string;
  download: string;
  label: string;
};

const FileDownloadButton: React.FC<
  React.PropsWithChildren<FileDownloadButtonProps>
> = ({ href, download, label, ...rest }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Link {...BaseButtonProps} href={href} download={download} {...rest}>
    <Box as="span" mr={1} display="inline-flex" alignItems="center">
      <DownloadIcon w={4} h={4} />
    </Box>
    {label}
  </Link>
);

export default FileDownloadButton;
