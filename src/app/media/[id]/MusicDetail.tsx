"use client";

import React, {useEffect, useRef, useState} from 'react';
import {notFound} from 'next/navigation';
import {MediaItem} from '@/types/media';
import Image from "next/image";

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
    const {title, imageUrl, author, musicUrl, lyricsUrl} = musicItem;
    const [lyrics, setLyrics] = useState<LyricLine[]>([]);
    const [currentLine, setCurrentLine] = useState(0);
    const lyricsContainerRef = useRef<HTMLDivElement>(null);

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

                    const contentType = response.headers.get('content-type');
                    if (!contentType || !contentType.includes('text/plain')) {
                        console.error('Failed to fetch lyrics:', lyricsUrl);
                    }

                    const text = await response.text();
                    console.log('Received lyrics:', text.substring(0, 100) + '...');
                    const parsed = parseLRC(text);
                    console.log('Parsed lyrics count:', parsed.length);
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

            // 精确查找当前时间对应的歌词行
            for (let i = 0; i < lyrics.length; i++) {
                if (currentTime >= lyrics[i].time &&
                    (i === lyrics.length - 1 || currentTime < lyrics[i + 1].time)) {
                    lineIndex = i;
                    break;
                }
            }

            if (lineIndex !== -1 && lineIndex !== currentLine) {
                setCurrentLine(lineIndex);

                if (lyricsContainerRef.current) {
                    const lineElement = lyricsContainerRef.current.children[lineIndex] as HTMLElement;
                    if (lineElement) {

                        // 确保容器已渲染完成
                        requestAnimationFrame(() => {
                            if (lyricsContainerRef.current && lineElement) {
                                // 重新获取最新位置信息
                                const containerHeight = lyricsContainerRef.current.offsetHeight;
                                const lineTop = lineElement.offsetTop;
                                const lineHeight = lineElement.offsetHeight;

                                // 更精确的滚动定位，使当前行保持在容器中间
                                lyricsContainerRef.current.scrollTo({
                                    top: lineTop - (containerHeight / 2) + (lineHeight / 2),
                                    behavior: 'smooth'
                                });
                            }
                        });
                    }
                }
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
        <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 pt-32 pb-24 px-4 container max-w-6xl mx-auto">
                {/* 图片和歌词容器 */}
                <div className="flex flex-col md:flex-row gap-8">
                    {/* 左侧 - 图片 */}
                    <div className="md:w-1/2 flex flex-col items-center justify-center">
                        <Image
                            src={imageUrl}
                            alt={title}
                            width={100}
                            height={100}
                            className="rounded-md shadow-lg w-64 h-64 object-cover"
                        />
                    </div>

                    {/* 右侧 - 歌名、作者和歌词 */}
                    <div className="md:w-1/2">
                        <h1 className="text-4xl font-bold mb-8 text-center">{title} - {author}</h1>

                        {lyrics.length > 0 ? (
                            <div
                                ref={lyricsContainerRef}
                                className="mt-8 h-96 overflow-y-auto text-center p-4 relative"
                            >
                                {lyrics.map((line, index) => (
                                    <p
                                        key={index}
                                        className={`py-2 px-4 transition-all duration-300 ${index === currentLine ?
                                            'text-blue-500 font-bold text-lg' :
                                            'text-white'}`}
                                    >
                                        {line.text}
                                    </p>
                                ))}
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

                {/* 播放器 - 放在整个flex容器下方 */}
                {musicUrl && (
                    <div className="w-full mt-8 flex justify-center">
                        <div className="relative w-full max-w-2xl">
                            {/* 毛玻璃背景层 */}
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-xl -z-10"/>
                            <AudioPlayer src={musicUrl} ref={audioRef}/>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

const AudioPlayer = React.forwardRef<HTMLAudioElement, { src: string }>(({src}, forwardedRef) => {
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
                    setProgress(prev => {
                        // 限制最大变化幅度为5%，避免跳跃
                        const maxChange = 5;
                        const diff = newProgress - prev;
                        return prev + Math.sign(diff) * Math.min(Math.abs(diff), maxChange);
                    });
                    setDuration(newDuration);
                });
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

            <div className="flex items-center gap-4">
                {/* 播放按钮 */}
                <button
                    onClick={togglePlay}
                    className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
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

                {/* 进度条和时间显示 */}
                <div className="flex-1 flex flex-col justify-center gap-1">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={handleSeek}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 transition-all duration-100"
                        style={{
                            background: `linear-gradient(to right, #3b82f6 ${progress}%, #e5e7eb ${progress}%)`
                        }}
                    />
                    <div className="flex justify-between text-sm text-gray-400">
                        <span>{new Date(currentTime * 1000).toISOString().substr(14, 5)}</span>
                        <span>{new Date(duration * 1000).toISOString().substr(14, 5)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
});
AudioPlayer.displayName = 'AudioPlayer';

export default MusicDetail;
