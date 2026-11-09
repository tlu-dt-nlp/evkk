import re
import requests

headers = {'Content-Type': 'application/json'}
data_text = 'text'

grammar_url = 'https://api.tartunlp.ai/grammar'
grammar_alt_url = 'http://grammar-worker-server:5400/grammarchecker'
speller_url = 'http://grammar-worker-server:5400/spellchecker'
test_grammar_url = 'https://api.tartunlp.ai/grammar/v2'

# The grammar model's vocabulary lacks typographic quotes, apostrophes and dashes, so it returns them as <unk>
# or drops them. They are sent as their ASCII counterparts (one char for one char, so correction offsets stay valid)
# and the original characters are restored in the corrections.
unknown_char_replacements = str.maketrans({
    '“': '"', '”': '"', '„': '"', '«': '"', '»': '"',
    '‘': "'", '’': "'", '‚': "'",
    '–': '-', '—': '-'
})
unknown_token = '<unk>'


def restore_unknown_chars(value, original):
    original_chars = {}
    for char in original:
        replacement = char.translate(unknown_char_replacements)
        if replacement in ('"', "'", '-'):
            original_chars.setdefault(replacement, []).append(char)

    restored = []
    for char in value:
        restored.append(original_chars[char].pop(0) if original_chars.get(char) else char)
    return ''.join(restored)


def restore_unknown_chars_in_corrections(response, text):
    corrections = []
    for correction in response['corrections']:
        span = correction['span']
        original = text[span['start']:span['end']]
        replacements = [{**replacement, 'value': restore_unknown_chars(replacement['value'] or '', original)}
                        for replacement in correction['replacements']]
        if any(unknown_token in replacement['value'] for replacement in replacements) \
            or (replacements and replacements[0]['value'] == original):
            continue
        corrections.append({**correction, 'span': {**span, 'value': original}, 'replacements': replacements})
    return {**response, 'corrections': corrections}


# TODO: add back grammar_url implementation when response parsing has been fixed
def fetch_grammar(text):
    data = {data_text: text.translate(unknown_char_replacements)}
    # response = requests.post(grammar_url, headers=headers, json=data)

    # if response.status_code == 200:
    #     return response.json()
    # else:
    response = requests.post(grammar_alt_url, headers=headers, json=data)
    if response.status_code == 200:
        return restore_unknown_chars_in_corrections(response.json(), text)
    else:
        return None


def fetch_speller(text):
    data = {data_text: text}
    response = requests.post(speller_url, headers=headers, json=data)

    if response.status_code == 200:
        return response.json()
    else:
        return None


def fetch_test_grammar(text, attempts=3):
    if attempts == 0:
        return None

    data = {data_text: text}
    response = requests.post(test_grammar_url, headers=headers, json=data)

    if response.status_code == 200:
        response_value = response.json()
        if "corrections" in response_value and response_value["corrections"]:
            corrected_text = response_value["corrections"][0].get("corrected", "")

            if re.search(r"[а-яА-ЯёЁ]", corrected_text):
                return fetch_test_grammar(text, attempts - 1)

        return response.json()
    else:
        return None
