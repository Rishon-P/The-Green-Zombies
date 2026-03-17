import { motion } from "framer-motion";

const stats = [
  { value: "99.99%", label: "Less energy than PoW" },
  { value: "40%", label: "Smaller than BERT" },
  { value: "20+", label: "PII entity types" },
  { value: "< 3s", label: "Per batch processing" },
];

const StatsBar = () => {
  return (
    <section className="relative py-16 border-y border-border">
      <div className="absolute inset-0 bg-primary/3" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl sm:text-4xl font-heading font-bold text-gradient-primary mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
