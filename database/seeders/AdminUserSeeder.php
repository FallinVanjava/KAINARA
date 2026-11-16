<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@kainara.local'],
            ['name' => 'Admin KAINARA', 'password' => Hash::make('kainara2026')],
        );
    }
}