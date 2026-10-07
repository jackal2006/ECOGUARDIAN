# Security Specification for Eco Guardian

## Data Invariants
1. Users may only create their own user document where docId matches auth.uid.
2. Users cannot self-escalate their role to 'admin' unless verified against the /admins collection.
3. Pollution reports can be submitted by authenticated users, storing their own userId.
4. Users can only update or delete their own reports, or admins can update/delete any report.
5. Challenge completions can only be logged by the authenticated user for their own UID.
6. Public articles and challenges can be read by all users, but only created/updated/deleted by admins.
7. Admin permissions are securely backed by exists(/databases/$(database)/documents/admins/$(request.auth.uid)).

## The Dirty Dozen Payloads
1. Anonymous user attempts to write to /pollutionReports. (Denied)
2. User 'bob' attempts to create a report with userId 'alice'. (Denied)
3. User attempts to modify admin status or ecoPoints maliciously without proper gate. (Denied)
4. Non-admin attempts to delete another user's pollution report. (Denied)
5. Non-admin attempts to create or edit an educational article. (Denied)
6. Attacker attempts to inject 2MB description string into pollutionReport. (Denied)
7. Non-admin attempts to write to /admins collection. (Denied)
8. User attempts to update a report that is already Resolved without admin role. (Denied)
9. Attacker attempts path injection with invalid ID characters. (Denied)
10. Attacker attempts shadow fields injection during report creation. (Denied)
11. Unauthenticated user attempts to read private user profile data. (Denied)
12. User attempts to overwrite another user's challenge completion record. (Denied)
