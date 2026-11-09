----------------------
-- HELPER FUNCTIONS --
----------------------

create procedure pg_temp.create_role(name text) as
$$
declare
  current_database_name text;
begin
  select current_database from current_database() into current_database_name;
  begin
    execute format('create role %s with nologin', name);
  exception
    when duplicate_object then null;
    when others then raise;
  end;
  execute format('revoke all privileges on database %s from %s', current_database_name, name);
end;
$$ language plpgsql;

create procedure pg_temp.create_user(name text, password text) as
$$
declare
  current_database_name text;
begin
  select current_database from current_database() into current_database_name;
  begin
    execute format('create user %s with password ''%s''', name, password);
  exception
    when duplicate_object then null;
    when others then raise;
  end;
  execute format('alter user %s with password ''%s''', name, password);
  execute format('revoke all privileges on database %s from %s', current_database_name, name);
  execute format('grant connect on database %s to %s', current_database_name, name);
end;
$$ language plpgsql;

create procedure pg_temp.create_schema(name text) as
$$
begin

  execute format('create schema if not exists %s', name);
  execute format('grant usage on schema %s to public', name);

  execute format('call pg_temp.create_role(''%s_rw'')', name);
  execute format('grant select, insert, update on all tables in schema %1$s to %1$s_rw', name);
  execute format('grant usage on all sequences in schema %1$s to %1$s_rw', name);
  execute format('alter default privileges in schema %1$s grant select, insert, update on tables to group %1$s_rw', name);
  execute format('alter default privileges in schema %1$s grant usage on sequences to group %1$s_rw', name);

  execute format('call pg_temp.create_role(''%s_r'')', name);
  execute format('grant select on all tables in schema %1$s to %1$s_r', name);
  execute format('grant select on all sequences in schema %1$s to %1$s_r', name);
  execute format('alter default privileges in schema %1$s grant select on tables to group %1$s_r', name);
  execute format('alter default privileges in schema %1$s grant select on sequences to group %1$s_r', name);

end;
$$ language plpgsql;

-----------------------
-- CONFIGURE SCHEMAS --
-----------------------

drop schema if exists public cascade;
call pg_temp.create_schema('sys');
call pg_temp.create_schema('core');
call pg_temp.create_schema('history');

------------------------
-- CREATE ROLES/USERS --
------------------------

call pg_temp.create_user('api_user', '${EVKK_API_DATASOURCE_PASSWORD}');
call pg_temp.create_user('task_scheduler_user', '${EVKK_TASK_SCHEDULER_DATASOURCE_PASSWORD}');

-----------------
-- GRANT ROLES --
-----------------

grant core_rw to api_user;
grant core_rw to task_scheduler_user;

----------------
-- EXTENSIONS --
----------------

create extension if not exists "hstore";
create extension if not exists "uuid-ossp";
create extension if not exists "citext";

---------------------------
-- CONFIGURE SEARCH PATH --
---------------------------

do
$$
  declare
    current_database_name text;
  begin
    select current_database from current_database() into current_database_name;
    execute format('alter database %s set search_path to sys', current_database_name);
  end;
$$ language plpgsql;
