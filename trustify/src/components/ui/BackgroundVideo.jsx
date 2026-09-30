import { useEffect, useRef, useState } from "react";

/** Load once near the viewport; decode only while visible and tab is active. */
export default function BackgroundVideo({ src, poster, className }) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const video = ref.current;
    let visible = false;
    let disposed = false;
    function sync() {
      if (visible && !document.hidden) video.play().catch(() => {});
      else video.pause();
    }
    const load = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setLoaded(true); load.disconnect(); }
    }, { rootMargin: "200px" });
    const playback = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting; if (!disposed) sync();
    }, { threshold: 0.05 });
    load.observe(video); playback.observe(video);
    video.addEventListener("loadeddata", sync);
    document.addEventListener("visibilitychange", sync);
    return () => { disposed = true; load.disconnect(); playback.disconnect(); document.removeEventListener("visibilitychange", sync); video.removeEventListener("loadeddata", sync); video.pause(); };
  }, [src]);
  return <video ref={ref} src={loaded ? src : undefined} poster={poster} className={className} muted loop playsInline preload="none" aria-hidden="true" />;
}
