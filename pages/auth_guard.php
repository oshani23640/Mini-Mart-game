<?php
// Starts the session and sends guests to the login page.
require_once __DIR__ . '/../backend/session.php';

if (empty($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}
