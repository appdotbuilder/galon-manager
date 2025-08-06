import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Transaction {
    id: number;
    quantity: number;
    transaction_date: string;
    created_at: string;
}

interface Employee {
    id: number;
    employee_id: string;
    full_name: string;
    department: string;
    current_usage: number;
    remaining_quota: number;
    created_at: string;
    transactions: Transaction[];
}

interface Props {
    employee: Employee;
    [key: string]: unknown;
}

export default function ShowEmployee({ employee }: Props) {
    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete ${employee.full_name}?`)) {
            router.delete(route('employees.destroy', employee.id));
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppShell>
            <Head title={employee.full_name} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">👤 {employee.full_name}</h1>
                        <p className="text-gray-600 mt-1">Employee Details & Transaction History</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link href={route('employees.edit', employee.id)}>
                            <Button>
                                ✏️ Edit
                            </Button>
                        </Link>
                        <Button variant="destructive" onClick={handleDelete}>
                            🗑️ Delete
                        </Button>
                        <Link href={route('employees.index')}>
                            <Button variant="outline">
                                ← Back to Employees
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Employee Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <span className="mr-2">📋</span>
                                Employee Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Employee ID
                                </label>
                                <p className="text-lg font-semibold">{employee.employee_id}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <p className="text-lg font-semibold">{employee.full_name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Department
                                </label>
                                <Badge variant="secondary" className="text-sm">
                                    {employee.department}
                                </Badge>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Registered Date
                                </label>
                                <p className="text-sm text-gray-600">
                                    {formatDate(employee.created_at)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quota Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <span className="mr-2">📊</span>
                                Monthly Quota Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">10</div>
                                    <div className="text-sm text-gray-600">Monthly Quota</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {employee.current_usage}
                                    </div>
                                    <div className="text-sm text-gray-600">Used</div>
                                </div>
                                <div className="text-center">
                                    <div className={`text-2xl font-bold ${
                                        employee.remaining_quota > 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {employee.remaining_quota}
                                    </div>
                                    <div className="text-sm text-gray-600">Remaining</div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Usage Progress</span>
                                    <span className="text-sm font-medium">
                                        {employee.current_usage}/10 galons ({((employee.current_usage / 10) * 100).toFixed(0)}%)
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${
                                            employee.current_usage >= 10 ? 'bg-red-600' : 
                                            employee.current_usage >= 7 ? 'bg-orange-600' : 'bg-green-600'
                                        }`}
                                        style={{ width: `${Math.min((employee.current_usage / 10) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Transaction History */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <span className="mr-2">📈</span>
                            Transaction History ({employee.transactions.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {employee.transactions.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-gray-400 text-4xl mb-4">📋</div>
                                <p className="text-gray-500">No transactions found for this employee.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Transaction Time</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {employee.transactions.map((transaction) => (
                                            <TableRow key={transaction.id}>
                                                <TableCell>
                                                    {formatDate(transaction.transaction_date)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {transaction.quantity} galon{transaction.quantity > 1 ? 's' : ''}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    {formatDateTime(transaction.created_at)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}