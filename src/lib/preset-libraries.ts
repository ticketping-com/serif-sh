export interface PresetDefinition {
  id: string;
  name: string;
  style?: Record<string, string>;
}

export const PRESETS: PresetDefinition[] = [
  {
    id: "indigo-radial",
    name: "Indigo Radial",
    style: {
      background:
        "radial-gradient(125% 125% at 50% 10%, #fff 40%, #6366f1 100%)",
    },
  },
  {
    id: "violet-radial",
    name: "Violet Radial",
    style: {
      background:
        "radial-gradient(125% 125% at 50% 10%, #fff 40%, #7c3aed 100%)",
    },
  },
  {
    id: "slate-radial",
    name: "Slate Radial",
    style: {
      background:
        "radial-gradient(125% 125% at 50% 10%, #fff 40%, #475569 100%)",
    },
  },
  {
    id: "bottom-teal-glow",
    name: "Bottom Teal Glow",
    style: {
      background: "#ffffff",
      backgroundImage: `
      radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #14b8a6 100%)
    `,
      backgroundSize: "100% 100%",
    },
  },
  {
    id: "top-teal-glow",
    name: "Top Teal Glow",
    style: {
      background: "#ffffff",
      backgroundImage: `
      radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #14b8a6 100%)
    `,
      backgroundSize: "100% 100%",
    },
  },
  {
    id: "bottom-pink-glow",
    name: "Bottom Pink Glow",
    style: {
      background: "#ffffff",
      backgroundImage: `
      radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #ec4899 100%)
    `,
      backgroundSize: "100% 100%",
    },
  },
  {
    id: "top-pink-glow",
    name: "Top Pink Glow",
    style: {
      background: "#ffffff",
      backgroundImage: `
      radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #ec4899 100%)
    `,
      backgroundSize: "100% 100%",
    },
  },
  {
    id: "bottom-amber-glow",
    name: "Bottom Amber Glow",
    style: {
      background: "#ffffff",
      backgroundImage: `
      radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #f59e0b 100%)
    `,
      backgroundSize: "100% 100%",
    },
  },
  {
    id: "top-amber-glow",
    name: "Top Amber Glow",
    style: {
      background: "#ffffff",
      backgroundImage: `
      radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #f59e0b 100%)
    `,
      backgroundSize: "100% 100%",
    },
  },
  {
    id: "dark-radial-glow",
    name: "Dark Radial Glow",
    style: {
      background: "#020617",
      backgroundImage:
        "radial-gradient(circle 500px at 50% 200px, #3e3e3e, transparent)",
    },
  },
  {
    id: "blue-radial-glow",
    name: "Blue Radial Glow",
    style: {
      background: "#0f172a",
      backgroundImage:
        "radial-gradient(circle 600px at 50% 50%, rgba(59,130,246,0.3), transparent)",
    },
  },
  {
    id: "purple-radial-glow",
    name: "Purple Radial Glow",
    style: {
      background: "#020617",
      backgroundImage:
        "radial-gradient(circle 500px at 50% 100px, rgba(139,92,246,0.4), transparent)",
    },
  },
  {
    id: "cyan-radial-glow",
    name: "Cyan Radial Glow",
    style: {
      background: "#020617",
      backgroundImage:
        "radial-gradient(circle 500px at 50% 100px, rgba(6,182,212,0.4), transparent)",
    },
  },
  {
    id: "orange-radial-glow",
    name: "Orange Radial Glow",
    style: {
      background: "#020617",
      backgroundImage:
        "radial-gradient(circle 500px at 50% 100px, rgba(249,115,22,0.4), transparent)",
    },
  },
  {
    id: "pink-radial-glow",
    name: "Pink Radial Glow",
    style: {
      background: "#020617",
      backgroundImage:
        "radial-gradient(circle 500px at 50% 100px, rgba(236,72,153,0.4), transparent)",
    },
  },
  {
    id: "gold-radial-glow",
    name: "Gold Radial Glow",
    style: {
      background: "#020617",
      backgroundImage:
        "radial-gradient(circle 500px at 50% 100px, rgba(251,191,36,0.4), transparent)",
    },
  },
  {
    id: "red-radial-glow",
    name: "Red Radial Glow",
    style: {
      background: "#020617",
      backgroundImage:
        "radial-gradient(circle 500px at 50% 100px, rgba(239,68,68,0.4), transparent)",
    },
  },
  {
    id: "lime-radial-glow",
    name: "Lime Radial Glow",
    style: {
      background: "#020617",
      backgroundImage:
        "radial-gradient(circle 500px at 50% 100px, rgba(132,204,22,0.4), transparent)",
    },
  },
  {
    id: "emerald-radial-glow",
    name: "Emerald Radial Glow",
    style: {
      background: "#020617",
      backgroundImage:
        "radial-gradient(circle 500px at 50% 300px, rgba(16,185,129,0.35), transparent)",
    },
  },
];
