export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  lastEdited: string;
  author: string;
  authorRole?: string;
  tags: string[];
  content: string;
  excerpt?: string;
  imageUrl?: string;
  readingTime: string;
  mtimeMs: number; // Add modification time
}
