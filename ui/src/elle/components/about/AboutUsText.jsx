import { Typography } from '@mui/material';
import {
  CC_BY_4_0_LICENSE_PATH,
  ELLE_PATH,
  EVKK_GITHUB_PATH,
  EVKK_VERS1_PATH,
  MIT_LICENSE_PATH
} from '../../const/PathConstants';
import NewTabHyperlink from '../NewTabHyperlink';

export default function AboutUsText() {

  return (
    <Typography>
      <h3>Mis on ELLE?</h3>
      <br />
      ELLE on Tallinna Ülikoolis arendatav keskkond eesti keele õpetamiseks, õppimiseks ja keeleanalüüsiks.
      Keskkonna aluseks on eesti vahekeele ehk õppijakeele korpus EVKK, mis on eesti keele kui teise keele ja
      võõrkeele õppijate kirjalike tekstide kogu.<br /><br />

      ELLE keskkond võimaldab EVKK korpust pidevalt täiendada. Nimelt saab ELLE-s kirjutatud ja analüüsitud tekste
      EVKK-le loovutada. Järjest täienev keelematerjal annab ülevaate õppijate oskustest ja raskustest erinevatel
      keeletasemetel ning aitab seeläbi arendada keeleõpperakendusi ja -materjale.<br /><br />

      Keskkond pakub tekstianalüüsi tuge ka eesti keele kui emakeele õppes, uurimistöös ja tekstidega töötades.
      Keeleõppijate kirjutiste kõrval kogume eesti ja muu emakeelega üliõpilaste akadeemilisi tekste, et luua
      edaspidi erialakeele omandamist toetavat õppevara.<br /><br />

      Kõik EVKK ressursid ei ole veel ELLE-sse üle kantud. Korpuse vana lehekülge on võimalik külastada&nbsp;
      <NewTabHyperlink path={EVKK_VERS1_PATH}
                       content="siin" />.
      ELLE arendusega saab ennast kurssi viia meie&nbsp;
      <NewTabHyperlink path={EVKK_GITHUB_PATH}
                       content="GitHubi repositooriumis" />.<br /><br />

      ELLE tarkvara on kasutatav&nbsp;
      <NewTabHyperlink path={MIT_LICENSE_PATH}
                       content="MIT-litsentsi" />
      &nbsp;alusel ja EVKK tekstikogu&nbsp;
      <NewTabHyperlink path={CC_BY_4_0_LICENSE_PATH}
                       content="CC BY 4.0" />
      &nbsp;litsentsi alusel. Palume viidata Tallinna Ülikooli digitehnoloogiate instituudile ja leheküljele&nbsp;
      <NewTabHyperlink path={ELLE_PATH}
                       content="elle.tlu.ee" />.
    </Typography>
  );
}
