import { pgTable, text, serial, integer, boolean, timestamp, jsonb, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Motivation quotes
export const motivationQuotes = pgTable("motivation_quotes", {
  id: serial("id").primaryKey(),
  quote: text("quote").notNull(),
  author: text("author").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertMotivationQuoteSchema = createInsertSchema(motivationQuotes).pick({
  quote: true,
  author: true,
  imageUrl: true,
});

// Blog posts
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  imageUrl: text("image_url").notNull(),
  publishDate: timestamp("publish_date").notNull(),
  category: text("category").notNull(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  content: true,
  excerpt: true,
  imageUrl: true,
  publishDate: true,
  category: true,
});

// Planner templates
export const plannerTemplates = pgTable("planner_templates", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  fileUrl: text("file_url").notNull(),
  iconName: text("icon_name").notNull(),
  downloadCount: integer("download_count").default(0).notNull(),
});

export const insertPlannerTemplateSchema = createInsertSchema(plannerTemplates).pick({
  title: true,
  description: true,
  fileUrl: true,
  iconName: true,
});

// Audio resources
export const audioResources = pgTable("audio_resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  audioUrl: text("audio_url").notNull(),
  imageUrl: text("image_url").notNull(),
  duration: text("duration").notNull(),
  category: text("category").notNull(),
});

export const insertAudioResourceSchema = createInsertSchema(audioResources).pick({
  title: true,
  description: true,
  audioUrl: true,
  imageUrl: true,
  duration: true,
  category: true,
});

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  studentName: text("student_name").notNull(),
  studentTitle: text("student_title").notNull(),
  rating: integer("rating").notNull(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  content: true,
  studentName: true,
  studentTitle: true,
  rating: true,
});

// Contact messages
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

// Custom Planners
export const customPlanners = pgTable("custom_planners", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  color: text("color").notNull(),
  includeWeekends: boolean("include_weekends").default(true).notNull(),
  scheduledHours: jsonb("scheduled_hours").notNull(),
  categories: text("categories").array().notNull(),
  tasks: jsonb("tasks"),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  fileUrl: text("file_url"),
});

export const insertCustomPlannerSchema = createInsertSchema(customPlanners).pick({
  title: true,
  description: true,
  startDate: true,
  endDate: true,
  color: true,
  includeWeekends: true,
  scheduledHours: true,
  categories: true,
  tasks: true,
  userId: true,
  fileUrl: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMotivationQuote = z.infer<typeof insertMotivationQuoteSchema>;
export type MotivationQuote = typeof motivationQuotes.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertPlannerTemplate = z.infer<typeof insertPlannerTemplateSchema>;
export type PlannerTemplate = typeof plannerTemplates.$inferSelect;

export type InsertAudioResource = z.infer<typeof insertAudioResourceSchema>;
export type AudioResource = typeof audioResources.$inferSelect;

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

export type InsertCustomPlanner = z.infer<typeof insertCustomPlannerSchema>;
export type CustomPlanner = typeof customPlanners.$inferSelect;
