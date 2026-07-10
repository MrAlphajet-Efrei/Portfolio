export interface CircuitEngineOptions {
  density?: number;
  reduced?: boolean;
  /** Silkscreen labels of the major components, e.g. { eu: 'EU-CORE', llm: 'LLM-ENGINE' } */
  labels?: Record<string, string>;
  /** Localized "[ inspect ]" caption drawn under the major components */
  inspect?: string;
  coreName?: string;
  coreSub?: string;
  onMajorClick?: ((id: string) => void) | null;
  /** Charge progress callback, pct in 0..100 */
  onCharge?: ((pct: number) => void) | null;
  onOnline?: (() => void) | null;
  /** Called every frame with the camera depth and the online flag */
  onDepth?: ((depth: number, online: boolean) => void) | null;
}

export default class CircuitEngine {
  constructor(canvas: HTMLCanvasElement, opts?: CircuitEngineOptions);
  /** Key of the major component currently hovered ('eu' | 'llm'), or null */
  hoverMajor: string | null;
  online: boolean;
  depth: number;
  /** Core charge progress, 0..1 */
  charge: number;
  setLabels(labels: Record<string, string>): void;
  setInspect(caption: string): void;
  setDensity(density: number): void;
  setPaused(paused: boolean): void;
  setReduced(reduced: boolean): void;
  /** Accessible fallback: ramps the core charge automatically */
  powerCoreAnim(): void;
  resize(rebuild?: boolean): void;
  destroy(): void;
}
