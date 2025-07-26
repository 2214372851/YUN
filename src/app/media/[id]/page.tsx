import {getAllMediaItems, getMediaItemById} from '@/data/media';
import {MediaItem} from '@/types/media';
import {default as MusicDetail} from './MusicDetail';
import Script from "next/script";
import {Metadata} from "next";
import { siteName, baseUrl } from '@/config/site';

export async function generateStaticParams() {
  const mediaItems = getAllMediaItems();
  return mediaItems.map((item: MediaItem) => ({
    id: item.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const musicItem = getMediaItemById((await params).id) as MediaItem;
  return {
    title: `${musicItem.title} | ${siteName}音乐`,
    description: `在${siteName}欣赏 ${musicItem.title} 的音乐作品与介绍`,
    openGraph: {
      title: `${musicItem.title} | ${siteName}音乐`,
      description: `在${siteName}欣赏 ${musicItem.title} 的音乐作品与介绍`,
      type: 'music.song',
      images: musicItem.imageUrl ? [{
        url: musicItem.imageUrl,
        width: 1200,
        height: 630,
        alt: musicItem.title,
      }] : undefined,
      siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${musicItem.title} | ${siteName}音乐`,
      description: `在${siteName}欣赏 ${musicItem.title} 的音乐作品与介绍`,
      images: musicItem.imageUrl ? [musicItem.imageUrl] : undefined,
    },
    alternates: {
      canonical: `/media/${musicItem.id}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const pageParams = await params;
  const musicItem = getMediaItemById(pageParams.id) as MediaItem;
  
  // 生成结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    "name": musicItem.title,
    "description": `欣赏${musicItem.title}的音乐作品`,
    "image": musicItem.imageUrl ? [musicItem.imageUrl] : undefined,
    "url": `${baseUrl}/media/${pageParams.id}`,
    "byArtist": {
      "@type": "MusicGroup",
      "name": siteName
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
