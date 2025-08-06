<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\GalonTransaction
 *
 * @property int $id
 * @property int $employee_id
 * @property int $quantity
 * @property string $transaction_date
 * @property int $month
 * @property int $year
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Employee $employee
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|GalonTransaction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|GalonTransaction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|GalonTransaction query()
 * @method static \Illuminate\Database\Eloquent\Builder|GalonTransaction whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GalonTransaction whereEmployeeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GalonTransaction whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GalonTransaction whereMonth($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GalonTransaction whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GalonTransaction whereTransactionDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GalonTransaction whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GalonTransaction whereYear($value)
 * @method static \Database\Factories\GalonTransactionFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class GalonTransaction extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'employee_id',
        'quantity',
        'transaction_date',
        'month',
        'year',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'transaction_date' => 'date',
        'quantity' => 'integer',
        'month' => 'integer',
        'year' => 'integer',
        'employee_id' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the employee that owns the transaction.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}