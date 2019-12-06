<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Rorecek\Ulid\HasUlid;
use App\Category;

class Product extends Model
{
    use HasUlid;

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }
}
