import { useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    Calendar,
    CheckCircle2,
    Clock,
    Home,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { MOCK_PROPERTIES } from '@/shared/mockData/properties';
import { MOCK_TENANTS } from '@/shared/mockData/tenants';
import { MOCK_TENANT_RESERVATIONS } from '@/shared/mockData/tenantReservations';
import { cn } from '@/shared/lib/utils';

const ACTIVE_TENANT_ID = 't1';

const statusTone = {
    confirmed: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    pending_approval: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    completed: 'bg-slate-500/10 text-slate-700 border-slate-500/20',
    canceled: 'bg-slate-500/10 text-slate-700 border-slate-500/20',
} as const;

export default function TenantAmenities() {
    const navigate = useNavigate();
    const tenant = MOCK_TENANTS.find(({ id }) => id === ACTIVE_TENANT_ID);

    if (!tenant) {
        return (
            <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
                <h1 className="text-2xl font-bold tracking-tight">Amenities</h1>
                <p className="mt-2 text-sm text-muted-foreground">Tenant mock data is unavailable for this view.</p>
            </div>
        );
    }

    const property = MOCK_PROPERTIES.find(({ id }) => id === tenant.propertyId);
    const amenities = property?.amenities ?? [];
    const reservations = MOCK_TENANT_RESERVATIONS.filter(({ tenantId }) => tenantId === tenant.id);
    const amenitiesEnabled = Boolean(property?.features?.amenities && amenities.length > 0);

    if (!amenitiesEnabled) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Amenities</h1>
                    <p className="mt-1 text-muted-foreground">This property does not currently offer online amenity reservations.</p>
                </div>
                <div className="rounded-3xl border border-dashed bg-card p-10 text-center">
                    <p className="text-base font-semibold text-foreground">No amenity reservations available</p>
                    <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
                        If you need parking, common-space access, or another shared resource, contact the property team directly.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <Home size={14} />
                        <span>{tenant.propertyName}</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Amenities</h1>
                    <p className="mt-1 text-muted-foreground">
                        Browse shared spaces and manage reservations available to Unit {tenant.unitNumber}.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/tenant/home')}
                    className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
                >
                    Back to Home
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white"
            >
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200">
                            <Sparkles size={14} />
                            Property-enabled reservations
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Reserve shared spaces and services</h2>
                            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
                                Book clubrooms, guest stays, parking, and other property resources without calling the office.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Amenities</p>
                            <p className="mt-2 text-2xl font-bold">{amenities.length}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Reservations</p>
                            <p className="mt-2 text-2xl font-bold">{reservations.length}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Approval Items</p>
                            <p className="mt-2 text-2xl font-bold">
                                {reservations.filter(({ status }) => status === 'pending_approval').length}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <section className="space-y-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold tracking-tight">Browse Amenities</h2>
                    <p className="text-sm text-muted-foreground">
                        Amenity availability, pricing, and booking rules are configured by the property.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                    {amenities.map((amenity) => (
                        <div key={amenity.id} className="rounded-2xl border bg-card p-5 shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <Sparkles size={20} />
                                </div>
                                <div className="flex flex-wrap justify-end gap-2">
                                    <span
                                        className={cn(
                                            'rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                                            amenity.approvalRequired
                                                ? 'border-amber-500/20 bg-amber-500/10 text-amber-700'
                                                : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700'
                                        )}
                                    >
                                        {amenity.approvalRequired ? 'Requires Approval' : 'Instant Booking'}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 space-y-2">
                                <p className="text-lg font-semibold text-foreground">{amenity.name}</p>
                                <p className="text-sm leading-relaxed text-muted-foreground">{amenity.description}</p>
                            </div>
                            <div className="mt-5 flex items-center justify-between gap-4 border-t pt-4 text-sm">
                                <div>
                                    <p className="font-semibold text-foreground">{amenity.pricingLabel}</p>
                                    <p className="text-xs text-muted-foreground">{amenity.availabilityLabel ?? 'Availability set by property'}</p>
                                </div>
                                <button className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 font-semibold transition-colors hover:bg-muted">
                                    Book
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold tracking-tight">My Reservations</h2>
                    <p className="text-sm text-muted-foreground">Track reservation statuses and upcoming amenity usage.</p>
                </div>
                {reservations.length > 0 ? (
                    <div className="grid gap-3">
                        {reservations.map((reservation) => (
                            <div key={reservation.id} className="rounded-2xl border bg-card p-5 shadow-sm">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="text-lg font-semibold text-foreground">{reservation.amenityName}</p>
                                            <span
                                                className={cn(
                                                    'rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                                                    statusTone[reservation.status]
                                                )}
                                            >
                                                {reservation.status.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                            <span className="inline-flex items-center gap-1.5">
                                                <Calendar size={14} />
                                                {reservation.scheduleLabel}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5">
                                                <Clock size={14} />
                                                {reservation.feeLabel}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {reservation.status === 'confirmed' ? (
                                            <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-700">
                                                <CheckCircle2 size={16} />
                                                Confirmed
                                            </span>
                                        ) : null}
                                        {reservation.requiresApproval ? (
                                            <span className="inline-flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-sm font-semibold text-amber-700">
                                                <ShieldCheck size={16} />
                                                Awaiting review
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border-2 border-dashed bg-muted/20 p-10 text-center">
                        <p className="text-sm font-semibold text-foreground">No reservations yet</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Reserve an amenity above to see your bookings and approvals here.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
