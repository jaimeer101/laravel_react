<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ItemsPrices extends Model
{
    protected $table = "items_price";

    protected $fillable = ["items_id","price","discount_rate", "status", "created_by", "updated_by"];

    public function update_items_prices($itemsId, $data){
        
        $response = "";
        $message = "";
        $itemsPriceCondition = [
            'items_id' => $itemsId, 
            'status' => 'active'
        ];
        $itemsPriceList = self::where($itemsPriceCondition)->get();
        
        if(!empty($itemsPriceList)){
            $updateData = [
                "status" => "updated"
            ];
            $updateItemsPrices = self::where('items_id', $itemsId)->update($updateData);
            //$sql = $updateItemsPrices->toSql();
            // $bindings = $updateItemsPrices->getBindings();
            // dd($sql);
            //$rawSql = Str::replaceArray('?', $bindings, $sql);

            if(!is_numeric($updateItemsPrices)){
                $message = "Update Item Prices: ".$updateItemsPrices;
            }
        }
        if($message == ""){
            $formData = [
                "items_id" => $itemsId, 
                "price" => $data["items_price"], 
                "discount_rate" => $data["items_discount_rate"]
            ];
            $insertItemsPrice = self::create($formData);
            if(!is_numeric($insertItemsPrice->id)){
                $message = $insertItemsPrice;
            }
        }
        $response = $message;
        if($message == ""){
            $response = $insertItemsPrice->id;
        }

        return $response;
    }
}
