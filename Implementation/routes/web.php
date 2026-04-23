<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test-session', function () {
    $start = microtime(true);
    session()->put('test', '123');
    session()->save();
    return "Session saved in: " . (microtime(true) - $start) . " seconds";
});
