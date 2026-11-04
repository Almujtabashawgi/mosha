import { whatsappLink } from '../config/site';
import { useLang } from '../hooks/useLang';
import { WhatsAppIcon } from './ui';

/** Floating WhatsApp button (bottom corner, respects RTL and the phone safe area). */
export default function WhatsAppButton() {
  const { t } = useLang();
  return (
    <a
      href={whatsappLink(t('common.whatsappGeneral'))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('common.chatWhatsapp')}
      className="group fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] end-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition hover:scale-105 hover:bg-[#1ebe5b] focus-visible:ring-offset-white"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.5s]" aria-hidden />
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
