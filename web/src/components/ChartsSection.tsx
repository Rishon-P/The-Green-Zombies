import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend, LineChart, Line
} from "recharts";
import { chartData, energyData } from "@/data/mockData";

const pieData = [
  { name: "Digital Waste (ROT)", value: 42, color: "hsl(145, 72%, 40%)" },
  { name: "PII Records (TOXIC)", value: 18, color: "hsl(0, 72%, 51%)" },
  { name: "Critical (Keep)", value: 40, color: "hsl(45, 93%, 47%)" },
];

const complianceData = [
  { month: "Jul", gdpr: 87, hipaa: 92, sox: 78 },
  { month: "Aug", gdpr: 89, hipaa: 94, sox: 81 },
  { month: "Sep", gdpr: 91, hipaa: 93, sox: 85 },
  { month: "Oct", gdpr: 93, hipaa: 95, sox: 88 },
  { month: "Nov", gdpr: 95, hipaa: 96, sox: 91 },
  { month: "Dec", gdpr: 97, hipaa: 98, sox: 94 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="p-3 rounded-lg border border-border bg-card/95 backdrop-blur-sm shadow-xl">
      <p className="text-xs font-mono text-muted-foreground mb-1">{label}</p>
      {payload.map((entry: any, index: number) => (
        <p key={index} className="text-xs font-mono" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

const ChartsSection = () => {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 mb-4 text-xs font-mono text-primary bg-primary/10 rounded-full border border-primary/20">
            ANALYTICS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Environmental Impact Analytics
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Track carbon savings, data classification trends, and compliance scores over time
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Classification Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm"
          >
            <h3 className="text-sm font-heading font-semibold text-foreground mb-1">Classification Trends</h3>
            <p className="text-xs text-muted-foreground mb-4">Records classified per month by category</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 15%, 16%)" />
                <XAxis dataKey="month" tick={{ fill: "hsl(150, 10%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(150, 10%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="waste" name="Waste (ROT)" fill="hsl(145, 72%, 40%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pii" name="PII (TOXIC)" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="critical" name="Critical" fill="hsl(45, 93%, 47%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Carbon Savings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm"
          >
            <h3 className="text-sm font-heading font-semibold text-foreground mb-1">Carbon Savings vs Baseline</h3>
            <p className="text-xs text-muted-foreground mb-4">kgCO₂e saved through digital waste deletion</p>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={energyData}>
                <defs>
                  <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(145, 72%, 40%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(145, 72%, 40%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 15%, 16%)" />
                <XAxis dataKey="month" tick={{ fill: "hsl(150, 10%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(150, 10%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="saved" name="Carbon Saved" stroke="hsl(145, 72%, 40%)" fill="url(#colorSaved)" strokeWidth={2} />
                <Area type="monotone" dataKey="baseline" name="Baseline Emissions" stroke="hsl(0, 72%, 51%)" fill="url(#colorBaseline)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm"
          >
            <h3 className="text-sm font-heading font-semibold text-foreground mb-1">Data Distribution</h3>
            <p className="text-xs text-muted-foreground mb-4">Overall classification breakdown</p>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => <span className="text-xs font-mono text-muted-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Compliance Scores */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm"
          >
            <h3 className="text-sm font-heading font-semibold text-foreground mb-1">Compliance Scores</h3>
            <p className="text-xs text-muted-foreground mb-4">GDPR, HIPAA, and SOX compliance tracking</p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 15%, 16%)" />
                <XAxis dataKey="month" tick={{ fill: "hsl(150, 10%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[70, 100]} tick={{ fill: "hsl(150, 10%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="gdpr" name="GDPR" stroke="hsl(145, 72%, 40%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="hipaa" name="HIPAA" stroke="hsl(170, 60%, 35%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="sox" name="SOX" stroke="hsl(45, 93%, 47%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ChartsSection;
