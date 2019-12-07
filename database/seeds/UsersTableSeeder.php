<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'IMA ADMIN',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'api_token' => Str::random(80),
        ]);
    }
}
