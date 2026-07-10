import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CircuitEngine from './engine/circuit-engine';
import { MAX_DEPTH, STRINGS, type Lang, type NodeId } from './i18n/strings';
import BootScreen from './components/BootScreen';
import TopBar from './components/TopBar';
import Hud from './components/Hud';
import StoryBeats from './components/StoryBeats';
import CoreSection from './components/CoreSection';
import Datasheet from './components/Datasheet';
import MenuOverlay from './components/MenuOverlay';
import InspectModal from './components/InspectModal';
import CustomCursor from './components/CustomCursor';

const DENSITY = 1;

/** Fenêtres de profondeur [entrée, sortie] des quatre story beats. */
const BEATS = [
  { a: -0.3, b: 0.55 },
  { a: 0.8, b: 1.52 },
  { a: 1.72, b: 2.42 },
  { a: 2.62, b: 3.34 },
];

/** Profondeurs de caméra des couches, pour le saut depuis le menu. */
const LAYER_DEPTHS = [0, 1.15, 2.05, 2.95];

function layerName(d: number): string {
  if (d < 0.7) return 'surface';
  if (d < 1.6) return 'layer 01 — periphery';
  if (d < 2.5) return 'layer 02 — main bus';
  if (d < 3.42) return 'layer 03 — power zone';
  return 'core';
}

function detectLang(): Lang {
  return (navigator.language || 'en').toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

export default function App() {
  const [lang, setLang] = useState<Lang>(detectLang);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [read, setRead] = useState(false);
  const [openNode, setOpenNode] = useState<NodeId | null>(null);
  const [online, setOnline] = useState(false);

  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const finePointer = useMemo(() => window.matchMedia('(pointer: fine)').matches, []);

  // Miroir de l'état pour les callbacks impératifs (moteur, clavier, boucle rAF).
  const stateRef = useRef({ lang, read, menuOpen, openNode });
  stateRef.current = { lang, read, menuOpen, openNode };

  const engineRef = useRef<CircuitEngine | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const powerRef = useRef<HTMLSpanElement>(null);
  const layerRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const chargeRef = useRef<HTMLSpanElement>(null);
  const preRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLDivElement>(null);
  const preBarRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const b0Ref = useRef<HTMLDivElement>(null);
  const b1Ref = useRef<HTMLDivElement>(null);
  const b2Ref = useRef<HTMLDivElement>(null);
  const b3Ref = useRef<HTMLDivElement>(null);
  const beatRefs = useMemo(() => [b0Ref, b1Ref, b2Ref, b3Ref], []);

  const lastPct = useRef(-1);
  const lastCharge = useRef(-1);
  const lastLayer = useRef('');

  /** HUD + story beats pilotés hors React : appelé à chaque frame par le moteur. */
  const handleDepth = useCallback(
    (d: number, isOnline: boolean) => {
      if (stateRef.current.read) return;
      const pct = isOnline ? 100 : Math.round((d / MAX_DEPTH) * 96);
      if (pct !== lastPct.current) {
        lastPct.current = pct;
        if (powerRef.current) powerRef.current.textContent = pct + '%';
        if (barRef.current) barRef.current.style.width = pct + '%';
      }
      const ln = isOnline && d > 3.42 ? 'core — online' : layerName(d);
      if (ln !== lastLayer.current) {
        lastLayer.current = ln;
        if (layerRef.current) layerRef.current.textContent = ln;
      }
      for (let i = 0; i < BEATS.length; i++) {
        const el = beatRefs[i].current;
        if (!el) continue;
        let vin = Math.min(1, Math.max(0, (d - BEATS[i].a) / 0.16));
        let vout = Math.min(1, Math.max(0, (d - BEATS[i].b) / 0.16));
        vin = vin * vin * (3 - 2 * vin);
        vout = vout * vout * (3 - 2 * vout);
        const op = vin * (1 - vout);
        el.style.opacity = op.toFixed(3);
        el.style.visibility = op > 0.03 ? 'visible' : 'hidden';
        el.style.pointerEvents = 'none';
        const inner = el.firstElementChild as HTMLElement | null;
        if (inner) {
          inner.style.transform = `translateY(${((1 - vin) * 28 - vout * 28).toFixed(1)}px)`;
          inner.style.pointerEvents = op > 0.5 ? 'auto' : 'none';
        }
      }
    },
    [beatRefs],
  );

  // --- moteur circuit ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const t = STRINGS[stateRef.current.lang];
    const engine = new CircuitEngine(canvas, {
      density: DENSITY,
      reduced,
      labels: t.labels,
      inspect: t.ui.inspect,
      coreName: 'Y.YANAT',
      coreSub: 'AI-CORE · EST. 2017',
      onMajorClick: (id) => {
        if (id === 'eu' || id === 'llm') setOpenNode(id);
      },
      onCharge: (pct) => {
        if (pct === lastCharge.current) return;
        lastCharge.current = pct;
        if (chargeRef.current) chargeRef.current.textContent = pct + '%';
      },
      onOnline: () => setOnline(true),
      onDepth: handleDepth,
    });
    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [reduced, handleDepth]);

  // --- boot sequence ---
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    let pct = 0;
    let doneTimer = 0;
    const timer = window.setInterval(() => {
      pct = Math.min(100, pct + (reduced ? 34 : 3 + Math.random() * 7));
      if (pctRef.current) pctRef.current.textContent = Math.floor(pct) + '%';
      if (preBarRef.current) preBarRef.current.style.width = pct + '%';
      if (stepRef.current) {
        const steps = STRINGS[stateRef.current.lang].pre.steps;
        stepRef.current.textContent = steps[Math.min(steps.length - 1, Math.floor(pct / (100 / steps.length)))];
      }
      if (pct >= 100) {
        window.clearInterval(timer);
        if (preRef.current) preRef.current.style.opacity = '0';
        doneTimer = window.setTimeout(() => {
          document.documentElement.style.overflow = '';
          setLoading(false);
        }, 680);
      }
    }, 50);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(doneTimer);
      document.documentElement.style.overflow = '';
    };
  }, [reduced]);

  // --- clavier ---
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (stateRef.current.openNode) setOpenNode(null);
      else if (stateRef.current.menuOpen) setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // --- curseur custom (pointeur fin, hors reduced motion) ---
  useEffect(() => {
    if (!finePointer || reduced) return;
    document.body.dataset.nocursor = '1';
    document.body.style.cursor = 'none';
    const dot = cursorRef.current;
    const ring = ringRef.current;
    if (dot) dot.style.display = 'block';
    if (ring) ring.style.display = 'block';
    const cur = { x: -100, y: -100, tx: -100, ty: -100, s: 1 };
    let hoverUI = false;
    let raf = 0;
    const onPtr = (e: PointerEvent) => {
      cur.tx = e.clientX;
      cur.ty = e.clientY;
    };
    const onOver = (e: Event) => {
      const target = e.target as Element | null;
      hoverUI = !!target?.closest?.('a, button');
    };
    window.addEventListener('pointermove', onPtr, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    const loop = () => {
      cur.x += (cur.tx - cur.x) * 0.6;
      cur.y += (cur.ty - cur.y) * 0.6;
      const target = hoverUI || engineRef.current?.hoverMajor ? 1.9 : 1;
      cur.s += (target - cur.s) * 0.18;
      if (dot) dot.style.transform = `translate(${cur.tx}px, ${cur.ty}px)`;
      if (ring) ring.style.transform = `translate(${cur.x}px, ${cur.y}px) scale(${cur.s.toFixed(3)})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPtr);
      document.removeEventListener('pointerover', onOver);
      delete document.body.dataset.nocursor;
      document.body.style.cursor = '';
      if (dot) dot.style.display = 'none';
      if (ring) ring.style.display = 'none';
    };
  }, [finePointer, reduced]);

  // --- synchronisation langue / mode lecture avec le moteur et le document ---
  useEffect(() => {
    document.documentElement.lang = lang;
    const t = STRINGS[lang];
    engineRef.current?.setLabels(t.labels);
    engineRef.current?.setInspect(t.ui.inspect);
  }, [lang]);

  useEffect(() => {
    engineRef.current?.setPaused(read);
  }, [read]);

  const doJump = useCallback(
    (i: number) => {
      const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth';
      if (i >= 4) {
        const core = document.getElementById('lc-core');
        if (core) window.scrollTo({ top: core.offsetTop, behavior });
        return;
      }
      const spacer = document.getElementById('lc-spacer');
      if (!spacer) return;
      const span = Math.max(1, spacer.offsetHeight - window.innerHeight);
      window.scrollTo({ top: (LAYER_DEPTHS[i] / MAX_DEPTH) * span, behavior });
    },
    [reduced],
  );

  const jump = useCallback(
    (i: number) => {
      setMenuOpen(false);
      if (stateRef.current.read) {
        // sortir du mode datasheet d'abord, puis plonger une fois le DOM de la plongée remonté
        setRead(false);
        window.setTimeout(() => doJump(i), 120);
        return;
      }
      doJump(i);
    },
    [doJump],
  );

  const t = STRINGS[lang];
  const hints = finePointer ? t.ui.hintsFine : t.ui.hintsTouch;

  return (
    <div className="app">
      <canvas ref={canvasRef} className="circuit-canvas" />

      {!read && (
        <>
          <div className="dive">
            <div id="lc-spacer" />
            <CoreSection
              t={t}
              online={online}
              chargeRef={chargeRef}
              onPowerCore={() => engineRef.current?.powerCoreAnim()}
            />
          </div>
          <StoryBeats
            t={t}
            beatRefs={beatRefs}
            onOpenEu={() => setOpenNode('eu')}
            onOpenLlm={() => setOpenNode('llm')}
          />
        </>
      )}

      {read && <Datasheet t={t} />}

      <TopBar t={t} lang={lang} onSetLang={setLang} onToggleMenu={() => setMenuOpen((open) => !open)} />

      {!read && <Hud powerRef={powerRef} layerRef={layerRef} barRef={barRef} hints={hints} />}

      {menuOpen && (
        <MenuOverlay
          t={t}
          readMode={read}
          onJump={jump}
          onToggleRead={() => {
            setRead((r) => !r);
            setMenuOpen(false);
          }}
          onClose={() => setMenuOpen(false)}
        />
      )}

      {openNode && <InspectModal t={t} node={openNode} onClose={() => setOpenNode(null)} />}

      {loading && (
        <BootScreen preRef={preRef} pctRef={pctRef} preBarRef={preBarRef} stepRef={stepRef} firstStep={t.pre.steps[0]} />
      )}

      <CustomCursor ringRef={ringRef} cursorRef={cursorRef} />
    </div>
  );
}
