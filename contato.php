<?php
declare(strict_types=1);

const RATE_LIMIT_SECONDS = 86400;
const DATA_DIR = __DIR__ . '/data';
const RATE_LIMIT_FILE = DATA_DIR . '/contact_rate_limit.json';
const SUBMISSIONS_FILE = DATA_DIR . '/contact_submissions.csv';

$recipientEmail = 'evertonwilliam@gmail.com, tati.oliver.leao@hotmail.com';
$siteEmail = 'evertonwilliam@gmail.com';
$ipHashSalt = 'tatiane-leao-contact-form';

function isAjaxRequest(): bool
{
    $requestedWith = $_SERVER['HTTP_X_REQUESTED_WITH'] ?? '';
    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';

    return strtolower($requestedWith) === 'xmlhttprequest' || strpos($accept, 'application/json') !== false;
}

function statusResponse(string $status): array
{
    $responses = [
        'enviado' => [
            'success' => true,
            'message' => 'Mensagem enviada com sucesso! Em breve entraremos em contato.',
            'httpCode' => 200,
        ],
        'limite' => [
            'success' => false,
            'message' => 'Mensagem ja enviada recentemente. Aguarde antes de tentar novamente.',
            'httpCode' => 429,
        ],
        'metodo' => [
            'success' => false,
            'message' => 'Nao foi possivel enviar a mensagem por este metodo.',
            'httpCode' => 405,
        ],
        'erro' => [
            'success' => false,
            'message' => 'Nao foi possivel enviar a mensagem. Confira os dados e tente novamente.',
            'httpCode' => 400,
        ],
    ];

    return $responses[$status] ?? $responses['erro'];
}

function redirectWithStatus(string $status): void
{
    if (isAjaxRequest()) {
        $response = statusResponse($status);

        http_response_code((int) $response['httpCode']);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'success' => (bool) $response['success'],
            'status' => $status,
            'message' => $response['message'],
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    header('Location: index.html?contato=' . rawurlencode($status) . '#contato', true, 303);
    exit;
}

function cleanText(string $value): string
{
    $value = trim($value);
    $value = preg_replace('/[\r\n]+/', ' ', $value) ?? '';

    return $value;
}

function ensureDataDirectory(): bool
{
    return is_dir(DATA_DIR) || mkdir(DATA_DIR, 0755, true);
}

function clientIp(): string
{
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

function claimRateLimit(string $ipHash, int $now): string
{
    $handle = fopen(RATE_LIMIT_FILE, 'c+');

    if ($handle === false) {
        return 'error';
    }

    if (!flock($handle, LOCK_EX)) {
        fclose($handle);
        return 'error';
    }

    $contents = stream_get_contents($handle);
    $records = json_decode($contents ?: '{}', true);

    if (!is_array($records)) {
        $records = [];
    }

    foreach ($records as $hash => $timestamp) {
        if (($now - (int) $timestamp) >= RATE_LIMIT_SECONDS) {
            unset($records[$hash]);
        }
    }

    if (isset($records[$ipHash]) && ($now - (int) $records[$ipHash]) < RATE_LIMIT_SECONDS) {
        flock($handle, LOCK_UN);
        fclose($handle);
        return 'limited';
    }

    $records[$ipHash] = $now;

    rewind($handle);
    ftruncate($handle, 0);
    $saved = fwrite($handle, json_encode($records, JSON_PRETTY_PRINT)) !== false;
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);

    return $saved ? 'claimed' : 'error';
}

function releaseRateLimit(string $ipHash): void
{
    $handle = fopen(RATE_LIMIT_FILE, 'c+');

    if ($handle === false || !flock($handle, LOCK_EX)) {
        if ($handle !== false) {
            fclose($handle);
        }
        return;
    }

    $contents = stream_get_contents($handle);
    $records = json_decode($contents ?: '{}', true);

    if (is_array($records) && isset($records[$ipHash])) {
        unset($records[$ipHash]);
        rewind($handle);
        ftruncate($handle, 0);
        fwrite($handle, json_encode($records, JSON_PRETTY_PRINT));
        fflush($handle);
    }

    flock($handle, LOCK_UN);
    fclose($handle);
}

function saveSubmission(string $nome, string $email, string $telefone, string $ipHash, int $now): bool
{
    $isNewFile = !file_exists(SUBMISSIONS_FILE);
    $handle = fopen(SUBMISSIONS_FILE, 'ab');

    if ($handle === false) {
        return false;
    }

    if (!flock($handle, LOCK_EX)) {
        fclose($handle);
        return false;
    }

    if ($isNewFile) {
        fputcsv($handle, ['data', 'nome', 'email', 'telefone', 'ip_hash']);
    }

    $saved = fputcsv($handle, [date('c', $now), $nome, $email, $telefone, $ipHash]) !== false;

    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);

    return $saved;
}

// iniciar o processo.

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirectWithStatus('metodo');
}

if (!empty($_POST['site'] ?? '')) {
    redirectWithStatus('enviado');
}

$nome = cleanText((string) ($_POST['nome'] ?? ''));
$email = cleanText((string) ($_POST['email'] ?? ''));
$telefone = cleanText((string) ($_POST['telefone'] ?? ''));
$assunto = cleanText((string) ($_POST['assunto'] ?? ''));
$mensagem = cleanText((string) ($_POST['mensagem'] ?? ''));


if (
    $nome === ''
    || strlen($nome) > 120
    || !filter_var($email, FILTER_VALIDATE_EMAIL)
    || strlen($email) > 160
    || $telefone === ''
    || strlen($telefone) > 30
    || strlen($mensagem) > 1024
    || !preg_match('/^[0-9\s()+.-]{8,30}$/', $telefone)
) {
    redirectWithStatus('erro');
}

if (!ensureDataDirectory()) {
    redirectWithStatus('erro');
}


$now = time();
$ipHash = hash_hmac('sha256', clientIp(), $ipHashSalt);

$rateLimitStatus = claimRateLimit($ipHash, $now);

if ($rateLimitStatus === 'limited') {
    redirectWithStatus('limite');
}

if ($rateLimitStatus !== 'claimed') {
    redirectWithStatus('erro');
}

if (!saveSubmission($nome, $email, $telefone, $ipHash, $now)) {
    releaseRateLimit($ipHash);
    redirectWithStatus('erro');
}

$subject = "Contato do Site - Tatiane Leão - {$assunto}";
$ip = $_SERVER['REMOTE_ADDR'];
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
$referer = $_SERVER['HTTP_REFERER'] ?? '';
$dataHora = date('d/m/Y H:i:s');
$phpversion = phpversion();

$message = "
    <html>
    <body>
    <h2>Solicitação de contato do site - Tatiane Leão - {$assunto}</h2>

    <table border='1' cellpadding='10' cellspacing='0'>

    <tr><td><strong>Nome</strong></td><td>{$nome}</td></tr>
    <tr><td><strong>Telefone</strong></td><td>{$telefone}</td></tr>
    <tr><td><strong>Email</strong></td><td>{$email}</td></tr>
    <tr><td><strong>Solicitação</strong></td><td>{$assunto}</td></tr>
    <tr><td><strong>Mensagem</strong></td><td>{$mensagem}</td></tr>

    </table>

    </body>
    </html>
";

$headers = [
    'MIME-Version: 1.0',
    'Content-type:text/html;charset=UTF-8',
    'From: Tatiane Leao <' . $siteEmail . '>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/'.$phpversion,
    
];

$mailResult = mail($recipientEmail, $subject, $message, implode("\r\n", $headers));

redirectWithStatus('enviado');
