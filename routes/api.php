<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

// V1 API
Route::group(['prefix' => 'v1'], function()
{
    // Categories
    Route::group(['prefix' => 'categories'], function()
    {
        Route::get('/', [
            'as' => 'api.categories.fetch',
            'middleware' => 'auth:api',
            'uses' => 'CategoryController@fetch',
        ]);
        Route::post('/', [
            'as' => 'api.categories.store',
            'middleware' => 'auth:api',
            'uses' => 'CategoryController@store',
        ]);
        Route::put('/{id}', [
            'as' => 'api.categories.update',
            'middleware' => 'auth:api',
            'uses' => 'CategoryController@update',
        ]);
        Route::delete('/{id}', [
            'as' => 'api.categories.delete',
            'middleware' => 'auth:api',
            'uses' => 'CategoryController@delete',
        ]);
    });

    
    // Products
    Route::group(['prefix' => 'products'], function()
    {
        Route::get('/', [
            'as' => 'api.products.fetch',
            'uses' => 'ProductController@fetch',
        ]);
        Route::post('/', [
            'as' => 'api.products.store',
            'middleware' => 'auth:api',
            'uses' => 'ProductController@store',
        ]);
        Route::put('/{id}', [
            'as' => 'api.products.update',
            'middleware' => 'auth:api',
            'uses' => 'ProductController@update',
        ]);
        Route::delete('/{id}', [
            'as' => 'api.products.delete',
            'middleware' => 'auth:api',
            'uses' => 'ProductController@delete',
        ]);
    });
});