#!/usr/bin/env python3
import argparse
import json
from pathlib import Path


def escape_sql_string(value):
    return "'" + str(value).replace("'", "''") + "'"


def escape_jsonb(obj):
    json_str = json.dumps(obj, ensure_ascii=False, separators=(',', ':'))
    json_str = json_str.replace("'", "''")
    return "'" + json_str + "'::jsonb"


def generate_text_insert(text_obj):
    content = escape_sql_string(text_obj['full_text'])
    type_val = escape_sql_string('text')
    topic = escape_sql_string(text_obj.get('topic'))
    grammar_errors = text_obj['grammarcheck_error_count']
    levels = escape_jsonb(text_obj['levels'])
    analysis = escape_jsonb(text_obj['analysis'])

    return f"""INSERT INTO core.exercise_generator_source (content, type, topic, grammarcheck_error_count, levels, analysis)
               VALUES ({content}, {type_val}, {topic}, {grammar_errors}, {levels}, {analysis});"""


def generate_sentence_insert(sentence_obj, topic):
    content = escape_sql_string(sentence_obj['text'])
    type_val = escape_sql_string('sentence')
    topic_val = escape_sql_string(topic)
    analysis = escape_jsonb(sentence_obj)

    return f"""INSERT INTO core.exercise_generator_source (content, type, topic, analysis)
               VALUES ({content}, {type_val}, {topic_val}, {analysis});"""


def generate_inserts(input_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    inserts = []
    text_count = 0
    sentence_count = 0

    for text_obj in data.get('texts', []):
        inserts.append(generate_text_insert(text_obj))
        text_count += 1

        analysis = text_obj.get('analysis', {})
        sentences = analysis.get('sentences', [])
        topic = text_obj.get('topic')

        for sentence in sentences:
            inserts.append(generate_sentence_insert(sentence, topic))
            sentence_count += 1

    return inserts, text_count, sentence_count


def main():
    parser = argparse.ArgumentParser(
        description='Genereerib SQL INSERT lauseid. Sisendiks JSON fail, väljundiks SQL fail'
    )
    parser.add_argument(
        'input_file',
        type=str,
        help='Analüüsitava JSON faili asukoht'
    )

    args = parser.parse_args()
    input_path = Path(args.input_file)

    if not input_path.exists():
        print(f"Viga: Faili '{args.input_file}' ei leitud")
        return 1

    print(f"Töödeldav fail: {args.input_file}")

    output_path = input_path.with_stem(f"{input_path.stem}_inserts").with_suffix('.sql')
    inserts, text_count, sentence_count = generate_inserts(args.input_file)

    with open(output_path, 'w', encoding='utf-8') as f:
        for insert in inserts:
            f.write(insert)
            f.write('\n\n')

    print(f"Edukalt genereeritud {len(inserts)} INSERT lauset, millest:")
    print(f"  - Terviktekste: {text_count}")
    print(f"  - Üksikuid lauseid: {sentence_count}")
    print(f"Tulemused salvestatud faili: {output_path}")


if __name__ == '__main__':
    main()
