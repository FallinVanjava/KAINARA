<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@kainara.local');
        $password = env('ADMIN_PASSWORD');

        if (empty($password)) {
            $this->command->warn('ADMIN_PASSWORD not set. Skipping admin user creation.');
            return;
        }

        $user = User::firstOrNew(['email' => $email]);
        $user->name = 'Admin KAINARA';
        $user->password = Hash::make($password);
        $user->save();

        $this->command->info("Admin user upserted: {$email}");
    }
}
