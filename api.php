<?php
header('Content-Type: application/json');

// API key y Password
define("API_KEY", "123456");
define("API_PASSWORD", "claveSecreta");

// Verificar si la API key y password
if (!isset($_POST['api_key']) || !isset($_POST['password'])) {
    // creacion del codigo de estado
    http_response_code(401);
    echo json_encode(["Error" => "Faltan credenciales", "codigo" => "401"]);
    exit;
}

// Verificar si la API key y password son correctos
if ($_POST['api_key'] !== API_KEY || $_POST['password'] !== API_PASSWORD) {
    // creacion del codigo de estado
    http_response_code(403);
    echo json_encode(["Error" => "Credenciales invalidas", "codigo" => "403"]);
    exit;
}

$jsonfile = "./datos.json";

// Verificar si el archivo existe
if (!file_exists($jsonfile)) {
    // creacion del codigo de estado
    http_response_code(404);
    echo json_encode(["Error" => "Archivo no encontrado"]);
    exit;
}

// Leer el archivo JSON
$data = file_get_contents($jsonfile);

// Convertimos a array los datos del archivo JSON
$personas = json_decode($data, true);

// Verificamos si la decodificacion del archivo es correcta
if ($personas === null) {
    http_response_code(500);
    echo json_encode(["Error" => "Error interno del servidor"]);
    exit;
}

// Devolver los datos con un codigo 200 OK
http_response_code(200);
echo json_encode($personas);

?>