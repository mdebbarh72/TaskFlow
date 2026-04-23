<?php

namespace App\Modules\Auth\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Modules\Auth\DTOs\RegisterDTO;

class RegisterRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'username' => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ];
    }

    public function toDTO(): RegisterDTO
    {
        return new RegisterDTO(
            username: $this->username,
            email:    $this->email,
            password: $this->password,
        );
    }
}
