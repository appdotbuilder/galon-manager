<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\GalonTransaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GalonDistributionTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test the main galon distribution page loads.
     */
    public function test_galon_distribution_page_loads(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('welcome'));
    }

    /**
     * Test employee lookup API endpoint.
     */
    public function test_employee_lookup_works(): void
    {
        $employee = Employee::factory()->create([
            'employee_id' => 'EMP001',
            'full_name' => 'John Doe',
            'department' => 'IT'
        ]);

        $response = $this->get('/api/employee/EMP001');

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'employee' => [
                         'employee_id' => 'EMP001',
                         'full_name' => 'John Doe',
                         'department' => 'IT',
                         'current_usage' => 0,
                         'remaining_quota' => 10,
                         'monthly_quota' => 10
                     ]
                 ]);
    }

    /**
     * Test employee lookup with non-existent employee.
     */
    public function test_employee_lookup_not_found(): void
    {
        $response = $this->get('/api/employee/NONEXISTENT');

        $response->assertStatus(404)
                 ->assertJson([
                     'success' => false,
                     'message' => 'Employee not found'
                 ]);
    }

    /**
     * Test galon transaction creation.
     */
    public function test_galon_transaction_creation(): void
    {
        $employee = Employee::factory()->create([
            'employee_id' => 'EMP001'
        ]);

        $response = $this->postJson('/api/galon/transaction', [
            'employee_id' => 'EMP001',
            'quantity' => 2
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Transaction successful'
                 ]);

        $this->assertDatabaseHas('galon_transactions', [
            'employee_id' => $employee->id,
            'quantity' => 2,
            'month' => now()->month,
            'year' => now()->year
        ]);
    }

    /**
     * Test galon transaction with insufficient quota.
     */
    public function test_galon_transaction_insufficient_quota(): void
    {
        $employee = Employee::factory()->create([
            'employee_id' => 'EMP001'
        ]);

        // Create transactions that use up the quota
        GalonTransaction::factory()->create([
            'employee_id' => $employee->id,
            'quantity' => 10,
            'month' => now()->month,
            'year' => now()->year
        ]);

        $response = $this->postJson('/api/galon/transaction', [
            'employee_id' => 'EMP001',
            'quantity' => 1
        ]);

        $response->assertStatus(400)
                 ->assertJson([
                     'success' => false,
                     'message' => 'Insufficient quota. Remaining: 0 galons'
                 ]);
    }

    /**
     * Test employee management requires authentication.
     */
    public function test_employee_management_requires_auth(): void
    {
        $response = $this->get('/employees');
        $response->assertRedirect('/login');
    }

    /**
     * Test authenticated user can access employee management.
     */
    public function test_authenticated_user_can_access_employee_management(): void
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)->get('/employees');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('employees/index'));
    }
}