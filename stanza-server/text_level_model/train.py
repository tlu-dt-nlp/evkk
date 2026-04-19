# Original code created by Kais Allkivi

import pandas as pd
import os
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression, LogisticRegressionCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.svm import SVC
from joblib import dump


def train():
    # Lists of predictive features by subscore
    lex_feats = ['lemma_count', 'RTTR', 'CVV', 'MTLD', 'S_abstr']
    gram_feats = ['n_cases', 'Nom', 'Tra', 'Plur', 'S_cases',
                  'S_Nom', 'S_Tra', 'S_Plur', 'A_cases', 'A_Gen',
                  'A_Tra', 'A_Sing', 'A_Plur', 'P_cases', 'P_Ela',
                  'P_Prs', 'P_Dem', 'P_IntRel', 'V_Fin', 'V_Sing',
                  'V_Neg', 'K_Post', 'D', 'J', 'S_Prop']
    complex_feats = ['word_count', 'word_len', 'syllables']
    error_feats = ['errors_per_word', 'errors_per_sentence']
    mixed_feats = ['n_cases', 'Tra', 'Plur', 'S_cases', 'S_Plur',
                   'A_cases', 'P_cases', 'P_Prs', 'P_Dem', 'P_IntRel',
                   'V_Fin', 'lemma_count', 'RTTR', 'CVV', 'S_abstr',
                   'MTLD', 'word_count', 'sent_count', 'word_len',
                   'sent_len', 'SMOG', 'syllables', 'errors_per_word']

    # The training set consists of 720 texts, stratified by proficiency level.
    csv_path = os.path.join(os.path.dirname(__file__), 'train_test.csv')
    training_set = pd.read_csv(csv_path)

    # Data matrices containing relevant feature values by subscore
    X_lex = training_set[lex_feats].to_numpy()
    X_gram = training_set[gram_feats].to_numpy()
    X_complex = training_set[complex_feats].to_numpy()
    X_error = training_set[error_feats].to_numpy()
    X_mixed = training_set[mixed_feats].to_numpy()

    # Array containing the proficiency level labels
    y = training_set['prof_level'].to_numpy().ravel()

    # Training classification models
    # lexical features
    lex_scaler = StandardScaler().fit(X_lex)
    X_lex_scaled = lex_scaler.transform(X_lex)
    lex_clf = LogisticRegressionCV(cv=5, max_iter=10000)
    lex_model = lex_clf.fit(X_lex_scaled, y)
    dump(lex_model, 'lex_model.joblib')
    dump(lex_scaler, 'lex_scaler.joblib')

    # grammatical features
    gram_scaler = StandardScaler().fit(X_gram)
    X_gram_scaled = gram_scaler.transform(X_gram)
    gram_clf = LinearDiscriminantAnalysis()
    gram_model = gram_clf.fit(X_gram_scaled, y)
    dump(gram_model, 'gram_model.joblib')
    dump(gram_scaler, 'gram_scaler.joblib')

    # complexity features
    complex_scaler = StandardScaler().fit(X_complex)
    X_complex_scaled = complex_scaler.transform(X_complex)
    complex_clf = LogisticRegression(max_iter=10000)
    complex_model = complex_clf.fit(X_complex_scaled, y)
    dump(complex_model, 'complex_model.joblib')
    dump(complex_scaler, 'complex_scaler.joblib')

    # error features
    error_scaler = StandardScaler().fit(X_error)
    X_error_scaled = error_scaler.transform(X_error)
    error_clf = RandomForestClassifier(random_state=0)
    error_model = error_clf.fit(X_error_scaled, y)
    dump(error_model, 'error_model.joblib')
    dump(error_scaler, 'error_scaler.joblib')

    # mixed features for general score
    mixed_scaler = StandardScaler().fit(X_mixed)
    X_mixed_scaled = mixed_scaler.transform(X_mixed)
    mixed_clf = SVC(probability=True)
    mixed_model = mixed_clf.fit(X_mixed_scaled, y)
    dump(mixed_model, 'mixed_model.joblib')
    dump(mixed_scaler, 'mixed_scaler.joblib')

    # error score
    # TODO: Tasemeennustus ja tasemete tõenäosused - testandmetes tunnused puudu

    # general score
    # TODO: Tasemeennustus ja tasemete tõenäosused - testandmetes puudu tunnus 'errors_per_word'
