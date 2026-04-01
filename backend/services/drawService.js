import Score from "../models/Score.js";

export async function frequencyDraw() {
    const scores = await Score.find();
    const freq = {};

    scores.forEach(s => {
    freq[s.value] = (freq[s.value] || 0) + 1;
    });

    const pool = [];

    for (let num in freq) {
    for (let i = 0; i < freq[num]; i++) {
        pool.push(Number(num));
    }
    }

    const result = new Set();

    while (result.size < 5 && pool.length > 0) {
    const rand = Math.floor(Math.random() * pool.length);
    result.add(pool[rand]);
    }

    return [...result];
}

export function randomDraw() {
    const numbers = new Set();

    while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    return [...numbers];
}