<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Employee;
use App\Models\GalonTransaction;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::factory()->create([
            'name' => 'Admin PT Tirta Investama',
            'email' => 'admin@tirtainvestama.com',
        ]);

        // Create sample employees
        $employees = Employee::factory(10)->create();

        // Create some sample transactions for the employees
        foreach ($employees as $employee) {
            // Random number of transactions (0-5 per employee)
            $transactionCount = random_int(0, 5);
            
            for ($i = 0; $i < $transactionCount; $i++) {
                GalonTransaction::factory()->create([
                    'employee_id' => $employee->id,
                ]);
            }
        }
    }
}
