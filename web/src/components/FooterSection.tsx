import { Leaf, Github, Twitter, Globe, Heart } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="relative py-16 border-t border-border">
      <div className="absolute inset-0 bg-gradient-dark opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-6 h-6 text-primary" />
              <span className="text-lg font-heading font-bold text-foreground">Eco-Vault</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mb-4">
              The Green Data Scavenger — mining legacy data, classifying with energy-efficient AI,
              and minting blockchain-verified carbon credits for responsible data disposal.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Github, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Globe, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="p-2 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Tech */}
          <div>
            <h4 className="text-sm font-heading font-semibold text-foreground mb-4">Technology</h4>
            <ul className="space-y-2">
              {["DistilBERT (Green AI)", "Microsoft Presidio", "Celo Blockchain", "Python Legacy Miner", "SHA-256 Hashing"].map((item) => (
                <li key={item} className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-heading font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              {["Documentation", "API Reference", "Research Paper", "Carbon Calculator", "Open Source"].map((item) => (
                <li key={item} className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2025 Eco-Vault. Built for Hackathon 2025.
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            Made with <Heart className="w-3 h-3 text-toxic" /> for the planet
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
