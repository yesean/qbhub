import { Box, Link, LinkProps } from '@chakra-ui/react';
import { BaseButtonProps } from './base';

export type FileDownloadButtonProps = LinkProps & {
  href: string;
  download: string;
  label: string;
  icon?: React.ReactElement;
};

const FileDownloadButton: React.FC<
  React.PropsWithChildren<FileDownloadButtonProps>
> = ({ href, download, icon, label, ...rest }) => {
  const content = () => {
    if (icon == null) {
      return label;
    }

    return (
      <>
        <Box as="span" mr={1} display="inline-flex" alignItems="center">
          {icon}
        </Box>
        {label}
      </>
    );
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Link {...BaseButtonProps} href={href} download={download} {...rest}>
      {content()}
    </Link>
  );
};

export default FileDownloadButton;
