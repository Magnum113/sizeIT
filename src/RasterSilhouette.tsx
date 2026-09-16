import { useId } from "react";
import type { GameObject } from "./data";

export default function RasterSilhouette({ object }: { object: GameObject }) {
  const id = useId();
  const art = object.illustration!;
  const [left, top, width] = art.crop;
  const unit = object.width / width;
  return (
    <>
      <defs>
        <filter id={`${id}-invert`} colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0"
          />
          <feComponentTransfer>
            <feFuncR type="linear" slope="1.1" intercept="-.05" />
            <feFuncG type="linear" slope="1.1" intercept="-.05" />
            <feFuncB type="linear" slope="1.1" intercept="-.05" />
          </feComponentTransfer>
        </filter>
        <mask
          id={`${id}-mask`}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width={object.width}
          height={object.height}
          style={{ maskType: "luminance" }}
        >
          <image
            crossOrigin="anonymous"
            href={`${import.meta.env?.BASE_URL ?? "/"}${art.src}`}
            x={-left * unit}
            y={-top * unit}
            width={art.imageWidth * unit}
            height={art.imageHeight * unit}
            filter={`url(#${id}-invert)`}
          />
        </mask>
      </defs>
      <rect
        width={object.width}
        height={object.height}
        fill="currentColor"
        mask={`url(#${id}-mask)`}
      />
    </>
  );
}
