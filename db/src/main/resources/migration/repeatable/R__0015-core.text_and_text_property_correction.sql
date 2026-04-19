-- delete duplicates

DO
$$
  DECLARE
    ids_to_delete UUID[];
  BEGIN
    WITH duplicate_texts AS (SELECT hash, array_agg(id) AS text_ids, count(*) AS duplicate_count
                             FROM core.text
                             GROUP BY hash
                             HAVING count(*) > 1),
         text_properties AS (SELECT dt.hash, dt.text_ids, tp.text_id, tp.property_name, tp.property_value
                             FROM duplicate_texts dt
                                    JOIN core.text_property tp ON tp.text_id = ANY (dt.text_ids)
                             WHERE tp.property_name = 'aeg'),
         aeg_properties AS (SELECT hash, text_id, property_value AS aeg_value
                            FROM text_properties
                            WHERE property_name = 'aeg'),
         property_comparison AS (SELECT a1.hash,
                                        a1.text_id   AS text_id_1,
                                        a2.text_id   AS text_id_2,
                                        a1.aeg_value AS aeg_value_1,
                                        a2.aeg_value AS aeg_value_2
                                 FROM aeg_properties a1
                                        JOIN aeg_properties a2
                                             ON a1.hash = a2.hash
                                               AND a1.text_id <> a2.text_id
                                 WHERE TO_TIMESTAMP(a1.aeg_value, 'DD-MM-YYYY HH24:MI') >
                                       TO_TIMESTAMP(a2.aeg_value, 'DD-MM-YYYY HH24:MI'))
    SELECT array_agg(text_id_1)
    INTO ids_to_delete
    FROM property_comparison;

    DELETE FROM core.text_property WHERE text_id = ANY (ids_to_delete);
    DELETE FROM core.text WHERE id = ANY (ids_to_delete);
  END
$$;


DELETE
FROM core.text_property
WHERE text_id in ('69db76f9-ae6d-4df6-9dfc-74a2a15cfb1f', 'aaed2c90-8068-4289-9e22-cf2f086bfb6c',
                  '62f57f36-75b0-4dd9-a9da-168b7d36033c', '44d30a97-4a61-4c4c-bc4c-e2f7d0e6fe2b',
                  '476e4f79-2fff-4dbc-9a74-1cbd42ec81ea', 'cd17d467-faf9-4f50-828b-eb75c0e1b933',
                  '98905c2d-c9b6-4482-bab9-c8e60196dc8a', '2cf7e37c-1200-4c6e-a033-ad75bb341674',
                  '99c083be-f72e-427b-b097-26070532d4e1', '39d4807d-9e8a-4752-b603-536d5870d354');

DELETE
FROM core.text
WHERE id in ('69db76f9-ae6d-4df6-9dfc-74a2a15cfb1f', 'aaed2c90-8068-4289-9e22-cf2f086bfb6c',
             '62f57f36-75b0-4dd9-a9da-168b7d36033c', '44d30a97-4a61-4c4c-bc4c-e2f7d0e6fe2b',
             '476e4f79-2fff-4dbc-9a74-1cbd42ec81ea', 'cd17d467-faf9-4f50-828b-eb75c0e1b933',
             '98905c2d-c9b6-4482-bab9-c8e60196dc8a', '2cf7e37c-1200-4c6e-a033-ad75bb341674',
             '99c083be-f72e-427b-b097-26070532d4e1', '39d4807d-9e8a-4752-b603-536d5870d354');

-- add missing titles and correct tekstityyp values

INSERT INTO core.text_property (text_id, property_name, property_value)
VALUES ('e042f92f-ff5a-4140-b0cc-b333aa39a335', 'title', 'Harjutus');

INSERT INTO core.text_property (text_id, property_name, property_value)
VALUES ('890017af-a939-4364-8366-9f7061501c09', 'title', 'Kodutöö');

INSERT INTO core.text_property (text_id, property_name, property_value)
VALUES ('2fcac08a-685b-4383-a025-f57b179fcf68', 'title', 'Minu jõulud');

INSERT INTO core.text_property (text_id, property_name, property_value)
VALUES ('36b90b31-70c5-49f3-a9c7-e89f711affc3', 'title', 'Õpin kuni elan');

INSERT INTO core.text_property (text_id, property_name, property_value)
VALUES ('6f6d3a2f-24b2-4bef-8f79-5a3f4c6b1292', 'title', 'Õpin kuni elan');

INSERT INTO core.text_property (text_id, property_name, property_value)
VALUES ('04fb3c8c-1a7f-4f0c-ae49-d23ce2a348e6', 'title', 'Keel on rahvuse hing');

INSERT INTO core.text_property (text_id, property_name, property_value)
VALUES ('7cae669d-84ab-4258-9348-d757d298d485', 'title', 'Essee');

INSERT INTO core.text_property (text_id, property_name, property_value)
VALUES ('e17347d1-dcee-429e-b790-3daff76014fc', 'title', 'Eksamitöö');

INSERT INTO core.text_property (text_id, property_name, property_value)
VALUES ('b4c5f5ad-aa87-41da-adc4-88662708aade', 'title', 'Dialoog');

INSERT INTO core.text_property (text_id, property_name, property_value)
VALUES ('77f53e95-9c08-4c24-95a9-edb17686b7f7', 'title', 'Õpin kuni elan');

INSERT INTO core.text_property (text_id, property_name, property_value)
VALUES ('1d6f7efe-a447-49f3-9df2-e3862ec7de0c', 'title', 'Head ja halvad õpetajad');

INSERT INTO core.text_property (text_id, property_name, property_value)
VALUES ('dad549d1-749c-4ff8-89f9-c5787f0de5c0', 'title', 'Tutvustus');

INSERT INTO core.text_property (text_id, property_name, property_value)
VALUES ('7a973ac5-3ab7-4d61-abe3-f5fe5b0d0334', 'title', 'Tutvustus');

INSERT INTO core.text_property (text_id, property_name, property_value)
VALUES ('0842672b-79a8-4652-ac09-220ed1c88ef3', 'title', 'Kiri');

INSERT INTO core.text_property (text_id, property_name, property_value)
VALUES ('cdcd62a7-2416-47e9-9576-cf0c2e347521', 'title', 'Kiri');

INSERT INTO core.text_property (text_id, property_name, property_value)
VALUES ('d4d104e6-4408-4158-a313-a56b81d26666', 'title', 'Reis');

INSERT INTO core.text_property (text_id, property_name, property_value)
VALUES ('f427aafa-9c3c-4e2b-8759-5d1f4f64fb0e', 'title', 'Harjutus');

INSERT INTO core.text_property (text_id, property_name, property_value)
VALUES ('4247bca1-7c92-40c8-8b17-0f1c66139377', 'title', 'Harjutus');

INSERT INTO core.text_property (text_id, property_name, property_value)
VALUES ('c1ef10e5-9a15-4c81-ac9e-8cabc530c369', 'title', 'Tutvustus');

INSERT INTO core.text_property (text_id, property_name, property_value)
VALUES ('0ac04f76-29b3-482e-866b-755401c92647', 'title', 'Sügis');

INSERT INTO core.text_property (text_id, property_name, property_value)
VALUES ('a593167a-8c22-47f0-9af8-5adfa6e978f8', 'title', 'EKSAMITÖÖ');


UPDATE core.text_property
SET property_value = 'k2eesti_harjutus_laused'
WHERE property_name = 'tekstityyp'
  AND text_id = 'e042f92f-ff5a-4140-b0cc-b333aa39a335';

UPDATE core.text_property
SET property_value = 'k2eesti_kiri_isiklik'
WHERE property_name = 'tekstityyp'
  AND text_id = 'dad549d1-749c-4ff8-89f9-c5787f0de5c0';

-- fix other text properties

UPDATE core.text_property
SET property_value = 'B1'
WHERE property_name = 'keeletase'
  AND text_id = 'd04c49b0-1355-4500-b221-4becb42eaba2';

UPDATE core.text_property
SET property_value = 'Ida-Viru maakond'
WHERE property_name = 'elukoht'
  AND text_id = '3a4296e1-06dd-4545-8bbe-f5244f416984';

UPDATE core.text_property
SET property_value = 'A2'
WHERE property_name = 'keeletase'
  AND text_id = '0d97ad43-a415-4961-97d0-21aba5639bcc';

UPDATE core.text_property
SET property_value = 'ei'
WHERE property_name = 'abivahendid'
  AND text_id = '0d97ad43-a415-4961-97d0-21aba5639bcc';

UPDATE core.text_property
SET property_value = 'ei'
WHERE property_name = 'abivahendid'
  AND text_id = '6b49f415-93be-4ba0-a1f1-faf8b5ed8a93';

UPDATE core.text_property
SET property_value = 'B1'
WHERE property_name = 'keeletase'
  AND text_id = 'daa14bca-d727-44f3-a0b8-c57005d12a3f';

-- create unique constraint on text hash

ALTER TABLE core.text
  ADD CONSTRAINT text_hash_unique UNIQUE (hash);
