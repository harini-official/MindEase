import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertMotivationQuoteSchema,
  insertBlogPostSchema,
  insertPlannerTemplateSchema,
  insertCustomPlannerSchema,
  insertAudioResourceSchema,
  insertTestimonialSchema,
  insertContactMessageSchema,
  customPlanners
} from "@shared/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "./db";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for motivation quotes
  app.get("/api/motivation-quotes", async (req: Request, res: Response) => {
    try {
      const quotes = await storage.getMotivationQuotes();
      res.json(quotes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch motivation quotes" });
    }
  });

  app.get("/api/motivation-quotes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const quote = await storage.getMotivationQuote(id);
      if (!quote) {
        return res.status(404).json({ message: "Motivation quote not found" });
      }
      
      res.json(quote);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch motivation quote" });
    }
  });

  app.post("/api/motivation-quotes", async (req: Request, res: Response) => {
    try {
      const quoteData = insertMotivationQuoteSchema.parse(req.body);
      const newQuote = await storage.createMotivationQuote(quoteData);
      res.status(201).json(newQuote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid quote data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create motivation quote" });
    }
  });

  // API routes for blog posts
  app.get("/api/blog-posts", async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      
      if (category) {
        const posts = await storage.getBlogPostsByCategory(category);
        return res.json(posts);
      }
      
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog-posts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const post = await storage.getBlogPost(id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog-posts", async (req: Request, res: Response) => {
    try {
      const postData = insertBlogPostSchema.parse(req.body);
      const newPost = await storage.createBlogPost(postData);
      res.status(201).json(newPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  // API routes for planner templates
  app.get("/api/planner-templates", async (req: Request, res: Response) => {
    try {
      const templates = await storage.getPlannerTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch planner templates" });
    }
  });

  app.get("/api/planner-templates/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const template = await storage.getPlannerTemplate(id);
      if (!template) {
        return res.status(404).json({ message: "Planner template not found" });
      }
      
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch planner template" });
    }
  });

  app.post("/api/planner-templates", async (req: Request, res: Response) => {
    try {
      const templateData = insertPlannerTemplateSchema.parse(req.body);
      const newTemplate = await storage.createPlannerTemplate(templateData);
      res.status(201).json(newTemplate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid template data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create planner template" });
    }
  });

  app.post("/api/planner-templates/:id/download", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const template = await storage.incrementDownloadCount(id);
      if (!template) {
        return res.status(404).json({ message: "Planner template not found" });
      }
      
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Failed to update download count" });
    }
  });

  // API routes for custom planners
  app.get("/api/custom-planners", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const planners = await storage.getCustomPlanners(userId);
      res.json(planners);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch custom planners" });
    }
  });

  app.get("/api/custom-planners/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const planner = await storage.getCustomPlanner(id);
      if (!planner) {
        return res.status(404).json({ message: "Custom planner not found" });
      }
      
      res.json(planner);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch custom planner" });
    }
  });

  app.post("/api/custom-planners", async (req: Request, res: Response) => {
    try {
      const plannerData = insertCustomPlannerSchema.parse(req.body);
      const newPlanner = await storage.createCustomPlanner(plannerData);
      
      // Generate a simulated file URL for the downloadable planner
      const fileUrl = `/planners/custom-${newPlanner.id}-${Date.now()}.pdf`;
      
      // Update the planner with the file URL
      const [updatedPlanner] = await db
        .update(customPlanners)
        .set({ fileUrl })
        .where(eq(customPlanners.id, newPlanner.id))
        .returning();
      
      res.status(201).json(updatedPlanner);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid planner data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create custom planner" });
    }
  });

  // API routes for audio resources
  app.get("/api/audio-resources", async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      
      if (category) {
        const resources = await storage.getAudioResourcesByCategory(category);
        return res.json(resources);
      }
      
      const resources = await storage.getAudioResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch audio resources" });
    }
  });

  app.get("/api/audio-resources/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const resource = await storage.getAudioResource(id);
      if (!resource) {
        return res.status(404).json({ message: "Audio resource not found" });
      }
      
      res.json(resource);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch audio resource" });
    }
  });

  app.post("/api/audio-resources", async (req: Request, res: Response) => {
    try {
      const resourceData = insertAudioResourceSchema.parse(req.body);
      const newResource = await storage.createAudioResource(resourceData);
      res.status(201).json(newResource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid resource data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create audio resource" });
    }
  });

  // API routes for testimonials
  app.get("/api/testimonials", async (req: Request, res: Response) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.get("/api/testimonials/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const testimonial = await storage.getTestimonial(id);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      res.json(testimonial);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonial" });
    }
  });

  app.post("/api/testimonials", async (req: Request, res: Response) => {
    try {
      const testimonialData = insertTestimonialSchema.parse(req.body);
      const newTestimonial = await storage.createTestimonial(testimonialData);
      res.status(201).json(newTestimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid testimonial data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create testimonial" });
    }
  });

  // API route for contact messages
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const messageData = insertContactMessageSchema.parse(req.body);
      const newMessage = await storage.createContactMessage(messageData);
      res.status(201).json({ message: "Message sent successfully", id: newMessage.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
