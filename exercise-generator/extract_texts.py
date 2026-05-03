#!/usr/bin/env python3
import argparse
import json
import re
from pathlib import Path

EXCLUDED_TOPIC_KEYWORDS = [
    'gambling & casinos',
    'sex',
    'women',
    'religion',
    'law & justice'
]

EXCLUDED_GENRE_KEYWORDS = [
    'academic',
    'blogs',
    'forums',
    'e-commerce'
]


def should_exclude_doc(topic, genre):
    if not topic:
        return True

    for keyword in EXCLUDED_TOPIC_KEYWORDS:
        if keyword in topic.lower():
            return True

    if genre:
        for keyword in EXCLUDED_GENRE_KEYWORDS:
            if keyword in genre.lower():
                return True

    return False


def extract_texts_from_prevert(file_path, limit=None):
    texts = []
    total_docs_found = 0

    doc_start_pattern = re.compile(r'<doc\s+([^>]+)>')
    doc_end_pattern = re.compile(r'</doc>')
    attr_pattern = re.compile(r'(\w+)=(["\'])([^"\']*?)\2')
    tag_removal_pattern = re.compile(r'<s>|</s>|<p[^>]*>|</p>')

    chunk_size = 10 * 1024 * 1024  # 10MB
    buffer = ""
    in_doc = False
    current_doc_attrs = {}
    current_doc_content = []

    with open(file_path, 'r', encoding='utf-8') as f:
        while True:
            chunk = f.read(chunk_size)
            if not chunk:
                break

            buffer += chunk
            lines = buffer.split('\n')

            # Igaks juhuks säilitame viimase rea, sest võis jääda poolikuks
            buffer = lines[-1]
            lines = lines[:-1]

            for line in lines:
                doc_start_match = doc_start_pattern.search(line)
                if doc_start_match:
                    in_doc = True
                    current_doc_attrs = {}
                    current_doc_content = []

                    attrs_string = doc_start_match.group(1)
                    for attr_match in attr_pattern.finditer(attrs_string):
                        key = attr_match.group(1)
                        value = attr_match.group(3)
                        current_doc_attrs[key] = value

                    continue

                if doc_end_pattern.search(line):
                    if in_doc:
                        total_docs_found += 1
                        topic = current_doc_attrs.get('topic')
                        genre = current_doc_attrs.get('genre')

                        if not should_exclude_doc(topic, genre):
                            sentences = []

                            for content_line in current_doc_content:
                                clean_line = tag_removal_pattern.sub('', content_line).strip()
                                if clean_line:
                                    sentences.append(clean_line)

                            if sentences:
                                texts.append({
                                    'topic': topic,
                                    'full_text': ' '.join(sentences),
                                    'sentences': sentences
                                })

                                if limit and len(texts) >= limit:
                                    return texts, total_docs_found

                        in_doc = False
                        current_doc_attrs = {}
                        current_doc_content = []

                    continue

                if in_doc:
                    current_doc_content.append(line)

        if buffer and in_doc:
            current_doc_content.append(buffer)

    return texts, total_docs_found


def main():
    parser = argparse.ArgumentParser(
        description='Ekstraktib ja filtreerib tekste. Sisendiks on .prevert fail, väljundiks JSON fail'
    )
    parser.add_argument(
        'input_file',
        type=str,
        help='Analüüsitava .prevert faili asukoht'
    )
    parser.add_argument(
        '--limit',
        type=int,
        default=None,
        help='Maksimaalne ekstraktitavate tekstide arv'
    )

    args = parser.parse_args()
    input_path = Path(args.input_file)

    if not input_path.exists():
        print(f"Viga: Faili '{args.input_file}' ei leitud")
        return 1

    print(f"Analüüsitav fail: {args.input_file}")
    if args.limit:
        print(f"Limiit: {args.limit} teksti")

    output_path = input_path.with_suffix('.json')
    texts, total_docs = extract_texts_from_prevert(args.input_file, limit=args.limit)

    output_data = {'texts': texts}
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"Kokku leitud tekste: {total_docs}")
    print(f"Ekstraktitud tekstide arv: {len(texts)}")
    print(f"Tulemused salvestatud faili: {output_path}")

    return 0


if __name__ == '__main__':
    exit(main())
