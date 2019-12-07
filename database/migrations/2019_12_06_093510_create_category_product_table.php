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
            $t->bigIncrements('id');
            $t->char('category_id', 26);
            $t->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            $t->char('product_id', 26);
            $t->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
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
