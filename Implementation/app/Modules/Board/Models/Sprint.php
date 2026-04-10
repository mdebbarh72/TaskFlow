<?php

namespace App\Modules\Board\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\Projects\Models\Project;
use App\Shared\Traits\HasActivityLog;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Sprint extends Model
{
    use HasActivityLog, HasFactory;

    protected static function newFactory()
    {
        return \Database\Factories\SprintFactory::new();
    }

    protected $fillable = ['project_id', 'name', 'status', 'start_date', 'end_date', 'started_at', 'ended_at', 'description'];

    protected function casts(): array
    {
        return [
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'started_at' => 'datetime',
            'ended_at' => 'datetime',
        ];
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function cards()
    {
        return $this->hasMany(Card::class);
    }
}
