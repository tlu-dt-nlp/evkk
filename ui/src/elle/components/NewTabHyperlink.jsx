export default function NewTabHyperlink({path, content, className}) {

  return (
    <a href={path}
       target="_blank"
       rel="noopener noreferrer"
       className={className ?? ''}>
      {content}
    </a>
  );
}
