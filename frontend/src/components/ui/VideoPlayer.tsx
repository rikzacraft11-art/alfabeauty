/**
 * VideoPlayer - Atomic Video Component
 * 
 * @module components/atoms/VideoPlayer
 * @description A fully self-contained video player atom with:
 * - WebM/MP4 format fallback
 * - Poster image loading
 * - Intersection Observer for autoplay
 * - Reduced motion support
 * - Error boundary handling
 * 
 * @example
 * <VideoPlayer
 *   src={{ webm: '/video.webm', mp4: '/video.mp4', poster: '/poster.jpg' }}
 *   autoPlay
 *   loop
 *   muted
 * />
 */

'use client';

import {
    useRef,
    useEffect,
    useState,
    useCallback,
    forwardRef,
    useImperativeHandle,
    type ForwardedRef,
} from 'react';

// =============================================================================
// Types
// =============================================================================

export interface VideoSource {
    readonly webm: string;
    readonly mp4: string;
    readonly poster: string;
}

export interface VideoPlayerProps {
    /** Video source configuration */
    readonly src: VideoSource;
    /** Enable autoplay (respects reduced motion) */
    readonly autoPlay?: boolean;
    /** Loop video playback */
    readonly loop?: boolean;
    /** Mute video (required for autoplay) */
    readonly muted?: boolean;
    /** Inline playback on mobile */
    readonly playsInline?: boolean;
    /** Show poster only (for reduced motion) */
    readonly posterOnly?: boolean;
    /** Additional CSS classes */
    readonly className?: string;
    /** Callback when video is ready to play */
    readonly onReady?: () => void;
    /** Callback on error */
    readonly onError?: (error: string) => void;
    /** Callback on playback progress */
    readonly onProgress?: (progress: number) => void;
}

export interface VideoPlayerHandle {
    play: () => Promise<void>;
    pause: () => void;
    restart: () => void;
    readonly isPlaying: boolean;
    readonly progress: number;
}

// =============================================================================
// Component
// =============================================================================

export const VideoPlayer = forwardRef(function VideoPlayer(
    {
        src,
        autoPlay = true,
        loop = true,
        muted = true,
        playsInline = true,
        posterOnly = false,
        className = '',
        onReady,
        onError,
        onProgress,
    }: VideoPlayerProps,
    ref: ForwardedRef<VideoPlayerHandle>
) {
    // Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // State
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    // ==========================================================================
    // Imperative Handle (expose play/pause methods)
    // ==========================================================================

    useImperativeHandle(ref, () => ({
        play: async () => {
            const video = videoRef.current;
            if (!video) return;
            try {
                await video.play();
                setIsPlaying(true);
            } catch {
                // Autoplay was prevented
                setHasError(true);
            }
        },
        pause: () => {
            const video = videoRef.current;
            if (!video) return;
            video.pause();
            setIsPlaying(false);
        },
        restart: () => {
            const video = videoRef.current;
            if (!video) return;
            video.currentTime = 0;
            video.play().catch(() => { });
        },
        get isPlaying() {
            return isPlaying;
        },
        get progress() {
            return progress;
        },
    }), [isPlaying, progress]);

    // ==========================================================================
    // Video Event Handlers
    // ==========================================================================

    const handleCanPlay = useCallback(() => {
        setIsLoaded(true);
        onReady?.();
    }, [onReady]);

    const handleError = useCallback(() => {
        setHasError(true);
        onError?.('Video failed to load');
    }, [onError]);

    const handleTimeUpdate = useCallback(() => {
        const video = videoRef.current;
        if (!video || video.duration === 0) return;

        const currentProgress = video.currentTime / video.duration;
        setProgress(currentProgress);
        onProgress?.(currentProgress);
    }, [onProgress]);

    const handlePlay = useCallback(() => {
        setIsPlaying(true);
    }, []);

    const handlePause = useCallback(() => {
        setIsPlaying(false);
    }, []);

    // ==========================================================================
    // Intersection Observer (autoplay when visible)
    // ==========================================================================

    useEffect(() => {
        if (posterOnly) return;

        const video = videoRef.current;
        const container = containerRef.current;
        if (!video || !container || !autoPlay) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video.play().catch(() => {
                        // Autoplay blocked - this is fine, show poster
                    });
                } else {
                    video.pause();
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(container);
        return () => observer.disconnect();
    }, [autoPlay, posterOnly]);

    // ==========================================================================
    // Render: Poster Only (reduced motion)
    // ==========================================================================

    if (posterOnly || hasError) {
        return (
            <div
                ref={containerRef}
                className={`relative overflow-hidden ${className}`}
                role="img"
                aria-label="Service background"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${src.poster})` }}
                />
            </div>
        );
    }

    // ==========================================================================
    // Render: Video Player
    // ==========================================================================

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${className}`}
        >
            {/* Video Element */}
            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay={autoPlay}
                loop={loop}
                muted={muted}
                playsInline={playsInline}
                preload="auto"
                poster={src.poster}
                onCanPlayThrough={handleCanPlay}
                onError={handleError}
                onTimeUpdate={handleTimeUpdate}
                onPlay={handlePlay}
                onPause={handlePause}
            >
                {/* WebM first (smaller, better quality) */}
                <source src={src.webm} type="video/webm" />
                {/* MP4 fallback (Safari) */}
                <source src={src.mp4} type="video/mp4" />
            </video>

            {/* Loading State */}
            {!isLoaded && (
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-pulse"
                    style={{ backgroundImage: `url(${src.poster})` }}
                    aria-hidden="true"
                />
            )}
        </div>
    );
});

VideoPlayer.displayName = 'VideoPlayer';
