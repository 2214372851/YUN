// src/data/media.ts
import { MediaItem } from '@/types/media';

export const mediaItems: MediaItem[] = [
  {
    id: 'jjy-tyx',
    title: '叹云兮',
    imageUrl: 'https://minio-endpoint.bybxbwg.fun/docs/jjy-tyx.jpg',
    author: '鞠婧祎',
    lyricsUrl: 'https://minio-endpoint.bybxbwg.fun/docs/jjy-tyx.lrc',
    musicUrl: 'https://minio-endpoint.bybxbwg.fun/docs/jjy-tyx.mp3',
  },
  {
    id: 'jjy-lhcn',
    title: '落花成泥',
    imageUrl: 'https://minio-endpoint.bybxbwg.fun/docs/jjy-lhcn.jpg',
    author: '鞠婧祎',
    lyricsUrl: 'https://minio-endpoint.bybxbwg.fun/docs/jjy-lhcn.lrc',
    musicUrl: 'https://minio-endpoint.bybxbwg.fun/docs/jjy-lhcn.mp3',
  },
  {
    id: 'yl-qsx',
    title: '牵丝戏',
    imageUrl: 'https://minio-endpoint.bybxbwg.fun/docs/yl-qsx.jpg',
    author: '银临',
    lyricsUrl: 'https://minio-endpoint.bybxbwg.fun/docs/yl-qsx.lrc',
    musicUrl: 'https://minio-endpoint.bybxbwg.fun/docs/yl-qsx.mp3',
  },
  {
    id: 'yl-jlc',
    title: '锦鲤抄',
    imageUrl: 'https://minio-endpoint.bybxbwg.fun/docs/yl-jlc.jpg',
    author: '银临',
    lyricsUrl: 'https://minio-endpoint.bybxbwg.fun/docs/yl-jlc.lrc',
    musicUrl: 'https://minio-endpoint.bybxbwg.fun/docs/yl-jlc.mp3',
  },
  {
    id: 'yl-tljx',
    title: '棠梨煎雪',
    imageUrl: 'https://minio-endpoint.bybxbwg.fun/docs/yl-tljx.jpg',
    author: '银临',
    lyricsUrl: 'https://minio-endpoint.bybxbwg.fun/docs/yl-tljx.lrc',
    musicUrl: 'https://minio-endpoint.bybxbwg.fun/docs/yl-tljx.mp3',
  },
  {
    id: 'yl-lgxm',
    title: '泸沽寻梦',
    imageUrl: 'https://minio-endpoint.bybxbwg.fun/docs/yl-lgxm.jpg',
    author: '银临',
    lyricsUrl: 'https://minio-endpoint.bybxbwg.fun/docs/yl-lgxm.lrc',
    musicUrl: 'https://minio-endpoint.bybxbwg.fun/docs/yl-lgxm.mp3',
  },
  {
    id: 'yl-chfc',
    title: '沧海飞尘',
    imageUrl: 'https://minio-endpoint.bybxbwg.fun/docs/yl-chfc.jpg',
    author: '银临',
    lyricsUrl: 'https://minio-endpoint.bybxbwg.fun/docs/yl-chfc.lrc',
    musicUrl: 'https://minio-endpoint.bybxbwg.fun/docs/yl-chfc.mp3'
  },
  {
    id: 'yl-blm',
    title: '不老梦',
    imageUrl: 'https://minio-endpoint.bybxbwg.fun/docs/yl-blm.jpg',
    author: '银临',
    lyricsUrl: 'https://minio-endpoint.bybxbwg.fun/docs/yl-blm.lrc',
    musicUrl: 'https://minio-endpoint.bybxbwg.fun/docs/yl-blm.mp3',
  }
];

export function getAllMediaItems(): MediaItem[] {
  return mediaItems;
}

export function getMediaItemById(id: string): MediaItem | undefined {
  return mediaItems.find(item => item.id === id);
}
