import { Fragment, useMemo, useState, useEffect } from 'react';
import './styles/Account.css';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { RouteConstants } from '../const/RouteConstants';
import { Button, Checkbox, FormControl, FormControlLabel, IconButton, ListItemText, MenuItem, Modal, Select, TextField } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShareIcon from '@mui/icons-material/Share';
import CreateIcon from '@mui/icons-material/Create';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { DefaultButtonStyle } from '../const/StyleConstants';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { useTranslation } from 'react-i18next';
import { ageOptions, countryOptionsForAddingText, genderOptions, textLevelOptions } from '../const/Constants';
import { prependAccountActivity, readAccountActivities } from '../utils/accountActivityLog';

const MAT_TYPE_CONFIG = {
  TEKST: { bg: '#FFD0FD', color: '#9C27B0' },
  VIDEO: { bg: '#FFC5C5', color: '#c0392b' },
  FAIL:  { bg: '#D0EAFF', color: '#1565c0' },
  LINK:  { bg: '#D2F1C7', color: '#2e7d32' },
};

const AVAILABLE_MATERIALS = [
  { id: 1, title: 'Nimetav, omastav ja osastav', description: 'Lühitekst eesti keele põhiliste käänete kasutamisest', tags: ['Eesti keel teise keelena', 'Grammatika', 'A2'], type: 'TEKST', content: `Eesti keeles on kolm olulist käänet: nimetav, omastav ja osastav. Neid kasutatakse väga sageli ning need aitavad mõista, kuidas sõnad lauses muutuvad ja omavahel seotud on.

Nimetav vastab küsimustele kes? mis? ja näitab sõna algvormi. Seda kasutatakse siis, kui nimetatakse eset või inimest. Näiteks: raamat, kass, maja. Nimetav on kõige lihtsam vorm ja seda kasutatakse sageli lause alusena.

Omastav vastab küsimustele kelle? mille? ning näitab kuuluvust või seost. Seda kasutatakse näiteks siis, kui räägitakse, kellele midagi kuulub või millega miski seotud on. Näiteks: raamatu kaas, kassi saba, maja uks. Omastav vorm esineb sageli ka pikemates sõnaühendites.

Osastav vastab küsimustele keda? mida? ja näitab osa tervikust või tegevust, mis ei ole lõpetatud. Seda kasutatakse väga tihti koos tegusõnadega. Näiteks: loen raamatut, näen kassi, ehitan maja. Osastav vorm on eriti oluline, sest see näitab, kas tegevus on lõpetatud või kestab veel.

Võrdluseks võib tuua järgmised vormid: raamat – raamatu – raamatut, kass – kassi – kassi, maja – maja – maja. Nende vormide õppimine aitab paremini aru saada, kuidas sõnad muutuvad erinevates olukordades.

Oluline on meeles pidada, et erinevad käänded annavad lausele täpsema tähenduse. Kui kasutada vale vormi, võib lause tähendus muutuda või olla raskesti arusaadav.

Neid kolme käänet kasutatakse eesti keeles väga sageli, eriti igapäevaste tegevuste, esemete ja olukordade kirjeldamisel. Seetõttu on nende õppimine oluline igaühele, kes õpib eesti keelt.` },
  { id: 2, title: 'Sõnavara: Kodused tegevused', description: 'Videotund tavaliselt kodustest tegevustest', tags: ['Eesti keel teise keelena', 'Grammatika', 'A2'], type: 'VIDEO', url: 'https://sisuloome.e-koolikott.ee/h5p/21892/embed' },
  { id: 3, title: 'Eesti linnad', description: 'Lühitekst Eesti suurematest linnadest ja nende eripäradest', tags: ['Eesti keel teise keelena', 'Grammatika', 'Suur ja väike algustäht', 'A2'], type: 'LINK', url: 'https://www.valem.ee/et/eesti-linnad' },
  { id: 4, title: 'Kevad looduses', description: 'Pildid kevadisest loodusest', tags: ['Eesti keel teise keelena', 'Suur ja väike algustäht', 'C2'], type: 'FAIL', displayName: 'Kevad.pdf', filename: 'Kevad.pdf' },
];

const AVAILABLE_EXERCISES = [
  {
    id: 1,
    title: 'Tegusõnad oleviku vormis',
    description: 'Kirjuta tegusõnad oleviku vormis',
    tags: ['Eesti keel teise keelena', 'Tegusõnad ja ajavormid', 'B2'],
    category: 'Tegusõnad ja ajavormid',
    level: 'B2',
    url: 'https://sisuloome.e-koolikott.ee/h5p/4495/embed',
    time: '10 min',
  },
  {
    id: 2,
    title: 'Sõnaliigid',
    description: 'Harjutus sõnaliikide määramiseks.',
    tags: ['Eesti keel teise keelena', 'Sõnaliigid', 'B1'],
    category: 'Sõnaliigid',
    level: 'B1',
    url: 'https://sisuloome.e-koolikott.ee/h5p/2917/embed',
    time: '10 min',
  },
  {
    id: 3,
    title: 'Käänded (Ainsus ja mitmus)',
    description: 'Kirjuta õige vorm',
    tags: ['Eesti keel teise keelena', 'Käänded', 'A2'],
    category: 'Käänded',
    level: 'A2',
    url: 'https://sisuloome.e-koolikott.ee/h5p/16646/embed',
    time: '10 min',
  },
];

function normalizeStoredExercises(stored) {
  if (!Array.isArray(stored)) return [];
  const allowedUrls = new Set(AVAILABLE_EXERCISES.map(e => e.url));
  return stored
    .filter(ex => ex && typeof ex.url === 'string' && allowedUrls.has(ex.url))
    .map(ex => {
      const canon = AVAILABLE_EXERCISES.find(a => a.url === ex.url);
      if (!canon) return ex;
      return {
        ...canon,
        status: ex.status || 'alustamata',
        ...(ex.score != null ? { score: ex.score } : {}),
        ...(ex.completedAt ? { completedAt: ex.completedAt } : {}),
      };
    });
}

function normalizeStoredMaterials(stored) {
  if (!Array.isArray(stored)) return [];
  return stored.map((mat) => {
    const canon = AVAILABLE_MATERIALS.find((m) => m.id === mat.id) || AVAILABLE_MATERIALS.find((m) => m.title === mat.title);
    return canon ? { ...canon } : mat;
  });
}

function getMaterialEmbedUrl(url) {
  if (!url || typeof url !== 'string') return null;
  if (/sisuloome\.e-koolikott\.ee\/h5p\/\d+\/embed/i.test(url)) return url;
  return null;
}

const KATEGOORIAD = [
  'Võõrsõnad', 'Käänded', 'Kokku- ja lahkukirjutamine', 'Suur ja väike algustäht',
  'Liitlause', 'Grammatika', 'Tegusõnad ja ajavormid', 'Sõnavara ja tähendus',
  'Sõnajärg lauses', 'Täpid ja komad', 'Sõnaliigid', 'Kuulamine ja arusaamine'
];
const KEELETASE = ['A2', 'A1', 'B1', 'B2', 'C1', 'C2'];
const TUUP = ['Video', 'Link', 'Fail', 'Tekst'];

function matchesTypeFilter(selectedTypes, matType) {
  if (!selectedTypes.length) return true;
  return selectedTypes.some(t => matType.toUpperCase() === String(t).toUpperCase());
}

function learningAppsEmbedUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const view = url.match(/learningapps\.org\/view(\d+)/i);
  if (view) return `https://learningapps.org/watch?app=${view[1]}`;
  const appParam = url.match(/learningapps\.org[^?]*\?[^#]*app=(\d+)/i) || url.match(/learningapps\.org.*[?&]app=(\d+)/i);
  if (appParam) return `https://learningapps.org/watch?app=${appParam[1]}`;
  return null;
}

function getExerciseEmbedUrl(url) {
  if (/sisuloome\.e-koolikott\.ee\/h5p\/\d+\/embed/i.test(url || '')) return url;
  return learningAppsEmbedUrl(url);
}

function parseExerciseScorePercent(data) {
  const visit = (x, depth) => {
    if (depth > 12 || x == null) return null;
    if (typeof x === 'number' && Number.isFinite(x)) {
      if (x >= 0 && x <= 1) return Math.round(x * 100);
      if (x > 1 && x <= 100) return Math.round(x);
      return null;
    }
    if (typeof x === 'string') {
      const t = x.trim();
      const frac = t.match(/^(\d+)\s*\/\s*(\d+)$/);
      if (frac) {
        const a = Number(frac[1]);
        const b = Number(frac[2]);
        if (b > 0 && a >= 0 && a <= b * 2) return Math.min(100, Math.round((100 * a) / b));
      }
      const pct = t.match(/^(\d{1,3})\s*%$/);
      if (pct) return Math.min(100, Number(pct[1]));
      try {
        return visit(JSON.parse(t), depth + 1);
      } catch {
        return null;
      }
    }
    if (typeof x === 'object') {
      if (Array.isArray(x)) {
        for (let i = x.length - 1; i >= 0; i -= 1) {
          const r = visit(x[i], depth + 1);
          if (r != null) return r;
        }
        return null;
      }
      const sc = x.score ?? x.result?.score;
      if (sc != null && typeof sc === 'object') {
        if (sc.scaled != null && Number.isFinite(Number(sc.scaled))) {
          const s = Number(sc.scaled);
          if (s >= 0 && s <= 1) return Math.round(s * 100);
        }
        if (sc.raw != null && sc.max != null && Number(sc.max) > 0) {
          return Math.min(100, Math.round((100 * Number(sc.raw)) / Number(sc.max)));
        }
      }
      if (x.maxScore != null && Number(x.maxScore) > 0 && x.score != null && typeof x.score === 'number') {
        return Math.min(100, Math.round((100 * Number(x.score)) / Number(x.maxScore)));
      }
      const keys = Object.keys(x);
      for (let i = keys.length - 1; i >= 0; i -= 1) {
        const r = visit(x[keys[i]], depth + 1);
        if (r != null) return r;
      }
    }
    return null;
  };
  return visit(data, 0);
}

const TABS = [
  { id: RouteConstants.ACCOUNT_OVERVIEW, label: 'Ülevaade' },
  { id: RouteConstants.ACCOUNT_ACTIVITIES, label: 'Tegevused' },
  { id: RouteConstants.ACCOUNT_MATERIALS, label: 'Õppevara' },
  { id: RouteConstants.ACCOUNT_TEXTS, label: 'Minu tekstid' },
  { id: RouteConstants.ACCOUNT_DATA, label: 'Minu andmed' }
];

const REMOVED_EXERCISE_TITLES = new Set([
  'Infinitiivivormide harjutus',
  'Vead lauses (algustäht, lõpumärk, koma!)',
]);

function normalizeAccountActivities(stored) {
  if (!Array.isArray(stored)) return [];
  return stored.filter((row) => {
    if (!row || typeof row !== 'object') return false;
    if (row.type !== 'harjutus') return true;
    return !REMOVED_EXERCISE_TITLES.has(String(row.label || '').trim());
  });
}

const ACTIVITY_TYPE_LABELS = {
  harjutus: 'Harjutus',
  tekstihindaja: 'Tekstihindaja',
  oppematerjal: 'Õppematerjal',
  tekst: 'Tekst',
};
const ACTIVITY_STATUS_LABELS = {
  tehtud: 'Tehtud',
  analüüsitud: 'Analüüsitud',
  vaadatud: 'Vaadatud',
  lisatud: 'Lisatud',
};
const ACTIVITIES_PER_PAGE = 8;

function formatActivityKuupaev(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}

function startOfWeekMonday(d) {
  const x = new Date(d);
  const day = x.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isInCurrentWeek(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return false;
  const start = startOfWeekMonday(new Date());
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return d >= start && d < end;
}

function overviewActivityCopy(row) {
  const date = formatActivityKuupaev(row.createdAt);
  switch (row.type) {
    case 'harjutus':
      return { main: `Harjutus: „${row.label}“`, extra: row.result || null, date };
    case 'oppematerjal':
      return { main: `Õppematerjal: ${row.label}`, extra: null, date };
    case 'tekst':
      return { main: `Lisati tekst: „${row.label}“`, extra: null, date };
    case 'tekstihindaja':
      return { main: `Analüüsiti tekst: „${row.label}“`, extra: row.result || null, date };
    default:
      return { main: row.label, extra: row.result || null, date };
  }
}

export default function Account() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isDataInfoOpen, setIsDataInfoOpen] = useState(false);
  const [activityFilter, setActivityFilter] = useState('koik');
  const [kasutajanimi, setKasutajanimi] = useState('Katrin');
  const [epost, setEpost] = useState('katrin@tlu.ee');
  const [materialsSearch, setMaterialsSearch] = useState('');
  const [selectedKategooriad, setSelectedKategooriad] = useState([]);
  const [selectedKeeletase, setSelectedKeeletase] = useState([]);
  const [selectedTuup, setSelectedTuup] = useState([]);
  const [exercisesSearch, setExercisesSearch] = useState('');
  const [exercisesKategooriad, setExercisesKategooriad] = useState([]);
  const [exercisesKeeletase, setExercisesKeeletase] = useState([]);
  const [exercisesHarjutusFilter, setExercisesHarjutusFilter] = useState('koik');
  const [savedExercises, setSavedExercises] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('minu_harjutused')) || [];
      return normalizeStoredExercises(raw);
    } catch { return []; }
  });
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);
  const [modalExSearch, setModalExSearch] = useState('');
  const [modalExKategooriad, setModalExKategooriad] = useState([]);
  const [modalExKeeletase, setModalExKeeletase] = useState([]);
  const [embedExercise, setEmbedExercise] = useState(null);
  const [embedExerciseScore, setEmbedExerciseScore] = useState(null);

  const [savedMaterials, setSavedMaterials] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('minu_oppematerjalid')) || [];
      return normalizeStoredMaterials(raw);
    } catch { return []; }
  });
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [viewMaterial, setViewMaterial] = useState(null);
  const [modalMatSearch, setModalMatSearch] = useState('');
  const [modalMatKategooriad, setModalMatKategooriad] = useState([]);
  const [modalMatKeeletase, setModalMatKeeletase] = useState([]);
  const [modalMatTuup, setModalMatTuup] = useState([]);

  const [myTexts, setMyTexts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('minu_tekstid')) || []; }
    catch { return []; }
  });
  const [textsSearch, setTextsSearch] = useState('');
  const [textsFilter, setTextsFilter] = useState('koik');
  const [isAddTextOpen, setIsAddTextOpen] = useState(false);
  const [textForm, setTextForm] = useState({ title: '', content: '', isAuthor: false });
  const [editingTextId, setEditingTextId] = useState(null);
  const [viewText, setViewText] = useState(null);

  const [activityLog, setActivityLog] = useState(() => normalizeAccountActivities(readAccountActivities()));
  const [activitiesPage, setActivitiesPage] = useState(1);

  const pathAccountMaterialsStudy = `/${RouteConstants.ACCOUNT}/${RouteConstants.ACCOUNT_MATERIALS}/${RouteConstants.ACCOUNT_MATERIALS_STUDY}`;
  const pathAccountExercises = `/${RouteConstants.ACCOUNT}/${RouteConstants.ACCOUNT_MATERIALS}/${RouteConstants.ACCOUNT_MATERIALS_EXERCISES}`;
  const pathAccountTexts = `/${RouteConstants.ACCOUNT}/${RouteConstants.ACCOUNT_TEXTS}`;

  const filteredActivities = useMemo(() => {
    if (activityFilter === 'koik') return activityLog;
    return activityLog.filter((a) => a.type === activityFilter);
  }, [activityLog, activityFilter]);

  const activitiesTotalPages = Math.max(1, Math.ceil(filteredActivities.length / ACTIVITIES_PER_PAGE));

  const paginatedActivities = useMemo(() => {
    const page = Math.min(activitiesPage, activitiesTotalPages);
    const start = (page - 1) * ACTIVITIES_PER_PAGE;
    return filteredActivities.slice(start, start + ACTIVITIES_PER_PAGE);
  }, [filteredActivities, activitiesPage, activitiesTotalPages]);

  const overviewStats = useMemo(() => {
    const solved = savedExercises.filter((e) => e.status === 'tehtud').length;
    const scored = savedExercises.filter(
      (e) => e.status === 'tehtud' && e.score != null && Number.isFinite(Number(e.score))
    );
    const avgPct = scored.length
      ? Math.round(scored.reduce((s, e) => s + Number(e.score), 0) / scored.length)
      : null;
    const analyzedTexts = activityLog.filter((a) => a.type === 'tekstihindaja').length;
    return {
      solved,
      avgPct,
      textsCount: myTexts.length,
      analyzedTexts,
      savedMaterialsCount: savedMaterials.length,
    };
  }, [savedExercises, activityLog, myTexts, savedMaterials]);

  const weekActionCount = useMemo(
    () => activityLog.filter((a) => isInCurrentWeek(a.createdAt)).length,
    [activityLog]
  );

  const weekProgressPct = weekActionCount === 0 ? 0 : Math.min(100, Math.round((weekActionCount / 7) * 100));

  const overviewRecentActivities = useMemo(() => activityLog.slice(0, 7), [activityLog]);

  useEffect(() => {
    const sync = () => setActivityLog(normalizeAccountActivities(readAccountActivities()));
    window.addEventListener('elle-account-activity', sync);
    return () => window.removeEventListener('elle-account-activity', sync);
  }, []);

  useEffect(() => {
    setActivitiesPage(1);
  }, [activityFilter]);

  useEffect(() => {
    setActivitiesPage((p) => Math.min(p, activitiesTotalPages));
  }, [activitiesTotalPages]);

  useEffect(() => {
    localStorage.setItem('minu_oppematerjalid', JSON.stringify(savedMaterials));
  }, [savedMaterials]);

  useEffect(() => {
    localStorage.setItem('minu_harjutused', JSON.stringify(savedExercises));
  }, [savedExercises]);

  useEffect(() => {
    localStorage.setItem('minu_tekstid', JSON.stringify(myTexts));
  }, [myTexts]);

  useEffect(() => {
    if (!embedExercise?.embedUrl || embedExercise.noIframe) return undefined;

    const onMessage = (event) => {
      let host = '';
      try { host = new URL(event.origin).hostname; } catch { return; }
      if (!host.endsWith('e-koolikott.ee') && !host.endsWith('learningapps.org')) return;
      const score = parseExerciseScorePercent(event.data);
      if (score != null) {
        setEmbedExerciseScore((prev) => (prev == null || score > prev ? score : prev));
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [embedExercise?.embedUrl, embedExercise?.noIframe]);

  const saveText = () => {
    if (!textForm.title.trim() || !textForm.content.trim()) return;
    const wordCount = textForm.content.trim().split(/\s+/).length;
    if (editingTextId !== null) {
      setMyTexts(prev => prev.map(t => t.id === editingTextId
        ? { ...t, title: textForm.title.trim(), content: textForm.content.trim(), wordCount, isAuthor: textForm.isAuthor }
        : t
      ));
    } else {
      const now = new Date();
      const date = `${String(now.getDate()).padStart(2,'0')}.${String(now.getMonth()+1).padStart(2,'0')}.${now.getFullYear()}`;
      setMyTexts(prev => [{ id: Date.now(), title: textForm.title.trim(), content: textForm.content.trim(), wordCount, createdAt: date, isAuthor: textForm.isAuthor }, ...prev]);
      prependAccountActivity({
        type: 'tekst',
        label: textForm.title.trim(),
        result: '',
        status: 'lisatud',
        openPath: pathAccountTexts,
      });
    }
    setTextForm({ title: '', content: '', isAuthor: false });
    setEditingTextId(null);
    setIsAddTextOpen(false);
  };

  const openEdit = (tx) => {
    setTextForm({ title: tx.title, content: tx.content, isAuthor: tx.isAuthor });
    setEditingTextId(tx.id);
    setIsAddTextOpen(true);
  };

  const deleteText = (id) => {
    setMyTexts(prev => prev.filter(t => t.id !== id));
  };

  const openExercise = (ex) => {
    const embedUrl = getExerciseEmbedUrl(ex.url);
    if (embedUrl) {
      setEmbedExerciseScore(ex.score != null && Number.isFinite(Number(ex.score)) ? Number(ex.score) : null);
      setEmbedExercise({ id: ex.id, title: ex.title, embedUrl, tabUrl: ex.url, noIframe: false });
    } else {
      if (/sisuloome\.e-koolikott\.ee/i.test(ex.url)) {
        setEmbedExerciseScore(ex.score != null && Number.isFinite(Number(ex.score)) ? Number(ex.score) : null);
        setEmbedExercise({ id: ex.id, title: ex.title, tabUrl: ex.url, noIframe: true });
        return;
      }
      window.open(ex.url, '_blank', 'noopener,noreferrer');
    }
  };

  const closeExerciseEmbed = () => {
    setEmbedExercise(null);
    setEmbedExerciseScore(null);
  };

  const markEmbeddedExerciseTehtud = () => {
    if (!embedExercise) return;
    const prevEx = savedExercises.find((e) => e.id === embedExercise.id);
    const score = embedExerciseScore != null ? embedExerciseScore : prevEx?.score;
    prependAccountActivity({
      type: 'harjutus',
      label: embedExercise.title || 'Harjutus',
      result: score != null && Number.isFinite(Number(score)) ? `${score}%` : '',
      status: 'tehtud',
      openPath: pathAccountExercises,
    });
    setSavedExercises(prev => prev.map(ex => {
      if (ex.id !== embedExercise.id) return ex;
      const next = { ...ex, status: 'tehtud', completedAt: new Date().toISOString() };
      if (score != null && Number.isFinite(Number(score))) next.score = Math.round(Number(score));
      return next;
    }));
    closeExerciseEmbed();
  };

  const { topTab, leafTab } = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    const leaf = parts[parts.length - 1] || RouteConstants.ACCOUNT_OVERVIEW;

    const top = parts.includes(RouteConstants.ACCOUNT_OVERVIEW)
      ? RouteConstants.ACCOUNT_OVERVIEW
      : parts.includes(RouteConstants.ACCOUNT_ACTIVITIES)
        ? RouteConstants.ACCOUNT_ACTIVITIES
        : parts.includes(RouteConstants.ACCOUNT_MATERIALS)
          ? RouteConstants.ACCOUNT_MATERIALS
          : parts.includes(RouteConstants.ACCOUNT_TEXTS)
            ? RouteConstants.ACCOUNT_TEXTS
            : parts.includes(RouteConstants.ACCOUNT_DATA)
              ? RouteConstants.ACCOUNT_DATA
              : RouteConstants.ACCOUNT_OVERVIEW;

    return { topTab: top, leafTab: leaf };
  }, [location.pathname]);

  const materialsSubTab = useMemo(() => {
    if (leafTab === RouteConstants.ACCOUNT_MATERIALS_EXERCISES) return RouteConstants.ACCOUNT_MATERIALS_EXERCISES;
    return RouteConstants.ACCOUNT_MATERIALS_STUDY;
  }, [leafTab]);

  const pageTitle = useMemo(() => {
    if (topTab === RouteConstants.ACCOUNT_MATERIALS) {
      return materialsSubTab === RouteConstants.ACCOUNT_MATERIALS_EXERCISES ? 'Harjutused' : 'Õppematerjalid';
    }
    return TABS.find(t => t.id === topTab)?.label || 'Ülevaade';
  }, [topTab, materialsSubTab]);

  const renderContent = () => {
    if (topTab !== RouteConstants.ACCOUNT_OVERVIEW) {
      if (topTab === RouteConstants.ACCOUNT_ACTIVITIES) {
        return (
          <div className="account-activities-page">
            <div className="account-activities-header">
              <FormControl size="small" className="account-materials-filter" sx={{ width: 175 }}>
                <Select
                  value={activityFilter}
                  onChange={(e) => setActivityFilter(e.target.value)}
                  displayEmpty
                  renderValue={() => {
                    if (activityFilter === 'koik') return 'Kõik tegevused';
                    if (activityFilter === 'harjutus') return 'Harjutus';
                    if (activityFilter === 'tekstihindaja') return 'Tekstihindaja';
                    if (activityFilter === 'oppematerjal') return 'Õppematerjal';
                    if (activityFilter === 'tekst') return 'Tekst';
                    return 'Kõik tegevused';
                  }}
                  className="account-materials-filter-select"
                  MenuProps={{
                    disableScrollLock: true,
                    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                    transformOrigin: { vertical: 'top', horizontal: 'left' },
                    PaperProps: {
                      style: { width: 175 },
                      sx: {
                        borderRadius: '0 0 5px 5px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
                        marginTop: '-1px',
                        '& .MuiMenuItem-root:hover': { backgroundColor: 'rgba(255, 208, 253, 0.4) !important' },
                        '& .MuiMenuItem-root.Mui-selected': { backgroundColor: 'transparent !important' },
                        '& .MuiMenuItem-root.Mui-selected:hover': { backgroundColor: 'rgba(255, 208, 253, 0.4) !important' }
                      }
                    }
                  }}
                >
                  <MenuItem value="koik">Kõik tegevused</MenuItem>
                  <MenuItem value="harjutus">Harjutus</MenuItem>
                  <MenuItem value="tekstihindaja">Tekstihindaja</MenuItem>
                  <MenuItem value="oppematerjal">Õppematerjal</MenuItem>
                  <MenuItem value="tekst">Tekst</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="account-activities-table-head">
              <span>Tüüp</span>
              <span>Tegevus</span>
              <span>Kuupäev</span>
              <span>Tulemus</span>
              <span>Staatus</span>
              <span />
            </div>

            {filteredActivities.length === 0 ? (
              <div className="account-activities-empty">
                Siin kuvatakse sinu tegevuste ajalugu. Sul ei ole veel ühtegi tegevust.
                Tegevused ilmuvad siia pärast õppematerjali vaatamist, teksti lisamist, harjutuste tegemist või tekstihindaja kasutamist.
              </div>
            ) : (
              <div className="account-activities-table">
                {paginatedActivities.map((row) => (
                  <div key={row.id} className="account-activity-row">
                    <span>{ACTIVITY_TYPE_LABELS[row.type] || row.type}</span>
                    <span>{row.label}</span>
                    <span>{formatActivityKuupaev(row.createdAt)}</span>
                    <span>{row.result || '—'}</span>
                    <span>{ACTIVITY_STATUS_LABELS[row.status] || row.status}</span>
                    <span>
                      <button
                        type="button"
                        className="account-row-open-btn"
                        onClick={() => row.openPath && navigate(row.openPath)}
                        disabled={!row.openPath}
                      >
                        Ava
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            )}

            {filteredActivities.length > 0 && (
              <div className="account-exercises-pagination account-activities-pagination">
                <button
                  type="button"
                  className="pagination-btn"
                  disabled={activitiesPage <= 1}
                  onClick={() => setActivitiesPage((p) => Math.max(1, p - 1))}
                >
                  Eelmine
                </button>
                <span className="pagination-page">
                  Leht {Math.min(activitiesPage, activitiesTotalPages)}/{activitiesTotalPages}
                </span>
                <button
                  type="button"
                  className="pagination-btn"
                  disabled={activitiesPage >= activitiesTotalPages}
                  onClick={() => setActivitiesPage((p) => Math.min(activitiesTotalPages, p + 1))}
                >
                  Järgmine
                </button>
              </div>
            )}
          </div>
        );
      }

      if (topTab === RouteConstants.ACCOUNT_MATERIALS) {
        const renderMultiSelect = (label, value, setValue, options, width) => (
          <FormControl size="small" className="account-materials-filter" sx={{ width }}>
            <Select
              multiple
              value={value}
              onChange={e => setValue(e.target.value)}
              displayEmpty
              renderValue={() => label}
              className="account-materials-filter-select"
              MenuProps={{
                disableScrollLock: true,
                anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                transformOrigin: { vertical: 'top', horizontal: 'left' },
                    PaperProps: {
                      style: { width: label === 'Kategooriad' ? 280 : width },
                      sx: {
                        borderRadius: '0 0 5px 5px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
                        marginTop: '-1px',
                        '& .MuiList-root': { padding: '4px 8px' },
                        '& .MuiMenuItem-root': { borderRadius: '4px' },
                        '& .MuiMenuItem-root:hover': { backgroundColor: 'rgba(255, 208, 253, 0.4) !important' },
                        '& .MuiMenuItem-root.Mui-selected': { backgroundColor: 'transparent !important' },
                        '& .MuiMenuItem-root.Mui-selected:hover': { backgroundColor: 'rgba(255, 208, 253, 0.4) !important' }
                      }
                    }
              }}
            >
              {options.map(option => (
                <MenuItem key={option} value={option} sx={{ padding: '2px 8px' }}>
                  <Checkbox
                    checked={value.includes(option)}
                    sx={{ color: '#9C27B0', '&.Mui-checked': { color: '#9C27B0' }, padding: '2px 6px' }}
                  />
                  <ListItemText primary={option} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

        if (materialsSubTab === RouteConstants.ACCOUNT_MATERIALS_EXERCISES) {
          const filteredSavedExercises = savedExercises.filter(ex => {
            const st = ex.status || 'alustamata';
            if (exercisesHarjutusFilter === 'tehtud' && st !== 'tehtud') return false;
            if (exercisesHarjutusFilter === 'alustamata' && st !== 'alustamata') return false;
            if (exercisesKategooriad.length > 0 && !exercisesKategooriad.includes(ex.category)) return false;
            if (exercisesKeeletase.length > 0 && !exercisesKeeletase.includes(ex.level)) return false;
            if (exercisesSearch && !ex.title.toLowerCase().includes(exercisesSearch.toLowerCase()) && !ex.description.toLowerCase().includes(exercisesSearch.toLowerCase())) return false;
            return true;
          });

          return (
            <div className="account-exercises-page">
              <div className="account-materials-search-area">
                <TextField
                  value={exercisesSearch}
                  onChange={e => setExercisesSearch(e.target.value)}
                  placeholder="Otsing"
                  size="small"
                  className="account-materials-search"
                />
                <div className="account-materials-filters-row">
                  <Button variant="contained" onClick={() => setIsAddExerciseOpen(true)} sx={{ ...DefaultButtonStyle, borderRadius: '6px', whiteSpace: 'nowrap', textTransform: 'uppercase', fontWeight: 700, fontSize: '0.8rem' }}>
                    Lisa uus harjutus
                  </Button>
                  <div className="account-materials-filters">
                    <FormControl size="small" className="account-materials-filter" sx={{ width: 185 }}>
                      <Select
                        value={exercisesHarjutusFilter}
                        onChange={e => setExercisesHarjutusFilter(e.target.value)}
                        displayEmpty
                        renderValue={(v) => (v === 'koik' ? 'Kõik harjutused' : v === 'tehtud' ? 'Tehtud' : 'Alustamata')}
                        className="account-materials-filter-select"
                        MenuProps={{
                          disableScrollLock: true,
                          anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                          transformOrigin: { vertical: 'top', horizontal: 'left' },
                          PaperProps: {
                            style: { width: 185 },
                            sx: {
                              borderRadius: '0 0 5px 5px',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
                              marginTop: '-1px',
                              '& .MuiList-root': { padding: '4px 8px' },
                              '& .MuiMenuItem-root': { borderRadius: '4px' },
                              '& .MuiMenuItem-root:hover': { backgroundColor: 'rgba(255, 208, 253, 0.4) !important' },
                              '& .MuiMenuItem-root.Mui-selected': { backgroundColor: 'transparent !important' },
                              '& .MuiMenuItem-root.Mui-selected:hover': { backgroundColor: 'rgba(255, 208, 253, 0.4) !important' }
                            }
                          }
                        }}
                      >
                        <MenuItem value="koik">Kõik harjutused</MenuItem>
                        <MenuItem value="tehtud">Tehtud</MenuItem>
                        <MenuItem value="alustamata">Alustamata</MenuItem>
                      </Select>
                    </FormControl>
                    {renderMultiSelect('Kategooriad', exercisesKategooriad, setExercisesKategooriad, KATEGOORIAD, 280)}
                    {renderMultiSelect('Keeletase', exercisesKeeletase, setExercisesKeeletase, KEELETASE, 145)}
                  </div>
                </div>
              </div>

              {filteredSavedExercises.length === 0 ? (
                <div className="account-activities-empty">
                  {savedExercises.length === 0
                    ? <>{`Sul ei ole veel harjutusi.`}<br />{`Siin kuvatakse kõik sinu tehtud ja alustatud harjutused.`}</>
                    : 'Valitud filtritele vastavaid harjutusi ei leitud.'}
                </div>
              ) : (
                <div className="account-exercise-saved-grid">
                  {filteredSavedExercises.map(ex => {
                    const st = ex.status || 'alustamata';
                    return (
                      <div key={ex.id} className="exercise-saved-card">
                        <div className="exercise-saved-card-top">
                          <span className="exercise-e-harjutus-badge">E-harjutus</span>
                          <div className="exercise-card-icons">
                            <IconButton size="small" onClick={() => setSavedExercises(prev => prev.filter(m => m.id !== ex.id))} sx={{ color: '#9C27B0', '&:hover': { color: '#7b1fa2' } }}>
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" sx={{ color: '#9C27B0', '&:hover': { color: '#7b1fa2' } }}><ShareIcon fontSize="small" /></IconButton>
                          </div>
                        </div>
                        <h3 className="exercise-saved-card-title">{ex.title}</h3>
                        <p className="exercise-saved-card-desc">{ex.description}</p>
                        <div className="exercise-saved-card-meta">
                          <span className="exercise-saved-card-tags">{ex.tags.join(', ')}</span>
                          <span className="exercise-saved-card-time"><AccessTimeIcon sx={{ fontSize: '1rem', color: '#9C27B0' }} />{ex.time}</span>
                        </div>
                        <div className="exercise-saved-card-footer">
                          <div className="exercise-saved-footer-left">
                            <div className="exercise-status">
                              <span className={`exercise-status-dot ${st}`} />
                              {st === 'tehtud' ? 'Tehtud' : 'Alustamata'}
                            </div>
                            {st === 'tehtud' && ex.score != null && (
                              <span className="exercise-saved-tulemus">
                                Tulemus: <span className="exercise-saved-tulemus-pct">{ex.score}%</span>
                              </span>
                            )}
                          </div>
                          <Button variant="contained" onClick={() => openExercise(ex)} sx={{ ...DefaultButtonStyle, borderRadius: '6px', fontSize: '0.8rem' }}>
                            {st === 'tehtud' ? 'Vaata' : 'Alusta'}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="account-exercises-pagination">
                <button type="button" className="pagination-btn">Eelmine</button>
                <span className="pagination-page">Leht 1/1</span>
                <button type="button" className="pagination-btn">Järgmine</button>
              </div>

              <Modal open={isAddExerciseOpen} onClose={() => setIsAddExerciseOpen(false)}>
                <div className="add-material-modal add-exercise-modal">
                  <div className="add-material-modal-header">
                    <h3>Vali harjutus</h3>
                    <IconButton size="small" onClick={() => setIsAddExerciseOpen(false)}><CloseIcon /></IconButton>
                  </div>
                  <div className="add-material-search-row">
                    <TextField
                      value={modalExSearch}
                      onChange={e => setModalExSearch(e.target.value)}
                      placeholder="Otsing"
                      size="small"
                      className="account-materials-search"
                      sx={{ width: 220 }}
                    />
                    <div className="account-materials-filters">
                      {renderMultiSelect('Kategooriad', modalExKategooriad, setModalExKategooriad, KATEGOORIAD, 280)}
                      {renderMultiSelect('Keeletase', modalExKeeletase, setModalExKeeletase, KEELETASE, 145)}
                    </div>
                  </div>
                  <div className="add-exercise-modal-list">
                    {AVAILABLE_EXERCISES.filter(ex => {
                      const q = modalExSearch.toLowerCase();
                      if (q && !ex.title.toLowerCase().includes(q) && !ex.description.toLowerCase().includes(q) && !ex.url.toLowerCase().includes(q)) return false;
                      if (modalExKategooriad.length && !modalExKategooriad.some(k => ex.tags.includes(k))) return false;
                      if (modalExKeeletase.length && !modalExKeeletase.some(k => ex.tags.includes(k))) return false;
                      return true;
                    }).map(ex => {
                      const alreadySaved = savedExercises.some(m => m.id === ex.id);
                      return (
                        <div key={ex.id} className="exercise-picker-card">
                          <h3 className="exercise-picker-title">{ex.title}</h3>
                          <p className="exercise-picker-desc">{ex.description}</p>
                          <p className="exercise-picker-tags">{ex.tags.join(', ')}</p>
                          <a className="exercise-picker-url" href={ex.url} target="_blank" rel="noreferrer">{ex.url}</a>
                          <div className="exercise-picker-footer">
                            <span className="exercise-card-time"><AccessTimeIcon sx={{ fontSize: '0.95rem' }} />{ex.time}</span>
                            <Button variant="contained" size="small" disabled={alreadySaved}
                              onClick={() => setSavedExercises(prev => [...prev, { ...ex, status: 'alustamata' }])}
                              sx={{ ...DefaultButtonStyle, borderRadius: '6px', fontSize: '0.75rem', opacity: alreadySaved ? 0.5 : 1 }}>
                              {alreadySaved ? 'Salvestatud' : 'Salvesta'}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Modal>
            </div>
          );
        }

        return (
          <div className="account-materials-subpage">
            {materialsSubTab === RouteConstants.ACCOUNT_MATERIALS_STUDY && (
              <div className="account-materials-search-area">
                <TextField
                  value={materialsSearch}
                  onChange={e => setMaterialsSearch(e.target.value)}
                  placeholder="Otsing"
                  size="small"
                  className="account-materials-search"
                />
                <div className="account-materials-filters-row">
                  <Button variant="contained" onClick={() => setIsAddMaterialOpen(true)} sx={{ ...DefaultButtonStyle, borderRadius: '6px', whiteSpace: 'nowrap', textTransform: 'uppercase', fontWeight: 700, fontSize: '0.8rem' }}>
                    Lisa uus õppematerjal
                  </Button>
                  <div className="account-materials-filters">
                    {renderMultiSelect('Kategooriad', selectedKategooriad, setSelectedKategooriad, KATEGOORIAD, 280)}
                    {renderMultiSelect('Keeletase', selectedKeeletase, setSelectedKeeletase, KEELETASE, 145)}
                    {renderMultiSelect('Tüüp', selectedTuup, setSelectedTuup, TUUP, 130)}
                  </div>
                </div>
              </div>
            )}
            {(() => {
              const filteredMaterials = savedMaterials.filter(mat => {
                if (materialsSearch && !mat.title.toLowerCase().includes(materialsSearch.toLowerCase()) && !mat.description.toLowerCase().includes(materialsSearch.toLowerCase())) return false;
                if (selectedKategooriad.length && !selectedKategooriad.some(k => mat.tags.includes(k))) return false;
                if (selectedKeeletase.length && !selectedKeeletase.some(k => mat.tags.includes(k))) return false;
                if (!matchesTypeFilter(selectedTuup, mat.type)) return false;
                return true;
              });
              return filteredMaterials.length === 0 ? (
              <div className="account-activities-empty">
                {savedMaterials.length === 0
                  ? <>{`Sul ei ole veel õppematerjale.`}<br />{`Siin kuvatakse kõik sinu salvestatud materjalid.`}</>
                  : 'Valitud filtritele vastavaid materjale ei leitud.'}
              </div>
            ) : (
              <div className="account-mat-cards-grid">
                {filteredMaterials.map(mat => {
                  const cfg = MAT_TYPE_CONFIG[mat.type] || MAT_TYPE_CONFIG.TEKST;
                  return (
                  <div key={mat.id} className="account-mat-card">
                    <div className="mat-card-top">
                      <div className="mat-card-badges">
                        <span className="mat-badge-oppematerjal" style={{ background: cfg.bg, color: cfg.color }}>
                          Õppematerjal
                        </span>
                        <span className={`mat-type-badge mat-type-${mat.type.toLowerCase()}`}>{mat.type}</span>
                      </div>
                      <div className="mat-card-actions">
                        <IconButton size="small" onClick={() => setSavedMaterials(prev => prev.filter(m => m.id !== mat.id))} sx={{ color: '#aaa', '&:hover': { color: '#9C27B0' } }}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: '#aaa', '&:hover': { color: '#9C27B0' } }}>
                          <ShareIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </div>
                    <p className="mat-card-title">{mat.title}</p>
                    <p className="mat-card-desc">{mat.description}</p>
                    <div className="mat-card-tags">{mat.tags.map((tag, i) => <span key={i} className="mat-card-tag">{tag}</span>)}</div>
                    <div className="mat-card-footer">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          prependAccountActivity({
                            type: 'oppematerjal',
                            label: mat.title,
                            result: '',
                            status: 'vaadatud',
                            openPath: pathAccountMaterialsStudy,
                          });
                          setViewMaterial(mat);
                        }}
                        sx={{ ...DefaultButtonStyle, borderRadius: '6px', fontSize: '0.8rem' }}
                      >
                        Ava
                      </Button>
                    </div>
                  </div>
                  );
                })}
              </div>
            );})()}

            {materialsSubTab === RouteConstants.ACCOUNT_MATERIALS_STUDY && (
              <div className="account-exercises-pagination">
                <button type="button" className="pagination-btn">Eelmine</button>
                <span className="pagination-page">Leht 1/1</span>
                <button type="button" className="pagination-btn">Järgmine</button>
              </div>
            )}

            <Modal open={!!viewMaterial} onClose={() => setViewMaterial(null)}>
              <div className="add-material-modal" style={{ maxWidth: viewMaterial?.type === 'VIDEO' ? 980 : 560 }}>
                <div className="add-material-modal-header">
                  <h3>{viewMaterial?.title}</h3>
                  <IconButton size="small" onClick={() => setViewMaterial(null)}><CloseIcon /></IconButton>
                </div>
                <div className="view-mat-tags">
                  {viewMaterial?.tags?.map((tag, i) => (
                    <span key={i} className="view-mat-tag">{tag}{i < viewMaterial.tags.length - 1 ? ',' : ''}</span>
                  ))}
                </div>
                <div className="view-mat-body">
                  {viewMaterial?.type === 'FAIL' && (
                    <div className="view-mat-file-row">
                      <span className="view-mat-filename">Fail: {viewMaterial.displayName || viewMaterial.filename}</span>
                      <a href={`/${viewMaterial.filename}`} download={viewMaterial.filename}>
                        <Button variant="contained" size="small" startIcon={<span style={{ fontSize: '1rem' }}>⬇</span>}
                          sx={{ ...DefaultButtonStyle, borderRadius: '6px', textTransform: 'uppercase', fontWeight: 700 }}>
                          Lae alla
                        </Button>
                      </a>
                    </div>
                  )}
                  {viewMaterial?.type === 'TEKST' && (
                    <div className="view-text-content">{viewMaterial.content}</div>
                  )}
                  {viewMaterial?.type === 'VIDEO' && (() => {
                    const embedUrl = getMaterialEmbedUrl(viewMaterial?.url);
                    if (embedUrl) {
                      return (
                        <iframe
                          title={viewMaterial?.title || 'Õppematerjal'}
                          src={embedUrl}
                          className="view-mat-iframe"
                          allowFullScreen
                        />
                      );
                    }
                    return (
                      <div className="view-mat-file-row">
                        <a href={viewMaterial.url} target="_blank" rel="noreferrer" className="view-mat-link">
                          {viewMaterial.url}
                        </a>
                        <a href={viewMaterial.url} target="_blank" rel="noreferrer">
                          <Button variant="contained" size="small"
                            sx={{ ...DefaultButtonStyle, borderRadius: '6px', textTransform: 'uppercase', fontWeight: 700, flexShrink: 0 }}>
                            Ava
                          </Button>
                        </a>
                      </div>
                    );
                  })()}
                  {viewMaterial?.type === 'LINK' && (
                    <div className="view-mat-file-row">
                      <a href={viewMaterial.url} target="_blank" rel="noreferrer" className="view-mat-link">
                        {viewMaterial.url}
                      </a>
                      <a href={viewMaterial.url} target="_blank" rel="noreferrer">
                        <Button variant="contained" size="small"
                          sx={{ ...DefaultButtonStyle, borderRadius: '6px', textTransform: 'uppercase', fontWeight: 700, flexShrink: 0 }}>
                          Ava
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </Modal>

            <Modal open={isAddMaterialOpen} onClose={() => setIsAddMaterialOpen(false)}>
              <div className="add-material-modal">
                <div className="add-material-modal-header">
                  <h3>Vali õppematerjal</h3>
                  <IconButton size="small" onClick={() => setIsAddMaterialOpen(false)}><CloseIcon /></IconButton>
                </div>
                <div className="add-material-search-row">
                  <TextField
                    value={modalMatSearch}
                    onChange={e => setModalMatSearch(e.target.value)}
                    placeholder="Otsing"
                    size="small"
                    className="account-materials-search"
                    sx={{ flex: 1 }}
                  />
                  <div className="account-materials-filters">
                    {renderMultiSelect('Kategooriad', modalMatKategooriad, setModalMatKategooriad, KATEGOORIAD, 280)}
                    {renderMultiSelect('Keeletase', modalMatKeeletase, setModalMatKeeletase, KEELETASE, 145)}
                    {renderMultiSelect('Tüüp', modalMatTuup, setModalMatTuup, TUUP, 120)}
                  </div>
                </div>
                <div className="add-material-cards-grid">
                  {AVAILABLE_MATERIALS.filter(mat => {
                    const q = modalMatSearch.toLowerCase();
                    if (q && !mat.title.toLowerCase().includes(q) && !mat.description.toLowerCase().includes(q)) return false;
                    if (modalMatKategooriad.length && !modalMatKategooriad.some(k => mat.tags.includes(k))) return false;
                    if (modalMatKeeletase.length && !modalMatKeeletase.some(k => mat.tags.includes(k))) return false;
                    if (!matchesTypeFilter(modalMatTuup, mat.type)) return false;
                    return true;
                  }).map(mat => {
                    const alreadySaved = savedMaterials.some(m => m.id === mat.id);
                    return (
                      <div key={mat.id} className="avail-mat-card">
                        <div className="mat-card-top">
                          <span className="mat-card-title">{mat.title}</span>
                          <span className={`mat-type-badge mat-type-${mat.type.toLowerCase()}`}>{mat.type}</span>
                        </div>
                        <p className="mat-card-desc">{mat.description}</p>
                        <div className="mat-card-tags">{mat.tags.map((tag, i) => <span key={i} className="mat-card-tag">{tag}</span>)}</div>
                        <div className="mat-card-footer">
                          <Button variant="contained" size="small" disabled={alreadySaved}
                            onClick={() => { setSavedMaterials(prev => [...prev, mat]); }}
                            sx={{ ...DefaultButtonStyle, borderRadius: '6px', fontSize: '0.75rem', opacity: alreadySaved ? 0.5 : 1 }}>
                            {alreadySaved ? 'Salvestatud' : 'Salvesta'}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Modal>
          </div>
        );
    }

      if (topTab === RouteConstants.ACCOUNT_TEXTS) {
        const filteredTexts = myTexts.filter(tx => {
          if (textsSearch && !tx.title.toLowerCase().includes(textsSearch.toLowerCase())) return false;
          return true;
        });

        return (
          <div className="account-texts-page">
            <TextField
              value={textsSearch}
              onChange={e => setTextsSearch(e.target.value)}
              placeholder="Otsing"
              size="small"
              className="account-materials-search"
            />
            <div className="account-texts-actions">
              <Button
                variant="contained"
                startIcon={<CreateIcon />}
                onClick={() => setIsAddTextOpen(true)}
                sx={{ ...DefaultButtonStyle, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                Lisa uus tekst
              </Button>
              <FormControl size="small" className="account-materials-filter" sx={{ width: 210 }}>
                <Select
                  value={textsFilter}
                  onChange={e => setTextsFilter(e.target.value)}
                  displayEmpty
                  renderValue={() => textsFilter === 'koik' ? 'Kõik tekstid' : textsFilter === 'analyysimata' ? 'Analüüsimata tekstid' : 'Analüüsitud tekstid'}
                  className="account-materials-filter-select"
                  MenuProps={{
                    disableScrollLock: true,
                    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                    transformOrigin: { vertical: 'top', horizontal: 'left' },
                    PaperProps: {
                      style: { width: 210 },
                      sx: {
                        borderRadius: '0 0 5px 5px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
                        marginTop: '-1px',
                        '& .MuiMenuItem-root:hover': { backgroundColor: 'rgba(255, 208, 253, 0.4) !important' },
                        '& .MuiMenuItem-root.Mui-selected': { backgroundColor: 'transparent !important' },
                        '& .MuiMenuItem-root.Mui-selected:hover': { backgroundColor: 'rgba(255, 208, 253, 0.4) !important' }
                      }
                    }
                  }}
                >
                  <MenuItem value="koik">Kõik tekstid</MenuItem>
                  <MenuItem value="analyysimata">Analüüsimata tekstid</MenuItem>
                  <MenuItem value="analyysitud">Analüüsitud tekstid</MenuItem>
                </Select>
              </FormControl>
            </div>

            {filteredTexts.length === 0 ? (
              <div className="account-activities-empty">
                Sul ei ole veel tekste.<br />Lisa tekst ja siin kuvatakse kõik sinu tekstid.
              </div>
            ) : (
              <div className="account-text-cards-grid">
                {filteredTexts.map(tx => (
                  <div key={tx.id} className="account-text-card">
                    <div className="text-card-top">
                      <h4 className="text-card-title">{tx.title}</h4>
                      <div className="text-card-icons">
                        <IconButton size="small" onClick={() => deleteText(tx.id)}><DeleteOutlineIcon fontSize="small" /></IconButton>
                        <IconButton size="small"><ShareIcon fontSize="small" /></IconButton>
                      </div>
                    </div>
                    <div className="text-card-info">
                      <span>Pikkus: {tx.wordCount} sõna</span>
                      <span>Loodud: {tx.createdAt}</span>
                      <span>Olen teksti autor: {tx.isAuthor ? 'jah' : 'ei'}</span>
                    </div>
                    <div className="text-card-footer">
                      <Button variant="contained" sx={{ ...DefaultButtonStyle, fontSize: '0.75rem', padding: '3px 10px', minWidth: 0, lineHeight: '22px', borderRadius: '6px' }}>
                        Analüüsi tekst
                      </Button>
                      <Button variant="contained" onClick={() => openEdit(tx)} sx={{ ...DefaultButtonStyle, fontSize: '0.75rem', padding: '3px 10px', minWidth: 0, lineHeight: '22px', borderRadius: '6px' }}>
                        Muuda
                      </Button>
                      <Button variant="contained" onClick={() => setViewText(tx)} sx={{ ...DefaultButtonStyle, fontSize: '0.75rem', padding: '3px 10px', minWidth: 0, lineHeight: '22px', borderRadius: '6px' }}>
                        Ava
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="account-exercises-pagination">
              <button className="pagination-btn">Eelmine</button>
              <span className="pagination-page">Leht 1/1</span>
              <button className="pagination-btn">Järgmine</button>
            </div>

            <Modal open={!!viewText} onClose={() => setViewText(null)}>
              <div className="add-text-modal">
                <div className="add-text-modal-header">
                  <h3>{viewText?.title}</h3>
                  <IconButton size="small" onClick={() => setViewText(null)}><CloseIcon /></IconButton>
                </div>
                <div className="view-text-meta">
                  <span>Pikkus: {viewText?.wordCount} sõna</span>
                  <span>Loodud: {viewText?.createdAt}</span>
                  <span>Olen teksti autor: {viewText?.isAuthor ? 'jah' : 'ei'}</span>
                </div>
                <div className="view-text-content">{viewText?.content}</div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="outlined" onClick={() => setViewText(null)}
                    sx={{ borderColor: '#bdbdbd', color: '#333', borderRadius: '6px', '&:hover': { borderColor: '#9C27B0', color: '#9C27B0' } }}>
                    Sulge
                  </Button>
                </div>
              </div>
            </Modal>

            <Modal open={isAddTextOpen} onClose={() => { setIsAddTextOpen(false); setEditingTextId(null); setTextForm({ title: '', content: '', isAuthor: false }); }}>
              <div className="add-text-modal">
                <div className="add-text-modal-header">
                  <h3>{editingTextId !== null ? 'Teksti muutmine' : 'Teksti loomine'}</h3>
                  <IconButton size="small" onClick={() => { setIsAddTextOpen(false); setEditingTextId(null); setTextForm({ title: '', content: '', isAuthor: false }); }}><CloseIcon /></IconButton>
                </div>
                <div className="add-text-modal-body">
                  <TextField
                    value={textForm.title}
                    onChange={e => setTextForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Pealkiri*"
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    value={textForm.content}
                    onChange={e => setTextForm(f => ({ ...f, content: e.target.value }))}
                    placeholder="Tekst*"
                    multiline
                    rows={9}
                    fullWidth
                    variant="outlined"
                  />
                </div>
                <div className="add-text-modal-footer">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={textForm.isAuthor}
                        onChange={e => setTextForm(f => ({ ...f, isAuthor: e.target.checked }))}
                        sx={{ color: '#9e9e9e', '&.Mui-checked': { color: '#9C27B0' } }}
                      />
                    }
                    label="Olen teksti autor"
                    sx={{ marginRight: 'auto' }}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => { setIsAddTextOpen(false); setEditingTextId(null); setTextForm({ title: '', content: '', isAuthor: false }); }}
                    sx={{ borderColor: '#bdbdbd', color: '#333', borderRadius: '6px', textTransform: 'uppercase', '&:hover': { borderColor: '#9C27B0', color: '#9C27B0' } }}
                  >
                    Tühista
                  </Button>
                  <Button
                    variant="contained"
                    onClick={saveText}
                    disabled={!textForm.title.trim() || !textForm.content.trim()}
                    sx={{ ...DefaultButtonStyle, borderRadius: '6px', textTransform: 'uppercase' }}
                  >
                    Lisa
                  </Button>
                </div>
              </div>
            </Modal>
          </div>
        );
      }

      if (topTab === RouteConstants.ACCOUNT_DATA) {
        return (
          <div className="account-data-page">
            <div className="account-data-top-row">
              <p><span className="account-data-key">Roll:</span> õppija / keelehuviline</p>
              <p><span className="account-data-key">Liige alates:</span> 07.05.2024</p>
            </div>

            <div className="account-data-grid">
              <div className="account-data-field">
                <span>Kasutajanimi</span>
                <TextField
                  value={kasutajanimi}
                  size="small"
                  onChange={(e) => setKasutajanimi(e.target.value)}
                />
              </div>
              <div className="account-data-field">
                <span>Elukohariik</span>
                <FormControl size="small">
                  <Select defaultValue="" displayEmpty>
                    {Object.keys(countryOptionsForAddingText).map(key => (
                      <MenuItem key={key} value={key}>{t(countryOptionsForAddingText[key])}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="account-data-field">
                <span>E-post</span>
                <TextField
                  value={epost}
                  size="small"
                  onChange={(e) => setEpost(e.target.value)}
                />
              </div>
              <div className="account-data-field">
                <span>Emakeel</span>
                <TextField
                  value="eesti keel"
                  size="small"
                  slotProps={{ input: { readOnly: true } }}
                />
              </div>

              <div className="account-data-field">
                <span>Vanus</span>
                <FormControl size="small">
                  <Select defaultValue="" displayEmpty>
                    {Object.keys(ageOptions).map(key => (
                      <MenuItem key={key} value={key}>{t(ageOptions[key])}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="account-data-field">
                <span>Eesti keele tase</span>
                <FormControl size="small">
                  <Select defaultValue="" displayEmpty>
                    {textLevelOptions.map(level => (
                      <MenuItem key={level} value={level}>{level}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="account-data-field">
                <span>Sugu</span>
                <FormControl size="small">
                  <Select defaultValue="" displayEmpty>
                    {Object.keys(genderOptions).map(key => (
                      <MenuItem key={key} value={key}>{t(genderOptions[key])}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="account-data-field">
                <span>Muud õppe-,töö-või suhtluskeeled</span>
                <TextField
                  defaultValue=""
                  size="small"
                />
              </div>
            </div>

            <div className="account-data-bottom">
            <Button
              variant="contained"
              sx={{ ...DefaultButtonStyle }}
            >
              Salvesta muudatused
            </Button>

            <FormControlLabel
              className="account-data-checkbox"
              control={
                <Checkbox
                  sx={{
                    color: '#9C27B0',
                    borderRadius: '4px',
                    '&.Mui-checked': {
                      color: '#9C27B0'
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: '1.3rem'
                    }
                  }}
                />
              }
              label="Soovin saada ELLE keskkonnalt e-kirja teavitusi"
            />
            </div>
          </div>
        );
      }

      return (
        <div className="account-main-grid">
          <section className="account-card-box empty">
            <h3 className="account-box-title">{TABS.find(t => t.id === topTab)?.label}</h3>
          </section>
        </div>
      );
    }

    return (
      <>
        <p className="account-greeting">Tere, Katrin!</p>

        <div className="account-main-grid">
          <section className="account-card-box">
            <h3 className="account-box-title">Minu keskmine harjutuse tulemus</h3>
            <div className="account-circle-wrapper">
              <div
                className={`account-donut${overviewStats.avgPct == null ? ' account-donut--empty' : ''}`}
                style={overviewStats.avgPct != null ? { '--donut-pct': `${overviewStats.avgPct}%` } : undefined}
              >
                <div className="account-donut-inner">
                  <span className="account-circle-value">
                    {overviewStats.avgPct != null ? `${overviewStats.avgPct}%` : '—'}
                  </span>
                </div>
              </div>
            </div>
            <div className="account-stats">
              <div>
                Lahendatud harjutusi:{' '}
                <span className="link-like">{overviewStats.solved}</span>
              </div>
              <div>
                Tekste üles laetud:{' '}
                <span className="link-like">{overviewStats.textsCount}</span>
              </div>
              <div>
                Minu analüüsitud tekste:{' '}
                <span className="link-like">{overviewStats.analyzedTexts}</span>
              </div>
              <div>
                Salvestatud õppematerjalid:{' '}
                <span className="link-like">{overviewStats.savedMaterialsCount}</span>
              </div>
            </div>
          </section>

          <section className="account-card-box">
            <h3 className="account-box-title">Minu viimased tegevused</h3>
            {overviewRecentActivities.length === 0 ? (
              <ul className="account-activities">
                <li>
                  <div>
                    Sul ei ole veel tegevusi <span className="percent-link" />
                  </div>
                </li>
                <li>
                  <div>Alusta õppimist, et siin kuvatakse sinu viimased tulemused</div>
                </li>
              </ul>
            ) : (
              <ul className="account-activities account-activities-overview">
                {overviewRecentActivities.map((row) => {
                  const { main, extra, date } = overviewActivityCopy(row);
                  return (
                    <li key={row.id}>
                      <div className="account-overview-activity-main">
                        <LibraryBooksIcon className="account-overview-activity-icon" fontSize="small" />
                        <div>
                          <div>{main}</div>
                          {extra ? <div className="percent-link">{extra}</div> : null}
                        </div>
                      </div>
                      <span className="account-activity-date">{date}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <div className="account-week-info">
          <span className="star">★</span>
          {weekActionCount === 0 ? (
            <>
              Siin kuvatakse sinu külastuste statistika
              <br />
              Alusta õppimist, et näha oma aktiivsust
            </>
          ) : (
            <>
              Tubli! Oled sel nädalal keskkonda külastanud {weekActionCount} korda.
            </>
          )}
        </div>
        <div className="account-progress-bar account-progress-bar-wide">
          <div
            className="account-progress-bar-fill"
            style={{ width: `${weekProgressPct}%` }}
          />
        </div>
      </>
    );
  };

  return (
    <div className="account-page-container">
      <div className="account-card-wrapper">
        <div className="account-card">
          <h2 className="account-title">
            {pageTitle}
            {topTab === RouteConstants.ACCOUNT_DATA && (
              <IconButton
                className="account-title-info"
                onClick={() => setIsDataInfoOpen(true)}
                disableRipple
                sx={{ '&:focus': { outline: 'none' } }}
              >
                <InfoIcon />
              </IconButton>
            )}
          </h2>

          <div className="layout">
            <aside className="sidebar">
              <ul>
                {TABS.map((tab) => (
                  <Fragment key={tab.id}>
                    <li className={tab.id === topTab ? 'active' : ''}>
                      <NavLink
                        to={
                          tab.id === RouteConstants.ACCOUNT_MATERIALS
                            ? `/${RouteConstants.ACCOUNT}/${RouteConstants.ACCOUNT_MATERIALS}/${RouteConstants.ACCOUNT_MATERIALS_STUDY}`
                            : `/${RouteConstants.ACCOUNT}/${tab.id}`
                        }
                      >
                        {tab.label}
                      </NavLink>
                    </li>

                    {tab.id === RouteConstants.ACCOUNT_MATERIALS && topTab === RouteConstants.ACCOUNT_MATERIALS && (
                      <ul className="account-submenu">
                        <li className={materialsSubTab === RouteConstants.ACCOUNT_MATERIALS_STUDY ? 'active' : ''}>
                          <NavLink
                            to={`/${RouteConstants.ACCOUNT}/${RouteConstants.ACCOUNT_MATERIALS}/${RouteConstants.ACCOUNT_MATERIALS_STUDY}`}
                          >
                            Õppematerjalid
                          </NavLink>
                        </li>
                        <li className={materialsSubTab === RouteConstants.ACCOUNT_MATERIALS_EXERCISES ? 'active' : ''}>
                          <NavLink
                            to={`/${RouteConstants.ACCOUNT}/${RouteConstants.ACCOUNT_MATERIALS}/${RouteConstants.ACCOUNT_MATERIALS_EXERCISES}`}
                          >
                            Harjutused
                          </NavLink>
                        </li>
                      </ul>
                    )}
                  </Fragment>
                ))}
              </ul>
            </aside>

            <div className="divider" />

            <main className="content">
              {renderContent()}
              <Outlet />
            </main>
          </div>
        </div>
      </div>

      <Modal open={!!embedExercise} onClose={closeExerciseEmbed}>
        <div className="exercise-embed-modal">
          <div className="exercise-embed-modal-header">
            <h3>{embedExercise?.title}</h3>
            <IconButton size="small" onClick={closeExerciseEmbed} aria-label="Sulge"><CloseIcon /></IconButton>
          </div>
          {embedExercise?.noIframe ? (
            <div className="exercise-embed-fallback">
              <p className="exercise-embed-fallback-text">
                Sisuloome (e-koolikott) ei luba seda lehte ELLE aknasse manustada — brauser blokeerib iframe’i turvalisuse tõttu.
                Harjutus avaneb uues vahekaardis.
              </p>
              <Button
                variant="contained"
                onClick={() => window.open(embedExercise.tabUrl, '_blank', 'noopener,noreferrer')}
                sx={{ ...DefaultButtonStyle, borderRadius: '8px', py: 1.2 }}
              >
                Ava harjutus uues vahekaardis
              </Button>
            </div>
          ) : (
            <iframe
              title={embedExercise?.title || 'Harjutus'}
              src={embedExercise?.embedUrl || ''}
              className="exercise-embed-iframe"
              allowFullScreen
            />
          )}
          <div className="exercise-embed-modal-footer">
            {embedExerciseScore != null && (
              <div className="exercise-embed-score">
                Tulemus: {embedExerciseScore}%
              </div>
            )}
            <div className="exercise-embed-actions">
              <Button variant="outlined" onClick={closeExerciseEmbed} sx={{ borderColor: '#bdbdbd', color: '#333', borderRadius: '6px' }}>
                Sulge
              </Button>
              <Button variant="contained" onClick={markEmbeddedExerciseTehtud} sx={{ ...DefaultButtonStyle, borderRadius: '6px' }}>
                Märgi tehtuks (salvesta olek)
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={isDataInfoOpen} onClose={() => setIsDataInfoOpen(false)}>
        <div className="account-data-modal">
          <button
            type="button"
            className="account-data-modal-close"
            onClick={() => setIsDataInfoOpen(false)}
            aria-label="Sulge"
          >
            <CloseIcon fontSize="small" />
          </button>
          <p>
            Sisestatud andmed ei ole teistele kasutajatele avalikud.
            ELLE kasutab neid ainult üldistatud statistika jaoks, et mõista paremini kasutajate profiile ja
            pakkuda sobivamaid teenuseid.
          </p>
          <p>
            Vanus, sugu, elukohariik, emakeel ja muud keeled lisatakse automaatselt teksti loovutamise
            vormile, kui kasutaja on sisse loginud.
            See aitab vältida samade andmete korduvat sisestamist.
          </p>
        </div>
      </Modal>
    </div>
  );
}

