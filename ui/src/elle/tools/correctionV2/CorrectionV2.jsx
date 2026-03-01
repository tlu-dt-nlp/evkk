import { EditorProvider } from './providers/EditorProvider';
import CorrectorPage from './CorrectorPage';

export default function CorrectionV2() {
  return (
    <EditorProvider>
      <CorrectorPage />
    </EditorProvider>
  );
}
