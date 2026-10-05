const GRADIENTS = [
  ["#7678ED", "#F18701"],
  ["#3D348B", "#F35B04"],
  ["#F7B801", "#F18701"],
  ["#3D348B", "#7678ED"],
  ["#F18701", "#F35B04"],
  ["#7678ED", "#F7B801"],
];

const PATTERNS = [
  (c1, c2) =>
    `linear-gradient(135deg, ${c1}, ${c2}), repeating-linear-gradient(45deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 2px, transparent 2px, transparent 14px)`,
  (c1, c2) =>
    `linear-gradient(135deg, ${c1}, ${c2}), radial-gradient(rgba(255,255,255,0.3) 1.5px, transparent 1.5px)`,
  (c1, c2) =>
    `linear-gradient(135deg, ${c1}, ${c2}), repeating-linear-gradient(0deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 12px), repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 12px)`,
];

const PATTERN_SIZES = ["auto", "14px 14px", "auto"];

const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const getCardVariant = (seed) => {
  const hash = hashString(seed || "");
  const [c1, c2] = GRADIENTS[hash % GRADIENTS.length];
  const patternIndex = Math.floor(hash / GRADIENTS.length) % PATTERNS.length;
  return {
    backgroundImage: PATTERNS[patternIndex](c1, c2),
    backgroundSize: PATTERN_SIZES[patternIndex],
  };
};
