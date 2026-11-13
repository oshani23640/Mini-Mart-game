<?php
// Initializes PHP session with secure cookie attributes.
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_set_cookie_params([
        'httponly' => true, //option to prevent JavaScript from accessing the cookie
        'samesite' => 'Lax', // additional protection against certain cross-site requests
        'secure'   => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'
    ]);
    session_start();
}
