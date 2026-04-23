<?php

namespace App\Shared\Enums;

enum MembershipRole: string
{
    case OWNER = 'owner';
    case MANAGER = 'manager';
    case MEMBER = 'member';
    case VIEWER = 'viewer';
}
