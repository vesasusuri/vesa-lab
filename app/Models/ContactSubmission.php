<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['first_name', 'last_name', 'email', 'notes'])]
class ContactSubmission extends Model
{
    
}
