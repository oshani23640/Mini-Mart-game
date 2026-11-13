<?php
require_once __DIR__ . '/../gameBackend/sessionManager.php';

header('Location: ' . (!empty($_SESSION['user_id']) ? 'mainMenu.php' : 'playerLogin.php'));
exit;
