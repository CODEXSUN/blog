import { sql } from "kysely";
import { getBlogsDatabase } from "../../database/blogs-database.js";

export async function seedArticleModule() {
  const taxonomy = await loadTaxonomy();
  for (const article of articleSeeds) await seedArticle(article, taxonomy);
}

async function loadTaxonomy() {
  const result = await sql<{
    id: number | string;
    kind: "category" | "tag";
    slug: string;
  }>`SELECT id,kind,slug FROM blogs_taxonomy WHERE status='active'`.execute(
    getBlogsDatabase(),
  );
  return new Map(
    result.rows.map((item) => [`${item.kind}:${item.slug}`, Number(item.id)]),
  );
}

async function seedArticle(
  article: ArticleSeed,
  taxonomy: Map<string, number>,
) {
  const categoryId = taxonomy.get(`category:${article.category}`),
    tagIds = article.tags.map((tag) => taxonomy.get(`tag:${tag}`) ?? 0);
  if (!categoryId || tagIds.includes(0))
    throw new Error(`Blog taxonomy is missing for ${article.slug}.`);
  await sql`INSERT INTO blogs_articles(uuid,kind,title,slug,excerpt,mdx,featured_image,image_alt,author_name,author_role,category_id,tag_ids,seo_title,seo_description,canonical_url,status,published_at) VALUES(${article.uuid},'post',${article.title},${article.slug},${article.excerpt},${article.mdx},${article.image},${article.imageAlt},'Editorial Team','Technology Editors',${categoryId},${JSON.stringify(tagIds)},${article.seoTitle},${article.seoDescription},'','published',${article.publishedAt}) ON DUPLICATE KEY UPDATE title=VALUES(title),excerpt=VALUES(excerpt),mdx=VALUES(mdx),featured_image=VALUES(featured_image),image_alt=VALUES(image_alt),author_name=VALUES(author_name),author_role=VALUES(author_role),category_id=VALUES(category_id),tag_ids=VALUES(tag_ids),seo_title=VALUES(seo_title),seo_description=VALUES(seo_description),status='published',published_at=VALUES(published_at)`.execute(
    getBlogsDatabase(),
  );
}

type ArticleSeed = {
  uuid: string;
  title: string;
  slug: string;
  excerpt: string;
  mdx: string;
  image: string;
  imageAlt: string;
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  publishedAt: Date;
};
const articleSeeds: ArticleSeed[] = [
  article(
    "b1090001",
    "How to choose a computer system your business can depend on",
    "choose-business-computer-system",
    "A practical framework for selecting reliable business computers, balancing performance, security, support, and total ownership cost.",
    "buying-guides",
    ["business-computers", "buying-guide"],
    "system",
    "Choose a Reliable Business Computer System",
    "Choose dependable business computers using workload, security, support, warranty, and total-cost criteria.",
    `# Choose for the work, not the specification sheet

A dependable business computer fits the workload, remains supportable, protects information, and can be replaced without disrupting the team.

## Map the real workload

- List daily applications, browser tabs, reports, video calls, and specialist tools.
- Measure the largest files and the busiest part of the working day.
- Separate general office roles from development, design, engineering, and media work.
- Record mobility, battery, display, port, and accessibility requirements.

## Balance the specification

Prioritise a current processor, enough memory for real multitasking, solid-state storage, a quality power supply, and a useful warranty. Buy extra performance only where the workload benefits.

## Protect continuity

Use supported operating systems, encryption, multi-factor authentication, managed updates, tested backups, and documented recovery. Standardise a small set of approved configurations so onboarding, spares, and support stay manageable.

## Calculate the full cost

Include warranty coverage, expected repair time, compatible accessories, energy use, software licensing, support effort, and replacement cycle. The cheapest device is rarely the lowest-cost system when downtime is included.`,
  ),
  article(
    "b1090002",
    "Laptop buying guide: performance, battery, display, and ports",
    "business-laptop-buying-guide",
    "Understand the laptop choices that matter for office work, travel, meetings, development, and creative workloads.",
    "laptops",
    ["remote-work", "buying-guide", "performance"],
    "laptop",
    "Business Laptop Buying Guide",
    "Compare processors, memory, battery, display quality, ports, repairability, and warranties before buying business laptops.",
    `# A laptop is a complete working environment

The right laptop must perform well away from a desk while connecting cleanly when the user returns to one.

## Processor and memory

Choose the processor tier for sustained workload, not brief benchmark peaks. General office users usually benefit more from sufficient memory and fast storage than from the highest processor model. Developers, analysts, designers, and video teams need additional headroom.

## Battery and charging

Compare tested battery life, USB-C charging support, charger availability, battery health tools, and replacement options. A common charger standard reduces travel and support friction.

## Display and ergonomics

Check brightness, resolution, colour accuracy, text clarity, webcam placement, keyboard comfort, trackpad quality, weight, and hinge stability. Small differences become important across a full working day.

## Ports, docks, and wireless

Confirm monitor outputs, USB capacity, Ethernet needs, Wi-Fi generation, Bluetooth, smart-card or security-key support, and dock compatibility before standardising a model.

## Serviceability

Review warranty response, accidental-damage options, memory and storage access, battery replacement, spare chargers, and the time required to restore a replacement device.`,
  ),
  article(
    "b1090003",
    "Desktop or workstation: match the system to the workload",
    "desktop-vs-workstation-guide",
    "A role-based guide to office desktops, compact PCs, professional workstations, monitors, and upgrade paths.",
    "desktop-systems",
    ["business-computers", "performance", "buying-guide"],
    "desktop",
    "Desktop vs Workstation Guide",
    "Choose between an office desktop, compact PC, or workstation using workload, graphics, memory, expansion, and reliability needs.",
    `# Start with the role

Office desktops, compact PCs, and professional workstations solve different problems. Define the applications, data size, graphics needs, and operating hours before choosing the form factor.

## Office desktops

Prioritise quiet operation, efficient processors, 16 GB or more memory where multitasking requires it, fast SSD storage, dual-display support, and dependable onsite warranty coverage.

## Compact PCs

Compact systems save space and energy. Confirm cooling, port access, VESA mounting, memory and storage replacement, and external power-adapter availability.

## Professional workstations

Engineering, 3D, scientific, AI, and advanced media workloads can require certified drivers, error-correcting memory, professional graphics, larger power supplies, and sustained cooling.

## Monitor planning

Match size, resolution, panel quality, scaling, ergonomics, and connection standards to the task. Two consistent monitors can improve productivity more than an unnecessarily expensive processor.

## Expansion and lifecycle

Document spare memory slots, storage bays, graphics clearance, power capacity, and warranty conditions before planning upgrades.`,
  ),
  article(
    "b1090004",
    "RAM, SSD, processor, or graphics: which upgrade helps most?",
    "computer-upgrade-priority-guide",
    "Diagnose the bottleneck before spending on memory, storage, processors, or graphics hardware.",
    "components-upgrades",
    ["performance", "maintenance"],
    "upgrade",
    "Computer Upgrade Priority Guide",
    "Learn whether RAM, SSD storage, processor, or graphics upgrades will improve your computer workload most.",
    `# Upgrade the bottleneck

An upgrade is valuable only when it removes the constraint affecting real work. Measure symptoms before ordering components.

## Add memory when

Applications reload frequently, browser tabs are discarded, large spreadsheets pause, or the system uses storage heavily while memory remains full. Check supported capacity, module type, speed, channel layout, and warranty rules.

## Upgrade storage when

The system still uses a hard drive, free space is consistently low, large files transfer slowly, or application startup is storage-bound. Choose a reputable SSD with suitable endurance and maintain verified backups before migration.

## Consider processor replacement when

Sustained compute work remains near full utilisation and the platform supports a worthwhile upgrade. In many business systems, a platform replacement is safer than changing an old processor.

## Upgrade graphics when

3D, rendering, video, GPU compute, or multiple high-resolution displays exceed current capability. Confirm software support, power supply, cooling, physical clearance, and driver requirements.

## Verify the result

Record baseline timings, complete the change safely, update firmware where appropriate, run health checks, and compare the same workload afterwards.`,
  ),
  article(
    "b1090005",
    "A practical small-business network and security checklist",
    "small-business-network-security-checklist",
    "Build reliable Wi-Fi, protected accounts, segmented devices, resilient backups, and a tested incident response plan.",
    "networking-security",
    ["security", "business-computers"],
    "network",
    "Small Business Network Security Checklist",
    "Improve small-business network security with reliable Wi-Fi, segmentation, MFA, updates, backups, monitoring, and recovery tests.",
    `# Reliability and security belong together

A secure network that frequently fails will be bypassed. A fast network without access control and recovery planning creates business risk.

## Internet and Wi-Fi

Use business-appropriate routers and access points, place them using measured coverage, separate administration credentials, update firmware, and document provider escalation details.

## Segment important devices

Keep staff computers, servers, guest devices, cameras, and unmanaged equipment in appropriate network segments. Allow only the communication each group requires.

## Protect identity

Require unique accounts, password managers, multi-factor authentication, prompt offboarding, least privilege, and separate administrator identities.

## Maintain endpoints

Use supported operating systems, automatic security updates, device encryption, endpoint protection, screen locks, and managed browser policies.

## Back up and recover

Maintain offline or isolated copies, monitor backup failures, document recovery ownership, and restore sample files regularly. A backup is only useful after a successful restore test.

## Prepare for incidents

Record who isolates devices, contacts providers, preserves evidence, communicates with customers, and approves recovery actions.`,
  ),
  article(
    "b1090006",
    "Preventive computer maintenance for fewer failures and longer life",
    "preventive-computer-maintenance-guide",
    "A repeatable monthly, quarterly, and annual maintenance plan for business computers and accessories.",
    "maintenance-support",
    ["maintenance", "business-computers"],
    "maintenance",
    "Preventive Computer Maintenance Guide",
    "Use monthly, quarterly, and annual computer maintenance to reduce failures, protect data, and extend useful device life.",
    `# Maintenance should be scheduled and visible

Small recurring checks prevent storage exhaustion, overheating, failed backups, expired warranties, and unsupported software from becoming urgent disruptions.

## Monthly checks

- Confirm operating-system and application updates completed.
- Review storage capacity, device health alerts, antivirus status, and backup results.
- Clean screens, keyboards, vents, and accessible filters using suitable methods.
- Record repeated crashes, battery warnings, unusual noise, or performance changes.

## Quarterly checks

Review startup applications, firmware advisories, warranty status, spare-device readiness, account access, recovery documentation, and restore tests. Inspect cables, chargers, docks, surge protection, and network equipment.

## Annual planning

Group devices by age, warranty, workload suitability, repair history, operating-system support, and expected replacement date. Budget replacements before support expires.

## Avoid risky shortcuts

Do not open equipment that must remain warranty-sealed, use household vacuums on sensitive electronics, install unverified driver tools, or postpone failing-drive replacement after health warnings.

## Keep a useful record

For each device, retain model, serial number, assigned user, purchase date, warranty, configuration, repairs, encrypted recovery details, and disposal outcome.`,
  ),
  article(
    "b1090007",
    "A daily cash-control routine for growing businesses",
    "daily-cash-control-routine",
    "Connect invoices, receipts, bank movement, and expected payments in one short routine that keeps cash decisions current.",
    "business-operations",
    ["accounts", "cash-flow", "workflow-control"],
    "daily-cash-control",
    "Daily Cash-Control Routine for Growing Businesses",
    "Use a practical daily routine to reconcile cash, follow collections, identify payment pressure, and keep owners informed.",
    `# Cash control works best as a daily habit

A monthly report can explain what happened. A short daily routine helps the team decide what to do next.

## Start with confirmed movement

Match bank credits, cash receipts, card settlements, and payment-gateway transfers to recorded receipts. Investigate unmatched amounts while the customer and transaction context are still easy to find.

## Review the next fourteen days

List customer collections expected, supplier commitments, payroll, tax payments, loan instalments, and essential operating costs. Mark every amount as confirmed, likely, or uncertain instead of treating the whole forecast as guaranteed.

## Give exceptions an owner

- Assign overdue invoices to a named person with a next-contact date.
- Record disputed bills separately from ordinary collection delay.
- Escalate unexpected withdrawals and duplicate payments immediately.
- Keep promises to pay beside the invoice, not in private messages.

## End with one decision note

Record the available balance, near-term pressure, largest collection risk, and actions agreed. This creates a useful operating trail without turning cash review into another long meeting.`,
    "2026-08-12T08:30:00.000Z",
  ),
  article(
    "b1090008",
    "A month-end close that produces trustworthy accounts",
    "month-end-close-checklist",
    "Turn month-end from a late scramble into a controlled sequence of reconciliations, reviews, adjustments, and sign-off.",
    "accounting",
    ["accounts", "reporting", "compliance"],
    "month-end-close",
    "Month-End Accounting Close Checklist",
    "Build a repeatable month-end close covering bank, receivables, payables, stock, tax, adjustments, review, and sign-off.",
    `# Close the month in a defined order

A dependable close is a workflow, not a final-day effort. Each control should have an owner, due date, evidence, and reviewer.

## Lock the operating cut-off

Confirm the last accepted sales, purchase, receipt, payment, stock, and journal dates. Record late documents for the next period or process an approved adjustment.

## Reconcile the control accounts

Reconcile every bank account, customer balance, supplier balance, cash account, tax ledger, stock valuation, advances, payroll control, and inter-company balance. Explain differences rather than carrying them forward silently.

## Review unusual movement

Compare revenue, margin, overheads, receivable days, payable days, and stock movement with the previous month and plan. Investigate material changes before publishing reports.

## Approve adjustments visibly

Accruals, provisions, depreciation, corrections, and write-offs need supporting notes and a clear approver. Keep the original entry and adjustment traceable.

## Finish with sign-off

Publish the closing checklist, unresolved exceptions, final trial balance, and management reports together. Reopen a closed period only through a controlled approval.`,
    "2026-08-13T08:30:00.000Z",
  ),
  article(
    "b1090009",
    "Design a billing flow from quotation to collected cash",
    "quotation-to-cash-billing-flow",
    "Connect quotations, orders, dispatch, invoices, receipts, and follow-up so revenue records match the work delivered.",
    "billing-revenue",
    ["billing", "cash-flow", "workflow-control"],
    "quotation-to-cash",
    "Quotation-to-Cash Billing Workflow",
    "Create a controlled quotation-to-cash process connecting approval, fulfilment, invoices, receipts, allocation, and collection.",
    `# Billing begins before the invoice

An accurate invoice depends on the commercial promise, delivery evidence, tax treatment, pricing approval, and customer identity already being correct.

## Preserve the commercial chain

Connect quotation, customer approval, sales order, delivery or service confirmation, invoice, receipt, and allocation. A user should be able to move through that chain without searching separate spreadsheets.

## Validate before posting

Check customer tax identity, billing and delivery addresses, item or service description, quantity, rate, discount, tax, payment terms, reference numbers, and approval limits.

## Separate issue from collection

Issuing an invoice records the receivable. Collecting money settles it. Keep receipts, bank confirmation, allocation, credit notes, and write-offs as distinct events with their own approval and audit trail.

## Manage exceptions by reason

Track price disputes, quantity disputes, missing delivery evidence, tax corrections, promised payment dates, and customer deductions separately. This makes collection reporting actionable.

## Measure the complete flow

Monitor quotation conversion, billing delay after delivery, invoice accuracy, overdue value, collection cycle, unapplied receipts, and credit-note rate.`,
    "2026-08-14T08:30:00.000Z",
  ),
  article(
    "b109000a",
    "Build invoice data that stays ready for tax review",
    "tax-ready-invoice-data",
    "Treat tax-ready billing as a data-quality process with validated identities, classifications, rates, evidence, and corrections.",
    "billing-revenue",
    ["billing", "compliance", "accounts"],
    "tax-ready-invoice",
    "Build Tax-Ready Invoice Data",
    "Keep invoice identity, classification, place of supply, tax rate, evidence, and amendments complete and reviewable.",
    `# Compliance starts with master data

Tax reports cannot repair incomplete customer, product, service, or transaction data. Validate the source before the invoice is posted.

## Control the essentials

- Use the legal customer name and validated tax registration details.
- Maintain item and service classifications with effective dates.
- Determine place of supply and transaction type from real evidence.
- Apply tax rates through controlled rules, not free-text memory.
- Preserve document dates, sequences, references, and currency values.

## Keep evidence connected

Link the invoice to the order, delivery record, export evidence, transport reference, service confirmation, advance receipt, and any exemption or special treatment.

## Correct through explicit documents

Use credit notes, debit notes, cancellations, and approved amendments. Do not silently rewrite a posted invoice after it has entered accounting or reporting.

## Reconcile before filing

Compare billing registers, tax ledgers, customer balances, document sequences, cancelled numbers, adjustments, and filing data. Resolve exceptions before submission dates create avoidable pressure.`,
    "2026-08-15T08:30:00.000Z",
  ),
  article(
    "b109000b",
    "Use work orders as the control centre of manufacturing",
    "manufacturing-work-order-control",
    "Give each production batch a clear requirement, route, material plan, owner, status, quality result, and completion record.",
    "manufacturing",
    ["manufacturing", "production-planning", "workflow-control"],
    "work-order-control",
    "Manufacturing Work-Order Control Guide",
    "Use manufacturing work orders to control demand, materials, routing, production status, quality, output, and traceability.",
    `# A work order should explain the production commitment

The work order connects customer or stock demand with materials, machines, people, process steps, quality checks, output, scrap, and cost.

## Define the requirement

Record the product and revision, required quantity, due date, priority, source demand, bill of materials, routing, unit, and responsible production team.

## Confirm readiness before release

Check material availability, tooling, machine capacity, approved instructions, quality plan, subcontract requirements, and predecessor work. Release only what the floor can reasonably execute.

## Capture progress at useful points

Report start, pause, quantity completed, rejection, rework, material issue and return, operation completion, downtime reason, and handover. Avoid status updates that say only “in progress.”

## Close with reconciliation

Compare planned and actual material, good output, scrap, rework, time, and outside processing. Resolve unexplained balances before closing the order.

## Learn across orders

Review schedule adherence, first-pass yield, common stoppages, material variance, rework, and lead time by product and process.`,
    "2026-08-16T08:30:00.000Z",
  ),
  article(
    "b109000c",
    "Connect inventory signals to sales, purchasing, and production",
    "connected-inventory-planning",
    "Replace isolated stock totals with demand, supply, reservation, lead-time, and production signals that explain what happens next.",
    "manufacturing",
    ["inventory", "production-planning", "manufacturing"],
    "connected-inventory",
    "Connected Inventory Planning for Manufacturing",
    "Connect inventory with sales demand, purchase supply, production requirements, reservations, lead times, and exceptions.",
    `# Stock on hand is only one part of availability

Planning needs to distinguish physical stock, accepted quality stock, reserved stock, expected receipts, open production, and demand by required date.

## Build one time-phased view

For each material, show opening availability, confirmed sales demand, production demand, safety stock, purchase orders, transfer orders, planned production, and projected balance by date.

## Use dependable lead times

Separate supplier lead time, transport, inward inspection, production queue, operation time, subcontracting, and buffer. Review actual performance instead of keeping optimistic defaults forever.

## Make reservations explicit

Reserve critical material against real demand when the business rule requires it. Show who owns the reservation and when unused stock returns to general availability.

## Act on exceptions

Highlight shortage dates, late supply, excess stock, slow-moving items, quality holds, unmatched units, and abnormal consumption. Give each exception a next action and owner.

## Protect stock accuracy

Record every receipt, issue, return, transfer, conversion, rejection, and adjustment at the point of work. Cycle-count important materials more frequently than low-risk items.`,
    "2026-08-17T08:30:00.000Z",
  ),
  article(
    "b109000d",
    "Automate manufacturing without hiding operational risk",
    "controlled-manufacturing-automation",
    "Automate repeatable production decisions while keeping approvals, exceptions, safety limits, and human ownership visible.",
    "automation",
    ["automation", "manufacturing", "workflow-control"],
    "manufacturing-automation",
    "Controlled Manufacturing Automation",
    "Choose safe manufacturing automation with clear triggers, approvals, exceptions, ownership, observability, and rollback.",
    `# Automate a stable rule, not a confused process

Automation multiplies the quality of the rule beneath it. First define the event, required data, expected result, exception path, owner, and safe stopping condition.

## Good early candidates

- Alert when material will fall short before a released work order date.
- Create inspection tasks when a receipt or operation requires quality control.
- Escalate production steps that exceed the allowed waiting time.
- Prepare replenishment suggestions from approved planning rules.
- Notify owners when rejection, downtime, or consumption crosses a threshold.

## Keep approval where judgement matters

Purchase commitments, schedule overrides, material substitutions, quality concessions, scrap write-offs, and customer-date changes usually need a responsible person to approve the proposed action.

## Design the exception route first

Show why automation stopped, what data failed, what has already changed, who can resolve it, and whether retry is safe. Never leave a silent partially completed workflow.

## Measure operational value

Track prevented shortages, response time, manual touches removed, false alerts, override frequency, failed runs, recovery time, and the business result—not only the number of automations executed.`,
    "2026-08-18T08:30:00.000Z",
  ),
  article(
    "b109000e",
    "Manage the factory by exception, not by constant chasing",
    "factory-exception-management",
    "Create one operational view of shortages, delays, quality failures, downtime, cost variance, and blocked decisions.",
    "automation",
    ["automation", "manufacturing", "reporting"],
    "factory-exceptions",
    "Factory Exception Management",
    "Use exception-based factory management to surface production delays, shortages, quality issues, downtime, and cost variance.",
    `# A useful dashboard tells people where attention is required

Factory teams do not need another wall of totals. They need a reliable list of deviations that threaten delivery, quality, cost, safety, or cash.

## Define exceptions with context

An exception should include the affected order or material, planned value, actual value, variance, business impact, first detected time, current owner, next action, and escalation deadline.

## Group by decision

Separate shortages requiring supply action, schedule conflicts requiring planning action, machine issues requiring maintenance, quality failures requiring disposition, and commercial changes requiring customer approval.

## Control alert volume

Use material thresholds, persistence windows, priority, dependency, and acknowledgement. Repeated low-value alerts train teams to ignore the system.

## Close the loop

When an exception is resolved, record the action, result, root-cause category, lost time or value, and whether a preventive change is required.

## Review the system itself

Measure open exception age, repeated causes, escalation rate, response time, schedule recovery, false positives, and issues discovered outside the system. Improve rules as the operation changes.`,
    "2026-08-19T08:30:00.000Z",
  ),
];

function article(
  uuid: string,
  title: string,
  slug: string,
  excerpt: string,
  category: string,
  tags: string[],
  imageName: string,
  seoTitle: string,
  seoDescription: string,
  mdx: string,
  publishedAt?: string,
): ArticleSeed {
  const index = Number(uuid.slice(-1));
  return {
    uuid,
    title,
    slug,
    excerpt,
    category,
    tags,
    mdx,
    image: `${imageName}.svg`,
    imageAlt: `Editorial illustration for ${title}`,
    seoTitle,
    seoDescription,
    publishedAt: publishedAt
      ? new Date(publishedAt)
      : new Date(Date.UTC(2026, 6, index + 10, 8, 30)),
  };
}
