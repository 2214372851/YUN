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
  const musicItem = getMediaItemById(params.id) as MediaItem;
  
  return {
    title: `${musicItem.title} - YunHai的音乐`,
    description: `欣赏${musicItem.title}的音乐作品`,
    openGraph: {
      title: musicItem.title,
      description: `欣赏${musicItem.title}的音乐作品`,
      type: 'music.song',
      images: musicItem.imageUrl ? [{
        url: musicItem.imageUrl,
        width: 1200,
        height: 630,
        alt: musicItem.title,
      }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: musicItem.title,
      description: `欣赏${musicItem.title}的音乐作品`,
      images: musicItem.imageUrl ? [musicItem.imageUrl] : undefined,
    },
  };
}

export default function Page({ params }: { params: { id: string } }) {
  const musicItem = getMediaItemById(params.id) as MediaItem;
  
  // 生成结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    "name": musicItem.title,
    "description": `欣赏${musicItem.title}的音乐作品`,
    "image": musicItem.imageUrl ? [musicItem.imageUrl] : undefined,
    "url": `https://bybxbwg.fun/media/${params.id}`,
    "byArtist": {
      "@type": "MusicGroup",
      "name": "YunHai"
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
