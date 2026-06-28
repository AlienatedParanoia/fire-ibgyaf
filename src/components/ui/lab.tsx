"use client";
import React, { useEffect, useRef } from "react";

const SHADER_SRC = `#version 300 es
precision highp float;

out vec4 fragColor;
in vec2 v_uv;

uniform vec3  iResolution;
uniform float iTime;
uniform int   iFrame;
uniform vec4  iMouse;

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
  vec2  r  = iResolution.xy;
  float t  = iTime;
  vec3  FC = vec3(fragCoord, t);
  vec4  o  = vec4(0.0);

  vec3 s = normalize(FC.rgb * 2.1 - r.xyy), p, c = s;
  c /= max(1e-4, abs(c.y));
  c.z -= t;

  float z = 0.0, d = 1.0;
  for (float i = 0.0; i < 30.0; i++)
  {
    p = s * z;
    p.z -= t;
    float py = p.y;
    d = ++py;
    p.y = abs(mod(d - 2.0, 4.0) - 2.0);
    p += 0.03 * sin(c / 0.04) * abs(p.y - d);
    float dxz = abs(length(cos(p.xz)) - 0.4);
    float dy  = abs(cos(p.y + z));
    float stepLen = 0.6 * dxz + 0.1 * dy;
    z += stepLen;
    d  = max(stepLen, 1e-4);
    o.rgb += (1.1 - sin(p)) / d;
  }

  o = tanh(o / 400.0);
  fragColor = vec4(o.rgb, 1.0);
}

void main(){ mainImage(fragColor, gl_FragCoord.xy); }
`;

const VERT_SRC = `#version 300 es
precision highp float;
layout(location=0) in vec2 a_pos;
out vec2 v_uv;
void main(){
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh) || "");
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}
function link(gl: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader) {
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(prog) || "");
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

type LabShaderOptions = { interactive?: boolean };

/**
 * Boots the WebGL2 shader on the given canvas and returns a cleanup function
 * (suitable for returning straight from a useEffect). Shared by the standalone
 * `Component` and the background-only `ShaderBackground`.
 *
 * Hardened for production use as an always-on background:
 *  - GL resources can be rebuilt, so a lost context auto-restores.
 *  - prefers-reduced-motion renders a single frame but still repaints on resize.
 *  - partial GL resources are released on every failure path, and the context
 *    is explicitly released on unmount.
 */
function startLabShader(
  canvas: HTMLCanvasElement,
  { interactive = true }: LabShaderOptions = {}
): () => void {
  // preserveDrawingBuffer keeps the single reduced-motion frame on screen after
  // compositor events (tab switch, layer eviction) that aren't resize-driven.
  const gl = canvas.getContext("webgl2", {
    premultipliedAlpha: false,
    preserveDrawingBuffer: true,
  });
  if (!gl) return () => {};

  // --- GL resources (recreated on context restore) -------------------------
  let vao: WebGLVertexArrayObject | null = null;
  let vbo: WebGLBuffer | null = null;
  let vs: WebGLShader | null = null;
  let fs: WebGLShader | null = null;
  let program: WebGLProgram | null = null;
  let uRes: WebGLUniformLocation | null = null;
  let uTime: WebGLUniformLocation | null = null;
  let uFrame: WebGLUniformLocation | null = null;
  let uMouse: WebGLUniformLocation | null = null;
  let ready = false;

  const teardownGL = () => {
    try { if (program) gl.deleteProgram(program); } catch {}
    try { if (vs) gl.deleteShader(vs); } catch {}
    try { if (fs) gl.deleteShader(fs); } catch {}
    try { if (vbo) gl.deleteBuffer(vbo); } catch {}
    try { if (vao) gl.deleteVertexArray(vao); } catch {}
    program = vs = fs = null;
    vbo = null;
    vao = null;
    uRes = uTime = uFrame = uMouse = null;
    ready = false;
  };

  const buildGL = (): boolean => {
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    vs = compile(gl, gl.VERTEX_SHADER, VERT_SRC);
    fs = compile(gl, gl.FRAGMENT_SHADER, SHADER_SRC);
    if (!vs || !fs) {
      teardownGL();
      return false;
    }
    program = link(gl, vs, fs);
    if (!program) {
      teardownGL();
      return false;
    }
    gl.useProgram(program);

    uRes = gl.getUniformLocation(program, "iResolution");
    uTime = gl.getUniformLocation(program, "iTime");
    uFrame = gl.getUniformLocation(program, "iFrame");
    uMouse = gl.getUniformLocation(program, "iMouse");
    ready = true;
    return true;
  };

  if (!buildGL()) {
    teardownGL();
    try {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {}
    return () => {};
  }

  // --- input (interactive standalone only) ---------------------------------
  const mouse = { x: 0, y: 0, l: 0, r: 0 };
  const onMove = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = rect.height - (e.clientY - rect.top);
  };
  const onDown = (e: MouseEvent) => {
    if (e.button === 0) mouse.l = 1;
  };
  const onUp = (e: MouseEvent) => {
    if (e.button === 0) mouse.l = 0;
  };
  const onContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };
  if (interactive) {
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mouseup", onUp);
    canvas.addEventListener("contextmenu", onContextMenu);
  }

  // --- sizing --------------------------------------------------------------
  const applySize = () => {
    const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  };

  const reduceMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- render --------------------------------------------------------------
  let raf = 0;
  const start = performance.now();
  let frame = 0;

  const renderFrame = (now: number) => {
    if (!ready || gl.isContextLost()) return;
    const t = (now - start) / 1000;
    frame++;
    applySize();
    const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    if (uRes) gl.uniform3f(uRes, canvas.width, canvas.height, dpr);
    if (uTime) gl.uniform1f(uTime, t);
    if (uFrame) gl.uniform1i(uFrame, frame);
    if (uMouse) gl.uniform4f(uMouse, mouse.x, mouse.y, mouse.l, mouse.r);
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const tick = (now: number) => {
    renderFrame(now);
    // Honor reduced-motion: render a single frame, then idle (resize repaints).
    if (!reduceMotion) raf = requestAnimationFrame(tick);
  };

  // Repaint on resize. Under reduced-motion the loop is stopped, so a resize
  // (mobile URL bar, rotation, window resize) must redraw the static frame —
  // otherwise reassigning canvas.width/height leaves a cleared (black) buffer.
  const ro = new ResizeObserver(() => {
    if (reduceMotion) {
      applySize();
      renderFrame(performance.now());
    }
    // when animating, the RAF loop calls applySize() every frame already
  });

  applySize();
  ro.observe(canvas);
  raf = requestAnimationFrame(tick);

  // --- context loss / restore ----------------------------------------------
  const onContextLost = (e: Event) => {
    e.preventDefault(); // required so the context can be restored
    cancelAnimationFrame(raf);
    ready = false;
  };
  const onContextRestored = () => {
    if (buildGL()) {
      applySize();
      if (reduceMotion) renderFrame(performance.now());
      else raf = requestAnimationFrame(tick);
    }
  };
  canvas.addEventListener("webglcontextlost", onContextLost as EventListener);
  canvas.addEventListener("webglcontextrestored", onContextRestored as EventListener);

  // --- cleanup -------------------------------------------------------------
  return () => {
    cancelAnimationFrame(raf);
    canvas.removeEventListener("webglcontextlost", onContextLost as EventListener);
    canvas.removeEventListener("webglcontextrestored", onContextRestored as EventListener);
    if (interactive) {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("contextmenu", onContextMenu);
    }
    try { ro.disconnect(); } catch {}
    teardownGL();
    // Release the GL context in production to free the browser's context budget
    // on rapid navigation. Skipped in dev: React StrictMode double-invokes
    // effects, and a released context would leave the remounted canvas blank.
    if (process.env.NODE_ENV === "production") {
      try {
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      } catch {}
    }
  };
}

/**
 * Standalone, full-viewport interactive version (as supplied).
 */
export default function Component() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return startLabShader(canvas, { interactive: true });
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100vw",
        height: "100vh",
        display: "block",
        background: "black",
        cursor: "crosshair",
      }}
    />
  );
}

/**
 * ShaderBackground — renders ONLY the animated shader, sized to fill its
 * parent. Drop it inside an absolutely/fixed-positioned wrapper to use it as a
 * page background. Non-interactive and aria-hidden by design.
 */
export function ShaderBackground({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return startLabShader(canvas, { interactive: false });
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`block h-full w-full ${className}`}
      style={{ background: "black" }}
    />
  );
}
