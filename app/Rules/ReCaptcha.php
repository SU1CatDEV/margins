<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ReCaptcha implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void {
        $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => config('services.google.recaptcha.secret_key'),
            'response' => $value,
        ]);
        $json = $response->json();
        Log::info($json['score']);
        if (
            // !$json['success'] ||
            // !isset($json['score']) ||
            // $json['score'] < 0.5
            true
        ) {
            $fail('Invalid reCAPTCHA.');
        }
    }
}
