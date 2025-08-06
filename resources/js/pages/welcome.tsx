import React, { useState, useEffect, useCallback } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

interface Employee {
    id: number;
    employee_id: string;
    full_name: string;
    department: string;
    current_usage: number;
    remaining_quota: number;
    monthly_quota: number;
}

interface Props {
    auth?: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    [key: string]: unknown;
}

export default function Welcome({ auth }: Props) {
    const [employeeId, setEmployeeId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isScanning, setIsScanning] = useState(true);

    const handleEmployeeLookup = useCallback(async (id: string = employeeId) => {
        if (!id.trim()) {
            setMessage({ type: 'error', text: 'Please enter an Employee ID' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch(`/api/employee/${encodeURIComponent(id.trim())}`);
            const data = await response.json();

            if (data.success) {
                setEmployee(data.employee);
                setQuantity(1);
                setMessage(null);
                setIsScanning(false); // Disable scanning after successful lookup
            } else {
                setEmployee(null);
                setMessage({ type: 'error', text: data.message });
            }
        } catch {
            setEmployee(null);
            setMessage({ type: 'error', text: 'Error looking up employee' });
        }

        setLoading(false);
    }, [employeeId]);

    // Listen for barcode scanner input (Arduino)
    useEffect(() => {
        let barcodeBuffer = '';
        let timeout: NodeJS.Timeout;

        const handleKeyPress = (event: KeyboardEvent) => {
            if (!isScanning) return;

            // If Enter key is pressed, process the barcode
            if (event.key === 'Enter') {
                if (barcodeBuffer.trim()) {
                    setEmployeeId(barcodeBuffer.trim());
                    handleEmployeeLookup(barcodeBuffer.trim());
                }
                barcodeBuffer = '';
                return;
            }

            // Accumulate characters for barcode
            barcodeBuffer += event.key;

            // Clear buffer after 100ms of inactivity
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                barcodeBuffer = '';
            }, 100);
        };

        document.addEventListener('keypress', handleKeyPress);
        
        return () => {
            document.removeEventListener('keypress', handleKeyPress);
            clearTimeout(timeout);
        };
    }, [isScanning, handleEmployeeLookup]);

    const handleTransaction = async () => {
        if (!employee || quantity < 1) return;

        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch('/api/galon/transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({
                    employee_id: employee.employee_id,
                    quantity: quantity,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setEmployee(data.employee);
                setMessage({ type: 'success', text: data.message });
                
                // Reset form after successful transaction
                setTimeout(() => {
                    setEmployee(null);
                    setEmployeeId('');
                    setQuantity(1);
                    setMessage(null);
                    setIsScanning(true); // Re-enable scanning
                }, 3000);
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch {
            setMessage({ type: 'error', text: 'Error processing transaction' });
        }

        setLoading(false);
    };

    const resetForm = () => {
        setEmployee(null);
        setEmployeeId('');
        setQuantity(1);
        setMessage(null);
        setIsScanning(true);
    };

    return (
        <>
            <Head title="PT Tirta Investama - Galon Distribution" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-blue-600 p-3 rounded-full mr-4">
                                <span className="text-2xl">🚰</span>
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                PT Tirta Investama
                            </h1>
                        </div>
                        <p className="text-xl text-gray-600 mb-6">
                            Galon Distribution Management System
                        </p>
                        
                        {auth?.user ? (
                            <div className="flex items-center justify-center space-x-4">
                                <Link
                                    href="/employees"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    👥 Manage Employees
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    📊 Dashboard
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center space-x-4">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    🔑 Admin Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    📝 Register
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Employee Lookup Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <span className="mr-2">🔍</span>
                                    Employee Lookup
                                </CardTitle>
                                <CardDescription>
                                    Scan barcode or enter Employee ID manually
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700">
                                        Employee ID
                                    </label>
                                    <div className="flex space-x-2">
                                        <Input
                                            id="employee_id"
                                            type="text"
                                            value={employeeId}
                                            onChange={(e) => setEmployeeId(e.target.value)}
                                            placeholder="Scan barcode or enter ID"
                                            className="flex-1"
                                            disabled={loading}
                                        />
                                        <Button
                                            onClick={() => handleEmployeeLookup()}
                                            disabled={loading || !employeeId.trim()}
                                            className="min-w-[100px]"
                                        >
                                            {loading ? 'Looking up...' : 'Lookup'}
                                        </Button>
                                    </div>
                                </div>

                                {isScanning && (
                                    <Alert>
                                        <span className="text-lg mr-2">📱</span>
                                        <AlertDescription>
                                            Ready to receive barcode scan from external device...
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {message && (
                                    <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                                        <AlertDescription>{message.text}</AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>

                        {/* Feature Highlights */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <span className="mr-2">✨</span>
                                    Key Features
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-xl">📊</span>
                                        <span>Real-time quota tracking</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-xl">🔄</span>
                                        <span>Monthly quota reset (10 galons/month)</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-xl">📱</span>
                                        <span>Arduino barcode scanner support</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-xl">👥</span>
                                        <span>Employee management system</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-xl">📈</span>
                                        <span>Transaction history & reporting</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Employee Information & Transaction */}
                    {employee && (
                        <Card className="mt-8">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span className="flex items-center">
                                        <span className="mr-2">👤</span>
                                        Employee Information
                                    </span>
                                    <Button variant="outline" size="sm" onClick={resetForm}>
                                        Reset
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
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
                                            <Badge variant="secondary">{employee.department}</Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Monthly Quota Status
                                            </label>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="text-sm text-gray-600">Used:</span>
                                                <Badge variant="outline">
                                                    {employee.current_usage} / {employee.monthly_quota} galons
                                                </Badge>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-gray-600">Remaining:</span>
                                                <Badge variant={employee.remaining_quota > 0 ? "default" : "destructive"}>
                                                    {employee.remaining_quota} galons
                                                </Badge>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="space-y-3">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Quantity to Take
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                    disabled={quantity <= 1}
                                                >
                                                    -
                                                </Button>
                                                <Input
                                                    type="number"
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(Math.max(1, Math.min(employee.remaining_quota, parseInt(e.target.value) || 1)))}
                                                    min="1"
                                                    max={employee.remaining_quota}
                                                    className="w-20 text-center"
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setQuantity(Math.min(employee.remaining_quota, quantity + 1))}
                                                    disabled={quantity >= employee.remaining_quota}
                                                >
                                                    +
                                                </Button>
                                                <span className="text-sm text-gray-600">galons</span>
                                            </div>

                                            <Button
                                                onClick={handleTransaction}
                                                disabled={loading || quantity < 1 || quantity > employee.remaining_quota}
                                                className="w-full"
                                                size="lg"
                                            >
                                                {loading ? 'Processing...' : `Take ${quantity} Galon${quantity > 1 ? 's' : ''}`}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}