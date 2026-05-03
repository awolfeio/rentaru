import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, ChevronLeft, MapPin, Plus, Sparkles, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { MOCK_TENANTS } from '@/shared/mockData/tenants';
import {
    PARKING_ASSIGNMENT_OPTIONS,
    getParkingAssignmentLabel,
    getVehiclePowertrainLabel,
} from '@/shared/lib/tenantVehicles';
import type {
    ParkingAssignment,
    TenantVehicle,
    VehiclePowertrain,
} from '@/shared/types/tenant';

const ACTIVE_TENANT_ID = 't1';

type VehicleFormState = {
    title: string;
    year: string;
    color: string;
    licensePlate: string;
    powertrain: VehiclePowertrain;
    parkingAssignment: ParkingAssignment;
};

const INITIAL_FORM_STATE: VehicleFormState = {
    title: '',
    year: '',
    color: '',
    licensePlate: '',
    powertrain: 'non_electric',
    parkingAssignment: 'unassigned_open_lot_parking',
};

export default function TenantVehicles() {
    const navigate = useNavigate();
    const tenant = MOCK_TENANTS.find(({ id }) => id === ACTIVE_TENANT_ID);
    const [isAddingVehicle, setIsAddingVehicle] = useState(false);
    const [formState, setFormState] = useState<VehicleFormState>(INITIAL_FORM_STATE);
    const [vehicles, setVehicles] = useState<TenantVehicle[]>(tenant?.vehicles ?? []);

    if (!tenant) {
        return (
            <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
                <h1 className="text-2xl font-bold tracking-tight">Vehicles</h1>
                <p className="mt-2 text-sm text-muted-foreground">Tenant vehicle data is unavailable for this view.</p>
            </div>
        );
    }

    const electricCount = vehicles.filter(({ powertrain }) => powertrain === 'electric').length;
    const assignedCount = vehicles.filter(
        ({ parkingAssignment }) => parkingAssignment !== 'unassigned_open_lot_parking'
    ).length;

    const handleFieldChange =
        (field: keyof VehicleFormState) =>
        (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            setFormState((current) => ({ ...current, [field]: event.target.value }));
        };

    const handleAddVehicle = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newVehicle: TenantVehicle = {
            id: `tenant-vehicle-${Date.now()}`,
            title: formState.title.trim(),
            year: Number(formState.year),
            color: formState.color.trim(),
            licensePlate: formState.licensePlate.trim().toUpperCase(),
            powertrain: formState.powertrain,
            parkingAssignment: formState.parkingAssignment,
        };

        setVehicles((current) => [newVehicle, ...current]);
        setFormState(INITIAL_FORM_STATE);
        setIsAddingVehicle(false);
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <button
                        onClick={() => navigate('/tenant/unit')}
                        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ChevronLeft size={16} />
                        Back to My Unit
                    </button>
                    <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
                    <p className="mt-1 text-muted-foreground">
                        Manage registered vehicles and parking spot assignments for Unit {tenant.unitNumber}.
                    </p>
                </div>

                <button
                    onClick={() => setIsAddingVehicle(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                    <Plus size={16} />
                    Add New Vehicle
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white"
            >
                <div className="grid gap-4 md:grid-cols-3">
                    <SummaryCard
                        icon={Car}
                        label="Vehicles On File"
                        value={vehicles.length.toString()}
                        hint="Active household vehicle records"
                    />
                    <SummaryCard
                        icon={Sparkles}
                        label="Electric Vehicles"
                        value={electricCount.toString()}
                        hint="EVs registered to the lease"
                    />
                    <SummaryCard
                        icon={MapPin}
                        label="Assigned Spots"
                        value={assignedCount.toString()}
                        hint="Vehicles with a specific assignment"
                    />
                </div>
            </motion.div>

            {isAddingVehicle && (
                <motion.form
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleAddVehicle}
                    className="rounded-2xl border bg-card p-6 shadow-sm"
                >
                    <div className="mb-6 flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">Add New Vehicle</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Add a vehicle and choose the parking spot assignment for this unit.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setIsAddingVehicle(false);
                                setFormState(INITIAL_FORM_STATE);
                            }}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Cancel
                        </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <Field label="Vehicle Title">
                            <input
                                required
                                value={formState.title}
                                onChange={handleFieldChange('title')}
                                placeholder="Example: Toyota RAV4"
                                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                            />
                        </Field>

                        <Field label="Year">
                            <input
                                required
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={formState.year}
                                onChange={handleFieldChange('year')}
                                placeholder="2024"
                                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                            />
                        </Field>

                        <Field label="Color">
                            <input
                                required
                                value={formState.color}
                                onChange={handleFieldChange('color')}
                                placeholder="Midnight Blue"
                                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                            />
                        </Field>

                        <Field label="License Plate">
                            <input
                                required
                                value={formState.licensePlate}
                                onChange={handleFieldChange('licensePlate')}
                                placeholder="8ABC123"
                                className="w-full rounded-xl border bg-background px-4 py-3 text-sm uppercase outline-none transition-colors focus:border-primary"
                            />
                        </Field>

                        <Field label="Vehicle Type">
                            <select
                                value={formState.powertrain}
                                onChange={handleFieldChange('powertrain')}
                                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                            >
                                <option value="non_electric">Non Electric</option>
                                <option value="electric">Electric</option>
                            </select>
                        </Field>

                        <Field label="Spot Assignment">
                            <select
                                value={formState.parkingAssignment}
                                onChange={handleFieldChange('parkingAssignment')}
                                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                            >
                                {PARKING_ASSIGNMENT_OPTIONS.map(({ value, label }) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </Field>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            <Plus size={16} />
                            Save Vehicle
                        </button>
                        <p className="text-sm text-muted-foreground">
                            New vehicles are added to the current mock session view.
                        </p>
                    </div>
                </motion.form>
            )}

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {vehicles.map((vehicle) => (
                    <motion.div
                        key={vehicle.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border bg-card p-6 shadow-sm"
                    >
                        <div className="flex flex-col gap-4">
                            <div>
                                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <h2 className="text-2xl font-bold tracking-tight">{vehicle.title}</h2>
                                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                        <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                                            {getParkingAssignmentLabel(vehicle.parkingAssignment)}
                                        </span>
                                        <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-700">
                                            {getVehiclePowertrainLabel(vehicle.powertrain)}
                                        </span>
                                    </div>
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    License plate {vehicle.licensePlate}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            <VehicleDetail label="Vehicle Title" value={vehicle.title} />
                            <VehicleDetail label="Year" value={vehicle.year.toString()} />
                            <VehicleDetail label="Color" value={vehicle.color} />
                            <VehicleDetail label="License Plate" value={vehicle.licensePlate} />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function SummaryCard({
    icon: Icon,
    label,
    value,
    hint,
}: {
    icon: LucideIcon;
    label: string;
    value: string;
    hint: string;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <Icon size={18} className="mb-3 text-slate-300" />
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
            <p className="mt-2 text-sm text-slate-300">{hint}</p>
        </div>
    );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
            {children}
        </label>
    );
}

function VehicleDetail({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border bg-muted/20 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
        </div>
    );
}
