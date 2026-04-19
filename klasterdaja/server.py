import os
import random
import re
import subprocess
from estnltk import Text
from estnltk.syntax.parsers import VISLCG3Parser
from flask import Flask
from flask import Response
from flask import request

app = Flask(__name__)
parser = VISLCG3Parser()

mimetype = "text/plain"

# Although regex expressions are compiled and cached during usage, could still do before that (Improves performance a little bit)
UNNECESSARY_MARKUP_REGEXP = re.compile('("\s)(L(\w+))')
VERB_AND_ADPOSITION_MARKUP_REGEXP = re.compile(
    '(<cap>|<nom>|<gen>|<part>|<el>|<term>|<kom>|<FinV>|<partic>|<nud>|<tud>|<tav>|<v>|<mata>|<mine>|<Intr>|<NGP-P>|<NGP>|<Part-P>|<Part>|<InfP>|<Ill>|<In>|<El>|<All>|<Ad>|<Abl>|<Tr>|<Ter>|<Es>|<Kom>)(\s)')


@app.route('/parsi', methods=['POST'])
def t2():
    return Response(parsi(request.json["tekst"], False, True), mimetype=mimetype)


@app.route('/klasterda', methods=['POST'])
def t3():
    if request.json.get("parsitud", "puudub") == "jah":
        return Response(klasterda(request.json["tekst"], request.json["parameetrid"]), mimetype=mimetype)
    else:
        return Response(
            klasterda(parsi(request.json["tekst"], request.json["eemalda_valikulised"]), request.json["parameetrid"]),
            mimetype=mimetype)


def remove_unnecessary_markup(value, remove_optional_markup):
    value_without_unnecessary_markup = re.sub(UNNECESSARY_MARKUP_REGEXP, r'\1<redacted>', value)
    if not remove_optional_markup:
        return value_without_unnecessary_markup
    return re.sub(VERB_AND_ADPOSITION_MARKUP_REGEXP, '', value_without_unnecessary_markup)


def parsi(tekst, eemalda_valikulised=False, eemalda_ainult_redacted=False):
    input_text = Text(tekst)
    initial_output = parser.parse_text(input_text, return_type='vislcg3')
    if eemalda_ainult_redacted:
        simplified_output = [re.sub(r'\s*<redacted>\s*', ' ', s)
                             for s in initial_output]
    else:
        simplified_output = [
            s if s.find("#") == -1 else remove_unnecessary_markup(s[0: s.find("#")], eemalda_valikulised)
            for s in initial_output]
    return "\n".join(simplified_output)


def klasterda(parsitud_tekst, parameetrid):
    fnimi = "fail" + str(random.randrange(1, 10000))
    f1 = open(fnimi + ".txt", "w", encoding="utf-8")
    f1.write(parsitud_tekst)
    f1.close()
    process = subprocess.Popen(
        "java -jar klastrileidja.jar -e -f " + fnimi + ".txt " + parameetrid, shell=True, stderr=subprocess.PIPE,
        stdout=subprocess.PIPE)
    _, _ = process.communicate()
    vastus = open(fnimi + ".csv").read()
    os.remove(fnimi + ".txt")
    os.remove(fnimi + ".csv")
    return vastus


app.run(host="0.0.0.0", port=5100)
