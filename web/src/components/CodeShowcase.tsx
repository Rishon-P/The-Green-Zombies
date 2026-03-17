import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, FileCode, Terminal } from "lucide-react";

const codeSnippets = [
  {
    id: "ingestion",
    label: "Legacy Miner",
    filename: "mock_reader.py",
    language: "python",
    code: `def parse_mainframe_file(filepath):
    """Parse EBCDIC-encoded mainframe .dat files
    with COMP-3 packed decimal support."""
    records = []
    with open(filepath, 'rb') as f:
        while chunk := f.read(RECORD_LENGTH):
            text = ebcdic_to_ascii(chunk[:80])
            amount = unpack_comp3(chunk[80:86])
            records.append({
                'text': text,
                'amount': amount,
                'record_type': classify_cobol_type(chunk)
            })
    return records`,
  },
  {
    id: "analysis",
    label: "Green AI",
    filename: "classifier.py",
    language: "python",
    code: `# DistilBERT: 40% smaller, 60% faster than BERT
classifier = pipeline(
    "text-classification",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

for record in mainframe_records:
    # Energy-efficient classification
    result = classifier(record['text'])[0]
    is_waste = result['label'] == 'NEGATIVE'
    
    # Presidio PII detection
    pii_entities = analyzer.analyze(
        text=record['text'],
        entities=None,
        language='en'
    )
    has_pii = len(pii_entities) > 0`,
  },
  {
    id: "blockchain",
    label: "Blockchain",
    filename: "carbon_mint.py",
    language: "python",
    code: `# SHA-256 Proof-of-Deletion
waste_json = waste_records.to_json()
proof_hash = hashlib.sha256(
    waste_json.encode()
).hexdigest()

# Celo Sepolia Transaction
payload = json.dumps({
    "app": "Eco-Vault",
    "action": "DIGITAL_DECARBONIZATION",
    "deleted_records": waste_count,
    "carbon_saved_kg": energy_saved,
    "proof_hash": proof_hash
})

tx = {
    'to': account.address,
    'value': 0,
    'data': w3.to_hex(text=payload),
    'chainId': 11142220  # Celo Sepolia
}
signed = w3.eth.account.sign_transaction(tx, key)
tx_hash = w3.eth.send_raw_transaction(signed)`,
  },
];

const CodeShowcase = () => {
  const [activeTab, setActiveTab] = useState("ingestion");
  const [copied, setCopied] = useState(false);

  const activeSnippet = codeSnippets.find((s) => s.id === activeTab)!;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-dark" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 mb-4 text-xs font-mono text-primary bg-primary/10 rounded-full border border-primary/20">
            SOURCE CODE
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Under the Hood
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Core Python modules powering the Eco-Vault pipeline
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden"
        >
          {/* Tabs */}
          <div className="flex items-center border-b border-border">
            {codeSnippets.map((snippet) => (
              <button
                key={snippet.id}
                onClick={() => setActiveTab(snippet.id)}
                className={`px-4 py-3 text-xs font-mono transition-colors border-b-2 ${
                  activeTab === snippet.id
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {snippet.label}
              </button>
            ))}
            <div className="flex-1" />
            <button
              onClick={handleCopy}
              className="mr-3 p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* File info */}
          <div className="px-4 py-2 border-b border-border/50 flex items-center gap-2">
            <FileCode className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground">{activeSnippet.filename}</span>
          </div>

          {/* Code */}
          <div className="p-6 overflow-x-auto scrollbar-none">
            <pre className="text-sm font-mono text-foreground leading-relaxed">
              {activeSnippet.code.split("\n").map((line, i) => (
                <div key={i} className="flex">
                  <span className="w-8 text-right mr-4 text-muted-foreground/40 select-none text-xs leading-relaxed">
                    {i + 1}
                  </span>
                  <span className="flex-1">
                    {highlightPython(line)}
                  </span>
                </div>
              ))}
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Simple Python syntax highlighting
const highlightPython = (line: string) => {
  const parts: JSX.Element[] = [];
  let remaining = line;
  let key = 0;

  // Comments
  if (remaining.trimStart().startsWith("#")) {
    return <span key={0} className="text-muted-foreground/60 italic">{line}</span>;
  }

  // Simple keyword highlighting
  const keywords = /\b(def|class|import|from|return|if|elif|else|for|while|with|as|try|except|raise|and|or|not|in|is|None|True|False|lambda)\b/g;
  const strings = /("""[^]*?"""|'''[^]*?'''|"[^"]*"|'[^']*'|f"[^"]*"|f'[^']*')/g;
  const builtins = /\b(len|print|open|range|int|float|str|list|dict|set|tuple|enumerate|zip|map|filter)\b/g;

  // Combine into a single pass
  const tokens: { start: number; end: number; type: string; text: string }[] = [];

  let match;
  while ((match = strings.exec(remaining)) !== null) {
    tokens.push({ start: match.index, end: match.index + match[0].length, type: "string", text: match[0] });
  }
  while ((match = keywords.exec(remaining)) !== null) {
    if (!tokens.some(t => match!.index >= t.start && match!.index < t.end)) {
      tokens.push({ start: match.index, end: match.index + match[0].length, type: "keyword", text: match[0] });
    }
  }
  while ((match = builtins.exec(remaining)) !== null) {
    if (!tokens.some(t => match!.index >= t.start && match!.index < t.end)) {
      tokens.push({ start: match.index, end: match.index + match[0].length, type: "builtin", text: match[0] });
    }
  }

  tokens.sort((a, b) => a.start - b.start);

  let pos = 0;
  for (const token of tokens) {
    if (token.start > pos) {
      parts.push(<span key={key++}>{remaining.slice(pos, token.start)}</span>);
    }
    const colorClass =
      token.type === "keyword" ? "text-accent" :
      token.type === "string" ? "text-primary" :
      token.type === "builtin" ? "text-warning" : "";
    parts.push(<span key={key++} className={colorClass}>{token.text}</span>);
    pos = token.end;
  }
  if (pos < remaining.length) {
    parts.push(<span key={key++}>{remaining.slice(pos)}</span>);
  }

  return <>{parts}</>;
};

export default CodeShowcase;
