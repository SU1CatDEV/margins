<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Book>
 */
class BookFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => 'Applied Science',
            'author' => 'John Johnson',
            'subjects' => ['Science', 'Applied Science', 'General Science'],
            'description' => 'lorem ispum',
            'ratings' => [3, 2, 5, 5, 5, 4, 2, 5, 4],
            'active_users' => [],
            'user_id' => 1,
            'state' => [],
            'links' => [],
            'private' => false
        ];
    }
}
