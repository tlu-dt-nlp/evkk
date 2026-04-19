import json
from dataclasses import asdict

from flask import Flask, Response, request
from gec_worker import Speller, read_speller_config, GEC, read_gec_config
from gec_worker.dataclasses import Request

app = Flask(__name__)

# Load spelling model
speller_config = read_speller_config("models/spell_etnc19_reference_corpus_6000000_web_2019_600000.yaml")
speller = Speller(speller_config)

grammar_config = read_gec_config('models/GEC-nelb-1.3b.yaml')
grammar = GEC(grammar_config)

methods = ['POST']
language = 'et'
json_request_text = 'text'


@app.route('/spellchecker', methods=methods)
def spell_checker():
    text_request = Request(text=request.json[json_request_text], language=language)
    corrected_text = speller.process_request(text_request)
    return parse_and_return(corrected_text)


@app.route('/grammarchecker', methods=methods)
def grammar_checker():
    text_request = Request(text=request.json[json_request_text], language=language)
    corrected_text = grammar.process_request(text_request)
    return parse_and_return(corrected_text)


def parse_and_return(corrected_text):
    json_str = json.dumps(asdict(corrected_text))
    return Response(json_str, mimetype='application/json')


app.run(host="0.0.0.0", threaded=True, port=5400)
