<?php
// Mini Mart API: sign up, login and scores (MySQL).

require_once __DIR__ . '/session.php';
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

// Sends a JSON response and stops.
function respond(int $status, array $data): never
{
    http_response_code($status);
    echo json_encode($data);
    exit;
}

// Reads JSON from the request body.
function input_data(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '{}', true);
    return is_array($data) ? $data : [];
}

// Stops with 401 if the player is not logged in.
function require_login(): void
{
    if (empty($_SESSION['user_id'])) {
        respond(401, [
            'success' => false,
            'message' => 'Please log in again.'
        ]);
    }
}

try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
} catch (PDOException $e) {
    respond(500, [
        'success' => false,
        'message' => 'Database connection failed. Check WAMP and database settings.'
    ]);
}

$action = $_GET['action'] ?? '';
$data   = input_data();

// Sign up
if ($action === 'signup' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim((string)($data['username'] ?? ''));
    $password = (string)($data['password'] ?? '');

    if (mb_strlen($username) < 3 || mb_strlen($username) > 30) {
        respond(422, [
            'success' => false,
            'message' => 'Username must be 3 to 30 characters.'
        ]);
    }

    if (strlen($password) < 6) {
        respond(422, [
            'success' => false,
            'message' => 'Password must be at least 6 characters.'
        ]);
    }

    try {
        $stmt = $pdo->prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
        $stmt->execute([
            $username,
            password_hash($password, PASSWORD_DEFAULT)
        ]);

        respond(201, [
            'success' => true
        ]);
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') {
            respond(409, [
                'success' => false,
                'message' => 'That username is already registered.'
            ]);
        }
        respond(500, [
            'success' => false,
            'message' => 'Could not create the account.'
        ]);
    }
}

// Log in
if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim((string)($data['username'] ?? ''));
    $password = (string)($data['password'] ?? '');

    $stmt = $pdo->prepare('SELECT id, username, password_hash FROM users WHERE username = ? LIMIT 1');
    $stmt->execute([$username]);
    $account = $stmt->fetch();

    if (!$account || !password_verify($password, $account['password_hash'])) {
        respond(401, [
            'success' => false,
            'message' => 'Invalid username or password.'
        ]);
    }

    session_regenerate_id(true);
    $_SESSION['user_id']  = (int)$account['id'];
    $_SESSION['username'] = $account['username'];

    respond(200, [
        'success'  => true,
        'username' => $account['username']
    ]);
}

// Log out
if ($action === 'logout' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'],
            $params['secure'],
            $params['httponly']
        );
    }

    session_destroy();

    respond(200, [
        'success' => true
    ]);
}

// Save score
if ($action === 'save_score' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_login();

    $score      = filter_var($data['score'] ?? null, FILTER_VALIDATE_INT);
    $difficulty = strtolower((string)($data['difficulty'] ?? ''));
    $levels     = load_json('levels');

    // Score must be a whole number within the maximum for this difficulty
    $level    = $levels[$difficulty] ?? null;
    $maxScore = $level ? $level['targetOrders'] * ($level['pointsPerOrder'] + $level['puzzleBonus']) : 0;

    if ($score === false || $score < 0 || $level === null || $score > $maxScore) {
        respond(422, [
            'success' => false,
            'message' => 'Invalid score details.'
        ]);
    }

    $stmt = $pdo->prepare('INSERT INTO scores (user_id, score, difficulty) VALUES (?, ?, ?)');
    $stmt->execute([
        $_SESSION['user_id'],
        $score,
        ucfirst($difficulty)
    ]);

    respond(201, [
        'success' => true
    ]);
}

// Get scores
if ($action === 'get_scores' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    require_login();

    $stmt = $pdo->prepare(
        'SELECT u.username, s.score, s.difficulty, s.created_at
         FROM scores s
         JOIN users u ON u.id = s.user_id
         WHERE s.user_id = ?
         ORDER BY s.score DESC, s.created_at DESC'
    );
    $stmt->execute([$_SESSION['user_id']]);

    respond(200, [
        'success' => true,
        'scores'  => $stmt->fetchAll()
    ]);
}

// Clear scores
if ($action === 'clear_scores' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_login();

    $stmt = $pdo->prepare('DELETE FROM scores WHERE user_id = ?');
    $stmt->execute([$_SESSION['user_id']]);

    respond(200, [
        'success' => true
    ]);
}

// Unknown action
respond(404, [
    'success' => false,
    'message' => 'Unknown API action.'
]);
