<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Solution>
 */
class SolutionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'keywords' => ['mechanics', 'acceleration', 'force'],
            'problem_text' => 'problem text lorem ipsum',
            'solution_text' => 'solution text lorem ipsum',
            'problem_number' => '11.1',
            'user_id' => 1,
            'book_id' => 1,
            'likes' => 0,
            'liked_users' => [2],
        ];
    }
}
