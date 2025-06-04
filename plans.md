# Insanely Productive EazyHomes v2 Master Plan

@plan EnhancedDashboardPhase1
- [ ] @task Add new Insight tab in sidebar (or extend Dashboard tab)
- [ ] @task Create "Performance Insights" component:
    - [ ] Average time to close matter
    - [ ] Top-performing staff
    - [ ] Workflow bottleneck detection
- [ ] @task Create "Workload Overview" component:
    - [ ] Workload per staff member
    - [ ] Heatmap or bar chart for distribution
- [ ] @task Build "Financial Insights":
    - [ ] Revenue by matter type
    - [ ] Invoice aging chart
    - [ ] Payment trend graph
- [ ] @task Build "Client Insights":
    - [ ] Top 5 clients by volume
    - [ ] Filterable client contribution graph
- [ ] @task Build Compliance Snapshot widget (e.g., FICA progress bars)

@plan NotificationsSystemPhase2
- [ ] @task Create central notification engine (cron or Firebase-based)
- [ ] @task Add UI "bell icon" or dedicated Notifications page
- [ ] @task Implement Deadline Alerts:
    - [ ] Deeds lodgement reminders
    - [ ] Bond approval expiry
- [ ] @task Matter Status Alerts:
    - [ ] Push + email when status changes (e.g., Registered)
- [ ] @task Expiring Document Alerts:
    - [ ] Watch FICA, POA
- [ ] @task Overdue Task Alerts:
    - [ ] Matter-specific overdue detection
- [ ] @task Client Reminder Module:
    - [ ] SMS or email triggers (via API)
- [ ] @task Notification Settings:
    - [ ] Allow users to toggle types (in-app, email, SMS)

@plan KnowledgeBaseSystemPhase3
- [ ] @task Create new sidebar tab: "Knowledge" or "Resources"
- [ ] @task Upload + render SOPs / Playbooks
- [ ] @task Upload + categorize template documents
- [ ] @task Build Legal Feed system (manually or later via RSS/API)
- [ ] @task Create searchable FAQ
- [ ] @task Create Admin-only uploader dashboard

@plan ClientPortalPhase4
- [ ] @task Build client-facing portal view (secure tokenized access)
- [ ] @task Link client to matter + show timeline view
- [ ] @task Allow document uploads (FICA, etc.) from client portal
- [ ] @task Enable automated progress updates:
    - [ ] Email at key status points (e.g., Lodged → Registered)
- [ ] @task Integrate appointment confirmation + meeting reminders
- [ ] @task Setup simple client emailing from matter

@plan AuditTrailPhase5
- [ ] @task Build centralized logging system
- [ ] @task Track all critical actions: upload, change status, login
- [ ] @task Create UI view per matter: "Activity Timeline"
- [ ] @task Enable export (CSV or PDF) for audit reports
- [ ] @task Filter logs by date, user, action

@plan PermissionsSecurityPhase6
- [ ] @task Define user roles: Admin, Paralegal, Conveyancer, Client
- [ ] @task Implement fine-grained permissions per module:
    - [ ] View/edit/delete per matter and document
- [ ] @task Build permission UI editor (for Admins)
- [ ] @task Block restricted access with error boundaries

@plan CRMLitePhase7
- [ ] @task Transform client list into CRM view
- [ ] @task Track all communication history (SMS, email, messages)
- [ ] @task Store client-specific notes and preferences
- [ ] @task Allow client tagging (e.g., "Developer," "Repeat Buyer")
- [ ] @task Optional: Add referral source tracking

@plan WorkflowEnginePhase8
- [ ] @task Build dynamic checklist system (based on matter type)
- [ ] @task Link task templates to workflows
- [ ] @task Automate task assignment per matter stage
- [ ] @task Add conditional logic rules (e.g., if estate → add POA task)
- [ ] @task Build low-code rule editor (stretch goal) 