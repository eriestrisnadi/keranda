<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Category;

class CategoryController extends Controller
{
    public function store(Request $request)
    {
        $categoryRequest = $request->only('name');
        $rules = [
            'name' => 'required|min:3|max:255',
        ];
        $validator = Validator::make($categoryRequest, $rules);

        if($validator->fails()) {
            return response()->json(['success'=> false, 'error'=> $validator->messages()]);
        }
        
        $product = Category::create([
            'name' => $request->name
        ]);

        return response()->json(['success'=> true]);
    }

    public function fetch()
    {
        $categories = Category::all();

        return response()->json(['success'=> true, 'data' => $categories]);
    }

    public function delete(Request $request)
    {
        $category = Category::find($request->id);

        $category->products()->detach();
        $category->delete();
        $categories = Category::all();
        
        return response()->json(['success'=> true, 'data' => $categories]);
    }

    public function update(Request $request)
    {
        $category = Category::find($request->id);
        $categoryRequest = $request->only('name');
        $rules = [
            'name' => 'required|min:3|max:255',
        ];
        $validator = Validator::make($categoryRequest, $rules);

        if($validator->fails()) {
            return response()->json(['success'=> false, 'error'=> $validator->messages()]);
        }

        $category->update([
            'name' => $request->name
        ]);

        return response()->json(['success'=> true]);
    }
}
