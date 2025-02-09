<?php
header('Content-Type: application/json');

// API key y Password
define("API_KEY", "123456");
define("API_PASSWORD", "claveSecreta");

// Manejar solicitudes POST (autenticación)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['api_key']) || !isset($_POST['password'])) {
        http_response_code(401);
        echo json_encode(["Error" => "Faltan credenciales", "codigo" => "401"]);
        exit;
    }

    if ($_POST['api_key'] !== API_KEY || $_POST['password'] !== API_PASSWORD) {
        http_response_code(403);
        echo json_encode(["Error" => "Credenciales inválidas", "codigo" => "403"]);
        exit;
    }

    // Respuesta de autenticación exitosa
    echo json_encode(["token" => "abcdef123456"]);
    exit;
}

// Manejar solicitudes GET (carga de datos)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $jsonfile = "./datos.json";

    if (!file_exists($jsonfile)) {
        http_response_code(404);
        echo json_encode(["Error" => "Archivo no encontrado"]);
        exit;
    }

    $data = file_get_contents($jsonfile);
    $personas = json_decode($data, true);

    if ($personas === null) {
        http_response_code(500);
        echo json_encode(["Error" => "Error interno del servidor"]);
        exit;
    }

    http_response_code(200);
    echo json_encode($personas);
    exit;
}

// Si el método no es ni POST ni GET
http_response_code(405);
echo json_encode(["Error" => "Método no permitido"]);
exit;
?>