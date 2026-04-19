-- Add user role

INSERT INTO core.role (name)
VALUES ('USER');

-- Drop old tables

DROP TABLE core.text_schema_property;
DROP TABLE core.text_schema;
DROP TABLE core.text_property_default_value;
DROP TABLE core.text_official_property;
DROP TABLE core.testing_texts;
DROP TABLE core.token;
DROP TABLE core.session_token;
DROP TABLE core.group_users;
DROP TABLE core.group;
DROP TABLE core.role_permission;
DROP TABLE core.user_file;
DROP TABLE core.file;
DROP TABLE core.user;

-- Create new tables

CREATE TABLE core.user
(
  user_id        uuid DEFAULT uuid_generate_v4(),
  first_name     text                             NOT NULL,
  middle_name text NULL,
  last_name      text                             NOT NULL,
  email_address  citext                           NOT NULL,
  id_code        text                             NOT NULL,
  id_code_prefix text                             NOT NULL,
  role_name      text REFERENCES core.role (name) NOT NULL,
  ui_locales     text NULL,

  CONSTRAINT user_pk PRIMARY KEY (user_id),
  CONSTRAINT user_uq_id_code UNIQUE (id_code)
);

CALL core.attach_meta_trigger('core.user');
COMMENT ON TABLE core.user IS 'ELLE user accounts';


CREATE TABLE core.refresh_token
(
  token_id   uuid DEFAULT uuid_generate_v4(),
  token      text                                NOT NULL,
  expires_at timestamptz                         NOT NULL,
  user_id    UUID REFERENCES core.user (user_id) NOT NULL,

  CONSTRAINT refresh_token_pk PRIMARY KEY (token_id),
  CONSTRAINT refresh_token_uq_user_id UNIQUE (user_id)
);

CALL core.attach_meta_trigger('core.refresh_token');
COMMENT ON TABLE core.refresh_token IS 'Refresh tokens for ELLE user accounts';
GRANT DELETE ON TABLE core.refresh_token TO api_user;


CREATE TABLE core.access_token
(
  token_id   uuid DEFAULT uuid_generate_v4(),
  token      text                                NOT NULL,
  expires_at timestamptz                         NOT NULL,
  user_id    UUID REFERENCES core.user (user_id) NOT NULL,

  CONSTRAINT access_token_pk PRIMARY KEY (token_id),
  CONSTRAINT access_token_uq_user_id UNIQUE (user_id)
);

CALL core.attach_meta_trigger('core.access_token');
COMMENT ON TABLE core.access_token IS 'Access tokens for ELLE user accounts';
GRANT DELETE ON TABLE core.access_token TO api_user;
