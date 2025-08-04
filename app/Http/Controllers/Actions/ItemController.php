<?php

namespace App\Http\Controllers\Actions;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;


class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categoriesList = Category::all();
        
        $data = [
            "categories" => $categoriesList
        ];
        $page = "form";
        return Inertia::render('items', [
            'data' => $data,
            'page' => $page
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $rules = [
            'categories_id' => 'required', 
            'items_code' => 'required|unique:items,items_code', 
            'items_name' => 'required|unique:items,items_name'
        ];
        $message = [
            'categories_id.required' => 'Category is required',
            'items_code.unique' => 'Code must be unique',
            'items_code.required' => 'Name is required',
            'items_name.unique' => 'Code must be unique',
            'items_name.required' => 'Name is required',
        ];
        $validateData = $request->validateWithBag('items',$rules , $message);
        $submitData = [
            'categories_id' => $validateData["categories_id"],
            'items_code' => $validateData["items_code"],
            'items_name' => $validateData["items_name"],
            'created_by' => Auth::id()
        ];

        $item = Item::create($submitData);
        $type = "success";
        $message = "New Item created successfully";
        if(!is_numeric($item->id)){
            $type = "danger";
            $message = $item;
        }

        $response = array(
            "type"=> $type,
            "message" => $message
        );
        return response()->json($response);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $categoriesList = Category::all();
        $itemDetails = Item::find($id);
        $data = [
            "categories" => $categoriesList, 
            "item_details" => $itemDetails
        ];
        $page = "form";
        return Inertia::render('items', [
            'data' => $data,
            'page' => $page
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $itemsId = $id;
        $rules = [
            'categories_id' => 'required', 
            'items_code' => 'required|unique:items,items_code,'.$itemsId, 
            'items_name' => 'required|unique:items,items_name,'.$itemsId
        ];
        $message = [
            'categories_id.required' => 'Category is required',
            'items_code.unique' => 'Code must be unique',
            'items_code.required' => 'Name is required',
            'items_name.unique' => 'Code must be unique',
            'items_name.required' => 'Name is required',
        ];
        $validateData = $request->validateWithBag('items',$rules , $message);
        $submitData = [
            'categories_id' => $validateData["categories_id"],
            'items_code' => $validateData["items_code"],
            'items_name' => $validateData["items_name"],
            'updated_by' => Auth::id()
        ];
        $item = Item::where('id', $itemsId)->update($submitData);
        $type = "success";
        $message = "Item update successful";

        if(!is_numeric($item)){
            $type = "danger";
            $message = "Item: ".$item;
        }

        $response = array(
            "type"=> $type,
            "message" => $message
        );

        return response()->json($response);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $deleteItem = Item::where('id', $id)->delete();
        $type = "success";
        $message = "Item delete successful";
        if(!is_numeric($deleteItem)){
            $type = "danger";
            $message = $deleteItem;
        }
        $response = array(
            "type"=> $type,
            "message" => $message
        );

        return response()->json($response);
    }
}
