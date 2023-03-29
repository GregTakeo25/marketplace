interface Props {
  className?: string;
}

export default function AttachmentLine({ className }: Props) {
  return <i className={`ri-attachment-line ${className}`} />;
}
