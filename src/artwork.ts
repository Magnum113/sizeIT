// Generated artwork uses its original pixel aspect ratio. The scored dimension
// calibrates one axis; the other is derived, never stretched independently.
function art(
  id: string,
  imageWidth: number,
  imageHeight: number,
  crop: [number, number, number, number],
  axis: "x" | "y",
  size: number,
  measuredPixels?: number,
) {
  const scale = size / (measuredPixels ?? (axis === "x" ? crop[2] : crop[3]));
  return {
    width: crop[2] * scale,
    height: crop[3] * scale,
    illustration: { src: `art/${id}.png`, imageWidth, imageHeight, crop },
  };
}
export const artwork = {
  whale: art("whale", 2172, 724, [38, 171, 2095, 378], "x", 30),
  trex: art("trex", 2172, 724, [50, 41, 2073, 647], "x", 12),
  bus: art("bus", 1728, 910, [68, 75, 1575, 757], "x", 8.38),
  giraffe: art("giraffe", 1024, 1536, [44, 65, 914, 1374], "y", 5),
  elephant: art("elephant", 1635, 962, [49, 38, 1527, 885], "y", 3.2),
  hoop: art("hoop", 1226, 1283, [118, 43, 1043, 1195], "y", 3.05, 871),
};
