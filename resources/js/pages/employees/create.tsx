import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CreateEmployee() {
    const { data, setData, post, processing, errors } = useForm({
        employee_id: '',
        full_name: '',
        department: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('employees.store'));
    };

    return (
        <AppShell>
            <Head title="Add Employee" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">➕ Add New Employee</h1>
                        <p className="text-gray-600 mt-1">Create a new employee record</p>
                    </div>
                    <Link href={route('employees.index')}>
                        <Button variant="outline">
                            ← Back to Employees
                        </Button>
                    </Link>
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
                                <Link href={route('employees.index')}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Employee'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card className="max-w-2xl bg-blue-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start space-x-3">
                            <span className="text-blue-600 text-xl">💡</span>
                            <div>
                                <h3 className="font-semibold text-blue-900 mb-2">Employee Quota Information</h3>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• Each employee starts with a monthly quota of 10 galons</li>
                                    <li>• Quotas reset automatically at the beginning of each month</li>
                                    <li>• Transaction history is maintained for reporting</li>
                                    <li>• Employee ID must be unique and will be used for barcode scanning</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}