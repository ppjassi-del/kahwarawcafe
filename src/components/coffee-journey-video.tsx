import * as React from "react";
import {
  Coffee,
  Flame,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { ReservationDialog } from "@/components/reservation-dialog";
import { MenuBoardDialog } from "@/components/menu-board-dialog";

const craftStages = [
  {
    step: "01",
    title: "The Raw Cherry",
    description: "Carefully selected raw coffee pods cracked open to reveal pure, unadulterated green beans.",
    icon: Sparkles,
  },
  {
    step: "02",
    title: "The Artisan Roast",
    description: "Transformed through precision roasting to develop rich chocolate undertones and signature warmth.",
    icon: Flame,
  },
  {
    step: "03",
    title: "Ground to Order",
    description: "Bursted and finely milled moments prior to extraction, sealing in peak aromatic oils and freshness.",
    icon: RotateCcw,
  },
  {
    step: "04",
    title: "The Signature Cup",
    description: "Poured hot, crowned with the Kahwa Raw insignia and paired with warm hospitality in northwest Edmonton.",
    icon: Coffee,
  },
];

export function CoffeeJourneyVideo() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const [activeStage, setActiveStage] = React.useState(0);

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
    const duration = videoRef.current.duration || 15;
    setProgress((current / duration) * 100);

    // Sync active stage with video timeline (15 seconds total)
    if (current < 4) {
      setActiveStage(0);
    } else if (current < 7) {
      setActiveStage(1);
    } else if (current < 11) {
      setActiveStage(2);
    } else {
      setActiveStage(3);
    }
  };

  const seekToStage = (index: number) => {
    if (!videoRef.current) return;
    const times = [0, 4, 7.5, 11.5];
    videoRef.current.currentTime = times[index] ?? 0;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section
      id="craft-story"
      className="relative scroll-mt-20 overflow-hidden border-b border-border/80 bg-gradient-to-b from-background via-stone-900 to-stone-950 py-20 text-stone-100 sm:py-28"
    >
      {/* Subtle ambient lighting glows */}
      <div className="pointer-events-none absolute -left-40 top-1/4 size-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-1/4 size-96 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            <Sparkles className="size-3.5" />
            The Kahwa Raw Experience
          </p>
          <h2 className="mt-5 font-display text-4xl sm:text-6xl font-semibold tracking-tight text-stone-100">
            From Raw Bean to Your Cup.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-300 max-w-xl mx-auto leading-relaxed">
            Watch the craft behind every single serving. Raw origins, artisan roasting, and dedicated brewing in northwest Edmonton.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[400px_1fr] lg:items-center xl:grid-cols-[440px_1fr] max-w-6xl mx-auto">
          {/* Vertical Video Showcase Frame */}
          <div className="relative mx-auto w-full max-w-[360px] sm:max-w-[390px]">
            {/* Ambient decorative glow around phone-like frame */}
            <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-accent/50 via-primary/40 to-amber-500/30 opacity-70 blur-xl transition-all duration-500 group-hover:opacity-100" />

            <div className="group relative overflow-hidden rounded-[2.25rem] border border-stone-700/80 bg-stone-950 shadow-2xl">
              {/* Top Floating Badge */}
              <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full bg-stone-950/70 backdrop-blur-md px-3 py-1 border border-stone-700/60 text-xs font-bold text-stone-200">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>The Kahwa Craft</span>
                <span className="text-[10px] text-stone-400 font-semibold">• 15s</span>
              </div>

              {/* Video Player */}
              <div className="relative aspect-[9/16] w-full cursor-pointer bg-stone-950" onClick={togglePlay}>
                <video
                  ref={videoRef}
                  src="/kahwa-video.mp4"
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

                {/* Big Center Play Overlay (when paused) */}
                {!isPlaying && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all">
                    <div className="grid size-16 place-items-center rounded-full bg-accent text-accent-foreground shadow-2xl ring-4 ring-white/20 transition-transform duration-200 hover:scale-110">
                      <Play className="size-8 fill-current ml-1" />
                    </div>
                  </div>
                )}

                {/* Bottom Gradient for Controls */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              </div>

              {/* Custom In-Video Control Bar */}
              <div className="absolute inset-x-0 bottom-0 z-20 p-4">
                {/* Thin timeline progress bar */}
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
                          <span>Tap for Sound</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="size-3.5" />
                          <span>Sound On</span>
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

          {/* Interactive Story Timeline */}
          <div className="flex flex-col justify-center lg:pl-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              The 4 Stages of Perfection
            </p>
            <h3 className="mt-2 text-2xl sm:text-3xl font-display font-semibold text-stone-100">
              Interactive Story Beats
            </h3>
            <p className="mt-2 text-sm text-stone-400">
              Click any stage below to jump directly to that chapter in the craft reel:
            </p>

            <div className="mt-6 space-y-3.5">
              {craftStages.map((stage, idx) => {
                const Icon = stage.icon;
                const isCurrent = activeStage === idx;
                return (
                  <button
                    key={stage.step}
                    type="button"
                    onClick={() => seekToStage(idx)}
                    className={`w-full text-left rounded-2xl p-4 sm:p-5 border transition-all duration-300 cursor-pointer flex items-start gap-4 ${
                      isCurrent
                        ? "bg-stone-900/90 border-accent/80 shadow-lg shadow-accent/10 translate-x-2"
                        : "bg-stone-950/40 border-stone-800 hover:bg-stone-900/50 hover:border-stone-700"
                    }`}
                  >
                    <div
                      className={`grid size-11 shrink-0 place-items-center rounded-xl font-display font-bold text-base transition-colors ${
                        isCurrent
                          ? "bg-accent text-accent-foreground shadow-md shadow-accent/30"
                          : "bg-stone-900 text-stone-400 border border-stone-800"
                      }`}
                    >
                      <Icon className="size-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-lg sm:text-xl font-bold text-stone-100">
                          {stage.step}. {stage.title}
                        </span>
                        {isCurrent && (
                          <span className="rounded-full bg-accent/20 border border-accent/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent shrink-0">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs sm:text-sm leading-relaxed text-stone-400">
                        {stage.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4 pt-2">
              <ReservationDialog
                variant="hero"
                triggerText="Reserve a Table"
                triggerClassName="btn-contemporary group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm sm:text-base font-bold text-accent-foreground shadow-md shadow-accent/20 hover:bg-accent/90 cursor-pointer"
              />
              <MenuBoardDialog
                triggerText="View Menu Board"
                triggerClassName="btn-contemporary group inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-stone-700 bg-stone-900/80 px-6 py-2.5 text-sm sm:text-base font-bold text-stone-200 hover:border-accent hover:text-accent transition-colors cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
