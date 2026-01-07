# login-round-two.md

## Purpose

Refine the existing login experience to:
- Increase clarity for tenants, property managers, and vendors
- Reduce cognitive load and hesitation
- Improve authentication success rate
- Encourage faster, lower-friction sign-in methods
- Maintain a clean, enterprise-grade aesthetic

This is an **iteration pass**, not a redesign.

---

## Design Goals

1. Make the value and scope of the product immediately clear
2. Reduce ambiguity in language (e.g. “workspace”)
3. Promote the fastest, lowest-friction sign-in paths
4. Preserve a role-agnostic login model
5. Improve trust and perceived security
6. Optimize for infrequent users (tenants, vendors)

---

## Updated Page Copy

### Header

**Primary**
Sign in to Rentaru

markdown
Copy code

**Supporting**
Access your properties, payments, leases, and maintenance requests.

yaml
Copy code

Rationale:
- Concrete nouns
- Covers all user types
- No role-specific language

---

## Authentication Method Hierarchy

### Priority Order

1. Passkey (passwordless)
2. Google SSO
3. Email + Password
4. Additional OAuth providers (deferred)

---

## Social / Passwordless Section

### Placement

Top of card, above email/password.

### UI

Fastest way to sign in

[ Continue with Passkey ]

[ Continue with Google ]

yaml
Copy code

- GitHub removed from primary view
- Microsoft may be added later for enterprise
- Passkey presented as first-class, not secondary

---

## Divider

──────── OR CONTINUE WITH EMAIL ────────

yaml
Copy code

- Uses explicit language
- Avoids ambiguous “OR”

---

## Email & Password Section

### Email Field

**Label**
Email

markdown
Copy code

**Placeholder**
email@company.com

yaml
Copy code

**Behavior**
- Autofocus on page load
- Aggressive browser autofill support
- Email domain captured for future SSO suggestions

---

### Password Field

**Label**
Password

markdown
Copy code

**Features**
- Show / hide toggle
- Caps Lock warning
- Enter key submits form

**Supporting Action**
Forgot your password?

yaml
Copy code

Right-aligned, high-contrast, mobile tappable.

---

## Primary CTA

### Button

Sign in

shell
Copy code

### Loading State

Signing you in…

css
Copy code

Optional subtle microcopy below button:
Secure sign-in

yaml
Copy code

---

## Bottom CTA

### Copy

New to Rentaru? Create an account

scss
Copy code

Alternative (contextual):
Have an invite? Get started

yaml
Copy code

Used when invite token is detected.

---

## Invitation Awareness

### Conditional Banner (Top of Card)

You’ve been invited to join Skyline Properties

yaml
Copy code

- Shown when invite token is present
- Reinforces legitimacy
- Reduces confusion for first-time tenants/vendors

---

## Error States

### Invalid Credentials

That email or password doesn’t match our records.

shell
Copy code

### Account Disabled

This account has been temporarily disabled. Contact support.

shell
Copy code

### Invite Not Accepted

Your invitation hasn’t been accepted yet. Check your email to continue.

yaml
Copy code

---

## Visual Refinements

- Reduce card shadow intensity
- Increase vertical spacing between sections
- Input icons reduced to ~80% opacity
- Maintain soft rounded corners
- Calm, neutral color palette
- No marketing illustrations

---

## Accessibility Requirements

- Full keyboard navigation
- Screen-reader labels
- Focus outlines preserved
- Touch targets ≥ 44px
- Error messages announced via ARIA

---

## Mobile-Specific Adjustments

- Full-height card layout
- Keyboard-aware spacing
- Passkey CTA remains visible above fold
- Larger tap targets for OAuth buttons

---

## Security & Trust Signals

- Passkeys promoted but optional
- Rate-limited login attempts
- Clear feedback during loading
- No technical jargon exposed to users

---

## Explicit Non-Goals

This iteration does NOT include:
- Role selection
- Organization selection
- Feature marketing
- Pricing or upsell messaging

Those occur post-authentication.

---

## Success Metrics

- Increased passkey adoption
- Reduced password reset requests
- Faster average sign-in time
- Lower login abandonment
- Fewer support tickets from tenants/vendors

---

## Design North Star

Fast to enter  
Clear in purpose  
Calm in tone  
Secure by default  

The login screen should disappear from memory the moment it succeeds.