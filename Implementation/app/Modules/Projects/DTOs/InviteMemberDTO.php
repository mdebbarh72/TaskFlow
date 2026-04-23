<?php

namespace App\Modules\Projects\DTOs;

use App\Shared\Enums\MembershipRole;

class InviteMemberDTO
{
    public function __construct(
        public int            $projectId,
        public string         $email,
        public MembershipRole $role = MembershipRole::MEMBER
    ) {}
}
