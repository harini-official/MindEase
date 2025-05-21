// This file contains helper functions for accessing API data
// It doesn't include any mock data, as all data comes from the API

import { AudioResource, BlogPost, MotivationQuote, PlannerTemplate, Testimonial } from "./types";

// Category options for filtering
export const BLOG_CATEGORIES = [
  "All Topics",
  "Mental Health",
  "Exam Stress",
  "Time Management",
  "Study Strategies",
  "Balance"
];

export const AUDIO_CATEGORIES = [
  "All",
  "Focus",
  "Meditation",
  "Sleep",
  "Nature Sounds"
];

// Type-safe filter functions
export const filterBlogPostsByCategory = (
  posts: BlogPost[],
  category: string
): BlogPost[] => {
  if (category === "All Topics") return posts;
  return posts.filter(post => post.category === category);
};

export const filterAudioResourcesByCategory = (
  resources: AudioResource[],
  category: string
): AudioResource[] => {
  if (category === "All") return resources;
  return resources.filter(resource => resource.category === category);
};

// Helper to format dates consistently
export const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Helper to format time for breathing exercises
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Helper to get initial letters for user avatar
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('');
};

// Get appropriate CSS classes based on category
export const getCategoryClasses = (category: string): string => {
  switch (category) {
    case "Exam Stress":
      return "bg-primary-light text-primary-dark";
    case "Mental Health":
      return "bg-neutral-200 text-neutral-700";
    case "Time Management":
      return "bg-accent-light text-accent-dark";
    case "Study Strategies":
      return "bg-secondary-light text-secondary-dark";
    case "Balance":
      return "bg-neutral-200 text-neutral-700";
    default:
      return "bg-neutral-200 text-neutral-700";
  }
};

export const getAudioCategoryClasses = (category: string): string => {
  switch (category) {
    case "Meditation":
      return "bg-primary-light text-primary-dark";
    case "Sleep":
      return "bg-secondary-light text-secondary-dark";
    case "Focus":
      return "bg-accent-light text-accent-dark";
    case "Nature Sounds":
      return "bg-neutral-200 text-neutral-700";
    default:
      return "bg-neutral-200 text-neutral-700";
  }
};

export const getTemplateIconClasses = (iconName: string): string => {
  switch (iconName) {
    case "calendar-alt":
      return "bg-primary-light text-primary-dark";
    case "mug-hot":
      return "bg-secondary-light text-secondary-dark";
    case "heart":
      return "bg-accent-light text-accent-dark";
    case "book":
      return "bg-primary-light text-primary-dark";
    default:
      return "bg-primary-light text-primary-dark";
  }
};
