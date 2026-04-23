<?php

namespace App\Shared\Enums;

enum CardPriority: string
{
    case LOW = 'low';
    case MEDIUM = 'medium';
    case HIGH = 'high';
    case BLOCKER = 'blocker';
}
