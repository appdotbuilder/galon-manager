import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Employee {
    id: number;
    employee_id: string;
    full_name: string;
    department: string;
    current_usage: number;
    remaining_quota: number;
    created_at: string;
}

interface Props {
    employees: {
        data: Employee[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        meta: {
            total: number;
            current_page: number;
            per_page: number;
        };
    };
    [key: string]: unknown;
}

export default function EmployeesIndex({ employees }: Props) {
    const handleDelete = (employee: Employee) => {
        if (confirm(`Are you sure you want to delete ${employee.full_name}?`)) {
            router.delete(route('employees.destroy', employee.id));
        }
    };

    return (
        <AppShell>
            <Head title="Employee Management" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">👥 Employee Management</h1>
                        <p className="text-gray-600 mt-1">Manage employee records and galon quotas</p>
                    </div>
                    <Link href={route('employees.create')}>
                        <Button>
                            ➕ Add Employee
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Employees ({employees.meta.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {employees.data.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-gray-400 text-4xl mb-4">👤</div>
                                <p className="text-gray-500">No employees found.</p>
                                <Link href={route('employees.create')} className="mt-4 inline-block">
                                    <Button>Add First Employee</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Employee ID</TableHead>
                                            <TableHead>Full Name</TableHead>
                                            <TableHead>Department</TableHead>
                                            <TableHead>Current Usage</TableHead>
                                            <TableHead>Remaining Quota</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {employees.data.map((employee) => (
                                            <TableRow key={employee.id}>
                                                <TableCell className="font-medium">
                                                    {employee.employee_id}
                                                </TableCell>
                                                <TableCell>{employee.full_name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">
                                                        {employee.department}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {employee.current_usage} / 10
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        variant={employee.remaining_quota > 0 ? "default" : "destructive"}
                                                    >
                                                        {employee.remaining_quota} galons
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={route('employees.show', employee.id)}
                                                        >
                                                            <Button variant="outline" size="sm">
                                                                👁️ View
                                                            </Button>
                                                        </Link>
                                                        <Link
                                                            href={route('employees.edit', employee.id)}
                                                        >
                                                            <Button variant="outline" size="sm">
                                                                ✏️ Edit
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDelete(employee)}
                                                        >
                                                            🗑️ Delete
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {employees.links.length > 3 && (
                    <div className="flex items-center justify-center space-x-2">
                        {employees.links.map((link, index) => (
                            <div key={index}>
                                {link.url ? (
                                    <Link
                                        href={link.url}
                                        className={`px-3 py-2 text-sm rounded-md ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white text-gray-700 border hover:bg-gray-50'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        className="px-3 py-2 text-sm text-gray-400 rounded-md bg-gray-100"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppShell>
    );
}