import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AlertCircle,
    ArrowRight,
    Calendar,
    Car,
    CheckCircle2,
    ChevronRight,
    Clock,
    CreditCard,
    DollarSign,
    FileText,
    Home as HomeIcon,
    MessageSquare,
    ShieldCheck,
    Sparkles,
    Wrench,
    type LucideIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { differenceInCalendarDays, format } from 'date-fns';
import { cn } from '@/shared/lib/utils';
import { MOCK_PROPERTIES } from '@/shared/mockData/properties';
import { MOCK_TENANTS } from '@/shared/mockData/tenants';
import {
    MOCK_TENANT_RESERVATIONS,
    type TenantReservation,
} from '@/shared/mockData/tenantReservations';

const ACTIVE_TENANT_ID = 't1';
const MOCK_NOW = new Date('2024-01-12T09:00:00');
const NEXT_RENT_DUE = new Date('2024-02-01T00:00:00');
const RENT_DUE_DATE = new Date('2024-01-01T00:00:00');

type ActivityTab = 'maintenance' | 'payments' | 'messages' | 'reservations' | 'upcoming';

type HomeMaintenanceTicket = {
    id: string;
    title: string;
    status: 'submitted' | 'scheduled' | 'in_progress';
    updatedLabel: string;
    priority: 'normal' | 'high';
};

type HomeMessage = {
    id: string;
    sender: string;
    subject: string;
    preview: string;
    dateLabel: string;
    unread: boolean;
};

type HomePayment = {
    id: string;
    dateLabel: string;
    amount: number;
    label: string;
    status: 'paid';
};

type UpcomingItem = {
    id: string;
    title: string;
    dateLabel: string;
    detail: string;
    icon: LucideIcon;
    tone: 'default' | 'action' | 'success';
};

const HOME_ACTIVITY = {
    maintenance: [
        {
            id: 'm1',
            title: 'Water leak under sink',
            status: 'in_progress',
            updatedLabel: 'Updated 2 hours ago',
            priority: 'high',
        },
    ] satisfies HomeMaintenanceTicket[],
    messages: [
        {
            id: 'msg-1',
            sender: 'Sarah Chen',
            subject: 'Parking structure cleaning',
            preview: 'Please move your vehicle from the garage by 8:00 AM on Jan 18 for pressure washing.',
            dateLabel: 'Yesterday',
            unread: true,
        },
        {
            id: 'msg-2',
            sender: 'Leasing Team',
            subject: 'Renewal offer available',
            preview: 'Your renewal options are ready to review before your current term ends on Feb 15.',
            dateLabel: '2 days ago',
            unread: true,
        },
        {
            id: 'msg-3',
            sender: 'System',
            subject: 'Rent receipt - December 2023',
            preview: 'We received your December payment and saved the receipt to your documents.',
            dateLabel: 'Dec 1',
            unread: false,
        },
    ] satisfies HomeMessage[],
    recentPayments: [
        {
            id: 'pay-1',
            dateLabel: 'Dec 1, 2023',
            amount: 1450,
            label: 'Rent payment',
            status: 'paid',
        },
        {
            id: 'pay-2',
            dateLabel: 'Nov 1, 2023',
            amount: 1450,
            label: 'Rent payment',
            status: 'paid',
        },
        {
            id: 'pay-3',
            dateLabel: 'Oct 1, 2023',
            amount: 1450,
            label: 'Rent payment',
            status: 'paid',
        },
    ] satisfies HomePayment[],
    inspections: [
        {
            id: 'inspection-1',
            title: 'HVAC filter inspection',
            dateLabel: 'Jan 20',
            detail: 'Scheduled 10:00 AM - 12:00 PM',
        },
    ],
};

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
        paid: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
        in_progress: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
        scheduled: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
        submitted: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
        confirmed: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
        pending_approval: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
        completed: 'bg-slate-500/10 text-slate-700 border-slate-500/20',
        canceled: 'bg-slate-500/10 text-slate-700 border-slate-500/20',
        high: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
        overdue: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
        default: 'bg-slate-100 text-slate-600 border-slate-200',
    } as const;

    const styleKey = status in styles ? (status as keyof typeof styles) : 'default';

    return (
        <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide', styles[styleKey])}>
            {status.replace(/_/g, ' ')}
        </span>
    );
};

const QuickActionCard = ({
    icon: Icon,
    title,
    description,
    ctaLabel,
    onClick,
    badge,
}: {
    icon: LucideIcon;
    title: string;
    description: string;
    ctaLabel: string;
    onClick: () => void;
    badge?: string;
}) => (
    <button
        onClick={onClick}
        className="group rounded-2xl border bg-card p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
    >
        <div className="flex items-start justify-between gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon size={20} />
            </div>
            {badge ? (
                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                    {badge}
                </span>
            ) : null}
        </div>
        <div className="mt-4 space-y-2">
            <p className="text-base font-semibold text-foreground">{title}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
        <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            {ctaLabel}
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </div>
    </button>
);

const EmptyState = ({ title, description }: { title: string; description: string }) => (
    <div className="rounded-2xl border-2 border-dashed bg-muted/20 p-10 text-center">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
);

export default function TenantHome() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<ActivityTab>('maintenance');

    const tenant = MOCK_TENANTS.find(({ id }) => id === ACTIVE_TENANT_ID);

    if (!tenant) {
        return (
            <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
                <h1 className="text-2xl font-bold tracking-tight">Home</h1>
                <p className="mt-2 text-sm text-muted-foreground">Tenant mock data is unavailable for this view.</p>
            </div>
        );
    }

    const property = MOCK_PROPERTIES.find(({ id }) => id === tenant.propertyId);
    const amenities = property?.amenities ?? [];
    const hasAmenities = Boolean(property?.features?.amenities && amenities.length > 0);
    const hasVehicles = Boolean(property?.features?.vehicles);
    const rentersInsuranceEnabled = Boolean(property?.features?.rentersInsurance);
    const reservations = MOCK_TENANT_RESERVATIONS.filter(({ tenantId }) => tenantId === tenant.id);
    const unreadMessages = HOME_ACTIVITY.messages.filter(({ unread }) => unread).length;
    const leaseEndDate = new Date(tenant.leaseEndDate);
    const daysUntilLeaseEnd = differenceInCalendarDays(leaseEndDate, MOCK_NOW);
    const renewalAvailable = daysUntilLeaseEnd >= 0 && daysUntilLeaseEnd <= 45;
    const insuranceNeeded = rentersInsuranceEnabled && (tenant.insurancePolicies?.length ?? 0) === 0;
    const vehicleInfoNeeded = hasVehicles && (tenant.vehicles?.length ?? 0) === 0;

    const rentStatusConfig = {
        paid: {
            accent: 'bg-emerald-500',
            chip: 'bg-emerald-500/10 text-emerald-700',
            text: 'text-emerald-700',
            icon: CheckCircle2,
            title: 'Next Rent Due',
            amountLabel: `${tenant.rentAmount.toLocaleString()} due ${format(NEXT_RENT_DUE, 'MMM d, yyyy')}`,
            note: tenant.autopayEnabled ? 'Auto-pay is enabled.' : 'You can pay early or enable auto-pay anytime.',
            primaryCta: 'Pay Early',
        },
        partial: {
            accent: 'bg-amber-500',
            chip: 'bg-amber-500/10 text-amber-700',
            text: 'text-amber-700',
            icon: Clock,
            title: 'Balance Due',
            amountLabel: `${tenant.balance.toLocaleString()} still owed for this cycle`,
            note: `Remaining balance is due immediately. Original due date was ${format(RENT_DUE_DATE, 'MMM d, yyyy')}.`,
            primaryCta: 'Pay Balance',
        },
        overdue: {
            accent: 'bg-rose-500',
            chip: 'bg-rose-500/10 text-rose-700',
            text: 'text-rose-700',
            icon: AlertCircle,
            title: 'Rent Overdue',
            amountLabel: `Was due ${format(RENT_DUE_DATE, 'MMM d, yyyy')}. Late fees may apply.`,
            note: tenant.autopayEnabled ? 'Auto-pay is enabled, but this balance still needs attention.' : 'Pay now to bring your account current.',
            primaryCta: 'Pay Now',
        },
        credit: {
            accent: 'bg-emerald-500',
            chip: 'bg-emerald-500/10 text-emerald-700',
            text: 'text-emerald-700',
            icon: CheckCircle2,
            title: 'Credit On File',
            amountLabel: `${Math.abs(tenant.balance).toLocaleString()} credit available`,
            note: `Your next rent payment is due ${format(NEXT_RENT_DUE, 'MMM d, yyyy')}.`,
            primaryCta: 'View Ledger',
        },
        no_balance: {
            accent: 'bg-emerald-500',
            chip: 'bg-emerald-500/10 text-emerald-700',
            text: 'text-emerald-700',
            icon: CheckCircle2,
            title: 'No Balance Due',
            amountLabel: `${tenant.rentAmount.toLocaleString()} due ${format(NEXT_RENT_DUE, 'MMM d, yyyy')}`,
            note: tenant.autopayEnabled ? 'Auto-pay is enabled.' : 'Everything is up to date.',
            primaryCta: 'View Payments',
        },
    }[tenant.rentStatus] ?? {
        accent: 'bg-slate-500',
        chip: 'bg-slate-500/10 text-slate-700',
        text: 'text-slate-700',
        icon: Clock,
        title: 'Rent Status',
        amountLabel: 'Review your payment details',
        note: 'Open Payments for the latest balance information.',
        primaryCta: 'View Payments',
    };

    const greetingSummary = useMemo(() => {
        const maintenanceCount = HOME_ACTIVITY.maintenance.length;
        const upcomingReservation = reservations.find(({ status }) => status === 'confirmed');

        if (tenant.rentStatus === 'overdue' && maintenanceCount > 0) {
            return `Rent is overdue and ${maintenanceCount} maintenance request${maintenanceCount === 1 ? ' is' : 's are'} in progress.`;
        }

        if (tenant.rentStatus === 'overdue') {
            return 'Rent is overdue. Take care of your balance to avoid additional fees.';
        }

        if (upcomingReservation) {
            return `Your ${upcomingReservation.amenityName.toLowerCase()} reservation is confirmed for ${upcomingReservation.scheduleLabel}.`;
        }

        if (renewalAvailable) {
            return `Your lease ends in ${daysUntilLeaseEnd} days. Review your renewal options when ready.`;
        }

        return `Everything is up to date. Your next rent payment is due ${format(NEXT_RENT_DUE, 'MMM d')}.`;
    }, [daysUntilLeaseEnd, reservations, renewalAvailable, tenant.rentStatus]);

    const quickActions = [
        {
            id: 'payments',
            title: tenant.rentStatus === 'overdue' ? 'Pay Rent' : 'Payments',
            description:
                tenant.rentStatus === 'overdue'
                    ? 'Make a payment now and review your account balance.'
                    : 'Make a payment, review your ledger, or manage auto-pay.',
            ctaLabel: tenant.rentStatus === 'overdue' ? 'Pay Now' : 'Open payments',
            icon: DollarSign,
            onClick: () => navigate('/tenant/payments'),
            badge: tenant.balance > 0 ? `$${tenant.balance.toLocaleString()}` : undefined,
        },
        {
            id: 'maintenance',
            title: 'Request Maintenance',
            description: 'Report an issue in your unit and track updates from management.',
            ctaLabel: 'Create a Ticket',
            icon: Wrench,
            onClick: () => navigate('/tenant/maintenance'),
            badge: HOME_ACTIVITY.maintenance.length > 0 ? `${HOME_ACTIVITY.maintenance.length} active` : undefined,
        },
        {
            id: 'message',
            title: 'Message Property',
            description: 'Send a unit-related question to the property team and review replies.',
            ctaLabel: 'Go to Inbox',
            icon: MessageSquare,
            onClick: () => navigate('/tenant/messages'),
            badge: unreadMessages > 0 ? `${unreadMessages} unread` : undefined,
        },
        ...(hasAmenities
            ? [
                  {
                      id: 'amenities',
                      title: 'Reserve Amenity',
                      description: 'Book shared spaces, guest parking, and other property resources.',
                      ctaLabel: 'Browse Amenities',
                      icon: Sparkles,
                      onClick: () => navigate('/tenant/amenities'),
                      badge: amenities[0]?.availabilityLabel,
                  },
              ]
            : []),
        ...(vehicleInfoNeeded
            ? [
                  {
                      id: 'vehicle',
                      title: 'Add Vehicle',
                      description: 'Your property requires vehicle registration for parking access.',
                      ctaLabel: 'Add vehicle',
                      icon: Car,
                      onClick: () => navigate('/tenant/vehicles'),
                  },
              ]
            : []),
        ...(insuranceNeeded
            ? [
                  {
                      id: 'insurance',
                      title: 'Upload Insurance',
                      description: 'Renter insurance is required before your setup is complete.',
                      ctaLabel: 'Review insurance',
                      icon: ShieldCheck,
                      onClick: () => navigate('/tenant/unit'),
                  },
              ]
            : []),
    ];

    const upcomingItems: UpcomingItem[] = [
        {
            id: 'upcoming-rent',
            title: 'Next rent due',
            dateLabel: format(NEXT_RENT_DUE, 'MMM d'),
            detail: `$${tenant.rentAmount.toLocaleString()} due for February rent`,
            icon: DollarSign,
            tone: (tenant.rentStatus === 'overdue' ? 'action' : 'default') as UpcomingItem['tone'],
        },
        {
            id: 'upcoming-lease',
            title: renewalAvailable ? 'Lease renewal window' : 'Lease end date',
            dateLabel: format(leaseEndDate, 'MMM d'),
            detail: renewalAvailable ? 'Review your renewal options before this deadline.' : 'Current lease term end date.',
            icon: FileText,
            tone: (renewalAvailable ? 'action' : 'default') as UpcomingItem['tone'],
        },
        ...HOME_ACTIVITY.inspections.map((inspection) => ({
            id: inspection.id,
            title: inspection.title,
            dateLabel: inspection.dateLabel,
            detail: inspection.detail,
            icon: Wrench,
            tone: 'default' as const,
        })),
        ...reservations.slice(0, 2).map((reservation) => ({
            id: reservation.id,
            title: reservation.amenityName,
            dateLabel: reservation.dateLabel,
            detail: reservation.scheduleLabel,
            icon: Calendar,
            tone: reservation.status === 'confirmed' ? ('success' as const) : ('default' as const),
        })),
    ].slice(0, 4);

    const tabs = [
        { id: 'maintenance', label: 'Maintenance', icon: Wrench, count: HOME_ACTIVITY.maintenance.length },
        { id: 'payments', label: 'Payments', icon: CreditCard, count: 0 },
        { id: 'messages', label: 'Messages', icon: MessageSquare, count: unreadMessages },
        ...(hasAmenities
            ? ([{ id: 'reservations', label: 'Reservations', icon: Calendar, count: reservations.length }] as const)
            : []),
        { id: 'upcoming', label: 'Upcoming', icon: Calendar, count: upcomingItems.length },
    ] satisfies Array<{ id: ActivityTab; label: string; icon: LucideIcon; count: number }>;

    return (
        <div className="space-y-8 pb-12">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Hi, {tenant.name.split(' ')[0]}</h1>
                <p className="text-muted-foreground">{greetingSummary}</p>
            </div>

            {renewalAvailable ? (
                <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-foreground">Renewal Available</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Review your next-term options before your current lease ends.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/tenant/documents')}
                            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
                        >
                            Review Renewal
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            ) : null}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl border bg-card p-8 shadow-sm lg:col-span-7"
                >
                    <div className={cn('absolute inset-y-0 left-0 w-2', rentStatusConfig.accent)} />
                    <DollarSign className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 text-muted/10" />
                    <div className="relative z-10 flex h-full flex-col justify-between gap-8">
                        <div className="space-y-5">
                            <div className={cn('inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium', rentStatusConfig.chip)}>
                                <rentStatusConfig.icon size={16} />
                                {rentStatusConfig.title}
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Total Balance</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-4xl font-bold tracking-tight">
                                        ${Math.max(tenant.balance, 0).toLocaleString()}
                                    </span>
                                    <span className="pb-1 text-sm text-muted-foreground">USD</span>
                                </div>
                                <p className={cn('text-sm font-medium', rentStatusConfig.text)}>{rentStatusConfig.amountLabel}</p>
                                <p className="text-sm text-muted-foreground">{rentStatusConfig.note}</p>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <span>Auto-pay {tenant.autopayEnabled ? 'enabled' : 'not enabled'}</span>
                                <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />
                                <span>Last payment {HOME_ACTIVITY.recentPayments[0]?.dateLabel}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => navigate('/tenant/payments')}
                                className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
                            >
                                {rentStatusConfig.primaryCta}
                            </button>
                            <button
                                onClick={() => navigate('/tenant/settings/payments')}
                                className="rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
                            >
                                Manage Auto-Pay
                            </button>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-sm lg:col-span-5"
                >
                    <HomeIcon className="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 text-white/5" />
                    <div className="relative z-10 flex h-full flex-col justify-between gap-8">
                        <div className="space-y-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">My Unit</p>
                                    <h2 className="mt-2 text-3xl font-bold">Unit {tenant.unitNumber}</h2>
                                    <p className="mt-1 text-sm text-slate-300">{tenant.propertyName}</p>
                                </div>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-200">
                                    <ShieldCheck size={12} />
                                    Lease Active
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Lease Ends</p>
                                    <p className="mt-1 text-sm font-semibold text-white">{format(leaseEndDate, 'MMM d, yyyy')}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Rent</p>
                                    <p className="mt-1 text-sm font-semibold text-white">${tenant.rentAmount.toLocaleString()}/mo</p>
                                </div>
                            </div>

                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => navigate('/tenant/unit')}
                                className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
                            >
                                View Unit
                            </button>
                            <button
                                onClick={() => navigate('/tenant/documents')}
                                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                            >
                                View Lease
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            <section className="space-y-4">
                <SectionHeader
                    title="Quick Actions"
                    subtitle="Start the most common tasks without leaving the homepage."
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {quickActions.map((action) => (
                        <QuickActionCard key={action.id} {...action} />
                    ))}
                </div>
            </section>

            <section className="space-y-6">
                <SectionHeader
                    title="Recent Activity"
                    subtitle="Check what is already in motion across maintenance, payments, messages, and reservations."
                />

                <div className="hide-scrollbar flex items-center gap-2 overflow-x-auto border-b pb-px">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                'flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                                activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground'
                            )}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                            {tab.count > 0 ? (
                                <span
                                    className={cn(
                                        'rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground',
                                        activeTab === tab.id && 'bg-primary/10 text-primary'
                                    )}
                                >
                                    {tab.count}
                                </span>
                            ) : null}
                        </button>
                    ))}
                </div>

                <div className="min-h-[280px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="space-y-4"
                        >
                            {activeTab === 'maintenance' ? (
                                HOME_ACTIVITY.maintenance.length > 0 ? (
                                    <div className="grid gap-3">
                                        {HOME_ACTIVITY.maintenance.map((ticket) => (
                                            <button
                                                key={ticket.id}
                                                onClick={() => navigate('/tenant/maintenance')}
                                                className="group flex items-center justify-between rounded-2xl border bg-card p-4 text-left transition-colors hover:border-primary/40"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-700">
                                                        <Wrench size={20} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-semibold text-foreground group-hover:text-primary">{ticket.title}</p>
                                                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                            <span>{ticket.updatedLabel}</span>
                                                            <span className="h-1 w-1 rounded-full bg-border" />
                                                            <span>Priority {ticket.priority}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <StatusBadge status={ticket.status} />
                                                    <ChevronRight size={16} className="text-muted-foreground" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState
                                        title="No active maintenance requests"
                                        description="Submit a new request if something in your unit needs attention."
                                    />
                                )
                            ) : null}

                            {activeTab === 'payments' ? (
                                <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                                    {HOME_ACTIVITY.recentPayments.map((payment, index) => (
                                        <div
                                            key={payment.id}
                                            className={cn(
                                                'flex items-center justify-between gap-4 p-4',
                                                index !== HOME_ACTIVITY.recentPayments.length - 1 && 'border-b'
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">
                                                    <DollarSign size={20} />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-semibold text-foreground">{payment.label}</p>
                                                    <p className="text-xs text-muted-foreground">{payment.dateLabel}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-foreground">-${payment.amount.toLocaleString()}</p>
                                                <div className="mt-1 flex items-center justify-end gap-2">
                                                    <StatusBadge status={payment.status} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : null}

                            {activeTab === 'messages' ? (
                                <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                                    {HOME_ACTIVITY.messages.map((message, index) => (
                                        <button
                                            key={message.id}
                                            onClick={() => navigate('/tenant/messages')}
                                            className={cn(
                                                'group flex w-full items-start gap-4 p-4 text-left transition-colors hover:bg-muted/30',
                                                index !== HOME_ACTIVITY.messages.length - 1 && 'border-b'
                                            )}
                                        >
                                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-700">
                                                <MessageSquare size={20} />
                                            </div>
                                            <div className="min-w-0 flex-1 space-y-1">
                                                <div className="flex items-start justify-between gap-3">
                                                    <p className={cn('text-sm font-semibold', message.unread ? 'text-primary' : 'text-foreground')}>
                                                        {message.sender}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">{message.dateLabel}</p>
                                                </div>
                                                <p className="text-sm font-medium text-foreground">{message.subject}</p>
                                                <p className="truncate text-xs text-muted-foreground">{message.preview}</p>
                                            </div>
                                            {message.unread ? <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" /> : null}
                                        </button>
                                    ))}
                                </div>
                            ) : null}

                            {activeTab === 'reservations' ? (
                                reservations.length > 0 ? (
                                    <div className="grid gap-3">
                                        {reservations.map((reservation: TenantReservation) => (
                                            <button
                                                key={reservation.id}
                                                onClick={() => navigate('/tenant/amenities')}
                                                className="group flex items-center justify-between rounded-2xl border bg-card p-4 text-left transition-colors hover:border-primary/40"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-700">
                                                        <Calendar size={20} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-semibold text-foreground group-hover:text-primary">{reservation.amenityName}</p>
                                                        <p className="text-xs text-muted-foreground">{reservation.scheduleLabel}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {reservation.feeLabel}
                                                            {reservation.requiresApproval ? ' · Approval required' : ' · Instant booking'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <StatusBadge status={reservation.status} />
                                                    <ChevronRight size={16} className="text-muted-foreground" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState
                                        title="No reservations yet"
                                        description="Browse property amenities to book guest parking, common spaces, and other shared resources."
                                    />
                                )
                            ) : null}

                            {activeTab === 'upcoming' ? (
                                upcomingItems.length > 0 ? (
                                    <div className="grid gap-3">
                                        {upcomingItems.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4 rounded-2xl border bg-card p-4">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                                                    <item.icon size={18} />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {item.dateLabel} · {item.detail}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState
                                        title="No upcoming events"
                                        description="There are no upcoming dates or reservations on your calendar right now."
                                    />
                                )
                            ) : null}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
}
