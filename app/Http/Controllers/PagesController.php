<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class PagesController extends Controller
{
    public function categories() {
        $categoriesList = Category::all();
        $data = [];
        $count = 1;
        foreach($categoriesList as $cat){
            $data[] = [
                "no" => $count, 
                "id" => $cat->id,
                "code" => $cat->categories_code,
                "name" => $cat->categories_name,
            ];
            $count++;
        }
        $data = json_encode($data);
        $page = "list";
        return Inertia::render('categories', [
            'data' => json_decode($data),
            'page' => $page
        ]);
    }

    public function items() {
        $hashed = Hash::make('admin');
        // echo $hashed;
        // exit();
        $itemsList = Item::with('categories')->get();
        $data = [];
        $count = 1;
        foreach($itemsList as $items){
            $category = isset($items->categories->categories_name) ? $items->categories->categories_name : "";
            $finalPrice = $items->price * (1 - ($items->discounted_rate / 100));
            $data[] = [
                "no" => $count, 
                "id" => $items->id,
                "category" => $category, 
                "code" => $items->items_code,
                "name" => $items->items_name,
                "price" => "PHP ". ($items->price == ""? "0.00" : $items->price),
                "discounted_rate" => ($items->discounted_rate == ""? "0" : (double)$items->discounted_rate)."%",
                "discounted_price" => "PHP ".$items->discounted_price
            ];
            $count++;
        }
        $data = json_encode($data);
        $page = "list";
        return Inertia::render('items', [
            'data' => json_decode($data),
            'page' => $page
        ]);
    }

    public function datatables() {
        $itemsList = Item::with('categories')->get();
        $data = [];
        $count = 1;
        foreach($itemsList as $items){
            $category = isset($items->categories->categories_name) ? $items->categories->categories_name : "";
            $data[] = [
                "no" => $count, 
                "id" => $items->id,
                "category" => $category, 
                "code" => $items->items_code,
                "name" => $items->items_name,
            ];
            $count++;
        }
        $data = json_encode($data);
        $page = "list";
        return Inertia::render('datatables', [
            'data2' => json_decode($data),
            'page' => $page
        ]);
    }
}
