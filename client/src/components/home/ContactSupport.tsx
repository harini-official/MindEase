import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters."
  }),
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
  subject: z.string().min(1, {
    message: "Please select a subject."
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters."
  }).max(500, {
    message: "Message cannot be more than 500 characters."
  })
});

type FormValues = z.infer<typeof formSchema>;

const ContactSupport = () => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      return await apiRequest('POST', '/api/contact', values);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-poppins font-semibold text-neutral-800 mb-4">Contact & Support</h2>
            <p className="text-neutral-600 mb-6">Have questions or need additional resources? We're here to help you on your wellness journey.</p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-700 font-medium">Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary outline-none transition"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-700 font-medium">Email</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email"
                          className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary outline-none transition"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-700 font-medium">Subject</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary outline-none transition">
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="resources">Additional Resources</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-700 font-medium">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          rows={4}
                          className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary outline-none transition"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={mutation.isPending}
                  className="bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-6 rounded-lg transition duration-300"
                >
                  {mutation.isPending ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </Form>
          </div>
          
          <div className="lg:w-1/2">
            <div className="bg-neutral-100 rounded-xl shadow-soft p-8 h-full">
              <h3 className="text-xl font-poppins font-semibold text-neutral-800 mb-4">Need Immediate Support?</h3>
              <p className="text-neutral-600 mb-6">If you're experiencing a mental health emergency, please reach out to these resources:</p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary-light rounded-full p-3 mr-4">
                    <i className="fas fa-phone text-primary-dark"></i>
                  </div>
                  <div>
                    <h4 className="font-poppins font-medium text-neutral-800 mb-1">Crisis Text Line</h4>
                    <p className="text-neutral-600">Text HOME to 741741 to connect with a Crisis Counselor</p>
                    <p className="text-neutral-500 text-sm">Free 24/7 support</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-light rounded-full p-3 mr-4">
                    <i className="fas fa-comments text-primary-dark"></i>
                  </div>
                  <div>
                    <h4 className="font-poppins font-medium text-neutral-800 mb-1">National Suicide Prevention Lifeline</h4>
                    <p className="text-neutral-600">1-800-273-8255</p>
                    <p className="text-neutral-500 text-sm">Free and confidential support</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-light rounded-full p-3 mr-4">
                    <i className="fas fa-graduation-cap text-primary-dark"></i>
                  </div>
                  <div>
                    <h4 className="font-poppins font-medium text-neutral-800 mb-1">Campus Resources</h4>
                    <p className="text-neutral-600">Most colleges have counseling centers with free services for students.</p>
                    <p className="text-neutral-500 text-sm">Check your school's website for details</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-neutral-200">
                <h4 className="font-poppins font-medium text-neutral-800 mb-3">Connect With Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-primary-dark hover:text-primary text-xl">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="text-primary-dark hover:text-primary text-xl">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="text-primary-dark hover:text-primary text-xl">
                    <i className="fab fa-facebook"></i>
                  </a>
                  <a href="#" className="text-primary-dark hover:text-primary text-xl">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSupport;
