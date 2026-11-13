<?php

const DB_HOST = 'localhost';
const DB_NAME = 'minimart_db';
const DB_USER = 'root';
const DB_PASS = '';

// Reads a JSON file from the data folder.
function load_json(string $name): array
{
    $path = __DIR__ . '/../data/' . $name . '.json';
    $data = json_decode((string) @file_get_contents($path), true);
    return is_array($data) ? $data : [];
}
