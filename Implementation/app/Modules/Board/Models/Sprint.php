<?php

namespace App\Modules\Board\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\Projects\Models\Project;
use App\Shared\Traits\HasActivityLog;

class Sprint extends Model
{
    use HasActivityLog;

    protected $fillable = ['project_id', 'name', 'status', 'start_date', 'end_date', 'description'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function cards()
    {
        return $this->hasMany(Card::class);
    }
}
