// Mock mainframe records for demonstration
export interface MainframeRecord {
  id: number;
  account_id: string;
  text: string;
  record_type: string;
  date: string;
  classification?: string;
  pii_detected?: boolean;
  confidence?: number;
}

export const mockMainframeRecords: MainframeRecord[] = [
  { id: 1, account_id: "ACC-001847", text: "Customer John Smith, SSN 123-45-6789, balance inquiry processed", record_type: "CUSTOMER", date: "2019-03-14" },
  { id: 2, account_id: "ACC-002391", text: "System maintenance log: batch job completed successfully", record_type: "SYSLOG", date: "2018-11-22" },
  { id: 3, account_id: "ACC-003102", text: "Error: failed transaction rollback on account overdraft", record_type: "ERROR", date: "2020-01-05" },
  { id: 4, account_id: "ACC-004556", text: "Jane Doe, email jane.doe@email.com, credit card application approved", record_type: "CUSTOMER", date: "2017-07-19" },
  { id: 5, account_id: "ACC-005723", text: "Deprecated module XR-7 cleanup routine executed", record_type: "SYSLOG", date: "2016-09-30" },
  { id: 6, account_id: "ACC-006889", text: "Test record for QA environment - no production data", record_type: "TEST", date: "2021-02-11" },
  { id: 7, account_id: "ACC-007234", text: "Robert Johnson, phone 555-0147, mortgage payment #47 received", record_type: "CUSTOMER", date: "2019-08-03" },
  { id: 8, account_id: "ACC-008901", text: "Archive: legacy COBOL batch report - quarterly summary Q3 2015", record_type: "ARCHIVE", date: "2015-10-01" },
  { id: 9, account_id: "ACC-009445", text: "Null pointer exception in module ACCTBAL during nightly run", record_type: "ERROR", date: "2020-06-17" },
  { id: 10, account_id: "ACC-010112", text: "Sarah Williams, DOB 04/15/1985, account verification completed", record_type: "CUSTOMER", date: "2018-12-08" },
  { id: 11, account_id: "ACC-011678", text: "Temporary file cleanup: 847 orphaned records removed from staging", record_type: "SYSLOG", date: "2017-04-25" },
  { id: 12, account_id: "ACC-012344", text: "Performance benchmark: response time 2.3s exceeds SLA threshold", record_type: "MONITOR", date: "2021-09-14" },
  { id: 13, account_id: "ACC-013890", text: "Michael Brown, address 123 Oak St, loan disbursement processed", record_type: "CUSTOMER", date: "2019-05-21" },
  { id: 14, account_id: "ACC-014567", text: "Duplicate record detected: merging account entries #14567-A and #14567-B", record_type: "SYSLOG", date: "2020-03-09" },
  { id: 15, account_id: "ACC-015233", text: "Data retention policy: flagged 23 records past 7-year threshold", record_type: "COMPLIANCE", date: "2022-01-03" },
  { id: 16, account_id: "ACC-016789", text: "Emily Chen, passport P12345678, international wire transfer completed", record_type: "CUSTOMER", date: "2018-06-30" },
  { id: 17, account_id: "ACC-017456", text: "Scheduled backup completed: 4.7TB compressed to 1.2TB archive", record_type: "SYSLOG", date: "2021-07-12" },
  { id: 18, account_id: "ACC-018123", text: "Debug trace: memory allocation failure in SORTMOD at offset 0x4F2A", record_type: "DEBUG", date: "2016-11-08" },
  { id: 19, account_id: "ACC-019890", text: "David Martinez, SSN 987-65-4321, pension calculation updated", record_type: "CUSTOMER", date: "2019-10-27" },
  { id: 20, account_id: "ACC-020567", text: "End of day reconciliation: all accounts balanced within tolerance", record_type: "SYSLOG", date: "2022-04-18" },
  { id: 21, account_id: "ACC-021234", text: "Legacy format conversion: EBCDIC to ASCII migration batch #47", record_type: "MIGRATION", date: "2017-02-14" },
  { id: 22, account_id: "ACC-022901", text: "Amanda Wilson, phone 555-0298, savings account closed per request", record_type: "CUSTOMER", date: "2020-08-05" },
  { id: 23, account_id: "ACC-023578", text: "Audit trail: unauthorized access attempt blocked from terminal T-4491", record_type: "SECURITY", date: "2021-12-19" },
  { id: 24, account_id: "ACC-024245", text: "Batch processing stats: 12,847 records processed in 3.2 minutes", record_type: "MONITOR", date: "2022-06-07" },
  { id: 25, account_id: "ACC-025912", text: "Christopher Lee, email chris.lee@corp.net, investment portfolio rebalanced", record_type: "CUSTOMER", date: "2019-01-16" },
  { id: 26, account_id: "ACC-026679", text: "Deprecated API endpoint /v1/accounts/legacy decommissioned", record_type: "SYSLOG", date: "2021-03-28" },
  { id: 27, account_id: "ACC-027346", text: "Test environment reset: all staging data purged successfully", record_type: "TEST", date: "2020-11-13" },
  { id: 28, account_id: "ACC-028013", text: "Maria Garcia, address 456 Pine Ave, mortgage refinancing approved", record_type: "CUSTOMER", date: "2018-09-22" },
  { id: 29, account_id: "ACC-029780", text: "Disk space alert: partition /data/archive at 94% capacity", record_type: "ALERT", date: "2022-02-01" },
  { id: 30, account_id: "ACC-030447", text: "Year-end processing: generating 1099 forms for 8,234 accounts", record_type: "COMPLIANCE", date: "2021-12-31" },
];

// Simulated analysis results
export const analyzeRecord = (record: MainframeRecord): MainframeRecord => {
  const piiPatterns = /SSN|email|phone|DOB|passport|address|\d{3}-\d{2}-\d{4}|@/i;
  const wastePatterns = /test|deprecated|debug|temporary|orphaned|null pointer|legacy|archive|staging/i;
  
  const hasPii = piiPatterns.test(record.text);
  const isWaste = wastePatterns.test(record.text);
  
  let classification: string;
  if (hasPii) {
    classification = "TOXIC";
  } else if (isWaste) {
    classification = "ROT";
  } else {
    classification = "CRITICAL";
  }
  
  return {
    ...record,
    classification,
    pii_detected: hasPii,
    confidence: 0.75 + Math.random() * 0.24,
  };
};

export const blockchainTransactions = [
  { hash: "0x7a3f...e8b2", records: 8, carbon: 0.04, timestamp: "2025-12-14T10:23:00Z", status: "confirmed" },
  { hash: "0x9c1d...4f7a", records: 12, carbon: 0.06, timestamp: "2025-12-14T14:45:00Z", status: "confirmed" },
  { hash: "0x2b8e...1c3d", records: 5, carbon: 0.025, timestamp: "2025-12-15T09:12:00Z", status: "pending" },
];

export const carbonMetrics = {
  totalRecordsProcessed: 15847,
  totalWasteDeleted: 6234,
  totalCarbonSaved: 31.17,
  totalPiiDetected: 2891,
  avgProcessingTime: 2.3,
  blockchainProofs: 47,
};

export const chartData = [
  { month: "Jul", waste: 420, pii: 180, critical: 890 },
  { month: "Aug", waste: 580, pii: 220, critical: 760 },
  { month: "Sep", waste: 690, pii: 310, critical: 820 },
  { month: "Oct", waste: 810, pii: 290, critical: 950 },
  { month: "Nov", waste: 920, pii: 340, critical: 870 },
  { month: "Dec", waste: 1100, pii: 380, critical: 910 },
];

export const energyData = [
  { month: "Jul", saved: 2.1, baseline: 8.4 },
  { month: "Aug", saved: 2.9, baseline: 8.1 },
  { month: "Sep", saved: 3.45, baseline: 7.6 },
  { month: "Oct", saved: 4.05, baseline: 7.9 },
  { month: "Nov", saved: 4.6, baseline: 8.2 },
  { month: "Dec", saved: 5.5, baseline: 8.0 },
];

export const pipelineSteps = [
  {
    step: 1,
    title: "Legacy Ingestion",
    subtitle: "EBCDIC & COMP-3 Decoder",
    description: "Parse mainframe binary dumps including EBCDIC character encoding and COMP-3 packed decimal formats from legacy banking systems.",
    icon: "database",
    status: "complete" as const,
  },
  {
    step: 2,
    title: "Green AI Analysis",
    subtitle: "DistilBERT Classification",
    description: "Energy-efficient NLP model classifies records as critical business data, digital waste (ROT), or toxic PII using transfer learning.",
    icon: "brain",
    status: "complete" as const,
  },
  {
    step: 3,
    title: "PII Detection",
    subtitle: "Microsoft Presidio Scanner",
    description: "Enterprise-grade entity recognition detects SSNs, emails, phone numbers, addresses, and 20+ PII types with configurable confidence thresholds.",
    icon: "shield",
    status: "active" as const,
  },
  {
    step: 4,
    title: "Blockchain Audit",
    subtitle: "Celo Sepolia Testnet",
    description: "SHA-256 proof-of-deletion hash is minted on-chain, creating an immutable, auditable record of responsible data disposal and carbon savings.",
    icon: "link",
    status: "pending" as const,
  },
];

export const techStack = [
  {
    name: "Python",
    role: "Legacy Data Miner",
    description: "Custom EBCDIC/COMP-3 binary parser for mainframe data extraction",
    color: "primary" as const,
    icon: "code",
  },
  {
    name: "DistilBERT",
    role: "Green AI Classifier",
    description: "40% smaller, 60% faster than BERT — energy-efficient text classification",
    color: "success" as const,
    icon: "brain",
  },
  {
    name: "Microsoft Presidio",
    role: "PII Security Engine",
    description: "Enterprise NLP for detecting names, SSNs, emails, and 20+ entity types",
    color: "toxic" as const,
    icon: "shield",
  },
  {
    name: "Celo Blockchain",
    role: "Carbon Credit Ledger",
    description: "Proof-of-stake chain with 99.99% less energy than proof-of-work networks",
    color: "accent" as const,
    icon: "link",
  },
  {
    name: "Streamlit",
    role: "Rapid Prototyping UI",
    description: "Python-native web framework for data science dashboards and demos",
    color: "warning" as const,
    icon: "layout",
  },
  {
    name: "SHA-256",
    role: "Proof-of-Deletion",
    description: "Cryptographic hash function creating tamper-proof deletion certificates",
    color: "primary" as const,
    icon: "lock",
  },
];

export const impactStats = [
  { label: "Records Processed", value: "15,847", suffix: "", icon: "database" },
  { label: "Digital Waste Removed", value: "6,234", suffix: "records", icon: "trash" },
  { label: "Carbon Saved", value: "31.17", suffix: "kgCO₂e", icon: "leaf" },
  { label: "Blockchain Proofs", value: "47", suffix: "on-chain", icon: "link" },
  { label: "PII Records Secured", value: "2,891", suffix: "flagged", icon: "shield" },
  { label: "Processing Speed", value: "2.3", suffix: "sec/batch", icon: "zap" },
];
