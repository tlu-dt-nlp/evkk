CREATE TABLE core.exercise_generator_source
(
  id                       uuid DEFAULT uuid_generate_v4(),
  content                  text  NOT NULL,
  type                     text  NOT NULL,
  topic                    text,
  grammarcheck_error_count integer,
  levels                   jsonb,
  analysis                 jsonb NOT NULL,

  CONSTRAINT exercise_generator_source_pk PRIMARY KEY (id),
  CONSTRAINT exercise_generator_source_chk_type CHECK (type IN ('text', 'sentence')),
  CONSTRAINT exercise_generator_source_chk_grammarcheck_error_count CHECK ((type = 'text' AND grammarcheck_error_count IS NOT NULL) OR
                                                                           (type = 'sentence' AND grammarcheck_error_count IS NULL)),
  CONSTRAINT exercise_generator_source_chk_levels CHECK ((type = 'text' AND levels IS NOT NULL) OR
                                                         (type = 'sentence' AND levels IS NULL))
);

CREATE INDEX idx_exercise_generator_source_type ON core.exercise_generator_source (type);
CREATE INDEX idx_exercise_generator_source_topic ON core.exercise_generator_source (topic) WHERE topic IS NOT NULL;
CREATE INDEX idx_exercise_generator_source_analysis ON core.exercise_generator_source USING GIN (analysis);
CREATE INDEX idx_exercise_generator_source_grammar_errors ON core.exercise_generator_source (grammarcheck_error_count) WHERE type = 'text';


CREATE TABLE core.exercise_answer
(
  id            uuid DEFAULT uuid_generate_v4(),
  answers       jsonb NOT NULL,
  exercise_data jsonb NOT NULL,

  CONSTRAINT exercise_answer_pk PRIMARY KEY (id)
);

CALL core.attach_meta_trigger('core.exercise_answer');
