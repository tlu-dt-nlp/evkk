import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="text-center pb-4">
      <p className="lead">
        {t('error_404_page_not_found')}
      </p>
    </div>
  );
}
