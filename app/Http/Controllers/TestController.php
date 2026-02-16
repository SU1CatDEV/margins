<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TestController extends Controller
{
    public function create() {
        return Inertia::render('Test');
    }

    public function add(Request $request) {
        return response()->json(["test" => "hello world lmao"], 201);
    }
}
