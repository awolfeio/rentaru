# Tenant Settings Implementation Plan

## Goal

Create a tenant-facing Settings area that lets tenants manage their personal account, communication preferences, payment preferences, security, appearance, and renter-specific profile details without exposing landlord/organization admin settings.

The tenant Settings page should feel simpler than management Settings. Tenants should not need complex organization controls, billing plans, staff management, or operational configuration.

---

# Recommended Tenant Settings Navigation

## Personal

### 1. My Account

Basic identity and contact information.

**Fields / Features**
- Profile photo
- First name
- Last name
- Email address
- Phone number
- Preferred name
- Emergency contact
- Language preference
- Time zone, if relevant
- Save changes button

**UX Notes**
- Email changes may require verification.
- Phone number changes may require SMS verification if used for alerts.
- Show helper text like: “This information may be shared with your property manager for lease, billing, and maintenance communication.”

---

### 2. Login & Security

Tenant-facing security controls.

**Features**
- Change password
- Two-factor authentication
- Active sessions
- Sign out of all devices
- Login history, optional
- Connected login providers, optional
  - Google
  - Apple
  - Email/password

**Recommended Sections**

```txt
Password
Two-Factor Authentication
Active Sessions
Account Access
```

**UX Notes**
- Use plain language. Avoid making this feel like an enterprise admin panel.
- For tenants, “Login & Security” is clearer than just “Security.”

---

### 3. Notifications

Control how tenants receive reminders and updates.

**Notification Categories**
- Rent reminders
- Payment confirmations
- Failed payment alerts
- Upcoming lease expiration
- Maintenance ticket updates
- New messages from property manager
- Document requests
- Announcements
- Inspection or entry notices
- Package / amenity notifications, optional for future

**Channels**
- Email
- SMS
- Push notifications, if mobile app exists later
- In-app notifications

**Recommended UI**

Use a matrix-style preference table:

```txt
Notification Type              Email     SMS     In-App
Rent reminders                 On        On      On
Payment confirmations          On        Off     On
Maintenance updates            On        On      On
Messages                       On        On      On
Lease/document updates         On        Off     On
```

**Important**

Some notifications should not be fully disabled if they are legally or operationally important.

Examples:
- Lease notices
- Required entry notices
- Payment failure notices
- Security alerts

For those, show disabled toggles or explanatory text:

```txt
Required notices cannot be turned off.
```

---

## Home & Lease

### 4. My Unit

Since tenants already likely have a “My Unit” page, Settings should only include editable or preference-related unit details.

**Fields / Features**
- Current unit summary
  - Property name
  - Unit number
  - Address
  - Lease start/end
  - Monthly rent
- Occupants
- Pets
- Vehicles
- Parking spaces
- Storage spaces
- Renters insurance status
- Request profile update button

**Important UX Distinction**

Do not make tenants directly edit lease-critical information without review.

For example:
- Adding a pet should submit a request.
- Adding an occupant should submit a request.
- Updating vehicle info may be editable depending on property policy.
- Renters insurance upload can be self-service.

**Recommended Actions**
- Upload renters insurance
- Update vehicle information
- Request occupant change
- Request pet approval
- View lease

---

### 5. Payment Settings

This is likely one of the most valuable tenant settings pages.

**Features**
- Saved payment methods
  - Bank account
  - Debit card
  - Credit card
- Default payment method
- Autopay settings
- Payment reminder preferences
- Paperless receipts
- Billing address
- Payment history shortcut

**Autopay Controls**
- Enable / disable autopay
- Payment amount
  - Full balance
  - Rent only
  - Fixed amount, if allowed
- Payment date
  - Due date
  - X days before due date
- Backup payment method, optional
- Autopay confirmation checkbox

**UX Notes**
- Put payment processor disclosures near card/bank setup.
- Clearly explain card fees, ACH fees, and failed payment fees.
- Use confirmation modals for disabling autopay.

**Example Settings Sections**

```txt
Payment Methods
Default Payment
Autopay
Receipts
Billing Address
```

---

### 6. Documents & E-Signature

Tenant preferences and identity details related to documents.

**Features**
- Legal name for documents
- Signature preferences
- Document notification preferences
- Paperless document delivery
- Download all documents
- View signed lease
- View move-in checklist
- View policy documents

**Useful Tenant Actions**
- Update legal name request
- Manage e-signature consent
- Download document archive
- View document history

**Important**

Legal names should usually be request-based, not freely editable, because they affect signed agreements.

---

## App Preferences

### 7. Appearance

Simple UI personalization.

**Features**
- Light mode
- Dark mode
- System preference
- Accent color, optional
- Compact mode, optional

For tenant-side, keep this very simple.

---

### 8. Accessibility

Worth adding either as its own page or part of Appearance.

**Features**
- Reduce motion
- Increase contrast
- Larger text
- Screen reader optimization note
- Keyboard shortcuts, optional

This is especially useful if your app will serve a wide age range of renters.

---

## Account Management

### 9. Privacy & Data

Tenant trust feature.

**Features**
- Data used by property manager
- Download my data
- Request account deletion
- Communication consent
- Marketing opt-in/out
- Privacy policy link
- Terms of service link

**Important UX Notes**
- Account deletion may not be immediately available if the tenant has active lease/payment/legal records.
- Use language like: “Some records may be retained for legal, accounting, or lease history requirements.”

---

### 10. Support

Settings is a natural place for account-level help.

**Features**
- Contact property manager
- Contact platform support
- Help center
- Report a technical issue
- App version/build number
- Submit feedback

**Support Routing**

Split support clearly:

```txt
For rent, lease, maintenance, or property questions:
Contact your property manager.

For login, payment method, or app issues:
Contact support.
```

---

# Recommended Tenant Settings IA

## Best Version

```txt
Settings

Personal
- My Account
- Login & Security
- Notifications

Home & Lease
- My Unit
- Payment Settings
- Documents & E-Signature

Preferences
- Appearance
- Accessibility

Account
- Privacy & Data
- Support
```

---

# MVP Version

For first release, implement this smaller set:

```txt
Settings

Personal
- My Account
- Login & Security
- Notifications

Home & Lease
- Payment Settings
- Documents

Preferences
- Appearance
```

Then later add:

```txt
My Unit Settings
Accessibility
Privacy & Data
Support
```

---

# Page-by-Page Implementation Plan

## Phase 1: Tenant Settings Shell

### Objective

Create the base tenant Settings page using the same visual system as management Settings, but with tenant-specific navigation and content.

### Build

Create tenant route:

```txt
/tenant/settings
```

Add nested routes:

```txt
/tenant/settings/account
/tenant/settings/security
/tenant/settings/notifications
/tenant/settings/payments
/tenant/settings/documents
/tenant/settings/appearance
```

Reuse existing management Settings layout components where possible:
- Settings shell
- Sidebar nav
- Settings card
- Section header
- Input row
- Toggle row
- Save button
- Confirmation modal

### Components

```txt
TenantSettingsLayout
TenantSettingsSidebar
TenantSettingsCard
SettingsSectionHeader
SettingsFieldRow
SettingsToggleRow
SettingsPreferenceMatrix
SettingsDangerZone
```

---

## Phase 2: My Account

### Objective

Allow tenants to manage basic identity and contact info.

### Fields

```ts
TenantAccountSettings {
  firstName: string;
  lastName: string;
  preferredName?: string;
  email: string;
  phone?: string;
  profilePhotoUrl?: string;
  language?: string;
  timezone?: string;
}
```

### UI Sections

```txt
Profile Photo
Personal Information
Contact Information
Preferences
```

### Actions

- Upload/change photo
- Save profile changes
- Verify new email
- Verify new phone number

### Validation

- First name required
- Last name required
- Email required and valid
- Phone must be valid if provided
- Preferred name optional

---

## Phase 3: Login & Security

### Objective

Give tenants control over account access.

### Sections

```txt
Password
Two-Factor Authentication
Active Sessions
Connected Accounts
```

### Features

- Change password modal
- Enable 2FA
- Disable 2FA
- View active sessions
- Sign out of all other sessions

### Data Model

```ts
TenantSecuritySettings {
  hasPassword: boolean;
  twoFactorEnabled: boolean;
  connectedProviders: Array<'google' | 'apple' | 'email'>;
  activeSessions: TenantSession[];
}

TenantSession {
  id: string;
  device: string;
  location?: string;
  lastActiveAt: string;
  current: boolean;
}
```

---

## Phase 4: Notifications

### Objective

Allow tenants to choose how they receive non-required updates.

### Notification Types

```ts
type TenantNotificationType =
  | 'rent_reminder'
  | 'payment_confirmation'
  | 'failed_payment'
  | 'maintenance_update'
  | 'manager_message'
  | 'lease_document'
  | 'property_announcement'
  | 'entry_notice'
  | 'security_alert';
```

### Channels

```ts
type NotificationChannel = 'email' | 'sms' | 'in_app' | 'push';
```

### UI

Use a preference matrix.

```txt
Rent reminders
Payment confirmations
Maintenance updates
Manager messages
Lease & document updates
Property announcements
Security alerts
```

### Required Notices

Some rows should be locked:

```ts
required: true
```

Required rows should show helper text:

```txt
Required notices are always sent to keep you informed about your lease, payments, or account security.
```

---

## Phase 5: Payment Settings

### Objective

Let tenants manage payment methods and autopay.

### Sections

```txt
Payment Methods
Default Payment Method
Autopay
Receipts
Billing Address
```

### Payment Method Model

```ts
TenantPaymentMethod {
  id: string;
  type: 'bank_account' | 'credit_card' | 'debit_card';
  brand?: string;
  last4: string;
  expirationMonth?: number;
  expirationYear?: number;
  isDefault: boolean;
  processor: 'stripe' | 'finix' | 'paypal' | 'other';
}
```

### Autopay Model

```ts
TenantAutopaySettings {
  enabled: boolean;
  paymentMethodId?: string;
  amountType: 'full_balance' | 'rent_only' | 'fixed_amount';
  fixedAmount?: number;
  paymentTiming: 'on_due_date' | 'days_before_due_date';
  daysBeforeDueDate?: number;
}
```

### UX Requirements

- Confirm before enabling autopay.
- Confirm before disabling autopay.
- Show upcoming autopay preview:

```txt
Your next automatic payment of $1,450.00 will be paid on June 1.
```

- Show processing fee preview:

```txt
ACH: Free
Debit card: $3.95
Credit card: 2.9%
```

- Do not store raw card/bank data in your own database.
- Store only payment processor references and display metadata.

---

## Phase 6: Documents & E-Signature

### Objective

Give tenants access to document-related preferences and legal document actions.

### Sections

```txt
Document Profile
E-Signature
Paperless Delivery
Document Archive
```

### Features

- View legal name
- Request legal name update
- Manage e-sign consent
- Enable paperless delivery
- Download document archive
- Shortcut to lease documents

### Data Model

```ts
TenantDocumentSettings {
  legalName: string;
  eSignatureConsent: boolean;
  paperlessDelivery: boolean;
  documentEmail: string;
}
```

### UX Notes

Do not allow direct editing of legal name without approval.

Use a request action:

```txt
Request Legal Name Change
```

---

## Phase 7: My Unit Settings

### Objective

Expose renter profile details tied to the tenant’s unit.

### Sections

```txt
Unit Summary
Occupants
Pets
Vehicles
Parking & Storage
Renters Insurance
```

### Data Model

```ts
TenantUnitSettings {
  propertyName: string;
  unitLabel: string;
  address: string;
  leaseStartDate: string;
  leaseEndDate: string;
  occupants: Occupant[];
  pets: Pet[];
  vehicles: Vehicle[];
  parkingSpaces: ParkingSpace[];
  rentersInsurance?: RentersInsurancePolicy;
}
```

### Editable vs. Request-Based

| Item | Tenant Action |
|---|---|
| Phone/email | Direct edit |
| Vehicle info | Direct edit or request-based |
| Renters insurance | Upload/update |
| Pet | Request approval |
| Occupant | Request approval |
| Legal name | Request update |
| Lease terms | View only |

---

## Phase 8: Appearance & Accessibility

### Objective

Give tenants simple control over app presentation.

### Appearance Options

```ts
TenantAppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor?: string;
  density?: 'comfortable' | 'compact';
}
```

### Accessibility Options

```ts
TenantAccessibilitySettings {
  reduceMotion: boolean;
  highContrast: boolean;
  largerText: boolean;
}
```

### UX Notes

This can be a single page at first:

```txt
Appearance
- Theme
- Reduce motion
- Larger text
```

---

## Phase 9: Privacy & Data

### Objective

Add a trust-building page for data visibility and account controls.

### Sections

```txt
Privacy
Data Export
Account Status
Legal
```

### Features

- Download my data
- Request account deletion
- Marketing communication opt-out
- Privacy policy link
- Terms link

### Important States

If tenant has an active lease:

```txt
Your account cannot be fully deleted while you have an active lease. Some records may be retained for legal, payment, and lease history purposes.
```

---

# Recommended Tenant Settings Layout

## Desktop

Same overall structure as management side:

```txt
Left Sidebar
- Settings title
- Sectioned nav

Main Content Card
- Page title
- Short description
- Divider
- Form content
- Save/action area
```

## Mobile

Use a stacked layout:

```txt
Settings
[Dropdown or segmented menu]

Card content
Primary actions sticky at bottom when editing
```

For mobile, avoid a tall sidebar. Use:
- Settings index list
- Select menu
- Tabs
- Drawer navigation

---

# Suggested Tenant Settings Sidebar Copy

```txt
Settings
Manage your account, payments, notifications, and app preferences.
```

## Sidebar

```txt
PERSONAL
My Account
Login & Security
Notifications

HOME & LEASE
My Unit
Payment Settings
Documents

PREFERENCES
Appearance
Accessibility

ACCOUNT
Privacy & Data
Support
```

---

# Suggested Page Headers

## My Account

```txt
My Account
Manage your personal information and contact details.
```

## Login & Security

```txt
Login & Security
Manage your password, verification methods, and active sessions.
```

## Notifications

```txt
Notifications
Choose how you receive rent reminders, maintenance updates, and messages.
```

## Payment Settings

```txt
Payment Settings
Manage payment methods, autopay, receipts, and billing preferences.
```

## Documents

```txt
Documents & E-Signature
Manage document delivery, e-signature consent, and document profile details.
```

## My Unit

```txt
My Unit
Review your unit details and manage renter profile information.
```

## Appearance

```txt
Appearance
Customize how the app looks and feels.
```

## Privacy & Data

```txt
Privacy & Data
Manage privacy preferences, data export, and account requests.
```

## Support

```txt
Support
Get help with your account, payments, or property-related questions.
```

---

# Backend / Data Considerations

## Tables or Collections

```txt
tenant_profiles
tenant_notification_preferences
tenant_payment_preferences
tenant_payment_methods
tenant_autopay_settings
tenant_security_settings
tenant_document_preferences
tenant_unit_profiles
tenant_privacy_requests
```

## Important Relationships

```txt
tenant_profiles.user_id -> auth.users.id
tenant_profiles.tenant_id -> tenants.id
tenant_unit_profiles.lease_id -> leases.id
tenant_payment_methods.tenant_id -> tenants.id
tenant_notification_preferences.tenant_id -> tenants.id
```

---

# Permissions

Tenant can:

```txt
View their own settings
Edit personal contact info
Manage payment methods
Manage autopay
Manage notification preferences
Upload renters insurance
Request pet/occupant/legal-name changes
Manage appearance/accessibility preferences
```

Tenant cannot:

```txt
Edit rent amount
Edit lease dates
Edit legal lease terms
Edit property/unit assignment
Edit manager-controlled fees
Delete legal/payment/lease history
Disable required legal/security notices
```

---

# Suggested MVP Build Order

## Sprint 1

```txt
Tenant Settings shell
My Account page
Appearance page
Basic Notifications page
```

## Sprint 2

```txt
Payment Settings
Autopay controls
Saved payment methods
Receipts preference
```

## Sprint 3

```txt
Documents settings
E-signature consent
My Unit settings
Renters insurance upload
```

## Sprint 4

```txt
Login & Security
Privacy & Data
Support
Accessibility preferences
```

---

# Best Product Recommendation

For the first tenant release, prioritize these:

1. **My Account**
2. **Payment Settings**
3. **Notifications**
4. **Login & Security**
5. **Documents**
6. **Appearance**

“My Unit” can exist as its own main nav page, with Settings only linking to editable/request-based unit preferences. That keeps the app cleaner and avoids duplicating the same content in two places.
