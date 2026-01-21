
export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

export interface GalleryItem {
  id: string;
  author: string;
  download_url: string;
  width: number;
  height: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
