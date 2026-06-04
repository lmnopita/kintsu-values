"use client";
import { useState, useRef } from "react";

const dimensions = [
  {
    id: "intensity",
    name: "Day-to-Day Intensity",
    category: "practical",
    descriptor: "How much does the volume of work matter to you — the pace, the meetings, the cognitive demand, and how much the job asks of you hour to hour?",
    color: "#5B8A8A",
    emoji: "⚡",
  },
  {
    id: "emotional",
    name: "Emotional Fit",
    category: "lifestyle",
    descriptor: "How important is it that the people and culture around your work feel kind — to your mood, your energy, and your relationships?",
    color: "#A07860",
    emoji: "🌿",
  },
  {
    id: "purpose",
    name: "Sense of Purpose",
    category: "lifestyle",
    descriptor: "How much do you need your work to reflect what you actually stand for?",
    color: "#7A6A9A",
    emoji: "🧭",
  },
  {
    id: "stability",
    name: "Stability & Safety",
    category: "lifestyle",
    descriptor: "How much do you need the organizational structure around you to feel predictable — clear expectations, consistent leadership, no low-grade threat?",
    color: "#4A7A6A",
    emoji: "🪨",
  },
];

const summaries = {
  intensity: {
    1: "Logistical demand is your primary filter. When you evaluate a role, you're reading the actual structure of the day — how many meetings, how much oversight, how much cognitive load. In the Kintsu calculator, lower logistical demand scores better for you.",
    2: "Logistical demand matters to you, though something else pulls ahead. You're aware of what a role asks of your time and bandwidth — you just weigh it alongside other things.",
    3: "You can adapt to a range of logistical demands. This isn't indifference — you notice when it's too much — but it's not your deciding factor.",
    4: "Logistical demand is something you can flex around. You're not indifferent to it, but it rarely makes or breaks a decision for you.",
  },
  emotional: {
    1: "Emotional ease is your primary filter. You know that no salary compensates for work that chips away at you. In the Kintsu calculator, roles that feel emotionally light and manageable score highest here.",
    2: "Emotional ease ranks high for you. You're not willing to white-knuckle your way through a role that doesn't feel right — you just weigh it alongside something else first.",
    3: "You care about emotional ease, even if other factors pull ahead. You'll tolerate some friction but not indefinitely.",
    4: "You're resilient in variable emotional environments. This gives you range — but it also means you may sometimes stay too long in conditions that quietly cost you.",
  },
  purpose: {
    1: "Meaning isn't optional for you — it's load-bearing. Work that doesn't connect to something real tends to hollow you out over time. In the Kintsu calculator, strong values alignment scores highest here.",
    2: "Purpose ranks high. You can tolerate imperfect conditions if the work itself feels worth doing — but empty roles don't hold you.",
    3: "You value purpose but can separate it from the paycheck when needed. You're pragmatic without being cynical.",
    4: "You're not dependent on your job to deliver meaning. That's a genuine freedom — and worth knowing about yourself.",
  },
  stability: {
    1: "Environmental predictability is your primary filter. It's not about avoiding challenge — it's that an unstable environment consumes the bandwidth you need for everything else. In the Kintsu calculator, roles that feel settled and regulated score highest here.",
    2: "Stability and safety rank high for you. You can navigate some uncertainty, but you do it at a cost — and you know it.",
    3: "You value a stable environment, though you can work through uncertainty when other conditions support you.",
    4: "You're comfortable with ambiguity and change. This makes you adaptable — though it's worth checking whether you've simply normalized instability.",
  },
};

function getPattern(rankedItems) {
  const top = rankedItems[0];
  const second = rankedItems[1];
  const bothLifestyle = top.category === "lifestyle" && second.category === "lifestyle";
  const practicalFirst = top.category === "practical" && second.category === "lifestyle";
  const lifestyleFirst = top.category === "lifestyle" && second.category === "practical";

  if (bothLifestyle) {
    return `Your top two priorities are both lifestyle factors — meaning how work feels consistently outweighs how it's structured on paper. You're not ignoring the practical side; you're filtering through lived experience first. The Kintsu calculator is built for exactly this: it gives weight to the signals that standard job descriptions don't surface.`;
  }
  if (practicalFirst) {
    return `You lead with a practical metric, then check the lifestyle layer. You're grounded in logistical reality first — but you haven't abandoned the somatic signal entirely. That balance is useful: it keeps you honest without letting structure override everything that actually matters about how work feels.`;
  }
  if (lifestyleFirst) {
    return `You lead with a lifestyle factor, then keep one foot in logistical reality. Your instincts set the direction and your practicality keeps it honest. In the Kintsu calculator, this means your highest weight sits with a felt signal — which is exactly the kind of input the framework is designed to take seriously.`;
  }
  return `Your values profile reflects a mix of practical and lifestyle priorities. The Kintsu calculator is designed to hold both — giving structure to the signals that are hardest to articulate.`;
}

function Confetti({ active }) {
  if (!active) return null;
  const pieces = Array.from({ length: 70 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 2 + Math.random() * 2,
    color: ["#5B8A8A", "#A07860", "#7A6A9A", "#4A7A6A", "#D4A868", "#C8847A", "#8BAF9A"][Math.floor(Math.random() * 7)],
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
  }));

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 100, overflow: "hidden" }}>
      {pieces.map((p) => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.left}%`, top: "-20px",
          width: p.size, height: p.size, backgroundColor: p.color,
          borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          transform: `rotate(${p.rotation}deg)`,
          animation: `fall ${p.duration}s ${p.delay}s ease-in forwards`,
        }} />
      ))}
      <style>{`@keyframes fall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } }`}</style>
    </div>
  );
}

export default function ValuesProfile() {
  const [items, setItems] = useState(dimensions);
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleDragStart = (index) => { dragItem.current = index; };
  const handleDragEnter = (index) => { dragOverItem.current = index; };
  const handleDragEnd = () => {
    const newItems = [...items];
    const dragged = newItems.splice(dragItem.current, 1)[0];
    newItems.splice(dragOverItem.current, 0, dragged);
    dragItem.current = null;
    dragOverItem.current = null;
    setItems(newItems);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  const handleReset = () => {
    setItems(dimensions);
    setSubmitted(false);
    setShowConfetti(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#D4CFC4", padding: 0 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Jost', sans-serif; background: #D4CFC4; }
        .drag-card { cursor: grab; user-select: none; transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .drag-card:active { cursor: grabbing; transform: scale(1.02); box-shadow: 0 14px 40px rgba(0,0,0,0.13); }
        .drag-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.09); }
        .reveal-btn { transition: all 0.2s ease; border: none; cursor: pointer; }
        .reveal-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(91,138,138,0.4); }
        .result-card { animation: fadeUp 0.5s ease forwards; opacity: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .pattern-block { animation: fadeUp 0.4s ease forwards; opacity: 0; }
        .back-link { color: #5A524A; text-decoration: none; font-size: 12px; letter-spacing: 1px; }
        .back-link:hover { color: #2A2420; }
      `}</style>

      <Confetti active={showConfetti} />

      {/* Header */}
      <div style={{ background: "#D4CFC4", padding: "32px 24px 0", textAlign: "center" }}>
        <div style={{ textAlign: "left", maxWidth: "600px", margin: "0 auto 24px" }}>
          <a href="https://kintsu.odoo.com" className="back-link">← kintsu.odoo.com</a>
        </div>
      </div>
      <div style={{ background: "#D4CFC4", padding: "40px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden", minHeight: "200px" }}>
        {/* Triangle brand motif — matches Odoo page grid pattern */}
        <div style={{ position: "absolute", bottom: 0, right: 0, lineHeight: 0 }}>
          <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Row 1 - top */}
            <polygon points="80,0 120,0 80,40" fill="#1C1C1A"/>
            <polygon points="120,0 160,0 160,40" fill="#6B6B6B"/>
            <polygon points="120,0 160,40 120,40" fill="#D4CFC4"/>
            <polygon points="80,0 120,40 80,40" fill="#9A9590"/>
            {/* Row 2 */}
            <polygon points="80,40 120,40 80,80" fill="#D4CFC4"/>
            <polygon points="120,40 160,40 120,80" fill="#1C1C1A"/>
            <polygon points="120,40 160,80 120,80" fill="#9A9590"/>
            <polygon points="80,40 120,80 80,80" fill="#6B6B6B"/>
            {/* Row 3 */}
            <polygon points="80,80 120,80 80,120" fill="#6B6B6B"/>
            <polygon points="120,80 160,80 120,120" fill="#D4CFC4"/>
            <polygon points="120,80 160,120 120,120" fill="#1C1C1A"/>
            <polygon points="80,80 120,120 80,120" fill="#D4CFC4"/>
            {/* Row 4 - bottom */}
            <polygon points="80,120 120,120 80,160" fill="#9A9590"/>
            <polygon points="120,120 160,120 120,160" fill="#6B6B6B"/>
            <polygon points="120,120 160,160 120,160" fill="#D4CFC4"/>
            <polygon points="80,120 120,160 80,160" fill="#1C1C1A"/>
            {/* Left column extension */}
            <polygon points="40,80 80,80 40,120" fill="#9A9590"/>
            <polygon points="40,80 80,120 40,120" fill="#1C1C1A"/>
            <polygon points="40,120 80,120 40,160" fill="#D4CFC4"/>
            <polygon points="40,120 80,160 40,160" fill="#6B6B6B"/>
          </svg>
        </div>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "3px", color: "#5B8A8A", textTransform: "uppercase", fontWeight: 500, marginBottom: "16px" }}>
          Kintsu
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(30px, 6vw, 50px)", fontWeight: 400, color: "#2A2420", lineHeight: 1.2, marginBottom: "18px" }}>
          Your Values Profile
        </h1>
        <div style={{ width: "40px", height: "2px", background: "#5B8A8A", margin: "0 auto 20px" }} />
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "15px", color: "#5A524A", maxWidth: "460px", margin: "0 auto", lineHeight: 1.7, fontWeight: 300 }}>
          You already know what matters to you.<BR>This is a structured way to surface it.</BR>
        </p>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "44px 20px 80px" , background: "#D4CFC4" }}>

        {!submitted ? (
          <>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#9A8F84", textAlign: "center", marginBottom: "32px", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 500 }}>
              Drag to rank — most important at the top
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "40px" }}>
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="drag-card"
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "10px",
                    padding: "18px 22px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                    borderLeft: `4px solid ${item.color}`,
                  }}
                >
                  <div style={{
                    width: "30px", height: "30px", borderRadius: "50%", flexShrink: 0,
                    background: index === 0 ? item.color : "#EDE8E0",
                    color: index === 0 ? "#fff" : "#9A8F84",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Jost', sans-serif", fontSize: "13px", fontWeight: 600,
                  }}>
                    {index + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "17px", fontWeight: 600, color: "#2A2420" }}>
                        {item.name}
                      </h3>
                    </div>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#7A726A", lineHeight: 1.6, fontWeight: 300 }}>
                      {item.descriptor}
                    </p>
                  </div>
                  {/* Triangle drag handle */}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.35 }}>
                    <polygon points="8,0 16,16 0,16" fill="#2A2420"/>
                  </svg>
                </div>
              ))}
            </div>

            <button
              className="reveal-btn"
              onClick={handleSubmit}
              style={{
                width: "100%", padding: "17px",
                background: "#5B8A8A", color: "#fff",
                borderRadius: "8px",
                fontFamily: "'Jost', sans-serif", fontSize: "14px",
                fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase",
              }}
            >
              Reveal My Values Profile
            </button>
          </>
        ) : (
          <>
            <div className="pattern-block" style={{
              background: "#1C1C1A", borderRadius: "12px",
              padding: "32px 28px", marginBottom: "32px",
              borderLeft: `4px solid ${items[0].color}`,
            }}>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "3px", color: "#5B8A8A", textTransform: "uppercase", marginBottom: "10px", fontWeight: 500 }}>
                Your Profile
              </p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 400, color: "#F0EBE3", marginBottom: "16px", lineHeight: 1.3 }}>
                You lead with{" "}
                <em style={{ color: items[0].color }}>{items[0].name}</em>
              </h2>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "14px", color: "#B0A898", lineHeight: 1.75, fontWeight: 300 }}>
                {getPattern(items)}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "40px" }}>
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="result-card"
                  style={{
                    background: "#FFFFFF", borderRadius: "10px",
                    padding: "20px 22px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                    borderLeft: `4px solid ${item.color}`,
                    animationDelay: `${index * 0.1 + 0.2}s`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <div style={{
                      width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0,
                      background: item.color, color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Jost', sans-serif", fontSize: "11px", fontWeight: 600,
                    }}>
                      {index + 1}
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "17px", fontWeight: 600, color: "#2A2420" }}>
                      {item.name}
                    </h3>
                    <span style={{
                      fontSize: "9px", fontFamily: "'Jost', sans-serif", fontWeight: 600,
                      letterSpacing: "1.5px", textTransform: "uppercase",
                      color: item.category === "practical" ? "#5B8A8A" : "#7A6A9A",
                      background: item.category === "practical" ? "#EBF3F3" : "#F0EDF6",
                      padding: "2px 7px", borderRadius: "20px",
                    }}>
                      {item.category}
                    </span>
                  </div>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#5A524A", lineHeight: 1.7, fontWeight: 300 }}>
                    {summaries[item.id][index + 1]}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{
              background: "#FFFFFF", borderRadius: "12px",
              padding: "32px 28px", textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
              marginBottom: "20px",
              border: "1px solid #E8E2DA",
            }}>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "3px", color: "#9A8F84", textTransform: "uppercase", marginBottom: "12px", fontWeight: 500 }}>
                Next Step
              </p>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 400, color: "#2A3B32", marginBottom: "12px", lineHeight: 1.4 }}>
                Now apply your profile to actual opportunities
              </h3>
              <div style={{ width: "30px", height: "1px", background: "#5B8A8A", margin: "0 auto 16px" }} />
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#7A726A", lineHeight: 1.7, marginBottom: "8px", fontWeight: 300 }}>
                The Kintsu Base Calculator scores any job listing against the four dimensions you just ranked — giving you a clear, structured signal on whether it's worth your time and energy.
              </p>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#7A726A", lineHeight: 1.7, marginBottom: "24px", fontWeight: 300 }}>
                When you're ready to adjust those weights yourself — dialing each dimension up or down based on what you've learned — that's what the Kintsu Pro Upgrade is for.
              </p>
              <a
                href="https://gumroad.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block", padding: "14px 36px",
                  background: "#2A3B32", color: "#EDE8E0",
                  borderRadius: "6px",
                  fontFamily: "'Jost', sans-serif", fontSize: "12px",
                  fontWeight: 600, textDecoration: "none",
                  letterSpacing: "1.5px", textTransform: "uppercase",
                  marginBottom: "14px",
                }}
              >
                Get the Kintsu Base Calculator →
              </a>
              <br />
              <a
                href="https://gumroad.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'Jost', sans-serif", fontSize: "12px",
                  color: "#7A726A", textDecoration: "underline",
                  letterSpacing: "0.5px", fontWeight: 400,
                }}
              >
                Learn about the Pro Upgrade
              </a>
            </div>

            <button
              onClick={handleReset}
              style={{
                width: "100%", padding: "12px", background: "transparent",
                color: "#9A8F84", border: "1px solid #D8D0C8", borderRadius: "6px",
                fontFamily: "'Jost', sans-serif", fontSize: "12px",
                cursor: "pointer", letterSpacing: "1px", textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Start Over
            </button>
          </>
        )}

        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "#8A8278", textAlign: "center", marginTop: "40px", lineHeight: 1.7, fontWeight: 300 }}>
          This tool is not a substitute for professional career, psychological, or financial advice.<br />
          © 2026 Kintsu
        </p>
      </div>
    </div>
  );
}
