<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// #region agent log
(function () {
    $logPath = getenv('DEBUG_LOG_PATH') ?: '/Users/vesas/Desktop/vesa-lab/.cursor/debug-7301c9.log';
    $configCached = file_exists(__DIR__.'/../bootstrap/cache/config.php');
    $payload = json_encode([
        'sessionId' => '7301c9',
        'timestamp' => (int) round(microtime(true) * 1000),
        'location' => 'public/index.php',
        'message' => 'request entry',
        'data' => [
            'uri' => $_SERVER['REQUEST_URI'] ?? '/',
            'configCached' => $configCached,
        ],
        'hypothesisId' => 'H1',
        'runId' => getenv('DEBUG_RUN_ID') ?: 'pre-fix',
    ]);
    @file_put_contents($logPath, $payload."\n", FILE_APPEND | LOCK_EX);
})();
// #endregion

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

// #region agent log
(function () {
    $logPath = getenv('DEBUG_LOG_PATH') ?: '/Users/vesas/Desktop/vesa-lab/.cursor/debug-7301c9.log';
    $configPath = __DIR__.'/../bootstrap/cache/config.php';
    $cachedDbHost = null;
    if (is_readable($configPath)) {
        $cached = @include $configPath;
        $cachedDbHost = $cached['database']['connections']['mysql']['host'] ?? null;
    }
    $payload = json_encode([
        'sessionId' => '7301c9',
        'timestamp' => (int) round(microtime(true) * 1000),
        'location' => 'public/index.php',
        'message' => 'cached db config snapshot',
        'data' => [
            'cachedDbHost' => $cachedDbHost,
            'envDbHost' => getenv('DB_HOST') ?: null,
        ],
        'hypothesisId' => 'H1',
        'runId' => getenv('DEBUG_RUN_ID') ?: 'pre-fix',
    ]);
    @file_put_contents($logPath, $payload."\n", FILE_APPEND | LOCK_EX);
})();
// #endregion

$app->handleRequest(Request::capture());
