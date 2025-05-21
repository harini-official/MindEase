import { 
  users, type User, type InsertUser, 
  motivationQuotes, type MotivationQuote, type InsertMotivationQuote,
  blogPosts, type BlogPost, type InsertBlogPost,
  plannerTemplates, type PlannerTemplate, type InsertPlannerTemplate,
  audioResources, type AudioResource, type InsertAudioResource,
  testimonials, type Testimonial, type InsertTestimonial,
  contactMessages, type ContactMessage, type InsertContactMessage
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Motivation methods
  getMotivationQuotes(): Promise<MotivationQuote[]>;
  getMotivationQuote(id: number): Promise<MotivationQuote | undefined>;
  createMotivationQuote(quote: InsertMotivationQuote): Promise<MotivationQuote>;
  
  // Blog methods
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPostsByCategory(category: string): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  
  // Planner methods
  getPlannerTemplates(): Promise<PlannerTemplate[]>;
  getPlannerTemplate(id: number): Promise<PlannerTemplate | undefined>;
  createPlannerTemplate(template: InsertPlannerTemplate): Promise<PlannerTemplate>;
  incrementDownloadCount(id: number): Promise<PlannerTemplate | undefined>;
  
  // Audio methods
  getAudioResources(): Promise<AudioResource[]>;
  getAudioResourcesByCategory(category: string): Promise<AudioResource[]>;
  getAudioResource(id: number): Promise<AudioResource | undefined>;
  createAudioResource(resource: InsertAudioResource): Promise<AudioResource>;
  
  // Testimonial methods
  getTestimonials(): Promise<Testimonial[]>;
  getTestimonial(id: number): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Contact methods
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private motivationQuotes: Map<number, MotivationQuote>;
  private blogPosts: Map<number, BlogPost>;
  private plannerTemplates: Map<number, PlannerTemplate>;
  private audioResources: Map<number, AudioResource>;
  private testimonials: Map<number, Testimonial>;
  private contactMessages: Map<number, ContactMessage>;
  
  private currentUserId: number;
  private currentMotivationQuoteId: number;
  private currentBlogPostId: number;
  private currentPlannerTemplateId: number;
  private currentAudioResourceId: number;
  private currentTestimonialId: number;
  private currentContactMessageId: number;

  constructor() {
    this.users = new Map();
    this.motivationQuotes = new Map();
    this.blogPosts = new Map();
    this.plannerTemplates = new Map();
    this.audioResources = new Map();
    this.testimonials = new Map();
    this.contactMessages = new Map();
    
    this.currentUserId = 1;
    this.currentMotivationQuoteId = 1;
    this.currentBlogPostId = 1;
    this.currentPlannerTemplateId = 1;
    this.currentAudioResourceId = 1;
    this.currentTestimonialId = 1;
    this.currentContactMessageId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Motivation methods
  async getMotivationQuotes(): Promise<MotivationQuote[]> {
    return Array.from(this.motivationQuotes.values());
  }
  
  async getMotivationQuote(id: number): Promise<MotivationQuote | undefined> {
    return this.motivationQuotes.get(id);
  }
  
  async createMotivationQuote(insertQuote: InsertMotivationQuote): Promise<MotivationQuote> {
    const id = this.currentMotivationQuoteId++;
    const quote: MotivationQuote = { ...insertQuote, id };
    this.motivationQuotes.set(id, quote);
    return quote;
  }
  
  // Blog methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }
  
  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).filter(
      post => post.category === category
    );
  }
  
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }
  
  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogPostId++;
    const post: BlogPost = { ...insertPost, id };
    this.blogPosts.set(id, post);
    return post;
  }
  
  // Planner methods
  async getPlannerTemplates(): Promise<PlannerTemplate[]> {
    return Array.from(this.plannerTemplates.values());
  }
  
  async getPlannerTemplate(id: number): Promise<PlannerTemplate | undefined> {
    return this.plannerTemplates.get(id);
  }
  
  async createPlannerTemplate(insertTemplate: InsertPlannerTemplate): Promise<PlannerTemplate> {
    const id = this.currentPlannerTemplateId++;
    const template: PlannerTemplate = { ...insertTemplate, id, downloadCount: 0 };
    this.plannerTemplates.set(id, template);
    return template;
  }
  
  async incrementDownloadCount(id: number): Promise<PlannerTemplate | undefined> {
    const template = this.plannerTemplates.get(id);
    if (template) {
      const updatedTemplate = { ...template, downloadCount: template.downloadCount + 1 };
      this.plannerTemplates.set(id, updatedTemplate);
      return updatedTemplate;
    }
    return undefined;
  }
  
  // Audio methods
  async getAudioResources(): Promise<AudioResource[]> {
    return Array.from(this.audioResources.values());
  }
  
  async getAudioResourcesByCategory(category: string): Promise<AudioResource[]> {
    return Array.from(this.audioResources.values()).filter(
      resource => resource.category === category
    );
  }
  
  async getAudioResource(id: number): Promise<AudioResource | undefined> {
    return this.audioResources.get(id);
  }
  
  async createAudioResource(insertResource: InsertAudioResource): Promise<AudioResource> {
    const id = this.currentAudioResourceId++;
    const resource: AudioResource = { ...insertResource, id };
    this.audioResources.set(id, resource);
    return resource;
  }
  
  // Testimonial methods
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }
  
  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }
  
  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentTestimonialId++;
    const testimonial: Testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
  
  // Contact methods
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentContactMessageId++;
    const message: ContactMessage = { 
      ...insertMessage, 
      id, 
      createdAt: new Date() 
    };
    this.contactMessages.set(id, message);
    return message;
  }
  
  private initializeSampleData() {
    // Add motivation quotes
    const quotes = [
      {
        quote: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500"
      },
      {
        quote: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt",
        imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500"
      },
      {
        quote: "Your education is a dress rehearsal for a life that is yours to lead.",
        author: "Nora Ephron",
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500"
      },
      {
        quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill",
        imageUrl: "https://images.unsplash.com/photo-1536782376847-5c9d14d97cc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500"
      },
      {
        quote: "Education is the most powerful weapon which you can use to change the world.",
        author: "Nelson Mandela",
        imageUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500"
      },
      {
        quote: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt",
        imageUrl: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500"
      }
    ];
    
    quotes.forEach(q => {
      this.createMotivationQuote(q);
    });
    
    // Add blog posts
    const blogPosts = [
      {
        title: "5 Ways to Beat Exam Anxiety",
        content: "Long content here about managing exam anxiety...",
        excerpt: "Learn effective techniques to manage stress and perform better during exams.",
        imageUrl: "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        publishDate: new Date("2023-04-15"),
        category: "Exam Stress"
      },
      {
        title: "Creating Your Ideal Study Environment",
        content: "Long content here about creating a productive study environment...",
        excerpt: "Design a space that boosts focus and minimizes distractions for better learning.",
        imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        publishDate: new Date("2023-04-08"),
        category: "Study Tips"
      },
      {
        title: "Balancing Academics and Social Life",
        content: "Long content here about maintaining balance in college life...",
        excerpt: "Strategies for maintaining good grades while nurturing important relationships.",
        imageUrl: "https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        publishDate: new Date("2023-03-30"),
        category: "Balance"
      },
      {
        title: "Mindfulness Practices for Students",
        content: "Long content here about mindfulness techniques for students...",
        excerpt: "Simple mindfulness practices to reduce stress and improve focus in your studies.",
        imageUrl: "https://images.unsplash.com/photo-1535649168324-6ba77fff6a25?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        publishDate: new Date("2023-03-22"),
        category: "Mental Health"
      },
      {
        title: "How to Build a Sustainable Study Routine",
        content: "Long content here about creating study routines that last...",
        excerpt: "Create a study schedule that you can maintain throughout the semester.",
        imageUrl: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        publishDate: new Date("2023-03-15"),
        category: "Time Management"
      }
    ];
    
    blogPosts.forEach(post => {
      this.createBlogPost(post);
    });
    
    // Add planner templates
    const plannerTemplates = [
      {
        title: "Weekly Study Planner",
        description: "Organize your study sessions with this effective weekly template.",
        fileUrl: "/templates/weekly-study-planner.pdf",
        iconName: "calendar-alt"
      },
      {
        title: "Morning Routine Checklist",
        description: "Start your day with intention using this mindful morning routine.",
        fileUrl: "/templates/morning-routine-checklist.pdf",
        iconName: "mug-hot"
      },
      {
        title: "Self-Care Checklist",
        description: "Prioritize your wellbeing with this comprehensive self-care guide.",
        fileUrl: "/templates/self-care-checklist.pdf",
        iconName: "heart"
      },
      {
        title: "Exam Preparation Timeline",
        description: "Plan your exam prep with this structured timeline template.",
        fileUrl: "/templates/exam-prep-timeline.pdf",
        iconName: "book"
      }
    ];
    
    plannerTemplates.forEach(template => {
      this.createPlannerTemplate(template);
    });
    
    // Add audio resources
    const audioResources = [
      {
        title: "Forest Meditation Journey",
        description: "A guided meditation through a peaceful forest to clear your mind.",
        audioUrl: "/audio/forest-meditation.mp3",
        imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        duration: "10 min",
        category: "Meditation"
      },
      {
        title: "Ocean Waves for Sleep",
        description: "Drift off to sleep with the gentle rhythm of ocean waves.",
        audioUrl: "/audio/ocean-waves.mp3",
        imageUrl: "https://pixabay.com/get/gfa8de86f8bf1751b864dcc0ea3cba16cb0254e7ea7de60867d3e1906de518f830a5602ab4a22d165ffd610d93c29e3f3134cdeb2149109586a6bfc32736750df_1280.jpg",
        duration: "30 min",
        category: "Sleep"
      },
      {
        title: "Deep Focus Music",
        description: "Background music designed to enhance concentration and focus.",
        audioUrl: "/audio/deep-focus.mp3",
        imageUrl: "https://images.unsplash.com/photo-1483546363825-7ebf25fb7513?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        duration: "45 min",
        category: "Focus"
      },
      {
        title: "Relaxing Piano for Studying",
        description: "Gentle piano melodies to create a peaceful studying atmosphere.",
        audioUrl: "/audio/study-piano.mp3",
        imageUrl: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        duration: "60 min",
        category: "Focus"
      },
      {
        title: "Rainfall Ambience",
        description: "The soothing sound of gentle rainfall to help you relax or focus.",
        audioUrl: "/audio/rainfall.mp3",
        imageUrl: "https://images.unsplash.com/photo-1515694346937-94d85e41e695?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        duration: "20 min",
        category: "Nature Sounds"
      }
    ];
    
    audioResources.forEach(resource => {
      this.createAudioResource(resource);
    });
    
    // Add testimonials
    const testimonials = [
      {
        content: "MindEase has completely transformed how I handle exam stress. The breathing exercises and study planners have made a huge difference in my academic performance.",
        studentName: "Jamie S.",
        studentTitle: "College Sophomore",
        rating: 5
      },
      {
        content: "The guided meditations have been a lifesaver during finals week. I listen to them every night to wind down and get better sleep. Highly recommend!",
        studentName: "Alex K.",
        studentTitle: "High School Senior",
        rating: 5
      },
      {
        content: "As a student with anxiety, finding MindEase was a game-changer. The daily motivation quotes and self-care checklists help me stay grounded when things get overwhelming.",
        studentName: "Morgan T.",
        studentTitle: "Graduate Student",
        rating: 5
      }
    ];
    
    testimonials.forEach(testimonial => {
      this.createTestimonial(testimonial);
    });
  }
}

export const storage = new MemStorage();
