import fs from "fs";

// 辅助函数：随机数 [min, max)
const rand = (min, max) => min + Math.random() * (max - min);
// 随机整数 [min, max]
const randInt = (min, max) => Math.floor(min + Math.random() * (max - min + 1));

// 预置 SMARTS 片段，随机组合产生合理 SMILES (简化版)
const fragments = [
  "CC(C)CC",
  "C1=CC=CC=C1",
  "CCO",
  "NC(=O)C",
  "CF",
  "Cl",
  "c1ccccc1",
  "CC(=O)O",
  "CN(C)C",
  "C#N",
  "CS(=O)(=O)C",
  "OCCO",
  "CCN",
  "c1ccncc1",
  "C1CCCCC1",
  "CC(C)=O",
  "COC",
  "CCOC",
  "c1ccccc1C",
  "CCCC",
  "CC(C)O",
];

function randomSMILES() {
  const n = randInt(2, 5);
  let smiles = fragments[randInt(0, fragments.length - 1)];
  for (let i = 1; i < n; i++) {
    smiles += "." + fragments[randInt(0, fragments.length - 1)];
  }
  return smiles;
}

const molecules = [];
for (let id = 1; id <= 10000; id++) {
  const logP = rand(-2, 6);
  const mw = rand(200, 800);
  // 某些性质之间存在相关性（如 logP 与分子量正相关）
  molecules.push({
    id,
    smiles: randomSMILES(),
    logP: parseFloat(logP.toFixed(2)),
    molecular_weight: parseFloat(mw.toFixed(1)),
    hba: randInt(0, 12),
    hbd: randInt(0, 8),
    tpsa: parseFloat(rand(0, 200).toFixed(1)),
    charge: randInt(-2, 2),
    rotatable_bonds: randInt(0, 15),
    ring_count: randInt(0, 5),
    // 模拟 ΔΔG：与 logP、分子量、HBA 等相关
    predicted_ddg: parseFloat(
      (-3 + logP * 0.2 - (mw - 500) / 100 + Math.random() * 2 - 1).toFixed(2),
    ),
    confidence: parseFloat((0.5 + Math.random() * 0.5).toFixed(2)),
  });
}

fs.writeFileSync("molecules.json", JSON.stringify(molecules, null, 2));
