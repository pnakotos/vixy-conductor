-- ============================================================================
-- Vixy Conductor <-> vhixy.site — Esquema MySQL/MariaDB
-- ============================================================================
-- Este esquema está pensado para vivir en la MISMA base de datos que ya usa
-- vhixy.site (y, potencialmente, la app de pasajero y el panel "vixy-admin").
--
-- IMPORTANTE - Prevención de cruces con "vixy admin":
--   Todas las tablas usan el prefijo `vixy_` para evitar colisiones de nombre
--   con tablas existentes (por ejemplo `users`, `trips`, `drivers` genéricos).
--   Antes de ejecutar esto en producción:
--     1) Ejecuta `SHOW TABLES LIKE 'vixy_%';` en la base de vhixy.site.
--     2) Si tu repo "vixy-admin" ya define tablas con este prefijo, comparte
--        su schema.sql (o dame acceso de lectura al repo) para fusionar sin
--        duplicar columnas ni perder integridad referencial.
--     3) Si "vixy-admin" gestiona a los conductores/pasajeros como fuente de
--        verdad, usa este esquema como CACHÉ de sincronización (mismo id)
--        en lugar de tabla maestra; ver notas en cada tabla.
-- ============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- Catálogo de aplicaciones que se conectan (conductor, pasajero, admin)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vixy_apps (
  id            VARCHAR(40)  NOT NULL PRIMARY KEY, -- 'driver-app', 'passenger-app', 'admin-panel'
  display_name  VARCHAR(120) NOT NULL,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO vixy_apps (id, display_name) VALUES
  ('driver-app', 'Vixy Driver (Conductor)'),
  ('passenger-app', 'Vixy Passenger'),
  ('admin-panel', 'Vixy Admin');

-- ----------------------------------------------------------------------------
-- Conductores (fuente sincronizada desde la app conductor)
-- Si "vixy-admin" ya posee una tabla maestra de conductores, esta tabla debe
-- tratarse como réplica/caché indexada por `cedula` (clave natural estable).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vixy_drivers (
  id                     BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cedula                 VARCHAR(20)  NOT NULL,
  full_name              VARCHAR(150) NOT NULL,
  phone                  VARCHAR(30)  NOT NULL,
  email                  VARCHAR(150) DEFAULT NULL,
  plate_number           VARCHAR(20)  DEFAULT NULL,
  rating                 DECIMAL(3,2) NOT NULL DEFAULT 5.00,
  total_trips            INT UNSIGNED NOT NULL DEFAULT 0,
  acceptance_rate        DECIMAL(5,2) NOT NULL DEFAULT 100.00,
  is_verified_by_vixy    TINYINT(1)   NOT NULL DEFAULT 0,
  is_approved            TINYINT(1)   NOT NULL DEFAULT 1,
  is_active_online       TINYINT(1)   NOT NULL DEFAULT 0,
  is_suspended_by_balance TINYINT(1)  NOT NULL DEFAULT 0,
  has_initial_recharge   TINYINT(1)   NOT NULL DEFAULT 0,
  city                   VARCHAR(100) DEFAULT NULL,
  last_lat               DECIMAL(10,7) DEFAULT NULL,
  last_lng               DECIMAL(10,7) DEFAULT NULL,
  last_seen_at           DATETIME     DEFAULT NULL,
  created_at             DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_vixy_drivers_cedula (cedula),
  KEY idx_vixy_drivers_online (is_active_online, city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS vixy_driver_vehicles (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  driver_id        BIGINT UNSIGNED NOT NULL,
  service_type     ENUM('moto','taxi','delivery') NOT NULL,
  brand            VARCHAR(80)  DEFAULT NULL,
  model            VARCHAR(80)  DEFAULT NULL,
  year             SMALLINT UNSIGNED DEFAULT NULL,
  color            VARCHAR(40)  DEFAULT NULL,
  plate_number     VARCHAR(20)  DEFAULT NULL,
  photo_url        VARCHAR(255) DEFAULT NULL,
  has_helmet       TINYINT(1)   DEFAULT NULL,
  seats_count      TINYINT UNSIGNED DEFAULT NULL,
  has_thermal_bag  TINYINT(1)   DEFAULT NULL,
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_vixy_driver_vehicle (driver_id, service_type),
  CONSTRAINT fk_vixy_driver_vehicles_driver FOREIGN KEY (driver_id) REFERENCES vixy_drivers (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS vixy_driver_documents (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  driver_id         BIGINT UNSIGNED NOT NULL,
  name              VARCHAR(150) NOT NULL,
  legal_basis       VARCHAR(255) DEFAULT NULL,
  status            ENUM('approved','pending','rejected','missing') NOT NULL DEFAULT 'pending',
  url               VARCHAR(255) DEFAULT NULL,
  expiry_date       DATE DEFAULT NULL,
  degree            VARCHAR(20)  DEFAULT NULL,
  policy_number     VARCHAR(60)  DEFAULT NULL,
  document_number   VARCHAR(60)  DEFAULT NULL,
  required_for      VARCHAR(60)  DEFAULT NULL, -- CSV: moto,taxi,delivery
  notes             VARCHAR(255) DEFAULT NULL,
  created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_vixy_driver_documents_driver (driver_id),
  CONSTRAINT fk_vixy_driver_documents_driver FOREIGN KEY (driver_id) REFERENCES vixy_drivers (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Pasajeros (caché de sincronización; la app de pasajero es la fuente).
-- Se identifica con `passenger_uid` (id estable emitido por la app pasajero /
-- vixy-admin) para no chocar con IDs internos de esta base.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vixy_passengers (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  passenger_uid         VARCHAR(60)  NOT NULL,
  full_name             VARCHAR(150) NOT NULL,
  phone                 VARCHAR(30)  DEFAULT NULL,
  photo_url             VARCHAR(255) DEFAULT NULL,
  rating                DECIMAL(3,2) NOT NULL DEFAULT 5.00,
  total_trips           INT UNSIGNED NOT NULL DEFAULT 0,
  is_university_student TINYINT(1)   NOT NULL DEFAULT 0,
  university_name       VARCHAR(150) DEFAULT NULL,
  student_card_id       VARCHAR(60)  DEFAULT NULL,
  created_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_vixy_passengers_uid (passenger_uid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Viajes: tabla compartida entre app conductor y app pasajero.
-- La app pasajero crea la fila (status='offered'); la app conductor la toma
-- (status='accepted') usando bloqueo de fila para evitar doble asignación.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vixy_trips (
  id                            VARCHAR(60) NOT NULL PRIMARY KEY,
  service_type                  ENUM('moto','taxi','delivery') NOT NULL,
  service_name                  VARCHAR(120) NOT NULL,
  driver_id                     BIGINT UNSIGNED DEFAULT NULL,
  passenger_id                  BIGINT UNSIGNED DEFAULT NULL,
  passenger_name_snapshot       VARCHAR(150) DEFAULT NULL,
  is_university_tariff          TINYINT(1) NOT NULL DEFAULT 0,
  university_tariff_discount_usd DECIMAL(8,2) DEFAULT NULL,
  university_tariff_note        VARCHAR(255) DEFAULT NULL,
  pickup_address                VARCHAR(255) NOT NULL,
  pickup_city_area              VARCHAR(120) DEFAULT NULL,
  pickup_lat                    DECIMAL(10,7) NOT NULL,
  pickup_lng                    DECIMAL(10,7) NOT NULL,
  dropoff_address               VARCHAR(255) NOT NULL,
  dropoff_city_area             VARCHAR(120) DEFAULT NULL,
  dropoff_lat                   DECIMAL(10,7) NOT NULL,
  dropoff_lng                   DECIMAL(10,7) NOT NULL,
  distance_km                   DECIMAL(6,2) DEFAULT NULL,
  duration_mins                 SMALLINT UNSIGNED DEFAULT NULL,
  fare_usd                      DECIMAL(8,2) NOT NULL DEFAULT 0,
  fare_ves                      DECIMAL(12,2) NOT NULL DEFAULT 0,
  commission_fee_usd            DECIMAL(8,2) NOT NULL DEFAULT 0,
  driver_net_earnings_usd       DECIMAL(8,2) NOT NULL DEFAULT 0,
  payment_method                VARCHAR(40) DEFAULT NULL,
  status                        ENUM('offered','accepted','en_camino_pasajero','en_punto_recogida','en_trayecto_destino','completed','cancelled') NOT NULL DEFAULT 'offered',
  delivery_notes                VARCHAR(255) DEFAULT NULL,
  cancel_reason                 VARCHAR(255) DEFAULT NULL,
  created_by_app                VARCHAR(40) NOT NULL DEFAULT 'passenger-app',
  created_at                    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  accepted_at                   DATETIME DEFAULT NULL,
  completed_at                  DATETIME DEFAULT NULL,
  updated_at                    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_vixy_trips_status (status),
  KEY idx_vixy_trips_driver (driver_id),
  KEY idx_vixy_trips_passenger (passenger_id),
  CONSTRAINT fk_vixy_trips_driver FOREIGN KEY (driver_id) REFERENCES vixy_drivers (id) ON DELETE SET NULL,
  CONSTRAINT fk_vixy_trips_passenger FOREIGN KEY (passenger_id) REFERENCES vixy_passengers (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Billetera / transacciones del conductor
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vixy_wallet_transactions (
  id                 VARCHAR(60) NOT NULL PRIMARY KEY,
  driver_id          BIGINT UNSIGNED NOT NULL,
  type               ENUM('recharge','commission_fee','trip_earning','bonus') NOT NULL,
  amount_usd         DECIMAL(8,2) NOT NULL DEFAULT 0,
  amount_ves         DECIMAL(12,2) DEFAULT NULL,
  bcv_rate_used      DECIMAL(8,2) DEFAULT NULL,
  method             ENUM('pago_movil','zinli','binance','paypal','system') DEFAULT NULL,
  reference_number   VARCHAR(60) DEFAULT NULL,
  description        VARCHAR(255) DEFAULT NULL,
  status             ENUM('completed','pending','rejected') NOT NULL DEFAULT 'pending',
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_vixy_wallet_driver (driver_id, status),
  CONSTRAINT fk_vixy_wallet_driver FOREIGN KEY (driver_id) REFERENCES vixy_drivers (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Configuración compartida (tasa BCV, versión de servidor, feature flags)
-- Leída por AMBAS apps para evitar valores desincronizados.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vixy_system_config (
  config_key   VARCHAR(80) NOT NULL PRIMARY KEY,
  config_value VARCHAR(255) NOT NULL,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO vixy_system_config (config_key, config_value) VALUES
  ('bcv_rate', '68.50'),
  ('server_version', 'v2.4.0-vhixy-central')
ON DUPLICATE KEY UPDATE config_value = config_value;

-- ----------------------------------------------------------------------------
-- Cola de comandos push-like (polling) por app: reemplaza la cola en memoria
-- de server/server.js para que sobreviva reinicios y sea compartida.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vixy_commands_queue (
  id           VARCHAR(60) NOT NULL PRIMARY KEY,
  app_id       VARCHAR(60) NOT NULL,
  command      VARCHAR(80) NOT NULL,
  payload      JSON DEFAULT NULL,
  status       ENUM('pending','delivered') NOT NULL DEFAULT 'pending',
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  delivered_at DATETIME DEFAULT NULL,
  KEY idx_vixy_commands_app_status (app_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Bitácora de sincronización (auditoría de integraciones entre apps)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vixy_sync_logs (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  app_source       VARCHAR(40) NOT NULL,
  endpoint         VARCHAR(150) NOT NULL,
  action           VARCHAR(150) NOT NULL,
  status           ENUM('success','pending','error') NOT NULL,
  details          VARCHAR(500) DEFAULT NULL,
  payload_preview  TEXT DEFAULT NULL,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_vixy_sync_logs_source (app_source, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
