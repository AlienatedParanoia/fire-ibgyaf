"use client";

/*
 * <starship-shader> — vanilla WebGL2 fullscreen fragment shader.
 * Faithful port of "Starship" by @XorDev, used as the animated hero background
 * on the paginated landing (see src/app/landing-paginated/page.tsx). Pure black
 * base with bright flares. Exposes sampleRegion(x,y,w,h) so the host can keep
 * overlaid hero text legible against the moving animation.
 *
 * Ported from the Claude Design template asset
 * templates/landing-paginated/starship-shader.js.
 */

const VERT = `#version 300 es
in vec2 position;
void main(){ gl_Position = vec4(position, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform float iTime;
uniform vec2  iResolution;
uniform sampler2D iChannel0;
out vec4 fragColor;

void mainImage(out vec4 O, vec2 I){
  vec2 r = iResolution.xy,
       p = (I+I-r) / r.y * mat2(3.,4.,4.,-3.) / 1e2;
  vec4 S = vec4(0.0);
  vec4 C = vec4(1.,2.,3.,0.);
  vec4 W;
  for(float t=iTime, T=.1*t+p.y, i=0.; i<50.; i+=1.){
    S += (cos(W=sin(i)*C)+1.)
       * exp(sin(i+i*T))
       / length(max(p,
           p / vec2(2.0, texture(iChannel0, p/exp(W.x)+vec2(i,t)/8.).r*40.0)
         )) / 1e4;
    p += .02 * cos(i*(C.xz+8.0+i) + T + T);
  }
  O = vec4(tanh((S*S).rgb), 1.0);
}
void main(){
  vec4 O;
  mainImage(O, gl_FragCoord.xy);
  fragColor = O;
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src.replace(/^\s+/gm, (m) => m).trim());
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    throw new Error(gl.getShaderInfoLog(s) || "shader compile failed");
  return s;
}

/** Element instance type exposing the host-facing API. */
export type StarshipShaderElement = HTMLElement & {
  sampleRegion(x: number, y: number, w: number, h: number): number;
};

/**
 * Register the <starship-shader> custom element once (client-only).
 * The class is defined INSIDE this function so the module can be imported on
 * the server (Next prerender) without evaluating `extends HTMLElement`.
 */
export function ensureStarshipShader() {
  if (typeof window === "undefined" || !("customElements" in window)) return;
  if (customElements.get("starship-shader")) return;

  class StarshipShader extends HTMLElement {
  private _gl: WebGL2RenderingContext | null = null;
  private _canvas: HTMLCanvasElement | null = null;
  private _u: {
    time: WebGLUniformLocation | null;
    res: WebGLUniformLocation | null;
    ch0: WebGLUniformLocation | null;
  } | null = null;
  private _ro: ResizeObserver | null = null;
  private _raf = 0;
  private _sample: HTMLCanvasElement | null = null;
  private _sctx: CanvasRenderingContext2D | null = null;

  connectedCallback() {
    this.style.display = this.style.display || "block";
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "display:block;width:100%;height:100%";
    this.appendChild(canvas);
    const gl = canvas.getContext("webgl2", {
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true,
    });
    if (!gl) {
      this.style.background = "#000";
      return;
    }
    this._gl = gl;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    // static random noise texture for iChannel0
    const W = 256,
      H = 256,
      data = new Uint8Array(W * H * 4);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 256) | 0;
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, W, H, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    this._u = {
      time: gl.getUniformLocation(prog, "iTime"),
      res: gl.getUniformLocation(prog, "iResolution"),
      ch0: gl.getUniformLocation(prog, "iChannel0"),
    };
    gl.uniform1i(this._u.ch0, 0);

    this._canvas = canvas;
    this._resize();

    const reduce =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const t0 = performance.now();
    const draw = (now: number) => {
      if (!this.isConnected || gl.isContextLost()) return;
      gl.uniform1f(this._u!.time, (now - t0) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const frame = (now: number) => {
      draw(now);
      if (this.isConnected && !gl.isContextLost()) this._raf = requestAnimationFrame(frame);
    };

    // Repaint on resize; under reduced motion this is the only repaint.
    this._ro = new ResizeObserver(() => {
      this._resize();
      if (reduce) draw(performance.now());
    });
    this._ro.observe(this);

    // On context loss, stop the loop and preventDefault so the browser keeps
    // the canvas — we degrade to the element's #000 background rather than
    // spinning no-op draws. (The isContextLost guards above also halt it.)
    canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      cancelAnimationFrame(this._raf);
    });

    // Honor prefers-reduced-motion: render one static frame, no animation loop.
    if (reduce) draw(performance.now());
    else this._raf = requestAnimationFrame(frame);
  }

  private _resize() {
    const gl = this._gl,
      c = this._canvas;
    if (!gl || !c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(this.clientWidth * dpr));
    const h = Math.max(1, Math.round(this.clientHeight * dpr));
    if (c.width !== w || c.height !== h) {
      c.width = w;
      c.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(this._u!.res, w, h);
    }
  }

  // Average relative luminance (0..1) of the rendered shader under a CSS-pixel
  // rect (relative to this element). Used by the host to keep overlaid text
  // legible against the moving animation.
  sampleRegion(x: number, y: number, w: number, h: number): number {
    const c = this._canvas;
    if (!c || !this.clientWidth) return 0.04;
    const sx = c.width / this.clientWidth,
      sy = c.height / this.clientHeight;
    const dx = Math.max(0, x * sx),
      dy = Math.max(0, y * sy);
    const dw = Math.min(c.width - dx, w * sx),
      dh = Math.min(c.height - dy, h * sy);
    if (dw < 1 || dh < 1) return 0.04;
    const s = this._sample || (this._sample = document.createElement("canvas"));
    const SW = 12,
      SH = 12;
    s.width = SW;
    s.height = SH;
    const ctx =
      this._sctx || (this._sctx = s.getContext("2d", { willReadFrequently: true }));
    if (!ctx) return 0.04;
    try {
      ctx.drawImage(c, dx, dy, dw, dh, 0, 0, SW, SH);
    } catch {
      return 0.04;
    }
    const d = ctx.getImageData(0, 0, SW, SH).data;
    let sum = 0;
    for (let i = 0; i < d.length; i += 4)
      sum += (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
    return sum / (SW * SH);
  }

  disconnectedCallback() {
    cancelAnimationFrame(this._raf);
    if (this._ro) this._ro.disconnect();
  }
  }

  customElements.define("starship-shader", StarshipShader);
}
