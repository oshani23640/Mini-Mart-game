<?php
// Main router: sends authenticated players to the main menu and guests to the login page.
require_once __DIR__ . '/minimart/gameBackend/sessionManager.php';

header('Location: ' . (!empty($_SESSION['user_id']) ? 'minimart/gameViews/mainMenu.php' : 'minimart/gameViews/playerLogin.php'));
exit;
