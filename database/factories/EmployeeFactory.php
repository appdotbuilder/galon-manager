<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $departments = [
            'IT', 'Human Resources', 'Finance', 'Marketing', 
            'Operations', 'Sales', 'Production', 'Quality Control'
        ];

        return [
            'employee_id' => 'EMP' . $this->faker->unique()->numberBetween(1000, 9999),
            'full_name' => $this->faker->name(),
            'department' => $this->faker->randomElement($departments),
        ];
    }
}