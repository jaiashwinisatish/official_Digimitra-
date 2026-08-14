import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Settings, FastForward, Sparkles, AlertCircle, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface LmsVideoPlayerProps {
  lessonId: string;
  title: string;
  videoUrl: string;
  durationSeconds?: number;
  initialPosition?: number;
  autoPlayNext?: boolean;
  onAutoPlayNextToggle?: (enabled: boolean) => void;
  onProgressUpdate?: (currentSeconds: number, totalSeconds: number) => void;
  onComplete?: () => void;
  onNextLesson?: () => void;
}

export const LmsVideoPlayer: React.FC<LmsVideoPlayerProps> = ({
  lessonId,
  title,
  videoUrl,
  durationSeconds = 600,
  initialPosition = 0,
  autoPlayNext = true,
  onAutoPlayNextToggle,
  onProgressUpdate,
  onComplete,
  onNextLesson,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(initialPosition);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showResumePrompt, setShowResumePrompt] = useState(initialPosition > 15 && initialPosition < durationSeconds - 30);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Convert raw Drive / YouTube / Stream URLs into embed link
  const getEmbedUrl = (url: string) => {
    if (!url) return 'https://www.youtube.com/embed/S-nHYzK-BVg?autoplay=1';

    // YouTube URL extraction
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let ytId: string | undefined;

      // Handle youtu.be/VIDEO_ID?si=xxx (short links from docx)
      const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
      if (shortMatch) {
        ytId = shortMatch[1];
      }

      // Handle youtube.com/watch?v=VIDEO_ID
      if (!ytId) {
        const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
        if (watchMatch) ytId = watchMatch[1];
      }

      // Handle youtube.com/embed/VIDEO_ID or /shorts/VIDEO_ID
      if (!ytId) {
        const embedMatch = url.match(/(?:embed|shorts)\/([a-zA-Z0-9_-]{11})/);
        if (embedMatch) ytId = embedMatch[1];
      }

      if (ytId) return `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&enablejsapi=1`;
    }

    // Google Drive file link
    if (url.includes('drive.google.com/file/d/')) {
      const fileId = url.match(/file\/d\/([a-zA-Z0-9_-]+)/)?.[1];
      if (fileId) return `https://drive.google.com/file/d/${fileId}/preview`;
    }

    // Google Drive folder — not embeddable, return a placeholder
    if (url.includes('drive.google.com/drive/folders/')) {
      return 'https://www.youtube.com/embed/S-nHYzK-BVg?autoplay=1';
    }

    // Fallback
    return url.includes('?') ? `${url}&autoplay=1` : `${url}?autoplay=1`;
  };

  useEffect(() => {
    setCurrentTime(initialPosition);
    setShowResumePrompt(initialPosition > 15 && initialPosition < durationSeconds - 30);
    setIsCompleted(false);
    setHasError(false);
  }, [lessonId, initialPosition, durationSeconds, videoUrl]);

  // Heartbeat timer for progress tracking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !hasError) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const nextTime = Math.min(durationSeconds, prev + 1 * playbackSpeed);
          
          if (onProgressUpdate) {
            onProgressUpdate(Math.round(nextTime), durationSeconds);
          }

          // Auto complete at >= 90%
          const pct = (nextTime / durationSeconds) * 100;
          if (pct >= 90 && !isCompleted) {
            setIsCompleted(true);
            if (onComplete) onComplete();
          }

          // Video ended
          if (nextTime >= durationSeconds) {
            setIsPlaying(false);
            if (autoPlayNext && onNextLesson) {
              onNextLesson();
            }
          }

          return nextTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, durationSeconds, playbackSpeed, isCompleted, autoPlayNext, hasError, onProgressUpdate, onComplete, onNextLesson]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleSeek = (values: number[]) => {
    const newTime = values[0];
    setCurrentTime(newTime);
    if (onProgressUpdate) {
      onProgressUpdate(Math.round(newTime), durationSeconds);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.log(err));
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const watchPct = Math.min(100, Math.round((currentTime / durationSeconds) * 100));
  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div ref={containerRef} className="relative group rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10 select-none">
      {/* Video Viewport */}
      <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
        {!hasError ? (
          <iframe
            ref={iframeRef}
            key={`${lessonId}-${playbackSpeed}`}
            src={embedUrl}
            title={title}
            className="absolute inset-0 w-full h-full border-0 pointer-events-auto"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onError={() => setHasError(true)}
          />
        ) : (
          /* Graceful LMS Error Fallback View */
          <div className="absolute inset-0 bg-slate-900/95 p-8 flex flex-col items-center justify-center text-center space-y-4 z-20">
            <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Stream Error</h3>
              <p className="text-sm text-slate-300 max-w-md">
                Unable to load video stream inside iframe. Please refresh or try again.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button size="sm" variant="hero" onClick={() => setHasError(false)}>
                <RefreshCw className="h-4 w-4 mr-2" /> Retry Stream
              </Button>
            </div>
          </div>
        )}

        {/* Auto Resume Banner Overlay */}
        {showResumePrompt && !hasError && (
          <div className="absolute top-4 left-4 right-4 bg-background/95 backdrop-blur-md p-4 rounded-2xl border border-primary/30 shadow-2xl flex flex-wrap items-center justify-between gap-3 z-30 animate-in fade-in slide-in-from-top-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Resume lesson from {formatTime(initialPosition)}?</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="hero" onClick={() => setShowResumePrompt(false)}>
                Resume
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setCurrentTime(0); setShowResumePrompt(false); }}>
                Start Over
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modern LMS Control Bar */}
      <div className="bg-slate-900/95 backdrop-blur-md p-4 border-t border-white/10 space-y-3">
        {/* Progress Scrubber */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-semibold text-slate-400 px-1">
            <span>{formatTime(currentTime)}</span>
            <span className="text-primary font-bold">{watchPct}% Watched</span>
            <span>{formatTime(durationSeconds)}</span>
          </div>
          <Slider
            value={[currentTime]}
            max={durationSeconds}
            step={1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
        </div>

        {/* Action Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-200 hover:text-white hover:bg-white/10" onClick={togglePlay}>
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            
            <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-200 hover:text-white hover:bg-white/10" onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}>
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-200 hover:text-white hover:bg-white/10" onClick={() => setCurrentTime(Math.min(durationSeconds, currentTime + 10))}>
              <FastForward className="h-4 w-4" />
            </Button>

            <div className="h-4 w-px bg-white/20 mx-1" />

            <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-200 hover:text-white hover:bg-white/10" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.05}
              onValueChange={(val) => { setVolume(val[0]); setIsMuted(val[0] === 0); }}
              className="w-20 cursor-pointer hidden sm:block"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Auto Play Next Switch */}
            {onAutoPlayNextToggle && (
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/60 px-3 py-1.5 rounded-full border border-white/10">
                <Label htmlFor="auto-next" className="cursor-pointer text-[11px]">Auto-next</Label>
                <Switch
                  id="auto-next"
                  checked={autoPlayNext}
                  onCheckedChange={onAutoPlayNextToggle}
                />
              </div>
            )}

            {/* Playback Speed Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="h-8 px-2.5 text-xs text-slate-200 hover:bg-white/10 border border-white/10 rounded-lg">
                  <Settings className="h-3.5 w-3.5 mr-1" /> {playbackSpeed}x
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                  <DropdownMenuItem
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`cursor-pointer text-xs ${playbackSpeed === speed ? "text-primary font-bold bg-primary/10" : ""}`}
                  >
                    {speed}x {speed === 1 ? "(Normal)" : ""}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Fullscreen Button */}
            <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-200 hover:text-white hover:bg-white/10" onClick={toggleFullscreen}>
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
