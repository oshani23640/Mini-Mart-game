<?php
// Root entry point: routes authenticated users to menu and guests to login.
require_once __DIR__ . '/backend/session.php';

header('Location: ' . (!empty($_SESSION['user_id']) ? 'pages/menu.php' : 'pages/login.php'));
exit;
