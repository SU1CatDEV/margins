<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Question>
 */
class QuestionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => 'Please annotate: this is a test',
            'book_id' => 1,
            'user_id' => 2,
            'text' => 'lorem ipsum',
            'likes' => 0,
            'liked_users' => [1]
        ];
    }
}
