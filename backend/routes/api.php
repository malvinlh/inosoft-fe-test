<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MockApiController;

Route::get('/dropdowns',            [MockApiController::class, 'dropdowns']);
Route::get('/inspection-templates', [MockApiController::class, 'templates']);
Route::get('/items',                [MockApiController::class, 'items']);
Route::get('/inspections',          [MockApiController::class, 'inspections']);
Route::get('/inspections/{id}',     [MockApiController::class, 'inspectionById']);
Route::post('/inspections',         [MockApiController::class, 'createInspection']);