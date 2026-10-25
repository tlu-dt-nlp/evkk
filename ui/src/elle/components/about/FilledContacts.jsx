import ContactCard from './ContactCard';
import { WORKER_IMAGES } from '../../resources/images/workers';
import { useTranslation } from 'react-i18next';
import { Languages } from '../../translations/i18n';

export default function FilledContacts() {
  const { i18n } = useTranslation();
  const etisLanguage = i18n.language === Languages.ESTONIAN ? 'est' : 'eng';

  return (
    <div className="contacts-grid">
      <ContactCard name="Kais Allkivi"
                   degree="PhD"
                   degreeInProgress
                   role="people_role_language_technology_project_manager"
                   email="kais@tlu.ee"
                   etisUrl={`https://www.etis.ee/CV/Kais_Allkivi/${etisLanguage}`}
                   icon={WORKER_IMAGES.kais} />
      <ContactCard name="Harli Kodasma"
                   degree="MSc"
                   role="people_role_language_technologist_software_developer"
                   email="harli.kodasma@tlu.ee"
                   etisUrl={`https://www.etis.ee/CV/Harli_Kodasma/${etisLanguage}`}
                   icon={WORKER_IMAGES.harli} />
      <ContactCard name="Taavi Kamarik"
                   degree="MSc"
                   degreeInProgress
                   role="people_role_language_technologist_software_developer"
                   email="taavik@tlu.ee"
                   etisUrl={`https://www.etis.ee/CV/Taavi_Kamarik/${etisLanguage}`}
                   icon={WORKER_IMAGES.taavi} />
      <ContactCard name="Jaagup Kippar"
                   degree="MSc"
                   role="people_role_distinguished_lecturer_software_engineering"
                   email="jaagup@tlu.ee"
                   etisUrl={`https://www.etis.ee/CV/Jaagup_Kippar/${etisLanguage}`}
                   icon={WORKER_IMAGES.jaagup} />
      <ContactCard name="Pille Eslon"
                   degree="PhD"
                   role="people_role_associate_professor_emeritus"
                   email="peslon@tlu.ee"
                   etisUrl={`https://www.etis.ee/CV/Pille_Eslon/${etisLanguage}`}
                   icon={WORKER_IMAGES.pille} />
      <ContactCard name="Annekatrin Kaivapalu"
                   degree="PhD"
                   role="people_role_visiting_researcher_digital_language_learning"
                   email="annekatrin.kaivapalu@tlu.ee"
                   etisUrl={`https://www.etis.ee/CV/Annekatrin_Kaivapalu/${etisLanguage}`}
                   icon={WORKER_IMAGES.annekatrin} />
      <ContactCard name="Olga Gaitšenja"
                   degree="PhD"
                   role="people_role_visiting_researcher_call"
                   email="olga.gaitsenja@tlu.ee"
                   etisUrl={`https://www.etis.ee/CV/Olga_Pastuhhova/${etisLanguage}`} />
      <ContactCard name="Karina Kert"
                   degree="MA"
                   role="people_role_analyst"
                   email="karina.kert@tlu.ee"
                   etisUrl={`https://www.etis.ee/CV/Karina_Kert/${etisLanguage}`}
                   icon={WORKER_IMAGES.karina} />
      <ContactCard name="Silvia Maine"
                   degree="BA"
                   role="people_role_analyst"
                   email="silvia.maine@tlu.ee"
                   etisUrl={`https://www.etis.ee/CV/Silvia_Maine/${etisLanguage}`}
                   icon={WORKER_IMAGES.silvia} />
      <ContactCard name="Ester Ojala"
                   degree="MSc"
                   degreeInProgress
                   role="people_role_language_technologist_analyst"
                   email="ester.ojala@tlu.ee"
                   icon={WORKER_IMAGES.ester} />
      <ContactCard name="Kaisa Norak"
                   degree="MSc"
                   role="people_role_consultant_thesis_supervisor"
                   email="kaisa.norak@gmail.com"
                   etisUrl={`https://www.etis.ee/CV/Kaisa_Norak/${etisLanguage}`}
                   icon={WORKER_IMAGES.kaisa} />
      <ContactCard name="Mikk Tarvas"
                   degree="BSc"
                   role="people_role_consultant_thesis_supervisor"
                   email="mikk.tarvas@gmail.com"
                   icon={WORKER_IMAGES.mikk} />
    </div>
  );
}
