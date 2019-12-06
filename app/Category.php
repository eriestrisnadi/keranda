<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Rorecek\Ulid\HasUlid;
use App\Product;

class Category extends Model
{
    use HasUlid;
    
    public function products()
    {
        return $this->belongsToMany(Product::class);
    }
}
