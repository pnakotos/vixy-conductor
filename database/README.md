# Base de datos Vixy (vhixy.site)

Este esquema (`schema.sql`) está diseñado para ejecutarse en la base de datos
MySQL/MariaDB de **https://www.vhixy.site**, compartida entre:

- La app **Vixy Driver** (este repositorio, `vixy-conductor`).
- La app **Vixy Passenger** (repositorio aparte).
- El panel **vixy-admin** (repositorio aparte, no accesible desde este entorno).

## Cómo evitar cruces incorrectos de información con "vixy-admin"

No tengo acceso al repositorio `vixy-admin` (no aparece en tu cuenta de GitHub
conectada aquí, o es privado y no está compartido con este workspace). Para
evitar duplicar o pisar tablas ya existentes:

1. Antes de aplicar este script en la base real, ejecuta en producción:
   ```sql
   SHOW TABLES LIKE 'vixy_%';
   ```
   Si ya existen tablas con ese prefijo desde `vixy-admin`, **no ejecutes el
   script directamente**: compárteme (o pégame) el `schema.sql` /
   `SHOW CREATE TABLE` de esas tablas y ajusto este esquema para que
   coincidan en vez de duplicarse.
2. Si `vixy-admin` es la fuente de verdad de conductores/pasajeros/tarifas,
   trata `vixy_drivers` y `vixy_passengers` como **tablas de sincronización
   (caché)**, no como maestras: se indexan por `cedula` / `passenger_uid`
   (claves naturales), no por autoincrementales que puedan chocar.
3. Todas las tablas usan el prefijo `vixy_` justamente para poder convivir en
   la misma base de datos que use `vixy-admin` sin sobrescribir sus tablas
   (`users`, `drivers`, `trips` genéricos, etc.).
4. Si prefieres aislar por completo, puedes crear una base de datos separada
   (p. ej. `vhixy_conductor`) y este mismo `schema.sql` funciona igual; los
   archivos PHP en `php-api/` solo necesitan las credenciales en `.env`.

## Aplicar el esquema

```bash
mysql -h TU_HOST -u TU_USUARIO -p TU_BASE_DE_DATOS < database/schema.sql
```

## Tablas principales

| Tabla                     | Propósito                                                        |
|---------------------------|-------------------------------------------------------------------|
| `vixy_drivers`             | Perfil y estado en línea de conductores                          |
| `vixy_driver_vehicles`     | Vehículo por tipo de servicio (moto/taxi/delivery)                |
| `vixy_driver_documents`    | Documentos legales del conductor (licencia, RCV, etc.)            |
| `vixy_passengers`          | Caché de pasajeros sincronizados desde la app pasajero            |
| `vixy_trips`               | Viajes: creados por la app pasajero, tomados por la app conductor |
| `vixy_wallet_transactions` | Recargas, comisiones y ganancias del conductor                    |
| `vixy_system_config`       | Config compartida (tasa BCV, versión de servidor)                 |
| `vixy_commands_queue`      | Cola de comandos entre apps (persistente, reemplaza memoria)      |
| `vixy_sync_logs`           | Auditoría de sincronización entre apps                            |
