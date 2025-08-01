<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $table = "items";

    protected $fillable = ["categories_id","items_code","items_name", "created_by", "updated_by"];

    public function categories(){
        return $this->belongsTo(Category::class, 'categories_id', 'id');   
    }
}
