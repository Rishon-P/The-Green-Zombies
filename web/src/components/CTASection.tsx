import { motion } from "framer-motion";
import { ArrowRight, Github, Leaf } from "lucide-react";

const CTASection = () => {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute inset-0 bg-radial-glow opacity-30" />
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 glow-primary mb-8">
            <Leaf className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Ready to Decarbonize<br />Your Data?
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Start mining your legacy data for digital waste today.
            Every byte deleted is a step toward greener data centers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#dashboard"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#dashboard")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold bg-primary text-primary-foreground rounded-xl glow-primary hover:brightness-110 transition-all"
            >
              Try the Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold border border-border text-foreground rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              <Github className="w-4 h-4" />
              View Source
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
