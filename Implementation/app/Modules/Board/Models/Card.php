<?php

namespace App\Modules\Board\Models;

use Illuminate\Database\Eloquent\Model;
use App\Shared\Traits\HasActivityLog;
use App\Modules\Users\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Card extends Model
{
    use HasActivityLog, HasFactory;

    protected static function newFactory()
    {
        return \Database\Factories\CardFactory::new();
    }

    protected $fillable = [
        'project_id', 'sprint_id', 'title', 'description', 'status', 'priority', 'assignee_id', 'created_by', 'start_date', 'end_date'
    ];

    protected $appends = ['project_task_number'];

    public function getProjectTaskNumberAttribute()
    {
        return static::where('project_id', $this->project_id)
            ->where('id', '<=', $this->id)
            ->count();
    }

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

    public function subtasks()
    {
        return $this->hasMany(Subtask::class);
    }

    public function comments()
    {
        return $this->hasMany(\App\Modules\Collaboration\Models\Comment::class);
    }

    protected function casts(): array
    {
        return [
            'start_date' => 'datetime',
            'end_date' => 'datetime',
        ];
    }
}
