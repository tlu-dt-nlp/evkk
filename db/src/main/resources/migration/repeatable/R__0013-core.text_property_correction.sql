delete
from core.text_property
where property_value = '';

update core.text_property
set property_value = 'ak_uurimus_batoo'
where property_value = 'ak_uurimus_bakalaureusetoo';

update core.text_property
set property_value = 'k1eesti_harjutus'
where text_id in (
                  'af71d7da-6ae0-4048-b1fd-f2f83d8aee5a', 'b0ca6f22-e126-46cf-a57c-7c2889cf1f2f',
                  '3739d73c-d4d0-45ab-9cfa-6b6c03ea67e2', '344f5cb4-cde1-402a-8924-b5e28888340f',
                  'df7b5411-4fcb-43da-ad9f-fdd2d2928ad7', '602c4e79-a1dd-468c-baab-6bda8cc53e5e',
                  'd837c59a-af42-4546-827b-bb1393da1849', '455515d3-f970-446d-9f1f-835370143397',
                  'c11bc338-7d7e-421d-a47c-dcb749f822bc', 'c4bca182-87cb-4596-9ea6-7210ace49aa6',
                  '3325c323-8b15-4b5e-a7b2-2ce312e88af7', 'd7bde7ed-77b1-4806-ace1-2b7bf2ff47dc',
                  '71846d09-e4b0-4c96-9808-d31061f143a8', 'bad816a6-35ed-414f-a151-97062b9dea5e',
                  '63d27ed6-0464-4a3f-aaf7-f1faad177141'
  )
  and property_name = 'tekstityyp';

delete
from core.text_property
where property_name = 'emakeel'
  and property_value = 'muud';

delete
from core.text_property
where property_name = 'riik'
  and property_value = 'Muu';

insert into core.text_property
values (gen_random_uuid(), '1084e8b3-09f1-4d7f-badb-0a3940889dc0', 'korpus', 'cYDRkpymb');

update core.text_property
set property_value = 'k1eesti_arvamuslugu'
where text_id in ('1084e8b3-09f1-4d7f-badb-0a3940889dc0', '1995ac4e-ae8c-4d4d-835a-995ca700d65a')
  and property_name = 'tekstityyp';

update core.text_property
set property_value = 'cYDRkpymb'
where text_id in ('1995ac4e-ae8c-4d4d-835a-995ca700d65a', '455515d3-f970-446d-9f1f-835370143397',
                  'c11bc338-7d7e-421d-a47c-dcb749f822bc', 'c4bca182-87cb-4596-9ea6-7210ace49aa6',
                  '3325c323-8b15-4b5e-a7b2-2ce312e88af7', 'd7bde7ed-77b1-4806-ace1-2b7bf2ff47dc',
                  '71846d09-e4b0-4c96-9808-d31061f143a8', 'bad816a6-35ed-414f-a151-97062b9dea5e',
                  '63d27ed6-0464-4a3f-aaf7-f1faad177141')
  and property_name = 'korpus';
