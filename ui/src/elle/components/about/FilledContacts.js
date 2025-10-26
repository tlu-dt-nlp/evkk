import React from 'react';
import ContactCard from './ContactCard';
import { WORKER_IMAGES } from '../../resources/images/workers';
import i18n from 'i18next';
import { Languages } from '../../translations/i18n';

export default function FilledContacts() {

  const getEtisLanguage = () => {
    return i18n.language === Languages.ESTONIAN ? 'est' : 'eng';
  };

  const [etisLanguage, setEtisLanguage] = React.useState(getEtisLanguage());

  i18n.on('languageChanged', () => {
    setEtisLanguage(getEtisLanguage());
  });

  return (
    <>
      <ContactCard name="PhD Pille Eslon"
                   role="dotsent"
                   email="peslon@tlu.ee"
                   etisUrl={`https://www.etis.ee/CV/Pille_Eslon/${etisLanguage}`}
                   icon={WORKER_IMAGES.pille} />
      <ContactCard name="MSc Jaagup Kippar"
                   role="tarkvaratehnika teenekas lektor"
                   email="jaagup@tlu.ee"
                   etisUrl={`https://www.etis.ee/CV/Jaagup_Kippar/${etisLanguage}`}
                   icon={WORKER_IMAGES.jaagup} />
      <ContactCard name="MA Kais Allkivi"
                   role="nooremteadur"
                   email="kais@tlu.ee"
                   etisUrl={`https://www.etis.ee/CV/Kais_Allkivi/${etisLanguage}`}
                   icon={WORKER_IMAGES.kais} />
      <ContactCard name="MSc Kaisa Norak"
                   role="analüütik"
                   email="kaisa.norak@gmail.com"
                   etisUrl={`https://www.etis.ee/CV/Kaisa_Norak/${etisLanguage}`}
                   icon={WORKER_IMAGES.kaisa} />
      <ContactCard name="BSc Harli Kodasma"
                   role="keeletehnoloog-analüütik-tarkvaraarendaja, magistrant"
                   email="harli.kodasma@tlu.ee"
                   etisUrl={`https://www.etis.ee/CV/Harli_Kodasma/${etisLanguage}`}
                   icon={WORKER_IMAGES.harli} />
      <ContactCard name="BSc Taavi Kamarik"
                   role="keeletehnoloog-analüütik-tarkvaraarendaja, magistrant"
                   email="taavik@tlu.ee"
                   etisUrl={`https://www.etis.ee/CV/Taavi_Kamarik/${etisLanguage}`}
                   icon={WORKER_IMAGES.taavi} />
      <ContactCard name="MA Karina Kert"
                   role="analüütik"
                   email="karina.kert@tlu.ee"
                   etisUrl={`https://www.etis.ee/CV/Karina_Kert/${etisLanguage}`}
                   icon={WORKER_IMAGES.karina} />
      <ContactCard name="BA Silvia Maine"
                   role="analüütik"
                   email="silvia.maine@tlu.ee"
                   etisUrl={`https://www.etis.ee/CV/Silvia_Maine/${etisLanguage}`}
                   icon={WORKER_IMAGES.silvia} />
      <ContactCard name="BSc Mikk Tarvas"
                   role="konsultant"
                   email="mikk.tarvas@gmail.com"
                   icon={WORKER_IMAGES.mikk} />
    </>
  );
}
