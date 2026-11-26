<?php
// Src router: sends authenticated players to the main menu and guests to the login page.
require_once __DIR__ . '/main/minimart/gameBackend/sessionManager.php';

header('Location: ' . (!empty($_SESSION['user_id']) ? 'main/minimart/gameViews/mainMenu.php' : 'main/minimart/gameViews/playerLogin.php'));
exit;
