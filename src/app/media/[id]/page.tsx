import { getMediaItemById, getAllMediaItems } from '@/data/media';
import { MediaItem } from '@/types/media';
import { default as MusicDetail } from './MusicDetail';

export async function generateStaticParams() {
  const mediaItems = getAllMediaItems();
  return mediaItems.map((item: MediaItem) => ({
    id: item.id,
  }));
}

export default function Page({ params }: { params: { id: string } }) {
  const musicItem = getMediaItemById(params.id);
  return <MusicDetail musicItem={musicItem} />;
}
