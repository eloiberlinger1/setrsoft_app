import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'de', label: 'DE' },
  { code: 'ru', label: 'RU' },
  { code: 'cn', label: 'CN' }
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex gap-2 items-center">
      {languages.map((lng) => {
        // Support initial mounting when resolvedLanguage might not be there
        const isActive = i18n.resolvedLanguage?.startsWith(lng.code) || i18n.language?.startsWith(lng.code) || (lng.code === 'en' && !i18n.language);
        return (
          <button
            key={lng.code}
            onClick={() => i18n.changeLanguage(lng.code)}
            className={`text-xs font-medium px-2 py-1 rounded-sm transition-colors ${
              isActive 
                ? 'bg-surface-high text-white' 
                : 'text-on-surface-variant hover:text-white hover:bg-surface-low'
            }`}
          >
            {lng.label}
          </button>
        );
      })}
    </div>
  );
}
