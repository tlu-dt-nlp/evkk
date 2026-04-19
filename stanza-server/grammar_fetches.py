import re
import requests

headers = {'Content-Type': 'application/json'}
data_text = 'text'

grammar_url = 'https://api.tartunlp.ai/grammar'
grammar_alt_url = 'http://grammar-worker-server:5400/grammarchecker'
speller_url = 'http://grammar-worker-server:5400/spellchecker'
test_grammar_url = 'https://api.tartunlp.ai/grammar/v2'


# TODO: add back grammar_url implementation when response parsing has been fixed
def fetch_grammar(text):
    data = {data_text: text}
    # response = requests.post(grammar_url, headers=headers, json=data)

    # if response.status_code == 200:
    #     return response.json()
    # else:
    response = requests.post(grammar_alt_url, headers=headers, json=data)
    if response.status_code == 200:
        return response.json()
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
