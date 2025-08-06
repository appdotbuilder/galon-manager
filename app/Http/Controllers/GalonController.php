<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\GalonTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GalonController extends Controller
{
    /**
     * Display the galon distribution page.
     */
    public function index()
    {
        return Inertia::render('welcome');
    }

    /**
     * Get employee data by ID (for barcode scanning).
     */
    public function show(string $employee_id)
    {
        $employee = Employee::where('employee_id', $employee_id)->first();

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'employee' => [
                'id' => $employee->id,
                'employee_id' => $employee->employee_id,
                'full_name' => $employee->full_name,
                'department' => $employee->department,
                'current_usage' => $employee->getCurrentMonthUsage(),
                'remaining_quota' => $employee->getRemainingQuota(),
                'monthly_quota' => 10
            ]
        ]);
    }

    /**
     * Store a new galon transaction.
     */
    public function store(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|string',
            'quantity' => 'required|integer|min:1|max:10'
        ]);

        $employee = Employee::where('employee_id', $request->employee_id)->first();

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found'
            ], 404);
        }

        $remainingQuota = $employee->getRemainingQuota();

        if ($request->quantity > $remainingQuota) {
            return response()->json([
                'success' => false,
                'message' => "Insufficient quota. Remaining: {$remainingQuota} galons"
            ], 400);
        }

        $transaction = GalonTransaction::create([
            'employee_id' => $employee->id,
            'quantity' => $request->quantity,
            'transaction_date' => now()->toDateString(),
            'month' => now()->month,
            'year' => now()->year,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Transaction successful',
            'transaction' => $transaction,
            'employee' => [
                'id' => $employee->id,
                'employee_id' => $employee->employee_id,
                'full_name' => $employee->full_name,
                'department' => $employee->department,
                'current_usage' => $employee->getCurrentMonthUsage(),
                'remaining_quota' => $employee->getRemainingQuota(),
                'monthly_quota' => 10
            ]
        ]);
    }
}