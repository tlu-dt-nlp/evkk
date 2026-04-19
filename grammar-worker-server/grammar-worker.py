from dataclasses import asdict
from pprint import pprint


def run_multiple_correction_model(source_text):
    from gec_worker import GEC, Speller, MultiCorrector, read_gec_config, read_speller_config
    from gec_worker.dataclasses import Request

    # Load grammatical error correction model, use models/GEC-noisy-nmt-ut.yaml to use the other model
    gec_config = read_gec_config('models/GEC-nelb-1.3b.yaml')
    gec = GEC(gec_config)

    # Load spelling model
    speller_config = read_speller_config("models/spell_etnc19_reference_corpus_6000000_web_2019_600000.yaml")
    speller = Speller(speller_config)

    # Make model list and add models
    multi_corrector = MultiCorrector()
    multi_corrector.add_corrector(speller)
    multi_corrector.add_corrector(gec)

    # Input data and get result
    request = Request(text=source_text, language='et')
    response = multi_corrector.process_request(request)
    pprint(asdict(response))
    return response.corrected_text
