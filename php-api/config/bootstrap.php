<?php
declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', '0');
date_default_timezone_set('America/Caracas');

require_once __DIR__ . '/env.php';

vixy_load_env(__DIR__ . '/../.env');

require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/database.php';

/** Responde JSON y termina la ejecución. */
function vixy_json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/** Lee y decodifica el body JSON de la petición actual. */
function vixy_json_input(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }

    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/** Sanitiza cadenas (quita tags, recorta longitud) antes de usarlas en SQL/salida. */
function vixy_clean_string(mixed $value, int $maxLength = 255): string
{
    if (!is_string($value)) {
        return '';
    }

    return mb_substr(trim(strip_tags($value)), 0, $maxLength);
}

require_once __DIR__ . '/auth.php';

vixy_apply_cors();
