import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { GameObject } from "./data";
import Silhouette from "./Silhouette";
import { clamp, MAX_RATIO, meters, score, errorLabel } from "./game";

function labelLines(name: string) {
  const lines: string[] = [];
  for (const word of name.split(" ")) {
    const last = lines.length - 1;
    if (last >= 0 && (lines[last] + " " + word).length <= 22)
      lines[last] += " " + word;
    else lines.push(word);
  }
  return lines;
}
export default function Board({
  reference,
  target,
  ratio,
  revealed,
  onChange,
  onRevealComplete,
}: {
  reference: GameObject;
  target: GameObject;
  ratio: number;
  revealed: boolean;
  onChange: (v: number) => void;
  onRevealComplete: () => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [narrow, setNarrow] = useState(() => window.innerWidth < 600);
  const [revealProgress, setRevealProgress] = useState(0);
  useEffect(() => {
    if (!revealed) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealProgress(1);
      onRevealComplete();
      return;
    }
    let frame: number;
    const started = performance.now();
    const animate = (now: number) => {
      const t = Math.min(1, (now - started) / 1150);
      setRevealProgress(1 - (1 - t) ** 3);
      if (t < 1) frame = requestAnimationFrame(animate);
      else onRevealComplete();
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [revealed, onRevealComplete]);
  const progress = revealed ? revealProgress : 0;
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const gesture = useRef<{
    mode: "move" | "scale";
    x: number;
    y: number;
    ratio: number;
    offset: { x: number; y: number };
  } | null>(null);
  useEffect(() => {
    const m = matchMedia("(max-width: 599px)");
    const update = () => setNarrow(m.matches);
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);
  const W = narrow ? 420 : 840,
    H = 390,
    horizontal = reference.axis === "x";
  const lane = W / 2 - 60;
  // Both dimensions share one ground line and two side-by-side lanes.
  // Reserve room for the largest allowed estimate without changing the scale
  // while the player resizes an object.
  const largestTargetScale = (reference.size * MAX_RATIO) / target.size;
  const initialK = Math.min(
    275 / reference.height,
    lane / reference.width,
    275 / (target.height * largestTargetScale),
    lane / (target.width * largestTargetScale),
  );
  const actual = target.size / reference.size;
  const answerExtent = Math.max(ratio / actual, 1);
  // Fit both the guess and answer, keeping clear space for the result at top left.
  const resultK = Math.min(
    155 / reference.height,
    lane / reference.width,
    260 / (target.height * answerExtent),
    lane / (target.width * answerExtent),
  );
  const k = initialK + (resultK - initialK) * progress;
  const targetScale = (r: number) => ((reference.size * r) / target.size) * k;
  const s = targetScale(ratio),
    correct = targetScale(ratio + (actual - ratio) * progress);
  const baseY = 320;
  const originX = horizontal ? W * 0.52 : W * 0.72;
  const targetX = (scale: number) =>
    horizontal ? originX : originX - (target.width * scale) / 2;
  const safeOffset = {
    x: clamp(offset.x, 20 - targetX(s), W - 20 - targetX(s) - target.width * s),
    y: clamp(offset.y, 30 - (baseY - target.height * s), H - 30 - baseY),
  };
  const px = targetX(s) + safeOffset.x * (1 - progress),
    py = baseY - target.height * s + safeOffset.y * (1 - progress);
  const referenceX = W * 0.26 - (reference.width * k) / 2;
  const guess = reference.size * ratio;
  const points = score(guess, target.size);
  const point = (e: PointerEvent<SVGElement>) => {
    const ctm = svgRef.current?.getScreenCTM();
    return ctm
      ? new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse())
      : { x: 0, y: 0 };
  };
  function start(e: PointerEvent<SVGElement>, mode: "move" | "scale") {
    if (revealed || e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const p = point(e);
    gesture.current = { mode, x: p.x, y: p.y, ratio, offset: safeOffset };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function move(e: PointerEvent<SVGElement>) {
    const g = gesture.current;
    if (!g || revealed) return;
    const p = point(e);
    if (g.mode === "scale") {
      const d = horizontal ? p.x - g.x : g.y - p.y;
      onChange(clamp(g.ratio + d / (reference.size * k)));
    } else {
      const width = target.width * s,
        height = target.height * s;
      setOffset({
        x: clamp(
          g.offset.x + p.x - g.x,
          20 - targetX(s),
          W - 20 - targetX(s) - width,
        ),
        y: clamp(g.offset.y + p.y - g.y, 30 - (baseY - height), H - 30 - baseY),
      });
    }
  }
  function end() {
    gesture.current = null;
  }
  const handleX = px + target.width * s,
    handleY = py;
  const correctSilhouette = revealed && (
    <g className="correct-silhouette" color="#a7b5c5" opacity={progress * 0.65}>
      <Silhouette
        object={target}
        scale={correct}
        x={targetX(correct) + safeOffset.x * (1 - progress)}
        y={baseY - target.height * correct + safeOffset.y * (1 - progress)}
      />
    </g>
  );
  return (
    <div className="board-wrap">
      <svg
        ref={svgRef}
        className="board"
        viewBox={`0 0 ${W} ${H}`}
        aria-label={`Сравнение: ${reference.name} и ${target.name}`}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
      >
        <defs>
          <pattern
            id="grid"
            width="35"
            height="35"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M35 0H0V35"
              fill="none"
              stroke="#2b3136"
              strokeWidth=".65"
            />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#grid)" />
        {!revealed && (
          <text x="24" y="29" className="board-caption">
            {horizontal ? "СРАВНИВАЕМ ДЛИНУ" : "СРАВНИВАЕМ ВЫСОТУ"}
          </text>
        )}
        <path
          d={`M20 ${baseY}H${W - 20}`}
          stroke="#65717a"
          strokeWidth="1"
          opacity=".5"
        />
        <g color="#61d7c1">
          <Silhouette
            object={reference}
            scale={k}
            x={referenceX}
            y={baseY - reference.height * k}
          />
        </g>
        {actual >= ratio && correctSilhouette}
        <g
          color="#bea5f7"
          className={revealed ? "" : "movable"}
          onPointerDown={(e) => start(e, "move")}
          onLostPointerCapture={end}
        >
          <Silhouette object={target} scale={s} x={px} y={py} opacity={1} />
          {!revealed && (
            <rect
              x={px - 8}
              y={py - 8}
              width={target.width * s + 16}
              height={target.height * s + 16}
              fill="transparent"
              stroke="#bea5f7"
              strokeOpacity=".3"
              strokeDasharray="3 5"
            />
          )}
        </g>
        {actual < ratio && correctSilhouette}
        {!revealed && (
          <g
            className="resize-handle"
            onPointerDown={(e) => start(e, "scale")}
            onLostPointerCapture={end}
            aria-label="Маркер изменения размера"
          >
            <circle
              cx={handleX}
              cy={handleY}
              r={narrow ? 32 : 23}
              fill="transparent"
            />
            <rect
              x={handleX - 10}
              y={handleY - 10}
              width="20"
              height="20"
              rx="5"
              fill="#bea5f7"
            />
            <path
              d={`m${handleX - 4} ${handleY + 4} 8-8m-6 0h6v6`}
              stroke="#151719"
              strokeWidth="1.5"
              fill="none"
            />
          </g>
        )}
        <path
          className="reference-guide"
          d={`M${referenceX + reference.width * k + 12} ${baseY - reference.height * k}V${baseY}`}
          stroke="#61d7c1"
          strokeOpacity=".45"
          strokeDasharray="3 5"
          fill="none"
        />
        <text
          x={W * 0.26}
          y={baseY + 24}
          textAnchor="middle"
          className="object-name"
          fill="#61d7c1"
        >
          {labelLines(reference.name).map((line, i) => (
            <tspan key={i} x={W * 0.26} dy={i ? 16 : 0}>
              {line}
            </tspan>
          ))}
        </text>
        <text
          x={px + (target.width * s) / 2}
          y={py + target.height * s + 24}
          textAnchor="middle"
          className="object-name"
          fill="#bea5f7"
        >
          {labelLines(revealed ? "Твой размер" : target.name).map((line, i) => (
            <tspan key={i} x={px + (target.width * s) / 2} dy={i ? 16 : 0}>
              {line}
            </tspan>
          ))}
        </text>
        {revealed && (
          <g
            className="board-result"
            opacity={Math.min(1, progress * 5)}
            aria-hidden="true"
            pointerEvents="none"
          >
            <rect
              x="15"
              y="14"
              width={narrow ? 216 : 238}
              height="139"
              rx="12"
              fill="#1d2125"
              fillOpacity=".94"
            />
            <text
              x="29"
              y="69"
              fill="#bea5f7"
              fontSize="54"
              fontWeight="600"
              letterSpacing="-2"
            >
              {Math.round(points * progress)}
              <tspan fontSize="18" fill="#d7dee4" letterSpacing="0">
                {" "}
                / 100
              </tspan>
            </text>
            <text x="29" y="95" className="result-measure" fill="#c2cbd2">
              Твой размер:{" "}
              <tspan fill="#f2f3ef" fontWeight="600">
                {meters(guess)}
              </tspan>
            </text>
            <text x="29" y="117" className="result-measure" fill="#c2cbd2">
              Правильный:{" "}
              <tspan fill="#f2f3ef" fontWeight="600">
                {meters(target.size)}
              </tspan>
            </text>
            <text x="29" y="139" className="result-error" fill="#adb7bd">
              {errorLabel(guess, target.size)}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
