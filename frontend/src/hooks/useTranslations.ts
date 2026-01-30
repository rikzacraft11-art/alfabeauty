import { useLocale } from "@/components/i18n/LocaleProvider";
import { t } from "@/lib/i18n";

export function useTranslations() {
    const { locale } = useLocale();
    return t(locale);
}
