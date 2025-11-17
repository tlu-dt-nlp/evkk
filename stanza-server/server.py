import json
import math
import os
import re
import subprocess
from flask import Flask
from flask import Response
from flask import request

from corrector_functions import generate_grammar_output, calculate_noun_count, verb_and_noun_relation, \
    calculate_content_word, calculate_abstract_words, calculate_abstractness_average, \
    handle_uncommon_words_marking, handle_content_words_marking, handle_repetition_marking, \
    handle_abstract_words_marking, handle_noun_marking, handle_long_word_marking, handle_long_sentence_marking
from grammar_fetches import fetch_grammar, fetch_speller, fetch_test_grammar
from grammar_test_functions import generate_test_grammar_output
from nlp import nlp_t, nlp_tp, nlp_tpl, nlp_all, nlp_ru_tp, nlp_ru_all
from tasemehindaja import arvuta
from text_abstraction_analyse import Utils
from text_level_model.linguistic_analysis import linguistic_analysis, extract_features
from text_level_model.train import train
from vocabulary_marking_handlers import check_both_sentence_repetition

train()
utils = Utils()

if os.path.isfile("/app/word_mapping.csv"):
    asendused = [rida.strip().split(",") for rida in open("/app/word_mapping.csv").readlines()]
else:
    asendused = []

if os.path.isfile("/app/common_errors_map.json"):
    with open('/app/common_errors_map.json', 'r', encoding='utf-8') as f:
        common_errors_map = json.load(f)
else:
    common_errors_map = {}

mimetype = "application/json"
post = ['POST']
app = Flask(__name__)

piirid = {"lix": [25.0, 35.0, 45.0, 60.0],
          "smog": [9.5, 12.0, 15.0, 17.5],
          "fk": [9.5, 12.5, 16.0, 21.0]}
vasted = ["complexity_level_very_easy", "complexity_level_easy", "complexity_level_average",
          "complexity_level_difficult", "complexity_level_very_difficult"]

sona_upos_piirang = ["PUNCT", "SYM"]
sona_upos_piirang_mitmekesisus = ["PUNCT", "SYM", "NUM", "PROPN"]
vormimargend_upos_piirang = ["ADP", "ADV", "CCONJ", "SCONJ", "INTJ", "X"]

eesti_tahestik = r'[a-zA-ZõÕäÄöÖüÜŽžŠš0-9.-]+'


@app.route('/full-text-analysis', methods=post)
def full_text_analysis():
    tekst = request.json["tekst"]
    result = process_full_text_analysis(tekst, collect_positional_info=True)
    return Response(json.dumps(result), mimetype=mimetype)


@app.route('/sonad-lemmad-silbid-sonaliigid-vormimargendid', methods=post)
def sonad_lemmad_silbid_sonaliigid_vormimargendid():
    tekst = request.json["tekst"]
    result = process_full_text_analysis(tekst, collect_positional_info=False)
    return Response(json.dumps(result), mimetype=mimetype)


@app.route('/keerukus-sonaliigid-mitmekesisus', methods=post)
def keerukus_sonaliigid_mitmekesisus():
    tekst = request.json["tekst"]
    model_type = request.json["model"]
    doc = nlp_tpl(tekst)

    sonad = []
    eestikeelsed_sonad = []
    sonaliigid = []
    lemmad = []
    laused = []
    word_start_and_end = []
    linguistic_data = []
    total_words = 0
    grammar_output = []
    list_checked_speller_errors = []

    for sentence in doc.sentences:
        laused.append(sentence.text)
        sentence_array = []
        for word in sentence.words:
            total_words += 1
            data_row = [word.id, word.text, word.lemma, word.upos, word.xpos, word.feats]
            linguistic_data.append(data_row)
            corrected_word = common_errors_map.get(word.text.lower(), None)
            if corrected_word and word.text[0].isupper():
                corrected_word = corrected_word.capitalize()
            if corrected_word:
                list_checked_speller_errors.append({
                    "corrected_text": corrected_word,
                    "correction_type": "spellingError",
                    "start": word.start_char,
                    "end": word.end_char,
                    "initial_text": word.text
                })
            if word.upos not in sona_upos_piirang:
                sentence_array.append({
                    "start": word.start_char,
                    "end": word.end_char,
                    "text": word.text,
                    "lemma": word.lemma,
                    "upos": word.upos
                })
                sonad.append(word.text)
                sonaliigid.append(word.pos)
                lemmad.append(sanitize_lemma(word.lemma))
                if sona_on_eestikeelne(word.text):
                    eestikeelsed_sonad.append(word.text)
                else:
                    eestikeelsed_sonad.append("–")
        word_start_and_end.append(sentence_array)

    syllables = silbita_sisemine(" ".join(puhasta_sonad(eestikeelsed_sonad)))
    abstract_answer = utils.analyze(' '.join(lemmad), "estonian")
    serializable_word_analysis = make_serializable(abstract_answer["wordAnalysis"])
    vocabulary = check_both_sentence_repetition(laused, word_start_and_end)

    if model_type == "grammarcheckerTest":
        grammar_output = generate_test_grammar_output(tekst, fetch_test_grammar(tekst))
    else:
        grammar_output = generate_grammar_output(tekst, fetch_grammar(tekst))

    speller_output = generate_grammar_output(tekst, fetch_speller(tekst), list_checked_speller_errors)

    uncommon_marked, uncommon_count = handle_uncommon_words_marking(tekst, sonaliigid, lemmad, sonad)
    abstract_marked = handle_abstract_words_marking(tekst, serializable_word_analysis, sonaliigid, sonad)
    content_marked = handle_content_words_marking(tekst, sonaliigid, lemmad, sonad)
    repetition_marked = handle_repetition_marking(tekst, vocabulary)
    nouns_marked = handle_noun_marking(tekst, sonaliigid, sonad)
    long_words_marked = handle_long_word_marking(tekst, sonad)
    long_sentences_marked = handle_long_sentence_marking(tekst, doc)

    syllable_count = 0
    polysyllabic_words = 0
    for word in syllables:
        word_syllable_count = word.count('-') + 1
        syllable_count += word_syllable_count
        if word_syllable_count >= 3:
            polysyllabic_words += 1

    errors_per_sentence = grammar_output["error_count"] / len(doc.sentences)
    errors_per_word = grammar_output["error_count"] / total_words

    feat_values = extract_features(errors_per_sentence, errors_per_word, linguistic_data, syllable_count,
                                   polysyllabic_words)

    return Response(json.dumps({
        "sonad": sonad,
        "sonaliigid": sonaliigid,
        "keerukus": hinda_keerukust(tekst),
        "mitmekesisus": hinda_mitmekesisust(tekst),
        "lemmad": lemmad,
        "keeletase": {
            "lexical": linguistic_analysis("lexical", feat_values),
            "grammatical": linguistic_analysis("grammatical", feat_values),
            "complexity": linguistic_analysis("complexity", feat_values),
            "error": linguistic_analysis("error", feat_values),
            "mixed": linguistic_analysis("mixed", feat_values)
        },
        "abstraktsus": serializable_word_analysis,
        "grammatika": grammar_output["corrector_results"],
        "grammatika_vead": grammar_output["error_list"],
        "speller": speller_output["corrector_results"],
        "spelleri_vead": speller_output["error_list"],
        "laused": laused,
        "sonavara": vocabulary,
        "korrektori_loendid": {
            "harvaesinevad": uncommon_count,
            "nimisonad": calculate_noun_count(sonaliigid),
            "sisusonad": calculate_content_word(lemmad, sonaliigid),
            "nimitegusuhe": verb_and_noun_relation(sonaliigid),
            "abstraktsed": calculate_abstract_words(serializable_word_analysis, sonaliigid),
            "abskeskmine": calculate_abstractness_average(serializable_word_analysis)
        },
        "margitud_laused": {
            "uncommonwords": uncommon_marked,
            "abstractwords": abstract_marked,
            "contentwords": content_marked,
            "wordrepetition": repetition_marked,
            "nouns": nouns_marked,
            "longword": long_words_marked,
            "longsentence": long_sentences_marked
        }

    }), mimetype=mimetype)


@app.route('/sonaliik', methods=post)
def sonaliik():
    doc = nlp_tp(request.json["tekst"])
    result = []
    for sentence in doc.sentences:
        for word in sentence.words:
            if word.upos != "PUNCT":
                result.append(word.pos)
    return Response(json.dumps(result), mimetype=mimetype)


@app.route('/vormimargendid', methods=post)
def vormimargendid():
    doc = nlp_tp(request.json["tekst"])
    result = []
    for sentence in doc.sentences:
        for word in sentence.words:
            if word.upos != "PUNCT":
                if word.upos not in ["ADP", "ADV", "CCONJ", "SCONJ", "INTJ", "X"]:
                    result.append([word.pos, word.feats, word.text])
                else:
                    result.append([word.pos, "–", word.text])
    return Response(json.dumps(result), mimetype=mimetype)


@app.route('/silbid', methods=post)
def silbid():
    tekst = request.json["tekst"]
    return Response(json.dumps(silbita_sisemine(tekst)), mimetype=mimetype)


@app.route('/lemmad', methods=post)
def lemmad():
    doc = nlp_tpl(request.json["tekst"])
    result = []
    for sentence in doc.sentences:
        for word in sentence.words:
            if word.upos not in sona_upos_piirang and word.lemma is not None:
                result.append(word.lemma)
    return Response(json.dumps(result), mimetype=mimetype)


@app.route('/lemmadjaposinfo', methods=post)
def lemmadjaposinfo():
    doc = nlp_tpl(request.json["tekst"])
    result = []
    for sentence in doc.sentences:
        for word in sentence.words:
            if word.upos not in sona_upos_piirang and word.lemma is not None:
                result.append({"word": word.lemma, "start_char": word.start_char, "end_char": word.end_char})
    return Response(json.dumps(result), mimetype=mimetype)


@app.route('/laused', methods=post)
def laused():
    doc = nlp_t(request.json["tekst"])
    result = []
    for sentence in doc.sentences:
        result.append(sentence.text)
    return Response(json.dumps(result), mimetype=mimetype)


@app.route('/sonadlausetenajaposinfo', methods=post)
def sonadlausetenajaposinfo():
    doc = nlp_tp(request.json["tekst"])
    result = []
    for sentence in doc.sentences:
        sentence_result = []
        for word in sentence.words:
            if word.upos not in sona_upos_piirang:
                sentence_result.append({"word": word.text, "start_char": word.start_char, "end_char": word.end_char})
        result.append(sentence_result)
    return Response(json.dumps(result), mimetype=mimetype)


@app.route('/lemmadlausetenajaposinfo', methods=post)
def lemmadlausetenajaposinfo():
    doc = nlp_tpl(request.json["tekst"])
    result = []
    for sentence in doc.sentences:
        sentence_result = []
        for word in sentence.words:
            if word.upos not in sona_upos_piirang and word.lemma is not None:
                sentence_result.append({"word": word.lemma, "start_char": word.start_char, "end_char": word.end_char})
        result.append(sentence_result)
    return Response(json.dumps(result), mimetype=mimetype)


@app.route('/sonad', methods=post)
def sonad():
    doc = nlp_tp(request.json["tekst"])
    result = []
    for sentence in doc.sentences:
        for word in sentence.words:
            if word.upos not in sona_upos_piirang:
                result.append(word.text)
    return Response(json.dumps(result), mimetype=mimetype)


@app.route('/sonadjaposinfo', methods=post)
def sonadjaposinfo():
    doc = nlp_tp(request.json["tekst"])
    result = []
    for sentence in doc.sentences:
        for word in sentence.words:
            if word.upos not in sona_upos_piirang:
                result.append({"word": word.text, "start_char": word.start_char, "end_char": word.end_char})
    return Response(json.dumps(result), mimetype=mimetype)


@app.route('/keeletase', methods=post)
def keeletase():
    return Response(json.dumps(arvuta(request.json["tekst"])), mimetype="application/json")


@app.route('/stanzaconllu', methods=post)
def stanzaconllu():
    if request.json["failinimi"]:
        keel = 'et'
        if request.json["keel"] and request.json["keel"] == "vene":
            keel = 'ru'
        vastus = margenda_stanza(request.json["tekst"], comments=True, filename=request.json["failinimi"],
                                 language=keel)
    else:
        vastus = margenda_stanza(request.json["tekst"], comments=False)
    return Response(json.dumps([vastus]), mimetype=mimetype)


@app.route('/tervitus', methods=['GET'])
def tervitus():
    return "abc " + __file__ + " " + os.getcwd()


@app.route('/tahedsonadlaused', methods=post)
def tahedsonadlaused():
    tekst = request.json["tekst"]
    keel = 'et'
    if request.json["keel"]:
        keel = request.json["keel"]
    nlp = nlp_tp
    if keel == "ru":
        nlp = nlp_ru_tp
    doc = nlp(tekst)
    v = [len([sona for lause in doc.sentences for sona in lause.words if sona.xpos != "Z"]),
         len(doc.sentences)]
    return Response(json.dumps(v), mimetype=mimetype)


@app.route('/keerukus', methods=post)
def keerukus():
    tekst = request.json["tekst"]
    return Response(json.dumps(hinda_keerukust(tekst)), mimetype=mimetype)


@app.route('/mitmekesisus', methods=post)
def mitmekesisus():
    tekst = request.json["tekst"]
    return Response(json.dumps(hinda_mitmekesisust(tekst)), mimetype=mimetype)


def process_full_text_analysis(tekst, collect_positional_info=False):
    doc = nlp_tpl(tekst)

    sonad = []
    eestikeelsed_sonad = []
    lemmad = []
    sonaliigid = []
    vormimargendid = []
    sonad_lausetena_ja_pos_info = [] if collect_positional_info else None
    lemmad_lausetena_ja_pos_info = [] if collect_positional_info else None
    sonad_ja_pos_info = [] if collect_positional_info else None
    lemmad_ja_pos_info = [] if collect_positional_info else None

    for sentence in doc.sentences:
        sonad_lausetena = [] if collect_positional_info else None
        lemmad_lausetena = [] if collect_positional_info else None

        for word in sentence.words:
            if word.upos not in sona_upos_piirang:
                sonad.append(word.text)

                if collect_positional_info:
                    sonad_lausetena.append(
                        {"word": word.text, "start_char": word.start_char, "end_char": word.end_char})
                    lemmad_lausetena.append(
                        {"word": word.lemma, "start_char": word.start_char, "end_char": word.end_char})
                    sonad_ja_pos_info.append(
                        {"word": word.text, "start_char": word.start_char, "end_char": word.end_char})
                    lemmad_ja_pos_info.append(
                        {"word": word.lemma, "start_char": word.start_char, "end_char": word.end_char})

                if sona_on_eestikeelne(word.text):
                    eestikeelsed_sonad.append(word.text)
                    lemmad.append(word.lemma)
                    sonaliigid.append(word.pos)
                    if word.upos not in vormimargend_upos_piirang:
                        vormimargendid.append([word.pos, word.feats])
                    else:
                        vormimargendid.append([word.pos, "–"])
                else:
                    eestikeelsed_sonad.append("–")
                    lemmad.append("–")
                    sonaliigid.append("–")
                    vormimargendid.append(["–", "–"])

        if collect_positional_info:
            sonad_lausetena_ja_pos_info.append(sonad_lausetena)
            lemmad_lausetena_ja_pos_info.append(lemmad_lausetena)

    silbid = silbita_sisemine(" ".join(puhasta_sonad(eestikeelsed_sonad)))
    silpide_arv = len(silbid)

    for index, sona in enumerate(reversed(eestikeelsed_sonad)):
        if sona == "–":
            silbid.insert(silpide_arv - index, "–")
            silpide_arv += 1

    result = {
        "sonad": sonad,
        "lemmad": lemmad,
        "silbid": silbid,
        "sonaliigid": sonaliigid,
        "vormimargendid": vormimargendid,
    }

    if collect_positional_info:
        result.update({
            "sonad_lausetena_ja_pos_info": sonad_lausetena_ja_pos_info,
            "lemmad_lausetena_ja_pos_info": lemmad_lausetena_ja_pos_info,
            "sonad_ja_pos_info": sonad_ja_pos_info,
            "lemmad_ja_pos_info": lemmad_ja_pos_info,
        })

    return result


def silbita_sisemine(tekst):
    process = subprocess.Popen(["bash", "/app/morfi-ja-silbita.sh"], cwd="/app", stderr=subprocess.PIPE,
                               stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    stdo, _ = process.communicate(tekst.encode())
    response = stdo.decode().rstrip().split()
    process.terminate()

    return [sona.replace("-", "–") if sona == "-" else sona for sona in response]


def margenda_stanza(tekst, comments=True, filename="document", language='et'):
    v = []
    nlp = nlp_all
    if language == 'ru':
        nlp = nlp_ru_all
    doc = nlp(tekst)
    index = 0
    if comments:
        v.append('# filename = ' + filename + '\n')
    for sent in doc.sentences:
        index = index + 1
        sentence = ' '.join([word.text for word in sent.words])
        sentence = re.sub(r'\s([.,?!:;)])', r'\1', sentence)
        sentence = re.sub(r'([(])\s', r'\1', sentence)
        sentence = detokenize_quotemarks(sentence)
        if comments:
            v.append('# sent_id = ' + filename + '_' + str(index) + '\n')
            v.append('# text = ' + str(sentence) + '\n')
        windex = 0
        for word in sent.words:
            viimasesisu = "SpaceAfter=No"
            if windex < len(sent.words) - 1:
                if sent.words[windex].end_char < sent.words[windex + 1].start_char:
                    viimasesisu = "_"
            else:
                viimasesisu = "_"
            vhead = (str(word.head) if word.head is not None else "_")
            vdeprel = (word.deprel if word.deprel else "_")
            vkoos = vhead + ":" + vdeprel
            if vkoos == "_:_": vkoos = "_"

            fields = [
                str(word.id),
                word.text,
                word.lemma,
                word.upos,
                word.xpos,
                word.feats if word.feats else "_",
                vhead,
                vdeprel,
                vkoos,
                viimasesisu,
            ]
            analysis = '\t'.join(fields)
            v.append(analysis + '\n')
            windex += 1
        v.append('\n')
    v.append('\n')
    return "".join(v)


def asenda(t):
    for a in asendused:
        t = re.sub("([,-?!\"' ()])(" + a[0] + ")([,-?!\"' ()])", "\\1" + a[1] + "\\3", t)
        t = re.sub("([,-?!\"' ()])(" + a[0] + ")([,-?!\"' ()])", "\\1" + a[1] + "\\3", t)
    return t


def hinnang(indeks, arv):
    p = piirid[indeks]
    for i in range(len(p)):
        if arv < p[i]: return vasted[i]
    return vasted[-1]


def hinda_keerukust(tekst):
    poly = 0
    silpide_arv = 0
    pikad_sonad = 0
    doc = nlp_tp(tekst)
    eestikeelsed_sonad = []

    for sentence in doc.sentences:
        for word in sentence.words:
            if word.upos not in sona_upos_piirang and word.xpos != "Z":
                if sona_on_eestikeelne(word.text):
                    eestikeelsed_sonad.append(word.text)
                    if len(word.text) >= 7:
                        pikad_sonad += 1
    lausetearv = len(doc.sentences)
    sonadearv = len(eestikeelsed_sonad)
    if sonadearv == 0:
        return [0] * 8
    silbitatud = silbita_sisemine(" ".join(puhasta_sonad(eestikeelsed_sonad)))
    for sona in silbitatud:
        silp = sona.count('-')
        if silp > 0: silpide_arv += silp + 1
        if silp > 2: poly += 1
    SMOG_hinnang = 1.0430 * math.sqrt(poly * (30 / lausetearv)) + 3.1291
    FK_hinnang = 0.39 * (sonadearv / lausetearv) + 11.8 * (silpide_arv / sonadearv) - 15.59
    LIX_hinnang = sonadearv / lausetearv + ((pikad_sonad * 100) / sonadearv)
    v = [0, 0, 0]
    v[0] = hinnang("smog", SMOG_hinnang)
    v[1] = hinnang("fk", FK_hinnang)
    v[2] = hinnang("lix", LIX_hinnang)
    v.append("/".join(list(set(v))))
    return [lausetearv, sonadearv, poly, silpide_arv, pikad_sonad, SMOG_hinnang, FK_hinnang, int(LIX_hinnang)] + v


def puhasta_sonad(words):
    return [word.replace("'", "").replace("*", "").replace("\n", "") for word in words]


def make_serializable(data):
    if isinstance(data, dict):
        return {key: make_serializable(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [make_serializable(item) for item in data]
    elif hasattr(data, '__dict__'):
        return make_serializable(data.__dict__)
    else:
        return data


def sona_on_eestikeelne(sona):
    return bool(re.fullmatch(eesti_tahestik, sona))


def sanitize_lemma(lemma):
    return lemma.replace("=", "")


def hinda_mitmekesisust(tekst):
    import valemid_mitmekesisus
    doc = nlp_tpl(tekst)

    words_array = []
    for s_sentence in doc.sentences:
        for w_word in s_sentence.words:
            if w_word.upos not in sona_upos_piirang_mitmekesisus \
                and not (
                w_word.feats is not None and (
                w_word.feats.find("NumForm=Digit") > 0 or w_word.feats.find("Abbr=Yes") >= 0)):
                words_array.append(w_word)

    # sõnade arv kokku
    words_count = len(words_array)
    new_text = ""
    for j in range(0, len(words_array)):
        new_text = new_text + " " + words_array[j].text

    # unikaalsete lemmade massiv
    text_lemmas = []

    for j in range(0, words_count):
        # teksti unikaalsed lemmad
        if words_array[j].lemma:
            if words_array[j].lemma.lower() not in text_lemmas:
                text_lemmas.append(words_array[j].lemma.lower())

    # lemmade arv tekstis
    lemmas_count = len(text_lemmas)

    KLSS = round(lemmas_count / math.sqrt(2 * words_count), 4)
    JLSS = round(lemmas_count / math.sqrt(words_count), 4)
    # MAAS = round((math.log(words_count) - math.log(lemmas_count)) / math.ldexp(math.log(words_count), 2), 4)
    MAAS = 0
    # if words_count < 50:
    #     UBER = 0
    # else:
    #     UBER = round(math.ldexp(math.log(words_count), 2) / (math.log(words_count) - math.log(lemmas_count)), 4)
    UBER = 0
    MTLD = round(valemid_mitmekesisus.mtld_calc(words_array, ttr_threshold=0.72), 4)
    if words_count < 42:
        HDD = 0
    else:
        HDD = round(valemid_mitmekesisus.hdd(words_array, sample_size=42.0), 4)
    # MSTTR = round(valemid_mitmekesisus.msttr(new_text, window_length = 30), 4)
    MSTTR = 0
    return [KLSS, JLSS, MAAS, UBER, MTLD, HDD, MSTTR] + valemid_mitmekesisus.mitmekesisus_kaugused(KLSS, JLSS, MAAS,
                                                                                                   UBER, MTLD, HDD,
                                                                                                   MSTTR) + [
        words_count, lemmas_count]


def detokenize_quotemarks(sentence):
    chars = []
    closing_mark = False
    no_space_after = False
    for char in sentence:
        if char == '"':
            if not closing_mark:
                no_space_after = True
                closing_mark = True
            else:
                if len(chars) > 0 and chars[-1] == ' ':
                    chars.pop()
                closing_mark = False
        if not (no_space_after and char == ' '):
            chars.append(char)
        if char != '"':
            no_space_after = False
    return ''.join(chars)


app.run(host="0.0.0.0", threaded=True, port=5300)
