<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Category;
use App\Product;
use Illuminate\Support\Str;
use Rorecek\Ulid;

class ProductController extends Controller
{
    public function store(Request $request)
    {
        $productRequest = $request->only('name', 'description', 'categories');
        $rules = [
            'name' => 'required|min:3|max:255',
        ];
        $validator = Validator::make($productRequest, $rules);
        if($validator->fails()) {
            return response()->json(['success'=> false, 'error'=> $validator->messages()]);
        }

        $file = $request->file('file');
        if($request->hasFile('file')) {
            $nameFile = Str::slug($request->name, "_");
            $extFile = $file->getClientOriginalExtension();
            $path = $file->storeAs(
                'products', $nameFile . "_" . \Ulid::generate() . "." . $extFile, 'public'
            );

            $product = Product::create([
                'name' => $request->name,
                'description' => $request->description,
                'file' => $path,
            ]);
        } else {
            $product = Product::create([
                'name' => $request->name,
                'description' => $request->description,
            ]);
        }

        $category = Category::find($request->categories);
        $product->categories()->attach($category);

        return response()->json(['success'=> true, 'error'=> $validator->messages()]);
    }

    public function fetch(Request $request)
    {
        $products = Product::with('categories')->get();
        if($request->get('filter'))
        {
            $filter = json_decode($request->get('filter'))->categories;
            if($filter){
                $products = Product::with('categories')->whereHas('categories', function($q) use ($filter) {
                    $q->whereIn('categories.id', $filter);
                })->get();
            }
        }

        return response()->json(['success'=> true, 'data' => $products]);
    }

    public function delete(Request $request)
    {
        $product = Product::find($request->id);

        $product->categories()->detach();
        $product->delete();
        $products = Product::all();

        return response()->json(['success'=> true, 'data' => $products]);
    }

    public function update(Request $request)
    {
        $product = Product::find($request->id);
        $productRequest = $request->only('name', 'description', 'categories');
        $rules = [
            'name' => 'required|min:3|max:255',
        ];
        $validator = Validator::make($productRequest, $rules);

        if($validator->fails()) {
            return response()->json(['success'=> false, 'error'=> $validator->messages()]);
        }

        $file = $request->file('file');
        if($request->hasFile('file')) {
            $nameFile = Str::slug($request->name, "_");
            $extFile = $file->getClientOriginalExtension();
            $path = $file->storeAs(
                'products', $nameFile . "_" . \Ulid::generate() . "." . $extFile, 'public'
            );

            $product->update([
                'name' => $request->name,
                'description' => $request->description,
                'file' => $path,
            ]);
        } else {
            $product->update([
                'name' => $request->name,
                'description' => $request->description
            ]);
        }
        $product->categories()->detach();

        $category = Category::find($request->categories);
        $product->categories()->attach($category);

        return response()->json(['success'=> true]);
    }
}
