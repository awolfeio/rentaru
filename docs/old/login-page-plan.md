# login-page-plan.md

## Purpose

Design and implement a **single, role-agnostic login experience** that works seamlessly for:
- Tenants
- Property managers / owners
- Maintenance vendors
- Future roles (accountants, brokers, auditors, etc.)

The login flow must be:
- Intuitive
- Scalable
- Secure
- Industry-standard
- Free of premature role selection

---

## Core Design Principle

**Users authenticate as people, not roles.**

- Login only establishes identity.
- Organization + role resolution happens **after authentication**.
- Routing is automatic and context-aware.

This avoids:
- Fragmented login pages
- Role confusion
- Hard-to-scale permission logic

---

## High-Level Authentication Flow

1. User authenticates (email/password, passkey, or SSO)
2. Backend resolves:
   - Organizations user belongs to
   - Roles per organization
3. System routes user:
   - Directly to destination if context is unambiguous
   - To a context picker if multiple options exist

---

## Login Page UI Structure

### Page Layout

- Centered card layout
- Brand logo at top
- Neutral language (no role-specific wording)

