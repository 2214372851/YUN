import { getMediaItemById, getAllMediaItems } from '@/data/media';
import { MediaItem } from '@/types/media';
import { default as MusicDetail } from './MusicDetail';
import Script from "next/script";
import { Metadata } from "next";

export async function generateStaticParams() {
  const mediaItems = getAllMediaItems();
  return mediaItems.map((item: MediaItem) => ({
    id: item.id,
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const musicItem = getMediaItemById(params.id);
  
  return {
    title: `${musicItem.title} - YunHai的音乐`,
    description: musicItem.description || `欣赏${musicItem.title}的音乐作品`,
    openGraph: {
      title: musicItem.title,
      description: musicItem.description || `欣赏${musicItem.title}的音乐作品`,
      type: 'music.song',
      images: musicItem.cover ? [{
        url: musicItem.cover,
        width: 1200,
        height: 630,
        alt: musicItem.title,
      }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: musicItem.title,
      description: musicItem.description || `欣赏${musicItem.title}的音乐作品`,
      images: musicItem.cover ? [musicItem.cover] : undefined,
    },
  };
}

export default function Page({ params }: { params: { id: string } }) {
  const musicItem = getMediaItemById(params.id);
  
  // 生成结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    "name": musicItem.title,
    "description": musicItem.description,
    "image": musicItem.cover ? [musicItem.cover] : undefined,
    "url": `https://bybxbwg.fun/media/${params.id}`,
    "duration": musicItem.duration,
    "byArtist": {
      "@type": "MusicGroup",
      "name": musicItem.artist || "YunHai"
    }
  };

  return (
    <>
      <Script
        id="music-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <MusicDetail musicItem={musicItem} />
    </>
  );
}
