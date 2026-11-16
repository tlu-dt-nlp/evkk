import re

from py3langid.langid import LanguageIdentifier, MODEL_FILE

# norm_probs=True annab tulemuseks tõenäosuse vahemikus 0..1
_identifier = LanguageIdentifier.from_model_file(MODEL_FILE, norm_probs=True)

# 1-2 sõnalised tekstid (nt "Aitäh!") tuvastatakse sageli valesti (nt soome keeleks)
MIN_SONU = 3
# keele tuvastamiseks piisab teksti algusest, see piirab ka pika teksti töötlemise aega
MAX_TAHEMARKE = 2000
_sona = re.compile(r'[^\W\d_]+')


def tuvasta_keel(tekst):
    """
    Tuvastab teksti keele py3langid teegiga.
    Tagastab ISO 639-1 keelekoodi (nt 'et', 'ru', 'fi') ja selle tõenäosuse.
    Tühja või liiga lühikese teksti puhul tagastatakse keel None.
    """
    if not tekst or len(_sona.findall(tekst)) < MIN_SONU:
        return {"keel": None, "toenaosus": 0.0}

    keel, toenaosus = _identifier.classify(tekst[:MAX_TAHEMARKE])
    return {"keel": keel, "toenaosus": round(float(toenaosus), 4)}
