/* Engage WorkForce — Subscription & Free Trial clickable prototype.
   Everything is fake data kept in this browser (localStorage). Nothing talks to the real app.
   The pricing formula, feature catalogue and trial rules follow
   EngageWorkForce/docs/Subscription-Trial-Rebuild-Plan.md. */
(function () {
'use strict';

const KEY = 'ewf-subscription-prototype';
const VERSION = 2;
const START_DAY = '2026-10-07';
const DAY = 86400000;
const ME = 'Dev Patel';

/* ================= catalogue (mirrors the plan) ================= */
const PLAN_RANK = { Starter: 1, Professional: 2, Enterprise: 3, Custom: 3 };
const LIST_RATE = { Starter: 6, Professional: 10 };            // AUD ex-GST per guard / month
const TIERS = ['Starter', 'Professional', 'Enterprise'];
const PLANS = ['Starter', 'Professional', 'Enterprise', 'Custom'];

const FEATURES = [
    { key: 'insighthub', name: 'Insight Hub', cat: 'Core', min: 'Always', desc: 'Operations dashboard and live situation.' },
    { key: 'staff', name: 'Staff & HR records', cat: 'Core', min: 'Always', desc: 'Staff profiles, HR details and documents.' },
    { key: 'customers', name: 'Customers & Sites', cat: 'Core', min: 'Always', desc: 'Customers, sites and contacts.' },
    { key: 'scheduling', name: 'Scheduling & Rostering', cat: 'Core', min: 'Always', desc: 'Roster, publish, offer and copy shifts.' },
    { key: 'timesheets', name: 'Timesheets', cat: 'Core', min: 'Always', desc: 'Clock-in/out and timesheet approval.' },
    { key: 'leave', name: 'Leave & Availability', cat: 'Core', min: 'Always', desc: 'Leave requests and availability.' },
    { key: 'reports', name: 'Reports & Exports', cat: 'Core', min: 'Always', desc: 'Performance reports and exports.' },
    { key: 'kb', name: 'Knowledge Base', cat: 'Core', min: 'Always', desc: 'In-app help articles.' },
    { key: 'documents', name: 'Documents & Files', cat: 'Core', min: 'Always', desc: 'Document storage and sharing.' },
    { key: 'mobile', name: 'Mobile App', cat: 'Core', min: 'Always', desc: 'Guard app: shifts, clock-in, forms.' },

    { key: 'checkpoints', name: 'Site checkpoints & QR', cat: 'Field operations', min: 'Professional', desc: 'QR / NFC checkpoints on sites.', recorded: 'Lives inside the protected Sites page, so it stays visible.' },
    { key: 'patrol', name: 'Patrol sites & mobile patrol', cat: 'Field operations', min: 'Professional', desc: 'Patrol sites, regions, runsheets, dispatch jobs, vehicles.' },
    { key: 'sos', name: 'SOS alerts', cat: 'Field operations', min: 'Professional', desc: 'Guard SOS button and alert report.', recorded: 'Mobile app and report only; nothing to hide on the web.' },
    { key: 'responseforms', name: 'Response forms', cat: 'Forms & incidents', min: 'Professional', desc: 'Incident, end-of-shift and alarm response reports.' },
    { key: 'dynamicforms', name: 'Dynamic forms', cat: 'Forms & incidents', min: 'Professional', desc: 'Build your own forms and checklists.' },
    { key: 'incidentdash', name: 'Incident dashboard', cat: 'Forms & incidents', min: 'Professional', desc: 'Incident analytics, severity and categories.' },
    { key: 'escalation', name: 'Instant escalation', cat: 'Forms & incidents', min: 'Professional', desc: 'Auto-alert managers on serious incidents.' },
    { key: 'commandcentre', name: 'Live map & command centre', cat: 'Live operations', min: 'Professional', desc: 'Full-screen live map of guards and sites.', recorded: 'The map widget on Insight Hub stays visible (protected page).' },
    { key: 'compliance', name: 'Compliance & licences', cat: 'Compliance', min: 'Professional', desc: 'Compliance document types and expiry tracking.', recorded: 'Licence screens inside the protected Staff page stay visible.' },
    { key: 'payrates', name: 'Pay rates & awards', cat: 'Payroll & billing', min: 'Professional', desc: 'Pay templates, awards and holidays.' },
    { key: 'paysheets', name: 'Paysheets & payroll export', cat: 'Payroll & billing', min: 'Professional', desc: 'Paysheets and CSV export.' },
    { key: 'invoicing', name: 'Invoicing & billing runs', cat: 'Payroll & billing', min: 'Professional', desc: 'Invoices from approved hours, credit notes, billing runs.' },
    { key: 'xero', name: 'Xero integration', cat: 'Payroll & billing', min: 'Professional', desc: 'Send paysheets and invoices to Xero.' },
    { key: 'clientportal', name: 'Client portal', cat: 'Client', min: 'Professional', desc: 'Your customers log in to see their own sites.', recorded: 'Customer logins are not blocked in v1.' },
    { key: 'agreements', name: 'Agreements (contracts & quotations)', cat: 'Agreements', min: 'Enterprise', desc: 'Job contracts and quotations with sign links.' },
    { key: 'smartrec', name: 'Smart recommendation & auto-fill', cat: 'Intelligence', min: 'Enterprise', desc: 'Recommend best staff and auto-fill open shifts.', recorded: 'The "Recommend best staff" button on Schedule stays visible.' },
    { key: 'risk', name: 'Risk prediction', cat: 'Intelligence', min: 'Enterprise', desc: 'Predict shifts at risk of failing.', recorded: 'The risk panel on Insight Hub stays visible.' },
    { key: 'wps', name: 'Worker performance', cat: 'Intelligence', min: 'Enterprise', desc: 'Reliability, punctuality and dependability scores.', recorded: 'The performance panel on Insight Hub stays visible.' },
    { key: 'automation', name: 'Automation engine', cat: 'Intelligence', min: 'Enterprise', desc: 'When-this-then-that rules for alerts.', recorded: 'The automation panel on Insight Hub stays visible.' },
    { key: 'contractors', name: 'Contractor management', cat: 'Platform', min: 'Enterprise', soon: true, desc: 'Promised on the pricing page but not built (decision 10).' },
    { key: 'api', name: 'API access', cat: 'Platform', min: 'Enterprise', soon: true, desc: 'Not sellable yet.' },
    { key: 'whitelabel', name: 'White label', cat: 'Platform', min: 'Enterprise', soon: true, desc: 'Not sellable yet.' },
];
const BY_KEY = Object.fromEntries(FEATURES.map(f => [f.key, f]));
const CATS = [...new Set(FEATURES.map(f => f.cat))];
const SELLABLE = FEATURES.filter(f => !f.soon);

/* Customer-app topbar. `f` = the feature that page belongs to (null = always open). */
const NAV = [
    { label: 'Insight Hub', path: 'insighthub', f: 'insighthub' },
    { label: 'Schedule', path: 'schedule', f: 'scheduling' },
    { label: 'TimeSheet', path: 'timesheet', f: 'timesheets' },
    { label: 'Leave', path: 'leave', f: 'leave' },
    { label: 'Staff', path: 'staff', f: 'staff' },
    { label: 'Customers', children: [
        { label: 'Customer', path: 'customers', f: 'customers' },
        { label: 'Site', path: 'sites', f: 'customers' }] },
    { label: 'Patrol', children: [
        { label: 'Patrol Sites', path: 'patrol-sites', f: 'patrol' },
        { label: 'Regions', path: 'regions', f: 'patrol' },
        { label: 'Runsheets', path: 'runsheets', f: 'patrol' },
        { label: 'Dispatch Job', path: 'dispatch-job', f: 'patrol' },
        { label: 'Patrol Vehicles', path: 'patrol-vehicles', f: 'patrol' }] },
    { label: 'Forms', children: [
        { label: 'Response Forms', path: 'response-forms', f: 'responseforms' },
        { label: 'Dynamic Forms', path: 'dynamic-forms', f: 'dynamicforms' },
        { label: 'Incident Dashboard', path: 'incident-dashboard', f: 'incidentdash' }] },
    { label: 'Command Centre', path: 'command-centre', f: 'commandcentre' },
    { label: 'Invoices', path: 'invoices', f: 'invoicing' },
    { label: 'Paysheets', path: 'paysheets', f: 'paysheets' },
    { label: 'Agreements', children: [
        { label: 'Job Contracts', path: 'job-contracts', f: 'agreements' },
        { label: 'Quotations', path: 'quotations', f: 'agreements' }] },
    { label: 'Intelligence', children: [
        { label: 'Risk Dashboard', path: 'risk-dashboard', f: 'risk' },
        { label: 'Worker Performance', path: 'worker-performance', f: 'wps' },
        { label: 'Automations', path: 'automations', f: 'automation' },
        { label: 'Recommendation Insights', path: 'recommendation-analytics', f: 'smartrec' },
        { label: 'Auto-Fill Open Shifts', path: 'schedule/auto-fill', f: 'smartrec' }] },
    { label: 'Reports', path: 'performance-reports', f: 'reports' },
    { label: 'Settings', children: [
        { label: 'Company Settings', path: 'settings/company-settings', f: null },
        { label: 'Pay Rates', path: 'payrates', f: 'payrates' },
        { label: 'Holidays', path: 'holidays', f: 'payrates' },
        { label: 'Compliance Types', path: 'compliance-types', f: 'compliance' },
        { label: 'Xero Payroll', path: 'settings/xero-payroll', f: 'xero' },
        { label: 'Instant Escalation', path: 'settings/escalation', f: 'escalation' },
        { label: 'Recommendation Settings', path: 'recommendation-settings', f: 'smartrec' },
        { label: 'Site Requirements', path: 'site-requirements', f: 'smartrec' },
        { label: 'Risk Prediction Settings', path: 'risk-prediction-settings', f: 'risk' },
        { label: 'Worker Performance Settings', path: 'worker-performance-settings', f: 'wps' }] },
];
const PAGES = {};
NAV.forEach(n => (n.children || [n]).forEach(p => { PAGES[p.path] = p; }));

const INQ_STATUS = {
    New: ['New', 'p-blue'], Contacted: ['Contacted', 'p-slate'], MeetingBooked: ['Meeting booked', 'p-violet'],
    TrialActive: ['Trial active', 'p-teal'], Won: ['Won', 'p-green'], Lost: ['Lost', 'p-red'],
};
const INTEREST = { FreeTrial: 'Free trial', Demo: 'Just a demo', Question: 'Question' };
const MODEL = { PerGuard: 'Per guard', AnnualLicence: 'Annual licence', Custom: 'Custom' };
const AG_STATUS = { Trial: 'Trial', Active: 'Active', TrialEnded: 'Trial ended', Suspended: 'Suspended', Cancelled: 'Cancelled' };
// Billing: the app works out the amount; Xero holds the real invoice. `status` is what our app last saw in Xero.
const INV_KIND = { Initial: 'First invoice', Monthly: 'Monthly usage', Renewal: 'Renewal', Manual: 'One-off' };
const INV_ST = { Queued: ['Not in Xero', 'p-grey'], Draft: ['Draft in Xero', 'p-blue'], Awaiting: ['Awaiting payment', 'p-violet'], Overdue: ['Overdue', 'p-red'], Paid: ['Paid', 'p-green'], Void: ['Voided', 'p-line'] };
const XSTATUS = { DRAFT: 'Draft', AUTHORISED: 'Awaiting', PAID: 'Paid', VOIDED: 'Void' };
const XERO_TEXT = { DRAFT: 'Draft', AUTHORISED: 'Approved and sent: awaiting payment', PAID: 'Paid', VOIDED: 'Voided' };
const MAIL_KIND = { sales: ['Sales', 'p-violet'], customer: ['Customer', 'p-teal'], xero: ['From Xero', 'p-blue'] };
const TEAM_SIZES = ['1 – 20 employees', '21 – 50 employees', '51 – 200 employees', '200+ employees'];
const TIMEZONES = ['AUS Eastern Standard Time', 'E. Australia Standard Time', 'Cen. Australia Standard Time', 'W. Australia Standard Time', 'Tasmania Standard Time', 'New Zealand Standard Time'];

/* ================= helpers ================= */
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = v => { const n = parseFloat(v); return Number.isFinite(n) ? n : 0; };
const clone = o => JSON.parse(JSON.stringify(o));
const $ = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
const utc = iso => { const [y, m, d] = iso.split('-').map(Number); return Date.UTC(y, m - 1, d); };
const addDays = (iso, n) => new Date(utc(iso) + n * DAY).toISOString().slice(0, 10);
const diffDays = (a, b) => Math.round((utc(a) - utc(b)) / DAY);          // a − b
const fmtDate = iso => iso ? new Date(utc(iso)).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : '—';
const fmtDay = iso => new Date(utc(iso)).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const fmtStamp = s => { if (!s) return '—'; const [d, t] = s.split(' '); return fmtDate(d) + (t ? ' · ' + t : ''); };
const money = (n, cents) => '$' + num(n).toLocaleString('en-AU', { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : (num(n) % 1 ? 2 : 0) });
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const realTime = () => { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
const stamp = t => state.today + ' ' + (t || realTime());
const round2 = n => Math.sign(n) * Math.round(Math.abs(n) * 100 + 1e-7) / 100;   // half-up to the cent
const prevMonth = day => { const [y, m] = day.split('-').map(Number); return new Date(Date.UTC(y, m - 2, 1)).toISOString().slice(0, 7); };   // 'YYYY-MM' of the month before `day`
const monthLabel = ym => new Date(utc(ym + '-01')).toLocaleDateString('en-AU', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const firstName = n => String(n || '').trim().split(/\s+/)[0] || 'there';
const pill = (txt, cls) => `<span class="pill ${cls}">${esc(txt)}</span>`;
const icon = {
    lock: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
};

/* ================= state ================= */
let state;
const ui = { inqFilter: 'All', inqSearch: '', custFilter: 'All', custSearch: '', billFilter: 'All', inboxFilter: 'All', calcGuards: 30, calcAnnual: false, formSent: null };

function load() {
    try {
        const raw = localStorage.getItem(KEY);
        if (raw) { const s = JSON.parse(raw); if (s && s.v === VERSION) return s; }
    } catch (e) { /* storage blocked: fall back to seed */ }
    return null;
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } }
function nid(p) { state.nextId++; return p + '-' + state.nextId; }
const comp = id => state.companies.find(c => c.id === id);
const inq = id => state.inquiries.find(q => q.id === id);

function agreementDefaults(o) {
    return Object.assign({
        plan: 'Professional', status: 'Active', trialStart: null, trialDays: null, trialEnd: null, subscribedAt: null,
        model: 'PerGuard', rate: 10, minMonthly: 99, term: 'Monthly', includedGuards: null, annualAmount: null,
        renewalDate: null, billingNotes: '', inquiryId: null, day3Sent: false, day1Sent: false, endedNotified: false,
    }, o);
}
function companyDefaults(o) {
    return Object.assign({
        phone: '', country: 'Australia', timeZone: 'AUS Eastern Standard Time', activated: true,
        guardsThis: 0, guardsLast: 0, agreement: null, overrides: [], history: [], requested: [], billing: null,
    }, o);
}
function billOf(c) {   // billing details; created on first use so every customer has them
    if (!c.billing) c.billing = { legalName: c.name, email: c.adminEmail, abn: '', address: '', chargeGst: c.country !== 'New Zealand', ref: '', xeroContactId: null };
    return c.billing;
}
function hist(c, action, detail, reason, at, system) {
    c.history.unshift({ at: at || stamp(), action, detail: detail || '', reason: reason || '', by: system ? 'System (nightly job)' : ME, system: !!system });
}

function seed() {
    state = {
        v: VERSION, today: START_DAY, nextId: 100, viewAs: 'c-southern',
        settings: { salesInbox: 'engageworkforceofficial@gmail.com', minMonthly: 99, annualMonths: 10, notifyCustomers: false, enforce: true, matrix: {},
            billing: { supplier: 'Engage WorkForce Pty Ltd', xeroOrg: 'Engage WorkForce Pty Ltd (Xero demo company)', xeroOk: true, accountCode: '200', terms: 14, gstRate: 10, billingDay: 1, renewalLeadDays: 30 } },
        inquiries: [], companies: [], emails: [], jobLog: [], invoices: [], xeroSeq: 40,
    };
    const q = o => state.inquiries.push(Object.assign({ phone: '', teamSize: '', message: '', sourcePage: '/free-trial', notes: '', convertedCompanyId: null, preferredTrialDays: null, createdMs: 0 }, o));
    q({ id: 'q-redline', createdAt: '2026-10-07 09:12', fullName: 'Ava Wilson', companyName: 'Redline Security', email: 'ava@redline.example', phone: '0412 555 201', teamSize: TEAM_SIZES[1], selectedPlan: 'Professional', interest: 'FreeTrial', preferredTrialDays: 14, message: 'We roster about 35 guards across 9 sites and want to get off spreadsheets before Christmas.', status: 'New' });
    q({ id: 'q-bayside', createdAt: '2026-10-06 14:40', fullName: 'Noah Patel', companyName: 'Bayside Crowd Control', email: 'noah@baysidecc.example', phone: '0433 118 902', teamSize: TEAM_SIZES[0], selectedPlan: 'Starter', interest: 'Demo', message: 'Mostly events on weekends. Want to see the mobile app.', status: 'Contacted', notes: 'Called 6 Oct. Wants a demo next week, prefers mornings.' });
    q({ id: 'q-northern', createdAt: '2026-10-03 11:05', fullName: 'Grace Lee', companyName: 'Northern Rivers Guarding', email: 'grace@nrguarding.example', phone: '0401 776 330', teamSize: TEAM_SIZES[2], selectedPlan: 'Professional', interest: 'FreeTrial', preferredTrialDays: 7, message: 'Need award rates and Xero.', status: 'MeetingBooked', notes: 'Demo booked Thu 9 Oct, 2 pm. Bring payroll examples.' });
    q({ id: 'q-southern', createdAt: '2026-09-26 16:20', fullName: 'Mia Thompson', companyName: 'Southern Cross Patrols', email: 'mia@southerncross.example', phone: '0422 640 117', teamSize: TEAM_SIZES[0], selectedPlan: 'Starter', interest: 'FreeTrial', preferredTrialDays: 14, status: 'TrialActive', convertedCompanyId: 'c-southern', notes: 'Small patrol business. Showed Xero during the trial.' });
    q({ id: 'q-metro', createdAt: '2026-09-27 10:02', fullName: "Liam O'Brien", companyName: 'Metro Event Security', email: 'liam@metroevents.example', phone: '0455 902 381', teamSize: TEAM_SIZES[0], selectedPlan: 'Professional', interest: 'FreeTrial', preferredTrialDays: 7, status: 'TrialActive', convertedCompanyId: 'c-metro' });
    q({ id: 'q-harbour', createdAt: '2026-06-30 13:30', fullName: 'Priya Nair', companyName: 'Harbour Guard Services', email: 'priya@harbourguard.example', phone: '0419 225 604', teamSize: TEAM_SIZES[1], selectedPlan: 'Professional', interest: 'FreeTrial', preferredTrialDays: 14, status: 'Won', convertedCompanyId: 'c-harbour' });
    q({ id: 'q-quickstep', createdAt: '2026-09-15 09:48', fullName: 'Ethan Brown', companyName: 'Quickstep Cleaning', email: 'ethan@quickstep.example', teamSize: TEAM_SIZES[0], selectedPlan: '', interest: 'Question', sourcePage: '/contact', message: 'Does this work for cleaning crews?', status: 'Lost', notes: 'Cleaning business, not security. Not a fit.' });

    const c = o => { const x = companyDefaults(o); state.companies.push(x); return x; };
    const eng = c({ id: 'c-engage', name: 'Engage Security Professionals', adminName: 'Operations Admin', adminEmail: 'ops@engagesecurity.example', phone: '1300 000 100', createdAt: '2025-03-12', guardsThis: 182, guardsLast: 176 });
    hist(eng, 'Company created', 'Created before agreements existed', '', '2025-03-12 10:00');

    const har = c({ id: 'c-harbour', name: 'Harbour Guard Services', adminName: 'Priya Nair', adminEmail: 'priya@harbourguard.example', phone: '0419 225 604', createdAt: '2026-07-01', guardsThis: 42, guardsLast: 39,
        billing: { legalName: 'Harbour Guard Services Pty Ltd', email: 'accounts@harbourguard.example', abn: '12 345 678 901', address: '14 Wharf Rd, Newcastle NSW 2300', chargeGst: true, ref: '', xeroContactId: 'XC-harbour' },
        agreement: agreementDefaults({ plan: 'Professional', status: 'Active', trialStart: '2026-07-01', trialDays: 14, trialEnd: '2026-07-15', subscribedAt: '2026-07-14', model: 'PerGuard', rate: 10, term: 'Monthly', billingNotes: 'Invoice on the 1st, 14-day terms.', inquiryId: 'q-harbour', day3Sent: true, day1Sent: true }) });
    hist(har, 'Created', 'Trial 14 days · Professional · Per guard $10', 'Created from inquiry (Harbour Guard Services)', '2026-07-01 10:20');
    hist(har, 'Reminder sent', 'Trial ends in 3 days: sales inbox notified', '', '2026-07-12 05:00', true);
    hist(har, 'Converted to paid', 'Status Trial → Active · billed monthly', 'Signed after trial review call', '2026-07-14 15:05');

    const coa = c({ id: 'c-coast', name: 'Coastline Protective Group', adminName: 'Daniel Reyes', adminEmail: 'daniel@coastline.example', phone: '0408 330 552', createdAt: '2026-02-01', guardsThis: 58, guardsLast: 51,
        billing: { legalName: 'Coastline Protective Group Pty Ltd', email: 'accounts@coastline.example', abn: '98 765 432 109', address: '2 Marine Pde, Southport QLD 4215', chargeGst: true, ref: 'PO-2026-014', xeroContactId: 'XC-coast' },
        agreement: agreementDefaults({ plan: 'Professional', status: 'Active', subscribedAt: '2026-02-01', model: 'AnnualLicence', rate: 10, term: 'AnnualPrepaid', includedGuards: 50, renewalDate: '2027-02-01', billingNotes: 'Annual licence, prepaid. True-up at renewal.' }) });
    hist(coa, 'Created', 'Active · Professional · Annual licence, 50 guards, $5,000/yr', 'Signed annual licence after demo', '2026-02-01 09:30');

    const sou = c({ id: 'c-southern', name: 'Southern Cross Patrols', adminName: 'Mia Thompson', adminEmail: 'mia@southerncross.example', phone: '0422 640 117', createdAt: '2026-09-27', guardsThis: 14, guardsLast: 3,
        agreement: agreementDefaults({ plan: 'Starter', status: 'Trial', trialStart: '2026-09-27', trialDays: 14, trialEnd: '2026-10-11', model: 'PerGuard', rate: 6, term: 'Monthly', inquiryId: 'q-southern' }),
        overrides: [{ key: 'xero', granted: true, expiresAt: '2026-10-10', reason: 'Show Xero during the trial' }] });
    hist(sou, 'Created', 'Trial 14 days · Starter · Per guard $6; Added Xero integration (until 10 Oct 2026)', 'Created from inquiry (Southern Cross Patrols)', '2026-09-27 11:15');

    const met = c({ id: 'c-metro', name: 'Metro Event Security', adminName: "Liam O'Brien", adminEmail: 'liam@metroevents.example', phone: '0455 902 381', createdAt: '2026-09-28', guardsThis: 9, guardsLast: 4,
        agreement: agreementDefaults({ plan: 'Professional', status: 'TrialEnded', trialStart: '2026-09-28', trialDays: 7, trialEnd: '2026-10-05', model: 'PerGuard', rate: 10, term: 'Monthly', inquiryId: 'q-metro', day3Sent: true, day1Sent: true, endedNotified: true }) });
    hist(met, 'Created', 'Trial 7 days · Professional · Per guard $10', 'Created from inquiry (Metro Event Security)', '2026-09-28 09:40');
    hist(met, 'Trial ended', 'Trial → Trial ended (no subscription yet). Nothing locked.', '', '2026-10-05 05:00', true);

    // Seeded invoices, so Billing is not empty on first load: one paid, one already overdue, one waiting as a Xero draft.
    const sinv = (co, kind, key, label, lines, issue, n, xs, paidAt) => state.invoices.push({
        id: nid('i'), companyId: co.id, kind, periodKey: key, periodLabel: label, createdAt: issue, issueDate: issue, dueDate: addDays(issue, 14), lines,
        chargeGst: true, gstRate: 10, status: XSTATUS[xs], blocked: '', sig: agSig(co.agreement), syncedAt: issue + ' 05:00',
        xero: { id: 'xero-' + n, number: 'INV-' + String(n).padStart(4, '0'), status: xs, sentAt: xs === 'DRAFT' ? null : issue, paidAt: paidAt || null } });
    const usage = (n, lab) => [{ desc: `Professional — guards scheduled in ${lab}`, qty: n, unit: 10 }];
    sinv(har, 'Monthly', '2026-07', 'July 2026', usage(38, 'July 2026'), '2026-08-01', 31, 'PAID', '2026-08-12');
    sinv(har, 'Monthly', '2026-08', 'August 2026', usage(41, 'August 2026'), '2026-09-01', 36, 'AUTHORISED');
    sinv(har, 'Monthly', '2026-09', 'September 2026', usage(39, 'September 2026'), '2026-10-01', 39, 'DRAFT');
    sinv(coa, 'Initial', 'initial', '12 months from 1 Feb 2026', [{ desc: 'Professional annual licence, up to 50 guards — 12 months from 1 Feb 2026', qty: 1, unit: 5000 }], '2026-02-01', 12, 'PAID', '2026-02-10');
    hist(har, 'Xero update', 'INV-0036: Draft → Awaiting payment (August 2026)', '', '2026-09-02 05:00', true);
    hist(har, 'Invoice created in Xero', 'INV-0039 · Monthly usage · September 2026 · $429.00 incl. GST · Draft', '', '2026-10-01 05:00', true);

    emailLead(inq('q-redline'), '2026-10-07 09:12');
    emailRequesterConfirm(inq('q-redline'), '2026-10-07 09:12');
    state.emails.forEach(e => { e.read = false; });
    save();
    return state;
}

/* ================= pricing (one pure function) ================= */
// monthly = max(minimum, guards × rate); annual = monthly × annualMonths if prepaid, else × 12;
// a negotiated annual amount overrides the result.
function calcPrice(p, annualMonths) {
    const min = num(p.minMonthly);
    if (p.model === 'Custom') {
        const annual = num(p.annualAmount), g = num(p.guards);
        return { custom: true, annual, monthly: annual / 12, listMonthly: annual / 12, prepaid: true, minApplied: false, overridden: true, guards: g, perGuard: g ? annual / 12 / g : null };
    }
    const guards = p.model === 'AnnualLicence' ? num(p.includedGuards) : num(p.guards);
    const raw = guards * num(p.rate);
    const listMonthly = Math.max(min, raw);
    const prepaid = p.model === 'AnnualLicence';   // per guard is billed monthly on actuals; prepaying needs a guard count = a licence
    let annual = listMonthly * (prepaid ? annualMonths : 12);
    const overridden = prepaid && num(p.annualAmount) > 0;
    if (overridden) annual = num(p.annualAmount);
    return { custom: false, annual, monthly: prepaid || overridden ? annual / 12 : listMonthly, listMonthly, prepaid, minApplied: raw < min, overridden, guards, perGuard: guards ? annual / 12 / guards : null };
}

// The plan's worked table (min $99, pay 10 get 12). Runs on load; result shown on the Overview page.
function pricingSelfCheck() {
    const rows = [[10, 99, 100, 990, 1000], [25, 150, 250, 1500, 2500], [30, 180, 300, 1800, 3000], [50, 300, 500, 3000, 5000], [100, 600, 1000, 6000, 10000], [250, 1500, 2500, 15000, 25000]];
    const fails = [];
    rows.forEach(([g, sm, pm, sa, pa]) => {
        const m = rate => calcPrice({ model: 'PerGuard', rate, guards: g, minMonthly: 99 }, 10);
        const y = rate => calcPrice({ model: 'AnnualLicence', rate, includedGuards: g, minMonthly: 99 }, 10);
        const got = [m(6).listMonthly, m(10).listMonthly, y(6).annual, y(10).annual];
        const exp = [sm, pm, sa, pa];
        if (!got.every((v, i) => Math.abs(v - exp[i]) < 0.005)) fails.push(`${g} guards: got ${got.join(' / ')}, expected ${exp.join(' / ')}`);
    });
    const extra = calcPrice({ model: 'AnnualLicence', rate: 10, includedGuards: 30, minMonthly: 99, annualAmount: 2800 }, 10).annual === 2800;
    if (!extra) fails.push('Negotiated annual amount did not override the formula');
    fails.forEach(f => console.error('Pricing check failed: ' + f));
    return { ok: rows.length + 1 - fails.length, total: rows.length + 1, fails };
}

/* ================= invoice maths (GST once per invoice, half-up to the cent) ================= */
function calcInvoice(lines, chargeGst, ratePct) {
    const subtotal = round2(lines.reduce((t, l) => t + round2(num(l.qty) * num(l.unit)), 0));
    const gst = chargeGst ? round2(subtotal * num(ratePct) / 100) : 0;
    return { subtotal, gst, total: round2(subtotal + gst) };
}
// Runs on every load of the Overview page. The cases are the ones written in docs/Subscription-Invoicing-Plan.md.
function invoiceSelfCheck() {
    const fails = [];
    const eq = (name, got, exp) => { if (JSON.stringify(got) !== JSON.stringify(exp)) fails.push(`${name}: got ${JSON.stringify(got)}, expected ${JSON.stringify(exp)}`); };
    const one = u => [{ qty: 1, unit: u }];
    eq('annual $3,000 + GST', calcInvoice(one(3000), true, 10), { subtotal: 3000, gst: 300, total: 3300 });
    eq('minimum $99 + GST', calcInvoice(one(99), true, 10), { subtotal: 99, gst: 9.9, total: 108.9 });
    eq('negotiated $2,800 + GST', calcInvoice(one(2800), true, 10), { subtotal: 2800, gst: 280, total: 3080 });
    eq('$123.45 rounds half-up', calcInvoice(one(123.45), true, 10), { subtotal: 123.45, gst: 12.35, total: 135.8 });
    eq('GST switched off', calcInvoice(one(3000), false, 10), { subtotal: 3000, gst: 0, total: 3000 });
    eq('discount line', calcInvoice([{ qty: 1, unit: 3000 }, { qty: 1, unit: -300 }], true, 10), { subtotal: 2700, gst: 270, total: 2970 });
    const fake = g => ({ guardsLast: g, guardsThis: g, agreement: { plan: 'Starter', model: 'PerGuard', rate: 6, minMonthly: 99 } });
    eq('14 guards at $6 hits the minimum', calcInvoice(usageLines(fake(14), 'September 2026'), true, 10).total, 108.9);
    eq('30 guards at $6', calcInvoice(usageLines(fake(30), 'September 2026'), true, 10).total, 198);
    fails.forEach(f => console.error('Invoice check failed: ' + f));
    return { ok: 8 - fails.length, total: 8, fails };
}

/* ================= features (plan defaults ± overrides) ================= */
const minPlanOf = f => f.min === 'Always' ? 'Always' : (state.settings.matrix[f.key] || f.min);
function planDefault(key, plan) {
    const f = BY_KEY[key];
    if (!f || f.soon) return false;
    const min = minPlanOf(f);
    return min === 'Always' || (PLAN_RANK[plan] || 0) >= PLAN_RANK[min];
}
const overrideActive = o => !o.expiresAt || o.expiresAt >= state.today;   // expiresAt = last day included
function enabledKeys(c) {
    if (!c.agreement) return new Set(SELLABLE.map(f => f.key));             // existing customer: everything
    const set = new Set(SELLABLE.filter(f => planDefault(f.key, c.agreement.plan)).map(f => f.key));
    c.overrides.filter(overrideActive).forEach(o => {
        const f = BY_KEY[o.key];
        if (!f || f.soon || f.min === 'Always') return;                   // always-on can never be removed
        if (o.granted) set.add(o.key); else set.delete(o.key);
    });
    return set;
}
const pruneOverrides = (list, plan) => list.filter(o => o.granted !== planDefault(o.key, plan));

/* ================= emails ================= */
function emailBody(o) {
    const rows = (o.rows || []).filter(r => r && r[1] !== '' && r[1] != null);
    return `<div class="em">
        <div class="em-h"><img src="ewf-shield.jpg" alt=""><span class="em-word">ENGAGE <b>WORKFORCE</b></span></div>
        <div class="em-stripe"></div>
        <div class="em-b">
            ${o.alert ? `<div class="em-alert">${esc(o.alert)}</div>` : ''}
            ${o.kicker ? `<div class="em-kicker">${esc(o.kicker)}</div>` : ''}
            <h2 class="em-h1">${esc(o.h1)}</h2>
            ${(o.paras || []).map(p => `<p>${esc(p)}</p>`).join('')}
            ${rows.length ? `<table class="em-rows">${rows.map(r => `<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join('')}</table>` : ''}
            ${o.button ? `<p><button type="button" class="em-btn" data-act="${esc(o.button.act)}" data-id="${esc(o.button.id || '')}">${esc(o.button.label)}</button></p>` : ''}
            ${o.callout ? `<div class="em-callout">${esc(o.callout)}</div>` : ''}
        </div>
        <div class="em-foot">${o.foot ? esc(o.foot) : 'Engage WorkForce · Workforce management for security operations · Sent from no-reply@engageworkforce.com.au'}</div>
    </div>`;
}
function pushEmail(to, subject, kind, body, at) {
    state.emails.push({ id: nid('m'), at: at || stamp(), to, subject, kind, body, read: false });
}
function leadSubject(q) {
    if (q.sourcePage === '/upgrade-required') return `New Feature Request — ${q.companyName}`;
    return { FreeTrial: 'New Free Trial Request', Demo: 'New Demo Request', Question: 'New Question' }[q.interest] + ` — ${q.companyName}`;
}
function emailLead(q, at) {
    pushEmail(state.settings.salesInbox, leadSubject(q), 'sales', emailBody({
        kicker: 'New inquiry', h1: q.sourcePage === '/upgrade-required' ? 'A customer asked for a feature' : `${INTEREST[q.interest]} request from ${q.companyName}`,
        rows: [['Name', q.fullName], ['Company', q.companyName], ['Email', q.email], ['Phone', q.phone], ['Team size', q.teamSize],
            ['Plan', q.selectedPlan], ['Wants', INTEREST[q.interest]], ['Trial length', q.interest === 'FreeTrial' ? (q.preferredTrialDays ? q.preferredTrialDays + ' days' : 'Not sure') : ''],
            ['Message', q.message], ['Source page', q.sourcePage], ['Received', fmtStamp(q.createdAt)]],
        button: { label: 'Open in SuperAdmin › Inquiries', act: 'goto-inq', id: q.id },
        callout: 'Saved as an inquiry. Call within one business day.',
    }), at);
}
function emailRequesterConfirm(q, at) {
    const trial = q.interest === 'FreeTrial';
    pushEmail(q.email, "We've received your request — Engage WorkForce", 'customer', emailBody({
        kicker: 'Thanks for reaching out', h1: `Thanks, ${firstName(q.fullName)} — we'll call you soon`,
        paras: ['We will call you within one business day to understand how you run your sites and recommend the right plan.',
            trial ? `Once we've talked, we'll set up your ${q.preferredTrialDays ? q.preferredTrialDays + '-day ' : ''}free trial and email you a link to activate your account. No card needed.` : 'If you would like to see the product first, we can walk you through it on a short call.'],
        callout: 'Questions in the meantime? Reply to this email or call 1300 000 000.',
    }), at);
}
function emailActivation(c, resent) {
    pushEmail(c.adminEmail, 'Activate your Engage WorkForce account' + (resent ? ' (resent)' : ''), 'customer', emailBody({
        kicker: 'Account created', h1: 'Set your password to get started',
        paras: [`Hi ${firstName(c.adminName)}, an Engage WorkForce account has been created for ${c.name}.`, 'Click the button below to set your password. The link expires in 24 hours.'],
        button: { label: 'Set your password', act: 'activate', id: c.id },
        callout: 'We never send passwords by email.',
    }));
}
function emailTrialReady(c) {
    const a = c.agreement, keys = enabledKeys(c);
    pushEmail(c.adminEmail, 'Your Engage WorkForce trial is ready', 'customer', emailBody({
        kicker: 'Your free trial', h1: `Your ${a.trialDays}-day trial is ready`,
        paras: [`Your trial includes everything in the ${a.plan} plan. Nothing is locked when it ends: we'll call before then to talk about next steps.`],
        rows: [['Company', c.name], ['Plan', a.plan], ['Trial length', a.trialDays + ' days'], ['Trial ends', fmtDate(a.trialEnd)], ['Features', `${keys.size} of ${SELLABLE.length}`]],
        callout: 'Check your inbox for the separate "Activate your account" email to set your password.',
    }));
}
function emailAccountReady(c) {
    const a = c.agreement;
    pushEmail(c.adminEmail, 'Your Engage WorkForce account is ready', 'customer', emailBody({
        kicker: 'Welcome aboard', h1: `Welcome to Engage WorkForce, ${firstName(c.adminName)}`,
        paras: [`${c.name} is set up on the ${a.plan} plan.`],
        rows: [['Plan', a.plan], ['Pricing', priceLine(c)], ['Renewal', a.renewalDate ? fmtDate(a.renewalDate) : 'Monthly']],
        callout: 'Check your inbox for the separate "Activate your account" email to set your password.',
    }));
}

/* ================= billing engine: we work out the amount, Xero holds the invoice ================= */
const bset = () => state.settings.billing;
const invById = id => state.invoices.find(i => i.id === id);
const invFor = (c, kind, key) => state.invoices.find(i => i.companyId === c.id && i.kind === kind && i.periodKey === key);   // idempotency key
function agSig(a) { return a ? [a.plan, a.model, a.rate, a.minMonthly, a.includedGuards, a.annualAmount].join('|') : ''; }
const invTotals = i => calcInvoice(i.lines, i.chargeGst, i.gstRate);
const invLabel = i => i.periodLabel === INV_KIND[i.kind] ? INV_KIND[i.kind] : `${INV_KIND[i.kind]} · ${i.periodLabel}`;
function invState(i) { return i.status === 'Awaiting' && i.dueDate < state.today ? 'Overdue' : i.status; }   // overdue is derived, never stored
const overdueOf = c => state.invoices.filter(i => i.companyId === c.id && invState(i) === 'Overdue');

// Per-guard clients are billed in arrears on guards scheduled; the minimum replaces the line when it is higher.
function usageLines(c, label) {
    const a = c.agreement, g = c.guardsLast || c.guardsThis, raw = g * num(a.rate), min = num(a.minMonthly);
    if (raw < min) return [{ desc: `${a.plan} — minimum monthly charge (${plural(g, 'guard')} scheduled in ${label} × ${money(a.rate)} = ${money(raw, true)})`, qty: 1, unit: min }];
    return [{ desc: `${a.plan} — guards scheduled in ${label}`, qty: g, unit: num(a.rate) }];
}
function prepaidLines(c, from) {   // annual licence or custom agreement: one line for the year
    const a = c.agreement, p = priceOf(c);
    const what = a.model === 'Custom' ? `${a.plan} agreement` : `${a.plan} annual licence, up to ${a.includedGuards} guards`;
    return [{ desc: `${what} — 12 months from ${fmtDate(from)}`, qty: 1, unit: p.annual }];
}
function newInvoice(c, kind, key, label, lines, issue) {
    const b = billOf(c), day = issue || state.today;
    const inv = { id: nid('i'), companyId: c.id, kind, periodKey: key, periodLabel: label, createdAt: state.today, issueDate: day, dueDate: addDays(day, bset().terms),
        lines, chargeGst: b.chargeGst, gstRate: bset().gstRate, status: 'Queued', xero: null, blocked: '', sig: agSig(c.agreement), syncedAt: '' };
    state.invoices.unshift(inv);
    return inv;
}
function missingFor(c, inv) {   // what Xero's contact and the invoice need before we push
    const b = billOf(c), m = [];
    if (!b.legalName.trim()) m.push('a billing name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email.trim())) m.push('a billing email');
    if (invTotals(inv).total >= 1000 && !b.abn.trim()) m.push('the ABN (needed on invoices of $1,000 or more)');
    return m;
}
// Mock of "create the Draft in Xero". Idempotent: an invoice already in Xero is never created twice.
function createInXero(inv, system) {
    if (inv.xero) return { ok: true };
    const c = comp(inv.companyId), at = system ? state.today + ' 05:00' : undefined;
    const miss = missingFor(c, inv);
    if (miss.length) { inv.blocked = 'Missing ' + miss.join(', ') + '.'; return { ok: false, why: inv.blocked, kind: 'data' }; }
    if (!bset().xeroOk) { inv.blocked = 'Xero connection needs reconnecting.'; return { ok: false, why: inv.blocked, kind: 'xero' }; }
    const b = billOf(c), t = invTotals(inv), newContact = !b.xeroContactId;
    if (newContact) b.xeroContactId = 'XC-' + c.id;
    state.xeroSeq++;
    inv.xero = { id: 'xero-' + state.xeroSeq, number: 'INV-' + String(state.xeroSeq).padStart(4, '0'), status: 'DRAFT', sentAt: null, paidAt: null };
    inv.status = 'Draft'; inv.blocked = ''; inv.syncedAt = at || stamp();
    hist(c, 'Invoice created in Xero', `${inv.xero.number} · ${invLabel(inv)} · ${money(t.total, true)}${inv.chargeGst ? ' incl. GST' : ' (no GST)'} · Draft${newContact ? ' · new Xero contact' : ''}`, '', at, system);
    return { ok: true };
}
// Mock of "read the invoice back from Xero". The nightly job does this for every open invoice.
function syncFromXero(inv, system) {
    if (!inv.xero || !bset().xeroOk) return false;
    const next = XSTATUS[inv.xero.status], at = system ? state.today + ' 05:00' : undefined;
    inv.syncedAt = at || stamp();
    if (next === inv.status) return false;
    const was = INV_ST[inv.status][0];
    inv.status = next;
    hist(comp(inv.companyId), 'Xero update', `${inv.xero.number}: ${was} → ${INV_ST[next][0]}${next === 'Paid' ? ' on ' + fmtDate(inv.xero.paidAt) : ''}`, '', at, system);
    return true;
}
function emailXeroInvoice(inv) {
    const c = comp(inv.companyId), b = billOf(c), t = invTotals(inv);
    pushEmail(b.email, `Invoice ${inv.xero.number} from ${bset().supplier}`, 'xero', emailBody({
        kicker: 'Invoice', h1: `Invoice ${inv.xero.number} for ${money(t.total, true)}`,
        paras: [`Hi ${firstName(c.adminName)}, here is your invoice from ${bset().supplier}.`],
        rows: [['Amount due', `${money(t.total, true)}${inv.chargeGst ? ' (includes GST ' + money(t.gst, true) + ')' : ''}`], ['Due date', fmtDate(inv.dueDate)], ['For', invLabel(inv)], ['Reference', inv.xero.number]],
        button: { label: 'View and pay online', act: 'open-xero', id: inv.id },
        callout: 'Pay by bank transfer, or online if you see a Pay now button. Questions? Reply to this email.',
        foot: `Sent through Xero on behalf of ${bset().supplier}`,
    }));
}
function nextBillingDay() {
    const [y, m] = state.today.split('-').map(Number), d = Number(state.today.slice(8));
    const ny = d >= bset().billingDay && m === 12 ? y + 1 : y, nm = d >= bset().billingDay ? (m % 12) + 1 : m;
    return `${ny}-${String(nm).padStart(2, '0')}-${String(bset().billingDay).padStart(2, '0')}`;
}

/* ================= nightly lifecycle job (simulated) ================= */
function runNightly(day) {
    const t = day + ' 05:00';
    const due3 = [], due1 = [], ended = [], expiring = [];
    state.companies.forEach(c => {
        const a = c.agreement;
        if (a && a.status === 'Trial' && a.trialEnd) {
            const left = diffDays(a.trialEnd, day);
            if (left <= 0) {
                // guarded update: only a row still in Trial can flip, so it never overwrites a "Convert to paid"
                a.status = 'TrialEnded';
                if (!a.endedNotified) { a.endedNotified = true; ended.push(c); }
                hist(c, 'Trial ended', 'Trial → Trial ended (no subscription yet). Nothing locked.', '', t, true);
            } else if (left <= 1) {
                if (!a.day1Sent) { a.day1Sent = true; a.day3Sent = true; due1.push(c); hist(c, 'Reminder sent', 'Trial ends tomorrow: sales inbox notified', '', t, true); }
            } else if (left <= 3) {
                if (!a.day3Sent) { a.day3Sent = true; due3.push(c); hist(c, 'Reminder sent', `Trial ends in ${left} days: sales inbox notified`, '', t, true); }
            }
        }
        c.overrides.forEach(o => {
            if (!o.expiresAt) return;
            const l = diffDays(o.expiresAt, day);
            if (l >= 0 && l <= 3) expiring.push({ c, o, l });
        });
    });

    // ---- billing (never changes a subscription status) ----
    const bill = [], bs = bset();
    let billed = 0;
    state.invoices.filter(i => i.status === 'Queued' && i.blocked).forEach(i => {            // retry anything that was waiting on data or on Xero
        if (createInXero(i, true).ok) bill.push(['Retry worked: draft created in Xero', `${comp(i.companyId).name} — ${invLabel(i)} · ${money(invTotals(i).total, true)}`]);
    });
    state.invoices.filter(i => i.xero && !['Paid', 'Void'].includes(i.status)).forEach(i => {   // read open invoices back from Xero
        if (syncFromXero(i, true)) bill.push([i.status === 'Paid' ? 'Paid in Xero' : 'Updated in Xero', `${comp(i.companyId).name} — ${i.xero.number} is now ${INV_ST[i.status][0].toLowerCase()}`]);
    });
    state.companies.forEach(c => {
        const a = c.agreement; if (!a || a.status !== 'Active') return;
        let kind, key, label, lines;
        if (a.model === 'PerGuard') {      // on the billing day, bill last month's guards
            if (Number(day.slice(8)) !== bs.billingDay || !a.subscribedAt || a.subscribedAt >= day.slice(0, 7) + '-01') return;
            kind = 'Monthly'; key = prevMonth(day); label = monthLabel(key); lines = usageLines(c, label);
        } else {                           // annual licence / custom: a draft some days before the renewal date
            const left = a.renewalDate ? diffDays(a.renewalDate, day) : -1;
            if (left < 0 || left > bs.renewalLeadDays) return;
            kind = 'Renewal'; key = 'renewal-' + a.renewalDate; label = 'Renewal ' + fmtDate(a.renewalDate); lines = prepaidLines(c, a.renewalDate);
        }
        if (invFor(c, kind, key)) return;   // idempotent: running the job twice never doubles an invoice
        const inv = newInvoice(c, kind, key, label, lines, day), r = createInXero(inv, true);
        if (r.ok) billed++;
        bill.push([r.ok ? 'Draft created in Xero: review and send' : 'Waiting, not in Xero yet', `${c.name} — ${invLabel(inv)} · ${money(invTotals(inv).total, true)}${r.ok ? '' : ' · ' + r.why}`]);
    });
    state.invoices.filter(i => i.status === 'Awaiting' && i.dueDate < day && (!i.overdueNoted || diffDays(day, i.overdueNoted) >= 7)).forEach(i => {
        i.overdueNoted = day;
        bill.push(['Overdue', `${comp(i.companyId).name} — ${i.xero.number} · ${money(invTotals(i).total, true)} · ${plural(diffDays(day, i.dueDate), 'day')} late. Xero sends its own reminders.`]);
        hist(comp(i.companyId), 'Invoice overdue', `${i.xero.number} was due ${fmtDate(i.dueDate)}. Nothing is locked.`, '', t, true);
    });
    const stuck = state.invoices.filter(i => i.status === 'Queued' && i.blocked).length;
    if (stuck && !bs.xeroOk) bill.push(['Xero connection', `${plural(stuck, 'invoice')} waiting. Reconnect Xero in Settings; they are retried every night.`]);
    const line = c => { const a = c.agreement; return `${c.name} — ${a.plan}, ends ${fmtDate(a.trialEnd)} · ${c.adminName}, ${c.phone || c.adminEmail}`; };
    if (due3.length || due1.length || expiring.length || bill.length) {
        const parts = [], trialsOnly = due3.length || due1.length || expiring.length;
        if (due3.length + due1.length) parts.push(plural(due3.length + due1.length, 'trial') + ' ending soon');
        if (expiring.length) parts.push(plural(expiring.length, 'feature override') + ' expiring');
        if (bill.length) parts.push(plural(bill.length, 'billing item'));
        pushEmail(state.settings.salesInbox, `Nightly digest — ${fmtDate(day)}: ${parts.join(', ')}`, 'sales', emailBody({
            kicker: 'Nightly digest', h1: due3.length + due1.length ? 'Trials needing a call' : expiring.length ? 'Feature overrides expiring' : 'Billing to review',
            rows: [...due1.map(c => ['Ends tomorrow', line(c)]), ...due3.map(c => ['Ends in 3 days', line(c)]),
                ...expiring.map(x => ['Feature override expiring', `${x.c.name} — ${BY_KEY[x.o.key].name} ${x.o.granted ? 'access' : 'removal'} ends ${fmtDate(x.o.expiresAt)}${x.l === 0 ? ' (today)' : ''}`]), ...bill],
            button: trialsOnly ? { label: 'Open in SuperAdmin › Customers', act: 'goto-cust', id: '' } : { label: 'Open in SuperAdmin › Billing', act: 'goto-bill', id: '' },
            callout: 'Nothing is locked automatically. Convert, extend or follow up from the Customers page.',
        }), t);
    }
    ended.forEach(c => {
        const a = c.agreement;
        pushEmail(state.settings.salesInbox, `Trial ended, follow up now — ${c.name}`, 'sales', emailBody({
            alert: 'Trial ended', h1: `The trial for ${c.name} has ended`,
            rows: [['Admin', c.adminName], ['Phone', c.phone], ['Email', c.adminEmail], ['Plan', a.plan], ['Trial', `${a.trialDays} days, ${fmtDate(a.trialStart)} – ${fmtDate(addDays(a.trialEnd, -1))}`], ['Guards scheduled', `${c.guardsThis} this month`]],
            paras: ['Nothing has been locked. Convert to paid, extend the trial, or mark the inquiry Lost.'],
            button: { label: 'Open in SuperAdmin › Customers', act: 'goto-cust', id: c.id },
        }), t);
    });
    if (state.settings.notifyCustomers) {
        [...due3, ...due1].forEach(c => pushEmail(c.adminEmail, `Your Engage WorkForce trial ends ${due1.includes(c) ? 'tomorrow' : 'in 3 days'}`, 'customer', emailBody({
            kicker: 'Your free trial', h1: `Your trial ends ${due1.includes(c) ? 'tomorrow' : 'in 3 days'}`,
            paras: [`Hi ${firstName(c.adminName)}, your ${c.agreement.plan} trial for ${c.name} ends on ${fmtDate(c.agreement.trialEnd)}.`, "We'll give you a call to talk about next steps. Nothing is locked or deleted when it ends."],
        }), t));
        ended.forEach(c => pushEmail(c.adminEmail, 'Your Engage WorkForce trial has ended', 'customer', emailBody({
            kicker: 'Your free trial', h1: "Your trial has ended — let's talk",
            paras: [`Your trial for ${c.name} ended on ${fmtDate(c.agreement.trialEnd)}. You can still log in; nothing has been locked or deleted.`, "We'll call you to talk about the right plan."],
        }), t));
    }
    const summary = `${fmtDate(day)}: ${due3.length + due1.length} reminder(s), ${ended.length} trial(s) ended, ${expiring.length} override(s) expiring, ${billed} invoice(s) created, ${bill.length} billing item(s)`;
    state.jobLog.unshift(summary);
    return { reminders: due3.length + due1.length, ended: ended.length, billed };
}
function advance(days) {
    let r = 0, e = 0, b = 0;
    for (let i = 0; i < days; i++) {
        state.today = addDays(state.today, 1);
        const x = runNightly(state.today); r += x.reminders; e += x.ended; b += x.billed;
    }
    save(); render();
    toast(`Nightly job ran for ${plural(days, 'day')}: ${plural(r, 'reminder')}, ${plural(e, 'trial')} ended, ${plural(b, 'invoice')} created in Xero. Today is ${fmtDay(state.today)}.`);
}

/* ================= descriptive helpers ================= */
function statusInfo(c) {
    const a = c.agreement;
    if (!a) return { label: 'Existing customer', cls: 'p-slate', sub: 'No agreement: every feature on' };
    if (a.status === 'Trial') {
        const day = diffDays(state.today, a.trialStart) + 1, left = diffDays(a.trialEnd, state.today);
        return { label: `Trial — day ${Math.max(1, day)} of ${a.trialDays}`, cls: 'p-teal', sub: `Ends ${fmtDate(a.trialEnd)} · ${plural(left, 'day')} left`, warn: left <= 3 };
    }
    if (a.status === 'TrialEnded') return { label: 'Trial ended', cls: 'p-orange', sub: `Ended ${fmtDate(a.trialEnd)}: follow up`, warn: true };
    if (a.status === 'Active') return { label: 'Active', cls: 'p-green', sub: a.subscribedAt ? `Since ${fmtDate(a.subscribedAt)}` : '' };
    if (a.status === 'Suspended') return { label: 'Suspended', cls: 'p-red', sub: 'Label only: login still works' };
    return { label: 'Cancelled', cls: 'p-grey', sub: 'Label only: login still works' };
}
function guardsFromTeam(t) { return { [TEAM_SIZES[0]]: 15, [TEAM_SIZES[1]]: 35, [TEAM_SIZES[2]]: 100, [TEAM_SIZES[3]]: 250 }[t] || 20; }
function priceOf(c) {
    const a = c.agreement;
    return calcPrice(Object.assign({}, a, { guards: c.guardsLast || c.guardsThis }), state.settings.annualMonths);
}
function priceLine(c) {
    const a = c.agreement; if (!a) return '—';
    const p = priceOf(c);
    if (a.model === 'Custom') return `${money(p.annual)} / year (custom)`;
    if (a.model === 'AnnualLicence') return `${money(p.annual)} / year, prepaid · licence for ${a.includedGuards} guards`;
    return `${money(a.rate)} / guard / month · min ${money(a.minMonthly)}`;
}
function monthlyRecurring(c) {
    const a = c.agreement; if (!a || a.status !== 'Active') return 0;
    return priceOf(c).monthly;
}
function trialLastDay(d) { return d.trialEnd ? addDays(d.trialEnd, -1) : ''; }

/* ================= chrome ================= */
function section(path) {
    if (path === '/' || path === '') return 'overview';
    if (['/pricing', '/free-trial', '/contact'].includes(path)) return 'website';
    if (path.startsWith('/inbox')) return 'inbox';
    if (path.startsWith('/sa/')) return 'sa';
    if (path.startsWith('/app')) return 'app';
    return 'overview';
}
function renderBar(path) {
    const sec = section(path);
    const unread = state.emails.filter(e => !e.read).length;
    const tab = (id, label, href, extra) => `<a class="pb-tab ${sec === id ? 'on' : ''}" href="${href}">${label}${extra || ''}</a>`;
    $('#proto-bar').innerHTML = `<div class="pb">
        <span class="pb-badge" title="Everything in this bar is a prototype control, not part of the product">PROTOTYPE</span>
        <nav class="pb-tabs" aria-label="Prototype views">
            ${tab('overview', 'Overview', '#/')}
            ${tab('website', 'Website', '#/pricing')}
            ${tab('inbox', 'Inbox', '#/inbox', unread ? `<span class="pb-count">${unread}</span>` : '')}
            ${tab('sa', 'SuperAdmin', '#/sa/inquiries')}
            ${tab('app', 'Customer view', '#/app/insighthub')}
        </nav>
        <span class="pb-spacer"></span>
        <span class="pb-clock">Today: <b>${fmtDay(state.today)}</b></span>
        <button class="btn btn-sm" data-act="advance" data-id="1" title="Runs the nightly trial job for the next day">+1 day</button>
        <button class="btn btn-sm" data-act="advance" data-id="7" title="Runs the nightly trial job for each of the next 7 days">+7 days</button>
        <button class="btn btn-sm" data-act="settings">Settings</button>
        <button class="btn btn-sm" data-act="reset">Reset demo</button>
    </div>`;
}
function saChrome(active) {
    const newCount = state.inquiries.filter(q => q.status === 'New').length;
    const overdueCount = state.invoices.filter(i => invState(i) === 'Overdue').length;
    return `<div class="app-head">
        <a class="brand" href="#/sa/inquiries"><img src="ewf-shield.jpg" alt=""><span>ENGAGE <b>WORKFORCE</b></span></a>
        <nav class="app-nav" aria-label="SuperAdmin">
            <span class="nav-i"><span class="nav-a dim" title="Existing page, unchanged">SuperAdmin Hub</span></span>
            <span class="nav-i"><a class="nav-a ${active === 'inquiries' ? 'on' : ''}" href="#/sa/inquiries">Inquiries${newCount ? `<span class="nav-badge">${newCount}</span>` : ''}</a></span>
            <span class="nav-i"><a class="nav-a ${active === 'customers' ? 'on' : ''}" href="#/sa/customers">Customers</a></span>
            <span class="nav-i"><a class="nav-a ${active === 'billing' ? 'on' : ''}" href="#/sa/billing">Billing${overdueCount ? `<span class="nav-badge">${overdueCount}</span>` : ''}</a></span>
        </nav>
        <span class="app-user"><span class="av">DP</span>${ME} · SuperAdmin</span>
    </div>`;
}

/* ================= views: overview ================= */
function viewOverview() {
    const chk = pricingSelfCheck(), ichk = invoiceSelfCheck();
    const step = (n, title, text, href, label, act) => `<div class="step"><span class="num">${n}</span><h4>${title}</h4><p>${text}</p>
        ${act ? `<button class="btn btn-sm btn-pl" data-act="${act}" data-id="1">${label}</button>` : `<a class="btn btn-sm btn-pl" href="${href}">${label}</a>`}</div>`;
    const decisions = [
        ['1', 'Inquiry inbox', esc(state.settings.salesInbox), 'Settings'],
        ['2', 'Trial lengths', '7 or 14 days at creation; Extend adds any days with a reason', 'Create customer · Extend trial'],
        ['3', 'Customer T-3 / T-1 emails', state.settings.notifyCustomers ? 'On' : 'Off: internal digest only', 'Settings'],
        ['4', 'Billing metric', 'Guards scheduled per month', 'Website › Pricing'],
        ['5', 'Monthly minimum', money(state.settings.minMonthly), 'Settings'],
        ['6', 'Annual plan', `Optional: pay ${state.settings.annualMonths} months, get 12. No volume discount.`, 'Pricing calculator'],
        ['7', "Guardhouse's bands", 'Not shown anywhere', '—'],
        ['8', 'Suspended / Cancelled', 'Labels only: login still works', 'Customers'],
        ['9', 'Feature matrix', Object.keys(state.settings.matrix).length ? 'Changed in Settings' : "The plan's proposal", 'Settings'],
        ['10', 'Contractor management', 'Listed as "coming soon"', 'Pricing comparison'],
        ['11', 'Trial features', "The plan's own set; sales can add features until trial end", 'Create customer › Features'],
        ['12', 'Protected pages', 'Features inside them show as "Recorded only"', 'Customer view'],
        ['I1', 'GST', `${bset().gstRate}% added on top; a tick per customer turns it off`, 'Customer › Billing'],
        ['I3', 'Invoicing system', "Xero (Engage WorkForce's own org): the app creates a Draft, you approve and send it in Xero", 'SuperAdmin › Billing'],
        ['I4', 'Payment terms', `${bset().terms} days`, 'Settings'],
        ['I5–I7', 'When invoices are made', `Prepaid: on Convert to paid. Per guard: on the ${bset().billingDay}${bset().billingDay === 1 ? 'st' : 'th'} for last month. Renewals: ${bset().renewalLeadDays} days before`, 'Convert to paid · +1 day'],
        ['I8', 'Overdue', 'A label and a digest line. Never locks anyone', 'SuperAdmin › Billing'],
        ['I9', 'Needed before Xero', 'Billing name and email; ABN from $1,000', 'Customer › Billing details'],
        ['I14', 'Online payment', 'None built: Xero\'s own "Pay now" if their Xero has it on', '—'],
    ];
    return `<div class="page">
        <div class="ov-hero">
            <h1>Free Trial & Subscription — clickable prototype</h1>
            <p>Walk the whole journey: a visitor asks for a trial, sales sees the inquiry, SuperAdmin creates the customer with a negotiated price and features, the customer uses only what their plan includes, the nightly job chases the trial, and invoices are raised in Xero. All data here is fake and lives only in this browser, and Xero is simulated.</p>
        </div>
        <div class="steps" style="margin-bottom:18px">
            ${step(1, 'Visitor picks a plan', 'New pricing page: per guard scheduled, $' + state.settings.minMonthly + ' minimum, annual option, calculator, comparison table.', '#/pricing', 'Open pricing')}
            ${step(2, 'Visitor asks for a trial', 'The free-trial form remembers the plan and asks for trial length.', '#/free-trial?plan=professional', 'Open the form')}
            ${step(3, 'Sales gets the email', 'Every request is emailed and saved. Check the inbox.', '#/inbox', 'Open inbox')}
            ${step(4, 'SuperAdmin creates the customer', 'From an inquiry: plan, negotiated price with live preview, trial length, features.', '#/sa/inquiries', 'Open inquiries')}
            ${step(5, 'Customer uses their plan', 'Topbar hides what the plan lacks; a locked page shows "Upgrade to unlock".', '#/app/insighthub', 'View as customer')}
            ${step(6, 'Nightly job chases trials', 'Reminders at 3 days and 1 day, then "follow up now". Nothing locks.', '', '+1 day', 'advance')}
            ${step(7, 'Convert, extend or change', 'Customers page: convert to paid, extend, change plan, price or features.', '#/sa/customers', 'Open customers')}
            ${step(8, 'Invoice through Xero', 'The app works out the amount and creates a Draft in Xero. You approve and send it there; the app reads the status back.', '#/sa/billing', 'Open billing')}
        </div>
        <div class="two">
            <div class="box"><div class="box-h"><h3>Things to try</h3></div><div class="box-b"><ol class="try">
                <li>Press <b>+1 day</b>: Southern Cross Patrols hits its 3-day reminder. Check the inbox.</li>
                <li>Press <b>+1 day</b> three more times: its trial ends and its Xero access expires. View as Southern Cross: the Xero link disappears.</li>
                <li>View as Southern Cross (Starter) and open <a href="#/app/invoices">Invoices</a> by URL: "Upgrade to unlock" → <b>Request this feature</b> creates a new inquiry.</li>
                <li>Pricing page → <b>Start Free Trial</b> on Professional → submit → open the inquiry → <b>Create customer account</b>. Open the activation email and click <b>Set your password</b>.</li>
                <li>Coastline Protective is over its 50-guard licence: see the orange flag on Customers.</li>
                <li>Settings → change the minimum to $250: pricing page, calculator and price preview all follow.</li>
                <li>Settings → move Xero to Enterprise: the pricing comparison and customer topbars follow.</li>
                <li>Settings → turn page enforcement off: nothing is hidden (how it ships until the click-through).</li>
                <li><a href="#/sa/billing">Billing</a>: Harbour's August invoice is overdue and September is a Draft in Xero. Open September → <b>Act as Xero</b> → Approve, then Record payment, then <b>Sync from Xero</b>.</li>
                <li>Create a customer from the Redline inquiry as <b>Paid</b> on an <b>Annual licence</b>: a Draft is created in Xero straight away. Clear the billing email or leave the ABN blank on a $1,000+ invoice to see it wait with a reason.</li>
                <li>Press <b>+1 day</b> until 1 Nov: Harbour gets October's usage invoice as a Draft in Xero, once. Settings → <b>Xero connection lapsed</b> first: it waits, and is retried the night after you reconnect.</li>
            </ol></div></div>
            <div class="box"><div class="box-h"><h3>Open decisions shown here</h3></div><div class="tbl-wrap"><table class="tbl">
                <thead><tr><th>#</th><th>Decision</th><th>Shown as</th><th>Try it in</th></tr></thead>
                <tbody>${decisions.map(d => `<tr><td>${d[0]}</td><td>${d[1]}</td><td>${d[2]}</td><td class="muted">${d[3]}</td></tr>`).join('')}</tbody>
            </table></div></div>
        </div>
        <div class="box"><div class="box-b">
            <b>Pricing formula check:</b> <span class="${chk.fails.length ? 'check-bad' : 'check-ok'}">${chk.ok} of ${chk.total} checks match the plan's worked table</span>
            ${chk.fails.length ? `<ul>${chk.fails.map(f => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
            <div class="sub">Rows: 10, 25, 30, 50, 100 and 250 guards × Starter/Professional × monthly/annual licence, plus "a negotiated annual amount overrides the formula".</div>
            <div style="margin-top:8px"><b>Invoice maths check:</b> <span class="${ichk.fails.length ? 'check-bad' : 'check-ok'}">${ichk.ok} of ${ichk.total} checks pass</span>
            ${ichk.fails.length ? `<ul>${ichk.fails.map(f => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
            <div class="sub">GST once per invoice, half-up to the cent: $3,000 → $3,300 · $99 minimum → $108.90 · $2,800 → $3,080 · $123.45 → GST $12.35 · GST off · a discount line.</div></div>
            <div class="sub" style="margin-top:8px"><b>Simplified in the prototype:</b> Xero is simulated (use "Act as Xero" on an invoice); the guard count is the "last month" figure on the customer; the first per-guard invoice is created on the next billing day, because per-guard clients are billed after the month ends.</div>
            ${state.jobLog.length ? `<div class="sub" style="margin-top:8px"><b>Nightly job log:</b> ${state.jobLog.slice(0, 5).map(esc).join(' · ')}</div>` : ''}
        </div></div>
    </div>`;
}

/* ================= views: website ================= */
function mkHead() {
    return `<div class="mk-head">
        <a class="mk-brand" href="#/pricing"><img src="ewf-shield.jpg" alt="">ENGAGE WORKFORCE</a>
        <nav class="mk-nav"><span>Product</span><span>Industries</span><a class="on" href="#/pricing" style="text-decoration:none">Pricing</a><span>Resources</span></nav>
        <div class="btn-row"><span class="mk-btn mk-btn-line" title="Not part of this prototype">Log in</span><a class="mk-btn mk-btn-solid" href="#/contact">Book a Demo</a></div>
    </div>`;
}
const mkFoot = () => `<div class="mk-foot">Engage WorkForce · Prices in AUD, excluding GST</div>`;

function viewPricing() {
    const s = state.settings;
    const proFeat = SELLABLE.filter(f => minPlanOf(f) === 'Professional').map(f => f.name);
    const entFeat = SELLABLE.filter(f => minPlanOf(f) === 'Enterprise').map(f => f.name);
    const starterFeat = SELLABLE.filter(f => minPlanOf(f) === 'Starter').map(f => f.name);
    const soon = FEATURES.filter(f => f.soon).map(f => f.name);
    const ticks = (list, max) => list.slice(0, max).map(n => `<li>${esc(n)}</li>`).join('') + (list.length > max ? `<li class="more">${list.length - max} more — see the comparison below</li>` : '');
    const rowCell = (f, tier) => {
        if (f.soon) return tier === 'Enterprise' ? '<span class="mk-soon">Soon</span>' : '<span class="no">—</span>';
        const min = minPlanOf(f);
        return (min === 'Always' || PLAN_RANK[tier] >= PLAN_RANK[min]) ? '<span class="yes" aria-label="Included">✓</span>' : '<span class="no" aria-label="Not included">—</span>';
    };
    return `<div class="mk">
        ${mkHead()}
        <section class="mk-hero">
            <span class="mk-kicker">Pricing</span>
            <h1>Pay for the guards you schedule. <em>Nothing hidden.</em></h1>
            <p class="mk-lede">One price for each guard you roster that month covers the whole platform for your plan. A guard counts once, whether they worked one shift or thirty. Prices in AUD, excluding GST.</p>
        </section>
        <section class="mk-sec" style="padding-top:20px">
            <div class="mk-plans">
                <div class="mk-plan">
                    <div class="mk-plan-name">Starter</div>
                    <p class="mk-plan-for">For small teams getting off spreadsheets and group chats.</p>
                    <div class="mk-price"><span class="amt">$${LIST_RATE.Starter}</span><span class="per">per guard scheduled<br>per month</span></div>
                    <p class="mk-bill">Billed monthly · minimum ${money(s.minMonthly)}/month · AUD excl. GST</p>
                    <ul class="mk-ticks"><li>Employee scheduling & shift templates</li><li>Mobile app with shift notifications</li><li>GPS clock-in / clock-out timesheets</li><li>Leave requests & approvals</li><li>Staff, customer & site records</li><li>Reports & exports</li>${ticks(starterFeat, 4)}<li>Email support, ANZ business hours</li></ul>
                    <a class="mk-btn mk-btn-line" href="#/free-trial?plan=starter">Start Free Trial</a>
                </div>
                <div class="mk-plan feat">
                    <span class="mk-flag">Most Popular</span>
                    <div class="mk-plan-name">Professional</div>
                    <p class="mk-plan-for">For operations running penalty rates, compliance and client billing.</p>
                    <div class="mk-price"><span class="amt">$${LIST_RATE.Professional}</span><span class="per">per guard scheduled<br>per month</span></div>
                    <p class="mk-bill">Billed monthly · minimum ${money(s.minMonthly)}/month · AUD excl. GST</p>
                    <ul class="mk-ticks"><li>Everything in Starter</li>${ticks(proFeat, 8)}<li>Priority support</li></ul>
                    <a class="mk-btn mk-btn-solid" href="#/free-trial?plan=professional">Start Free Trial</a>
                </div>
                <div class="mk-plan">
                    <div class="mk-plan-name">Enterprise</div>
                    <p class="mk-plan-for">For multi-entity groups and large distributed workforces.</p>
                    <div class="mk-price"><span class="amt" style="font-size:2.2rem">Custom</span></div>
                    <p class="mk-bill">Annual agreement · volume pricing for 100+ guards</p>
                    <ul class="mk-ticks"><li>Everything in Professional</li>${ticks(entFeat, 6)}${soon.map(n => `<li class="soon">${esc(n)} (coming soon)</li>`).join('')}<li>Custom onboarding & data migration</li><li>Dedicated account manager</li></ul>
                    <a class="mk-btn mk-btn-line" href="#/contact">Talk to Sales</a>
                </div>
            </div>
            <p class="mk-micro">We'll call first to recommend the right plan. Your trial is set up within one business day. No card needed.</p>
        </section>
        <section class="mk-sec alt">
            <h2>What would it cost you?</h2>
            <p class="mk-sub">Move the slider to the number of guards you schedule in a typical month.</p>
            <div class="mk-calc" id="mk-calc">${calcHtml()}</div>
        </section>
        <section class="mk-sec">
            <h2>Compare plans</h2>
            <p class="mk-sub">Every plan includes the mobile app, support and unlimited admin users.</p>
            <div class="mk-wrap tbl-wrap"><table class="mk-cmp">
                <thead><tr><th>Feature</th>${TIERS.map(t => `<th>${t}</th>`).join('')}</tr></thead>
                <tbody>${CATS.map(cat => `<tr class="cat"><td colspan="4">${esc(cat)}</td></tr>` +
                    FEATURES.filter(f => f.cat === cat).map(f => `<tr><td>${esc(f.name)}${f.soon ? ' <span class="mk-soon">(coming soon)</span>' : ''}</td>${TIERS.map(t => `<td>${rowCell(f, t)}</td>`).join('')}</tr>`).join('')).join('')}
                </tbody>
            </table></div>
        </section>
        <section class="mk-sec alt">
            <div class="mk-band">
                <div class="mk-stat"><div class="n">$0</div><div class="l">Setup fee on Starter and Professional</div></div>
                <div class="mk-stat"><div class="n">Monthly</div><div class="l">No lock-in, or save with an annual plan</div></div>
                <div class="mk-stat"><div class="n">1</div><div class="l">Bill for the whole platform, not per-module add-ons</div></div>
                <div class="mk-stat"><div class="n">AU</div><div class="l">Based support team in your time zone</div></div>
            </div>
        </section>
        <section class="mk-sec">
            <h2>Pricing questions</h2>
            <div class="mk-faq">
                <details open><summary>How does the free trial work?</summary><div>Tell us about your team and we'll call you within one business day to recommend a plan. We set up your account and email you a link to activate it. Your trial runs for 7 or 14 days with everything in that plan. No card needed, and nothing is locked or deleted when it ends: we'll talk about next steps.</div></details>
                <details><summary>Who counts as a guard?</summary><div>Anyone with at least one published shift starting in that calendar month. Draft shifts don't count, and a guard counts once whether they worked one shift or thirty.</div></details>
                <details><summary>Is there a lock-in contract?</summary><div>Monthly plans have no lock-in: change plans or leave any month. Annual plans are paid upfront for 12 months and cost the same as ${s.annualMonths} months.</div></details>
                <details><summary>Is there a minimum charge?</summary><div>Yes: ${money(s.minMonthly)} per month, so very small teams pay the minimum until they grow past it.</div></details>
                <details><summary>Do prices include GST?</summary><div>Prices are in AUD and exclude GST.</div></details>
            </div>
        </section>
        ${mkFoot()}
    </div>`;
}
function calcHtml() {
    const s = state.settings, g = ui.calcGuards, annual = ui.calcAnnual;
    return `<div class="mk-calc-top">
            <div class="mk-guards"><span id="mk-g">${g}</span> <span>guards scheduled / month</span></div>
            <div class="mk-toggle" role="group" aria-label="Billing">
                <button type="button" class="${annual ? '' : 'on'}" data-act="calc-term" data-id="m">Pay monthly</button>
                <button type="button" class="${annual ? 'on' : ''}" data-act="calc-term" data-id="a">Annual (pay ${s.annualMonths}, get 12)</button>
            </div>
        </div>
        <input class="mk-range" type="range" min="1" max="300" value="${g}" id="calc-range" aria-label="Guards scheduled per month">
        <div id="mk-res-wrap">${calcResults()}</div>`;
}
function calcResults() {
    const s = state.settings, g = ui.calcGuards, annual = ui.calcAnnual;
    const res = tier => {
        const p = calcPrice({ model: annual ? 'AnnualLicence' : 'PerGuard', rate: LIST_RATE[tier], guards: g, includedGuards: g, minMonthly: s.minMonthly }, s.annualMonths);
        return `<div class="mk-res"><div class="t">${tier}</div>
            <div class="v">${annual ? money(p.annual) + ' <span style="font-size:14px;font-weight:500">/ year</span>' : money(p.listMonthly) + ' <span style="font-size:14px;font-weight:500">/ month</span>'}</div>
            <div class="s">${annual ? `Pay ${s.annualMonths} months, get 12 · ≈ ${money(p.annual / 12)}/month` : `${money(p.listMonthly * 12)} over a year`}${p.minApplied ? ' · minimum applies' : ''}</div></div>`;
    };
    return `<div class="mk-calc-res">${res('Starter')}${res('Professional')}</div>
        ${g >= 100 ? '<p class="mk-micro" style="text-align:left">100+ guards? <a href="#/contact">Talk to us</a> about volume pricing on Enterprise.</p>' : ''}`;
}

function viewForm(mode, query) {
    const trial = mode === 'trial';
    const planQ = String(query.plan || '').toLowerCase();
    const plan = { starter: 'Starter', professional: 'Professional', enterprise: 'Enterprise' }[planQ] || (trial ? 'Professional' : '');
    const sent = ui.formSent && ui.formSent.mode === mode ? ui.formSent : null;
    const left = trial
        ? `<span class="mk-kicker">Free trial</span><h1>Start your free trial</h1>
           <p class="mk-lede" style="margin:0 0 16px">Tell us a little about your team. A real person will call you, no automated sign-up.</p>
           <ol><li>We call you within one business day.</li><li>We recommend the right plan for how you run your sites.</li><li>We set up your account and email you an activation link.</li><li>You try everything in your plan for 7 or 14 days. No card needed.</li></ol>`
        : `<span class="mk-kicker">Talk to sales</span><h1>Talk to our team</h1>
           <p class="mk-lede" style="margin:0 0 16px">Book a demo or ask a question. We'll get back to you within one business day.</p>`;
    let right;
    if (sent) {
        right = `<div class="mk-success"><div class="ok-ic">✓</div>
            <h2 style="font-family:Outfit,sans-serif;color:var(--navy);margin-bottom:8px">Thanks, ${esc(firstName(sent.name))}!</h2>
            <p>${trial ? "We'll call you within one business day to recommend the right plan and set up your trial." : "We'll be in touch within one business day."}</p>
            <div class="proto-note" style="text-align:left;margin-top:16px"><b class="tag">PROTOTYPE</b>${sent.dup ? 'Same email within 10 minutes: the inquiry was <b>not saved twice</b>, but the emails still went out.' : 'This saved an inquiry and sent 2 emails.'}
                <div class="btn-row" style="margin-top:8px"><a class="btn btn-sm btn-p" href="#/sa/inquiries?open=${esc(sent.id)}">Open the inquiry</a><a class="btn btn-sm" href="#/inbox">Open inbox</a><button class="btn btn-sm" data-act="form-again" data-id="${mode}">Send another</button></div></div></div>`;
    } else {
        right = `<form class="mk-form" data-form="lead" data-mode="${mode}" novalidate>
            <div id="lead-errors"></div>
            <div class="grid2">
                <div class="fld"><label for="f-name">Full name <span class="req">*</span></label><input class="in" id="f-name" name="fullName" autocomplete="name" required></div>
                <div class="fld"><label for="f-company">Company <span class="req">*</span></label><input class="in" id="f-company" name="companyName" autocomplete="organization" required></div>
                <div class="fld"><label for="f-email">Work email <span class="req">*</span></label><input class="in" id="f-email" name="email" type="email" autocomplete="email" required></div>
                <div class="fld"><label for="f-phone">Phone</label><input class="in" id="f-phone" name="phone" type="tel" autocomplete="tel"></div>
            </div>
            <div class="grid2">
                <div class="fld"><label for="f-size">Team size</label><select class="in" id="f-size" name="teamSize"><option value="">Select a range…</option>${TEAM_SIZES.map(t => `<option>${t}</option>`).join('')}</select></div>
                <div class="fld"><label for="f-plan">Plan you're interested in</label><select class="in" id="f-plan" name="selectedPlan"><option value="">Not sure yet</option>${TIERS.map(t => `<option ${t === plan ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
            </div>
            <div class="fld"><span class="lbl">What would you like?</span><div class="radios">
                ${(trial ? ['FreeTrial', 'Demo', 'Question'] : ['Demo', 'Question']).map((k, i) => `<label><input type="radio" name="interest" value="${k}" ${i === 0 ? 'checked' : ''}>${INTEREST[k]}</label>`).join('')}
            </div></div>
            ${trial ? `<div class="fld" data-show-trial><span class="lbl">Preferred trial length</span><div class="radios">
                <label><input type="radio" name="preferredTrialDays" value="7">7 days</label>
                <label><input type="radio" name="preferredTrialDays" value="14" checked>14 days</label>
                <label><input type="radio" name="preferredTrialDays" value="">Not sure</label></div></div>` : ''}
            <div class="fld"><label for="f-msg">Anything we should know?</label><textarea class="in" id="f-msg" name="message" placeholder="e.g. We roster 40 casuals across 6 sites and payroll takes two days every fortnight…"></textarea></div>
            <div class="honeypot" aria-hidden="true"><label for="f-web">Website</label><input id="f-web" name="website" tabindex="-1" autocomplete="off"></div>
            <button class="mk-btn mk-btn-solid btn-submit" type="submit">${trial ? 'Request my free trial' : 'Send'}</button>
            <p class="mk-micro">We'll only use your details to contact you about Engage WorkForce.</p>
        </form>`;
    }
    return `<div class="mk">${mkHead()}<div class="mk-form-wrap"><div class="mk-form-copy">${left}</div><div>${right}</div></div>${mkFoot()}</div>`;
}
function submitLead(form) {
    const fd = new FormData(form), v = k => String(fd.get(k) || '').trim();
    const mode = form.dataset.mode;
    if (v('website')) { ui.formSent = { mode, name: v('fullName'), id: '', dup: false }; render(); return; }   // honeypot: silent success
    const errs = [];
    if (!v('fullName')) errs.push('Enter your full name.');
    if (!v('companyName')) errs.push('Enter your company name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email'))) errs.push('Enter a valid work email.');
    if (errs.length) { $('#lead-errors').innerHTML = `<div class="errors"><ul>${errs.map(e => `<li>${e}</li>`).join('')}</ul></div>`; return; }
    const interest = v('interest') || 'Demo';
    const q = {
        id: nid('q'), createdAt: stamp(), createdMs: Date.now(), fullName: v('fullName'), companyName: v('companyName'), email: v('email'), phone: v('phone'),
        teamSize: v('teamSize'), selectedPlan: v('selectedPlan'), interest, preferredTrialDays: interest === 'FreeTrial' && v('preferredTrialDays') ? +v('preferredTrialDays') : null,
        message: v('message'), sourcePage: mode === 'trial' ? '/free-trial' : '/contact', status: 'New', notes: '', convertedCompanyId: null,
    };
    const dup = state.inquiries.find(x => x.email.toLowerCase() === q.email.toLowerCase() && x.createdMs && Date.now() - x.createdMs < 10 * 60 * 1000);
    if (!dup) state.inquiries.push(q);
    emailLead(q); emailRequesterConfirm(q);
    ui.formSent = { mode, name: q.fullName, id: dup ? dup.id : q.id, dup: !!dup };
    save(); render();
}

/* ================= views: inbox ================= */
function viewInbox(id) {
    const list = state.emails.slice().sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : (b.id.localeCompare(a.id, undefined, { numeric: true }))))
        .filter(e => ui.inboxFilter === 'All' || e.kind === ui.inboxFilter);
    const sel = id ? state.emails.find(e => e.id === id) : list[0];
    if (sel && !sel.read) { sel.read = true; save(); renderBar('/inbox'); }
    const count = k => state.emails.filter(e => k === 'All' || e.kind === k).length;
    return `<div class="page">
        <div class="page-head"><div><div class="eyebrow">Prototype</div><h1>Inbox</h1><p>Every email the system would send, at the moment it would send it. Sales inbox: ${esc(state.settings.salesInbox)}.</p></div></div>
        <div class="chips">${[['All', 'All'], ['sales', 'Sales inbox'], ['customer', 'To customers'], ['xero', 'Sent by Xero']].map(([k, l]) => `<button class="chip ${ui.inboxFilter === k ? 'on' : ''}" data-act="inbox-filter" data-id="${k}">${l}<b>${count(k)}</b></button>`).join('')}</div>
        <div class="box"><div class="inbox">
            <div class="inbox-list">${list.length ? list.map(e => `<button class="mail ${e.read ? '' : 'unread'} ${sel && e.id === sel.id ? 'on' : ''}" data-act="open-mail" data-id="${e.id}">
                <div class="m-top"><span>${pill(MAIL_KIND[e.kind][0], MAIL_KIND[e.kind][1])} ${esc(e.to)}</span><span class="nowrap">${esc(fmtStamp(e.at))}</span></div>
                <div class="m-sub">${esc(e.subject)}</div></button>`).join('') : '<p class="muted" style="padding:16px">No emails yet.</p>'}</div>
            <div class="inbox-view">${sel ? `<div class="mail-meta"><div><span>Subject</span><b>${esc(sel.subject)}</b></div><div><span>To</span>${esc(sel.to)}</div><div><span>From</span>${sel.kind === 'xero' ? `${esc(bset().supplier)} via Xero` : 'Engage WorkForce &lt;no-reply@engageworkforce.com.au&gt;'}</div><div><span>Sent</span>${esc(fmtStamp(sel.at))}</div></div>${sel.body}` : '<p class="muted">Select an email.</p>'}</div>
        </div></div>
    </div>`;
}

/* ================= views: SuperAdmin › Inquiries ================= */
function viewInquiries(query) {
    const counts = Object.fromEntries(Object.keys(INQ_STATUS).map(k => [k, state.inquiries.filter(q => q.status === k).length]));
    return saChrome('inquiries') + `<div class="page">
        <div class="page-head">
            <div><div class="eyebrow">SuperAdmin</div><h1>Inquiries</h1><p>Every Start Free Trial, Talk to Sales and feature request. Saved here and emailed to the sales inbox.</p></div>
            <div class="head-tools"><input class="search" type="search" placeholder="Search name, company or email" value="${esc(ui.inqSearch)}" data-search="inq" aria-label="Search inquiries"></div>
        </div>
        <div class="chips">
            <button class="chip ${ui.inqFilter === 'All' ? 'on' : ''}" data-act="inq-filter" data-id="All">All<b>${state.inquiries.length}</b></button>
            ${Object.entries(INQ_STATUS).map(([k, [l]]) => `<button class="chip ${ui.inqFilter === k ? 'on' : ''}" data-act="inq-filter" data-id="${k}">${l}<b>${counts[k]}</b></button>`).join('')}
        </div>
        <div class="box"><div class="tbl-wrap"><table class="tbl">
            <thead><tr><th>Received</th><th>Contact</th><th>Company</th><th>Wants</th><th>Team size</th><th>Status</th><th></th></tr></thead>
            <tbody id="inq-rows">${inqRows()}</tbody>
        </table></div></div>
    </div>`;
}
function inqRows() {
    const s = ui.inqSearch.toLowerCase();
    const rows = state.inquiries.filter(q => (ui.inqFilter === 'All' || q.status === ui.inqFilter) &&
        (!s || [q.fullName, q.companyName, q.email].some(x => String(x).toLowerCase().includes(s))))
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    if (!rows.length) return '<tr><td colspan="7" class="empty">No inquiries match.</td></tr>';
    return rows.map(q => {
        const [l, cls] = INQ_STATUS[q.status];
        const wants = INTEREST[q.interest] + (q.selectedPlan ? ` · ${q.selectedPlan}` : '') + (q.preferredTrialDays ? ` · ${q.preferredTrialDays} days` : '');
        return `<tr class="click" data-act="open-inq" data-id="${q.id}" tabindex="0">
            <td class="nowrap">${esc(fmtStamp(q.createdAt))}</td>
            <td><b>${esc(q.fullName)}</b><div class="sub">${esc(q.email)}${q.phone ? ' · ' + esc(q.phone) : ''}</div></td>
            <td>${esc(q.companyName)}${q.sourcePage === '/upgrade-required' ? '<div class="sub">From "Upgrade to unlock"</div>' : ''}</td>
            <td>${esc(wants)}</td><td>${esc(q.teamSize || '—')}</td><td>${pill(l, cls)}</td>
            <td><button class="btn btn-sm" data-act="open-inq" data-id="${q.id}">Open</button></td></tr>`;
    }).join('');
}
function openInquiryDrawer(id) {
    const q = inq(id); if (!q) return;
    const [l, cls] = INQ_STATUS[q.status];
    const c = q.convertedCompanyId && comp(q.convertedCompanyId);
    showDrawer(`<div class="drawer-h"><div><div class="sub" style="color:#c7d4ff">Inquiry · ${esc(fmtStamp(q.createdAt))}</div><h3>${esc(q.companyName)}</h3><div style="margin-top:6px">${pill(l, cls)}</div></div><button class="x" data-act="close-drawer" aria-label="Close">×</button></div>
        <div class="drawer-b">
            <div class="btn-row" style="margin-bottom:16px">
                ${c ? `<a class="btn btn-p" href="#/sa/customers?open=${c.id}">Open customer</a>` : (q.status !== 'Lost' ? `<button class="btn btn-p" data-act="create-from-inq" data-id="${q.id}">Create customer account</button>` : '')}
                ${q.status !== 'Lost' && q.status !== 'Won' ? `<button class="btn btn-danger" data-act="inq-lost" data-id="${q.id}">Mark lost</button>` : ''}
            </div>
            <dl class="dl">
                <dt>Name</dt><dd>${esc(q.fullName)}</dd><dt>Email</dt><dd>${esc(q.email)}</dd><dt>Phone</dt><dd>${esc(q.phone || '—')}</dd>
                <dt>Team size</dt><dd>${esc(q.teamSize || '—')}</dd><dt>Wants</dt><dd>${esc(INTEREST[q.interest])}</dd>
                <dt>Plan</dt><dd>${esc(q.selectedPlan || 'Not sure')}</dd><dt>Trial length</dt><dd>${q.interest === 'FreeTrial' ? (q.preferredTrialDays ? q.preferredTrialDays + ' days' : 'Not sure') : '—'}</dd>
                <dt>Message</dt><dd>${esc(q.message || '—')}</dd><dt>Source page</dt><dd>${esc(q.sourcePage)}</dd>
                ${c ? `<dt>Customer</dt><dd>${esc(c.name)} · ${pill(statusInfo(c).label, statusInfo(c).cls)}</dd>` : ''}
            </dl>
            <div class="sec-title">Pipeline</div>
            <div class="fld"><label for="inq-status">Status</label><select class="in" id="inq-status">${Object.entries(INQ_STATUS).map(([k, [lab]]) => `<option value="${k}" ${k === q.status ? 'selected' : ''}>${lab}</option>`).join('')}</select></div>
            <div class="fld"><label for="inq-notes">Internal notes</label><textarea class="in" id="inq-notes" placeholder="Call notes, agreed price, next step…">${esc(q.notes)}</textarea></div>
            <button class="btn btn-p" data-act="inq-save" data-id="${q.id}">Save</button>
        </div>`);
}

/* ================= views: SuperAdmin › Customers ================= */
function custFilterOf(c) { return c.agreement ? c.agreement.status : 'Existing'; }
function viewCustomers() {
    const cs = state.companies;
    const trials = cs.filter(c => c.agreement && c.agreement.status === 'Trial');
    const soon = trials.filter(c => diffDays(c.agreement.trialEnd, state.today) <= 3).length;
    const ended = cs.filter(c => c.agreement && c.agreement.status === 'TrialEnded').length;
    const active = cs.filter(c => c.agreement && c.agreement.status === 'Active');
    const existing = cs.filter(c => !c.agreement).length;
    const mrr = active.reduce((t, c) => t + monthlyRecurring(c), 0);
    const filters = [['All', 'All'], ['Trial', 'Trial'], ['TrialEnded', 'Trial ended'], ['Active', 'Active'], ['Suspended', 'Suspended'], ['Cancelled', 'Cancelled'], ['Existing', 'Existing customer']];
    return saChrome('customers') + `<div class="page">
        <div class="page-head">
            <div><div class="eyebrow">SuperAdmin</div><h1>Customers</h1><p>Every company, its agreement, trial and how many guards it schedules. Invoices are raised in Xero from the Billing tab.</p></div>
            <div class="head-tools"><input class="search" type="search" placeholder="Search company or admin" value="${esc(ui.custSearch)}" data-search="cust" aria-label="Search customers"><button class="btn btn-p" data-act="create-blank">+ Create customer</button></div>
        </div>
        <div class="kpis">
            <button class="kpi teal" data-act="cust-filter" data-id="Trial"><div class="n">${trials.length}</div><div class="l">Trials running${soon ? ` · <span class="warn-text">${soon} ending within 3 days</span>` : ''}</div></button>
            <button class="kpi orange" data-act="cust-filter" data-id="TrialEnded"><div class="n">${ended}</div><div class="l">Trials ended: follow up</div></button>
            <button class="kpi green" data-act="cust-filter" data-id="Active"><div class="n">${active.length}</div><div class="l">Active (paying)</div></button>
            <button class="kpi slate" data-act="cust-filter" data-id="Existing"><div class="n">${existing}</div><div class="l">Existing, no agreement</div></button>
            <div class="kpi navy"><div class="n">${money(Math.round(mrr))}</div><div class="l">Est. monthly recurring (Active)</div></div>
        </div>
        <div class="chips">${filters.map(([k, l]) => `<button class="chip ${ui.custFilter === k ? 'on' : ''}" data-act="cust-filter" data-id="${k}">${l}<b>${k === 'All' ? cs.length : cs.filter(c => custFilterOf(c) === k).length}</b></button>`).join('')}</div>
        <div class="box"><div class="tbl-wrap"><table class="tbl">
            <thead><tr><th>Company</th><th>Plan</th><th>Status</th><th>Pricing</th><th>Guards scheduled</th><th>Trial end / renewal</th><th></th></tr></thead>
            <tbody id="cust-rows">${custRows()}</tbody>
        </table></div></div>
    </div>`;
}
function guardsCell(c) {
    const band = c.agreement && c.agreement.includedGuards;
    const over = band && c.guardsThis > band;
    return `<b class="mono">${c.guardsThis}</b> this month<div class="sub">${c.guardsLast} last month</div>` +
        (band ? `<div class="sub">${over ? pill(`Over ${band}-guard licence by ${c.guardsThis - band}`, 'p-orange') : `Licence: ${band} guards`}</div>` : '');
}
function custRows() {
    const s = ui.custSearch.toLowerCase();
    const rows = state.companies.filter(c => (ui.custFilter === 'All' || custFilterOf(c) === ui.custFilter) &&
        (!s || [c.name, c.adminName, c.adminEmail].some(x => String(x).toLowerCase().includes(s))));
    if (!rows.length) return '<tr><td colspan="7" class="empty">No customers match.</td></tr>';
    return rows.map(c => {
        const a = c.agreement, st = statusInfo(c), p = a && priceOf(c);
        let pricing = '<span class="muted">Not recorded</span>';
        if (a) {
            if (a.model === 'Custom') pricing = `${money(p.annual)} / yr<div class="sub">Custom agreement</div>`;
            else if (a.model === 'AnnualLicence') pricing = `${money(p.annual)} / yr<div class="sub">Annual licence · ${a.includedGuards} guards</div>`;
            else pricing = `${money(a.rate)} / guard / mo<div class="sub">≈ ${money(p.listMonthly)}/mo at ${p.guards} guards${p.minApplied ? ' (minimum)' : ''}</div>`;
        }
        const dates = !a ? '—' : (a.status === 'Trial' || a.status === 'TrialEnded') ? `Trial ends ${fmtDate(a.trialEnd)}` : (a.renewalDate ? `Renews ${fmtDate(a.renewalDate)}` : 'Monthly');
        return `<tr class="click" data-act="open-cust" data-id="${c.id}" tabindex="0">
            <td><b>${esc(c.name)}</b><div class="sub">${esc(c.adminEmail)}${c.activated ? '' : ' · <span class="warn-text">not activated</span>'}</div></td>
            <td>${a ? esc(a.plan) : '<span class="muted">—</span>'}</td>
            <td>${pill(st.label, st.cls)}${overdueOf(c).length ? ' ' + pill('Payment overdue', 'p-red') : ''}<div class="sub ${st.warn ? 'warn' : ''}">${esc(st.sub)}</div></td>
            <td>${pricing}</td><td>${guardsCell(c)}</td><td class="nowrap">${dates}</td>
            <td><button class="btn btn-sm" data-act="open-cust" data-id="${c.id}">Open</button></td></tr>`;
    }).join('');
}
function openCustomerDrawer(id) {
    const c = comp(id); if (!c) return;
    const a = c.agreement, st = statusInfo(c), keys = enabledKeys(c);
    const q = a && a.inquiryId && inq(a.inquiryId);
    const btn = (act, label, cls) => `<button class="btn btn-sm ${cls || ''}" data-act="${act}" data-id="${c.id}">${label}</button>`;
    const actions = !a ? [btn('ag-attach', 'Attach agreement', 'btn-p')] : [
        btn('ag-edit', 'Edit agreement', 'btn-p'),
        (a.status === 'Trial' || a.status === 'TrialEnded') ? btn('ag-extend', 'Extend trial') : '',
        (a.status === 'Trial' || a.status === 'TrialEnded') ? btn('ag-convert', 'Convert to paid', 'btn-ok') : '',
        ['Active', 'Trial', 'TrialEnded'].includes(a.status) ? btn('ag-suspend', 'Suspend', 'btn-warn') : '',
        a.status !== 'Cancelled' ? btn('ag-cancel', 'Cancel', 'btn-danger') : '',
        ['Suspended', 'Cancelled'].includes(a.status) ? btn('ag-reactivate', 'Reactivate', 'btn-ok') : '',
    ];
    actions.push(btn('resend', 'Resend activation'), btn('view-as', 'View as customer'));
    const ovs = c.overrides.map(o => `<li><span>${o.granted ? pill('Added', 'p-green') : pill('Removed', 'p-red')} ${esc(BY_KEY[o.key].name)}</span><span class="sub">${o.expiresAt ? (overrideActive(o) ? 'until ' + fmtDate(o.expiresAt) : 'expired ' + fmtDate(o.expiresAt)) : 'no expiry'}</span></li>`).join('');
    showDrawer(`<div class="drawer-h"><div><div class="sub" style="color:#c7d4ff">Customer</div><h3>${esc(c.name)}</h3><div style="margin-top:6px">${pill(st.label, st.cls)}${overdueOf(c).length ? ' ' + pill('Payment overdue', 'p-red') : ''} <span class="sub" style="color:#c7d4ff">${esc(st.sub)}</span></div></div><button class="x" data-act="close-drawer" aria-label="Close">×</button></div>
        <div class="drawer-b">
            <div class="btn-row" style="margin-bottom:16px">${actions.join('')}</div>
            <div class="sec-title">Admin login</div>
            <dl class="dl"><dt>Admin</dt><dd>${esc(c.adminName)}</dd><dt>Email</dt><dd>${esc(c.adminEmail)}</dd><dt>Phone</dt><dd>${esc(c.phone || '—')}</dd>
                <dt>Activated</dt><dd>${c.activated ? 'Yes' : '<span class="warn-text">Not yet: waiting for the activation link</span>'}</dd><dt>Created</dt><dd>${fmtDate(c.createdAt)}</dd></dl>
            <div class="sec-title">Agreement</div>
            ${a ? `<dl class="dl"><dt>Plan</dt><dd>${esc(a.plan)}</dd><dt>Status</dt><dd>${esc(AG_STATUS[a.status])}</dd>
                ${a.trialStart ? `<dt>Trial</dt><dd>${a.trialDays} days · ${fmtDate(a.trialStart)} – ${fmtDate(addDays(a.trialEnd, -1))}</dd>` : ''}
                ${a.subscribedAt ? `<dt>Paying since</dt><dd>${fmtDate(a.subscribedAt)}</dd>` : ''}
                <dt>Pricing model</dt><dd>${esc(MODEL[a.model])}</dd><dt>Price</dt><dd>${esc(priceLine(c))}</dd>
                <dt>Renewal</dt><dd>${a.renewalDate ? fmtDate(a.renewalDate) : (a.status === 'Active' ? 'Monthly' : '—')}</dd>
                <dt>Billing notes</dt><dd>${esc(a.billingNotes || '—')}</dd>
                <dt>Inquiry</dt><dd>${q ? `<a href="#/sa/inquiries?open=${q.id}">${esc(q.companyName)} · ${esc(fmtStamp(q.createdAt))}</a>` : '—'}</dd></dl>`
                : '<p class="muted">No agreement. Shown as "Existing customer": every feature is on and nothing changes for them.</p>'}
            ${a ? billingSection(c, btn) : ''}
            <div class="sec-title">Guards scheduled</div>
            <p>${c.guardsThis} this month · ${c.guardsLast} last month${a && a.includedGuards ? ` · licence for ${a.includedGuards}` : ''}${a && a.includedGuards && c.guardsThis > a.includedGuards ? ` ${pill('Over licence: true-up at renewal', 'p-orange')}` : ''}</p>
            <div class="proto-note"><b class="tag">PROTOTYPE</b>Change the usage to see the band flag and price move.
                <div class="grid2" style="margin-top:8px"><div class="fld"><label for="sim-this">This month</label><input class="in" id="sim-this" type="number" min="0" value="${c.guardsThis}"></div><div class="fld"><label for="sim-last">Last month</label><input class="in" id="sim-last" type="number" min="0" value="${c.guardsLast}"></div></div>
                <button class="btn btn-sm" data-act="sim-usage" data-id="${c.id}">Update usage</button></div>
            <div class="sec-title">Features — ${keys.size} of ${SELLABLE.length} on</div>
            ${c.overrides.length ? `<ul class="mini-list" style="margin-bottom:10px">${ovs}</ul>` : `<p class="muted">${a ? 'Plan defaults, no overrides.' : 'Every feature (no agreement).'}</p>`}
            <details style="margin-bottom:16px"><summary class="link-btn" style="text-decoration:none">Show every feature</summary>${featureList(c)}</details>
            <div class="sec-title">History</div>
            <ul class="hist">${c.history.map(h => `<li class="${h.system ? 'sys' : ''}"><div class="h-top"><span class="h-act">${esc(h.action)}</span><span class="sub">${esc(fmtStamp(h.at))}</span></div>
                ${h.detail ? `<div>${esc(h.detail)}</div>` : ''}${h.reason ? `<div class="sub">Reason: ${esc(h.reason)}</div>` : ''}<div class="sub">By ${esc(h.by)}</div></li>`).join('')}</ul>
        </div>`);
}
function featureList(c) {
    const keys = enabledKeys(c);
    return CATS.map(cat => `<div class="fp-cat">${esc(cat)}</div><ul class="mini-list">` + FEATURES.filter(f => f.cat === cat).map(f => {
        const on = keys.has(f.key);
        const o = c.overrides.find(x => x.key === f.key && overrideActive(x));
        const src = f.soon ? pill('Coming soon', 'p-grey') : f.min === 'Always' ? pill('Always on', 'p-slate') : !c.agreement ? pill('No agreement', 'p-slate') : o ? pill(o.granted ? 'Added' : 'Removed', o.granted ? 'p-green' : 'p-red') : pill(on ? 'In plan' : 'Not in plan', on ? 'p-blue' : 'p-grey');
        return `<li><span>${on ? '<b>✓</b>' : '<span class="muted">—</span>'} ${esc(f.name)}</span>${src}</li>`;
    }).join('') + '</ul>').join('');
}

/* ================= agreement modal (create / edit / attach) ================= */
let draft = null;
function defaultModel(plan) { return PLAN_RANK[plan] >= 3 ? 'Custom' : 'PerGuard'; }
function openAgreementModal(mode, opts) {
    const c = opts.companyId ? comp(opts.companyId) : null;
    const q = opts.inquiryId ? inq(opts.inquiryId) : null;
    const a = c && c.agreement;
    const plan = a ? a.plan : (q && TIERS.includes(q.selectedPlan) ? q.selectedPlan : 'Professional');
    const nameParts = q ? q.fullName.trim().split(/\s+/) : [];
    draft = {
        mode, companyId: c ? c.id : null, inquiryId: q ? q.id : (a ? a.inquiryId : null),
        companyName: c ? c.name : (q ? q.companyName : ''), firstName: nameParts[0] || '', lastName: nameParts.slice(1).join(' '),
        email: q ? q.email : '', phone: q ? q.phone : '', country: 'Australia', timeZone: TIMEZONES[0],
        plan, start: 'Trial', trialDays: a && a.trialDays ? a.trialDays : (q && q.preferredTrialDays) || 14,
        status: a ? a.status : 'Active', model: a ? a.model : defaultModel(plan), rate: a ? a.rate : (LIST_RATE[plan] || ''),
        minMonthly: a ? a.minMonthly : state.settings.minMonthly, term: a ? a.term : 'Monthly',
        includedGuards: a && a.includedGuards ? a.includedGuards : 50,
        guards: c ? (c.guardsLast || c.guardsThis || 20) : guardsFromTeam(q && q.teamSize),
        annualAmount: a && a.annualAmount ? a.annualAmount : '', billingNotes: a ? a.billingNotes : '',
        overrides: c ? clone(c.overrides) : [], reason: '', prevPlan: plan,
        billName: '', billEmail: '', billAbn: '', billGst: true, prevCountry: 'Australia',
    };
    const title = mode === 'create' ? 'Create customer account' : mode === 'attach' ? `Attach agreement — ${c.name}` : `Edit agreement — ${c.name}`;
    const opt = (list, val, labels) => list.map(v => `<option value="${esc(v)}" ${String(v) === String(val) ? 'selected' : ''}>${esc(labels ? labels[v] : v)}</option>`).join('');
    showModal(`<div class="modal-h"><h3>${esc(title)}</h3><button class="x" data-act="close-modal" aria-label="Close">×</button></div>
        <form id="am-form" data-form="agreement" novalidate><div class="modal-b">
            ${q ? `<div class="info">Prefilled from the inquiry by <b>${esc(q.fullName)}</b> (${esc(INTEREST[q.interest])}${q.selectedPlan ? ', ' + esc(q.selectedPlan) : ''}${q.teamSize ? ', ' + esc(q.teamSize) : ''}).</div>` : ''}
            <div id="am-errors"></div>
            <div class="am-grid"><div>
                ${mode === 'create' ? `<div class="sec-title">Company & admin login</div>
                    <div class="fld"><label for="am-company">Company name <span class="req">*</span></label><input class="in" id="am-company" name="companyName" value="${esc(draft.companyName)}"></div>
                    <div class="grid2"><div class="fld"><label for="am-first">Admin first name <span class="req">*</span></label><input class="in" id="am-first" name="firstName" value="${esc(draft.firstName)}"></div>
                        <div class="fld"><label for="am-last">Admin last name <span class="req">*</span></label><input class="in" id="am-last" name="lastName" value="${esc(draft.lastName)}"></div></div>
                    <div class="grid2"><div class="fld"><label for="am-email">Admin email <span class="req">*</span></label><input class="in" id="am-email" name="email" type="email" value="${esc(draft.email)}"></div>
                        <div class="fld"><label for="am-phone">Phone</label><input class="in" id="am-phone" name="phone" value="${esc(draft.phone)}"></div></div>
                    <div class="grid2"><div class="fld"><label for="am-country">Country</label><select class="in" id="am-country" name="country">${opt(['Australia', 'New Zealand'], draft.country)}</select></div>
                        <div class="fld"><label for="am-tz">Time zone</label><select class="in" id="am-tz" name="timeZone">${opt(TIMEZONES, draft.timeZone)}</select></div></div>
                    <p class="hint" style="margin-top:-4px">The admin gets an activation link by email. No password is ever typed or shown.</p>
                    <div class="sec-title">Billing details</div>
                    <div class="grid2"><div class="fld"><label for="am-bname">Billing name</label><input class="in" id="am-bname" name="billName" value="${esc(draft.billName)}" placeholder="Defaults to the company name"></div>
                        <div class="fld"><label for="am-bemail">Billing email</label><input class="in" id="am-bemail" name="billEmail" type="email" value="${esc(draft.billEmail)}" placeholder="Defaults to the admin email"></div></div>
                    <div class="grid2"><div class="fld"><label for="am-abn">ABN</label><input class="in" id="am-abn" name="billAbn" value="${esc(draft.billAbn)}" placeholder="Needed on invoices of $1,000 or more"></div>
                        <div class="fld"><span class="lbl">GST</span><label class="check"><input type="checkbox" name="billGst" ${draft.billGst ? 'checked' : ''}>Charge GST (${bset().gstRate}%)</label><span class="hint">On for Australia, off for New Zealand. Ask your accountant.</span></div></div>` : ''}
                <div class="sec-title">Plan & ${mode === 'create' ? 'start' : 'status'}</div>
                <div class="grid2">
                    <div class="fld"><label for="am-plan">Plan</label><select class="in" id="am-plan" name="plan">${opt(PLANS, draft.plan)}</select></div>
                    ${mode === 'create'
                        ? `<div class="fld"><span class="lbl">Start as</span><div class="radios"><label><input type="radio" name="start" value="Trial" checked>Free trial</label><label><input type="radio" name="start" value="Paid">Paid subscription</label></div></div>`
                        : `<div class="fld"><label for="am-status">Status</label><select class="in" id="am-status" name="status">${opt(Object.keys(AG_STATUS), draft.status, AG_STATUS)}</select></div>`}
                </div>
                <div class="fld" data-show="trial"><span class="lbl">Trial length</span>
                    ${mode === 'create' ? `<div class="radios"><label><input type="radio" name="trialDays" value="7" ${+draft.trialDays === 7 ? 'checked' : ''}>7 days</label><label><input type="radio" name="trialDays" value="14" ${+draft.trialDays !== 7 ? 'checked' : ''}>14 days</label></div>`
                        : `<input class="in" name="trialDays" type="number" min="1" value="${esc(draft.trialDays)}" aria-label="Trial length in days">`}
                    <span class="hint" id="am-trial-hint"></span></div>
                <div class="sec-title">Pricing</div>
                <div class="fld"><label for="am-model">Pricing model</label><select class="in" id="am-model" name="model">
                    <option value="PerGuard" ${draft.model === 'PerGuard' ? 'selected' : ''}>Per guard — billed monthly on guards scheduled</option>
                    <option value="AnnualLicence" ${draft.model === 'AnnualLicence' ? 'selected' : ''}>Annual licence — prepaid for a number of guards (pay ${state.settings.annualMonths} months, get 12)</option>
                    <option value="Custom" ${draft.model === 'Custom' ? 'selected' : ''}>Custom — Enterprise, agreed annual amount</option></select></div>
                <div class="grid2">
                    <div class="fld" data-show="rate"><label for="am-rate">Agreed rate ($ / guard / month)</label><input class="in" id="am-rate" name="rate" type="number" min="0" step="0.5" value="${esc(draft.rate)}"><span class="hint" id="am-rate-hint"></span></div>
                    <div class="fld" data-show="rate"><label for="am-min">Minimum per month ($)</label><input class="in" id="am-min" name="minMonthly" type="number" min="0" value="${esc(draft.minMonthly)}"><span class="hint">Default ${money(state.settings.minMonthly)}</span></div>
                </div>
                <div class="grid2">
                    <div class="fld" data-show="band"><label for="am-band">Licence covers (guards)</label><input class="in" id="am-band" name="includedGuards" type="number" min="1" list="bands" value="${esc(draft.includedGuards)}"><datalist id="bands"><option value="25"><option value="50"><option value="100"><option value="250"></datalist></div>
                    <div class="fld" data-show="guards"><label for="am-guards">Expected guards / month (for the preview)</label><input class="in" id="am-guards" name="guards" type="number" min="0" value="${esc(draft.guards)}"></div>
                </div>
                <div class="fld" data-show="annual"><label for="am-annual" id="am-annual-label">Negotiated annual amount ($, optional)</label><input class="in" id="am-annual" name="annualAmount" type="number" min="0" value="${esc(draft.annualAmount)}"><span class="hint" id="am-annual-hint">Leave blank to use the formula.</span></div>
                <div class="fld"><label for="am-notes">Billing notes</label><textarea class="in" id="am-notes" name="billingNotes" placeholder="e.g. Invoice on the 1st, 14-day terms">${esc(draft.billingNotes)}</textarea></div>
                <div id="am-preview"></div>
                <div class="fld"><label for="am-reason">Reason <span id="am-reason-req" class="req"></span></label><textarea class="in" id="am-reason" name="reason" placeholder="Saved to the customer's history">${esc(draft.reason)}</textarea>
                    <span class="hint">Required when the price or features differ from the list price, and for every change to an existing agreement.</span></div>
            </div>
            <div><div class="sec-title">Features</div><div id="am-features"></div></div></div>
        </div>
        <div class="modal-f"><button type="button" class="btn" data-act="close-modal">Cancel</button><button type="submit" class="btn btn-p">${mode === 'create' ? 'Create customer account' : 'Save agreement'}</button></div></form>`, 'lg');
    syncAgreementModal(true);
}
function draftTrialEnd() {
    if (draft.mode === 'create') return addDays(state.today, num(draft.trialDays));
    const c = comp(draft.companyId), a = c && c.agreement;
    const start = a && a.trialStart ? a.trialStart : state.today;
    return addDays(start, num(draft.trialDays));
}
const isTrialDraft = () => draft.mode === 'create' ? draft.start === 'Trial' : draft.status === 'Trial';
function needsReason() {
    if (draft.mode !== 'create') return true;
    const list = LIST_RATE[draft.plan];
    return (draft.model !== 'Custom' && list && num(draft.rate) !== list) || num(draft.annualAmount) > 0 && draft.model === 'AnnualLicence' ||
        num(draft.minMonthly) !== num(state.settings.minMonthly) || pruneOverrides(draft.overrides, draft.plan).length > 0;
}
function syncAgreementModal(first) {
    const form = $('#am-form'); if (!form) return;
    if (!first) {
        const fd = new FormData(form);
        ['companyName', 'firstName', 'lastName', 'email', 'phone', 'country', 'timeZone', 'plan', 'start', 'status', 'trialDays', 'model', 'rate', 'minMonthly', 'includedGuards', 'guards', 'annualAmount', 'billingNotes', 'reason']
            .concat(['billName', 'billEmail', 'billAbn']).forEach(k => { if (fd.has(k)) draft[k] = String(fd.get(k)); });
        if (form.billGst) {                                                  // checkbox: absent from FormData when off
            draft.billGst = form.billGst.checked;
            if (form.country && form.country.value !== draft.prevCountry) {   // country changed: re-default the GST tick
                draft.prevCountry = form.country.value; draft.billGst = form.country.value === 'Australia'; form.billGst.checked = draft.billGst;
            }
        }
    }
    if (draft.plan !== draft.prevPlan) {                                      // plan changed: re-base the defaults
        const oldList = LIST_RATE[draft.prevPlan];
        if (!draft.rate || num(draft.rate) === oldList) draft.rate = LIST_RATE[draft.plan] || '';
        if (PLAN_RANK[draft.plan] >= 3 && draft.model === 'PerGuard' && !draft.rate) draft.model = 'Custom';
        if (PLAN_RANK[draft.plan] < 3 && draft.model === 'Custom') draft.model = 'PerGuard';
        form.rate.value = draft.rate; form.model.value = draft.model;
        draft.prevPlan = draft.plan;
        renderFeaturePanel();
    }
    const m = draft.model;
    const show = { trial: isTrialDraft(), rate: m !== 'Custom', band: m === 'AnnualLicence', guards: m !== 'AnnualLicence', annual: m !== 'PerGuard' };
    $$('[data-show]', form).forEach(el => { el.hidden = !show[el.dataset.show]; });
    $('#am-annual-label').textContent = m === 'Custom' ? 'Agreed annual amount ($)' : 'Negotiated annual amount ($, optional)';
    $('#am-annual-hint').textContent = m === 'Custom' ? 'Required for a custom agreement.' : 'Overrides the formula. Needs a reason.';
    const list = LIST_RATE[draft.plan];
    $('#am-rate-hint').textContent = list ? `List price ${money(list)}${num(draft.rate) && num(draft.rate) !== list ? ` · ${num(draft.rate) < list ? 'below' : 'above'} list` : ''}` : 'No list price: agree one with the customer';
    $('#am-trial-hint').textContent = show.trial ? `Ends ${fmtDate(draftTrialEnd())} (last day ${fmtDate(addDays(draftTrialEnd(), -1))})` : '';
    $('#am-reason-req').textContent = needsReason() ? '*' : '';
    renderPreview();
    if (first) renderFeaturePanel();
}
function renderPreview() {
    const p = calcPrice({ model: draft.model, rate: draft.rate, minMonthly: draft.minMonthly, guards: draft.guards, includedGuards: draft.includedGuards, annualAmount: draft.annualAmount }, state.settings.annualMonths);
    const list = LIST_RATE[draft.plan];
    let listCmp = '';
    if (list && draft.model !== 'Custom' && (num(draft.rate) !== list || p.overridden)) {
        const lp = calcPrice({ model: draft.model, rate: list, minMonthly: state.settings.minMonthly, guards: draft.guards, includedGuards: draft.includedGuards }, state.settings.annualMonths);
        const diff = lp.annual ? Math.round((p.annual - lp.annual) / lp.annual * 100) : 0;
        listCmp = `<dt>At list price</dt><dd>${money(lp.annual)} / year (${diff > 0 ? '+' : ''}${diff}%)</dd>`;
    }
    const main = p.prepaid || p.overridden ? `${money(p.annual)} <span>/ year${p.custom ? '' : ', prepaid'}</span>` : `${money(p.listMonthly)} <span>/ month</span>`;
    $('#am-preview').innerHTML = `<div class="pv"><div class="sub" style="margin:0 0 2px">Price preview</div><div class="pv-main">${main}</div>
        <dl class="pv-rows">
            ${p.prepaid || p.overridden ? `<dt>Per month</dt><dd>≈ ${money(p.annual / 12)}</dd>` : `<dt>Per year</dt><dd>${money(p.listMonthly * 12)}</dd>`}
            <dt>Guards</dt><dd>${p.guards || '—'}${draft.model === 'AnnualLicence' ? ' (licence)' : ' (expected)'}</dd>
            <dt>Effective</dt><dd>${p.perGuard ? money(p.perGuard, true) + ' per guard / month' : '—'}</dd>
            ${listCmp}
        </dl>
        <div class="pv-tags">${p.minApplied ? pill(`Minimum ${money(draft.minMonthly)}/month applies`, 'p-blue') : ''}${p.prepaid && !p.custom && !p.overridden ? pill(`Pay ${state.settings.annualMonths} months, get 12`, 'p-green') : ''}${p.overridden && !p.custom ? pill('Negotiated amount', 'p-violet') : ''}</div></div>`;
}
function renderFeaturePanel() {
    const el = $('#am-features'); if (!el) return;
    const plan = draft.plan, trial = isTrialDraft();
    let on = 0;
    const rows = CATS.map(cat => `<div class="fp-cat">${esc(cat)}</div>` + FEATURES.filter(f => f.cat === cat).map(f => {
        const def = planDefault(f.key, plan);
        const o = draft.overrides.find(x => x.key === f.key);
        const oLive = o && o.granted !== def;
        const expired = oLive && o.expiresAt && o.expiresAt < state.today;
        const enabled = f.soon ? false : f.min === 'Always' ? true : (oLive && !expired ? o.granted : def);
        if (enabled) on++;
        let badge;
        if (f.soon) badge = pill('Coming soon', 'p-grey');
        else if (f.min === 'Always') badge = pill('Always on', 'p-slate');
        else if (oLive) badge = expired ? pill('Override expired', 'p-grey') : pill(o.granted ? 'Added' : 'Removed', o.granted ? 'p-green' : 'p-red');
        else badge = pill(def ? 'Plan default' : 'Not in plan', def ? 'p-blue' : 'p-grey');
        const rec = f.recorded ? ` ${pill('Recorded only', 'p-line')}` : '';
        const disabled = f.soon || f.min === 'Always';
        return `<div class="fp-row ${oLive ? 'changed' : ''}">
            <input type="checkbox" id="fp-${f.key}" data-fkey="${f.key}" ${enabled ? 'checked' : ''} ${disabled ? 'disabled' : ''} aria-describedby="fpd-${f.key}">
            <div><label class="fp-name" for="fp-${f.key}">${esc(f.name)}</label><div class="fp-desc" id="fpd-${f.key}">${esc(f.desc)}${f.recorded ? ' ' + esc(f.recorded) : ''}</div></div>
            <div>${badge}${rec}</div>
            ${oLive ? `<div class="fp-until"><label for="fpu-${f.key}">Until</label><input type="date" id="fpu-${f.key}" data-funtil="${f.key}" value="${esc(o.expiresAt || '')}" min="${state.today}">
                ${trial ? `<button type="button" class="link-btn" data-act="fp-trial-end" data-id="${f.key}">until trial end</button>` : ''}<span>${o.expiresAt ? '' : 'no expiry'}</span></div>` : ''}
        </div>`;
    }).join('')).join('');
    const changed = pruneOverrides(draft.overrides, plan).length;
    el.innerHTML = `<div class="fp-head"><span class="fp-count">${on} of ${SELLABLE.length} features on</span>
        <span>${changed ? `${pill(plural(changed, 'override'), 'p-violet')} <button type="button" class="link-btn" data-act="fp-reset">Reset to plan defaults</button>` : '<span class="sub">Plan defaults</span>'}</span></div>
        <p class="hint">Tick or untick to add or remove a feature for this customer only. ${trial ? 'During a trial you can add features until the trial ends to demo them.' : ''}</p>
        <div class="fp-scroll">${rows}</div>`;
    $('#am-reason-req').textContent = needsReason() ? '*' : '';
}
function featureToggle(key, checked) {
    const def = planDefault(key, draft.plan);
    draft.overrides = draft.overrides.filter(o => o.key !== key);
    if (checked !== def) draft.overrides.push({ key, granted: checked, expiresAt: '', reason: '' });
    renderFeaturePanel();
    const box = $('#fp-' + key); if (box) box.focus();
}
function overrideDetail(list, plan) {
    return pruneOverrides(list, plan).map(o => `${o.granted ? 'Added' : 'Removed'} ${BY_KEY[o.key].name}${o.expiresAt ? ` (until ${fmtDate(o.expiresAt)})` : ''}`);
}
function submitAgreement() {
    syncAgreementModal();
    const d = draft, errs = [];
    if (d.mode === 'create') {
        if (!d.companyName.trim()) errs.push('Enter the company name.');
        if (!d.firstName.trim() || !d.lastName.trim()) errs.push("Enter the admin's first and last name.");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) errs.push('Enter a valid admin email.');
        else if (state.companies.some(c => c.adminEmail.toLowerCase() === d.email.trim().toLowerCase())) errs.push('That email is already an admin login for another company.');
        if (d.billEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.billEmail.trim())) errs.push('Enter a valid billing email, or leave it blank to use the admin email.');
    }
    if (d.model !== 'Custom' && !(num(d.rate) > 0)) errs.push('Enter the agreed rate per guard.');
    if (d.model === 'AnnualLicence' && !(num(d.includedGuards) > 0)) errs.push('Enter how many guards the licence covers.');
    if (d.model === 'Custom' && !(num(d.annualAmount) > 0)) errs.push('Enter the agreed annual amount for a custom agreement.');
    if (isTrialDraft() && !(num(d.trialDays) > 0)) errs.push('Enter the trial length.');
    if (needsReason() && !d.reason.trim()) errs.push('Add a reason: it is saved to the customer history.');
    if (errs.length) { $('#am-errors').innerHTML = `<div class="errors"><ul>${errs.map(e => `<li>${esc(e)}</li>`).join('')}</ul></div>`; $('#am-errors').scrollIntoView({ block: 'nearest' }); return; }

    const trial = isTrialDraft();
    const prepaid = d.model !== 'PerGuard';
    const terms = {
        plan: d.plan, model: d.model, rate: d.model === 'Custom' ? null : num(d.rate), minMonthly: num(d.minMonthly),
        term: prepaid ? 'AnnualPrepaid' : 'Monthly', includedGuards: d.model === 'AnnualLicence' ? num(d.includedGuards) : null,
        annualAmount: prepaid && num(d.annualAmount) > 0 ? num(d.annualAmount) : null, billingNotes: d.billingNotes.trim(),
    };
    const ovs = pruneOverrides(d.overrides, d.plan).map(o => Object.assign({}, o, { reason: o.reason || d.reason.trim() }));
    let c;
    if (d.mode === 'create') {
        c = companyDefaults({ id: nid('c'), name: d.companyName.trim(), adminName: `${d.firstName.trim()} ${d.lastName.trim()}`, adminEmail: d.email.trim(), phone: d.phone.trim(),
            country: d.country, timeZone: d.timeZone, createdAt: state.today, activated: false });
        c.agreement = agreementDefaults(Object.assign({}, terms, {
            status: trial ? 'Trial' : 'Active', trialStart: trial ? state.today : null, trialDays: trial ? num(d.trialDays) : null,
            trialEnd: trial ? addDays(state.today, num(d.trialDays)) : null, subscribedAt: trial ? null : state.today,
            renewalDate: !trial && prepaid ? addDays(state.today, 365) : null, inquiryId: d.inquiryId,
        }));
        c.overrides = ovs;
        c.billing = { legalName: d.billName.trim() || c.name, email: d.billEmail.trim() || c.adminEmail, abn: d.billAbn.trim(), address: '', chargeGst: d.billGst, ref: '', xeroContactId: null };
        const q = d.inquiryId && inq(d.inquiryId);
        const detail = [`${trial ? `Trial ${c.agreement.trialDays} days` : 'Paid subscription'} · ${d.plan} · ${priceLine(c)}`, ...overrideDetail(ovs, d.plan)].join('; ');
        hist(c, 'Created', detail, d.reason.trim() || (q ? `Created from inquiry (${q.companyName})` : 'Created by SuperAdmin'));
        state.companies.unshift(c);
        if (q) { q.status = trial ? 'TrialActive' : 'Won'; q.convertedCompanyId = c.id; }
        emailActivation(c);
        if (trial) emailTrialReady(c); else emailAccountReady(c);
        let invMsg = '';
        if (!trial && prepaid) {          // paid and prepaid from day one: the first invoice is a Draft in Xero straight away
            const inv = newInvoice(c, 'Initial', 'initial', `12 months from ${fmtDate(state.today)}`, prepaidLines(c, state.today));
            const r = createInXero(inv);
            invMsg = r.ok ? ` Draft invoice ${inv.xero.number} created in Xero.` : ` Invoice is waiting, not in Xero yet: ${r.why}`;
        } else if (!trial) invMsg = ` The first invoice is created on ${fmtDate(nextBillingDay())}, after the month ends.`;
        toast(`${c.name} created. Activation and "${trial ? 'trial ready' : 'account ready'}" emails sent.${invMsg}`);
    } else {
        c = comp(d.companyId);
        const old = c.agreement ? clone(c.agreement) : null, oldOv = clone(c.overrides);
        const a = c.agreement || agreementDefaults({ inquiryId: d.inquiryId });
        Object.assign(a, terms);
        const newStatus = d.status;
        if (newStatus === 'Trial') {
            if (!a.trialStart) a.trialStart = state.today;
            a.trialDays = num(d.trialDays); a.trialEnd = addDays(a.trialStart, a.trialDays);
            if (a.trialEnd > state.today) { a.day3Sent = false; a.day1Sent = false; a.endedNotified = false; }
        }
        if (newStatus === 'Active' && (!old || old.status !== 'Active') && !a.subscribedAt) a.subscribedAt = state.today;
        if (newStatus === 'Active' && prepaid && !a.renewalDate) a.renewalDate = addDays(a.subscribedAt || state.today, 365);
        if (!prepaid) a.renewalDate = null;
        a.status = newStatus;
        c.agreement = a; c.overrides = ovs;
        const lines = agreementDiff(old, a, oldOv, ovs, c);
        hist(c, d.mode === 'attach' ? 'Agreement attached' : 'Agreement updated', lines.join('; ') || 'No changes', d.reason.trim());
        const q = a.inquiryId && inq(a.inquiryId);
        if (q && newStatus === 'Active') q.status = 'Won';
        toast(`${c.name} saved.`);
    }
    save(); closeModal();
    location.hash = '#/sa/customers?open=' + c.id;
    render();
}
function agreementDiff(o, n, oldOv, newOv, c) {
    const out = [];
    if (!o) out.push(`Agreement attached: ${n.plan}, ${AG_STATUS[n.status]}, ${priceLine(c)}`);
    else {
        if (o.plan !== n.plan) out.push(`Plan ${o.plan} → ${n.plan}`);
        if (o.status !== n.status) out.push(`Status ${AG_STATUS[o.status]} → ${AG_STATUS[n.status]}`);
        if (o.model !== n.model) out.push(`Pricing ${MODEL[o.model]} → ${MODEL[n.model]}`);
        if (num(o.rate) !== num(n.rate)) out.push(`Rate ${money(o.rate)} → ${money(n.rate)} per guard`);
        if (num(o.minMonthly) !== num(n.minMonthly)) out.push(`Minimum ${money(o.minMonthly)} → ${money(n.minMonthly)}`);
        if (num(o.includedGuards) !== num(n.includedGuards)) out.push(`Licence ${o.includedGuards || '—'} → ${n.includedGuards || '—'} guards`);
        if (num(o.annualAmount) !== num(n.annualAmount)) out.push(`Annual amount ${o.annualAmount ? money(o.annualAmount) : 'formula'} → ${n.annualAmount ? money(n.annualAmount) : 'formula'}`);
        if (num(o.trialDays) !== num(n.trialDays) && n.status === 'Trial') out.push(`Trial ${o.trialDays} → ${n.trialDays} days (ends ${fmtDate(n.trialEnd)})`);
    }
    const key = o2 => `${o2.granted}|${o2.expiresAt || ''}`;
    const keys = new Set([...oldOv, ...newOv].map(x => x.key));
    keys.forEach(k => {
        const a = oldOv.find(x => x.key === k), b = newOv.find(x => x.key === k), name = BY_KEY[k].name;
        if (a && !b) out.push(`Override removed: ${name}`);
        else if (b && (!a || key(a) !== key(b))) out.push(`${b.granted ? 'Added' : 'Removed'} ${name}${b.expiresAt ? ` (until ${fmtDate(b.expiresAt)})` : ''}`);
    });
    return out;
}

/* ================= quick actions ================= */
function quickModal(title, body, submitLabel, cls, onSubmit) {
    showModal(`<div class="modal-h"><h3>${esc(title)}</h3><button class="x" data-act="close-modal" aria-label="Close">×</button></div>
        <form id="qm-form" data-form="quick" novalidate><div class="modal-b"><div id="qm-errors"></div>${body}</div>
        <div class="modal-f"><button type="button" class="btn" data-act="close-modal">Cancel</button><button type="submit" class="btn ${cls || 'btn-p'}">${esc(submitLabel)}</button></div></form>`);
    quickSubmit = onSubmit;
}
let quickSubmit = null;
const reasonField = (placeholder) => `<div class="fld"><label for="qm-reason">Reason <span class="req">*</span></label><textarea class="in" id="qm-reason" name="reason" placeholder="${esc(placeholder || 'Saved to the customer history')}"></textarea></div>`;
function requireReason(fd) {
    const r = String(fd.get('reason') || '').trim();
    if (!r) { $('#qm-errors').innerHTML = '<div class="errors">Add a reason: it is saved to the customer history.</div>'; return null; }
    return r;
}
function actExtend(id) {
    const c = comp(id), a = c.agreement;
    quickModal(`Extend trial — ${c.name}`, `<p>Current trial: ${a.trialDays} days, ends ${fmtDate(a.trialEnd)}${a.status === 'TrialEnded' ? ' (already ended)' : ''}.</p>
        <div class="fld"><span class="lbl">Add</span><div class="radios"><label><input type="radio" name="days" value="7" checked>7 days</label><label><input type="radio" name="days" value="14">14 days</label><label><input type="radio" name="days" value="custom">Other</label></div></div>
        <div class="fld"><label for="qm-days">Other number of days</label><input class="in" id="qm-days" name="customDays" type="number" min="1" placeholder="e.g. 10"></div>
        ${reasonField('e.g. Waiting on their payroll officer to come back from leave')}`, 'Extend trial', 'btn-p', fd => {
        const reason = requireReason(fd); if (!reason) return false;
        const add = fd.get('days') === 'custom' ? num(fd.get('customDays')) : num(fd.get('days'));
        if (!(add > 0)) { $('#qm-errors').innerHTML = '<div class="errors">Enter the number of days.</div>'; return false; }
        const oldEnd = a.trialEnd, wasEnded = a.status === 'TrialEnded';
        // extending an ended trial restarts the clock from today so it isn't still in the past
        const base = wasEnded && a.trialEnd <= state.today ? state.today : a.trialEnd;
        a.trialEnd = addDays(base, add); a.trialDays = diffDays(a.trialEnd, a.trialStart);
        a.status = 'Trial'; a.day3Sent = false; a.day1Sent = false; a.endedNotified = false;
        hist(c, 'Trial extended', `+${add} days · ends ${fmtDate(oldEnd)} → ${fmtDate(a.trialEnd)}${wasEnded ? ' · Trial ended → Trial' : ''}`, reason);
        toast(`Trial for ${c.name} now ends ${fmtDate(a.trialEnd)}.`);
    });
}
function actConvert(id) {
    const c = comp(id), a = c.agreement, prepaid = a.model !== 'PerGuard', b = billOf(c);
    let invBlock;
    if (prepaid) {
        const t = calcInvoice(prepaidLines(c, state.today), b.chargeGst, bset().gstRate);
        invBlock = `<div class="fld"><span class="lbl">First invoice: ${money(t.subtotal, true)}${b.chargeGst ? ` + GST ${money(t.gst, true)} = ${money(t.total, true)}` : ' (no GST)'}</span>
            <div class="radios"><label><input type="radio" name="inv" value="xero" checked>Create the draft in Xero now</label><label><input type="radio" name="inv" value="queue">Add to the billing queue only</label><label><input type="radio" name="inv" value="none">Don't invoice yet</label></div>
            <span class="hint">You approve and send it in Xero. Payment terms ${bset().terms} days.</span></div>`;
    } else invBlock = `<div class="info">Per-guard customers are billed after the month ends. Their first invoice is created on <b>${fmtDate(nextBillingDay())}</b> for the guards scheduled until then.</div>`;
    quickModal(`Convert to paid — ${c.name}`, `<p>${esc(a.plan)} · ${esc(priceLine(c))}. Starts today, ${fmtDate(state.today)}. To change the price, or switch to an annual licence, use <b>Edit agreement</b> first.</p>${invBlock}${reasonField('e.g. Agreed on the call, invoice from 1 Nov')}`, 'Convert to paid', 'btn-p', fd => {
        const reason = requireReason(fd); if (!reason) return false;
        const old = AG_STATUS[a.status], choice = prepaid ? String(fd.get('inv') || 'xero') : 'none';
        a.status = 'Active'; a.subscribedAt = state.today;
        a.renewalDate = prepaid ? addDays(state.today, 365) : null;
        hist(c, 'Converted to paid', `Status ${old} → Active · ${priceLine(c)}`, reason);
        const q = a.inquiryId && inq(a.inquiryId); if (q) q.status = 'Won';
        let msg = '';
        if (choice !== 'none') {
            const inv = invFor(c, 'Initial', 'initial') || newInvoice(c, 'Initial', 'initial', `12 months from ${fmtDate(state.today)}`, prepaidLines(c, state.today));
            if (choice === 'xero') { const r = createInXero(inv); msg = r.ok ? ` Draft invoice ${inv.xero.number} created in Xero.` : ` Invoice is waiting, not in Xero yet: ${r.why}`; }
            else msg = ' Invoice added to the billing queue.';
        }
        toast(`${c.name} is now a paying customer.${msg}`);
    });
}
function actStatus(id, status) {
    const c = comp(id), a = c.agreement;
    const verb = { Suspended: 'Suspend', Cancelled: 'Cancel', Active: 'Reactivate' }[status];
    quickModal(`${verb} — ${c.name}`, `<div class="info">In this version these are <b>tracking labels only</b>. ${c.name} can still log in, and the mobile app is never locked.</div>${reasonField()}`, verb, status === 'Active' ? 'btn-p' : 'btn-danger', fd => {
        const reason = requireReason(fd); if (!reason) return false;
        const old = AG_STATUS[a.status];
        a.status = status;
        if (status === 'Active' && !a.subscribedAt) a.subscribedAt = state.today;
        hist(c, status === 'Active' ? 'Reactivated' : verb === 'Suspend' ? 'Suspended' : 'Cancelled', `Status ${old} → ${AG_STATUS[status]}`, reason);
        toast(`${c.name}: ${AG_STATUS[status]}.`);
    });
}
function actResend(id) {
    const c = comp(id);
    quickModal(`Resend activation — ${c.name}`, `<p>Send a new activation link to <b>${esc(c.adminEmail)}</b>? ${c.activated ? 'They have already activated, so this lets them reset their password.' : 'They have not activated yet.'}</p>`, 'Resend', 'btn-p', () => {
        emailActivation(c, true); hist(c, 'Activation email resent', `To ${c.adminEmail}`, '');
        toast(`Activation email resent to ${c.adminEmail}.`);
    });
}

/* ================= views: SuperAdmin › Billing ================= */
const BILL_FILTERS = [['All', 'All'], ['Action', 'To action'], ['Queued', 'Not in Xero'], ['Draft', 'Draft in Xero'], ['Awaiting', 'Awaiting payment'], ['Overdue', 'Overdue'], ['Paid', 'Paid'], ['Void', 'Voided']];
const matchInv = (i, k) => k === 'All' || (k === 'Action' ? ['Queued', 'Draft'].includes(i.status) : invState(i) === k);
function viewBilling() {
    const list = state.invoices, sum = arr => arr.reduce((t, i) => t + invTotals(i).total, 0), by = k => list.filter(i => invState(i) === k);
    const month = state.today.slice(0, 7);
    const paidMonth = by('Paid').filter(i => i.xero && i.xero.paidAt && i.xero.paidAt.slice(0, 7) === month);
    const action = list.filter(i => ['Queued', 'Draft'].includes(i.status)), od = by('Overdue'), aw = by('Awaiting');
    return saChrome('billing') + `<div class="page">
        <div class="page-head">
            <div><div class="eyebrow">SuperAdmin</div><h1>Billing</h1><p>The app works out the amount and creates a Draft in Xero. You approve and send it there; the app reads the status back every night. Nothing here ever locks a customer.</p></div>
            <div class="head-tools">${bset().xeroOk ? pill('Xero connected', 'p-green') : pill('Xero disconnected', 'p-red')}<span class="sub" style="margin:0">${esc(bset().xeroOrg)}</span></div>
        </div>
        ${bset().xeroOk ? '' : '<div class="warn-box"><b>Xero needs reconnecting.</b> New invoices wait as "Not in Xero" with a reason and are retried every night. Nothing is lost. (Prototype: untick it in Settings.)</div>'}
        <div class="kpis">
            <button class="kpi teal" data-act="bill-filter" data-id="Action"><div class="n">${action.length}</div><div class="l">To review or send in Xero</div></button>
            <button class="kpi" data-act="bill-filter" data-id="Awaiting"><div class="n">${money(sum(aw), true)}</div><div class="l">Awaiting payment · ${plural(aw.length, 'invoice')}</div></button>
            <button class="kpi orange" data-act="bill-filter" data-id="Overdue"><div class="n">${money(sum(od), true)}</div><div class="l">Overdue · ${plural(od.length, 'invoice')}</div></button>
            <div class="kpi green" style="cursor:default"><div class="n">${money(sum(paidMonth), true)}</div><div class="l">Paid this month · ${plural(paidMonth.length, 'invoice')}</div></div>
        </div>
        <div class="chips">${BILL_FILTERS.map(([k, l]) => `<button class="chip ${ui.billFilter === k ? 'on' : ''}" data-act="bill-filter" data-id="${k}">${l}<b>${list.filter(i => matchInv(i, k)).length}</b></button>`).join('')}</div>
        <div class="box"><div class="tbl-wrap"><table class="tbl">
            <thead><tr><th>Customer</th><th>Invoice</th><th>Issued</th><th>Due</th><th>Total</th><th>Status</th><th></th></tr></thead>
            <tbody>${billRows()}</tbody>
        </table></div></div>
    </div>`;
}
function billRows() {
    const rows = state.invoices.filter(i => matchInv(i, ui.billFilter))
        .sort((a, b) => (a.issueDate < b.issueDate ? 1 : a.issueDate > b.issueDate ? -1 : b.id.localeCompare(a.id, undefined, { numeric: true })));
    if (!rows.length) return '<tr><td colspan="7" class="empty">No invoices here. They are made when you convert a prepaid customer, on the billing day for per-guard customers, and ahead of each renewal.</td></tr>';
    return rows.map(i => {
        const c = comp(i.companyId), t = invTotals(i), k = invState(i), [l, cls] = INV_ST[k];
        return `<tr class="click" data-act="open-inv" data-id="${i.id}" tabindex="0">
            <td><b>${esc(c.name)}</b></td>
            <td>${esc(invLabel(i))}<div class="sub">${i.xero ? esc(i.xero.number) + ' in Xero' : 'Not created in Xero yet'}${i.blocked ? ` · <span class="warn-text">${esc(i.blocked)}</span>` : ''}</div></td>
            <td class="nowrap">${fmtDate(i.issueDate)}</td>
            <td class="nowrap">${fmtDate(i.dueDate)}${k === 'Overdue' ? `<div class="sub warn">${plural(diffDays(state.today, i.dueDate), 'day')} overdue</div>` : ''}</td>
            <td class="nowrap"><b class="mono">${money(t.total, true)}</b><div class="sub">${i.chargeGst ? 'incl. GST ' + money(t.gst, true) : 'no GST'}</div></td>
            <td>${pill(l, cls)}</td><td><button class="btn btn-sm" data-act="open-inv" data-id="${i.id}">Open</button></td></tr>`;
    }).join('');
}
function openInvoiceDrawer(id) {
    const i = invById(id); if (!i) return;
    const c = comp(i.companyId), b = billOf(c), t = invTotals(i), k = invState(i), [l, cls] = INV_ST[k], x = i.xero;
    const btn = (act, label, cl) => `<button class="btn btn-sm ${cl || ''}" data-act="${act}" data-id="${i.id}">${label}</button>`;
    const stale = i.status === 'Queued' && i.kind !== 'Manual' && c.agreement && i.sig !== agSig(c.agreement);
    const behind = x && XSTATUS[x.status] !== i.status;
    const actions = [
        i.status === 'Queued' ? btn('inv-create', 'Create draft in Xero', 'btn-p') : '',
        i.status === 'Queued' ? btn('inv-edit', 'Edit lines') : '',
        stale ? btn('inv-refresh', 'Refresh from agreement', 'btn-warn') : '',
        i.status === 'Queued' ? btn('inv-cancel', 'Cancel', 'btn-danger') : '',
        x ? btn('inv-open-xero', 'Open in Xero') : '',
        x && !['Paid', 'Void'].includes(i.status) ? btn('inv-sync', 'Sync from Xero', behind ? 'btn-p' : '') : '',
    ].filter(Boolean);
    showDrawer(`<div class="drawer-h"><div><div class="sub" style="color:#c7d4ff">${esc(INV_KIND[i.kind])} · ${esc(i.periodLabel)}</div><h3>${esc(c.name)}</h3><div style="margin-top:6px">${pill(l, cls)} <span class="sub" style="color:#c7d4ff">${x ? esc(x.number) + ' in Xero' : 'Not in Xero yet'}</span></div></div><button class="x" data-act="close-drawer" aria-label="Close">×</button></div>
        <div class="drawer-b">
            ${i.blocked ? `<div class="warn-box"><b>Waiting: ${esc(i.blocked)}</b><br>${i.blocked.startsWith('Missing') ? `Add it in <a href="#/sa/customers?open=${c.id}">the customer's billing details</a>, then press Create draft in Xero. It is also retried each night.` : 'Reconnect Xero (Settings). It is retried each night, so nothing is lost.'}</div>` : ''}
            ${stale ? '<div class="info">The agreement price changed after this was created. Refresh to rebuild the lines from the current agreement.</div>' : ''}
            ${behind ? `<div class="info">Xero now shows this as <b>${esc(XERO_TEXT[x.status])}</b>. Press <b>Sync from Xero</b> (it also runs every night).</div>` : ''}
            <div class="btn-row" style="margin-bottom:16px">${actions.join('')}</div>
            <div class="sec-title">Invoice</div>
            <div class="tbl-wrap"><table class="tbl inv-lines"><thead><tr><th>Description</th><th class="num">Qty</th><th class="num">Price</th><th class="num">Amount</th></tr></thead><tbody>
                ${i.lines.map(ln => `<tr><td>${esc(ln.desc)}</td><td class="num mono">${esc(ln.qty)}</td><td class="num mono">${money(ln.unit, true)}</td><td class="num mono">${money(round2(num(ln.qty) * num(ln.unit)), true)}</td></tr>`).join('')}
            </tbody></table></div>
            <div class="inv-tot"><div><span>Subtotal</span><span class="mono">${money(t.subtotal, true)}</span></div>
                <div><span>${i.chargeGst ? `GST ${esc(i.gstRate)}%` : 'GST'}</span><span class="mono">${i.chargeGst ? money(t.gst, true) : 'not charged'}</span></div>
                <div class="grand"><span>Total (AUD)</span><span class="mono">${money(t.total, true)}</span></div></div>
            <dl class="dl"><dt>Bill to</dt><dd>${esc(b.legalName)}</dd><dt>Billing email</dt><dd>${esc(b.email)}</dd><dt>ABN</dt><dd>${b.abn ? esc(b.abn) : '—'}</dd>
                <dt>Issued</dt><dd>${fmtDate(i.issueDate)}</dd><dt>Due</dt><dd>${fmtDate(i.dueDate)} · ${bset().terms} day terms${k === 'Overdue' ? ` · <span class="warn-text">${plural(diffDays(state.today, i.dueDate), 'day')} overdue</span>` : ''}</dd></dl>
            <div class="sec-title">In Xero</div>
            ${x ? `<dl class="dl"><dt>Xero number</dt><dd>${esc(x.number)}</dd><dt>Status in Xero</dt><dd>${esc(XERO_TEXT[x.status])}</dd>
                <dt>Our app last saw</dt><dd>${esc(INV_ST[i.status][0])} · ${esc(fmtStamp(i.syncedAt))}</dd>${x.sentAt ? `<dt>Sent from Xero</dt><dd>${fmtDate(x.sentAt)}</dd>` : ''}${x.paidAt ? `<dt>Paid</dt><dd>${fmtDate(x.paidAt)}</dd>` : ''}</dl>`
                : '<p class="muted">Not created in Xero yet. <b>Create draft in Xero</b> pushes it as a Draft; you approve and send it there.</p>'}
            ${x && ['DRAFT', 'AUTHORISED'].includes(x.status) ? `<div class="proto-note"><b class="tag">PROTOTYPE</b>Act as Xero. In the real product these happen inside Xero, not here.
                <div class="btn-row" style="margin-top:8px">${x.status === 'DRAFT' ? btn('xero-approve', 'Approve and email to client') : btn('xero-pay', 'Record payment')}${btn('xero-void', 'Void in Xero', 'btn-danger')}</div></div>` : ''}
        </div>`);
}
function billingSection(c, btn) {   // the "Billing" block inside the customer drawer
    const b = billOf(c), invs = state.invoices.filter(i => i.companyId === c.id).sort((x, y) => (x.issueDate < y.issueDate ? 1 : -1));
    return `<div class="sec-title">Billing</div>
        <dl class="dl"><dt>Bill to</dt><dd>${esc(b.legalName)}</dd><dt>Billing email</dt><dd>${esc(b.email)}</dd>
            <dt>ABN</dt><dd>${b.abn ? esc(b.abn) : '<span class="warn-text">Not recorded</span>'}</dd>
            <dt>GST</dt><dd>${b.chargeGst ? `Charged at ${esc(bset().gstRate)}%` : 'Not charged'}</dd>
            <dt>Xero contact</dt><dd>${b.xeroContactId ? esc(b.xeroContactId) + ' (linked)' : 'Created with the first invoice'}</dd></dl>
        <div class="btn-row" style="margin-bottom:10px">${btn('bill-edit', 'Edit billing details')}${btn('inv-add', 'Add invoice')}</div>
        ${invs.length ? `<ul class="mini-list" style="margin-bottom:16px">${invs.map(i => { const [l, cls] = INV_ST[invState(i)]; return `<li><span><a href="#/sa/billing?open=${i.id}">${esc(invLabel(i))}</a></span><span>${money(invTotals(i).total, true)} ${pill(l, cls)}</span></li>`; }).join('')}</ul>` : '<p class="muted" style="margin-bottom:16px">No invoices yet.</p>'}`;
}

/* ---- billing modals ---- */
function actBilling(id) {
    const c = comp(id), b = billOf(c);
    quickModal(`Billing details — ${c.name}`, `<p class="hint" style="margin-top:0">These go on the Xero contact and the invoice. Invoices not yet in Xero pick up a changed GST setting.</p>
        <div class="fld"><label for="bd-name">Billing name <span class="req">*</span></label><input class="in" id="bd-name" name="legalName" value="${esc(b.legalName)}"></div>
        <div class="grid2"><div class="fld"><label for="bd-email">Billing email <span class="req">*</span></label><input class="in" id="bd-email" name="email" type="email" value="${esc(b.email)}"></div>
            <div class="fld"><label for="bd-abn">ABN</label><input class="in" id="bd-abn" name="abn" value="${esc(b.abn)}" placeholder="Needed on invoices of $1,000 or more"></div></div>
        <div class="fld"><label for="bd-addr">Address</label><textarea class="in" id="bd-addr" name="address">${esc(b.address)}</textarea></div>
        <div class="grid2"><div class="fld"><label for="bd-ref">PO / reference</label><input class="in" id="bd-ref" name="ref" value="${esc(b.ref)}"></div>
            <div class="fld"><span class="lbl">GST</span><label class="check"><input type="checkbox" name="chargeGst" ${b.chargeGst ? 'checked' : ''}>Charge GST (${esc(bset().gstRate)}%)</label></div></div>`, 'Save', 'btn-p', fd => {
        const legalName = String(fd.get('legalName') || '').trim(), email = String(fd.get('email') || '').trim();
        if (!legalName) { $('#qm-errors').innerHTML = '<div class="errors">Enter the billing name.</div>'; return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { $('#qm-errors').innerHTML = '<div class="errors">Enter a valid billing email.</div>'; return false; }
        Object.assign(b, { legalName, email, abn: String(fd.get('abn') || '').trim(), address: String(fd.get('address') || '').trim(), ref: String(fd.get('ref') || '').trim(), chargeGst: fd.has('chargeGst') });
        state.invoices.filter(i => i.companyId === c.id && i.status === 'Queued').forEach(i => { i.chargeGst = b.chargeGst; i.blocked = ''; });
        hist(c, 'Billing details updated', `${legalName} · ${email}${b.abn ? ' · ABN ' + b.abn : ''} · GST ${b.chargeGst ? 'charged' : 'not charged'}`, '');
        toast('Billing details saved.');
    });
}
let lineDraft = null;
function openLinesModal(invId, companyId) {
    const inv = invId && invById(invId), c = comp(inv ? inv.companyId : companyId);
    lineDraft = { invId: inv ? inv.id : null, companyId: c.id, lines: inv ? clone(inv.lines) : [{ desc: '', qty: 1, unit: 0 }],
        issueDate: inv ? inv.issueDate : state.today, dueDate: inv ? inv.dueDate : addDays(state.today, bset().terms), label: inv ? inv.periodLabel : 'One-off',
        chargeGst: inv ? inv.chargeGst : billOf(c).chargeGst, gstRate: inv ? inv.gstRate : bset().gstRate };
    showModal(`<div class="modal-h"><h3>${inv ? 'Edit invoice lines' : 'Add invoice'} — ${esc(c.name)}</h3><button class="x" data-act="close-modal" aria-label="Close">×</button></div>
        <form id="lines-form" data-form="lines" novalidate><div class="modal-b"><div id="ln-errors"></div>
            <div class="grid2"><div class="fld"><label for="ln-issue">Issue date</label><input class="in" id="ln-issue" name="issueDate" type="date" value="${esc(lineDraft.issueDate)}"></div>
                <div class="fld"><label for="ln-due">Due date</label><input class="in" id="ln-due" name="dueDate" type="date" value="${esc(lineDraft.dueDate)}"></div></div>
            ${inv && inv.kind !== 'Manual' ? '' : `<div class="fld"><label for="ln-label">What is it for?</label><input class="in" id="ln-label" name="label" value="${esc(lineDraft.label)}" placeholder="e.g. Extra guards true-up, October"></div>`}
            <div class="sec-title">Lines (AUD, excluding GST)</div>
            <div id="ln-body"></div>
            <button type="button" class="btn btn-sm" data-act="line-add">+ Add line</button>
            <p class="hint">Use a negative price for a discount. GST is worked out on the total.</p>
            <div id="ln-totals"></div></div>
        <div class="modal-f"><button type="button" class="btn" data-act="close-modal">Cancel</button><button type="submit" class="btn btn-p">Save</button></div></form>`, 'lg');
    renderLines();
}
function renderLines() {
    const d = lineDraft;
    $('#ln-body').innerHTML = `<div class="ln-row head"><span>Description</span><span>Qty</span><span>Price</span><span class="amt">Amount</span><span></span></div>` +
        d.lines.map((l, n) => `<div class="ln-row"><input class="in desc" name="desc-${n}" value="${esc(l.desc)}" aria-label="Description, line ${n + 1}" placeholder="Description">
            <input class="in" name="qty-${n}" type="number" step="any" value="${esc(l.qty)}" aria-label="Quantity, line ${n + 1}"><input class="in" name="unit-${n}" type="number" step="any" value="${esc(l.unit)}" aria-label="Price, line ${n + 1}">
            <span class="amt mono" id="ln-amt-${n}">${money(round2(num(l.qty) * num(l.unit)), true)}</span><button type="button" class="btn btn-sm" data-act="line-del" data-id="${n}" aria-label="Remove line ${n + 1}">×</button></div>`).join('');
    renderLineTotals();
}
function renderLineTotals() {
    const d = lineDraft, t = calcInvoice(d.lines, d.chargeGst, d.gstRate);
    d.lines.forEach((l, n) => { const el = $('#ln-amt-' + n); if (el) el.textContent = money(round2(num(l.qty) * num(l.unit)), true); });
    $('#ln-totals').innerHTML = `<div class="inv-tot"><div><span>Subtotal</span><span class="mono">${money(t.subtotal, true)}</span></div><div><span>${d.chargeGst ? `GST ${esc(d.gstRate)}%` : 'GST'}</span><span class="mono">${d.chargeGst ? money(t.gst, true) : 'not charged'}</span></div><div class="grand"><span>Total (AUD)</span><span class="mono">${money(t.total, true)}</span></div></div>`;
}
function syncLines() {   // copy the inputs into lineDraft without re-rendering (so typing keeps its focus)
    const f = $('#lines-form'); if (!f || !lineDraft) return;
    lineDraft.lines.forEach((l, n) => { l.desc = f.elements['desc-' + n].value; l.qty = f.elements['qty-' + n].value; l.unit = f.elements['unit-' + n].value; });
    lineDraft.issueDate = f.issueDate.value; lineDraft.dueDate = f.dueDate.value;
    if (f.label) lineDraft.label = f.label.value;
}
function saveLines() {
    syncLines();
    const d = lineDraft, errs = [];
    if (!d.lines.length || d.lines.some(l => !l.desc.trim())) errs.push('Every line needs a description.');
    if (d.lines.some(l => !(num(l.qty) !== 0))) errs.push('A quantity cannot be zero.');
    if (!d.issueDate || !d.dueDate) errs.push('Enter an issue date and a due date.');
    else if (d.dueDate < d.issueDate) errs.push('The due date cannot be before the issue date.');
    if (!d.lines.every(l => Number.isFinite(parseFloat(l.qty)) && Number.isFinite(parseFloat(l.unit)))) errs.push('Enter a quantity and a price on every line.');
    if (!errs.length && calcInvoice(d.lines, d.chargeGst, d.gstRate).total <= 0) errs.push('The total must be more than $0. To undo an invoice, cancel it instead.');
    if (errs.length) { $('#ln-errors').innerHTML = `<div class="errors"><ul>${errs.map(e => `<li>${esc(e)}</li>`).join('')}</ul></div>`; return; }
    const lines = d.lines.map(l => ({ desc: l.desc.trim(), qty: num(l.qty), unit: num(l.unit) })), c = comp(d.companyId);    let inv = d.invId && invById(d.invId);
    if (inv) {
        inv.lines = lines; inv.issueDate = d.issueDate; inv.dueDate = d.dueDate; if (inv.kind === 'Manual') inv.periodLabel = d.label.trim() || 'One-off';
        hist(c, 'Invoice edited', `${invLabel(inv)} · lines changed · ${money(invTotals(inv).total, true)}`, '');
        toast('Invoice lines saved.'); save(); closeModal(); render();
    } else {
        inv = newInvoice(c, 'Manual', 'manual-' + (state.nextId + 1), d.label.trim() || 'One-off', lines, d.issueDate); inv.dueDate = d.dueDate;
        hist(c, 'Invoice added', `${invLabel(inv)} · ${money(invTotals(inv).total, true)} · waiting to be created in Xero`, '');
        toast('Invoice added to the billing queue.'); save(); closeModal(); location.hash = '#/sa/billing?open=' + inv.id;
    }
}
function actCancelInv(id) {
    const i = invById(id), c = comp(i.companyId);
    quickModal(`Cancel invoice — ${c.name}`, `<div class="info">${esc(invLabel(i))} was never created in Xero, so nothing is voided there. It is just removed from the queue. An invoice already in Xero is voided in Xero.</div>${reasonField('e.g. Customer paid annually instead')}`, 'Cancel invoice', 'btn-danger', fd => {
        const reason = requireReason(fd); if (!reason) return false;
        i.status = 'Void'; i.blocked = '';
        hist(c, 'Invoice cancelled', `${invLabel(i)} · ${money(invTotals(i).total, true)} · never created in Xero`, reason);
        toast('Invoice cancelled.');
    });
}
function refreshInvoice(id) {
    const i = invById(id), c = comp(i.companyId), b = billOf(c);
    const from = i.periodKey === 'initial' ? i.issueDate : i.periodKey.replace('renewal-', '');
    i.lines = i.kind === 'Monthly' ? usageLines(c, i.periodLabel) : prepaidLines(c, from);
    i.sig = agSig(c.agreement); i.chargeGst = b.chargeGst; i.blocked = '';
    hist(c, 'Invoice refreshed', `${invLabel(i)} rebuilt from the current agreement · ${money(invTotals(i).total, true)}`, '');
    save(); render(); toast('Rebuilt from the current agreement.');
}
function xeroAct(id, what) {   // prototype-only: stands in for someone working inside Xero
    const i = invById(id), x = i.xero, c = comp(i.companyId);
    if (what === 'approve' && x.status === 'DRAFT') { x.status = 'AUTHORISED'; x.sentAt = state.today; emailXeroInvoice(i); toast(`Approved in Xero and emailed to ${billOf(c).email}. Our app sees it at the next sync.`); }
    else if (what === 'pay' && x.status === 'AUTHORISED') { x.status = 'PAID'; x.paidAt = state.today; toast('Payment recorded in Xero. Our app sees it at the next sync.'); }
    else if (what === 'void' && ['DRAFT', 'AUTHORISED'].includes(x.status)) { x.status = 'VOIDED'; toast('Voided in Xero. Our app sees it at the next sync.'); }
    save(); render();
}

/* ================= views: customer app ================= */
function viewApp(path) {
    const c = comp(state.viewAs) || state.companies[0];
    state.viewAs = c.id;
    const keys = enabledKeys(c), enforce = state.settings.enforce;
    const allowed = f => !f || !enforce || keys.has(f);
    const page = PAGES[path] || { label: path, f: null };
    const navHtml = NAV.map(n => {
        if (n.children) {
            const kids = n.children.filter(k => allowed(k.f));
            if (!kids.length) return '';
            const on = kids.some(k => k.path === path);
            return `<span class="nav-i"><a class="nav-a ${on ? 'on' : ''}" href="#/app/${kids[0].path}" aria-haspopup="true">${esc(n.label)}<span class="caret">▼</span></a><span class="nav-menu">${kids.map(k => `<a href="#/app/${k.path}">${esc(k.label)}</a>`).join('')}</span></span>`;
        }
        return allowed(n.f) ? `<span class="nav-i"><a class="nav-a ${n.path === path ? 'on' : ''}" href="#/app/${n.path}">${esc(n.label)}</a></span>` : '';
    }).join('');
    const st = statusInfo(c);
    const locked = Object.values(PAGES).filter(p => p.f && !keys.has(p.f));
    const recorded = FEATURES.filter(f => f.recorded && !f.soon && !keys.has(f.key));
    const initials = c.adminName.split(/\s+/).map(x => x[0]).join('').slice(0, 2).toUpperCase();
    const body = allowed(page.f) ? placeholderPage(c, page, keys) : upgradePage(c, BY_KEY[page.f]);
    return `<div class="app-head">
            <a class="brand" href="#/app/insighthub"><img src="ewf-shield.jpg" alt=""><span>ENGAGE <b>WORKFORCE</b></span></a>
            <nav class="app-nav" aria-label="Main menu">${navHtml}</nav>
            <span class="app-user"><span class="av">${esc(initials)}</span>${esc(c.adminName)} · ${esc(c.name)}</span>
        </div>
        <div class="page"><div class="cv-grid"><div>
            ${!enforce ? '<div class="warn-box"><b>Page enforcement is off.</b> Every page opens and nothing is hidden. This is how it ships until the click-through as each plan is done.</div>' : ''}
            ${!c.activated ? `<div class="info">${esc(c.adminName)} hasn't opened the activation link yet. <button class="link-btn" data-act="activate" data-id="${c.id}">Simulate opening it</button></div>` : ''}
            ${body}
        </div><aside>
            <div class="box"><div class="box-h"><h3>Prototype: viewing as</h3></div><div class="box-b">
                <div class="fld"><label for="view-as">Customer admin of</label><select class="in" id="view-as" data-change="view-as">${state.companies.map(x => `<option value="${x.id}" ${x.id === c.id ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select></div>
                <dl class="dl" style="grid-template-columns:90px 1fr;margin:0"><dt>Plan</dt><dd>${c.agreement ? esc(c.agreement.plan) : 'None (existing customer)'}</dd><dt>Status</dt><dd>${pill(st.label, st.cls)}</dd><dt>Features</dt><dd>${keys.size} of ${SELLABLE.length} on</dd></dl>
                <p class="hint" style="margin:10px 0 0">SuperAdmin and client-portal logins are never blocked. The mobile app and the API are never touched.</p>
            </div></div>
            <div class="box"><div class="box-h"><h3>Hidden from the topbar</h3><span class="sub">${locked.length} page${locked.length === 1 ? '' : 's'}</span></div><div class="box-b">
                ${locked.length ? `<p class="hint" style="margin-top:0">Opening one by URL or bookmark shows "Upgrade to unlock".</p><ul class="mini-list">${locked.map(p => `<li><span>${esc(p.label)}</span><a class="btn btn-sm" href="#/app/${p.path}">Open by URL</a></li>`).join('')}</ul>` : '<p class="muted" style="margin:0">Nothing: this customer can open every page.</p>'}
            </div></div>
            ${recorded.length ? `<div class="box"><div class="box-h"><h3>Off, but still visible</h3></div><div class="box-b"><p class="hint" style="margin-top:0">Recorded only: these live inside protected pages that are never edited.</p><ul class="mini-list">${recorded.map(f => `<li><span><b>${esc(f.name)}</b><div class="sub">${esc(f.recorded)}</div></span></li>`).join('')}</ul></div></div>` : ''}
        </aside></div></div>`;
}
function placeholderPage(c, page, keys) {
    const ih = page.path === 'insighthub';
    const offWidgets = ['risk', 'wps', 'automation', 'commandcentre'].filter(k => !keys.has(k)).map(k => BY_KEY[k].name);
    return `<div class="box"><div class="box-h"><h3>${esc(page.label)}</h3><span class="sub">/${esc(page.path)}</span></div><div class="box-b">
        <p class="muted">The real ${esc(page.label)} page loads here, unchanged.</p>
        ${ih && offWidgets.length ? `<div class="info">On Insight Hub the panels for <b>${esc(offWidgets.join(', '))}</b> still show for ${esc(c.name)}: Insight Hub is a protected page, so nothing inside it is hidden.</div>` : ''}
        <div class="skel-row"><div class="skel"></div><div class="skel"></div><div class="skel"></div><div class="skel"></div></div>
        <div class="skel skel-big"></div><div class="skel-row"><div class="skel"></div><div class="skel"></div><div class="skel"></div><div class="skel"></div></div>
    </div></div>`;
}
function upgradePage(c, f) {
    const min = minPlanOf(f), plan = c.agreement ? c.agreement.plan : 'current';
    const requested = c.requested.includes(f.key);
    return `<div class="lock-card">
        <div class="lock-ic">${icon.lock}</div>
        <h2>Upgrade to unlock ${esc(f.name)}</h2>
        <p>${esc(f.name)} isn't included in your <b>${esc(plan)}</b> plan. It's part of <b>${esc(min)}</b>${min === 'Professional' ? ' and Enterprise' : ''}.</p>
        <p class="muted">${esc(f.desc)}</p>
        <div class="btn-row">
            ${requested ? '<span class="pill p-green" style="padding:8px 12px">Requested: we\'ll be in touch</span>' : `<button class="btn btn-p" data-act="request-feature" data-id="${f.key}">Request this feature</button>`}
            <a class="btn" href="#/app/insighthub">Back to Insight Hub</a>
        </div>
        <p class="hint" style="margin-top:14px">Questions? Call us on 1300 000 000.</p>
    </div>`;
}
function requestFeature(key) {
    const c = comp(state.viewAs), f = BY_KEY[key];
    const q = { id: nid('q'), createdAt: stamp(), createdMs: 0, fullName: c.adminName, companyName: c.name, email: c.adminEmail, phone: c.phone, teamSize: '',
        selectedPlan: minPlanOf(f), interest: 'Question', preferredTrialDays: null, message: `Feature request: ${f.name} (current plan ${c.agreement ? c.agreement.plan : 'none'})`,
        sourcePage: '/upgrade-required', status: 'New', notes: '', convertedCompanyId: null };
    state.inquiries.push(q); emailLead(q); c.requested.push(key);
    save(); render();
    toast('Feature request saved as a new inquiry and emailed to sales.');
}

/* ================= settings ================= */
function openSettings() {
    const s = state.settings;
    const gated = SELLABLE.filter(f => f.min !== 'Always');
    showModal(`<div class="modal-h"><h3>Prototype settings</h3><button class="x" data-act="close-modal" aria-label="Close">×</button></div>
        <form id="st-form" data-form="settings" novalidate><div class="modal-b">
            <p class="hint" style="margin-top:0">Use these to try the open decisions. The pricing page, calculator, price preview and feature access all read them.</p>
            <div class="sec-title">Commercial</div>
            <div class="grid2">
                <div class="fld"><label for="st-inbox">Sales inbox (decision 1)</label><input class="in" id="st-inbox" name="salesInbox" value="${esc(s.salesInbox)}"></div>
                <div class="fld"><label for="st-min">Monthly minimum, $ (decision 5)</label><input class="in" id="st-min" name="minMonthly" type="number" min="0" value="${esc(s.minMonthly)}" list="mins"><datalist id="mins"><option value="49"><option value="99"><option value="250"></datalist></div>
            </div>
            <div class="grid2">
                <div class="fld"><label for="st-months">Annual plan: pay this many months for 12 (decision 6)</label><input class="in" id="st-months" name="annualMonths" type="number" min="1" max="12" value="${esc(s.annualMonths)}"></div>
                <div class="fld"><span class="lbl">Switches</span>
                    <label class="check"><input type="checkbox" name="notifyCustomers" ${s.notifyCustomers ? 'checked' : ''}>Email customers at T-3 / T-1 and on expiry (decision 3)</label>
                    <label class="check"><input type="checkbox" name="enforce" ${s.enforce ? 'checked' : ''}>Enforce feature pages (config switch, ships off)</label></div>
            </div>
            <div class="sec-title">Billing & Xero</div>
            <div class="grid2">
                <div class="fld"><label for="st-supplier">Supplier name on invoices</label><input class="in" id="st-supplier" name="supplier" value="${esc(s.billing.supplier)}"></div>
                <div class="fld"><label for="st-acct">Xero sales account code</label><input class="in" id="st-acct" name="accountCode" value="${esc(s.billing.accountCode)}"><span class="hint">Used on every invoice line (200 is Xero's default sales account).</span></div>
            </div>
            <div class="grid2">
                <div class="fld"><label for="st-terms">Payment terms (days)</label><input class="in" id="st-terms" name="terms" type="number" min="1" max="90" value="${esc(s.billing.terms)}"></div>
                <div class="fld"><label for="st-gst">GST rate (%)</label><input class="in" id="st-gst" name="gstRate" type="number" min="0" max="30" step="0.5" value="${esc(s.billing.gstRate)}"></div>
            </div>
            <div class="grid2">
                <div class="fld"><label for="st-bday">Per-guard billing day of the month (1 to 28)</label><input class="in" id="st-bday" name="billingDay" type="number" min="1" max="28" value="${esc(s.billing.billingDay)}"></div>
                <div class="fld"><label for="st-lead">Renewal draft this many days before the renewal date</label><input class="in" id="st-lead" name="renewalLeadDays" type="number" min="1" max="400" value="${esc(s.billing.renewalLeadDays)}"></div>
            </div>
            <div class="fld"><span class="lbl">Xero connection: ${esc(s.billing.xeroOrg)}</span>
                <label class="check"><input type="checkbox" name="xeroLapsed" ${s.billing.xeroOk ? '' : 'checked'}>Simulate: the Xero connection has lapsed (new invoices wait as "Not in Xero" and are retried each night)</label></div>
            <div class="sec-title">Feature matrix (decision 9)</div>
            <div class="tbl-wrap" style="max-height:340px;overflow-y:auto"><table class="tbl"><thead><tr><th>Feature</th><th>Group</th><th>Included from</th></tr></thead><tbody>
                ${gated.map(f => `<tr><td>${esc(f.name)}${minPlanOf(f) !== f.min ? ' ' + pill('changed', 'p-violet') : ''}</td><td class="muted">${esc(f.cat)}</td><td><select class="in" name="m-${f.key}" aria-label="${esc(f.name)} included from">${TIERS.map(t => `<option ${t === minPlanOf(f) ? 'selected' : ''}>${t}</option>`).join('')}</select></td></tr>`).join('')}
            </tbody></table></div>
            <p style="margin-top:10px"><button type="button" class="link-btn" data-act="matrix-reset">Reset the matrix to the plan's proposal</button></p>
        </div>
        <div class="modal-f"><button type="button" class="btn" data-act="close-modal">Cancel</button><button type="submit" class="btn btn-p">Save settings</button></div></form>`, 'lg');
}
function saveSettings(form) {
    const fd = new FormData(form), s = state.settings;
    s.salesInbox = String(fd.get('salesInbox') || '').trim() || s.salesInbox;
    s.minMonthly = Math.max(0, num(fd.get('minMonthly')));
    s.annualMonths = Math.min(12, Math.max(1, Math.round(num(fd.get('annualMonths')) || 10)));
    s.notifyCustomers = fd.has('notifyCustomers');
    s.enforce = fd.has('enforce');
    const clampInt = (v, lo, hi, dflt) => Math.min(hi, Math.max(lo, Math.round(num(v)) || dflt)), b = s.billing;
    b.supplier = String(fd.get('supplier') || '').trim() || b.supplier;
    b.accountCode = String(fd.get('accountCode') || '').trim() || '200';
    b.terms = clampInt(fd.get('terms'), 1, 90, 14);
    if (String(fd.get('gstRate')).trim() !== '') b.gstRate = Math.min(30, Math.max(0, num(fd.get('gstRate'))));
    b.billingDay = clampInt(fd.get('billingDay'), 1, 28, 1);
    b.renewalLeadDays = clampInt(fd.get('renewalLeadDays'), 1, 400, 30);
    b.xeroOk = !fd.has('xeroLapsed');
    s.matrix = {};
    SELLABLE.filter(f => f.min !== 'Always').forEach(f => { const v = String(fd.get('m-' + f.key)); if (v && v !== f.min) s.matrix[f.key] = v; });
    save(); closeModal(); render(); toast('Settings saved.');
}

/* ================= modal / drawer / toast ================= */
let lastFocus = null;
function showModal(html, size) {
    lastFocus = document.activeElement;
    $('#modal-root').innerHTML = `<div class="scrim" data-act="scrim-modal"><div class="modal ${size || ''}" role="dialog" aria-modal="true">${html}</div></div>`;
    const first = $('#modal-root input:not([type=hidden]):not([disabled]), #modal-root select, #modal-root textarea, #modal-root button');
    if (first) first.focus();
}
function closeModal() { $('#modal-root').innerHTML = ''; draft = null; quickSubmit = null; lineDraft = null; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
function showDrawer(html) {
    $('#drawer-root').innerHTML = `<div class="drawer-scrim" data-act="close-drawer"></div><aside class="drawer" role="dialog" aria-modal="true">${html}</aside>`;
    const x = $('#drawer-root .x'); if (x) x.focus();
}
function closeDrawer() {
    $('#drawer-root').innerHTML = '';
    const { path, query } = parseHash();
    if (query.open) history.replaceState(null, '', '#' + path);
}
function toast(msg) {
    const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg;
    $('#toast-root').appendChild(el); setTimeout(() => el.remove(), 4500);
}

/* ================= router ================= */
function parseHash() {
    const raw = decodeURIComponent(location.hash.replace(/^#/, '')) || '/';
    const [path, qs] = raw.split('?');
    const query = Object.fromEntries(new URLSearchParams(qs || ''));
    return { path: path || '/', query };
}
function render() {
    const { path, query } = parseHash();
    renderBar(path);
    let html;
    if (path === '/pricing') html = viewPricing();
    else if (path === '/free-trial') html = viewForm('trial', query);
    else if (path === '/contact') html = viewForm('contact', query);
    else if (path === '/inbox' || path.startsWith('/inbox/')) html = viewInbox(path.split('/')[2]);
    else if (path === '/sa/inquiries') html = viewInquiries(query);
    else if (path === '/sa/customers') html = viewCustomers(query);
    else if (path === '/sa/billing') html = viewBilling();
    else if (path.startsWith('/app')) html = viewApp(path.replace(/^\/app\/?/, '') || 'insighthub');
    else html = viewOverview();
    $('#view').innerHTML = html;
    $('#drawer-root').innerHTML = '';
    if (query.open && path === '/sa/inquiries') openInquiryDrawer(query.open);
    if (query.open && path === '/sa/customers') openCustomerDrawer(query.open);
    if (query.open && path === '/sa/billing') openInvoiceDrawer(query.open);
}
let lastSection = null;
window.addEventListener('hashchange', () => {
    const sec = section(parseHash().path);
    if (sec !== lastSection) window.scrollTo(0, 0);
    lastSection = sec;
    ui.formSent = null;
    render();
});

/* ================= events ================= */
const ACTIONS = {
    advance: (el, id) => advance(num(id)),
    settings: () => openSettings(),
    reset: () => { if (confirm('Reset all prototype data to the starting demo?')) { seed(); ui.formSent = null; location.hash = '#/'; render(); toast('Demo data reset.'); } },
    'close-modal': () => closeModal(),
    'scrim-modal': (el, id, e) => { if (e.target === el) closeModal(); },
    'close-drawer': () => closeDrawer(),
    'calc-term': (el, id) => { ui.calcAnnual = id === 'a'; $('#mk-calc').innerHTML = calcHtml(); },
    'form-again': () => { ui.formSent = null; render(); },
    'inbox-filter': (el, id) => { ui.inboxFilter = id; render(); },
    'open-mail': (el, id) => { location.hash = '#/inbox/' + id; },
    'goto-inq': (el, id) => { location.hash = '#/sa/inquiries' + (id ? '?open=' + id : ''); },
    'goto-cust': (el, id) => { location.hash = '#/sa/customers' + (id ? '?open=' + id : ''); },
    'goto-bill': () => { location.hash = '#/sa/billing'; },
    'open-xero': () => toast('Prototype: this opens the invoice in Xero (go.xero.com), where the client would also see a Pay now button if online payments are on.'),
    'bill-filter': (el, id) => { ui.billFilter = ui.billFilter === id ? 'All' : id; render(); },
    'open-inv': (el, id, e) => {
        e.stopPropagation();
        if (parseHash().path === '/sa/billing') { history.replaceState(null, '', '#/sa/billing?open=' + id); openInvoiceDrawer(id); } else location.hash = '#/sa/billing?open=' + id;
    },
    'inv-create': (el, id) => {
        const i = invById(id), r = createInXero(i); save(); render();
        toast(r.ok ? `Draft ${i.xero.number} created in Xero. Approve and send it there.` : `Not created in Xero: ${r.why}`);
    },
    'inv-edit': (el, id) => openLinesModal(id),
    'inv-add': (el, id) => openLinesModal(null, id),
    'inv-refresh': (el, id) => refreshInvoice(id),
    'inv-cancel': (el, id) => actCancelInv(id),
    'inv-open-xero': () => ACTIONS['open-xero'](),
    'inv-sync': (el, id) => {
        if (!bset().xeroOk) { toast('Xero is not connected, so nothing can be read. Reconnect it in Settings.'); return; }
        const ch = syncFromXero(invById(id)); save(); render(); toast(ch ? 'Updated from Xero.' : 'Already up to date with Xero.');
    },
    'xero-approve': (el, id) => xeroAct(id, 'approve'),
    'xero-pay': (el, id) => xeroAct(id, 'pay'),
    'xero-void': (el, id) => xeroAct(id, 'void'),
    'bill-edit': (el, id) => actBilling(id),
    'line-add': () => { syncLines(); lineDraft.lines.push({ desc: '', qty: 1, unit: 0 }); renderLines(); const n = lineDraft.lines.length - 1, f = $('#lines-form').elements['desc-' + n]; if (f) f.focus(); },
    'line-del': (el, id) => { syncLines(); lineDraft.lines.splice(num(id), 1); if (!lineDraft.lines.length) lineDraft.lines.push({ desc: '', qty: 1, unit: 0 }); renderLines(); },
    activate: (el, id) => {
        const c = comp(id); if (!c) return;
        if (!c.activated) { c.activated = true; hist(c, 'Admin activated account', `${c.adminName} set a password`, ''); save(); }
        state.viewAs = c.id; save();
        toast(`Activation link opened: ${c.adminName} set a password and is now signed in.`);
        location.hash = '#/app/insighthub'; render();
    },
    'inq-filter': (el, id) => { ui.inqFilter = id; render(); },
    'open-inq': (el, id, e) => { e.stopPropagation(); history.replaceState(null, '', '#/sa/inquiries?open=' + id); openInquiryDrawer(id); },
    'inq-save': (el, id) => {
        const q = inq(id); const st = $('#inq-status').value; const old = q.status;
        q.status = st; q.notes = $('#inq-notes').value; save();
        $('#inq-rows').innerHTML = inqRows(); openInquiryDrawer(id); renderBar('/sa/inquiries');
        toast(old !== st ? `Status ${INQ_STATUS[old][0]} → ${INQ_STATUS[st][0]}.` : 'Notes saved.');
    },
    'inq-lost': (el, id) => { const q = inq(id); q.status = 'Lost'; save(); $('#inq-rows').innerHTML = inqRows(); openInquiryDrawer(id); renderBar('/sa/inquiries'); toast(`${q.companyName} marked lost.`); },
    'create-from-inq': (el, id) => openAgreementModal('create', { inquiryId: id }),
    'create-blank': () => openAgreementModal('create', {}),
    'cust-filter': (el, id) => { ui.custFilter = ui.custFilter === id ? 'All' : id; render(); },
    'open-cust': (el, id, e) => { e.stopPropagation(); history.replaceState(null, '', '#/sa/customers?open=' + id); openCustomerDrawer(id); },
    'ag-edit': (el, id) => openAgreementModal('edit', { companyId: id }),
    'ag-attach': (el, id) => openAgreementModal('attach', { companyId: id }),
    'ag-extend': (el, id) => actExtend(id),
    'ag-convert': (el, id) => actConvert(id),
    'ag-suspend': (el, id) => actStatus(id, 'Suspended'),
    'ag-cancel': (el, id) => actStatus(id, 'Cancelled'),
    'ag-reactivate': (el, id) => actStatus(id, 'Active'),
    resend: (el, id) => actResend(id),
    'view-as': (el, id) => { state.viewAs = id; save(); location.hash = '#/app/insighthub'; },
    'sim-usage': (el, id) => {
        const c = comp(id); c.guardsThis = Math.max(0, Math.round(num($('#sim-this').value))); c.guardsLast = Math.max(0, Math.round(num($('#sim-last').value)));
        save(); $('#cust-rows').innerHTML = custRows(); openCustomerDrawer(id); toast('Usage updated.');
    },
    'fp-reset': () => { draft.overrides = []; renderFeaturePanel(); },
    'fp-trial-end': (el, key) => { const o = draft.overrides.find(x => x.key === key); if (o) { o.expiresAt = addDays(draftTrialEnd(), -1); renderFeaturePanel(); } },
    'request-feature': (el, key) => requestFeature(key),
    'matrix-reset': () => { $$('#st-form select[name^="m-"]').forEach(s => { s.value = BY_KEY[s.name.slice(2)].min; }); },
};
document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const fn = ACTIONS[el.dataset.act];
    if (fn) fn(el, el.dataset.id, e);
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if ($('#modal-root').innerHTML) closeModal(); else if ($('#drawer-root').innerHTML) closeDrawer(); }
    if (e.key === 'Enter' && e.target.matches && e.target.matches('tr.click')) e.target.click();
});
document.addEventListener('submit', e => {
    const form = e.target;
    if (!form.dataset.form) return;
    e.preventDefault();
    if (form.dataset.form === 'lead') submitLead(form);
    else if (form.dataset.form === 'agreement') submitAgreement();
    else if (form.dataset.form === 'settings') saveSettings(form);
    else if (form.dataset.form === 'lines') saveLines();
    else if (form.dataset.form === 'quick' && quickSubmit) {
        const fn = quickSubmit;
        if (fn(new FormData(form)) === false) return;
        save(); closeModal(); render();   // render() reopens the drawer from ?open=
    }
});
document.addEventListener('input', e => {
    const t = e.target;
    if (t.id === 'calc-range') {   // update only the numbers: replacing the slider would end the drag
        ui.calcGuards = +t.value;
        $('#mk-g').textContent = t.value;
        $('#mk-res-wrap').innerHTML = calcResults();
        return;
    }
    if (t.dataset && t.dataset.search === 'inq') { ui.inqSearch = t.value; $('#inq-rows').innerHTML = inqRows(); return; }
    if (t.dataset && t.dataset.search === 'cust') { ui.custSearch = t.value; $('#cust-rows').innerHTML = custRows(); return; }
    if (draft && t.closest('#am-form') && !t.dataset.fkey && !t.dataset.funtil) syncAgreementModal();
    if (lineDraft && t.closest('#lines-form')) { syncLines(); renderLineTotals(); }
});
document.addEventListener('change', e => {
    const t = e.target;
    if (t.dataset && t.dataset.change === 'view-as') { state.viewAs = t.value; save(); render(); return; }
    if (draft && t.dataset && t.dataset.fkey) { featureToggle(t.dataset.fkey, t.checked); return; }
    if (draft && t.dataset && t.dataset.funtil) { const o = draft.overrides.find(x => x.key === t.dataset.funtil); if (o) { o.expiresAt = t.value; renderFeaturePanel(); } return; }
    if (draft && t.closest('#am-form')) {
        syncAgreementModal();
        if (t.name === 'start' || t.name === 'status' || t.name === 'trialDays') renderFeaturePanel();
        return;
    }
    if (t.closest('form[data-form="lead"]') && t.name === 'interest') {
        const trialBox = $('[data-show-trial]'); if (trialBox) trialBox.hidden = t.value !== 'FreeTrial';
    }
});

/* ================= boot ================= */
state = load() || seed();
lastSection = section(parseHash().path);
render();
})();
