<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoryProductTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('category_product', function (Blueprint $t) {
            $t->char('id', 26)->primary();
            $t->char('category_id', 26);
            $t->foreign('category_id')->references('id')->on('categories');
            $t->char('product_id', 26);
            $t->foreign('product_id')->references('id')->on('products');
            $t->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('category_product');
    }
}
