<?php
// Verifies player authentication session before rendering protected views.
require_once __DIR__ . '/../gameBackend/sessionManager.php';

if (empty($_SESSION['user_id'])) {
    header('Location: playerLogin.php');
    exit;
}
