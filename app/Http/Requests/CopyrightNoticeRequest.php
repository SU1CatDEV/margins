<?php

namespace App\Http\Requests;

use App\Models\User;
use App\Http\Requests\ReCaptchaRequest;
use Illuminate\Validation\Rule;

class CopyrightNoticeRequest extends ReCaptchaRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            ...parent::rules(),
            "nameOfRequester" => "required|string",
            "nameOfOwner" => "required|string",
            "workTitle" => "required|string",
            "workDescription" => "required|string",
            "infringingMaterial" => "required|string",
            "infringingDescription" => "required|string",
            "locationUrl" => "required|string",
            "infringedWork" => "required|string",
            "email" => "required|email",
            "phone" => "required|integer|min_digits:10",
            "post" => "required|string",
            "preference" => "required|string",
            "fullName" => "required|string",
            "eSignature" => "required|string",
            "goodFaith" => "required|accepted",
            "informationAccuracy" => "required|accepted"
        ];
    }
}
