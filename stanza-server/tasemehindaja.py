import math
import re
from io import StringIO

import numpy as np
import pandas as pd

from nlp import nlp_tpl
from text_abstraction_analyse import Utils


def pos_ratio(data, pos, textLength):
    "Funktsioon arvutab sõnaliigi osakaalu tekstis."
    posRatio = data[data.Xpos == pos].Word.count() / textLength
    return posRatio


def feats_table(data, pos):
    "Funktsioon koostab valitud sõnaliigi morfokirjete sagedustabeli."
    featsTable = data[data.Xpos == pos].groupby("Feats").Feats.count().to_frame()
    featsTable.rename(columns={"Feats": "Freq"}, inplace=True)
    featsTable["Feats"] = featsTable.index
    return featsTable


def feat_ratio(data, feature, textLength):
    "Funktsioon arvutab valitud morfoloogilise vormi osakaalu tekstis."
    featRatio = data[data["Feats"].str.contains(feature)].Freq.sum() / textLength
    return featRatio


def count_cases(data):
    "Funktsioon arvutab valitud sõnaliigi puhul eri käändevormide arvu."
    data = data[data["Feats"].str.contains("Case=")]  # alles jäävad käänduvad sõnad
    data["Feats"] = data.Feats.str.split("|")
    data["Case"] = [feat[0] for feat in data.Feats]  # käändevormid eraldi tulbaks
    cases = data.groupby("Case").Freq.sum().to_frame()
    NCases = len(cases.index)
    return NCases


def lexical_density(data, textLength):
    "Funktsioon arvutab teksti leksikaalse tiheduse ehk sisusõnade osakaalu."
    textNoNumerals = data.drop(data[data.Xpos == "N"].index)  # tekst arvsõnadeta
    lemmasNoNumerals = textNoNumerals["Lemma"].tolist()  # lemmade loend stoppsõnadega võrdlemiseks
    # stoppsõnade loend lemmatiseeritud tekstile (Uiboaed 2018, https://datadoi.ee/handle/33/78)
    #	stopLemmas = pd.read_csv("/home/kais/public_html/Tasemehindaja/estonian-stopwords-lemmas.txt")
    #	stopLemmas = pd.read_csv(os.getcwd()+"/estonian-stopwords-lemmas.txt")
    stopLemmas = pd.read_csv("/app/estonian-stopwords-lemmas.txt")
    stopLemmas = set(stopLemmas["Stoplemma"].tolist())
    # stoppsõnade hulgas sisalduvate lemmade loendamine
    functionWords = 0
    for i in range(len(lemmasNoNumerals)):
        search = lemmasNoNumerals[i]
        if search in stopLemmas:
            functionWords += 1
    wordsNoNumerals = textNoNumerals.Word.count()
    lexWords = wordsNoNumerals - functionWords
    lexDensity = lexWords / textLength
    return lexDensity


def rare_counter(data, freqBoundary, textLength):
    "Funktsioon arvutab tekstis sõnade osakaalu, mille lemma sagedus on etteantud piirist väiksem."
    rareCount = 0
    for word in data["wordAnalysis"]:
        lemma = word["lemmas"][0]
        if lemma["frequency"]:
            if lemma["frequency"] < freqBoundary:
                rareCount += 1
    rareRatio = rareCount / textLength
    return rareRatio


def class_score(featureValues, coefficients, constant):
    "Funktsioon arvutab Fisheri klassifitseerimisfunktsiooni väärtuse."
    score = np.sum(np.multiply(featureValues, coefficients)) + constant
    return float(score)


def class_probabilities(classScoreA2, classScoreB1, classScoreB2, classScoreC1):
    "Funktsioon leiab klassifitseerimisskooride alusel eri keeleoskustasemetele kuulumise tõenäosused."
    maxScore = max(classScoreA2, classScoreB1, classScoreB2, classScoreC1)
    sumScore = math.fsum(
        [math.exp(classScoreA2 - maxScore), math.exp(classScoreB1 - maxScore),
         math.exp(classScoreB2 - maxScore), math.exp(classScoreC1 - maxScore)])
    probA2 = math.exp(classScoreA2 - maxScore) / sumScore
    probB1 = math.exp(classScoreB1 - maxScore) / sumScore
    probB2 = math.exp(classScoreB2 - maxScore) / sumScore
    probC1 = math.exp(classScoreC1 - maxScore) / sumScore
    classProbs = [[probA2, "A2"], [probB1, "B1"], [probB2, "B2"], [probC1, "C1"]]
    sortedProbs = sorted(classProbs, reverse=True)
    return sortedProbs


def arvuta(inputText):
    # Teksti sisestamine ja märgendamine
    # input = input("Kopeeri või kirjuta siia analüüsitav tekst: ")
    # input = open("/home/kais/public_html/Tasemehindaja/input.txt", "r")
    # inputText = input.read().rstrip()
    # if len(sys.argv)<2:
    #  print("Palun sisesta tekst.")
    #  exit()
    # inputText=sys.argv[1]
    inputText = re.sub('[^0-9a-zA-ZõäöüšžÕÄÖÜŠŽ.?! \\n]+', '', inputText)
    utils = Utils()
    # input.close()
    if len(inputText) < 15:
        # print("Tekst on liiga lühike.")
        return []
    doc = nlp_tpl(inputText)
    analysis = "\n".join(
        [f"{word.id}\t{word.text}\t{word.lemma}\t{word.upos}\t{word.xpos}\t{word.feats}"
         for sent in doc.sentences for word in sent.words])

    # Märgendatud väljundi salvestamine faili
    # output = open("/home/kais/public_html/Tasemehindaja/output.txt", "w")
    # output.write("Index\tWord\tLemma\tUpos\tXpos\tFeats\n")
    # output.write(analysis)
    # output.close()

    buffer = StringIO("Index\tWord\tLemma\tUpos\tXpos\tFeats\n" + analysis)

    # Märgendatud andmete sisselugemine
    # text = pd.read_csv("/home/kais/public_html/Tasemehindaja/output.txt", sep="\t", engine="python")
    text = pd.read_csv(buffer, sep="\t", engine="python")

    # Pindmised tunnused (surface features)
    sentences = text[text.Index == 1].Index.count()  # lausete arv
    text = text[text.Upos != "PUNCT"]  # tekst kirjavahemärkideta
    words = text.Word.count()  # sõnade arv
    text["WordLength"] = [len(word) for word in text.Word]  # sõnapikkuste tulp
    avgWord = text.WordLength.mean()  # keskmine sõnapikkus
    avgSentence = words / sentences  # keskmine lausepikkus

    # Fisheri klassifitseerimisskooride arvutamine (koefitsiendid nüüd ja edaspidi saadud SPSS-ist)
    surfFeatValues = np.array([words, avgWord, avgSentence])
    surfCoefficientsA2 = np.array([0.127, 30.134, 0.44])
    surfCoefficientsB1 = np.array([0.204, 32.065, 0.607])
    surfCoefficientsB2 = np.array([0.270, 33.93, 0.79])
    surfCoefficientsC1 = np.array([0.403, 41.663, 0.711])

    surfClassScoreA2 = class_score(surfFeatValues, surfCoefficientsA2, -79.99)
    surfClassScoreB1 = class_score(surfFeatValues, surfCoefficientsB1, -96.902)
    surfClassScoreB2 = class_score(surfFeatValues, surfCoefficientsB2, -117.57)
    surfClassScoreC1 = class_score(surfFeatValues, surfCoefficientsC1, -189.596)

    # Keeleoskustasemete tõenäosuse arvutamine ja kõige tõenäolisema taseme määramine
    sortedSurfProbs = class_probabilities(
        surfClassScoreA2, surfClassScoreB1, surfClassScoreB2, surfClassScoreC1)

    # Morfoloogilised tunnused (morphological features)
    adverbs = pos_ratio(text, "D", words)  # määrsõnade osakaal
    interjections = pos_ratio(text, "I", words)  # hüüdsõnade osakaal
    conjunctions = pos_ratio(text, "J", words)  # sidesõnade osakaal
    # käändsõnade eraldamine
    nominals = text[(text.Xpos == "S") | (text.Xpos == "A") |
                    (text.Xpos == "P") | (text.Xpos == "N")].groupby("Feats").Feats.count().to_frame()
    nominals.rename(columns={"Feats": "Freq"}, inplace=True)
    nominals["Feats"] = nominals.index
    genitiveAllNominals = feat_ratio(nominals, "Case=Gen", words)  # omastavas käändsõnade osakaal
    singularAllNominals = feat_ratio(nominals, "Number=Sing", words)  # ainsuses käändsõnade osakaal

    nounFeats = feats_table(text, "S")  # nimisõnade morfotunnused eraldi tabeliks
    nounCases = count_cases(nounFeats)  # nimisõna käändevormide arv
    nominativeNouns = feat_ratio(nounFeats, "Case=Nom", words)  # nimetavas nimisõnade osakaal
    partitiveNouns = feat_ratio(nounFeats, "Case=Par", words)  # osastavas nimisõnade osakaal
    elativeNouns = feat_ratio(nounFeats, "Case=Ela", words)  # seestütlevas nimisõnade osakaal
    adessiveNouns = feat_ratio(nounFeats, "Case=Ade", words)  # alalütlevas nimisõnade osakaal
    comitativeNouns = feat_ratio(nounFeats, "Case=Com", words)  # kaasaütlevas nimisõnade osakaal (koondmudelis)

    adjectiveFeats = feats_table(text, "A")  # omadussõnade morfotunnused eraldi tabeliks
    adjectiveCases = count_cases(adjectiveFeats)  # omadussõna käändevormide arv
    # adessiveAdjectives = feat_ratio(adjectiveFeats, "Case=Ade", words) # alalütlevas omadussõnade osakaal
    singularAdjectives = feat_ratio(adjectiveFeats, "Number=Sing",
                                    words)  # ainsuses omadussõnade osakaal (koondmudelis)

    pronounFeats = feats_table(text, "P")  # asesõnade morfotunnused eraldi tabeliks
    pronounCases = count_cases(pronounFeats)  # asesõna käändevormide arv
    personalPronouns = feat_ratio(pronounFeats, "PronType=Prs", words)  # isikuliste asesõnade osakaal
    pluralPronouns = feat_ratio(pronounFeats, "Number=Plur", words)  # mitmuses asesõnade osakaal

    verbFeats = feats_table(text, "V")  # tegusõnade morfotunnused eraldi tabeliks
    searchTerms = "|".join(["Polarity=Neg", "Connegative=Yes"])
    negativeVerbs = feat_ratio(verbFeats, searchTerms, words)  # tegusõna eitusvormi kuuluvate sõnade osakaal
    person1Verbs = feat_ratio(verbFeats, "Person=1", words)  # tegusõna 1. pöörde vormide osakaal
    person2Verbs = feat_ratio(verbFeats, "Person=2", words)  # tegusõna 2. pöörde vormide osakaal
    person3Verbs = feat_ratio(verbFeats, "Person=3", words)  # tegusõna 3. pöörde vormide osakaal

    morphFeatValues = np.array([adjectiveCases, pronounCases, personalPronouns, interjections,
                                singularAllNominals, genitiveAllNominals, nounCases, negativeVerbs, nominativeNouns,
                                person2Verbs, elativeNouns, person1Verbs, conjunctions, pluralPronouns, adessiveNouns,
                                partitiveNouns, adverbs, person3Verbs])
    morphCoefficientsA2 = np.array(
        [4.017, 2.811, 42.473, 627.833, 343.908, 218.858, 4.911, 399.83, 397.677, 656.975,
         161.721, 629.697, 587.699, 400.153, 158.173, 464.249, 571.522, 542.774])
    morphCoefficientsB1 = np.array(
        [4.725, 3.885, 81.286, 437.931, 321.291, 228.846, 6.455, 410.965, 443.544, 565.501,
         224.734, 599.388, 636.55, 399.23, 129.601, 509.093, 605.956, 560.104])
    morphCoefficientsB2 = np.array(
        [5.033, 4.858, 47.132, 430.691, 308.756, 265.918, 6.886, 450.94, 428.351, 611.095,
         136.872, 581.731, 643.13, 423.478, 107.74, 510.123, 596.331, 532.076])
    morphCoefficientsC1 = np.array(
        [7.017, 6.585, 32.113, 363.812, 274.255, 287.39, 7.646, 389.827, 447.771, 574.211,
         183.091, 565.608, 616.355, 386.92, 150.304, 515.166, 594.331, 553.256])

    morphClassScoreA2 = class_score(morphFeatValues, morphCoefficientsA2, -265.649)
    morphClassScoreB1 = class_score(morphFeatValues, morphCoefficientsB1, -286.546)
    morphClassScoreB2 = class_score(morphFeatValues, morphCoefficientsB2, -284.798)
    morphClassScoreC1 = class_score(morphFeatValues, morphCoefficientsC1, -297.608)

    sortedMorphProbs = class_probabilities(
        morphClassScoreA2, morphClassScoreB1, morphClassScoreB2, morphClassScoreC1)

    # Sõnavaratunnused (lexical features)
    text["Lemma"] = text["Lemma"].str.replace("_", "")  # liitsõnade lemmade alakriipsude kaotamine
    lemmas = int(text.groupby("Lemma").Lemma.count().to_frame().count())  # lemmade arv
    lemmasNoProperNouns = text[text.Upos != "PROPN"].groupby(
        "Lemma").Lemma.count().to_frame()  # pärisnimede kõrvalejätmine
    TTR = lemmasNoProperNouns.Lemma.count() / lemmasNoProperNouns.Lemma.sum()  # lemmade ja sõnade suhtarv
    # Maasi sõnavara mitmekesisuse indeks
    MaasIndex = (math.log(lemmasNoProperNouns.Lemma.sum()) -
                 math.log(lemmasNoProperNouns.Lemma.count())) / (math.log(lemmasNoProperNouns.Lemma.sum())) ** 2
    pronounLemmas = text[text.Xpos == "P"].groupby("Lemma").Lemma.count().to_frame()
    pronounTTR = pronounLemmas.count() / pronounLemmas.Lemma.sum()  # lemmade-sõnade suhtarv asesõnadel
    verbLemmas = text[text.Xpos == "V"].groupby("Lemma").Lemma.count().to_frame()
    verbTTR = verbLemmas.count() / verbLemmas.Lemma.sum()  # lemmade-sõnade suhtarv tegusõnadel
    lexicalDensity = lexical_density(text, words)  # leksikaalne tihedus

    nouns = text[text.Xpos == "S"]  # nimisõnade eraldamine abstraktsuse päringu jaoks
    abstractnessData = utils.analyze(' '.join(nouns["Lemma"].tolist()), "estonian")
    abSum = 0
    abCount = 0
    for word in abstractnessData["wordAnalysis"]:
        lemma = word["lemmas"][0]
    if lemma["abstractness"]:  # kontroll, kas abstraktsushinnang on olemas
        abSum += lemma["abstractness"]  # abstraktsushinnangute summa
        abCount += 1  # abstraktsushinnanguga nimisõnade arv
    nounAbstractness = 0
    if abCount > 0:
        nounAbstractness = abSum / abCount

    # sõnasageduste arvutamisel võetakse arvesse kõik sõnaliigid
    frequencyData = utils.analyze(' '.join(text["Lemma"].tolist()), "estonian")
    # sõnade osakaal, mille algvorm ei kuulu eesti keele 5000 sagedama lemma hulka
    rarerThan5000MostFreq = rare_counter(frequencyData, 220, words)
    # sõnade osakaal, mille algvorm ei kuulu eesti keele 2000 sagedama lemma hulka
    rarerThan2000MostFreq = rare_counter(frequencyData, 747, words)

    lexFeatValues = np.array([lemmas, TTR, MaasIndex, nounAbstractness, lexicalDensity,
                              rarerThan5000MostFreq, rarerThan2000MostFreq, pronounTTR, verbTTR], dtype=object)
    lexCoefficientsA2 = np.array(
        [2.027, 1641.296, 23979.833, 24.073, -53.572, -81.862, -25.007, 38.124, 29.029])
    lexCoefficientsB1 = np.array(
        [2.047, 1512.903, 22542.675, 24.984, -56.979, -124.661, 27.811, 38.603, 22.068])
    lexCoefficientsB2 = np.array(
        [2.141, 1458.999, 21963.704, 29.887, -59.61, -73.925, -4.039, 45.007, 28.829])
    lexCoefficientsC1 = np.array(
        [2.388, 1438.788, 22147.913, 36.231, -39.101, -61.944, -10.841, 57.207, 34.294])

    lexClassScoreA2 = class_score(lexFeatValues, lexCoefficientsA2, -921.208)
    lexClassScoreB1 = class_score(lexFeatValues, lexCoefficientsB1, -808.262)
    lexClassScoreB2 = class_score(lexFeatValues, lexCoefficientsB2, -781.746)
    lexClassScoreC1 = class_score(lexFeatValues, lexCoefficientsC1, -834.813)

    sortedLexProbs = class_probabilities(
        lexClassScoreA2, lexClassScoreB1, lexClassScoreB2, lexClassScoreC1)

    # Koondmudel (summary model)

    sumFeatValues = np.array([lemmas, TTR, MaasIndex, avgWord, person3Verbs, elativeNouns, nounAbstractness,
                              person1Verbs, pluralPronouns, rarerThan5000MostFreq, rarerThan2000MostFreq,
                              adjectiveCases,
                              comitativeNouns, singularAdjectives])
    sumCoefficientsA2 = np.array(
        [1.932, 1668.267, 23725.512, 16.431, 231.287, 54.949, 15.203, 91.257, -83.717,
         -99.879, -89.772, 1.524, -572.615, 110.831])
    sumCoefficientsB1 = np.array(
        [1.945, 1518.391, 22164.355, 21.012, 265.022, 97.247, 15.58, 72.958, -64.507,
         -140.729, -53.917, 1.813, -524.965, 84.929])
    sumCoefficientsB2 = np.array(
        [2.017, 1457.891, 21367.867, 22.867, 217.213, -5.126, 22.118, 12.872, -16.817,
         -89.412, -88.442, 1.996, -460.614, 41.367])
    sumCoefficientsC1 = np.array(
        [2.226, 1442.198, 21511.762, 31.882, 262.084, -9.731, 26.395, -12.087, -10.562,
         -84.05, -102.621, 3.565, -532.898, 17.912])

    sumClassScoreA2 = class_score(sumFeatValues, sumCoefficientsA2, -957.982)
    sumClassScoreB1 = class_score(sumFeatValues, sumCoefficientsB1, -853.244)
    sumClassScoreB2 = class_score(sumFeatValues, sumCoefficientsB2, -816.061)
    sumClassScoreC1 = class_score(sumFeatValues, sumCoefficientsC1, -900.694)

    sortedSumProbs = class_probabilities(
        sumClassScoreA2, sumClassScoreB1, sumClassScoreB2, sumClassScoreC1)
    for nr in range(4):
        if math.isnan(sortedLexProbs[nr][0]):
            sortedLexProbs[nr][0] = -1

    return sortedSumProbs + sortedSurfProbs + sortedMorphProbs + sortedLexProbs
    # Põhitulemus
    print("<h2>Tekst vastab tasemele:</h2><br>")
    print('<p id="tase">' + str(sortedSumProbs[0][1]) + '</p><br>')
    print('<p>Tõenäosus: <span id="tasemeprotsent">' + str(round(sortedSumProbs[0][0] * 100)) + '%</span></p>')
    print('<h3>Teiste tasemete tõenäosus:</h3>')
    print('                <ul>')
    print('<li><b>' + str(sortedSumProbs[1][1]) + '</b>: ' + str(round(sortedSumProbs[1][0] * 100)) + '%</li>')
    print('<li><b>' + str(sortedSumProbs[2][1]) + '</b>: ' + str(round(sortedSumProbs[2][0] * 100)) + '%</li>')
    print('<li><b>' + str(sortedSumProbs[3][1]) + '</b>: ' + str(round(sortedSumProbs[3][0] * 100)) + '%</li>')
    print('                </ul>')

    # Tulemused, mis avanevad valiku "Loe täpsemalt" korral
    print("""
        <button id="tapsemalt" onclick="document.getElementById('lisainfo').style.display='block'">Loe täpsemalt <i id="toggleArrow" class="fa fa-chevron-down" aria-hidden="true"></i></button>
                <div id="lisainfo" class="lisainfo">
    """)
    print('\n<p class="lisainfotekst"><b>Teksti üldine keerukus: <br />', sortedSurfProbs[0][1], '</b> (tõenäosus ',
          round(sortedSurfProbs[0][0] * 100),
          '%)<br />Arvesse on võetud teksti, sõnade ja lausete pikkus.</p>', sep='')

    print('\n<p class="lisainfotekst"><b>Morfoloogia ehk vormikasutus: <br />', sortedMorphProbs[0][1],
          '</b> (tõenäosus ', round(sortedMorphProbs[0][0] * 100),
          '%)<br />Arvesse on võetud sõnaliikide ja muutevormide osakaalud ning sõnade vormirohkus.</p>', sep='')

    try:
        print('\n<p class="lisainfotekst"><b>Sõnavara: <br />', sortedLexProbs[0][1], '</b> (tõenäosus ',
              round(sortedLexProbs[0][0] * 100),
              '%)<br />Arvesse on võetud sõnavaliku mitmekesisus ja ulatus (unikaalsete sõnade hulk, harvem esineva sõnavara osakaal), sõnavara tihedus (sisusõnade osakaal) ja nimisõnade abstraktsus.</p>',
              sep='')
    except:
        pass

    print('\n<p class="lisainfotekst"><b>Koondhinnang (', sortedSumProbs[0][1],
          ')</b> põhineb nii sõnavara-, morfoloogilistel kui ka üldise keerukuse tunnustel.</p>', sep='')

    print("""            </div>
                <hr>
            </div>""")


if __name__ == "__main__":
    print(arvuta("Juku tuli kooli ja oli üllatavalt rõõmsas tujus"))
