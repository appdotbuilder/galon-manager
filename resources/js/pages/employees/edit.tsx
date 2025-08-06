import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Employee {
    id: number;
    employee_id: string;
    full_name: string;
    department: string;
}

interface Props {
    employee: Employee;
    [key: string]: unknown;
}

export default function EditEmployee({ employee }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        employee_id: employee.employee_id,
        full_name: employee.full_name,
        department: employee.department,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('employees.update', employee.id));
    };

    return (
        <AppShell>
            <Head title={`Edit ${employee.full_name}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">✏️ Edit Employee</h1>
                        <p className="text-gray-600 mt-1">Update employee information</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link href={route('employees.show', employee.id)}>
                            <Button variant="outline">
                                👁️ View
                            </Button>
                        </Link>
                        <Link href={route('employees.index')}>
                            <Button variant="outline">
                                ← Back to Employees
                            </Button>
                        </Link>
                    </div>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Employee Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="employee_id">Employee ID</Label>
                                <Input
                                    id="employee_id"
                                    type="text"
                                    value={data.employee_id}
                                    onChange={(e) => setData('employee_id', e.target.value)}
                                    placeholder="e.g., EMP001"
                                    className={errors.employee_id ? 'border-red-500' : ''}
                                />
                                {errors.employee_id && (
                                    <p className="text-sm text-red-600">{errors.employee_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="full_name">Full Name</Label>
                                <Input
                                    id="full_name"
                                    type="text"
                                    value={data.full_name}
                                    onChange={(e) => setData('full_name', e.target.value)}
                                    placeholder="e.g., John Doe"
                                    className={errors.full_name ? 'border-red-500' : ''}
                                />
                                {errors.full_name && (
                                    <p className="text-sm text-red-600">{errors.full_name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <Input
                                    id="department"
                                    type="text"
                                    value={data.department}
                                    onChange={(e) => setData('department', e.target.value)}
                                    placeholder="e.g., IT, HR, Finance"
                                    className={errors.department ? 'border-red-500' : ''}
                                />
                                {errors.department && (
                                    <p className="text-sm text-red-600">{errors.department}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-end space-x-4 pt-4">
                                <Link href={route('employees.show', employee.id)}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Employee'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}