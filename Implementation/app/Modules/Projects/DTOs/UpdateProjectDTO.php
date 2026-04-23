<?php

namespace App\Modules\Projects\DTOs;

class UpdateProjectDTO
{
    public function __construct(
        public readonly ?string $name = null,
        public readonly ?string $description = null,
    ) {}
}
