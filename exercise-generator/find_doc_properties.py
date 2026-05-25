#!/usr/bin/env python3
import argparse
import re
from collections import defaultdict
from pathlib import Path

IGNORED_KEYS = [
    'ISBN', 'original_author', 'original_title', 'original_year', 'publisher', 'title', 'translator', 'year',
    'url', 'lang_scores', 'ip', 'length', 'crawl_date', 'lang_diff', 'enc_meta', 'enc_chared', 'id', 'topic_prob',
    'genre_prob', 'modified_date', 'chars', 'paragraphs', 'wiki_translations', 'wiki_categories', 'crawled_date',
    'dmoz_categories', 'dmoz_keywords', 'feed_fetched', 'feed_hostname', 'feed_longitude', 'feed_longitude2',
    'feed_latitude', 'feed_latitude2', 'feed_tags', 'timestamp_date', 'feed_uri', 'feed_title', 'timestamp_month',
    'timestamp_quarter', 'timestamp_year', 'web_domain', 'article', 'author', 'bottom', 'heading', 'filename',
    'newspaperNumber', 'subheading', 'unk'
]


def parse_prevert_file(file_path):
    attributes = defaultdict(set)

    doc_pattern = re.compile(r'<doc\s+([^>]+)>')
    attr_pattern = re.compile(r'(\w+)=(["\'])([^"\']*?)\2')

    chunk_size = 10 * 1024 * 1024  # 10MB
    buffer = ""

    # 10MB chunkidena töötlus on antud juhul optimaalne lahendus.
    # Kuna mõned failid on 6-8 GB, siis kogu faili korraga sisse lugemine kasutab väga palju mälu ning crashib, rea kaupa faili lugemine aga võtab väga palju aega.
    with open(file_path, 'r', encoding='utf-8') as f:
        while True:
            chunk = f.read(chunk_size)
            if not chunk:
                break

            buffer += chunk

            for match in doc_pattern.finditer(buffer):
                attributes_string = match.group(1)

                for attribute_match in attr_pattern.finditer(attributes_string):
                    key = attribute_match.group(1)
                    value = attribute_match.group(3)
                    attributes[key].add(value)

            # Igaks juhuks säilitame bufferi lõpus viimase pooliku rea, juhuks kui <doc> tag peaks jääma poolikuks
            last_newline = buffer.rfind('\n')
            if last_newline != -1 and len(buffer) - last_newline < 10000:
                buffer = buffer[last_newline + 1:]
            else:
                buffer = ""

    return attributes


def write_attributes_to_file(attributes, output_file):
    if not attributes:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("Atribuute ei leitud.\n")
        return

    with open(output_file, 'w', encoding='utf-8') as f:
        for key in sorted(attributes.keys()):
            if key in IGNORED_KEYS:
                continue

            values = sorted(attributes[key])
            f.write(f"\n{key}:\n")
            f.write(f"  Kokku unikaalseid väärtusi: {len(values)}\n")
            for value in values:
                f.write(f"    - {value}\n")


def main():
    parser = argparse.ArgumentParser(
        description='Unikaalsete atribuutide ja nende väärtuste koondamine <doc> XML tagidest. Sisendiks on .prevert fail'
    )
    parser.add_argument(
        'input_file',
        type=str,
        help='Analüüsitava .prevert faili asukoht'
    )

    args = parser.parse_args()
    input_path = Path(args.input_file)

    if not input_path.exists():
        print(f"Viga: Faili '{args.input_file}' ei leitud.")
        return 1

    print(f"Analüüsitav fail: {args.input_file}")
    output_path = input_path.with_suffix('.txt')

    attributes = parse_prevert_file(args.input_file)
    write_attributes_to_file(attributes, output_path)

    print(f"\nTulemused salvestatud faili: {output_path}")
    return 0


if __name__ == '__main__':
    exit(main())
