#!/usr/bin/env python3
import argparse
import json
import requests
from pathlib import Path

API_URL = "http://localhost:9090/api/texts/keeletase-grammatika-oigekiri-analuus"
API_TIMEOUT = 120  # seconds
B2_OR_C1 = ['B2', 'C1']


def meets_cefr_criteria(levels):
    keerukus = levels["keerukus"]
    grammatika = levels["grammatika"]
    sonavara = levels["sonavara"]

    if keerukus != 'C1':
        return False

    if grammatika not in B2_OR_C1:
        return False

    if sonavara not in B2_OR_C1:
        return False

    return True


def get_api_response(text):
    try:
        response = requests.post(
            API_URL,
            json={'tekst': text},
            headers={'Content-Type': 'application/json'},
            timeout=API_TIMEOUT
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"  API viga: {e}")
        return None


def filter_texts(input_file, limit=None, skip=0):
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    texts = data.get('texts', [])
    filtered_texts = []
    total_processed = 0
    total_kept = 0

    if skip > 0:
        print(f"Vahele jäetakse esimesed {skip} teksti")
        texts = texts[skip:]

    for i, text_obj in enumerate(texts, 1):
        actual_index = i + skip
        print(f"[{actual_index}/{len(texts)}] teksti töötlemine... (siiani säilitatud {total_kept} teksti)")
        total_processed += 1

        full_text = text_obj.get('full_text', '')
        if not full_text:
            print("  ✗ Tühi tekst")
            continue

        api_response = get_api_response(full_text)
        if api_response is None:
            continue

        levels = api_response["keeletasemed"]
        print(
            f"  Tasemed: keerukus {levels["keerukus"]}, grammatika {levels["grammatika"]}, sõnavara {levels["sonavara"]}")
        print(f"  Õigekirjavigu leitud: {api_response["oigekirjavigu"]}")
        print(f"  Grammatikavigu leitud: {api_response["grammatikavigu"]}")

        if not meets_cefr_criteria(levels):
            print("  ✗ Tasemehinnang ei sobi")

        if api_response["oigekirjavigu"] > 0:
            print("  ✗ Leiti õigekirjavigu")

        if api_response["grammatikavigu"] > 0:
            print("  ! Leiti grammatikavigu")

        if not meets_cefr_criteria(levels) or api_response["oigekirjavigu"] > 0:
            continue

        text_obj['levels'] = levels
        text_obj['spellcheck_error_count'] = 0
        text_obj['grammarcheck_error_count'] = api_response["grammatikavigu"]
        filtered_texts.append(text_obj)
        total_kept += 1
        print("  ✓ Sobiv tekst")

        if limit and total_kept >= limit:
            print(f"Limiit saavutatud: {limit} sobivat teksti leitud")
            break

    return filtered_texts, total_processed, total_kept


def main():
    parser = argparse.ArgumentParser(
        description='Filtreerib tekste tasemehinnangu ja õigekirjavigade alusel. Sisendiks on JSON fail, väljundiks filtreeritud JSON fail'
    )
    parser.add_argument(
        'input_file',
        type=str,
        help='Analüüsitava JSON faili asukoht'
    )
    parser.add_argument(
        '--limit',
        type=int,
        default=None,
        help='Maksimaalne säilitatavate tekstide arv'
    )
    parser.add_argument(
        '--skip',
        type=int,
        default=0,
        help='Mitu teksti algusest vahele jätta'
    )

    args = parser.parse_args()
    input_path = Path(args.input_file)

    if not input_path.exists():
        print(f"Viga: Faili '{args.input_file}' ei leitud")
        return 1

    print(f"Analüüsitav fail: {args.input_file}")
    if args.limit:
        print(f"Limiit: {args.limit} sobivat teksti")

    output_path = input_path.with_stem(f"{input_path.stem}_filtered")
    filtered_texts, total_processed, total_kept = filter_texts(args.input_file, limit=args.limit, skip=args.skip)

    output_data = {'texts': filtered_texts}
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"Kokku töödeldud tekste: {total_processed}")
    print(f"Sobivate tekstide arv: {total_kept}")
    print(f"Tulemused salvestatud faili: {output_path}")

    return 0


if __name__ == '__main__':
    exit(main())
