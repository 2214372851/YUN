"use client";

import React, {useEffect, useRef, useState} from 'react';
import {notFound} from 'next/navigation';
import {MediaItem} from '@/types/media';
import gsap from "gsap";
import Image from 'next/image'
import Forward from "@/components/icon/forward";
import Backward from "@/components/icon/backward";
import {getAllMediaItems} from "@/data/media";
import TransitionLink from "@/components/TransitionLink";

interface LyricLine {
    time: number;
    text: string;
}

const parseLRC = (lrc: string): LyricLine[] => {
    const result: LyricLine[] = [];
    // 支持 [mm:ss.xx] 和 [mm:ss:xx] 格式
    const timeRegex = /\[(\d+):(\d+)[.:](\d+)]/g;

    // 处理所有时间标签，不管是否有换行符
    let match;
    while ((match = timeRegex.exec(lrc)) !== null) {
        const minutes = parseInt(match[1]);
        const seconds = parseInt(match[2]);
        const milliseconds = parseInt(match[3]);
        const time = minutes * 60 + seconds + milliseconds / 1000;

        // 获取时间标签后的文本（直到下一个时间标签或文件结尾）
        const textStart = match.index + match[0].length;
        const nextMatch = timeRegex.exec(lrc);
        const textEnd = nextMatch ? nextMatch.index : lrc.length;
        timeRegex.lastIndex = textStart; // 重置以便下次继续匹配

        const text = lrc.slice(textStart, textEnd).trim();
        if (text) {
            result.push({time, text});
        }
    }

    return result.sort((a, b) => a.time - b.time);
};

interface Props {
    musicItem: MediaItem | undefined;
}

const MusicDetail = ({musicItem}: Props) => {
    if (!musicItem) {
        notFound();
    }

    const audioRef = useRef<HTMLAudioElement>(null);
    const {title, imageUrl, author, musicUrl, lyricsUrl, id} = musicItem;
    const [lyrics, setLyrics] = useState<LyricLine[]>([]);
    const [currentLine, setCurrentLine] = useState(0);
    const musicItems = getAllMediaItems();
    const selfIndex = musicItems.findIndex((item) => item.id === id);

    const forward = () => {
        if (selfIndex < musicItems.length - 1) {
            return musicItems[selfIndex + 1].id;
        }
        return musicItems[0].id;
    }
    const backward = () => {
        if (selfIndex > 0) {
            return musicItems[selfIndex - 1].id;
        }
        return musicItems[musicItems.length - 1].id;
    }

    const splitWord = (text: string) => {
        try {
            const segmenter = new Intl.Segmenter("zh", {granularity: "word"})
            const segments = [...segmenter.segment(text)];
            segments.sort((a, b) => b.segment.length - a.segment.length);
            return segments[0].segment;
        } catch (error) {
            return text[0];
        }
    }

    useEffect(() => {
        if (lyricsUrl) {
            console.log('Fetching lyrics from:', lyricsUrl);
            const fetchLyrics = async (retryCount = 0) => {
                try {
                    const response = await fetch(lyricsUrl, {
                        credentials: 'include',
                        headers: {
                            'Accept': 'text/plain',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                        }
                    });

                    if (!response.ok) {
                        console.error('Failed to fetch lyrics:', lyricsUrl);
                    }

                    const text = await response.text();
                    const parsed = parseLRC(text);
                    setLyrics(parsed);
                } catch (error: unknown) {
                    console.error('Failed to load lyrics:', error);

                    // 如果是DNS错误或网络错误，尝试重试
                    if (retryCount < 3 && error instanceof Error &&
                        (error.message.includes('DNS') || error.message.includes('network'))) {
                        console.log(`Retrying... (${retryCount + 1}/3)`);
                        // 使用指数退避策略
                        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
                        return fetchLyrics(retryCount + 1);
                    }

                    setLyrics([{time: 0, text: '歌词加载失败，请稍后重试'}]);
                }
            };

            fetchLyrics();
        } else {
            console.log('No lyricsUrl provided');
            setLyrics([{time: 0, text: '暂无歌词'}]);
        }
    }, [lyricsUrl]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || lyrics.length === 0) return;


        const updateLyrics = () => {
            const currentTime = audio.currentTime;
            let lineIndex = -1;
            const element = document.getElementById('lyrics')
            const elementWord = document.getElementById('lyrics-word')

            // 精确查找当前时间对应的歌词行
            for (let i = 0; i < lyrics.length; i++) {
                if (currentTime >= lyrics[i].time &&
                    (i === lyrics.length - 1 || currentTime < lyrics[i + 1].time)) {
                    lineIndex = i;
                    break;
                }
            }

            if (lineIndex !== -1 && lineIndex !== currentLine) {
                const rotate = lineIndex % 2 === 0 ? 8 : -8;
                const tl = gsap.timeline();
                tl.to(element, {
                    duration: 0.2,                 // 增加动画时长
                    scale: 0.6,                    // 缩小得更多
                    color: "#999",                 // 颜色变得更浅
                    opacity: 0,                    //
                    ease: "power2.out"             // 使用更强的缓动函数
                });
                tl.call(() => setCurrentLine(lineIndex));
                tl.set(element, {
                    opacity: 0,
                    letterSpacing: "4em",
                    filter: "blur(5px)",
                    y: 20,
                    rotation: rotate
                });
                tl.set(
                    elementWord,
                    {
                        opacity: 0,
                    },
                )
                // 淡入动画
                tl.to(element, {
                    duration: 0.6,
                    opacity: 1,
                    letterSpacing: ".3em",
                    filter: "blur(0px)",
                    y: 0,
                    rotation: 0,
                    ease: "power2.out"
                });
                tl.to(
                    elementWord,
                    {
                        duration: 0.4,
                        scale: 1,
                        opacity: 1
                    }
                )

                tl.play();

            }
        };

        // 提高更新频率以获得更流畅的效果
        audio.addEventListener('timeupdate', updateLyrics);
        const interval = setInterval(updateLyrics, 100);

        return () => {
            audio.removeEventListener('timeupdate', updateLyrics);
            clearInterval(interval);
        };
    }, [currentLine, lyrics]);

    return (
        <main className="min-h-screen flex flex-col items-center overflow-hidden">
            <div className="flex-1 pt-32 pb-24 container max-w-6xl mx-auto">
                {/* 图片和歌词容器 */}
                <div className="gap-8 h-[60vh]">


                    {/* 右侧 - 歌名、作者和歌词 */}
                    <div className="relative md:w-full h-3/4 flex justify-center items-center">

                        {lyrics.length > 0 ? (
                            <div>
                                <div
                                    id="lyrics"
                                    className="text-center justify-center space-y-6 tracking-[.3em]"
                                >
                                    {lyrics[currentLine].text.split(' ').map((line, index) => (
                                        <p
                                            key={index}
                                            className='ransition-all text-white/90 font-bold text-5xl z-20 whitespace-nowrap'
                                        >
                                            {line}
                                        </p>
                                    ))}
                                </div>
                                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                                    <div
                                        id='lyrics-word'
                                        className="text-[10rem] font-bold text-white/30 text-center blur-[3px] pointer-events-none"
                                    >
                                        {splitWord(lyrics[currentLine].text)}
                                    </div>
                                </div>
                            </div>
                        ) : lyricsUrl && (
                            <div className="text-center mt-8">
                                <a
                                    href={lyricsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block text-blue-500 hover:text-blue-400 transition-colors"
                                >
                                    查看歌词
                                </a>
                            </div>
                        )}


                    </div>
                </div>
                <div className="flex items-center">
                    {/*左侧 - 图片 */}
                    <div className="md:w-1/2 flex flex-col items-center justify-center">
                        <Image
                            src={imageUrl}
                            alt={title}
                            width={30}
                            height={30}
                            className="rounded-md shadow-lg w-36 h-36 object-cover"
                        />
                    </div>
                    <AudioPlayer
                        forward={forward()}
                        backward={backward()}
                        src={musicUrl}
                        author={author}
                        title={title}
                        ref={audioRef}/>
                </div>

                {/* 播放器 - 放在整个flex容器下方 */}
                {musicUrl && (
                    <div className="w-full mt-8 flex justify-center">
                        <div className="relative w-full max-w-2xl">
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

const AudioPlayer = React.forwardRef<HTMLAudioElement, {
    src: string,
    author: string,
    title: string,
    forward: string,
    backward: string,
}>(({src, author, title, backward, forward}, forwardedRef) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    // 合并ref处理
    React.useImperativeHandle(forwardedRef, () => audioRef.current as HTMLAudioElement);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (audio) {
            const newCurrentTime = audio.currentTime;
            const newDuration = audio.duration || duration;
            if (newDuration > 0) {
                // 使用requestAnimationFrame实现平滑过渡
                requestAnimationFrame(() => {
                    const newProgress = (newCurrentTime / newDuration) * 100;
                    setCurrentTime(newCurrentTime);
                    setProgress(newProgress);
                    setDuration(newDuration);
                });
            }
            if (newCurrentTime >= newDuration) {
                setIsPlaying(false);
            }
        }
    };

    const handleLoadedMetadata = () => {
        const audio = audioRef.current;
        if (audio) {
            const newDuration = audio.duration;
            setDuration(newDuration);
            // 重置进度为0但保留当前播放状态
            if (audio.currentTime > 0) {
                setCurrentTime(0);
                setProgress(0);
            }
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const seekTime = (parseFloat(e.target.value) / 100) * duration;
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = seekTime;
            setCurrentTime(seekTime);
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.addEventListener('timeupdate', handleTimeUpdate);
            audio.addEventListener('loadedmetadata', handleLoadedMetadata);
            return () => {
                audio.removeEventListener('timeupdate', handleTimeUpdate);
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            };
        }
    });

    return (
        <div className="p-4 w-full">

            <audio
                src={src}
                ref={audioRef}
                className="hidden"
            >
                Your browser does not support the audio element.
            </audio>
            <h1 className="text-2xl font-bold mb-8 text-center">{title} - {author}</h1>
            <div className="flex items-center gap-4 flex-col md:flex-row">
                <div className="flex gap-3">
                    <TransitionLink
                        className="text-white hover:text-blue-400 transition-colors" href={`/media/${backward}/`}>
                        <Backward/>
                    </TransitionLink>
                    <button
                        onClick={togglePlay}
                        className="text-white hover:text-blue-400 transition-colors"
                    >
                        {isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        )}
                    </button>
                    <TransitionLink
                        className="text-white hover:text-blue-400 transition-colors" href={`/media/${forward}/`}>
                        <Forward/>
                    </TransitionLink>
                </div>

                {/* 进度条和时间显示 */}
                <div className="flex-1 flex flex-col justify-center gap-1">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={handleSeek}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                        style={{
                            background: `linear-gradient(to right, #3b82f6 ${progress}%, #e5e7eb ${progress}%)`
                        }}
                    />
                </div>
            </div>
        </div>
    );
});
AudioPlayer.displayName = 'AudioPlayer';

export default MusicDetail;
