import * as React from "react";
import { Maximize2, Pause, Play, Sparkles, Volume2, VolumeX } from "lucide-react";

export function AtmosphereVideo() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(true);
  const [progress, setProgress] = React.useState(0);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 13;
    setProgress((current / duration) * 100);
  };

  return (
    <div className="relative mx-auto w-full max-w-[420px] sm:max-w-[460px]">
      {/* Warm ambient background glow */}
      <div className="pointer-events-none absolute -inset-2 rounded-[2.5rem] bg-gradient-to-tr from-accent/30 via-primary/30 to-amber-600/20 opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="group relative overflow-hidden rounded-[2rem] border border-border/80 bg-stone-950 shadow-2xl">
        {/* Top Badges */}
        <div className="absolute inset-x-4 top-4 z-20 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-950/80 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-stone-100 border border-stone-800 shadow-md">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Inside Kahwa Raw</span>
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-accent/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground shadow-sm">
            <Sparkles className="size-3" />
            Official Tour
          </span>
        </div>

        {/* Video Canvas */}
        <div
          className="relative aspect-[9/16] w-full cursor-pointer bg-stone-950"
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            src="/kahwa-atmosphere.mp4"
            loop
            autoPlay
            muted={isMuted}
            playsInline
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="h-full w-full object-cover object-center"
          />

          {/* Large Center Play overlay on pause */}
          {!isPlaying && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all">
              <div className="grid size-16 place-items-center rounded-full bg-accent text-accent-foreground shadow-2xl ring-4 ring-white/20 transition-transform duration-200 hover:scale-110">
                <Play className="size-8 fill-current ml-1" />
              </div>
            </div>
          )}

          {/* Bottom gradient shadow for control bar legibility */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        </div>

        {/* Bottom Control Bar */}
        <div className="absolute inset-x-0 bottom-0 z-20 p-4">
          {/* Progress bar */}
          <div className="relative mb-3 h-1.5 w-full overflow-hidden rounded-full bg-stone-700/60 backdrop-blur-xs">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-accent transition-all duration-100 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="grid size-9 place-items-center rounded-full bg-stone-900/80 backdrop-blur-md text-stone-200 border border-stone-700/60 hover:bg-accent hover:text-white transition-colors cursor-pointer"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 fill-current ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold backdrop-blur-md border transition-all cursor-pointer ${
                  isMuted
                    ? "bg-stone-900/80 text-stone-300 border-stone-700/60 hover:border-accent hover:text-accent"
                    : "bg-accent text-accent-foreground border-accent shadow-md shadow-accent/20"
                }`}
                aria-label={isMuted ? "Unmute audio" : "Mute audio"}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="size-3.5" />
                    <span>Tap for Music</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="size-3.5" />
                    <span>Music On</span>
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleFullscreen();
              }}
              className="grid size-9 place-items-center rounded-full bg-stone-900/80 backdrop-blur-md text-stone-200 border border-stone-700/60 hover:bg-stone-800 transition-colors cursor-pointer"
              aria-label="Fullscreen"
            >
              <Maximize2 className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
