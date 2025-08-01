<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PagesController extends Controller
{
    public function categories() {
        $data = Category::all();
        $page = "list";
        return Inertia::render('categories', [
            'data' => $data,
            'page' => $page
        ]);
    }

    public function items() {
        $data = Item::all();
        $page = "list";
        return Inertia::render('items', [
            'data' => $data,
            'page' => $page
        ]);
    }
}
