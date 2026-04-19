from collections import Counter

EXCLUSION_WORDS = ['ja', 'mina', 'olema', 'ei', 'et']
PRON = 'PRON'


def get_repetitions(sentences, location):
    repetitive_words_list = []

    for index, sentence in enumerate(sentences):
        lemma_map = {}
        for word in location[index]:
            lemma = word['lemma']
            if lemma not in lemma_map:
                lemma_map[lemma] = []
            lemma_map[lemma].append(word)
        repetitive_words_list.append(lemma_map)

    return repetitive_words_list


def check_same_sentence_repetition(repetition_array):
    result = []
    for sentence_repetitions in repetition_array:
        for lemma, word_objs in sentence_repetitions.items():
            if len(word_objs) > 1:
                text_counts = Counter(w['text'] for w in word_objs)

                result.extend(
                    [
                        {**w, 'type': 'same-sentence-color'}
                        for w in word_objs
                        if lemma not in EXCLUSION_WORDS or text_counts[w['text']] > 1
                    ]
                )

    result.sort(key=lambda x: x['start'], reverse=True)
    return result


def process_same_words_for_next_sentence(array, prev_array):
    for value_obj in array:
        exists = any(existing_obj['start'] == value_obj['start'] for existing_obj in prev_array)
        if not exists and value_obj['lemma'] not in EXCLUSION_WORDS and value_obj['upos'] != PRON:
            prev_array.append({**value_obj, 'type': 'next-sentence-color'})


def check_both_sentence_repetition(sentences, location):
    repetition_array = get_repetitions(sentences, location)
    prev_array = check_same_sentence_repetition(repetition_array)
    for index, current_map in enumerate(repetition_array):
        if index < len(repetition_array) - 1:
            next_map = repetition_array[index + 1]
            for key, value1 in current_map.items():
                if key in next_map:
                    value2 = next_map[key]
                    process_same_words_for_next_sentence(value1, prev_array)
                    process_same_words_for_next_sentence(value2, prev_array)

    prev_array.sort(key=lambda x: x['start'], reverse=True)
    return prev_array
