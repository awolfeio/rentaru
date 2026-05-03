
import { useState, type ChangeEvent, type ComponentType, type FormEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
    Building,
    Car,
    Calendar,
    Copy,
    Check,
    ArrowRight,
    Zap,
    Droplets,
    Flame,
    Wifi,
    Trash2,
    Phone,
    Mail,
    AlertCircle,
    Info,
    Shield,
    FileCheck,
    Home,
    X,
    type LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { differenceInCalendarDays, format } from 'date-fns';
import { cn } from '@/shared/lib/utils';
import { MOCK_TENANTS } from '@/shared/mockData/tenants';
import { MOCK_PROPERTIES } from '@/shared/mockData/properties';
import {
    getParkingAssignmentLabel,
    getVehiclePowertrainLabel,
} from '@/shared/lib/tenantVehicles';
import type { TenantInsurancePolicy, TenantVehicle } from '@/shared/types/tenant';

// --- MOCK DATA ---

const ACTIVE_TENANT_ID = 't1';

const UNIT_PAGE_STATE = {
    unitDetails: {
        beds: 2,
        baths: 1,
        sqft: 850,
        parkingSpot: 'Spot #12',
        parkingType: 'Covered carport',
    },
    utilities: [
        { name: 'Electricity', icon: Zap, provider: 'LADWP', responsible: 'tenant' as const, account: '...4821', phone: '800-342-5397' },
        { name: 'Water & Sewer', icon: Droplets, provider: 'LA Dept. of Water', responsible: 'landlord' as const, notes: 'Included in rent' },
        { name: 'Gas', icon: Flame, provider: 'SoCalGas', responsible: 'tenant' as const, account: '...2938', phone: '800-427-2200' },
        { name: 'Internet', icon: Wifi, provider: 'Spectrum', responsible: 'tenant' as const, notes: 'Building pre-wired CAT6' },
        { name: 'Trash', icon: Trash2, provider: 'City of LA', responsible: 'landlord' as const, notes: 'Pickup: Tue & Fri' },
    ],
    emergency: {
        phone: '(310) 555-0199',
        afterHoursNote: 'For non-emergencies, please submit a maintenance ticket online.',
        manager: {
            name: 'Sarah Chen',
            role: 'Property Manager',
            phone: '(310) 555-0100',
            email: 'sarah.chen@sunsetapts.com',
        },
    },
};

// --- HELPER COMPONENTS ---

const ResponsibleBadge = ({ responsible }: { responsible: 'tenant' | 'landlord' }) =>
    responsible === 'landlord' ? (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            Included
        </span>
    ) : (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border bg-blue-500/10 text-blue-600 border-blue-500/20">
            Tenant-Paid
        </span>
    );

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className="mb-4">
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
);

const DetailField = ({ label, value }: { label: string; value: string }) => (
    <div>
        <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
);

const HeroSummaryCard = ({
    icon: Icon,
    title,
    primary,
    secondary,
    tertiary,
}: {
    icon: LucideIcon;
    title: string;
    primary: string;
    secondary?: string;
    tertiary?: string;
}) => (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
        <div className="mb-3 flex items-center gap-2 text-slate-300">
            <Icon size={16} className="shrink-0" />
            <p className="text-xs font-bold uppercase tracking-wide">{title}</p>
        </div>
        <p className="text-lg font-bold text-white">{primary}</p>
        {secondary && <p className="mt-1 text-sm text-slate-300">{secondary}</p>}
        {tertiary && <p className="mt-1 text-xs text-slate-400">{tertiary}</p>}
    </div>
);

type ContactFormState = {
    phone: string;
    topic: 'general' | 'lease' | 'parking' | 'insurance' | 'utilities' | 'other';
    urgency: 'normal' | 'time_sensitive' | 'urgent_non_maintenance' | 'emergency';
    replyPreference: 'app_message' | 'email' | 'phone';
    subject: string;
    message: string;
    relatedLeaseSection: string;
    vehicleId: string;
    parkingReference: string;
    issueDateTime: string;
    utilityProvider: string;
    serviceAffected: string;
};

const ContactField = ({
    label,
    helperText,
    children,
}: {
    label: string;
    helperText?: string;
    children: ReactNode;
}) => (
    <label className="block">
        <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
        {children}
        {helperText && <span className="mt-2 block text-xs text-muted-foreground">{helperText}</span>}
    </label>
);

const MAX_CONTACT_ATTACHMENTS = 5;
const MAINTENANCE_KEYWORDS =
    /(maintenance|repair|issue|broken|leak|leaking|plumbing|electrical|heater|heating|air conditioning|ac\b|hvac|mold|pest|appliance|water damage|clog|dripping|noise)/i;

const VehiclePowerBadge = ({ powertrain }: { powertrain: TenantVehicle['powertrain'] }) => (
    <span
        className={cn(
            'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border',
            powertrain === 'electric'
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                : 'bg-slate-500/10 text-slate-600 border-slate-500/20'
        )}
    >
        {getVehiclePowertrainLabel(powertrain)}
    </span>
);

// --- PAGE ---

export default function TenantUnit() {
    const navigate = useNavigate();
    const tenant = MOCK_TENANTS.find(({ id }) => id === ACTIVE_TENANT_ID);
    const { unitDetails, utilities, emergency } = UNIT_PAGE_STATE;
    const [copied, setCopied] = useState(false);
    const [contactModalOpen, setContactModalOpen] = useState(false);
    const [contactSubmitted, setContactSubmitted] = useState(false);
    const [contactForm, setContactForm] = useState<ContactFormState>({
        phone: tenant?.phone ?? '',
        topic: 'general',
        urgency: 'normal',
        replyPreference: 'app_message',
        subject: '',
        message: '',
        relatedLeaseSection: '',
        vehicleId: '',
        parkingReference: '',
        issueDateTime: '',
        utilityProvider: '',
        serviceAffected: '',
    });
    const [attachments, setAttachments] = useState<File[]>([]);
    const [maintenanceRedirectDismissed, setMaintenanceRedirectDismissed] = useState(false);

    if (!tenant) {
        return (
            <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
                <h1 className="text-2xl font-bold tracking-tight">My Unit</h1>
                <p className="mt-2 text-sm text-muted-foreground">Tenant mock data is unavailable for this view.</p>
            </div>
        );
    }

    const property = MOCK_PROPERTIES.find(({ id }) => id === tenant.propertyId);
    const vehicles = tenant.vehicles ?? [];
    const insurancePolicies = tenant.insurancePolicies ?? [];
    const fullAddress = property?.address ?? tenant.propertyName;
    const moveInDate = format(new Date(tenant.moveInDate ?? tenant.leaseStartDate), 'MMMM d, yyyy');
    const leaseEndDate = format(new Date(tenant.leaseEndDate), 'MMMM d, yyyy');
    const propertyName = property?.name ?? tenant.propertyName;
    const daysRemaining = differenceInCalendarDays(new Date(tenant.leaseEndDate), new Date());
    const setupChecks = [
        insurancePolicies.length > 0,
        vehicles.length > 0,
        Boolean(emergency.manager.phone || emergency.manager.email),
    ];
    const completedSetupItems = setupChecks.filter(Boolean).length;
    const totalSetupItems = setupChecks.length;
    const setupComplete = completedSetupItems === totalSetupItems;
    const maintenanceCount = tenant.maintenanceRequestCount;
    const statusLine = [
        `Lease ${tenant.leaseStatus.replace(/_/g, ' ')}`,
        setupComplete ? 'Setup complete' : `${totalSetupItems - completedSetupItems} setup item${totalSetupItems - completedSetupItems === 1 ? '' : 's'} need attention`,
        maintenanceCount > 0
            ? `${maintenanceCount} open unit issue${maintenanceCount === 1 ? '' : 's'}`
            : 'No open unit issues',
    ].join(' · ');
    const leaseCardPrimary =
        tenant.leaseStatus === 'active' ? 'Active' : tenant.leaseStatus.replace(/_/g, ' ');
    const setupSecondary = [
        insurancePolicies.length > 0 ? 'Insurance verified' : 'Insurance missing',
        `${vehicles.length} vehicle${vehicles.length === 1 ? '' : 's'} linked`,
    ].join(' · ');
    const isEmergencyUrgency = contactForm.urgency === 'emergency';
    const maintenanceLanguageDetected = MAINTENANCE_KEYWORDS.test(
        `${contactForm.subject} ${contactForm.message}`
    );
    const showMaintenanceRedirect =
        maintenanceLanguageDetected &&
        !maintenanceRedirectDismissed &&
        !isEmergencyUrgency;

    const handleCopyAddress = async () => {
        await navigator.clipboard.writeText(fullAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleContactFieldChange =
        (field: keyof ContactFormState) =>
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            setMaintenanceRedirectDismissed(false);
            setContactForm((current) => ({ ...current, [field]: event.target.value }));
        };

    const handleAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextFiles = Array.from(event.target.files ?? []);
        if (nextFiles.length === 0) return;

        setAttachments((current) => [...current, ...nextFiles].slice(0, MAX_CONTACT_ATTACHMENTS));
        event.target.value = '';
    };

    const removeAttachment = (indexToRemove: number) => {
        setAttachments((current) => current.filter((_, index) => index !== indexToRemove));
    };

    const openContactModal = () => {
        setContactSubmitted(false);
        setMaintenanceRedirectDismissed(false);
        setContactModalOpen(true);
    };

    const closeContactModal = () => {
        setContactModalOpen(false);
    };

    const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isEmergencyUrgency) return;
        setContactSubmitted(true);
    };

    const resetContactForm = () => {
        setContactSubmitted(false);
        setAttachments([]);
        setMaintenanceRedirectDismissed(false);
        setContactForm({
            phone: tenant.phone ?? '',
            topic: 'general',
            urgency: 'normal',
            replyPreference: 'app_message',
            subject: '',
            message: '',
            relatedLeaseSection: '',
            vehicleId: '',
            parkingReference: '',
            issueDateTime: '',
            utilityProvider: '',
            serviceAffected: '',
        });
    };

    return (
        <div className="space-y-10 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Unit</h1>
                <div className="flex items-center gap-2 mt-1">
                    <p className="text-muted-foreground">{fullAddress}</p>
                    <button
                        onClick={handleCopyAddress}
                        className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        title="Copy address"
                    >
                        {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    </button>
                </div>
            </div>

            {/* Section 1: Unit Overview */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-8 relative overflow-hidden"
            >
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.95fr)] gap-8">
                    <div className="space-y-6">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unit</span>
                            <h2 className="text-4xl font-bold mt-1">Unit {tenant.unitNumber}</h2>
                            <p className="text-slate-300 text-sm mt-1">{propertyName}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <p className="text-sm text-slate-400">{fullAddress}</p>
                                <button
                                    onClick={handleCopyAddress}
                                    className="p-1 rounded hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                                    title="Copy address"
                                >
                                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                </button>
                            </div>
                        </div>

                        <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                            {statusLine}
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <button
                                onClick={() => navigate('/tenant/documents')}
                                className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
                            >
                                View Lease <ArrowRight size={14} />
                            </button>
                            <a
                                href={`mailto:${emergency.manager.email}`}
                                className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                            >
                                Contact Manager
                            </a>
                            {maintenanceCount > 0 && (
                                <button
                                    onClick={() => navigate('/tenant/maintenance')}
                                    className="flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-sm font-semibold text-amber-100 transition-colors hover:bg-amber-400/15"
                                >
                                    View Open Request
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <HeroSummaryCard
                            icon={Calendar}
                            title="Lease"
                            primary={leaseCardPrimary}
                            secondary={`${Math.max(daysRemaining, 0)} days remaining`}
                            tertiary={`${format(new Date(tenant.leaseStartDate), 'MMM d, yyyy')} - ${format(new Date(tenant.leaseEndDate), 'MMM d, yyyy')}`}
                        />
                        <HeroSummaryCard
                            icon={FileCheck}
                            title="Unit Setup"
                            primary={setupComplete ? 'Complete' : `${completedSetupItems} of ${totalSetupItems} complete`}
                            secondary={setupSecondary}
                            tertiary={setupComplete ? 'No setup blockers on file' : 'Review missing setup items below'}
                        />
                        <HeroSummaryCard
                            icon={Car}
                            title="Parking"
                            primary={unitDetails.parkingSpot}
                            secondary={unitDetails.parkingType}
                            tertiary={`${vehicles.length} vehicle${vehicles.length === 1 ? '' : 's'} linked`}
                        />
                        <HeroSummaryCard
                            icon={Home}
                            title="Unit Details"
                            primary={`${unitDetails.beds} bed · ${unitDetails.baths} bath`}
                            secondary={`${unitDetails.sqft.toLocaleString()} sq ft`}
                            tertiary={`Move-in ${moveInDate}`}
                        />
                    </div>
                </div>

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(148,163,184,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.16),transparent_30%)]" />
                <Building className="absolute -bottom-10 -right-10 w-56 h-56 text-white/5 pointer-events-none" />
            </motion.div>

            {/* Section 2: Vehicles */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <SectionHeader
                        title="Vehicles"
                        subtitle="Registered vehicles assigned to this household."
                    />
                    <button
                        onClick={() => navigate('/tenant/vehicles')}
                        className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-3 text-sm font-semibold transition-colors hover:border-primary/40 hover:text-primary"
                    >
                        Manage Vehicles
                        <ArrowRight size={14} />
                    </button>
                </div>
                <div className="bg-card border rounded-2xl p-6 shadow-sm">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                            <Car size={20} className="text-foreground/70" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm">Registered Vehicles</p>
                            <p className="text-xs text-muted-foreground">
                                {vehicles.length} {vehicles.length === 1 ? 'vehicle' : 'vehicles'} linked to this unit
                            </p>
                        </div>
                    </div>

                    {vehicles.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                            {vehicles.map((vehicle) => (
                                <VehicleCard key={vehicle.id} vehicle={vehicle} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed bg-muted/20 p-5 text-sm text-muted-foreground">
                            No vehicle records have been added yet.
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Section 3: Insurance */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
            >
                <SectionHeader
                    title="Insurance"
                    subtitle="Current insurance policies on file for this lease."
                />
                <div className="bg-card border rounded-2xl p-6 shadow-sm">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                            <Shield size={20} className="text-foreground/70" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm">Insurance On File</p>
                            <p className="text-xs text-muted-foreground">
                                {insurancePolicies.length} {insurancePolicies.length === 1 ? 'policy' : 'policies'} saved for this tenant
                            </p>
                        </div>
                    </div>

                    {insurancePolicies.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                            {insurancePolicies.map((policy) => (
                                <InsuranceCard key={policy.id} policy={policy} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed bg-muted/20 p-5 text-sm text-muted-foreground">
                            No insurance records have been added yet.
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Section 4: Utilities & Services */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <SectionHeader
                    title="Utilities & Services"
                    subtitle="Who is responsible for each service in your unit."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {utilities.map((util) => {
                        const Icon = util.icon;
                        return (
                            <div
                                key={util.name}
                                className="bg-card border rounded-2xl p-5 shadow-sm flex flex-col gap-3 hover:border-primary/30 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                                        <Icon size={20} className="text-foreground/70" />
                                    </div>
                                    <ResponsibleBadge responsible={util.responsible} />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{util.name}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{util.provider}</p>
                                </div>
                                {'account' in util && util.account && (
                                    <p className="text-xs text-muted-foreground">Account: {util.account}</p>
                                )}
                                {'phone' in util && util.phone && (
                                    <a
                                        href={`tel:${util.phone}`}
                                        className="text-xs text-primary hover:underline flex items-center gap-1"
                                    >
                                        <Phone size={11} /> {util.phone}
                                    </a>
                                )}
                                {'notes' in util && util.notes && (
                                    <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                        <Info size={11} className="mt-0.5 shrink-0" />
                                        {util.notes}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Section 5: Contacts & Emergency */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <SectionHeader
                    title="Contacts & Emergency"
                    subtitle="Reach the property team or get urgent help for this unit."
                />
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <div className="bg-card border rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Mail size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">General Contact</p>
                                <p className="text-xs text-muted-foreground">Send a full message to the property team</p>
                            </div>
                        </div>
                        <div className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground">
                            Use the contact form for leasing questions, parking issues, insurance follow-up, utility questions, or general unit support.
                        </div>
                        <button
                            onClick={openContactModal}
                            className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            Contact Us
                        </button>
                    </div>

                    {/* Emergency Phone */}
                    <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                                <AlertCircle size={20} className="text-rose-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Emergency Maintenance</p>
                                <p className="text-xs text-muted-foreground">Available 24/7 for urgent issues</p>
                            </div>
                        </div>
                        <a
                            href={`tel:${emergency.phone}`}
                            className="flex items-center justify-center gap-2 w-full bg-rose-600 hover:bg-rose-700 text-white rounded-xl py-3 text-sm font-semibold transition-colors"
                        >
                            <Phone size={16} /> {emergency.phone}
                        </a>
                        <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <Info size={11} className="mt-0.5 shrink-0" />
                            {emergency.afterHoursNote}
                        </p>
                    </div>

                    {/* Property Manager */}
                    <div className="bg-card border rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-sm font-bold text-indigo-600">
                                {emergency.manager.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <p className="font-semibold text-sm">{emergency.manager.name}</p>
                                <p className="text-xs text-muted-foreground">{emergency.manager.role}</p>
                            </div>
                        </div>
                        <div className="space-y-2 pt-2 border-t">
                            <a
                                href={`tel:${emergency.manager.phone}`}
                                className={cn(
                                    "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                )}
                            >
                                <Phone size={14} className="shrink-0" /> {emergency.manager.phone}
                            </a>
                            <a
                                href={`mailto:${emergency.manager.email}`}
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Mail size={14} className="shrink-0" /> {emergency.manager.email}
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>

            {contactModalOpen && createPortal(
                    <div
                        className="fixed inset-0 z-50 flex min-h-screen items-start justify-center bg-background/80 px-4 py-10 backdrop-blur-sm"
                        onClick={closeContactModal}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 18, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className="relative flex w-full max-w-2xl max-h-[calc(100vh-80px)] flex-col overflow-hidden rounded-3xl border bg-card shadow-2xl"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
                                <div>
                                    <h3 className="text-xl font-bold tracking-tight">Contact Property Team</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Send a detailed message for Unit {tenant.unitNumber} at {propertyName}.
                                    </p>
                                </div>
                                <button
                                    onClick={closeContactModal}
                                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    title="Close contact form"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                            {contactSubmitted ? (
                                <div className="px-6 py-8">
                                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                                                <Check size={18} className="text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground">Contact form submitted successfully</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Your message has been sent to the {propertyName} property team and saved to your unit communication history.
                                                </p>
                                                {attachments.length > 0 && (
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {attachments.length} attachment{attachments.length === 1 ? '' : 's'} included.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-5 flex flex-wrap gap-3">
                                            <button
                                                onClick={() => {
                                                    resetContactForm();
                                                    closeContactModal();
                                                }}
                                                className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                                            >
                                                Close
                                            </button>
                                            <button
                                                onClick={resetContactForm}
                                                className="rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
                                            >
                                                Submit Another
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleContactSubmit} className="px-6 py-6">
                                    <div className="rounded-2xl border bg-muted/20 p-4">
                                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">From</p>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {tenant.name} · {tenant.email}
                                                </p>
                                                <p className="text-sm text-muted-foreground">Unit {tenant.unitNumber}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => navigate('/tenant/settings/account')}
                                                className="text-sm font-medium text-primary transition-colors hover:underline"
                                            >
                                                Need to update your contact info? Go to Settings.
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <ContactField
                                            label="Phone Number"
                                            helperText="Optional, for issues where a call may be faster."
                                        >
                                            <input
                                                value={contactForm.phone}
                                                onChange={handleContactFieldChange('phone')}
                                                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                                            />
                                        </ContactField>

                                        <ContactField label="Topic">
                                            <select
                                                value={contactForm.topic}
                                                onChange={handleContactFieldChange('topic')}
                                                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                                            >
                                                <option value="general">General Question</option>
                                                <option value="lease">Lease Question</option>
                                                <option value="parking">Parking Issue</option>
                                                <option value="insurance">Insurance Follow-Up</option>
                                                <option value="utilities">Utilities & Services</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </ContactField>

                                        <ContactField label="How soon do you need help?">
                                            <select
                                                value={contactForm.urgency}
                                                onChange={handleContactFieldChange('urgency')}
                                                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                                            >
                                                <option value="normal">Normal</option>
                                                <option value="time_sensitive">Time-sensitive</option>
                                                <option value="urgent_non_maintenance">Urgent, but not maintenance</option>
                                                <option value="emergency">Emergency</option>
                                            </select>
                                        </ContactField>

                                        <ContactField label="Preferred Reply Method">
                                            <select
                                                value={contactForm.replyPreference}
                                                onChange={handleContactFieldChange('replyPreference')}
                                                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                                            >
                                                <option value="app_message">App message</option>
                                                <option value="email">Email</option>
                                                <option value="phone">Phone call</option>
                                            </select>
                                        </ContactField>
                                    </div>

                                    {contactForm.topic === 'lease' && (
                                        <div className="mt-4 rounded-2xl border bg-blue-500/5 p-4">
                                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                                <div>
                                                    <p className="font-semibold text-foreground">Lease Question</p>
                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        Use this topic for renewal terms, lease dates, addenda, or lease document questions.
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => navigate('/tenant/documents')}
                                                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:underline"
                                                >
                                                    View lease documents
                                                    <ArrowRight size={14} />
                                                </button>
                                            </div>
                                            <div className="mt-4">
                                                <ContactField label="Related Lease Section">
                                                    <select
                                                        value={contactForm.relatedLeaseSection}
                                                        onChange={handleContactFieldChange('relatedLeaseSection')}
                                                        className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                                                    >
                                                        <option value="">Select a lease section</option>
                                                        <option value="lease_term">Lease term</option>
                                                        <option value="renewal">Renewal options</option>
                                                        <option value="occupants">Occupants and household</option>
                                                        <option value="parking_addendum">Parking addendum</option>
                                                        <option value="fees">Fees and charges</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                </ContactField>
                                            </div>
                                        </div>
                                    )}

                                    {contactForm.topic === 'parking' && (
                                        <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                                            <p className="font-semibold text-foreground">Parking Issue</p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                For urgent towing, blocked access, or safety issues, contact your property&apos;s emergency line.
                                            </p>
                                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                                                <ContactField label="Vehicle">
                                                    <select
                                                        value={contactForm.vehicleId}
                                                        onChange={handleContactFieldChange('vehicleId')}
                                                        className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                                                    >
                                                        <option value="">Select a vehicle</option>
                                                        {vehicles.map((vehicle) => (
                                                            <option key={vehicle.id} value={vehicle.id}>
                                                                {vehicle.title} · {vehicle.licensePlate}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </ContactField>
                                                <ContactField label="Parking Spot / Permit Number">
                                                    <input
                                                        value={contactForm.parkingReference}
                                                        onChange={handleContactFieldChange('parkingReference')}
                                                        placeholder="Spot 12 / Permit 8471"
                                                        className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                                                    />
                                                </ContactField>
                                                <ContactField label="Date / Time Issue Occurred">
                                                    <input
                                                        type="datetime-local"
                                                        value={contactForm.issueDateTime}
                                                        onChange={handleContactFieldChange('issueDateTime')}
                                                        className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                                                    />
                                                </ContactField>
                                            </div>
                                        </div>
                                    )}

                                    {contactForm.topic === 'insurance' && (
                                        <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                                <div>
                                                    <p className="font-semibold text-foreground">Insurance Follow-Up</p>
                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        Use this for policy verification, renewal proof, or renters insurance requirement questions.
                                                    </p>
                                                </div>
                                                <label
                                                    htmlFor="contact-attachments"
                                                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-emerald-500/25 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
                                                >
                                                    Upload proof of insurance
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {contactForm.topic === 'utilities' && (
                                        <div className="mt-4 rounded-2xl border bg-sky-500/5 p-4">
                                            <p className="font-semibold text-foreground">Utilities & Services</p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Tell us which provider or service is affected so the team can route it faster.
                                            </p>
                                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <ContactField label="Utility Provider">
                                                    <input
                                                        value={contactForm.utilityProvider}
                                                        onChange={handleContactFieldChange('utilityProvider')}
                                                        placeholder="Example: LADWP"
                                                        className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                                                    />
                                                </ContactField>
                                                <ContactField label="Service Affected">
                                                    <select
                                                        value={contactForm.serviceAffected}
                                                        onChange={handleContactFieldChange('serviceAffected')}
                                                        className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                                                    >
                                                        <option value="">Select a service</option>
                                                        <option value="electricity">Electricity</option>
                                                        <option value="water_sewer">Water & sewer</option>
                                                        <option value="gas">Gas</option>
                                                        <option value="internet">Internet</option>
                                                        <option value="trash">Trash</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                </ContactField>
                                            </div>
                                        </div>
                                    )}

                                    {contactForm.topic === 'other' && (
                                        <div className="mt-4 rounded-2xl border bg-muted/20 p-4 text-sm text-muted-foreground">
                                            Use this option when your message does not fit any of the more specific property workflows above.
                                        </div>
                                    )}

                                    <div className="mt-4 grid grid-cols-1 gap-4">
                                        <ContactField label="Subject">
                                            <input
                                                required
                                                value={contactForm.subject}
                                                onChange={handleContactFieldChange('subject')}
                                                placeholder="What do you need help with?"
                                                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                                            />
                                        </ContactField>

                                        <ContactField label="Message">
                                            <textarea
                                                required
                                                rows={6}
                                                value={contactForm.message}
                                                onChange={handleContactFieldChange('message')}
                                                placeholder={`Include any unit-specific details for ${propertyName}, Unit ${tenant.unitNumber}.`}
                                                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary resize-none"
                                            />
                                        </ContactField>

                                        <div>
                                            <div className="mb-2 flex items-center justify-between gap-3">
                                                <span className="text-sm font-medium text-foreground">Attach Files</span>
                                                <label
                                                    htmlFor="contact-attachments"
                                                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
                                                >
                                                    Attach files
                                                </label>
                                            </div>
                                            <input
                                                id="contact-attachments"
                                                type="file"
                                                multiple
                                                accept="image/*,.pdf,.doc,.docx"
                                                onChange={handleAttachmentChange}
                                                className="hidden"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Photos, PDFs, or screenshots. Max {MAX_CONTACT_ATTACHMENTS} files.
                                            </p>
                                            {attachments.length > 0 && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {attachments.map((file, index) => (
                                                        <div
                                                            key={`${file.name}-${index}`}
                                                            className="inline-flex items-center gap-2 rounded-full border bg-muted/20 px-3 py-1.5 text-xs text-foreground"
                                                        >
                                                            <span className="max-w-[220px] truncate">{file.name}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeAttachment(index)}
                                                                className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                                                title={`Remove ${file.name}`}
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {showMaintenanceRedirect && (
                                        <div className="mt-4 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4">
                                            <p className="font-semibold text-foreground">
                                                This looks like a maintenance issue.
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Maintenance requests are easier to track when submitted through the Maintenance page.
                                            </p>
                                            <div className="mt-4 flex flex-wrap gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setMaintenanceRedirectDismissed(true)}
                                                    className="rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
                                                >
                                                    Continue here
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        closeContactModal();
                                                        navigate('/tenant/maintenance');
                                                    }}
                                                    className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                                                >
                                                    Create Maintenance Request
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {isEmergencyUrgency && (
                                        <div className="mt-4 rounded-2xl border border-rose-500/25 bg-rose-500/5 p-4">
                                            <p className="font-semibold text-foreground">Emergency selected</p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Emergencies should not be sent through this contact form. Use the property emergency line for urgent help right away.
                                            </p>
                                            <div className="mt-4 flex flex-wrap gap-3">
                                                <a
                                                    href={`tel:${emergency.phone}`}
                                                    className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
                                                >
                                                    Call Emergency Line
                                                </a>
                                                <a
                                                    href={`mailto:${emergency.manager.email}`}
                                                    className="rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
                                                >
                                                    Email Property Manager
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
                                        <p className="text-sm text-muted-foreground">
                                            This message will be sent to the {propertyName} property team and saved to your unit communication history.
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            <button
                                                type="button"
                                                onClick={closeContactModal}
                                                className="rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
                                            >
                                                Cancel
                                            </button>
                                            {isEmergencyUrgency ? (
                                                <span className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-2.5 text-sm font-semibold text-rose-700">
                                                    Use the emergency options above
                                                </span>
                                            ) : (
                                                <button
                                                    type="submit"
                                                    className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                                                >
                                                    Send Message
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            )}
                            </div>
                        </motion.div>
                    </div>,
                    window.document.body
                )}
        </div>
    );
}

function VehicleCard({ vehicle }: { vehicle: TenantVehicle }) {
    return (
        <div className="rounded-2xl border bg-muted/20 p-5 space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <p className="text-lg font-bold tracking-tight text-foreground">{vehicle.title}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <span className="rounded-full border bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700 border-blue-500/20">
                        {getParkingAssignmentLabel(vehicle.parkingAssignment)}
                    </span>
                    <VehiclePowerBadge powertrain={vehicle.powertrain} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <DetailField label="Year" value={vehicle.year.toString()} />
                <DetailField label="Color" value={vehicle.color} />
                <DetailField label="License Plate" value={vehicle.licensePlate} />
            </div>
        </div>
    );
}

function InsuranceCard({ policy }: { policy: TenantInsurancePolicy }) {
    return (
        <div className="rounded-2xl border bg-muted/20 p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailField label="Policy #" value={policy.policyNumber} />
                <DetailField label="Provider" value={policy.provider} />
                <DetailField
                    label="Coverage Date"
                    value={`${format(new Date(policy.coverageStartDate), 'MMM d, yyyy')} - ${format(new Date(policy.coverageEndDate), 'MMM d, yyyy')}`}
                />
                <div className="sm:col-span-2">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Liability</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {policy.liabilityNumbers.map((liabilityNumber) => (
                            <span
                                key={liabilityNumber}
                                className="px-2.5 py-1 rounded-full border bg-blue-500/10 text-blue-700 border-blue-500/20 text-xs font-medium"
                            >
                                {liabilityNumber}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
