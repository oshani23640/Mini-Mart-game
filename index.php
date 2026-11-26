<?php
// Root router: sends authenticated players to the main menu and guests to the login page.
$sessionManager = __DIR__ . '/src/main/minimart/gameBackend/sessionManager.php';
if (file_exists($sessionManager)) {
    require_once $sessionManager;
    header('Location: ' . (!empty($_SESSION['user_id']) ? 'src/main/minimart/gameViews/mainMenu.php' : 'src/main/minimart/gameViews/playerLogin.php'));
    exit;
}

// Fallback if hosted directly from minimart/
if (file_exists(__DIR__ . '/gameBackend/sessionManager.php')) {
    require_once __DIR__ . '/gameBackend/sessionManager.php';
    header('Location: ' . (!empty($_SESSION['user_id']) ? 'gameViews/mainMenu.php' : 'gameViews/playerLogin.php'));
    exit;
}
