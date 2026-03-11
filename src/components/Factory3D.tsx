"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

// ─── PARTS DATA ───────────────────────────────────────────────────────────────
// [id, layer, geo, pos, rotEuler|null, color, name|null, desc|null]
const PARTS: [string, number, [string, ...number[]], [number,number,number], [number,number,number]|null, number, string|null, string|null][] = [
  ['platform',0,['box',4.6,0.12,3.0],[0,0,0],null,0x2d8f70,'精密定盤','高剛性溶接鋼製定盤。設備全体の基準面として機能し、熱変形を±0.01mm以内に抑制します。'],
  ['foot1',0,['box',0.3,0.62,0.3],[-1.92,-0.37,-1.22],null,0xe05c20,null,null],
  ['foot2',0,['box',0.3,0.62,0.3],[1.92,-0.37,-1.22],null,0xe05c20,null,null],
  ['foot3',0,['box',0.3,0.62,0.3],[-1.92,-0.37,1.22],null,0xe05c20,null,null],
  ['foot4',0,['box',0.3,0.62,0.3],[1.92,-0.37,1.22],null,0xe05c20,null,null],
  ['bf',1,['box',4.3,0.13,0.13],[0,0.13,-1.32],null,0xc8a84b,null,null],
  ['bb',1,['box',4.3,0.13,0.13],[0,0.13,1.32],null,0xc8a84b,null,null],
  ['bl',1,['box',0.13,0.13,2.64],[-2.1,0.13,0],null,0xc8a84b,null,null],
  ['br',1,['box',0.13,0.13,2.64],[2.1,0.13,0],null,0xc8a84b,null,null],
  ['bx1',1,['box',0.11,0.11,2.64],[-0.72,0.13,0],null,0xc8a84b,null,null],
  ['bx2',1,['box',0.11,0.11,2.64],[0.72,0.13,0],null,0xc8a84b,null,null],
  ['bz1',1,['box',4.3,0.11,0.11],[0,0.13,0],null,0xc8a84b,null,null],
  ['bz2',1,['box',4.3,0.11,0.11],[0,0.13,-0.66],null,0xbf9c3e,null,null],
  ['bz3',1,['box',4.3,0.11,0.11],[0,0.13,0.66],null,0xbf9c3e,null,null],
  ['rbase',2,['cyl',0.45,0.45,0.08,32],[0.3,0.22,0],null,0x3a3a3a,null,null],
  ['rmid',2,['cyl',0.33,0.33,0.2,32],[0.3,0.35,0],null,0xe07020,'中央回転機構','高精度インデックステーブル。±0.005°の位置決め精度を実現する直接駆動モータ内蔵型。6分割トルクアーム構造。'],
  ['rtop',2,['cyl',0.16,0.16,0.14,32],[0.3,0.52,0],null,0x2e2e2e,null,null],
  ['ra1',2,['box',0.62,0.055,0.065],[0.3,0.48,0],[0,0.38,0],0xe07020,null,null],
  ['ra2',2,['box',0.62,0.055,0.065],[0.3,0.48,0],[0,-0.78,0],0xe07020,null,null],
  ['ra3',2,['box',0.62,0.055,0.065],[0.3,0.48,0],[0,1.62,0],0xe07020,null,null],
  ['rring',2,['cyl',0.42,0.42,0.04,32],[0.3,0.19,0],null,0x555555,null,null],
  ['ctrl',2,['box',0.68,0.58,0.58],[-1.62,0.41,0],null,0x888888,'制御システム','PLC統合制御ユニット。全軸モーション・センサー処理・安全インターロックを一元管理。タッチパネルHMI搭載。'],
  ['ctrlp',2,['box',0.62,0.04,0.52],[-1.62,0.72,0],null,0x555555,null,null],
  ['ctrlled',2,['box',0.08,0.08,0.08],[-1.38,0.72,0.18],null,0x44ff44,null,null],
  ['drv',2,['box',0.52,0.64,0.52],[1.72,0.44,-0.52],null,0x4488cc,'駆動ユニット','サーボモータ＋ボールネジ直動ユニット。繰り返し位置決め精度±1μm。最大送り速度60m/min対応高剛性設計。'],
  ['g1',2,['box',0.36,0.44,0.3],[1.5,0.34,0.6],null,0x44aa66,null,null],
  ['g2',2,['box',0.3,0.4,0.28],[0.8,0.32,-0.9],null,0x44aa66,null,null],
  ['g3',2,['box',0.28,0.36,0.24],[-0.5,0.3,0.85],null,0x44aa66,null,null],
  ['g4',2,['box',0.32,0.38,0.28],[-1.1,0.31,-0.75],null,0x44aa66,null,null],
  ['pk1',2,['box',0.38,0.3,0.32],[-0.9,0.27,0.5],null,0xcc44aa,null,null],
  ['pk2',2,['box',0.32,0.28,0.3],[0.5,0.26,0.75],null,0xcc44aa,null,null],
  ['ra_1',2,['box',0.12,0.36,0.12],[-0.3,0.3,-0.7],null,0xdd3333,null,null],
  ['ra_2',2,['box',0.12,0.33,0.12],[0.6,0.28,0.3],null,0xdd3333,null,null],
  ['ra_3',2,['box',0.1,0.4,0.1],[-0.8,0.32,-0.2],null,0xdd3333,null,null],
  ['cy1',2,['cyl',0.058,0.058,0.46,12],[-1.3,0.33,0.9],[0.2,0,0.28],0x999999,null,null],
  ['cy2',2,['cyl',0.058,0.058,0.4,12],[1.2,0.32,-0.8],[-0.1,0,0.14],0x999999,null,null],
  ['y1',2,['box',0.22,0.18,0.18],[1.3,0.21,0.9],null,0xddcc22,null,null],
  ['y2',2,['box',0.18,0.15,0.2],[-1.4,0.2,-0.8],null,0xddcc22,null,null],
  ['cn1',2,['box',0.2,0.22,0.18],[-0.15,0.23,-1.0],null,0x44cccc,null,null],
  ['cn2',2,['box',0.18,0.2,0.16],[1.6,0.22,0.3],null,0x44cccc,null,null],
  ['uc1',3,['box',0.11,0.82,0.11],[-0.88,0.47,-0.53],null,0x607080,null,null],
  ['uc2',3,['box',0.11,0.82,0.11],[0.64,0.47,-0.53],null,0x607080,null,null],
  ['uc3',3,['box',0.11,0.82,0.11],[-0.88,0.47,0.53],null,0x607080,null,null],
  ['uc4',3,['box',0.11,0.82,0.11],[0.64,0.47,0.53],null,0x607080,null,null],
  ['ubase',3,['box',1.82,0.1,1.22],[-0.1,0.9,0],null,0x506070,'上部アセンブリ','多軸加工ヘッド搭載ユニット。X/Y/Z/R 4軸同時制御。高速・高精度の複合加工を単一セットアップで実現。'],
  ['um1',3,['box',0.52,0.36,0.42],[-0.62,1.1,-0.2],null,0x3e4858,null,null],
  ['um2',3,['box',0.4,0.3,0.36],[0.28,1.07,0.15],null,0x485060,null,null],
  ['um3',3,['cyl',0.08,0.08,0.56,16],[-0.2,1.28,-0.1],null,0x6e7878,null,null],
  ['ua1',3,['box',0.82,0.06,0.06],[-0.2,1.14,0.36],null,0x8a9898,null,null],
  ['ua2',3,['box',0.06,0.06,0.62],[0.54,1.14,-0.1],null,0x8a9898,null,null],
  ['pp1',3,['cyl',0.023,0.023,0.72,8],[-0.82,0.88,0.2],[0.48,0,0.28],0xaaaaaa,null,null],
  ['pp2',3,['cyl',0.023,0.023,0.62,8],[0.4,0.93,-0.4],[-0.28,0.18,0],0xaaaaaa,null,null],
  ['pp3',3,['cyl',0.019,0.019,0.52,8],[-0.1,0.91,0.4],[0.38,-0.1,0.18],0xcc8844,null,null],
  ['pp4',3,['cyl',0.019,0.019,0.56,8],[0.2,0.95,-0.36],[0.2,0,-0.28],0x4488cc,null,null],
  ['hd1',3,['box',0.3,0.52,0.26],[-0.3,1.42,-0.05],null,0x384050,null,null],
  ['hd2',3,['cyl',0.095,0.095,0.32,16],[-0.3,1.75,-0.05],null,0x505860,null,null],
  ['hd3',3,['box',0.16,0.16,0.16],[0.3,1.38,0.1],null,0xdd3333,null,null],
  ['hd4',3,['box',0.12,0.12,0.12],[0,1.44,0.3],null,0x4488cc,null,null],
  ['hd5',3,['box',0.1,0.5,0.1],[0.54,1.38,-0.38],null,0x707878,null,null],
];

const STAGES = [
  { label:'全体図',    pos:[0,4.5,7.2]   as [number,number,number], look:[0,0.5,0]    as [number,number,number] },
  { label:'上部機構',  pos:[0,3.1,3.2]   as [number,number,number], look:[-0.1,1.3,0] as [number,number,number] },
  { label:'中央機構',  pos:[1.8,2.1,3.1] as [number,number,number], look:[0.3,0.45,0] as [number,number,number] },
  { label:'ベース',    pos:[0.4,6.1,1.2] as [number,number,number], look:[0,0.1,0]    as [number,number,number] },
];

// ─── TYPE DEFINITIONS ─────────────────────────────────────────────────────────
interface SelPart {
  id: string;
  name: string;
  desc: string;
}

interface ThreeState {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  meshMap: Record<string, THREE.Mesh>;
  origPos: Record<string, THREE.Vector3>;
  expPos:  Record<string, THREE.Vector3>;
  hotspots: Hotspot[];
  cam: CamState;
  expl: { target: number; progress: number };
  raycaster: THREE.Raycaster;
}

interface Hotspot {
  ring: THREE.Mesh;
  dot: THREE.Mesh;
  partId: string;
  basePos: [number, number, number];
  yOff: number;
  phase: number;
}

interface CamState {
  tPos:  THREE.Vector3;
  tLook: THREE.Vector3;
  cPos:  THREE.Vector3;
  cLook: THREE.Vector3;
  mx: number;
  my: number;
}

// ─── INFO PANEL ───────────────────────────────────────────────────────────────
// ↓ FIXED: explicit props type (was implicitly 'any')
function InfoPanel({ part, onClose }: { part: SelPart; onClose: () => void }) {
  return (
    <div style={{
      position:'absolute', bottom:20, left:16,
      width:260, background:'rgba(4,12,24,0.93)',
      border:'1px solid rgba(100,200,180,0.25)',
      backdropFilter:'blur(16px)', padding:'22px 24px',
      animation:'_slideUp 0.32s cubic-bezier(0.22,1,0.36,1)',
    }}>
      <div style={{ fontSize:9, letterSpacing:'0.3em', color:'#64c8b8', textTransform:'uppercase', marginBottom:8 }}>
        コンポーネント詳細
      </div>
      <div style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:10 }}>
        {part.name}
      </div>
      <div style={{ fontSize:11, color:'rgba(200,220,215,0.52)', lineHeight:1.85 }}>
        {part.desc}
      </div>
      <button
        onClick={onClose}
        style={{
          marginTop:14, padding:'6px 14px',
          border:'1px solid rgba(100,200,180,0.25)', background:'transparent',
          color:'rgba(100,200,180,0.6)', fontSize:9, letterSpacing:'0.18em',
          textTransform:'uppercase', cursor:'pointer', fontFamily:'inherit',
        }}
      >
        ✕ 閉じる
      </button>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Factory3D() {
  const mountRef  = useRef<HTMLDivElement>(null);
  const threeRef  = useRef<ThreeState | null>(null);
  const stageRef  = useRef(0);
  const dragRef   = useRef({ active: false, x: 0, y: 0, rotX: -0.18, rotY: 0.45 });

  const [stage,    setStage]    = useState(0);
  const [exploded, setExploded] = useState(false);
  const [selPart,  setSelPart]  = useState<SelPart | null>(null);
  const [isPtr,    setIsPtr]    = useState(false);

  // ── INIT THREE.JS ──────────────────────────────────────────────────────────
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let raf: number;
    let initialized = false;
    let rendererRef: THREE.WebGLRenderer | null = null;

    const initScene = (W: number, H: number) => {
      if (initialized || W < 10 || H < 10) return;
      initialized = true;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      rendererRef = renderer;
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x071420);
      scene.fog = new THREE.FogExp2(0x071420, 0.032);

      const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
      camera.position.set(0, 4.5, 7.2);

    scene.add(new THREE.AmbientLight(0x182840, 1.1));
    const sun = new THREE.DirectionalLight(0xffffff, 1.5);
    sun.position.set(5, 8, 4);
    sun.castShadow = true;
    sun.shadow.mapSize.setScalar(2048);
    sun.shadow.camera.left = sun.shadow.camera.bottom = -8;
    sun.shadow.camera.right = sun.shadow.camera.top = 8;
    sun.shadow.camera.near = 1; sun.shadow.camera.far = 30;
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0x2244aa, 0.5); fill.position.set(-5,2,-4); scene.add(fill);
    const rim  = new THREE.DirectionalLight(0x64c8b8, 0.35); rim.position.set(0,-3,-6);  scene.add(rim);

    const grid = new THREE.GridHelper(20, 40, 0x0d3040, 0x07181f);
    grid.position.y = -0.67; scene.add(grid);

    const meshMap: Record<string, THREE.Mesh> = {};
    const origPos: Record<string, THREE.Vector3> = {};
    const expPos:  Record<string, THREE.Vector3> = {};
    const center = new THREE.Vector3(0, 0.4, 0);

    PARTS.forEach(([id, layer, geo, pos, rot, color]) => {
      const geom = geo[0] === 'box'
        ? new THREE.BoxGeometry(geo[1] as number, geo[2] as number, geo[3] as number)
        : new THREE.CylinderGeometry(geo[1] as number, geo[2] as number, geo[3] as number, (geo[4] as number) || 16);
      const mat = new THREE.MeshPhongMaterial({
        color: color as number,
        emissive: new THREE.Color(color as number).multiplyScalar(0.07),
        shininess: 60,
        specular: new THREE.Color(0x1a2a3a),
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(...pos);
      if (rot) mesh.rotation.set(...rot);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData.id = id;
      scene.add(mesh);
      meshMap[id] = mesh;

      const oPos = new THREE.Vector3(...pos);
      origPos[id] = oPos;
      const dir = oPos.clone().sub(center);
      if (dir.length() < 0.01) dir.set(0, 1, 0);
      dir.normalize();
      const ePos = oPos.clone().add(dir.multiplyScalar(2.0 + layer * 0.8));
      ePos.y += layer * 0.95;
      expPos[id] = ePos;
    });

    const hotspots: Hotspot[] = [];
    PARTS.filter(p => p[6]).forEach((part, i) => {
      const [id, , , pos] = part;
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.14, 0.19, 32),
        new THREE.MeshBasicMaterial({ color:0x64c8b8, side:THREE.DoubleSide, transparent:true, opacity:0.75 })
      );
      ring.rotation.x = -Math.PI / 2;
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.075, 12, 12),
        new THREE.MeshBasicMaterial({ color:0x64c8b8 })
      );
      dot.userData.partId = id;
      dot.userData.phaseOff = i * 1.1;
      const yOff = 0.52;
      [ring, dot].forEach(m => m.position.set(pos[0], pos[1] + yOff, pos[2]));
      scene.add(ring); scene.add(dot);
      hotspots.push({ ring, dot, partId: id, basePos: [...pos] as [number,number,number], yOff, phase: i * 1.1 });
    });

    const cam: CamState = {
      tPos:  new THREE.Vector3(0, 4.5, 7.2),
      tLook: new THREE.Vector3(0, 0.5, 0),
      cPos:  new THREE.Vector3(0, 4.5, 7.2),
      cLook: new THREE.Vector3(0, 0.5, 0),
      mx: 0, my: 0,
    };
    const expl = { target: 0, progress: 0 };
    const raycaster = new THREE.Raycaster();

      threeRef.current = { renderer, scene, camera, meshMap, origPos, expPos, hotspots, cam, expl, raycaster };

      const animate = () => {
        raf = requestAnimationFrame(animate);
        const t = performance.now() * 0.001;

        ['rmid','rtop','ra1','ra2','ra3'].forEach(k => {
          if (meshMap[k]) meshMap[k].rotation.y += 0.009;
        });

        expl.progress += (expl.target - expl.progress) * 0.048;
        PARTS.forEach(([id]) => {
          const m = meshMap[id];
          if (m && origPos[id] && expPos[id])
            m.position.lerpVectors(origPos[id], expPos[id], expl.progress);
        });

        hotspots.forEach(({ ring, dot, partId, yOff, phase }) => {
          const pm = meshMap[partId];
          if (!pm) return;
          const py = pm.position.y + yOff;
          const pulse = 1 + Math.sin(t * 2.6 + phase) * 0.22;
          [ring, dot].forEach(m => m.position.set(pm.position.x, py, pm.position.z));
          ring.scale.setScalar(pulse);
          (ring.material as THREE.MeshBasicMaterial).opacity = 0.35 + Math.sin(t * 2.6 + phase) * 0.45;
        });

        const dr = dragRef.current;
        const dist = cam.tPos.clone().sub(cam.tLook).length();
        cam.tPos.x = cam.tLook.x + dist * Math.sin(dr.rotY) * Math.cos(dr.rotX);
        cam.tPos.y = cam.tLook.y + dist * Math.sin(dr.rotX);
        cam.tPos.z = cam.tLook.z + dist * Math.cos(dr.rotY) * Math.cos(dr.rotX);

        cam.cPos.lerp(cam.tPos, 0.04);
        cam.cLook.lerp(cam.tLook, 0.04);
        camera.position.set(cam.cPos.x + cam.mx * 0.22, cam.cPos.y + cam.my * 0.1, cam.cPos.z);
        camera.lookAt(cam.cLook);
        renderer.render(scene, camera);
      };
      animate();
    }; // end initScene

    // ResizeObserver: fires with real dimensions as soon as layout is ready
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (!initialized) {
          initScene(Math.floor(width), Math.floor(height));
        } else if (rendererRef && threeRef.current) {
          const { camera, renderer } = threeRef.current;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(Math.floor(width), Math.floor(height));
        }
      }
    });
    ro.observe(mount);

    // Also try immediately (handles cases where ResizeObserver fires late)
    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;
    initScene(width, height);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      if (rendererRef) {
        rendererRef.dispose();
        if (mount.contains(rendererRef.domElement)) mount.removeChild(rendererRef.domElement);
      }
    };
  }, []);

  // ── STAGE NAV ─────────────────────────────────────────────────────────────
  const gotoStage = useCallback((idx: number) => {
    const t = threeRef.current; if (!t) return;
    const s = STAGES[idx];
    t.cam.tLook.set(...s.look);
    const [dx, dy, dz] = [s.pos[0]-s.look[0], s.pos[1]-s.look[1], s.pos[2]-s.look[2]];
    const dist = Math.sqrt(dx*dx+dy*dy+dz*dz);
    dragRef.current.rotY = Math.atan2(dx, dz);
    dragRef.current.rotX = Math.asin(dy / dist);
    stageRef.current = idx;
    setStage(idx);
    setSelPart(null);
  }, []);

  // ── MOUSE MOVE ────────────────────────────────────────────────────────────
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const t = threeRef.current; if (!t) return;
    const rect = mountRef.current!.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    const ny =-((e.clientY - rect.top)  / rect.height - 0.5) * 2;

    if (dragRef.current.active) {
      dragRef.current.rotY += (e.clientX - dragRef.current.x) * 0.007;
      dragRef.current.rotX -= (e.clientY - dragRef.current.y) * 0.007;
      dragRef.current.rotX = Math.max(-Math.PI/3, Math.min(Math.PI/3, dragRef.current.rotX));
      dragRef.current.x = e.clientX;
      dragRef.current.y = e.clientY;
    } else {
      t.cam.mx = nx * 0.3;
      t.cam.my = ny * 0.15;
    }

    t.raycaster.setFromCamera(new THREE.Vector2(nx, ny), t.camera);
    const dots = t.hotspots.map(h => h.dot);
    const hits = t.raycaster.intersectObjects(dots);
    setIsPtr(hits.length > 0);
    t.hotspots.forEach(({ dot, ring }) => {
      const hit = hits.some(h => h.object === dot);
      (dot.material  as THREE.MeshBasicMaterial).color.setHex(hit ? 0xffffff : 0x64c8b8);
      (ring.material as THREE.MeshBasicMaterial).color.setHex(hit ? 0xffffff : 0x64c8b8);
    });
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragRef.current.active = true;
    dragRef.current.x = e.clientX;
    dragRef.current.y = e.clientY;
  }, []);

  const onMouseUp = useCallback(() => { dragRef.current.active = false; }, []);

  // ── CLICK ─────────────────────────────────────────────────────────────────
  const onClick = useCallback((e: React.MouseEvent) => {
    const t = threeRef.current; if (!t) return;
    const rect = mountRef.current!.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    const ny =-((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    t.raycaster.setFromCamera(new THREE.Vector2(nx, ny), t.camera);
    const hits = t.raycaster.intersectObjects(t.hotspots.map(h => h.dot));
    if (hits.length > 0) {
      const pid  = hits[0].object.userData.partId as string;
      const part = PARTS.find(p => p[0] === pid);
      if (part) {
        const [id, , , pos, , , name, desc] = part;
        if (name && desc) {
          setSelPart(prev => prev?.id === id ? null : { id, name, desc });
          t.cam.tLook.set(pos[0], pos[1] + 0.2, pos[2]);
          dragRef.current.rotX = 0.38;
        }
      }
    } else {
      setSelPart(null);
    }
  }, []);

  // ── WHEEL ─────────────────────────────────────────────────────────────────
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const next = e.deltaY > 0
      ? Math.min(stageRef.current + 1, STAGES.length - 1)
      : Math.max(stageRef.current - 1, 0);
    gotoStage(next);
  }, [gotoStage]);

  // ── TOUCH ─────────────────────────────────────────────────────────────────
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      dragRef.current.active = true;
      dragRef.current.x = e.touches[0].clientX;
      dragRef.current.y = e.touches[0].clientY;
    }
  }, []);
  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragRef.current.active || e.touches.length !== 1) return;
    dragRef.current.rotY += (e.touches[0].clientX - dragRef.current.x) * 0.007;
    dragRef.current.rotX -= (e.touches[0].clientY - dragRef.current.y) * 0.007;
    dragRef.current.rotX = Math.max(-Math.PI/3, Math.min(Math.PI/3, dragRef.current.rotX));
    dragRef.current.x = e.touches[0].clientX;
    dragRef.current.y = e.touches[0].clientY;
  }, []);
  const onTouchEnd = useCallback(() => { dragRef.current.active = false; }, []);

  // ── EXPLODE ───────────────────────────────────────────────────────────────
  const toggleExplode = useCallback(() => {
    const t = threeRef.current; if (!t) return;
    setExploded(prev => {
      const next = !prev;
      t.expl.target = next ? 1 : 0;
      if (!next) setSelPart(null);
      return next;
    });
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ width:'100%', height:'100vh', position:'relative', background:'transparent',
      fontFamily:"'Noto Sans JP','Helvetica Neue',sans-serif" }}>
      <style>{`
        @keyframes _slideUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes _fadeIn  { from{opacity:0} to{opacity:1} }
      `}</style>

      {/* THREE CANVAS */}
      <div
        ref={mountRef}
        style={{ width:'100%', height:'100%', cursor: isPtr ? 'pointer' : dragRef.current.active ? 'grabbing' : 'grab' }}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onClick={onClick}
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />

      {/* EXPLODE BUTTON */}
      <button onClick={toggleExplode} style={{
        position:'absolute', top:16, right:16, padding:'9px 20px',
        border:`1px solid ${exploded ? '#64c8b8' : 'rgba(100,200,180,0.3)'}`,
        background: exploded ? 'rgba(100,200,180,0.12)' : 'rgba(5,12,18,0.7)',
        color: exploded ? '#64c8b8' : 'rgba(200,220,215,0.55)',
        fontSize:10, letterSpacing:'0.15em', textTransform:'uppercase',
        cursor:'pointer', fontFamily:'inherit', backdropFilter:'blur(10px)', transition:'all 0.35s',
      }}>
        {exploded ? '▼ 組立図に戻す' : '▲ 爆発図で展開'}
      </button>

      {/* STAGE NAV */}
      <div style={{ position:'absolute', right:16, top:'50%', transform:'translateY(-50%)',
        display:'flex', flexDirection:'column', gap:18, alignItems:'flex-end' }}>
        {STAGES.map((s, i) => (
          <button key={i} onClick={() => gotoStage(i)} style={{
            display:'flex', alignItems:'center', gap:8, background:'none', border:'none', cursor:'pointer', padding:0,
          }}>
            <span style={{ fontSize:9, letterSpacing:'0.14em', textTransform:'uppercase', fontFamily:'inherit',
              color: stage === i ? '#64c8b8' : 'rgba(200,220,215,0.28)', transition:'color 0.4s' }}>
              {s.label}
            </span>
            <div style={{ height:1.5, borderRadius:1, transition:'all 0.4s',
              width: stage === i ? 24 : 5,
              background: stage === i ? '#64c8b8' : 'rgba(200,220,215,0.18)' }}/>
          </button>
        ))}
      </div>

      {/* SCROLL DOTS */}
      <div style={{ position:'absolute', bottom:14, left:'50%', transform:'translateX(-50%)',
        display:'flex', gap:6, alignItems:'center' }}>
        {STAGES.map((_, i) => (
          <button key={i} onClick={() => gotoStage(i)} style={{
            width: stage === i ? 20 : 5, height:2.5, borderRadius:2,
            border:'none', cursor:'pointer', padding:0,
            background: stage === i ? '#64c8b8' : 'rgba(100,200,180,0.2)', transition:'all 0.4s',
          }}/>
        ))}
      </div>

      {/* INFO PANEL */}
      {selPart && <InfoPanel part={selPart} onClose={() => setSelPart(null)} />}

      {/* HINT */}
      {!selPart && (
        <div style={{ position:'absolute', bottom:14, left:16, pointerEvents:'none', animation:'_fadeIn 0.6s ease' }}>
          <div style={{ fontSize:9, letterSpacing:'0.14em', color:'rgba(100,200,180,0.3)', lineHeight:1.9 }}>
            ● クリックで詳細 · ↕ スクロールで切替
          </div>
        </div>
      )}
    </div>
  );
}
