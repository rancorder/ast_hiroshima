"use client";
import { useEffect, useRef } from "react";

interface Vec3 { x: number; y: number; z: number }
interface Projected { px: number; py: number; scale: number }

const project = (
  x: number, y: number, z: number,
  rx: number, ry: number,
  W: number, H: number
): Projected => {
  const cosX = Math.cos(rx), sinX = Math.sin(rx);
  const cosY = Math.cos(ry), sinY = Math.sin(ry);
  const y2 = y * cosX - z * sinX;
  const z2 = y * sinX + z * cosX;
  const x2 = x * cosY + z2 * sinY;
  const z3 = -x * sinY + z2 * cosY;
  const scale = 500 / (500 + z3);
  return { px: x2 * scale + W / 2, py: y2 * scale + H / 2, scale };
};

const hexToRgb = (hex: string) => ({
  r: parseInt(hex.slice(1, 3), 16),
  g: parseInt(hex.slice(3, 5), 16),
  b: parseInt(hex.slice(5, 7), 16),
});

const drawBox = (
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, cz: number,
  w: number, h: number, d: number,
  color: string, rx: number, ry: number,
  W: number, H: number
) => {
  const hw = w / 2, hh = h / 2, hd = d / 2;
  const offsets: [number, number, number][] = [
    [-hw, -hh, -hd], [hw, -hh, -hd], [hw, hh, -hd], [-hw, hh, -hd],
    [-hw, -hh,  hd], [hw, -hh,  hd], [hw, hh,  hd], [-hw, hh,  hd],
  ];
  const verts = offsets.map(([ox, oy, oz]) =>
    project(cx + ox, cy + oy, cz + oz, rx, ry, W, H)
  );

  const faces: [number, number, number, number, number][] = [
    [0,1,2,3, 0.82], [4,5,6,7, 1.0],
    [0,1,5,4, 0.68], [3,2,6,7, 0.72],
    [0,3,7,4, 0.58], [1,2,6,5, 0.63],
  ];
  faces.sort((a, b) => {
    const da = a.slice(0,4).reduce((s, i) => s + verts[i as number].scale, 0) / 4;
    const db = b.slice(0,4).reduce((s, i) => s + verts[i as number].scale, 0) / 4;
    return da - db;
  });

  const { r, g, b } = hexToRgb(color);
  faces.forEach(([i0, i1, i2, i3, br]) => {
    ctx.beginPath();
    ctx.moveTo(verts[i0].px, verts[i0].py);
    [i1, i2, i3].forEach(i => ctx.lineTo(verts[i].px, verts[i].py));
    ctx.closePath();
    ctx.fillStyle = `rgba(${Math.round(r * br)},${Math.round(g * br)},${Math.round(b * br)},0.94)`;
    ctx.strokeStyle = "rgba(100,210,200,0.25)";
    ctx.lineWidth = 0.7;
    ctx.fill();
    ctx.stroke();
  });
};

interface Machine { cx: number; cy: number; cz: number; w: number; h: number; d: number; color: string }
const MACHINES: Machine[] = [
  { cx: -130, cy: 20, cz: -70, w: 90,  h: 65, d: 80,  color: "#1a3a4a" },
  { cx:  70,  cy: 30, cz: -45, w: 110, h: 55, d: 90,  color: "#1a2f3f" },
  { cx: -45,  cy: 50, cz:  90, w: 65,  h: 35, d: 65,  color: "#152535" },
  { cx:  160, cy: 40, cz:  65, w: 75,  h: 45, d: 75,  color: "#1a3040" },
  { cx: -170, cy: 40, cz:  85, w: 55,  h: 55, d: 55,  color: "#162030" },
  // floor
  { cx: 0,    cy: 65, cz:  0,  w: 420, h: 6,  d: 420, color: "#0c1d2a" },
];

interface FlowLabel { pos: [number,number,number]; text: string }
const LABELS: FlowLabel[] = [
  { pos: [-130, -5, -70], text: "加工A" },
  { pos: [70,   -5, -45], text: "組立B" },
  { pos: [160,  -5,  65], text: "検査C" },
];

export default function Factory3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse   = useRef({ down: false, lastX: 0, lastY: 0 });
  const rotation = useRef({ x: -0.28, y: 0.45 });
  const animRef  = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = 0, H = 0;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W * devicePixelRatio;
      canvas.height = H * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const { x: rx, y: ry } = rotation.current;

      // grid floor
      ctx.strokeStyle = "rgba(100,200,180,0.06)";
      ctx.lineWidth = 0.5;
      for (let i = -6; i <= 6; i++) {
        const a = project(i * 40, 68, -250, rx, ry, W, H);
        const b = project(i * 40, 68,  250, rx, ry, W, H);
        const c = project(-250, 68, i * 40, rx, ry, W, H);
        const d = project( 250, 68, i * 40, rx, ry, W, H);
        ctx.beginPath(); ctx.moveTo(a.px, a.py); ctx.lineTo(b.px, b.py); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(c.px, c.py); ctx.lineTo(d.px, d.py); ctx.stroke();
      }

      // machines
      MACHINES.forEach(m => drawBox(ctx, m.cx, m.cy, m.cz, m.w, m.h, m.d, m.color, rx, ry, W, H));

      // flow arrows
      const flowPts: [number,number,number][] = [[-130,15,-70],[70,15,-45],[160,15,65]];
      ctx.strokeStyle = "rgba(100,220,200,0.55)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([7, 4]);
      for (let i = 0; i < flowPts.length - 1; i++) {
        const a = project(...flowPts[i], rx, ry, W, H);
        const b = project(...flowPts[i + 1], rx, ry, W, H);
        ctx.beginPath(); ctx.moveTo(a.px, a.py); ctx.lineTo(b.px, b.py); ctx.stroke();
      }
      ctx.setLineDash([]);

      // labels
      LABELS.forEach(({ pos, text }) => {
        const p = project(...pos, rx, ry, W, H);
        ctx.font = `${Math.round(12 * Math.max(p.scale, 0.6))}px 'Noto Sans JP', sans-serif`;
        ctx.fillStyle = "rgba(100,220,200,0.8)";
        ctx.textAlign = "center";
        ctx.fillText(text, p.px, p.py);
      });
    };

    const animate = () => {
      if (!mouse.current.down) rotation.current.y += 0.0025;
      draw();
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    const getXY = (e: MouseEvent | TouchEvent) =>
      "touches" in e
        ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
        : { x: e.clientX, y: e.clientY };

    const onDown = (e: MouseEvent | TouchEvent) => {
      mouse.current.down = true;
      const { x, y } = getXY(e);
      mouse.current.lastX = x;
      mouse.current.lastY = y;
    };
    const onUp = () => { mouse.current.down = false; };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!mouse.current.down) return;
      const { x, y } = getXY(e);
      rotation.current.y += (x - mouse.current.lastX) * 0.007;
      rotation.current.x += (y - mouse.current.lastY) * 0.007;
      rotation.current.x = Math.max(-0.75, Math.min(0.15, rotation.current.x));
      mouse.current.lastX = x;
      mouse.current.lastY = y;
    };

    canvas.addEventListener("mousedown",  onDown);
    canvas.addEventListener("mouseup",    onUp);
    canvas.addEventListener("mousemove",  onMove);
    canvas.addEventListener("touchstart", onDown, { passive: true });
    canvas.addEventListener("touchend",   onUp);
    canvas.addEventListener("touchmove",  onMove, { passive: true });
    window.addEventListener("resize",     resize);

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener("mousedown",  onDown);
      canvas.removeEventListener("mouseup",    onUp);
      canvas.removeEventListener("mousemove",  onMove);
      canvas.removeEventListener("touchstart", onDown);
      canvas.removeEventListener("touchend",   onUp);
      canvas.removeEventListener("touchmove",  onMove);
      window.removeEventListener("resize",     resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-grab active:cursor-grabbing block select-none"
    />
  );
}
