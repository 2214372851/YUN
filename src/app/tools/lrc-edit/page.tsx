"use client";

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Button} from "@/components/ui/button";
import {AudioProgressBar} from "@/components/ui/audio-progress-bar";
import {Clock, Download, Music, Pause, Play, Plus, Square, Trash2, Upload} from "lucide-react";
import {useToast} from "@/hooks/use-toast";

interface LyricLine {
    id: string;
    time: number; // 时间戳（秒）
    text: string;
}

interface LrcMetadata {
    title?: string;
    artist?: string;
    album?: string;
    by?: string;
    offset?: number;
}

const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);

    // 如果有小时，显示小时格式
    if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    }

    // 否则显示分钟格式
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
};

// LRC文件专用格式: [mm:ss.xx]
const formatLrcTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    // LRC格式使用百分之一秒，不是毫秒
    const centisecs = Math.round((seconds - Math.floor(seconds)) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centisecs.toString().padStart(2, '0')}`;
};

const parseTime = (timeStr: string): number => {
    // 解析LRC格式: mm:ss.xx 或 mm:ss
    const match = timeStr.match(/(\d{1,2}):(\d{2})(?:\.(\d{1,2}))?/);
    if (match) {
        const [, mins, secs, ms = '0'] = match;
        return parseInt(mins) * 60 + parseInt(secs) + parseInt(ms.padEnd(2, '0')) / 100;
    }

    return 0;
};

const LrcEditorPage = () => {
    const [lyrics, setLyrics] = useState<LyricLine[]>([]);
    const [metadata, setMetadata] = useState<LrcMetadata>({});
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [audioUrl, setAudioUrl] = useState<string>('');
    const [currentLineIndex, setCurrentLineIndex] = useState(-1);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editText, setEditText] = useState('');
    const [batchAddMode, setBatchAddMode] = useState(false);
    const [batchLyrics, setBatchLyrics] = useState('');

    const audioRef = useRef<HTMLAudioElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {toast} = useToast();

    // 更新当前播放时间和歌词同步
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => {
            setCurrentTime(audio.currentTime);

            // 找到当前应该高亮的歌词行
            const index = lyrics.findIndex((line, i) => {
                const nextLine = lyrics[i + 1];
                return audio.currentTime >= line.time && (!nextLine || audio.currentTime < nextLine.time);
            });
            setCurrentLineIndex(index);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
            setCurrentLineIndex(-1);
        };

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
        };
    }, [lyrics, audioUrl]); // 添加 audioUrl 依赖

    // 全局快捷键
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // 如果正在编辑文本，不触发快捷键
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
                return;
            }

            switch (event.code) {
                case 'Space':
                    event.preventDefault();
                    const audio = audioRef.current;
                    if (audio && audioUrl) {
                        if (isPlaying) {
                            audio.pause();
                        } else {
                            audio.play();
                        }
                        setIsPlaying(!isPlaying);
                    }
                    break;
                case 'KeyN':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault();
                        // 添加新歌词行
                        const newLine: LyricLine = {
                            id: Date.now().toString(),
                            time: currentTime,
                            text: ''
                        };
                        setLyrics(prev => [...prev, newLine].sort((a, b) => a.time - b.time));
                    }
                    break;
                case 'KeyT':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault();
                        // 为最后一行添加当前时间戳
                        if (lyrics.length > 0) {
                            const lastIndex = lyrics.length - 1;
                            setLyrics(prev => prev.map((line, i) =>
                                i === lastIndex ? {...line, time: currentTime} : line
                            ).sort((a, b) => a.time - b.time));

                            toast({
                                title: "时间戳已更新",
                                description: `已将当前时间 ${formatTime(currentTime)} 设置为最后一行`,
                            });
                        }
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, audioUrl, currentTime, lyrics, toast]);

    // 音频文件处理
    const handleAudioUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('audio/')) {
            setAudioFile(file);
            const url = URL.createObjectURL(file);
            setAudioUrl(url);
            toast({
                title: "音频文件已加载",
                description: `已加载: ${file.name}`,
            });
        } else {
            toast({
                title: "文件格式错误",
                description: "请选择有效的音频文件",
                variant: "destructive",
            });
        }
    }, [toast]);

    // 播放控制
    const togglePlay = useCallback(() => {
        const audio = audioRef.current;
        if (!audio || !audioUrl) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    }, [isPlaying, audioUrl]);

    const stopAudio = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        setCurrentTime(0);
        setCurrentLineIndex(-1);
    }, []);

    // 跳转到指定时间
    const seekTo = useCallback((time: number) => {
        const audio = audioRef.current;
        if (!audio || !audioUrl) return;

        audio.currentTime = time;
        setCurrentTime(time);
    }, [audioUrl]);

    // 添加新的歌词行
    const addLyricLine = useCallback((insertAfterIndex?: number) => {
        const newLine: LyricLine = {
            id: Date.now().toString(),
            time: currentTime,
            text: ''
        };

        setLyrics(prev => {
            const newLyrics = [...prev];
            if (typeof insertAfterIndex === 'number') {
                newLyrics.splice(insertAfterIndex + 1, 0, newLine);
            } else {
                newLyrics.push(newLine);
            }
            return newLyrics.sort((a, b) => a.time - b.time);
        });

        // 开始编辑新行
        setTimeout(() => {
            const index = lyrics.findIndex(line => line.id === newLine.id);
            setEditingIndex(index >= 0 ? index : lyrics.length);
            setEditText('');
        }, 0);
    }, [currentTime, lyrics]);

    // 删除歌词行
    const deleteLyricLine = useCallback((index: number) => {
        setLyrics(prev => prev.filter((_, i) => i !== index));
        setEditingIndex(null);
    }, []);

    // 编辑歌词
    const startEditing = useCallback((index: number) => {
        setEditingIndex(index);
        setEditText(lyrics[index]?.text || '');
    }, [lyrics]);

    const saveEdit = useCallback(() => {
        if (editingIndex === null) return;

        setLyrics(prev => prev.map((line, i) =>
            i === editingIndex ? {...line, text: editText} : line
        ));
        setEditingIndex(null);
        setEditText('');
    }, [editingIndex, editText]);

    const cancelEdit = useCallback(() => {
        setEditingIndex(null);
        setEditText('');
    }, []);

    // 更新时间戳
    const updateTimeStamp = useCallback((index: number, newTime: number) => {
        setLyrics(prev => {
            const newLyrics = prev.map((line, i) =>
                i === index ? {...line, time: newTime} : line
            );
            return newLyrics.sort((a, b) => a.time - b.time);
        });
    }, []);

    // 生成LRC文件内容
    const generateLrcContent = useCallback(() => {
        let content = '';

        // 添加元数据
        if (metadata.title) content += `[ti:${metadata.title}]\n`;
        if (metadata.artist) content += `[ar:${metadata.artist}]\n`;
        if (metadata.album) content += `[al:${metadata.album}]\n`;
        if (metadata.by) content += `[by:${metadata.by}]\n`;
        if (metadata.offset) content += `[offset:${metadata.offset}]\n`;

        content += '\n';

        // 添加歌词
        lyrics.forEach(line => {
            content += `[${formatLrcTime(line.time)}]${line.text}\n`;
        });

        return content;
    }, [lyrics, metadata]);

    // 导出LRC文件
    const exportLrc = useCallback(() => {
        const content = generateLrcContent();
        const blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${metadata.title || 'lyrics'}.lrc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
            title: "导出成功",
            description: "LRC文件已导出",
        });
    }, [generateLrcContent, metadata.title, toast]);

    // 批量添加歌词行
    const addBatchLyrics = useCallback(() => {
        if (!batchLyrics.trim()) return;

        const lines = batchLyrics.split('\n').filter(line => line.trim());
        const newLyrics: LyricLine[] = [];

        lines.forEach((text, index) => {
            newLyrics.push({
                id: (Date.now() + index).toString(),
                time: currentTime + index * 2, // 每行间隔2秒
                text: text.trim()
            });
        });

        setLyrics(prev => [...prev, ...newLyrics].sort((a, b) => a.time - b.time));
        setBatchLyrics('');
        setBatchAddMode(false);

        toast({
            title: "批量添加成功",
            description: `已添加 ${lines.length} 行歌词`,
        });
    }, [batchLyrics, currentTime, toast]);

    return (
        <main className="min-h-screen bg-background">
            <div className="main pt-32">
                <div className="container mx-auto p-6 space-y-6">
                    {/* 标题 */}
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-bold">LRC 歌词编辑器</h1>
                        <p className="text-muted-foreground">
                            制作和编辑LRC格式的歌词文件，支持时间轴同步
                        </p>
                        <div className="text-xs text-muted-foreground mt-2">
                            💡 快捷键: <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">空格</kbd> 播放/暂停 |
                            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl+N</kbd> 添加行 |
                            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl+T</kbd> 标记时间
                        </div>
                    </div>

                    {/* 音频上传和控制 */}
                    <div className="bg-card border rounded-lg p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Music className="w-5 h-5"/>
                            <h2 className="text-xl font-semibold">音频控制</h2>
                        </div>

                        <div className="flex flex-wrap gap-4 items-center">
                            <Button
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2"
                            >
                                <Upload className="w-4 h-4"/>
                                上传音频
                            </Button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="audio/*"
                                onChange={handleAudioUpload}
                                className="hidden"
                            />

                            {audioUrl && (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={togglePlay}
                                        className="flex items-center gap-2"
                                    >
                                        {isPlaying ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
                                        {isPlaying ? '暂停' : '播放'}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={stopAudio}
                                        className="flex items-center gap-2"
                                    >
                                        <Square className="w-4 h-4"/>
                                        停止
                                    </Button>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="w-4 h-4"/>
                                        <span className="font-mono min-w-[6.5rem] text-center">
                    {formatTime(currentTime)}
                  </span>
                                        <span>/</span>
                                        <span className="font-mono min-w-[6.5rem] text-center">
                    {formatTime(duration)}
                  </span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* 音频进度条 */}
                        {audioUrl && (
                            <AudioProgressBar
                                currentTime={currentTime}
                                duration={duration}
                                onSeek={seekTo}
                                disabled={!audioUrl}
                                formatTime={formatTime}
                            />
                        )}

                        {audioFile && (
                            <div className="text-sm text-muted-foreground">
                                已加载: {audioFile.name}
                            </div>
                        )}
                    </div>

                    {/* 隐藏的音频元素 */}
                    {audioUrl && (
                        <audio
                            ref={audioRef}
                            src={audioUrl}
                            onLoadedMetadata={() => {
                                const audio = audioRef.current;
                                if (audio) {
                                    setDuration(audio.duration);
                                }
                            }}
                        />
                    )}

                    {/* 元数据编辑 */}
                    <div className="bg-card border rounded-lg p-6 space-y-4">
                        <h2 className="text-xl font-semibold">歌曲信息</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">歌曲标题</label>
                                <input
                                    type="text"
                                    value={metadata.title || ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMetadata(prev => ({
                                        ...prev,
                                        title: e.target.value
                                    }))}
                                    placeholder="输入歌曲标题"
                                    className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">艺术家</label>
                                <input
                                    type="text"
                                    value={metadata.artist || ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMetadata(prev => ({
                                        ...prev,
                                        artist: e.target.value
                                    }))}
                                    placeholder="输入艺术家名称"
                                    className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">专辑</label>
                                <input
                                    type="text"
                                    value={metadata.album || ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMetadata(prev => ({
                                        ...prev,
                                        album: e.target.value
                                    }))}
                                    placeholder="输入专辑名称"
                                    className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">制作者</label>
                                <input
                                    type="text"
                                    value={metadata.by || ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMetadata(prev => ({
                                        ...prev,
                                        by: e.target.value
                                    }))}
                                    placeholder="输入制作者"
                                    className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* 歌词编辑区域 */}
                        <div className="bg-card border rounded-lg p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">歌词编辑</h2>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => setBatchAddMode(!batchAddMode)}
                                        size="sm"
                                        variant={batchAddMode ? "default" : "outline"}
                                        className="flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4"/>
                                        批量添加
                                    </Button>
                                    <Button
                                        onClick={() => addLyricLine()}
                                        size="sm"
                                        className="flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4"/>
                                        添加行
                                    </Button>
                                </div>
                            </div>

                            {/* 批量添加歌词界面 */}
                            {batchAddMode && (
                                <div className="bg-muted/10 border rounded-lg p-4 space-y-3">
                                    <h3 className="text-sm font-medium">批量添加歌词</h3>
                                    <textarea
                                        value={batchLyrics}
                                        onChange={(e) => setBatchLyrics(e.target.value)}
                                        placeholder="每行输入一句歌词，会自动按时间间隔添加..."
                                        className="w-full h-32 p-2 border border-input rounded-md bg-background font-mono text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                                    />
                                    <div className="flex gap-2">
                                        <Button onClick={addBatchLyrics} size="sm">
                                            确认添加
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setBatchAddMode(false);
                                                setBatchLyrics('');
                                            }}
                                            size="sm"
                                            variant="outline"
                                        >
                                            取消
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {lyrics.map((line, index) => (
                                    <div
                                        key={line.id}
                                        className={`flex items-center gap-2 p-2 rounded border ${
                                            index === currentLineIndex ? 'bg-primary/10 border-primary' : 'bg-muted/5'
                                        }`}
                                    >
                                        <input
                                            type="text"
                                            value={formatLrcTime(line.time)}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const newTime = parseTime(e.target.value);
                                                if (!isNaN(newTime)) {
                                                    updateTimeStamp(index, newTime);
                                                }
                                            }}
                                            className="w-20 text-sm p-1 border border-input rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                            placeholder="00:00:00"
                                        />

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => updateTimeStamp(index, currentTime)}
                                            title="使用当前播放时间"
                                        >
                                            <Clock className="w-3 h-3"/>
                                        </Button>

                                        {editingIndex === index ? (
                                            <div className="flex-1 flex gap-2">
                                                <input
                                                    type="text"
                                                    value={editText}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditText(e.target.value)}
                                                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                                        if (e.key === 'Enter') saveEdit();
                                                        if (e.key === 'Escape') cancelEdit();
                                                    }}
                                                    placeholder="输入歌词"
                                                    autoFocus
                                                    className="flex-1 p-2 border border-input rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                                />
                                                <Button size="sm" onClick={saveEdit}>保存</Button>
                                                <Button size="sm" variant="outline" onClick={cancelEdit}>取消</Button>
                                            </div>
                                        ) : (
                                            <div
                                                className="flex-1 cursor-pointer p-2 rounded hover:bg-muted/10"
                                                onClick={() => startEditing(index)}
                                            >
                                                {line.text || '(空白行)'}
                                            </div>
                                        )}

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => seekTo(line.time)}
                                            title="跳转到此时间"
                                        >
                                            <Play className="w-3 h-3"/>
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => deleteLyricLine(index)}
                                            title="删除此行"
                                        >
                                            <Trash2 className="w-3 h-3"/>
                                        </Button>
                                    </div>
                                ))}

                                {lyrics.length === 0 && (
                                    <div className="text-center text-muted-foreground py-8">
                                        暂无歌词，点击"添加行"开始编辑
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 预览区域 */}
                        <div className="bg-card border rounded-lg p-6 space-y-4">
                            <h2 className="text-xl font-semibold">实时预览</h2>

                            <div className="max-h-96 overflow-y-auto space-y-1">
                                {lyrics.map((line, index) => (
                                    <div
                                        key={line.id}
                                        className={`p-2 rounded transition-colors ${
                                            index === currentLineIndex
                                                ? 'bg-primary text-primary-foreground font-medium'
                                                : 'text-muted-foreground'
                                        }`}
                                    >
                  <span className="text-xs opacity-60 mr-2 font-mono min-w-[5rem] inline-block">
                    {formatTime(line.time)}
                  </span>
                                        {line.text || '(空白行)'}
                                    </div>
                                ))}

                                {lyrics.length === 0 && (
                                    <div className="text-center text-muted-foreground py-8">
                                        歌词预览将在这里显示
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 导出 */}
                    <div className="bg-card border rounded-lg p-6 space-y-4">
                        <h2 className="text-xl font-semibold">文件操作</h2>

                        <div className="flex flex-wrap gap-4">
                            <Button
                                onClick={exportLrc}
                                disabled={lyrics.length === 0}
                                className="flex items-center gap-2"
                            >
                                <Download className="w-4 h-4"/>
                                导出LRC文件
                            </Button>
                        </div>

                        {lyrics.length > 0 && (
                            <div className="mt-4">
                                <label className="text-sm font-medium">LRC预览:</label>
                                <textarea
                                    value={generateLrcContent()}
                                    readOnly
                                    className="w-full h-32 p-2 border border-input rounded-md bg-background font-mono text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                                    rows={8}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default LrcEditorPage;

