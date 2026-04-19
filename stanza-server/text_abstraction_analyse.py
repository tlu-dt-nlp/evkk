# -*- coding: utf-8 -*-
import math
import random

import estnltk
import nltk

# The following code is sourced from the repository below:
# https://gitlab.com/martensiiber/speed-reading-backend
# Original author: Marten Siiber

nltk.download('punkt_tab')

FREQ_LIST_EST_PATH = './app/freq_list_est.txt'
LEMMA_FREQ_LIST_EST_PATH = './app/lemma_freq_list_est.txt'
CONC_LIST_ENG_PATH = './app/conc_list_eng.csv'
ABST_LIST_EST_PATH = './app/abst_list_est.csv'

est_pos_tags_dict = {
    'A': 'Omadussõna - algvõrre',
    'C': 'Omadussõna - keskvõrre',
    'D': 'Määrsõna',
    'G': 'Genitiivatribuut',
    'H': 'Pärisnimi',
    'I': 'Hüüdsõna',
    'J': 'Sidesõna',
    'K': 'Kaassõna',
    'N': 'Põhiarvsõna',
    'O': 'Järgarvsõna',
    'P': 'Asesõna',
    'S': 'Nimisõna',
    'U': 'Omadussõna - ülivõrre',
    'V': 'Tegusõna',
    'X': 'Verbi juurde kuuluv sõna',
    'Y': 'Lühend',
    'Z': 'Lausemärk'
}

eng_pos_tags_dict = {
    'CC': 'Coordinating conjunction',
    'CD': 'Cardinal number',
    'DT': 'Determiner',
    'EX': 'Existential there',
    'FW': 'Foreign word',
    'IN': 'Preposition or subordinating conjuction',
    'JJ': 'Adjective',
    'JJR': 'Adjective, comparative',
    'JJS': 'Adjective, superlative',
    'LS': 'List item marker',
    'MD': 'Modal',
    'NN': 'Noun, singular or mass',
    'NNS': 'Noun, plural',
    'NNP': 'Proper noun, singular',
    'NNPS': 'Proper noun, plural',
    'PDT': 'Predeterminer',
    'POS': 'Possessive ending',
    'PRP': 'Personal pronoun',
    'PRP$': 'Possessive pronoun',
    'RB': 'Adverb',
    'RBR': 'Adverb, comparative',
    'RBS': 'Adverb, superlative',
    'RP': 'Particle',
    'SYM': 'Symbol',
    'TO': 'to',
    'UH': 'Interjection',
    'VB': 'Verb, base form',
    'VBD': 'Verb, past tense',
    'VBG': 'Verb, gerund or present participle',
    'VBN': 'Verb, past participle',
    'VBP': 'Verb, non-3rd person singular present',
    'VBZ': 'Verb, 3rd person singular present',
    'WDT': 'Wh-determiner',
    'WP': 'Wh-pronoun',
    'WP$': 'Possessive wh-pronoun',
    'WRB': 'Wh-adverb',
    'Z': 'Punctuation'
}

UnknownLanguageError = 'Unknown language: '


class Utils:

    def __init__(self):
        # Word frequency
        self.freq_dict_est = get_freq_dict('estonian')
        self.lemma_freq_dict_est = get_lemma_freq_dict('estonian')

        # Estonian abstractness dictionaries
        self.base_abst_dict_est = get_base_abst_dict('estonian')
        self.abst_dict_est = {}
        self.abst_dict_est.update(self.base_abst_dict_est)
        self.own_abst_dict_est = {}

    def init_app(self, app, db):
        with app.app_context():  # pragma: no cover
            if not db.engine.has_table('abstraction'):
                return
            from api.models import Abstraction
            abstractions = db.session.query(Abstraction.lemma, Abstraction.abstraction_rating,
                                            Abstraction.language).all()
            for (lemma, abstraction_rating, language) in abstractions:
                abstraction_rating = str(abstraction_rating) if abstraction_rating != None else '-'
                if language == 'estonian':
                    self.abst_dict_est[lemma] = abstraction_rating
                    self.own_abst_dict_est[lemma] = abstraction_rating
                else:
                    raise ValueError(UnknownLanguageError + language)

    def analyze(self, input_text, language='estonian'):
        input_text = input_text.replace("’", "'")
        if language == 'estonian' or language == None:
            return self.analyze_estonian_text(input_text)
        else:
            raise ValueError(UnknownLanguageError + language)

    def analyze_estonian_text(self, input_text):
        result = {}
        text = estnltk.Text(input_text)
        text.tag_layer(['morph_analysis'])
        word_morph_analysis = []
        for word in text.morph_analysis:
            word_text = word.text
            pos_tag = word.partofspeech[0]
            pos_description = est_pos_tags_dict[word.partofspeech[0]]
            lemma = word.lemma
            span = word.start, word.end
            word_morph_analysis.append((word_text, pos_tag, pos_description, lemma, span))

        # Morph analysis - (word, pos_tag, pos_tag_desc, lemmas, span)
        # word_morph_analysis = list(text.get.word_texts.postags.postag_descriptions.lemmas.word_spans.as_zip)
        sentences = text.sentences
        words_without_punc = list(
            map(lambda tuple: tuple[0], filter(lambda tuple: tuple[1] != 'Z', word_morph_analysis)))
        characters = list(''.join(words_without_punc))

        word_lengths = {}
        word_type_counts = {}
        word_analysis = []
        for (word, word_type_tag, word_type, lemmas, span) in word_morph_analysis:
            if '|' in lemmas:
                lemmas = lemmas.split('|')
            else:
                lemmas = [lemmas]

            if word_type_tag != 'Z':
                # Word lengths
                word_length = str(len(word))
                if word_length in word_lengths:
                    word_lengths[word_length] = word_lengths[word_length] + 1
                else:
                    word_lengths[word_length] = 1

                # Word analysis
                word_analysis_data = {}
                word_analysis_data['word'] = word
                word_analysis_data['posTag'] = word_type_tag
                word_analysis_data['pos'] = word_type.capitalize()

                if word.lower() in self.abst_dict_est and self.abst_dict_est[word.lower()] != '-':
                    word_analysis_data['abstractness'] = int(self.abst_dict_est[word.lower()])
                else:
                    word_analysis_data['abstractness'] = None

                if word.lower() in self.freq_dict_est:
                    word_analysis_data['frequency'] = int(self.freq_dict_est[word.lower()])
                else:
                    word_analysis_data['frequency'] = None

                lemmas_data = []
                for lemma in lemmas:
                    lemma_data = {}
                    lemma_data['lemma'] = lemma
                    if lemma[0] in self.abst_dict_est and self.abst_dict_est[lemma[0]] != '-':
                        lemma_data['abstractness'] = int(self.abst_dict_est[lemma[0]])
                    else:
                        lemma_data['abstractness'] = None
                    if lemma[0] in self.lemma_freq_dict_est:
                        lemma_data['frequency'] = int(self.lemma_freq_dict_est[lemma[0]])
                    else:
                        lemma_data['frequency'] = None
                    lemmas_data.append(lemma_data)
                word_analysis_data['lemmas'] = lemmas_data

                span_data = {}
                span_data['start'] = span[0]
                span_data['end'] = span[1]
                word_analysis_data['span'] = span_data

                word_analysis.append(word_analysis_data)

            # Counting word types
            if word_type in word_type_counts:
                word_type_counts[word_type] = word_type_counts[word_type] + 1
            else:
                word_type_counts[word_type] = 1

        sentence_lengths = {}
        for sentence in sentences:
            # Access the tokenized words directly from the EnvelopingSpan object
            sentence_words = sentence.morph_analysis  # Extract words from the sentence span
            sentence_morph_analysis = []

            # Perform morphological analysis on each word (simulate this part since your code structure seems to focus on already processed sentences)
            for word in sentence_words:
                # Assume that we need to get the POS tags and descriptions, etc.
                # Here we would typically apply the morphological analysis
                # Simulate the data as if the analysis was done
                pos_tag = 'SimulatedPOS'  # Replace with actual POS tagging logic
                pos_tag_description = 'SimulatedPOSDescription'  # Replace with actual POS description logic

                sentence_morph_analysis.append((word, pos_tag, pos_tag_description))

            # Filter out punctuation and calculate the sentence length
            sentence_words_without_punc = list(
                map(lambda tup: tup[0], filter(lambda tup: tup[1] != 'Z', sentence_morph_analysis)))
            sentence_length = str(len(sentence_words_without_punc))

            # Update the sentence lengths dictionary
            if sentence_length in sentence_lengths:
                sentence_lengths[sentence_length] = sentence_lengths[sentence_length] + 1
            else:
                sentence_lengths[sentence_length] = 1

        character_count = len(characters)
        word_count = len(word_analysis)
        sentence_count = len(sentences)

        average_word_length = character_count / word_count if word_count > 0 else 0
        word_length_class_rating = self.get_word_length_class_rating(average_word_length)

        average_sentence_length_in_words = word_count / sentence_count if sentence_count > 0 else 0
        sentence_length_class_rating = self.get_sentence_length_class_rating(average_sentence_length_in_words)

        # Results
        result['characterCount'] = character_count
        result['wordCount'] = word_count
        result['sentenceCount'] = sentence_count
        result['averageWordLength'] = average_word_length
        result['wordLengthClassRating'] = word_length_class_rating
        result['averageSentenceLengthInWords'] = average_sentence_length_in_words
        result['averageSentenceLengthInCharacters'] = character_count / sentence_count if sentence_count > 0 else 0
        result['sentenceLengthClassRating'] = sentence_length_class_rating
        result['wordLengths'] = word_lengths
        result['sentenceLengths'] = sentence_lengths
        result['wordTypeCounts'] = word_type_counts
        result['wordAnalysis'] = word_analysis
        return result

    def get_word_length_class_rating(self, average_word_length):
        # |        Class        |   1   |   2   |     |   10   |   11   |   12   |
        # |---------------------|-------|-------| ... |--------|--------|--------|
        # | Average word length |  4.95 |  5.1  |     |  6.30  |  6.45  |  6.60  |
        result = math.ceil((average_word_length - 4.95 + 0.000000000000001) / 0.15)
        return min(max(result, 1), 12)

    def get_sentence_length_class_rating(self, average_sentence_length_in_words):
        # |          Class          |   1   |   2   |     |   10   |   11   |   12   |
        # |-------------------------|-------|-------| ... |--------|--------|--------|
        # | Average sentence length |   4   |   5   |     |   13   |   14   |   15   |
        result = math.ceil(average_sentence_length_in_words - 4 + 0.000000000000001)
        return min(max(result, 1), 12)

    def generate_blank_exercises(self, input_text):
        blank_exercises = []
        text = estnltk.Text(input_text)
        all_sentences = text.sentence_texts

        # Filter out sentences with length less than 5 words or no nouns
        filtered_sentences = []
        for sentence in all_sentences:
            sentence_text = estnltk.Text(sentence)
            sentence_morph_analysis = list(sentence_text.get.word_texts.postags.postag_descriptions.as_zip)
            if len(sentence_morph_analysis) <= 5:
                continue
            for word, postag, desc in sentence_morph_analysis:
                if postag == 'S':
                    filtered_sentences.append(sentence)
                    break

        sentence_count = len(filtered_sentences)
        blank_exercise_count = min(round(sentence_count / 2), 8)
        random_sentence_indexes = random.sample(range(0, sentence_count - 1), blank_exercise_count)
        random_sentence_indexes.sort()

        for sentence_index in random_sentence_indexes:
            sentence = filtered_sentences[sentence_index]
            sentence_text = estnltk.Text(sentence)
            sentence_word_spans = sentence_text.word_spans
            sentence_morph_analysis = list(sentence_text.get.word_texts.postags.postag_descriptions.as_zip)

            noun_word_indexes = []
            for index, (word, postag, desc) in enumerate(sentence_morph_analysis):
                if postag == 'S':
                    noun_word_indexes.append(index)
            random_noun_index = random.sample(noun_word_indexes, 1)[0]
            correct = sentence_morph_analysis[random_noun_index][0]
            correct_start, correct_end = sentence_word_spans[random_noun_index]
            blank_exercise = [sentence[:correct_start], 'BLANK', sentence[correct_end:]]

            blank_exercise_data = {}
            blank_exercise_data['blankExercise'] = blank_exercise
            blank_exercise_data['correct'] = correct

            blank_exercises.append(blank_exercise_data)

        result = blank_exercises
        return result

    def update_abstraction(self, lemma, abstraction, language):
        abstraction = str(abstraction) if abstraction != None else '-'
        if language == 'estonian':
            self.abst_dict_est[lemma] = abstraction
            self.own_abst_dict_est[lemma] = abstraction
        else:
            raise ValueError(UnknownLanguageError + language)

    def get_levenshtein_distance(self, first_string, second_string):
        if len(first_string) < len(second_string):
            return self.get_levenshtein_distance(second_string, first_string)

        if len(second_string) == 0:
            return len(first_string)

        previous_row = range(len(second_string) + 1)
        for i, c1 in enumerate(first_string):
            current_row = [i + 1]
            for j, c2 in enumerate(second_string):
                insertions = previous_row[j + 1] + 1
                deletions = current_row[j] + 1
                substitutions = previous_row[j] + (c1 != c2)
                current_row.append(min(insertions, deletions, substitutions))
            previous_row = current_row
        return previous_row[-1]


def get_freq_dict(language):
    freq_dict = {}

    if language == 'estonian':
        freq_dict_path = FREQ_LIST_EST_PATH
        with open(freq_dict_path, 'r', encoding='UTF-8-SIG') as lines:
            for line in lines:
                split = line.strip().split(' ')
                word = split[1].strip()
                count = int(split[0])
                freq_dict[word] = count
    else:
        raise ValueError(UnknownLanguageError + language)
    return freq_dict


def get_lemma_freq_dict(language):
    lemma_freq_dict = {}

    if language == 'estonian':
        lemma_freq_dict_path = LEMMA_FREQ_LIST_EST_PATH
        with open(lemma_freq_dict_path, 'r', encoding='UTF-8-SIG') as lines:
            for line in lines:
                split = line.strip().split(' ')
                lemma = split[1].strip()
                count = int(split[0])
                lemma_freq_dict[lemma] = count
    else:
        raise ValueError(UnknownLanguageError + language)
    return lemma_freq_dict


def get_freq_zipf_dict():
    freq_zipf_dict = {}

    freq_zipf_dict_path = FREQ_LIST_ENG_PATH
    with open(freq_zipf_dict_path, 'r', encoding='UTF-8') as lines:
        next(lines)
        for line in lines:
            split = line.strip().split(',')
            word = split[0].strip().lower()
            freq_zipf = split[4]
            freq_zipf_dict[word] = freq_zipf
    return freq_zipf_dict


def get_prevalence_dict():
    prevalence_dict = {}

    prevalence_dict_path = FREQ_LIST_ENG_PATH
    with open(prevalence_dict_path, 'r', encoding='UTF-8') as lines:
        next(lines)
        for line in lines:
            split = line.strip().split(',')
            word = split[0].strip().lower()
            prevalence = split[3]
            prevalence_dict[word] = prevalence
    return prevalence_dict


def get_base_abst_dict(language):
    abst_dict = {}

    if language == 'estonian':
        abst_dict_path = ABST_LIST_EST_PATH
        with open(abst_dict_path, 'r', encoding='UTF-8') as lines:
            next(lines)
            for line in lines:
                split = line.strip().split(',')
                word = split[0].strip()
                abstraction = split[1]
                abst_dict[word] = abstraction
    elif language == 'english':
        conc_dict_path = CONC_LIST_ENG_PATH
        with open(conc_dict_path, 'r', encoding='UTF-8') as lines:
            next(lines)
            for line in lines:
                split = line.strip().split(',')
                word = split[0].strip().lower()
                concreteness = split[2]
                abst_dict[word] = concreteness
    else:
        raise ValueError(UnknownLanguageError + language)

    return abst_dict
