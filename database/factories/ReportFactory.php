<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Report>
 */
class ReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "name_requester" => "test",
            "name_owner" => "test",
            "work_title" => "test",
            "work_description" => "test",
            "infringing_material" => "test",
            "infringing_description" => "test",
            "location_url" => "test",
            "infringed_work" => "test",
            "email" => "test@test.co",
            "phone" => 12345676543,
            "post" => "test",
            "preference" => "test",
            "full_name" => "test",
            "esignature" => "test",
            "reporter" => 2,
            "infringer" => 1,
            "book_id" => 1
        ];
    }
}
