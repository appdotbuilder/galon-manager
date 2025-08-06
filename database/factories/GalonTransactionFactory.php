<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GalonTransaction>
 */
class GalonTransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $transactionDate = $this->faker->dateTimeBetween('-30 days', 'now');
        
        return [
            'employee_id' => Employee::factory(),
            'quantity' => $this->faker->numberBetween(1, 3),
            'transaction_date' => $transactionDate->format('Y-m-d'),
            'month' => (int) $transactionDate->format('n'),
            'year' => (int) $transactionDate->format('Y'),
        ];
    }
}