import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ShieldIcon, DisplayIcon, WebsiteIcon, ProfileIcon, QrCodeIcon, CreditCardIcon, BackIcon } from '../constants';

interface SettingsPageProps {
  onNavigate: (path: string) => void;
  openLanguageModal: () => void;
  openQrCodeModal: () => void;
  onBack: () => void;
  openThemeModal: () => void;
}

const SettingsRow: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left p-4 flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-lg"
  >
    <div className="text-on-surface-secondary">{icon}</div>
    <div className="flex-1">
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm text-on-surface-secondary">{description}</p>
    </div>
    <div className="text-on-surface-secondary">
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"></path></svg>
    </div>
  </button>
);

const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate, openLanguageModal, openQrCodeModal, onBack, openThemeModal }) => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef<number>(0);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full pb-16 md:pb-0 min-h-screen">
      <div className={`sticky top-0 bg-background/80 dark:bg-dark-background/80 backdrop-blur-md z-10 px-4 py-3 border-b border-border dark:border-dark-border transition-transform duration-300 ${!isHeaderVisible ? '-translate-y-full' : ''}`}>
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface-hover transition-colors">
                <BackIcon className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">{t('settings_title')}</h1>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <SettingsRow
          icon={<ProfileIcon className="w-6 h-6" />}
          title={t('settings_your_account')}
          description={t('settings_your_account_desc')}
          onClick={() => onNavigate('profile')}
        />
        <SettingsRow
          icon={<ShieldIcon className="w-6 h-6" />}
          title={t('settings_privacy')}
          description={t('settings_privacy_desc')}
          onClick={() => onNavigate('privacy')}
        />
         <SettingsRow
          icon={<CreditCardIcon className="w-6 h-6" />}
          title={t('wallet_title')}
          description={t('wallet_description')}
          onClick={() => onNavigate('wallet')}
        />
        <SettingsRow
          icon={<DisplayIcon className="w-6 h-6" />}
          title={t('settings_display')}
          description={t('settings_display_desc')}
          onClick={openThemeModal}
        />
        <SettingsRow
          icon={<WebsiteIcon className="w-6 h-6" />}
          title={t('settings_language')}
          description={t('settings_language_desc')}
          onClick={openLanguageModal}
        />
        <SettingsRow
          icon={<QrCodeIcon className="w-6 h-6" />}
          title={t('profile_menu_qr_code')}
          description={t('settings_qr_code_desc')}
          onClick={openQrCodeModal}
        />
      </div>
    </div>
  );
};

export default SettingsPage;