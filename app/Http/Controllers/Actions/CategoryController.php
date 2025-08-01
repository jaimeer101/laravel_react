<?php

namespace App\Http\Controllers\Actions;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // echo Auth::id();
        // dd(auth()->user());
        
        $data = [];
        $page = "form";
        return Inertia::render('categories', [
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
            'category_code' => 'required|unique:categories,categories_code', 
            'category_name' => 'required|unique:categories,categories_name'
        ];
        $message = [
            'category_code.required' => 'Code is required',
            'category_code.unique' => 'Code must be unique',
            'category_name.required' => 'Name is required',
            'category_name.unique' => 'Name must be unique'
        ];
        $validateData = $request->validateWithBag('category',$rules , $message);
        $submitData = [
            'categories_code' => $validateData["category_code"],
            'categories_name' => $validateData["category_name"],
            'created_by' => Auth::id()
        ];

        $category = Category::create($submitData);
        $type = "success";
        $message = "New Category created successfully";
        if(!is_numeric($category->id)){
            $type = "danger";
            $message = $category;
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
        
        $data = Category::find($id);
        $page = "show";
        return Inertia::render('categories', [
            'data' => $data,
            'page' => $page
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $type = "";
        $message = "";
        $response = array();
        $categoriesId = $id;
        // dd($request->all());
        // dd($categoriesId);
        $rules = [
            'category_code' => 'required|unique:categories,categories_code,'.$categoriesId, 
            'category_name' => 'required|unique:categories,categories_name,'.$categoriesId
        ];

        $message = [
            'category_code.required' => 'Code is required',
            'category_code.unique' => 'Code must be unique',
            'category_name.required' => 'Name is required',
            'category_name.unique' => 'Name must be unique'
        ];
        $validateData = $request->validateWithBag('category',$rules , $message);
        $submitData = [
            'categories_code' => $validateData["category_code"],
            'categories_name' => $validateData["category_name"],
            'updated_by' => Auth::user()->id
        ];
        $category = Category::where('id', $categoriesId)->update($submitData);
        $type = "success";
        $message = "Category update successful";

        if(!is_numeric($category)){
            $type = "danger";
            $message = "Category: ".$category;
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
        $deleteCategory = Category::where('id', $id)->delete();
        $type = "success";
        $message = "Category delete successful";
        if(!is_numeric($deleteCategory)){
            $type = "danger";
            $message = $deleteCategory;
        }
        $response = array(
            "type"=> $type,
            "message" => $message
        );

        return response()->json($response);
    }
}
