<?php

namespace App\Shared\Enums;

enum MembershipStatus: string
{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
}
