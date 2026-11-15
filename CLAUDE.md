# CLAUDE.md

## Database changes must be backward compatible

**Every database change, from here on, must work with the version of the application that is currently running.**

Deploys are rolling updates (see `docker/run.sh`): migrations run against the live database first, while the
previous version of the application keeps serving, and only then are the services replaced one by one. If the new
version fails, the services are rolled back to the previous version, but the migrations are not. So the previous
version must work against the migrated schema both during the deploy and after a rollback.

In practice:

- Adding is fine: new tables, new nullable columns or columns with a default, new indexes, new functions/triggers.
- Removing or renaming takes two releases (expand, then contract):
    1. Release 1 adds the new column/table, the code writes to both and reads from the new one.
    2. Release 2, once release 1 is live, removes the old column/table.
- Don't change a column's type or add `NOT NULL` to an existing column in a way the running code can't handle.
- Repeatable migrations (`R__*.sql`) also run against live traffic: a large data change can lock tables and stall
  requests for as long as it runs.

## Migrations

- Flyway migrations are in `db/src/main/resources/migration/`: `versioned/` (`V<NNNN>__Migration.sql`),
  `repeatable/` (`R__<NNNN>-<description>.sql`) and `callbacks/beforeMigrate.sql`.
- Never edit a versioned migration that has already been applied anywhere, Flyway's checksum validation fails.
  Add a new one instead.
- A new schema must be created in `callbacks/beforeMigrate.sql` (with `pg_temp.create_schema`), not only listed in
  `spring.flyway.schemas`: Flyway creates the schemas in that list only on an empty database.
