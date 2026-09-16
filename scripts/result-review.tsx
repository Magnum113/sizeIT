import React, { useCallback, useState } from "react";
import { createRoot } from "react-dom/client";
import Board from "../src/Board";
import { objects, pairs } from "../src/data";
import "../src/style.css";

function Review() {
  const [pairId, setPairId] = useState("paris-space");
  const [ratio, setRatio] = useState(522.2 / 330);
  const [revealed, setRevealed] = useState(false);
  const [ready, setReady] = useState(false);
  const pair = pairs.find((p) => p.id === pairId)!;
  const complete = useCallback(() => setReady(true), []);
  function reset() {
    setRevealed(false);
    setReady(false);
  }
  return (
    <main style={{ maxWidth: 840, margin: "24px auto", padding: 12 }}>
      <h1>Проверка сравнения</h1>
      <div
        style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "20px 0" }}
      >
        <select
          aria-label="Сравнение"
          value={pairId}
          onChange={(e) => {
            setPairId(e.target.value);
            reset();
          }}
        >
          {pairs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
        <label>
          Отношение размеров{" "}
          <input
            aria-label="Отношение размеров"
            type="number"
            min=".15"
            max="1.65"
            step=".01"
            value={ratio}
            onChange={(e) => {
              setRatio(Number(e.target.value));
              reset();
            }}
          />
        </label>
        <button onClick={() => setRevealed(true)} disabled={revealed}>
          Проверить
        </button>
        <button onClick={reset}>Сбросить</button>
        <output>
          {ready ? "Ответ показан" : revealed ? "Анимация" : "Выбор размера"}
        </output>
      </div>
      <Board
        key={`${pairId}-${revealed}`}
        reference={objects[pair.reference]}
        target={objects[pair.target]}
        ratio={ratio}
        revealed={revealed}
        onChange={setRatio}
        onRevealComplete={complete}
      />
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<Review />);
