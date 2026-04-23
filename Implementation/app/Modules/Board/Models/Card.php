<?php

namespace App\Modules\Board\Models;

use Illuminate\Database\Eloquent\Model;
use App\Shared\Traits\HasActivityLog;
use App\Modules\Users\Models\User;

class Card extends Model
{
    use HasActivityLog;

    protected $fillable = [
        'project_id', 'sprint_id', 'title', 'description', 'status', 'priority', 'assignee_id', 'created_by'
    ];

    public function project()
    {
        return $this->belongsTo(\App\Modules\Projects\Models\Project::class);
    }

    public function sprint()
    {
        return $this->belongsTo(Sprint::class);
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
