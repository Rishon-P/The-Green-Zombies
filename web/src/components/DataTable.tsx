import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, AlertTriangle, Leaf, Shield, Search, Filter } from "lucide-react";
import type { MainframeRecord } from "@/data/mockData";

interface DataTableProps {
  records: MainframeRecord[];
  showClassification: boolean;
}

const classificationConfig = {
  TOXIC: {
    label: "🔴 TOXIC (PII Found)",
    bg: "bg-toxic/10",
    border: "border-toxic/30",
    text: "text-toxic",
    icon: Shield,
  },
  ROT: {
    label: "🟢 ROT (Digital Waste)",
    bg: "bg-primary/10",
    border: "border-primary/30",
    text: "text-primary",
    icon: Leaf,
  },
  CRITICAL: {
    label: "🟡 CRITICAL (Keep)",
    bg: "bg-warning/10",
    border: "border-warning/30",
    text: "text-warning",
    icon: AlertTriangle,
  },
};

const DataTable = ({ records, showClassification }: DataTableProps) => {
  const [sortField, setSortField] = useState<"id" | "classification">("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const toggleSort = (field: "id" | "classification") => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = records
    .filter((r) => {
      if (filterType !== "all" && r.classification !== filterType) return false;
      if (searchQuery && !r.text.toLowerCase().includes(searchQuery.toLowerCase()) && !r.account_id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === "id") cmp = a.id - b.id;
      else cmp = (a.classification || "").localeCompare(b.classification || "");
      return sortDir === "asc" ? cmp : -cmp;
    });

  return (
    <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
      {/* Table header controls */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-heading font-semibold text-foreground">
            Mainframe Records
          </span>
          <span className="px-2 py-0.5 text-xs font-mono text-primary bg-primary/10 rounded-full">
            {filtered.length} records
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-48 pl-9 pr-3 py-2 text-xs font-mono bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>

          {/* Filter */}
          {showClassification && (
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-9 pr-8 py-2 text-xs font-mono bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="TOXIC">Toxic (PII)</option>
                <option value="ROT">Waste (ROT)</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th
                onClick={() => toggleSort("id")}
                className="px-4 py-3 text-left text-xs font-mono font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
              >
                <div className="flex items-center gap-1">
                  ID
                  {sortField === "id" && (sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-mono font-medium text-muted-foreground">
                Account
              </th>
              <th className="px-4 py-3 text-left text-xs font-mono font-medium text-muted-foreground">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-mono font-medium text-muted-foreground hidden md:table-cell">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-mono font-medium text-muted-foreground hidden lg:table-cell">
                Content
              </th>
              {showClassification && (
                <>
                  <th
                    onClick={() => toggleSort("classification")}
                    className="px-4 py-3 text-left text-xs font-mono font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      Classification
                      {sortField === "classification" && (sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-mono font-medium text-muted-foreground hidden sm:table-cell">
                    Confidence
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((record, index) => {
              const config = record.classification ? classificationConfig[record.classification as keyof typeof classificationConfig] : null;
              const isExpanded = expandedRow === record.id;

              return (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => setExpandedRow(isExpanded ? null : record.id)}
                  className={`border-b border-border/50 cursor-pointer transition-colors hover:bg-secondary/30 ${
                    config ? config.bg + "/30" : ""
                  }`}
                >
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">#{record.id}</td>
                  <td className="px-4 py-3 text-xs font-mono text-foreground">{record.account_id}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-secondary rounded text-secondary-foreground">
                      {record.record_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground hidden md:table-cell">{record.date}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell max-w-xs truncate">
                    {record.text}
                  </td>
                  {showClassification && config && (
                    <>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono rounded-full border ${config.border} ${config.bg} ${config.text}`}>
                          <config.icon className="w-3 h-3" />
                          {record.classification}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground hidden sm:table-cell">
                        {((record.confidence || 0) * 100).toFixed(1)}%
                      </td>
                    </>
                  )}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center text-muted-foreground">
          <p className="text-sm">No records match the current filter</p>
        </div>
      )}
    </div>
  );
};

export default DataTable;
