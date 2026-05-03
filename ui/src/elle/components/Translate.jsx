import { Trans } from 'react-i18next';

export default function Translate({ i18nKey, components }) {

  return (
    <Trans
      i18nKey={i18nKey}
      components={{ bold: <b />, br: <br />, ...components }}
    />
  );
}
