<?php

namespace App\Shared\Enums;

enum SprintStatus: string
{
    case PENDING = 'pending';
    case IN_PROCESS = 'in_process';
    case COMPLETED = 'completed';
}
