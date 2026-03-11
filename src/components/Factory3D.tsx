import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

// ═══════════════════════════════════════════════
//  MACHINE PARTS DATA
//  [id, layer, geo, pos, rot|null, color, name|null, desc|null]
//  geo: ['box',w,h,d] | ['cyl',rt,rb,h,segs]
// ═══════════════════════════════════════════════
const PARTS = [
  // BASE PLATFORM
  ['platform',0,['box',4.6,0.12,3.0],[0,0,0],null,0x2d8f70,'精密定盤','高剛性溶接鋼製定盤。設備全体の基準面として機能し、熱変形を±0.01mm以内に抑制する構造設計。'],
  ['foot1',0,['box',0.3,0.62,0.3],[-1.92,-0.37,-1.22],null,0xe05c20,null,null],
  ['foot2',0,['box',0.3,0.62,0.3],[1.92,-0.37,-1.22],null,0xe05c20,null,null],
  ['foot3',0,['box',0.3,0.62,0.3],[-1.92,-0.37,1.22],null,0xe05c20,null,null],
  ['foot4',0,['box',0.3,0.62,0.3],[1.92,-0.37,1.22],null,0xe05c20,null,null],
  // FRAME STRUCTURE (tan beams)
  ['bf',1,['box',4.3,0.13,0.13],[0,0.13,-1.32],null,0xc8a84b,null,null],
  ['bb',1,['box',4.3,0.13,0.13],[0,0.13,1.32],null,0xc8a84b,null,null],
  ['bl',1,['box',0.13,0.13,2.64],[-2.1,0.13,0],null,0xc8a84b,null,null],
  ['br',1,['box',0.13,0.13,2.64],[2.1,0.13,0],null,0xc8a84b,null,null],
  ['bx1',1,['box',0.11,0.11,2.64],[-0.72,0.13,0],null,0xc8a84b,null,null],
  ['bx2',1,['box',0.11,0.11,2.64],[0.72,0.13,0],null,0xc8a84b,null,null],
  ['bz1',1,['box',4.3,0.11,0.11],[0,0.13,0],null,0xc8a84b,null,null],
  ['bz2',1,['box',4.3,0.11,0.11],[0,0.13,-0.66],null,0xbf9c3e,null,null],
  ['bz3',1,['box',4.3,0.11,0.11],[0,0.13,0.66],null,0xbf9c3e,null,null],
  // CENTRAL ROTARY (orange — from image3 center)
  ['rbase',2,['cyl',0.45,0.45,0.08,32],[0.3,0.22,0],null,0x3a3a3a,null,null],
  ['rmid',2,['cyl',0.33,0.33,0.2,32],[0.3,0.35,0],null,0xe07020,'中央回転機構','高精度インデックステーブル。±0.005°の位置決め精度を実現する直接駆動モータ内蔵型。6分割のトルクアーム構造。'],
  ['rtop',2,['cyl',0.16,0.16,0.14,32],[0.3,0.52,0],null,0x2e2e2e,null,null],
  ['ra1',2,['box',0.62,0.055,0.065],[0.3,0.48,0],[0,0.38,0],0xe07020,null,null],
  ['ra2',2,['box',0.62,0.055,0.065],[0.3,0.48,0],[0,-0.78,0],0xe07020,null,null],
  ['ra3',2,['box',0.62,0.055,0.065],[0.3,0.48,0],[0,1.62,0],0xe07020,null,null],
  ['rring',2,['cyl',0.42,0.42,0.04,32],[0.3,0.19,0],null,0x555555,null,null],
  // CONTROL SYSTEM (gray left — image2)
  ['ctrl',2,['box',0.68,0.58,0.58],[-1.62,0.41,0],null,0x888888,'制御システム','PLC統合制御ユニット。全軸モーション制御・センサーデータ処理・安全インターロックを一元管理。タッチパネルHMI搭載。'],
  ['ctrlp',2,['box',0.62,0.04,0.52],[-1.62,0.72,0],null,0x555555,null,null],
  ['ctrlled',2,['box',0.08,0.08,0.08],[-1.38,0.72,0.18],null,0x44ff44,null,null],
  // DRIVE UNIT (blue right — image2)
  ['drv',2,['box',0.52,0.64,0.52],[1.72,0.44,-0.52],null,0x4488cc,'駆動ユニット','サーボモータ＋ボールネジ直動ユニット。繰り返し位置決め精度±1μm。最大送り速度60m/min対応の高剛性設計。'],
  // GREEN components (multiple)
  ['g1',2,['box',0.36,0.44,0.3],[1.5,0.34,0.6],null,0x44aa66,null,null],
  ['g2',2,['box',0.3,0.4,0.28],[0.8,0.32,-0.9],null,0x44aa66,null,null],
  ['g3',2,['box',0.28,0.36,0.24],[-0.5,0.3,0.85],null,0x44aa66,null,null],
  ['g4',2,['box',0.32,0.38,0.28],[-1.1,0.31,-0.75],null,0x44aa66,null,null],
  // MAGENTA/PINK components
  ['pk1',2,['box',0.38,0.3,0.32],[-0.9,0.27,0.5],null,0xcc44aa,null,null],
  ['pk2',2,['box',0.32,0.28,0.3],[0.5,0.26,0.75],null,0xcc44aa,null,null],
  // RED actuators
  ['ra_1',2,['box',0.12,0.36,0.12],[-0.3,0.3,-0.7],null,0xdd3333,null,null],
  ['ra_2',2,['box',0.12,0.33,0.12],[0.6,0.28,0.3],null,0xdd3333,null,null],
  ['ra_3',2,['box',0.1,0.4,0.1],[-0.8,0.32,-0.2],null,0xdd3333,null,null],
  // Hydraulic cylinders
  ['cy1',2,['cyl',0.058,0.058,0.46,12],[-1.3,0.33,0.9],[0.2,0,0.28],0x999999,null,null],
  ['cy2',2,['cyl',0.058,0.058,0.4,12],[1.2,0.32,-0.8],[-0.1,0,0.14],0x999999,null,null],
  // Yellow details
  ['y1',2,['box',0.22,0.18,0.18],[1.3,0.21,0.9],null,0xddcc22,null,null],
  ['y2',2,['box',0.18,0.15,0.2],[-1.4,0.2,-0.8],null,0xddcc22,null,null],
  ['y3',2,['box',0.2,0.16,0.18],[0,0.2,1.0],null,0xddcc22,null,null],
  // Cyan sensors
  ['cn1',2,['box',0.2,0.22,0.18],[-0.15,0.23,-1.0],null,0x44cccc,null,null],
  ['cn2',2,['box',0.18,0.2,0.16],[1.6,0.22,0.3],null,0x44cccc,null,null],
  // UPPER COLUMNS
  ['uc1',3,['box',0.11,0.82,0.11],[-0.88,0.47,-0.53],null,0x607080,null,null],
  ['uc2',3,['box',0.11,0.82,0.11],[0.64,0.47,-0.53],null,0x607080,null,null],
  ['uc3',3,['box',0.11,0.82,0.11],[-0.88,0.47,0.53],null,0x607080,null,null],
  ['uc4',3,['box',0.11,0.82,0.11],[0.64,0.47,0.53],null,0x607080,null,null],
  ['ubase',3,['box',1.82,0.1,1.22],[-0.1,0.9,0],null,0x506070,'上部アセンブリ','多軸加工ヘッド搭載ユニット。X/Y/Z/R 4軸同時制御。高速・高精度の複合加工を単一セットアップで実現。'],
  // Upper mechanisms
  ['um1',3,['box',0.52,0.36,0.42],[-0.62,1.1,-0.2],null,0x3e4858,null,null],
  ['um2',3,['box',0.4,0.3,0.36],[0.28,1.07,0.15],null,0x485060,null,null],
  ['um3',3,['cyl',0.08,0.08,0.56,16],[-0.2,1.28,-0.1],null,0x6e7878,null,null],
  ['ua1',3,['box',0.82,0.06,0.06],[-0.2,1.14,0.36],null,0x8a9898,null,null],
  ['ua2',3,['box',0.06,0.06,0.62],[0.54,1.14,-0.1],null,0x8a9898,null,null],
  // Pipes (orange hydraulic, blue pneumatic, gray structural)
  ['pp1',3,['cyl',0.023,0.023,0.72,8],[-0.82,0.88,0.2],[0.48,0,0.28],0xaaaaaa,null,null],
  ['pp2',3,['cyl',0.023,0.023,0.62,8],[0.4,0.93,-0.4],[-0.28,0.18,0],0xaaaaaa,null,null],
  ['pp3',3,['cyl',0.019,0.019,0.52,8],[-0.1,0.91,0.4],[0.38,-0.1,0.18],0xcc8844,null,null],
  ['pp4',3,['cyl',0.019,0.019,0.56,8],[0.2,0.95,-0.36],[0.2,0,-0.28],0x4488cc,null,null],
  // TOP HEAD (complex gray assembly — image1 top)
  ['hd1',3,['box',0.3,0.52,0.26],[-0.3,1.42,-0.05],null,0x384050,null,null],
  ['hd2',3,['cyl',0.095,0.095,0.32,16],[-0.3,1.75,-0.05],null,0x505860,null,null],
  ['hd3',3,['box',0.16,0.16,0.16],[0.3,1.38,0.1],null,0xdd3333,null,null],
  ['hd4',3,['box',0.12,0.12,0.12],[0,1.44,0.3],null,0x4488cc,null,null],
  ['hd5',3,['box',0.1,0.5,0.1],[0.54,1.38,-0.38],null,0x707878,null,null],
];

const STAGES = [
  { label:'全体図',    sub:'Overview',          pos:[0,4.5,7.2],     look:[0,0.5,0] },
  { label:'上部機構',  sub:'Upper Assembly',    pos:[0,3.1,3.2],     look:[-0.1,1.3,0] },
  { label:'中央機構',  sub:'Central Mechanism', pos:[1.8,2.1,3.1],   look:[0.3,0.45,0] },
  { label:'ベースフレーム', sub:'Base Frame',   pos:[0.4,6.1,1.2],   look:[0,0.1,0] },
];

// ═══════════════════════════════════════════════
//  UI COMPONENTS
// ═══════════════════════════════════════════════
function InfoPanel({ part, onClose }) {
  return (
    <div style={{
      position:'absolute', bottom:28, right:28,
      width:300, background:'rgba(4,12,24,0.94)',
      border:'1px solid rgba(100,200,180,0.28)',
      backdropFilter:'blur(16px)', padding:'26px 28px',
      animation:'slideUp 0.35s cubic-bezier(0.22,1,0.36,1)',
    }}>
      <div style={{ fontSize:9, letterSpacing:'0.32em', color:'#64c8b8', textTransform:'uppercase', marginBottom:10 }}>
        コンポーネント詳細
      </div>
      <div style={{ fontSize:17, fontWeight:700, color:'#fff', marginBottom:12, letterSpacing:'0.02em' }}>
        {part.name}
      </div>
      <div style={{ fontSize:11.5, color:'rgba(200,220,215,0.55)', lineHeight:1.85, letterSpacing:'0.03em' }}>
        {part.desc}
      </div>
      <button onClick={onClose} style={{
        marginTop:18, padding:'7px 16px',
        border:'1px solid rgba(100,200,180,0.3)', background:'transparent',
        color:'rgba(100,200,180,0.65)', fontSize:10, letterSpacing:'0.18em',
        textTransform:'uppercase', cursor:'pointer', fontFamily:'inherit',
      }}>
        ✕ 閉じる
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════
export default function EquipmentPresentation() {
  const mountRef  = useRef(null);
  const threeRef  = useRef(null);
  const stageRef  = useRef(0);

  const [uiStage,    setUiStage]    = useState(0);
  const [exploded,   setExploded]   = useState(false);
  const [selPart,    setSelPart]    = useState(null);
  const [grabbing,   setGrabbing]   = useState(false);
  const [pointer,    setPointer]    = useState(false);

  // ─── THREE.JS INIT ───────────────────────────
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const W = mount.offsetWidth, H = mount.offsetHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020810);
    scene.fog = new THREE.FogExp2(0x020810, 0.036);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 4.5, 7.2);

    // Lights
    scene.add(new THREE.AmbientLight(0x182840, 1.0));
    const sun = new THREE.DirectionalLight(0xffffff, 1.4);
    sun.position.set(5, 8, 4);
    sun.castShadow = true;
    sun.shadow.mapSize.setScalar(2048);
    sun.shadow.camera.left = sun.shadow.camera.bottom = -8;
    sun.shadow.camera.right = sun.shadow.camera.top = 8;
    sun.shadow.camera.near = 1; sun.shadow.camera.far = 30;
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0x2244aa, 0.45);
    fill.position.set(-5, 2, -4); scene.add(fill);
    const rim  = new THREE.DirectionalLight(0x64c8b8, 0.32);
    rim.position.set(0, -3, -6);  scene.add(rim);

    // Floor grid
    const grid = new THREE.GridHelper(18, 36, 0x0d3040, 0x07181f);
    grid.position.y = -0.67; scene.add(grid);

    // Build machine geometry
    const meshMap = {}, origPos = {}, expPos = {};
    const center  = new THREE.Vector3(0, 0.4, 0);

    PARTS.forEach(([id, layer, geo, pos, rot, color]) => {
      const g = geo[0] === 'box'
        ? new THREE.BoxGeometry(geo[1], geo[2], geo[3])
        : new THREE.CylinderGeometry(geo[1], geo[2], geo[3], geo[4] || 16);

      const m = new THREE.MeshPhongMaterial({
        color,
        emissive: new THREE.Color(color).multiplyScalar(0.08),
        shininess: 55,
        specular: new THREE.Color(0x2a3a4a),
      });

      const mesh = new THREE.Mesh(g, m);
      mesh.position.set(...pos);
      if (rot) mesh.rotation.set(...rot);
      mesh.castShadow = true; mesh.receiveShadow = true;
      mesh.userData.id = id;
      scene.add(mesh);
      meshMap[id] = mesh;

      const oPos = new THREE.Vector3(...pos);
      origPos[id] = oPos;

      // Explode radially outward + layer height offset
      const dir = oPos.clone().sub(center);
      if (dir.length() < 0.01) dir.set(0, 1, 0);
      dir.normalize();
      const ePos = oPos.clone().add(dir.multiplyScalar(2.2 + layer * 0.85));
      ePos.y += layer * 1.0;
      expPos[id] = ePos;
    });

    // Hotspot indicators (ring + clickable sphere)
    const hotspots = [];
    PARTS.filter(p => p[6]).forEach((part, i) => {
      const [id, , , pos] = part;
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.13, 0.175, 32),
        new THREE.MeshBasicMaterial({ color:0x64c8b8, side:THREE.DoubleSide, transparent:true, opacity:0.8 })
      );
      ring.rotation.x = -Math.PI / 2;

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 12, 12),
        new THREE.MeshBasicMaterial({ color:0x64c8b8 })
      );
      dot.userData = { partId: id, phaseOff: i * 1.1 };

      const yOff = 0.5;
      [ring, dot].forEach(m => {
        m.position.set(pos[0], pos[1] + yOff, pos[2]);
        scene.add(m);
      });
      hotspots.push({ ring, dot, partId: id, basePos: [...pos], yOff, phase: i * 1.1 });
    });

    // Camera state
    const cam = {
      tPos:  new THREE.Vector3(0, 4.5, 7.2),
      tLook: new THREE.Vector3(0, 0.5, 0),
      cPos:  new THREE.Vector3(0, 4.5, 7.2),
      cLook: new THREE.Vector3(0, 0.5, 0),
      mx: 0, my: 0,
    };
    const expl = { target: 0, progress: 0 };
    const raycaster = new THREE.Raycaster();

    threeRef.current = { renderer, scene, camera, meshMap, origPos, expPos, hotspots, cam, expl, raycaster };

    // Animation loop
    let rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;

      // Rotate central mechanism parts
      ['rmid','rtop','ra1','ra2','ra3'].forEach(k => {
        if (meshMap[k]) meshMap[k].rotation.y += 0.009;
      });

      // Explode lerp
      expl.progress += (expl.target - expl.progress) * 0.05;
      const ep = expl.progress;
      PARTS.forEach(([id]) => {
        const mesh = meshMap[id];
        if (mesh && origPos[id] && expPos[id])
          mesh.position.lerpVectors(origPos[id], expPos[id], ep);
      });

      // Hotspot pulse & follow their part
      hotspots.forEach(({ ring, dot, partId, yOff, phase }) => {
        const pm = meshMap[partId];
        if (!pm) return;
        const py = pm.position.y + yOff;
        const pulse = 1 + Math.sin(t * 2.8 + phase) * 0.2;
        const alpha = 0.38 + Math.sin(t * 2.8 + phase) * 0.42;
        [ring, dot].forEach(m => m.position.set(pm.position.x, py, pm.position.z));
        ring.scale.setScalar(pulse);
        ring.material.opacity = alpha;
      });

      // Camera smooth lerp
      cam.cPos.lerp(cam.tPos, 0.042);
      cam.cLook.lerp(cam.tLook, 0.042);
      camera.position.set(cam.cPos.x + cam.mx * 0.28, cam.cPos.y + cam.my * 0.12, cam.cPos.z);
      camera.lookAt(cam.cLook);

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = mount.offsetWidth, h = mount.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  // ─── NAVIGATION ─────────────────────────────
  const gotoStage = useCallback((idx) => {
    const t = threeRef.current; if (!t) return;
    const s = STAGES[idx];
    t.cam.tPos.set(...s.pos); t.cam.tLook.set(...s.look);
    stageRef.current = idx;
    setUiStage(idx); setSelPart(null);
  }, []);

  // ─── MOUSE MOVE ──────────────────────────────
  const onMouseMove = useCallback((e) => {
    const t = threeRef.current; if (!t) return;
    const rect = mountRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    const ny =-((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    t.cam.mx = nx; t.cam.my = ny;

    t.raycaster.setFromCamera({ x: nx, y: ny }, t.camera);
    const dots = t.hotspots.map(h => h.dot);
    const hits = t.raycaster.intersectObjects(dots);
    const over = hits.length > 0;
    setPointer(over);

    t.hotspots.forEach(({ dot, ring }) => {
      const hit = hits.some(h => h.object === dot);
      dot.material.color.setHex(hit ? 0xffffff : 0x64c8b8);
      ring.material.color.setHex(hit ? 0xffffff : 0x64c8b8);
    });
  }, []);

  // ─── CLICK ───────────────────────────────────
  const onClick = useCallback((e) => {
    const t = threeRef.current; if (!t) return;
    const rect = mountRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    const ny =-((e.clientY - rect.top)  / rect.height - 0.5) * 2;

    t.raycaster.setFromCamera({ x: nx, y: ny }, t.camera);
    const hits = t.raycaster.intersectObjects(t.hotspots.map(h => h.dot));

    if (hits.length > 0) {
      const pid  = hits[0].object.userData.partId;
      const part = PARTS.find(p => p[0] === pid);
      if (part) {
        const [id, , , pos, , , name, desc] = part;
        setSelPart(prev => prev?.id === id ? null : { id, name, desc });
        t.cam.tPos.set(pos[0]+1.6, pos[1]+1.9, pos[2]+3.1);
        t.cam.tLook.set(pos[0], pos[1]+0.2, pos[2]);
      }
    } else {
      setSelPart(null);
      gotoStage(stageRef.current);
    }
  }, [gotoStage]);

  // ─── WHEEL (stage nav) ───────────────────────
  const onWheel = useCallback((e) => {
    e.preventDefault();
    const next = e.deltaY > 0
      ? Math.min(stageRef.current + 1, STAGES.length - 1)
      : Math.max(stageRef.current - 1, 0);
    gotoStage(next);
  }, [gotoStage]);

  // ─── EXPLODE TOGGLE ──────────────────────────
  const toggleExplode = useCallback(() => {
    const t = threeRef.current; if (!t) return;
    setExploded(prev => {
      const next = !prev;
      t.expl.target = next ? 1 : 0;
      if (!next) setSelPart(null);
      return next;
    });
  }, []);

  // ─── RENDER ──────────────────────────────────
  return (
    <div style={{ width:'100%', height:'100vh', background:'#020810', position:'relative', overflow:'hidden',
      fontFamily:"'Noto Sans JP','Helvetica Neue',sans-serif" }}>

      <style>{`
        @keyframes slideUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity:0; } to { opacity:1; }
        }
      `}</style>

      {/* ── THREE.JS CANVAS ── */}
      <div
        ref={mountRef}
        style={{ width:'100%', height:'100%',
          cursor: pointer ? 'pointer' : grabbing ? 'grabbing' : 'crosshair' }}
        onMouseMove={onMouseMove}
        onMouseDown={() => setGrabbing(true)}
        onMouseUp={() => setGrabbing(false)}
        onClick={onClick}
        onWheel={onWheel}
      />

      {/* ── HEADER ── */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, padding:'20px 28px',
        display:'flex', justifyContent:'space-between', alignItems:'flex-start',
        background:'linear-gradient(to bottom, rgba(2,8,16,0.9) 0%, transparent 100%)',
        pointerEvents:'none',
      }}>
        <div>
          <div style={{ fontSize:9.5, letterSpacing:'0.32em', color:'#64c8b8', textTransform:'uppercase', marginBottom:5 }}>
            株式会社アスト ／ 3D設備プレゼン
          </div>
          <div style={{ fontSize:17, fontWeight:700, color:'rgba(255,255,255,0.9)', letterSpacing:'0.04em' }}>
            インタラクティブ設備ビューア
          </div>
        </div>
        {/* Explode button */}
        <button
          onClick={toggleExplode}
          style={{
            pointerEvents:'auto',
            padding:'10px 22px',
            border:`1px solid ${exploded ? '#64c8b8' : 'rgba(100,200,180,0.35)'}`,
            background: exploded ? 'rgba(100,200,180,0.12)' : 'rgba(2,8,16,0.6)',
            color: exploded ? '#64c8b8' : 'rgba(200,220,215,0.6)',
            fontSize:10, letterSpacing:'0.15em', textTransform:'uppercase',
            cursor:'pointer', fontFamily:'inherit', backdropFilter:'blur(8px)',
            transition:'all 0.35s',
          }}
        >
          {exploded ? '▼ 組立図に戻す' : '▲ 爆発図で展開'}
        </button>
      </div>

      {/* ── RIGHT STAGE NAV ── */}
      <div style={{
        position:'absolute', right:28, top:'50%', transform:'translateY(-50%)',
        display:'flex', flexDirection:'column', gap:22, alignItems:'flex-end',
      }}>
        {STAGES.map((s, i) => (
          <button key={i} onClick={() => gotoStage(i)} style={{
            display:'flex', alignItems:'center', gap:10,
            background:'none', border:'none', cursor:'pointer', padding:0,
          }}>
            <span style={{
              fontSize:9.5, letterSpacing:'0.14em', textTransform:'uppercase', fontFamily:'inherit',
              color: uiStage === i ? '#64c8b8' : 'rgba(200,220,215,0.3)',
              transition:'color 0.4s',
            }}>
              {s.label}
            </span>
            <div style={{
              height:1.5, borderRadius:1, transition:'all 0.4s',
              width: uiStage === i ? 28 : 6,
              background: uiStage === i ? '#64c8b8' : 'rgba(200,220,215,0.2)',
            }}/>
          </button>
        ))}
      </div>

      {/* ── BOTTOM LEFT: stage sub + hints ── */}
      <div style={{
        position:'absolute', bottom:28, left:28, pointerEvents:'none',
        animation:'fadeIn 0.6s ease',
      }}>
        <div style={{ fontSize:9, letterSpacing:'0.28em', color:'rgba(100,200,180,0.45)', textTransform:'uppercase', marginBottom:5 }}>
          scroll to navigate · click ● for details
        </div>
        <div style={{ fontSize:24, fontWeight:200, color:'rgba(255,255,255,0.1)', letterSpacing:'0.06em' }}>
          {STAGES[uiStage].sub}
        </div>
      </div>

      {/* ── SCROLL PROGRESS DOTS ── */}
      <div style={{
        position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)',
        display:'flex', gap:8, alignItems:'center',
      }}>
        {STAGES.map((_, i) => (
          <button key={i} onClick={() => gotoStage(i)} style={{
            width: uiStage === i ? 24 : 6,
            height:3, borderRadius:2, border:'none', cursor:'pointer',
            background: uiStage === i ? '#64c8b8' : 'rgba(100,200,180,0.2)',
            transition:'all 0.4s', padding:0,
          }}/>
        ))}
      </div>

      {/* ── INFO PANEL ── */}
      {selPart && (
        <InfoPanel
          part={selPart}
          onClose={() => { setSelPart(null); gotoStage(stageRef.current); }}
        />
      )}

      {/* ── HOVER HINT (no selection) ── */}
      {!selPart && (
        <div style={{
          position:'absolute', bottom:28, right:28, textAlign:'right',
          pointerEvents:'none',
          animation:'fadeIn 0.5s ease',
        }}>
          <div style={{ fontSize:9.5, letterSpacing:'0.16em', color:'rgba(100,200,180,0.3)', lineHeight:1.8 }}>
            <div>● クリックでコンポーネント詳細</div>
            <div>↕ スクロールでビュー切替</div>
            <div>↔ マウスで視点移動</div>
          </div>
        </div>
      )}
    </div>
  );
}
