<?php

namespace App\Modules\Auth\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Modules\Auth\DTOs\LoginDTO;

class LoginRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'email'    => 'required|email',
            'password' => 'required|string',
        ];
    }

    public function toDTO(): LoginDTO
    {
        return new LoginDTO(
            email:     $this->email,
            password:  $this->password,
            ipAddress: $this->ip(),
            userAgent: $this->userAgent(),
        );
    }
}
