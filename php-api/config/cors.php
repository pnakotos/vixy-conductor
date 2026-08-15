<?php
declare(strict_types=1);

/**
 * CORS restringido por lista blanca de orígenes (VIXY_ALLOWED_ORIGINS en .env).
 * Usa "*" solo si de verdad quieres abrir el endpoint a cualquier origen.
 */
function vixy_apply_cors(): void
{
    $allowedRaw = getenv('VIXY_ALLOWED_ORIGINS') ?: '*';
    $allowedOrigins = array_filter(array_map('trim', explode(',', $allowedRaw)));
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array('*', $allowedOrigins, true)) {
        header('Access-Control-Allow-Origin: *');
    } elseif ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
    }

    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With, X-Security-Checksum, X-Client-Platform, X-Client-Version, X-Interconnection-Key');

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
