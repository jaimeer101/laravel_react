<?php

namespace App\Http\Controllers\Actions;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Item;
use App\Models\ItemsPrices;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;



class ItemController extends Controller
{
    public $items_price;

    public function __construct(){
        $this->items_price = new ItemsPrices;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $title = "Add Items";
        $categoriesList = Category::all();
        
        $data = [
            "categories" => $categoriesList
        ];
        $page = "form";
        return Inertia::render('items', [
            'data' => $data,
            'page' => $page, 
            'title' => $title
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $rules = [
            'categories_id' => 'required', 
            'items_code' => 'required|regex:/^\S*$/|unique:items,items_code', 
            'items_name' => 'required|unique:items,items_name', 
            'items_price' => 'required|numeric|gt:0', 
            'items_discount_rate' => 'numeric'
        ];
        $message = [
            'categories_id.required' => 'Category is required',
            'items_code.unique' => 'Code must be unique',
            'items_code.regex' => 'Code must be not have any white spaces',
            'items_code.required' => 'Code is required',
            'items_name.unique' => 'Name must be unique',
            'items_name.required' => 'Name is required',
            'items_price.required' => 'Price is required', 
            'items_price.numeric' => 'Price must be number', 
            'items_price.gt' => 'Price must be greater than 0', 
            'items_discount_rate.numeric' => 'Discount rate must be number', 
        ];
        $validateData = $request->validateWithBag('items',$rules , $message);
        $submitData = [
            'categories_id' => $validateData["categories_id"],
            'items_code' => $validateData["items_code"],
            'items_name' => $validateData["items_name"],
            'price' => (double)$validateData["items_price"],
            'discounted_rate' => (double)$validateData["items_discount_rate"],
            'created_by' => Auth::id()
        ];
        // dd($request->file('items_image'));
        $item = Item::create($submitData);
        $type = "";

        if(!is_numeric($item->id)){
            $type = "danger";
            $message = $item;
        }
        if($type == ""){
            $itemsId = $item->id;
            $extension = $request->file('items_image')->getClientOriginalExtension();
            $imageName = "image_".$itemsId."_".$validateData["items_code"].".".$extension;
            
            if ($request->hasFile('items_image') && $request->file('items_image')->isValid()) {
                $path = $request->file('items_image')->storeAs('images/items/main',$imageName, 'public');
                $updateData = [
                    'items_image' => Storage::url($path), 
                ];
                $updateItemsImage = Item::where('id', $itemsId)->update($updateData);
                if(!is_numeric($updateItemsImage)){
                    $type = "danger";
                    $message = "Item Image: ".$updateItemsImage;
                }
            }
            else{
                $type = "danger";
                $message = "File not found";
            }
            
        }
        if($type == ""){
            $updateItemsPrices = $this->items_price->update_items_prices($item->id, $validateData);
            if(!is_numeric($updateItemsPrices)){
                $type = "danger";
                $message = "Item Prices: ".$updateItemsPrices;
            }
        }

        if($type == ""){
            $type = "success";
            $message = "Item create successful";
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
        $title = "Item ".$itemDetails->items_code;
        $data = [
            "categories" => $categoriesList, 
            "item_details" => $itemDetails
        ];
        $page = "form";
        return Inertia::render('items', [
            'data' => $data,
            'page' => $page, 
            'title' => $title
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $type = "";
        $itemsId = $id;
        $rules = [
            'categories_id' => 'required', 
            'items_code' => 'required|unique:items,items_code,'.$itemsId, 
            'items_name' => 'required|unique:items,items_name,'.$itemsId, 
            'items_price' => 'required|numeric|gt:0', 
            'items_discount_rate' => 'numeric', 
            'items_image' => 'required|image'
        ];
        $message = [
            'categories_id.required' => 'Category is required',
            'items_code.unique' => 'Code must be unique',
            'items_code.required' => 'Name is required',
            'items_name.unique' => 'Code must be unique',
            'items_name.required' => 'Name is required', 
            'items_price.required' => 'Price is required', 
            'items_price.numeric' => 'Price must be number', 
            'items_price.gt' => 'Price must be greater than 0', 
            'items_discount_rate.numeric' => 'Discount rate must be number', 
            'items_image.required' => 'Image is required', 
            'items_image.image' => 'Selected Item is not an image', 
        ];
        $path = "";
        $validateData = $request->validateWithBag('items',$rules , $message);
        $extension = $request->file('items_image')->getClientOriginalExtension();
        $imageName = "image_".$itemsId."_".$validateData["items_code"].".".$extension;
        if ($request->hasFile('items_image') && $request->file('items_image')->isValid()) {
            $path = $request->file('items_image')->storeAs('images/items/main',$imageName, 'public');
        }
        else{
            $type = "danger";
            $message = "Please check the file, cannot upload";
        }
        if($type == ""){
            $submitData = [
                'categories_id' => $validateData["categories_id"],
                'items_code' => $validateData["items_code"],
                'items_name' => $validateData["items_name"],
                'price' => $validateData["items_price"],
                'items_image' => Storage::url($path), 
                'discounted_rate' => $validateData["items_discount_rate"],
                'updated_by' => Auth::id(), 

            ];
            $item = Item::where('id', $itemsId)->update($submitData);
            

            if(!is_numeric($item)){
                $type = "danger";
                $message = "Item: ".$item;
            }
        }
        // echo $path;
        // exit;
        // if(!path){
        //     echo "Error in uploading";
        //     exit;
        // }
        
        if($type == ""){
            $updateItemsPrices = $this->items_price->update_items_prices($itemsId, $validateData);
            if(!is_numeric($updateItemsPrices)){
                $type = "danger";
                $message = "Item Prices: ".$updateItemsPrices;
            }
        }

        if($type == ""){
            $type = "success";
            $message = "Item update successful";
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
    public function destroy(Request $request)
    {
        $itemsId = $request->get("id");
        $deleteItem = Item::whereIn('id', $itemsId)->delete();
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
