import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlannerTemplate } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const Planner = () => {
  const { toast } = useToast();
  
  const { data: templates, isLoading } = useQuery<PlannerTemplate[]>({
    queryKey: ['/api/planner-templates'],
  });

  const downloadMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('POST', `/api/planner-templates/${id}/download`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/planner-templates'] });
    },
    onError: () => {
      toast({
        title: "Download Failed",
        description: "Could not register your download. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleDownload = (template: PlannerTemplate) => {
    // Import dynamically to reduce initial load time
    import('./PlannerGenerator').then(({ generateTemplatePDF }) => {
      try {
        // Generate the PDF with real content
        const pdfDataUri = generateTemplatePDF(template.id);
        
        // Create a temporary link to download the PDF
        const link = document.createElement('a');
        link.href = pdfDataUri;
        link.download = `${template.title.replace(/\s+/g, '-')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Record the download in the database
        downloadMutation.mutate(template.id);
        
        toast({
          title: "Download Started",
          description: `${template.title} is being downloaded.`,
        });
      } catch (error) {
        console.error("Error generating PDF:", error);
        toast({
          title: "Download Failed",
          description: "There was an error generating the template. Please try again.",
          variant: "destructive",
        });
      }
    }).catch(error => {
      console.error("Error loading PDF generator:", error);
      toast({
        title: "Download Failed",
        description: "Could not load the PDF generator. Please try again.",
        variant: "destructive",
      });
    });
  };

  return (
    <section id="planner" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-poppins font-semibold text-neutral-800 mb-3">Planner & Routine Templates</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Downloadable resources to organize your academic life and self-care routines.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Loading skeleton
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="bg-neutral-100 rounded-xl shadow-soft overflow-hidden flex flex-col">
                <div className="p-6 flex-grow">
                  <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-full mx-auto mb-4" />
                </div>
                <div className="px-6 pb-6 mt-auto">
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>
            ))
          ) : !templates || templates.length === 0 ? (
            <div className="col-span-4 text-center py-10">
              <p className="text-neutral-600">No planner templates available. Check back soon!</p>
            </div>
          ) : (
            templates.map((template) => (
              <div key={template.id} className="bg-neutral-100 rounded-xl shadow-soft overflow-hidden hover:shadow-medium transition-shadow duration-300 flex flex-col">
                <div className="p-6 flex-grow">
                  <div className={`w-16 h-16 bg-${
                    template.iconName === "calendar-alt" ? "primary" :
                    template.iconName === "mug-hot" ? "secondary" :
                    template.iconName === "heart" ? "accent" : "primary"
                  }-light rounded-full flex items-center justify-center mb-4 mx-auto`}>
                    <i className={`fas fa-${template.iconName} text-2xl text-${
                      template.iconName === "calendar-alt" ? "primary" :
                      template.iconName === "mug-hot" ? "secondary" :
                      template.iconName === "heart" ? "accent" : "primary"
                    }-dark`}></i>
                  </div>
                  <h3 className="text-lg font-poppins font-semibold text-neutral-800 mb-2 text-center">{template.title}</h3>
                  <p className="text-neutral-600 text-center mb-4">{template.description}</p>
                </div>
                <div className="px-6 pb-6 mt-auto">
                  <Button 
                    onClick={() => handleDownload(template)}
                    disabled={downloadMutation.isPending}
                    className="w-full bg-primary hover:bg-primary-dark text-white"
                  >
                    <i className="fas fa-download mr-2"></i>
                    Download PDF
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Planner;
