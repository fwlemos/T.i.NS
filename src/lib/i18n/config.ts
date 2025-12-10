import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonEn from './locales/en/common.json';
import authEn from './locales/en/auth.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                common: commonEn,
                auth: authEn,
            },
        },
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
        ns: ['common', 'auth'],
        defaultNS: 'common',
    });

export default i18n;
