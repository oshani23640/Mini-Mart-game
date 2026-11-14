<?php
require_once __DIR__ . '/gameBackend/sessionManager.php';

header('Location: ' . (!empty($_SESSION['user_id']) ? 'gameViews/mainMenu.php' : 'gameViews/playerLogin.php'));
exit;
