<?php

namespace App\Shared\Enums;

enum SprintStatus: string
{
    case PENDING = 'pending';
    case ACTIVE = 'active';
    case COMPLETED = 'completed';
}
