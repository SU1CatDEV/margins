<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Question;
use App\Models\Reply;
use App\Models\Report;
use App\Models\Solution;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'username' => 'mytestuser',
            'name' => 'me',
            'email' => 'test1@example.com',
            'pronouns' => 'she/her',
            'education' => 'self-educated',
            'bio' => 'lorem ipsum or smth like dat idk',
            'banned' => true,
            'ban_reason' => 'You have accumulated three copyright strikes on your content.'
        ]);

        User::factory()->create([
            'username' => 'testuser',
            'email' => 'test2@example.com',
            'pronouns' => 'she/her',
            'education' => 'caltech',
            'work' => 'at&t',
            'bio' => 'yayayayyayayayayayayayayayayayay yayayayayyaya yayayayayyayayayaya',
            'name' => 'user'
        ]);

        // Book::factory()->create([
        //     'title' => 'Applied Science',
        //     'author' => 'John Johnson',
        //     'subjects' => ['Science', 'Applied Science', 'general science'],
        //     'description' => 'lorem ispum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lalalalalalallala lalalalelela lalalalalale lalalalelela shalalalala!!',
        //     'ratings' => [2 => 3],
        //     'active_users' => 0,
        //     'user_id' => 1,
        //     'state' => [],
        //     'links' => []
        // ]);

        Book::factory(2)->create();
        Report::factory(1)->create();

        // Question::factory(10)->create();

        // Solution::factory(10)->create();

        // Reply::factory()->create([
        //     'text' => 'reply to question 1',
        //     'liked_users' => [],
        //     'question_id' => 1,
        //     'solution_id' => null,
        //     'user_id' => 1,
        //     'previous' => null,
        //     'thread' => null,
        // ]);

        // Reply::factory()->create([
        //     'text' => 'reply to thread 1',
        //     'liked_users' => [],
        //     'question_id' => 1,
        //     'solution_id' => null,
        //     'user_id' => 2,
        //     'previous' => 1,
        //     'thread' => 1,
        // ]);

        // Reply::factory()->create([
        //     'text' => 'reply to thread 1 but more',
        //     'liked_users' => [],
        //     'question_id' => 1,
        //     'solution_id' => null,
        //     'user_id' => 1,
        //     'previous' => 2,
        //     'thread' => 1,
        // ]);

        // Reply::factory()->create([
        //     'text' => 'second thread start!',
        //     'liked_users' => [],
        //     'question_id' => 1,
        //     'solution_id' => null,
        //     'user_id' => 1,
        //     'previous' => null,
        //     'thread' => null,
        // ]);

        // Reply::factory()->create([
        //     'text' => 'reply to thread TWO YAY',
        //     'liked_users' => [],
        //     'question_id' => 1,
        //     'solution_id' => null,
        //     'user_id' => 2,
        //     'previous' => 4,
        //     'thread' => 4,
        // ]);

        // Reply::factory()->create([
        //     'text' => 'second replyyy to second threadddd yaey',
        //     'liked_users' => [],
        //     'question_id' => 1,
        //     'solution_id' => null,
        //     'user_id' => 1,
        //     'previous' => 5,
        //     'thread' => 4,
        // ]);
    }
}
