import { DownloadIcon } from '@chakra-ui/icons';
import { LinkButton, Props as LinkButtonProps } from './LinkButton';

export type FileDownloadButtonProps = LinkButtonProps & {
  href: string;
  download: string;
  label: string;
};

const FileDownloadButton: React.FC<FileDownloadButtonProps> = ({
  href,
  download,
  label,
  ...rest
}) => (
  <LinkButton
    href={href}
    download={download}
    label={label}
    leftIcon={<DownloadIcon w={4} h={4} />}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}
  />
);

export default FileDownloadButton;
