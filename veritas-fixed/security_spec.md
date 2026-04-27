# Security Specification - AGNEYA

## Data Invariants
1. A complaint must have a valid `citizenId` matching the author.
2. A complaint's status can only be updated by admins or workers.
3. Users can only edit their own profiles (except for admin overrides).
4. Complaints are visible to the author, workers, and admins.

## The "Dirty Dozen" Payloads (Rejected)
1. **Identity Spoofing**: Creating a complaint with someone else's `citizenId`.
2. **Privilege Escalation**: Updating own profile to have `role: 'admin'`.
3. **Status Hijack**: Citizen trying to mark their own complaint as 'solved'.
4. **Data Corruption**: Injecting 1MB string into `trackId`.
5. **Unauthorized Read**: Citizen trying to list all complaints in the system.
6. **Orphaned Writes**: Creating a complaint without required fields.
7. **Immutability Breach**: Changing `createdAt` on update.
8. **Shadow Field**: Adding `is_verified: true` to a complaint.
9. **Admin Bypass**: Trying to access `/profiles/` list as a regular citizen.
10. **ID Poisoning**: Using a 1KB string as a `complaintId`.
11. **PII Leak**: Citizen fetching another user's profile directly.
12. **State Shortcutting**: Skipping `under_process` directly to `solved` (though not strictly enforced by enum alone, but by role).

## Test Runner Plan
We will use `@firebase/rules-unit-testing` if available, or just describe the test cases if not. Since I can't easily run full integration tests in this environment with real emulators without a lot of setup, I will focus on perfect rules and linting.

Actually, I will install the ESLint plugin as suggested.
