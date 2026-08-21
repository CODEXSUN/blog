import { sql } from "kysely";
import { getBlogsDatabase } from "../../database/blogs-database.js";

export async function seedTaxonomyModule() {
  for (const item of taxonomySeeds) await seed(item);
}

async function seed(item: TaxonomySeed) {
  await sql`INSERT INTO blogs_taxonomy(uuid,kind,name,slug,description,status) VALUES(${item.uuid},${item.kind},${item.name},${item.slug},${item.description},'active') ON DUPLICATE KEY UPDATE kind=VALUES(kind),name=VALUES(name),slug=VALUES(slug),description=VALUES(description),status='active'`.execute(
    getBlogsDatabase(),
  );
}

type TaxonomySeed = {
  uuid: string;
  kind: "category" | "tag";
  name: string;
  slug: string;
  description: string;
};
const taxonomySeeds: TaxonomySeed[] = [
  {
    uuid: "a11ce001",
    kind: "category",
    name: "Buying Guides",
    slug: "buying-guides",
    description: "Practical frameworks for choosing computers and technology.",
  },
  {
    uuid: "a11ce002",
    kind: "category",
    name: "Laptops",
    slug: "laptops",
    description:
      "Mobile performance, battery, displays, docks, and business laptops.",
  },
  {
    uuid: "a11ce003",
    kind: "category",
    name: "Desktop Systems",
    slug: "desktop-systems",
    description:
      "Office desktops, workstations, monitors, and workspace planning.",
  },
  {
    uuid: "a11ce004",
    kind: "category",
    name: "Components & Upgrades",
    slug: "components-upgrades",
    description:
      "Memory, storage, graphics, processors, and useful upgrade decisions.",
  },
  {
    uuid: "a11ce005",
    kind: "category",
    name: "Networking & Security",
    slug: "networking-security",
    description:
      "Reliable networks, device security, backups, and business continuity.",
  },
  {
    uuid: "a11ce006",
    kind: "category",
    name: "Maintenance & Support",
    slug: "maintenance-support",
    description:
      "Preventive care, troubleshooting, warranties, and lifecycle planning.",
  },
  {
    uuid: "a11ce007",
    kind: "category",
    name: "Business Operations",
    slug: "business-operations",
    description: "Practical operating systems for growing businesses.",
  },
  {
    uuid: "a11ce008",
    kind: "category",
    name: "Accounting",
    slug: "accounting",
    description: "Clear accounts, controls, reporting, and financial routines.",
  },
  {
    uuid: "a11ce009",
    kind: "category",
    name: "Billing & Revenue",
    slug: "billing-revenue",
    description:
      "Reliable billing, collections, tax records, and revenue workflows.",
  },
  {
    uuid: "a11ce00a",
    kind: "category",
    name: "Manufacturing",
    slug: "manufacturing",
    description:
      "Production planning, inventory, work orders, and factory visibility.",
  },
  {
    uuid: "a11ce00b",
    kind: "category",
    name: "Automation",
    slug: "automation",
    description:
      "Controlled automation for repetitive business and production work.",
  },
  {
    uuid: "a11ce011",
    kind: "tag",
    name: "Business Computers",
    slug: "business-computers",
    description: "Computer guidance for teams and organisations.",
  },
  {
    uuid: "a11ce012",
    kind: "tag",
    name: "Performance",
    slug: "performance",
    description: "Balanced hardware performance and workload planning.",
  },
  {
    uuid: "a11ce013",
    kind: "tag",
    name: "Security",
    slug: "security",
    description: "Device, account, data, and network protection.",
  },
  {
    uuid: "a11ce014",
    kind: "tag",
    name: "Buying Guide",
    slug: "buying-guide",
    description: "Clear technology purchase guidance.",
  },
  {
    uuid: "a11ce015",
    kind: "tag",
    name: "Maintenance",
    slug: "maintenance",
    description: "Reliable operation and preventive care.",
  },
  {
    uuid: "a11ce016",
    kind: "tag",
    name: "Remote Work",
    slug: "remote-work",
    description: "Mobile and hybrid work technology.",
  },
  {
    uuid: "a11ce017",
    kind: "tag",
    name: "Accounts",
    slug: "accounts",
    description: "Daily accounting controls and dependable financial records.",
  },
  {
    uuid: "a11ce018",
    kind: "tag",
    name: "Billing",
    slug: "billing",
    description: "Quotations, invoices, receipts, and collection workflows.",
  },
  {
    uuid: "a11ce019",
    kind: "tag",
    name: "Cash Flow",
    slug: "cash-flow",
    description:
      "Cash visibility, payment timing, and working-capital discipline.",
  },
  {
    uuid: "a11ce01a",
    kind: "tag",
    name: "Compliance",
    slug: "compliance",
    description: "Traceable records and review-ready business processes.",
  },
  {
    uuid: "a11ce01b",
    kind: "tag",
    name: "Manufacturing",
    slug: "manufacturing",
    description: "Factory operations and production control.",
  },
  {
    uuid: "a11ce01c",
    kind: "tag",
    name: "Production Planning",
    slug: "production-planning",
    description: "Capacity, material, work-order, and delivery planning.",
  },
  {
    uuid: "a11ce01d",
    kind: "tag",
    name: "Inventory",
    slug: "inventory",
    description: "Stock accuracy and material movement.",
  },
  {
    uuid: "a11ce01e",
    kind: "tag",
    name: "Automation",
    slug: "automation",
    description: "Safe automation with visible exceptions and ownership.",
  },
  {
    uuid: "a11ce01f",
    kind: "tag",
    name: "Workflow Control",
    slug: "workflow-control",
    description:
      "Approvals, handovers, status, and operational accountability.",
  },
  {
    uuid: "a11ce020",
    kind: "tag",
    name: "Reporting",
    slug: "reporting",
    description: "Decision-ready operational and financial reporting.",
  },
];
