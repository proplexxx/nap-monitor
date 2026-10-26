// Pop-out: a floating always-on-top window with the monitor.
//  1. Document picture-in-picture (desktop Chrome): the whole card moves into a
//     PiP window and keeps rendering there.
//  2. Video picture-in-picture (Android, iOS 15+, Safari): the visible feeds are
//     stitched onto a canvas and that canvas is floated as one video.

export interface Feed {
  name: string;
  video: HTMLVideoElement | null;
  crying: boolean;
}

export interface PopoutHost {
  card: HTMLElement;
  feeds: () => Feed[];
  onChange: (open: boolean) => void;
  moveOverlay: (doc: Document) => void;
}

let pipWin: Window | null = null;
let pipVideo: HTMLVideoElement | null = null;

export function isPoppedOut(): boolean {
  return !!pipWin || !!pipVideo;
}

export async function togglePopOut(host: PopoutHost): Promise<void> {
  if (pipWin) {
    pipWin.close();
    return;
  }
  if (pipVideo) {
    if (document.pictureInPictureElement) await document.exitPictureInPicture();
    return;
  }
  const w = window as any;
  if (w.documentPictureInPicture) await popOutDocument(host);
  else if (document.pictureInPictureEnabled) await popOutVideo(host);
  else throw new Error("this browser cannot float windows; use full screen instead");
}

async function popOutDocument(host: PopoutHost) {
  const win: Window = await (window as any).documentPictureInPicture.requestWindow({ width: 980, height: 420 });
  pipWin = win;
  const style = win.document.createElement("style");
  style.textContent = `body { margin: 0; height: 100vh; background: #0c0e12; color: #f3f4f6; } nap-monitor-card { display: block; height: 100%; }`;
  win.document.head.appendChild(style);

  const placeholder = document.createElement("div");
  placeholder.setAttribute("data-nap-monitor-placeholder", "");
  placeholder.style.cssText = "padding:24px;color:var(--secondary-text-color,#9aa3b2);font-size:15px";
  placeholder.textContent = "Popped out. Close the floating window to bring the monitor back here.";
  host.card.parentNode?.insertBefore(placeholder, host.card);
  win.document.body.appendChild(host.card);
  host.moveOverlay(win.document);
  host.onChange(true);

  win.addEventListener("pagehide", () => {
    placeholder.parentNode?.insertBefore(host.card, placeholder);
    placeholder.remove();
    host.moveOverlay(document);
    pipWin = null;
    host.onChange(false);
  });
}

function findVideo(el: any, depth = 0): HTMLVideoElement | null {
  if (!el || depth > 6) return null;
  if (el.tagName === "VIDEO") return el;
  const root = el.shadowRoot || el;
  const direct = root.querySelector ? root.querySelector("video") : null;
  if (direct) return direct;
  for (const child of Array.from(root.children || []) as any[]) {
    const found = findVideo(child, depth + 1);
    if (found) return found;
  }
  return null;
}

export { findVideo };

async function popOutVideo(host: PopoutHost) {
  const feeds = host.feeds();
  if (!feeds.length || !feeds.some((f) => f.video)) throw new Error("no live feeds are showing yet");
  const W = 640;
  const H = 360;
  const canvas = document.createElement("canvas");
  canvas.width = W * feeds.length;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const pv = document.createElement("video");
  pv.muted = true;
  pv.playsInline = true;
  pv.autoplay = true;
  pv.width = canvas.width;
  pv.height = canvas.height;
  pv.style.cssText = "position:fixed;right:0;bottom:0;width:640px;height:360px;max-width:100vw;opacity:.01;pointer-events:none;z-index:0;background:#000";
  pv.srcObject = canvas.captureStream(15);
  document.body.appendChild(pv);
  pipVideo = pv;

  let running = true;
  const draw = () => {
    if (!running) return;
    host.feeds().forEach((f, i) => {
      const x = i * W;
      ctx.fillStyle = "#000";
      ctx.fillRect(x, 0, W, H);
      const v = f.video;
      if (v) {
        if (v.paused) {
          try {
            v.play()?.catch(() => {});
          } catch (e) {
            /* autoplay refused */
          }
        }
        try {
          if (v.readyState >= 2) ctx.drawImage(v, x, 0, W, H);
        } catch (e) {
          /* frame not drawable yet */
        }
      }
      const live = !!(v && v.readyState >= 2);
      if (f.crying) {
        ctx.strokeStyle = "#ef5350";
        ctx.lineWidth = 12;
        ctx.strokeRect(x + 6, 6, W - 12, H - 12);
      }
      const label = f.crying ? `${f.name}: crying` : live ? f.name : `${f.name}: reconnecting`;
      ctx.font = "600 20px system-ui, sans-serif";
      const tw = ctx.measureText(label).width + 24;
      ctx.fillStyle = f.crying ? "#ef5350" : "rgba(0,0,0,.55)";
      ctx.fillRect(x + 14, 14, tw, 34);
      ctx.fillStyle = "#fff";
      ctx.fillText(label, x + 26, 38);
    });
  };
  // A worker-driven timer keeps drawing while the tab is in the background.
  let worker: Worker | null = null;
  try {
    const src = "let i=setInterval(function(){postMessage(0)},66);onmessage=function(){clearInterval(i)}";
    worker = new Worker(URL.createObjectURL(new Blob([src], { type: "text/javascript" })));
    worker.onmessage = draw;
  } catch (e) {
    worker = null;
  }
  const timer = setInterval(draw, worker ? 250 : 66);
  draw();
  await pv.play();
  if (pv.readyState < 1) await new Promise((res) => pv.addEventListener("loadedmetadata", res, { once: true }));
  await pv.requestPictureInPicture();
  host.onChange(true);
  pv.addEventListener("leavepictureinpicture", () => {
    running = false;
    if (worker) {
      worker.postMessage(0);
      worker.terminate();
    }
    clearInterval(timer);
    pv.remove();
    pipVideo = null;
    host.onChange(false);
  });
}
