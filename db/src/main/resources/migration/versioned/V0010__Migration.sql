-- ======================================================
-- HISTORY / AUDIT TABLES FOR TEXT-RELATED TABLES
-- Captures INSERT, UPDATE, DELETE on:
--   core.text, core.text_property,
--   core.text_added, core.text_property_added
-- ======================================================

-- -------------------------------------------------------
-- Generic audit trigger function
-- INSERT: saves NEW. DELETE: saves OLD.
-- UPDATE: saves two rows — OLD (UPDATE_BEFORE) and NEW (UPDATE_AFTER).
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION history.record_change() RETURNS trigger AS
$$
DECLARE
  hist_table text        := TG_TABLE_NAME || '_history';
  ts         timestamptz := transaction_timestamp();
  usr        text        := current_user;
BEGIN
  IF (TG_OP = 'INSERT') THEN
    EXECUTE format(
      'INSERT INTO history.%I (operation, changed_at, changed_by, row_data) VALUES ($1, $2, $3, $4)',
      hist_table
            ) USING 'INSERT', ts, usr, to_jsonb(NEW);

  ELSIF (TG_OP = 'UPDATE') THEN
    EXECUTE format(
      'INSERT INTO history.%I (operation, changed_at, changed_by, row_data) VALUES ($1, $2, $3, $4)',
      hist_table
            ) USING 'UPDATE_BEFORE', ts, usr, to_jsonb(OLD);
    EXECUTE format(
      'INSERT INTO history.%I (operation, changed_at, changed_by, row_data) VALUES ($1, $2, $3, $4)',
      hist_table
            ) USING 'UPDATE_AFTER', ts, usr, to_jsonb(NEW);

  ELSIF (TG_OP = 'DELETE') THEN
    EXECUTE format(
      'INSERT INTO history.%I (operation, changed_at, changed_by, row_data) VALUES ($1, $2, $3, $4)',
      hist_table
            ) USING 'DELETE', ts, usr, to_jsonb(OLD);
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- -------------------------------------------------------
-- history.text_history
-- -------------------------------------------------------
CREATE TABLE history.text_history
(
  history_id bigint GENERATED ALWAYS AS IDENTITY,
  operation  text        NOT NULL,
  changed_at timestamptz NOT NULL,
  changed_by text        NOT NULL,
  row_data   jsonb       NOT NULL,

  CONSTRAINT text_history_pkey PRIMARY KEY (history_id),
  CONSTRAINT text_history_chk_operation CHECK (operation IN ('INSERT', 'UPDATE_BEFORE', 'UPDATE_AFTER', 'DELETE'))
);

CREATE INDEX text_history_idx_row_id ON history.text_history ((row_data ->> 'id'));
CREATE INDEX text_history_idx_changed_at ON history.text_history (changed_at);

CREATE TRIGGER text_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE
  ON core.text
  FOR EACH ROW
EXECUTE FUNCTION history.record_change();

-- -------------------------------------------------------
-- history.text_property_history
-- -------------------------------------------------------
CREATE TABLE history.text_property_history
(
  history_id bigint GENERATED ALWAYS AS IDENTITY,
  operation  text        NOT NULL,
  changed_at timestamptz NOT NULL,
  changed_by text        NOT NULL,
  row_data   jsonb       NOT NULL,

  CONSTRAINT text_property_history_pkey PRIMARY KEY (history_id),
  CONSTRAINT text_property_history_chk_operation CHECK (operation IN ('INSERT', 'UPDATE_BEFORE', 'UPDATE_AFTER', 'DELETE'))
);

CREATE INDEX text_property_history_idx_text_id ON history.text_property_history ((row_data ->> 'text_id'));
CREATE INDEX text_property_history_idx_changed_at ON history.text_property_history (changed_at);

CREATE TRIGGER text_property_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE
  ON core.text_property
  FOR EACH ROW
EXECUTE FUNCTION history.record_change();

-- -------------------------------------------------------
-- history.text_added_history
-- -------------------------------------------------------
CREATE TABLE history.text_added_history
(
  history_id bigint GENERATED ALWAYS AS IDENTITY,
  operation  text        NOT NULL,
  changed_at timestamptz NOT NULL,
  changed_by text        NOT NULL,
  row_data   jsonb       NOT NULL,

  CONSTRAINT text_added_history_pkey PRIMARY KEY (history_id),
  CONSTRAINT text_added_history_chk_operation CHECK (operation IN ('INSERT', 'UPDATE_BEFORE', 'UPDATE_AFTER', 'DELETE'))
);

CREATE INDEX text_added_history_idx_row_id ON history.text_added_history ((row_data ->> 'id'));
CREATE INDEX text_added_history_idx_changed_at ON history.text_added_history (changed_at);

CREATE TRIGGER text_added_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE
  ON core.text_added
  FOR EACH ROW
EXECUTE FUNCTION history.record_change();

-- -------------------------------------------------------
-- history.text_property_added_history
-- -------------------------------------------------------
CREATE TABLE history.text_property_added_history
(
  history_id bigint GENERATED ALWAYS AS IDENTITY,
  operation  text        NOT NULL,
  changed_at timestamptz NOT NULL,
  changed_by text        NOT NULL,
  row_data   jsonb       NOT NULL,

  CONSTRAINT text_property_added_history_pkey PRIMARY KEY (history_id),
  CONSTRAINT text_property_added_history_chk_operation CHECK (operation IN ('INSERT', 'UPDATE_BEFORE', 'UPDATE_AFTER', 'DELETE'))
);

CREATE INDEX text_property_added_history_idx_text_id ON history.text_property_added_history ((row_data ->> 'text_id'));
CREATE INDEX text_property_added_history_idx_changed_at ON history.text_property_added_history (changed_at);

CREATE TRIGGER text_property_added_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE
  ON core.text_property_added
  FOR EACH ROW
EXECUTE FUNCTION history.record_change();

-- -------------------------------------------------------
-- Grants
-- api_user / task_scheduler_user need INSERT so the triggers
-- (which run as the calling user) can write audit rows.
-- SELECT is granted for direct DB inspection.
-- -------------------------------------------------------
GRANT USAGE ON SCHEMA history TO api_user;
GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA history TO api_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA history GRANT SELECT, INSERT ON TABLES TO api_user;

GRANT USAGE ON SCHEMA history TO task_scheduler_user;
GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA history TO task_scheduler_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA history GRANT SELECT, INSERT ON TABLES TO task_scheduler_user;
