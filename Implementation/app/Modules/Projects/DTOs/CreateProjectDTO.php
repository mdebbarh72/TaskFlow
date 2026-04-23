<?php

namespace App\Modules\Projects\DTOs;

class CreateProjectDTO
{
    public function __construct(
        public readonly string  $name,
        public readonly ?string $description,
        public readonly int     $ownerId,
    ) {}
}
