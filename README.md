# Engage WorkForce — Subscription Prototype

Clickable prototype of the subscription / trial / feature-gating flow (pricing page, trial request, SuperAdmin inquiries and customers, customer view, nightly trial job, settings).

Static HTML/CSS/JS, no build step. All data is fake and lives in the browser's localStorage; use **Reset demo** in the top bar to start over.

## Billing (added 2026-10-07)

Invoices are raised in **Xero**, which is simulated here. SuperAdmin › **Billing** shows every invoice; open one and use **Act as Xero** to approve, record payment or void, then **Sync from Xero** (the nightly job does this too). GST (10%) is added on top of the ex-GST prices. Per-guard customers get a monthly draft on the 2nd, annual and custom customers get a draft 30 days before renewal. A draft deleted in Xero (Act as Xero › Delete draft) goes back to the queue and is created again the next night; use Cancel to stop a charge. Trial end dates are the last day included. To demo a create that fails half-way, tick **Simulate: the next customer's agreement fails to save** in Settings, then create a customer from an inquiry: it shows as **Agreement missing** and **Attach agreement** finishes it and sends the activation email. Settings has a Billing & Xero group, including a switch that simulates a lapsed Xero connection.
