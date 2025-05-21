import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogPost } from "@/lib/types";
import { format } from "date-fns";

const CATEGORIES = ["All Topics", "Mental Health", "Exam Stress", "Time Management", "Study Strategies", "Balance"];

const MindfulBlog = () => {
  const [activeCategory, setActiveCategory] = useState("All Topics");
  
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
  });

  const filteredPosts = posts?.filter(post => 
    activeCategory === "All Topics" || post.category === activeCategory
  );

  return (
    <section id="blog" className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-poppins font-semibold text-neutral-800 mb-3">Mindful Blog Zone</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Explore articles on mental health, exam stress, burnout recovery, and more.</p>
        </div>
        
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              onClick={() => setActiveCategory(category)}
              variant={activeCategory === category ? "default" : "outline"}
              className={activeCategory === category 
                ? "bg-primary text-white" 
                : "bg-white hover:bg-primary hover:text-white text-neutral-700"}
            >
              {category}
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading skeleton
            Array(3).fill(0).map((_, index) => (
              <article key={index} className="bg-white rounded-xl shadow-soft overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-6">
                  <div className="flex gap-2 mb-3">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-7 w-4/5 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/6" />
                  </div>
                </div>
              </article>
            ))
          ) : !filteredPosts || filteredPosts.length === 0 ? (
            <div className="col-span-3 text-center py-10">
              <p className="text-neutral-600">
                {posts && posts.length > 0 
                  ? `No posts found in the "${activeCategory}" category.` 
                  : "No blog posts available. Check back soon!"}
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-medium transition-shadow duration-300">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex gap-2 mb-3">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      post.category === "Exam Stress" ? "bg-primary-light text-primary-dark" :
                      post.category === "Mental Health" ? "bg-neutral-200 text-neutral-700" :
                      post.category === "Time Management" ? "bg-accent-light text-accent-dark" :
                      post.category === "Study Strategies" ? "bg-secondary-light text-secondary-dark" :
                      "bg-neutral-200 text-neutral-700"
                    }`}>
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-poppins font-semibold text-neutral-800 mb-2">{post.title}</h3>
                  <p className="text-neutral-600 mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-500">
                      {format(new Date(post.publishDate), 'MMMM d, yyyy')}
                    </span>
                    <a href="#" className="text-primary-dark hover:text-primary font-medium">Read More</a>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
        
        <div className="text-center mt-10">
          <Button className="inline-flex items-center bg-white hover:bg-neutral-200 text-primary-dark">
            View All Articles
            <i className="fas fa-arrow-right ml-2"></i>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MindfulBlog;
