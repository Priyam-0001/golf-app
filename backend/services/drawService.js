import Score from "../models/Score.js";

// RANDOM DRAW
export const randomDraw = () => {
  const numbers = new Set();

  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }

  return Array.from(numbers);
};

// FREQUENCY DRAW (WEIGHTED)
export const frequencyDraw = async () => {
  const scores = await Score.find();

  const freq = {};

  scores.forEach(s => {
    if (!freq[s.value]) freq[s.value] = 0;
    freq[s.value]++;
  });

  const weighted = [];

  for (const num in freq) {
    for (let i = 0; i < freq[num]; i++) {
      weighted.push(Number(num));
    }
  }

  const result = new Set();

  while (result.size < 5 && weighted.length > 0) {
    const rand = weighted[Math.floor(Math.random() * weighted.length)];
    result.add(rand);
  }

  // fallback if not enough numbers
  while (result.size < 5) {
    result.add(Math.floor(Math.random() * 45) + 1);
  }

  return Array.from(result);
};