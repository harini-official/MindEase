export interface MotivationQuote {
  id: number;
  quote: string;
  author: string;
  imageUrl: string;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  publishDate: string | Date;
  category: string;
}

export interface PlannerTemplate {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  iconName: string;
  downloadCount: number;
}

export interface AudioResource {
  id: number;
  title: string;
  description: string;
  audioUrl: string;
  imageUrl: string;
  duration: string;
  category: string;
}

export interface Testimonial {
  id: number;
  content: string;
  studentName: string;
  studentTitle: string;
  rating: number;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string | Date;
}
