#!/bin/bash

chmod 0600 /root/.pgpass


echo "Desconecta Usuarios"
psql -U postgres -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE datname in ('tedplan_db');"

echo "criando o banco tedplan_db"
createdb -h localhost -U postgres tedplan_db

echo "restaurando o banco tedplan_db"
pg_restore -h localhost -U postgres -d tedplan_db backup_tedplan.dump;

echo "Banco restaurado com sucesso"!

