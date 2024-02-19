import { DownloadIcon } from '@chakra-ui/icons';

import { LinkButton, Props as LinkButtonProps } from './LinkButton';

export type FileDownloadButtonProps = LinkButtonProps & {
  download: string;
  href: string;
  label: string;
};

const FileDownloadButton: React.FC<FileDownloadButtonProps> = ({
  download,
  href,
  label,
  ...rest
}) => (
  <LinkButton
    download={download}
    href={href}
    label={label}
    leftIcon={<DownloadIcon h={4} w={4} />}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}
  />
);

export default FileDownloadButton;
