import {useSettingsStore} from "@/store/modules/settings";
import {createI18n} from "vue-i18n";
import en from "./locales/en.json";
import zh_HK from "./locales/zh_HK.json";
import zh_CN from "./locales/zh_CN.json";
import pinia from "~/src/store";
import {getItem} from "@/utils/storage";
import {isJson} from "@/utils/validate";
import {settings} from "@/config";

export {en, zh_HK, zh_CN};

const messages = {
    en,
    "zh-CN": zh_CN,
    "zh-HK": zh_HK,
};

function getLanguage() {
    const {getLanguage} = useSettingsStore(pinia);
    if (!getLanguage) {
        const value = getItem("setting_language");
        if (!value) {
            return settings.language;
        }
    }
    return getLanguage;
}

export const i18n = createI18n({
    globalInjection: true,
    legacy: false, // you must specify 'legacy: false' option
    fallbackWarn: false,
    missingWarn: false,
    locale: getLanguage(),
    fallbackLocale: "zh-CN",
    messages,
});

export function setupI18n(app) {
    app.use(i18n);
    return i18n;
}

export function translate(message) {
    if (!message) {
        return "";
    }
    return (
        [getLanguage(), message].reduce((o, k) => (o || {})[k], messages) || message
    );
}
