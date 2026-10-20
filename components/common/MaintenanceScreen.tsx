const GEAR =
  "M-8-52h16l4 14a40 40 0 0 1 12 5l13-7 11 11-7 13a40 40 0 0 1 5 12l14 4v16l-14 4a40 40 0 0 1-5 12l7 13-11 11-13-7a40 40 0 0 1-12 5l-4 14h-16l-4-14a40 40 0 0 1-12-5l-13 7-11-11 7-13a40 40 0 0 1-5-12l-14-4v-16l14-4a40 40 0 0 1 5-12l-7-13 11-11 13 7a40 40 0 0 1 12-5z";

export default function MaintenanceScreen() {
  return (
    <main className="mt-wrap">
      <style>{css}</style>

      <header className="mt-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="" width={40} height={40} />
        <b>kartsquare</b>
      </header>

      <section className="mt-body">
        <svg
          className="mt-art"
          viewBox="-70 -70 140 140"
          role="img"
          aria-label="Gear turning"
        >
          <circle r="64" fill="#f5efff" />
          <g className="mt-spin">
            <path d={GEAR} fill="#8800ff" transform="scale(.8)" />
            <circle r="14" fill="#fff" />
          </g>
        </svg>

        <h1>We&apos;re going crazy on maintenance</h1>
        <p>kartsquare is getting an upgrade. We&apos;ll be back shortly.</p>

        <div className="mt-bar" aria-hidden="true">
          <span />
        </div>
      </section>

      <footer>© kartsquare</footer>
    </main>
  );
}

const css = `
body{margin:0;background:#fff}
.mt-wrap{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:28px 20px;box-sizing:border-box;font-family:'Poppins',system-ui,sans-serif;color:#111827;background:#fff}
.mt-brand{display:flex;align-items:center;gap:10px}
.mt-brand img{width:40px;height:40px;object-fit:contain}
.mt-brand b{font-size:1.4rem;font-weight:700;letter-spacing:-.03em}
.mt-brand span{color:#8800ff}
.mt-body{display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;animation:mt-in .6s ease both}
.mt-art{width:132px;height:132px;margin-bottom:8px}
.mt-body h1{margin:0;font-size:clamp(1.5rem,5vw,2.25rem);font-weight:700;letter-spacing:-.02em}
.mt-body p{margin:0;font-size:1rem;color:#6b7280}
.mt-bar{width:160px;height:3px;margin-top:10px;border-radius:2px;background:#ede9fe;overflow:hidden}
.mt-bar span{display:block;width:40%;height:100%;background:#8800ff;border-radius:2px;animation:mt-slide 1.5s ease-in-out infinite}
.mt-wrap footer{font-size:.78rem;color:#9ca3af}
.mt-spin{animation:mt-rot 10s linear infinite}
@keyframes mt-rot{to{transform:rotate(360deg)}}
@keyframes mt-slide{from{transform:translateX(-100%)}to{transform:translateX(250%)}}
@keyframes mt-in{from{opacity:0;transform:translateY(10px)}}
@media (prefers-reduced-motion:reduce){.mt-spin,.mt-bar span,.mt-body{animation:none}}
`;
