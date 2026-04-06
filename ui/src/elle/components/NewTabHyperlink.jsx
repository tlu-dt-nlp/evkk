export default function NewTabHyperlink({ path, content, className, children }) {

  return (
    <a
      href={path}
      target="_blank"
      rel="noopener noreferrer"
      className={className ?? ''}
    >
      {children || content}
    </a>
  );
}
