<?php
require_once __DIR__ . '/../backend/session.php';

header('Location: ' . (!empty($_SESSION['user_id']) ? 'menu.php' : 'login.php'));
exit;
