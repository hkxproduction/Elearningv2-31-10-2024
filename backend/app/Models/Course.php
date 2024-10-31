<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 
        'status', 
        'category', 
        'sub_category',
        'banner' 
    ];

    // protected $appends = ['banner_url'];

    // public function getBannerUrlAttribute()
    // {
    //     if ($this->banner) {
    //         return url(Storage::url($this->banner));
    //     }
    //     return null;
    // }
}
