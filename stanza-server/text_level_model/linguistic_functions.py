# Original code created by Kais Allkivi

import json
import os
import pandas as pd
import requests


def pos_count(data, pos):
    '''Funktsioon arvutab sõnaliigi sageduse tekstis.'''
    if len(pos) > 1:
        posCount = data[data.Upos == pos].Word.count()
    else:
        posCount = data[data.Xpos == pos].Word.count()
    return posCount


def pos_ratio(data, pos, textLength):
    '''Funktsioon arvutab sõnaliigi osakaalu tekstis.'''
    if len(pos) > 1:
        posRatio = data[data.Upos == pos].Word.count() / textLength
    else:
        posRatio = data[data.Xpos == pos].Word.count() / textLength
    return posRatio


def pos_ttr(data, pos):
    '''Funktsioon arvutab lemmade-sõnede suhtarvu valitud sõnaliigi puhul.'''
    pos_lemmas = data[data.Xpos == pos].groupby('Lemma').Lemma.count().to_frame()
    lemma_count = pos_lemmas.Lemma.count()
    pos_count = pos_lemmas.Lemma.sum()
    if pos_count > 0:
        ttr = pos_lemmas.Lemma.count() / pos_lemmas.Lemma.sum()
    else:
        ttr = 0
    return ttr


def feats_table(data, pos=None):
    '''Funktsioon koostab morfokirjete sagedustabeli.
        Soovi korral saab määrata sõnaliigi, mille märgendusele keskendutakse.'''
    if pos:
        featsTable = data[data.Xpos == pos].groupby('Feats').Feats.count().to_frame()
    else:
        featsTable = data.groupby('Feats').Feats.count().to_frame()
    featsTable.rename(columns={'Feats': 'Freq'}, inplace=True)
    featsTable['Feats'] = featsTable.index
    return featsTable


def feat_ratio(data, feature, wordCount):
    '''Funktsioon arvutab valitud morfoloogilise vormi osakaalu tekstis.'''
    if wordCount > 0:
        featRatio = data[data['Feats'].str.contains(feature)].Freq.sum() / wordCount
    else:
        featRatio = 0
    return featRatio


def count_cases(data):
    '''Funktsioon arvutab valitud sõnaliigi puhul eri käändevormide arvu.'''
    data = data[data['Feats'].str.contains('Case=')]
    data['Feats'] = data.Feats.str.split('|')
    data['Case'] = [feat[0] for feat in data.Feats]
    cases = data.groupby('Case').Freq.sum().to_frame()
    nCases = len(cases.index)
    return nCases


def curl_request(data):
    '''Funktsioon teeb päringu teksti sõnade abstraktsuse ja
        sageduse kohta eesti kirjakeeles.
        Abstraktsushinnang lähtub kolmepallilisest skaalast
        (vt Mikk jt 2003; http://hdl.handle.net/10062/50110),
        Sagedusandmed põhinevad Tartu Ülikooli tasakaalus korpusel.'''

    chars_to_remove = ['_', '=', '(', ')', '\\', '"', '&']
    for char in chars_to_remove:
        data.loc[:, 'Lemma'] = data['Lemma'].str.replace(char, '', regex=True)
    data['Lemma'] = data['Lemma'].str.replace("'", "")

    lemmas = ' '.join(data['Lemma'].tolist())

    url = "https://kiirlugemine.keeleressursid.ee/api/analyze"
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "language": "estonian",
        "text": lemmas
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        if response.ok:
            return response.json()
        else:
            return None
    except:
        return None


def mtld_calc(word_array, ttr_threshold):
    '''Funktsioon arvutab sõnavara mitmekesisuse indeksi MTLD (McCarthy & Jarvis 2010).
    Funktsioon on pärit Simon Berneri bakalaureusetööst (2022).'''
    current_ttr = 1.0
    token_count = 0
    type_count = 0
    types = set()
    factors = 0.0
    for token in word_array:
        token = token.lower()
        token_count = token_count + 1
        if token not in types:
            type_count = type_count + 1
            types.add(token)
        current_ttr = type_count / token_count
        if current_ttr <= ttr_threshold:
            factors = factors + 1
            token_count = 0
            type_count = 0
            types = set()
            current_ttr = 1.0
    excess = 1.0 - current_ttr
    excess_val = 1.0 - ttr_threshold
    factors += excess / excess_val
    if factors != 0:
        return len(word_array) / factors
    return -1
