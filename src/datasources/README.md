# Datasources

This directory contains config for datasources used by this app.

# Create extension uuid-ossp

❯ sudo -u postgres psql filetransfer
psql (12.6 (Ubuntu 12.6-0ubuntu0.20.10.1), server 11.7 (Ubuntu 11.7-0ubuntu0.19.10.1))
Type "help" for help.

filetransfer=# select * from pg_extension;
 extname | extowner | extnamespace | extrelocatable | extversion | extconfig | extcondition
---------+----------+--------------+----------------+------------+-----------+--------------
 plpgsql |       10 |           11 | f              | 1.0        |           |
(1 row)

filetransfer=# CREATE EXTENSION "uuid-ossp";
CREATE EXTENSION
filetransfer=# select * from pg_extension;
  extname  | extowner | extnamespace | extrelocatable | extversion | extconfig | extcondition
-----------+----------+--------------+----------------+------------+-----------+--------------
 plpgsql   |       10 |           11 | f              | 1.0        |           |
 uuid-ossp |       10 |         2200 | t              | 1.1        |           |
(2 rows)
