import { Paragraph, ShadingType, TextRun, UnderlineType } from 'docx';
import { BODY_SIZE, DARK_GRAY, FONT, HEADING_SIZE, LABEL_SIZE, STRIKE_GRAY, SUBLABEL_SIZE } from './docxConstants';
import { fmt2, hexColor, sectionHeading, statTable, thinDivider } from './docxHelpers';
import { errorTypes, textLevels } from '../../../correction/const/TabValuesConstant';
import { errorMap } from '../../constants/maps';

const TEXT_LEVEL_DIMENSIONS = [
  { label: 'corrector_proficiency_level_evaluation_text_complexity', key: 'complexity' },
  { label: 'corrector_proficiency_level_evaluation_grammar', key: 'grammatical' },
  { label: 'corrector_proficiency_level_evaluation_vocabulary', key: 'lexical' }
];

export const buildCorrectorHeader = (subTab, errorResponse, t) => {
  const errorList = errorResponse[errorMap[subTab]];
  if (!errorList) return [];

  const result = Object.entries(errorList).flatMap(([type, errors]) => {
    if (!errors || errors.length === 0) return [];
    const errorType = errorTypes[type];
    const color = hexColor(errorType?.color || '#EEEEEE');

    return [
      new Paragraph({
        spacing: { before: 120, after: 60 },
        children: [
          new TextRun({ text: '  ', size: LABEL_SIZE, shading: { type: ShadingType.SOLID, color, fill: color } }),
          new TextRun({ text: '  ', size: LABEL_SIZE }),
          new TextRun({ text: t(errorType?.label ?? ''), font: FONT, size: SUBLABEL_SIZE, bold: true, underline: { type: UnderlineType.SINGLE, color } }),
          new TextRun({ text: `  (${errors.length})`, font: FONT, size: LABEL_SIZE, color: DARK_GRAY })
        ]
      }),
      ...errors.map((err) =>
        new Paragraph({
          indent: { left: 360 },
          spacing: { after: 40 },
          children: [
            new TextRun({ text: err.text, font: FONT, size: BODY_SIZE, color: STRIKE_GRAY, strike: true }),
            new TextRun({ text: '  →  ', font: FONT, size: BODY_SIZE, bold: true, color: DARK_GRAY }),
            new TextRun({ text: err.corrected_text ?? '', font: FONT, size: BODY_SIZE, bold: true })
          ]
        })
      )
    ];
  });

  return result.length > 0 ? [...result, thinDivider()] : [];
};

export const buildTextLevelHeader = (errorResponse, t) => {
  const keeletase = errorResponse?.keeletase;
  if (!keeletase) return [];

  const pct = (p) => `${(p.value * 100).toFixed(0)}%`;

  const overallRuns = [
    new TextRun({ text: `${t('corrector_proficiency_level_overall_score')}:  `, font: FONT, size: HEADING_SIZE, bold: true }),
    ...(keeletase.mixed?.probabilities?.map((p) =>
      new TextRun({ text: ` ${t(textLevels[p.index])} ${pct(p)} `, font: FONT, size: SUBLABEL_SIZE, bold: true })
    ) ?? [])
  ];

  const tableRows = TEXT_LEVEL_DIMENSIONS
    .map(({ label, key }) => {
      const data = keeletase[key];
      if (!data?.probabilities) return null;
      const value = data.probabilities.map((p) => `${t(textLevels[p.index])} ${pct(p)}`).join('  /  ');
      return [t(label), value];
    })
    .filter(Boolean);

  const result = [new Paragraph({ spacing: { after: 120 }, children: overallRuns })];
  if (tableRows.length > 0) result.push(statTable(tableRows));
  result.push(thinDivider());
  return result;
};

export const buildComplexityHeader = (errorResponse, t) => {
  const k = errorResponse?.keerukus;
  const kl = errorResponse?.korrektoriLoendid;
  const sonad = errorResponse?.sonad;
  if (!k) return [];

  const [numPhrases, numWords, polysyllabic, numSyllables, longWords, smog, fleschKincaid, lix, , , , complexityLevelRaw] = k;

  const complexityLabel = String(complexityLevelRaw ?? '')
    .split('/')
    .map((s) => t(s.trim()))
    .join(' / ');

  return [
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({ text: `${t('corrector_complexity_level')}: `, font: FONT, size: HEADING_SIZE, bold: true }),
        new TextRun({ text: complexityLabel, font: FONT, size: HEADING_SIZE })
      ]
    }),
    sectionHeading(t('common_statistics')),
    statTable([
      [t('corrector_complexity_statistics_phrases'), numPhrases],
      [t('corrector_complexity_statistics_words'), sonad?.length ?? numWords],
      [t('corrector_complexity_statistics_syllables'), numSyllables],
      [t('corrector_complexity_statistics_polysyllabic_words'), polysyllabic],
      [t('corrector_complexity_statistics_long_words'), longWords],
      [t('corrector_complexity_statistics_nouns'), kl?.nimisonad]
    ]),
    sectionHeading(t('common_indexes')),
    statTable([
      [t('corrector_smog_index'), smog],
      [t('corrector_flesch_kincaid_grade_level'), fleschKincaid],
      [t('corrector_lix_index'), lix],
      [t('corrector_noun_to_verb_ratio'), fmt2(kl?.nimitegusuhe)]
    ]),
    thinDivider()
  ];
};

export const buildVocabularyHeader = (errorResponse, t) => {
  const m = errorResponse?.mitmekesisus;
  const kl = errorResponse?.korrektoriLoendid;
  const sonad = errorResponse?.sonad;
  if (!m) return [];

  const hasAbstract = errorResponse?.abstraktsus;

  const statsRows = [
    [t('corrector_vocabulary_statistics_the_words_considered'), sonad?.length],
    [t('corrector_vocabulary_statistics_different_words'), m[11]],
    [t('corrector_vocabulary_statistics_low_frequency_words'), kl?.harvaesinevad],
    [t('corrector_vocabulary_statistics_content_words'), kl?.sisusonad],
    ...(hasAbstract && kl?.abstraktsed != null ? [[t('corrector_vocabulary_statistics_abstract_nouns'), kl.abstraktsed]] : [])
  ];

  const indexRows = [
    [t('corrector_vocabulary_indexes_root_type_token_ratio'), fmt2(m[1])],
    ...(m[4] > -1 ? [[t('corrector_vocabulary_mtld_index'), fmt2(m[4])]] : []),
    ...(m[5] > 0 ? [[t('corrector_vocabulary_hdd_index'), fmt2(m[5])]] : []),
    ...(hasAbstract && kl?.abskeskmine != null ? [[t('corrector_vocabulary_noun_abstractness'), fmt2(kl.abskeskmine)]] : [])
  ];

  return [
    sectionHeading(t('common_statistics')),
    statTable(statsRows),
    sectionHeading(t('common_indexes')),
    statTable(indexRows),
    thinDivider()
  ];
};
