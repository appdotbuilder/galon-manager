<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmployeeManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    /**
     * Test employee creation.
     */
    public function test_employee_creation(): void
    {
        $response = $this->actingAs($this->user)
                         ->post('/employees', [
                             'employee_id' => 'EMP001',
                             'full_name' => 'John Doe',
                             'department' => 'IT'
                         ]);

        $response->assertRedirect('/employees');

        $this->assertDatabaseHas('employees', [
            'employee_id' => 'EMP001',
            'full_name' => 'John Doe',
            'department' => 'IT'
        ]);
    }

    /**
     * Test employee creation with duplicate ID fails.
     */
    public function test_employee_creation_duplicate_id_fails(): void
    {
        Employee::factory()->create(['employee_id' => 'EMP001']);

        $response = $this->actingAs($this->user)
                         ->post('/employees', [
                             'employee_id' => 'EMP001',
                             'full_name' => 'John Doe',
                             'department' => 'IT'
                         ]);

        $response->assertSessionHasErrors('employee_id');
    }

    /**
     * Test employee update.
     */
    public function test_employee_update(): void
    {
        $employee = Employee::factory()->create([
            'employee_id' => 'EMP001',
            'full_name' => 'John Doe',
            'department' => 'IT'
        ]);

        $response = $this->actingAs($this->user)
                         ->put("/employees/{$employee->id}", [
                             'employee_id' => 'EMP001',
                             'full_name' => 'John Smith',
                             'department' => 'HR'
                         ]);

        $response->assertRedirect('/employees');

        $this->assertDatabaseHas('employees', [
            'id' => $employee->id,
            'employee_id' => 'EMP001',
            'full_name' => 'John Smith',
            'department' => 'HR'
        ]);
    }

    /**
     * Test employee deletion.
     */
    public function test_employee_deletion(): void
    {
        $employee = Employee::factory()->create();

        $response = $this->actingAs($this->user)
                         ->delete("/employees/{$employee->id}");

        $response->assertRedirect('/employees');

        $this->assertDatabaseMissing('employees', [
            'id' => $employee->id
        ]);
    }

    /**
     * Test employee show page.
     */
    public function test_employee_show_page(): void
    {
        $employee = Employee::factory()->create([
            'employee_id' => 'EMP001',
            'full_name' => 'John Doe',
            'department' => 'IT'
        ]);

        $response = $this->actingAs($this->user)
                         ->get("/employees/{$employee->id}");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('employees/show')
                 ->has('employee')
                 ->where('employee.employee_id', 'EMP001')
                 ->where('employee.full_name', 'John Doe')
        );
    }
}