# API PHP — Vixy Driver ↔ vhixy.site ↔ Vixy Passenger

Backend en PHP puro (sin dependencias/Composer) pensado para hosting
compartido de **https://www.vhixy.site**. Usa PDO con sentencias preparadas
en todos los endpoints (protección contra inyección SQL) y autenticación por
clave compartida (`VIXY_INTERCONNECTION_KEY`) más un checksum anti-replay,
compatible con `buildSecureHeaders()` de [src/utils/security.ts](../src/utils/security.ts).

## Despliegue

1. Sube la carpeta `php-api/` a la raíz pública de vhixy.site (o a un
   subdominio/subcarpeta, p. ej. `https://www.vhixy.site/php-api/`).
2. Copia `.env.example` a `.env` en el servidor y completa `DB_*` y
   `VIXY_INTERCONNECTION_KEY` (debe ser la MISMA clave configurada en
   `VITE_INTERCONNECTION_KEY` en ambas apps, conductor y pasajero).
3. Ejecuta `database/schema.sql` contra la base de datos indicada en `.env`
   (ver [../database/README.md](../database/README.md) sobre cómo evitar
   choques con las tablas de `vixy-admin`).
4. Verifica con: `curl https://www.vhixy.site/php-api/api/health.php`

## Endpoints

| Método | Ruta                              | Auth | Usado por          | Propósito                                   |
|--------|-----------------------------------|------|---------------------|----------------------------------------------|
| GET    | `/api/health.php`                 | No   | Driver + Passenger  | Ping de disponibilidad                        |
| GET    | `/api/system/config.php`          | Sí   | Driver + Passenger  | Config compartida (tasa BCV, versión)         |
| POST   | `/api/drivers/sync.php`           | Sí   | Driver              | Sube/actualiza perfil y estado en línea       |
| POST   | `/api/drivers/verify.php`         | Sí   | Driver              | Verifica homologación de licencia/INTT        |
| POST   | `/api/payments/verify.php`        | Sí   | Driver              | Reporta comprobante de recarga para auditoría |
| POST   | `/api/trips/create.php`           | Sí   | Passenger           | Publica una solicitud de viaje                |
| GET    | `/api/trips/pending.php`          | Sí   | Driver              | Lista viajes ofertados sin conductor (polling) |
| POST   | `/api/trips/accept.php`           | Sí   | Driver              | Toma un viaje (bloqueo anti doble-asignación) |
| GET/POST | `/api/trips/status.php`         | Sí   | Driver + Passenger  | Consulta/actualiza estado del viaje en curso  |
| POST   | `/api/trips/ledger.php`           | Sí   | Driver              | Registra comisión 10% al completar viaje      |
| GET/POST | `/api/commands/queue.php`       | Sí   | Driver + Passenger  | Cola de comandos entre apps (persistente)      |

## Cómo se conectan simultáneamente Driver y Passenger

1. La app **Passenger** llama `trips/create.php` → crea la fila en
   `vixy_trips` con `status='offered'`.
2. La app **Driver** hace polling de `trips/pending.php` cada pocos
   segundos y muestra la oferta al conductor.
3. Al aceptar, la app **Driver** llama `trips/accept.php`, que usa
   `SELECT ... FOR UPDATE` dentro de una transacción para que, si dos
   conductores aceptan "al mismo tiempo", solo el primero gane
   (`trip_already_taken` para el segundo).
4. Ambas apps consultan `trips/status.php?id=...` (polling) para ver el
   estado actualizado (en camino, en punto de recogida, completado, etc.).
5. Al completar, la app **Driver** llama `trips/ledger.php` para dejar el
   registro contable de la comisión del 10%.

## Seguridad

- Todas las consultas usan sentencias preparadas de PDO (`ATTR_EMULATE_PREPARES => false`).
- Autenticación por `Authorization: Bearer <clave>` + checksum con ventana
  de 5 minutos (anti-replay), igual al que ya genera el frontend.
- CORS restringido por lista blanca configurable (`VIXY_ALLOWED_ORIGINS`).
- `.htaccess` bloquea acceso directo a los archivos de configuración y al `.env`.
- Los textos de entrada se limpian con `vixy_clean_string()` (quita tags,
  recorta longitud) antes de guardarse.
