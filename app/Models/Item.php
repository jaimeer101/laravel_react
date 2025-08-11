<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $table = "items";

    protected $fillable = [
        "categories_id", 
        "items_code","items_name", 
        "discounted_rate", 
        "price", 
        "created_by", 
        "updated_by"
    ];

    protected $appends = ['discounted_price'];

    public function getDiscountedPriceAttribute(){
        $finalPrice = $this->price * (1 - ($this->discounted_rate / 100));
        return $finalPrice;

    }
    // public function getPriceAttribute(){
    //     $conditions = [
    //         'items_id' => $this->id, 
    //         'status' => 'active'
    //     ];
    //     return ItemsPrices::query()
    //         ->select('price')
    //         ->where($conditions)
    //         ->first()->price;

    // }

    // public function getDiscountRateAttribute(){
    //     $conditions = [
    //         'items_id' => $this->id, 
    //         'status' => 'active'
    //     ];
    //     return ItemsPrices::query()
    //         ->select('discount_rate')
    //         ->where($conditions)
    //         ->first()->discount_rate;

    // }
    public function categories(){
        return $this->belongsTo(Category::class, 'categories_id', 'id');   
    }
}
