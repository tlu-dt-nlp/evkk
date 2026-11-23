CREATE TABLE core.notice
(
  id             uuid             DEFAULT uuid_generate_v4(),
  content_et     text    NOT NULL,
  content_en     text    NOT NULL,
  severity       text    NOT NULL,
  pages          text[]  NOT NULL DEFAULT '{}',
  is_dismissible boolean NOT NULL DEFAULT false,
  valid_from     timestamptz,
  valid_to       timestamptz,
  sort_order     integer NOT NULL,

  CONSTRAINT notice_pkey PRIMARY KEY (id),
  CONSTRAINT notice_uq_sort_order UNIQUE (sort_order) DEFERRABLE INITIALLY DEFERRED,
  CONSTRAINT notice_chk_severity CHECK (severity IN ('ERROR', 'WARNING', 'INFO', 'SUCCESS')),
  CONSTRAINT notice_chk_pages CHECK (array_position(pages, NULL) IS NULL),
  CONSTRAINT notice_chk_content_et CHECK (content_et ~ '\S'),
  CONSTRAINT notice_chk_content_en CHECK (content_en ~ '\S'),
  CONSTRAINT notice_chk_valid_to_requires_valid_from CHECK (valid_to IS NULL OR valid_from IS NOT NULL),
  CONSTRAINT notice_chk_valid_range CHECK (valid_to IS NULL OR valid_to > valid_from)
);

CALL core.attach_meta_trigger('core.notice');

GRANT DELETE ON TABLE core.notice TO api_user;
