# Original code created by Kais Allkivi

import math
import pandas as pd
from joblib import load
from text_abstraction_analyse import Utils
from text_level_model.linguistic_functions import pos_count, pos_ratio, pos_ttr, feats_table, feat_ratio, count_cases, \
    curl_request, mtld_calc

utils = Utils()

model_types = {
    'lexical': {
        "model": 'lex_model.joblib',
        "scaler": 'lex_scaler.joblib',
        "feats": ['lemma_count', 'RTTR', 'CVV', 'MTLD', 'S_abstr']},
    'grammatical': {
        "model": 'gram_model.joblib',
        "scaler": 'gram_scaler.joblib',
        "feats": ['n_cases', 'Nom', 'Tra', 'Plur', 'S_cases',
                  'S_Nom', 'S_Tra', 'S_Plur', 'A_cases', 'A_Gen',
                  'A_Tra', 'A_Sing', 'A_Plur', 'P_cases', 'P_Ela',
                  'P_Prs', 'P_Dem', 'P_IntRel', 'V_Fin', 'V_Sing',
                  'V_Neg', 'K_Post', 'D', 'J', 'S_Prop']},
    'complexity': {
        "model": 'complex_model.joblib',
        "scaler": 'complex_scaler.joblib',
        "feats": ['word_count', 'word_len', 'syllables']},
    'error': {
        "model": 'error_model.joblib',
        "scaler": 'error_scaler.joblib',
        "feats": ['errors_per_word', 'errors_per_sentence']},
    'mixed': {
        "model": 'mixed_model.joblib',
        "scaler": 'mixed_scaler.joblib',
        "feats": ['n_cases', 'Tra', 'Plur', 'S_cases', 'S_Plur',
                  'A_cases', 'P_cases', 'P_Prs', 'P_Dem', 'P_IntRel',
                  'V_Fin', 'lemma_count', 'RTTR', 'CVV', 'S_abstr',
                  'MTLD', 'word_count', 'sent_count', 'word_len',
                  'sent_len', 'SMOG', 'syllables', 'errors_per_word']}
}


# Morphological tagging of input text
def linguistic_analysis(model_type, feat_values):
    # Creating a dataframe based on the tagged output

    model = load(model_types[model_type]["model"])
    scaler = load(model_types[model_type]["scaler"])
    features = model_types[model_type]["feats"]

    X = pd.DataFrame([feat_values])[features].fillna(0)
    X_scaled = scaler.transform(X)
    predicted_level = model.predict(X_scaled)[0]
    predicted_probabilities = model.predict_proba(X_scaled)[0].tolist()

    filtered = [(i, val) for i, val in enumerate(predicted_probabilities) if val > 0.01]
    rounded = [(i, round(val, 2)) for i, val in filtered]
    total = sum(val for i, val in rounded)
    normalized = [(i, round(val / total, 2)) for i, val in rounded]
    sorted_normalized = sorted(normalized, key=lambda x: x[1], reverse=True)
    result = [{'index': i, 'value': val} for i, val in sorted_normalized]

    return {"level": predicted_level, "probabilities": result}

    # TODO: arvutada veatunnused - paranduste arv sõnade ja lausete arvu suhtes


def extract_features(errors_per_sentence, errors_per_word, data, polysyllabic_words):
    df = pd.DataFrame(data, columns=['Index', 'Word', 'Lemma', 'Upos', 'Xpos', 'Feats'])

    # Creating a dictionary to store predictive feature values
    feats = ['word_count', 'sent_count', 'word_len', 'sent_len', 'SMOG', 'lemma_count', 'RTTR', 'CVV', 'MTLD',
             'S_abstr', 'n_cases', 'Nom', 'Tra', 'Plur', 'S_cases', 'S_Nom', 'S_Tra', 'S_Plur', 'A_cases', 'A_Gen',
             'A_Tra', 'A_Sing', 'A_Plur', 'P_cases', 'P_Ela', 'P_Prs', 'P_Dem', 'P_IntRel', 'V_Fin', 'V_Sing',
             'V_Neg', 'D', 'J', 'S_Prop', 'K_Post']

    # TODO: Loendis peaks olema ka 'errors_per_word' ja 'errors_per_sentence', mida ma siin praegu ei arvuta

    feat_values = {}
    for feat in feats:
        feat_values[feat] = None

    # Calculating complexity features
    feat_values['sent_count'] = df[df.Index == 1].Index.count()
    df = df[df.Xpos != 'Z']
    feat_values['word_count'] = df.Word.count()
    df['WordLength'] = [len(str(word)) for word in df.Word]
    feat_values['word_len'] = df.WordLength.mean()
    feat_values['sent_len'] = feat_values['word_count'] / feat_values['sent_count']

    feat_values['SMOG'] = 1.0430 * math.sqrt(polysyllabic_words * (30 / feat_values['sent_count'])) + 3.1291

    # Calculating lexical features
    feat_values['lemma_count'] = int(df.groupby('Lemma').Lemma.count().to_frame().count().iloc[0])
    cleaned_text = df[(df.Upos != 'PROPN') & (df.Upos != 'SYM')]
    cleaned_text = cleaned_text[~cleaned_text['Feats'].str.contains('NumForm=Digit', na=False)]
    cleaned_lemmas = cleaned_text.groupby('Lemma').Lemma.count().count()
    cleaned_words = cleaned_text.groupby('Lemma').Lemma.count().sum()
    cleaned_word_list = cleaned_text['Word'].tolist()
    feat_values['RTTR'] = cleaned_lemmas / math.sqrt(cleaned_words)
    feat_values['MTLD'] = mtld_calc(cleaned_word_list, ttr_threshold=0.72)
    verb_lemmas = df[df.Xpos == 'V'].groupby('Lemma').Lemma.count().count()
    verb_count = pos_count(df, 'V')
    feat_values['CVV'] = verb_lemmas / math.sqrt(2 * verb_count)

    noun_data = df[df.Xpos == 'S']
    try:
        noun_lemmas = noun_data['Lemma'].tolist()
        abstractness_data = utils.analyze(' '.join(noun_lemmas), "estonian")
        ab_sum = 0
        ab_count = 0
        for word in abstractness_data["wordAnalysis"]:
            if word['abstractness']:
                ab_sum += word['abstractness']
                ab_count += 1
        if ab_count > 0:
            feat_values['S_abstr'] = ab_sum / ab_count
        else:
            feat_values['S_abstr'] = 0
    except Exception:
        feat_values['S_abstr'] = 0

        # Calculating grammatical features
        # general nominal features
    nominals = df[(df.Xpos == 'S') | (df.Xpos == 'A') | (df.Xpos == 'P') | (df.Xpos == 'N')]
    nominal_count = nominals.Word.count()
    nominal_feats = feats_table(nominals)
    feat_values['n_cases'] = count_cases(nominal_feats)
    for feat_name, feat_tag in zip(['Nom', 'Tra', 'Plur'], ['Case=Nom', 'Case=Tra', 'Number=Plur']):
        feat_values[feat_name] = feat_ratio(nominal_feats, feat_tag, nominal_count)

    # noun features
    noun_count = pos_count(df, 'S')
    noun_feats = feats_table(df, 'S')
    feat_values['S_cases'] = count_cases(noun_feats)
    for feat_name, feat_tag in zip(['S_Nom', 'S_Tra', 'S_Plur'], ['Case=Nom', 'Case=Tra', 'Number=Plur']):
        feat_values[feat_name] = feat_ratio(noun_feats, feat_tag, noun_count)

    # adjective features
    adj_count = pos_count(df, 'A')
    adj_feats = feats_table(df, 'A')
    feat_values['A_cases'] = count_cases(adj_feats)
    for feat_name, feat_tag in zip(['A_Gen', 'A_Tra', 'A_Sing', 'A_Plur'],
                                   ['Case=Gen', 'Case=Tra', 'Number=Sing', 'Number=Plur']):
        feat_values[feat_name] = feat_ratio(adj_feats, feat_tag, adj_count)

    # pronoun features
    pron_count = pos_count(df, 'P')
    pron_feats = feats_table(df, 'P')
    feat_values['P_cases'] = count_cases(pron_feats)
    for feat_name, feat_tag in zip(['P_Ela', 'P_Prs', 'P_Dem', 'P_IntRel'],
                                   ['Case=Ela', 'PronType=Prs', 'PronType=Dem', 'PronType=Int,Rel']):
        feat_values[feat_name] = feat_ratio(pron_feats, feat_tag, pron_count)

    # verb features
    verb_feats = feats_table(df, 'V')
    for feat_name, feat_tag in zip(['V_Fin', 'V_Sing', 'V_Neg'], ['VerbForm=Fin', 'Number=Sing', 'Polarity=Neg']):
        feat_values[feat_name] = feat_ratio(verb_feats, feat_tag, verb_count)

    # POS features
    adp_count = pos_count(df, 'K')
    adp_feats = feats_table(df, 'K')
    feat_values['K_Post'] = feat_ratio(adp_feats, 'AdpType=Post', adp_count)
    for feat_name, feat_tag in zip(['D', 'J', 'S_Prop'], ['D', 'J', 'PROPN']):
        feat_values[feat_name] = pos_ratio(df, feat_tag, feat_values['word_count'])

    feat_values['errors_per_word'] = errors_per_word
    feat_values['errors_per_sentence'] = errors_per_sentence

    return feat_values
