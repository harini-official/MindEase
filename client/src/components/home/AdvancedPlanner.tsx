import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PlannerTemplate } from "@/lib/types";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

// Define planner customization schema
const plannerSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  color: z.string(),
  includeWeekends: z.boolean().default(true),
  scheduledHours: z.object({
    start: z.string(),
    end: z.string()
  }),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  tasks: z.array(
    z.object({
      title: z.string(),
      priority: z.enum(["high", "medium", "low"]),
      dueDate: z.date().optional()
    })
  ).optional()
});

type PlannerFormValues = z.infer<typeof plannerSchema>;

const defaultValues: PlannerFormValues = {
  title: "My Custom Study Plan",
  description: "",
  startDate: new Date(),
  endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
  color: "blue",
  includeWeekends: true,
  scheduledHours: {
    start: "09:00",
    end: "17:00"
  },
  categories: ["Study", "Self-Care"],
  tasks: []
};

type TaskItem = {
  title: string;
  priority: "high" | "medium" | "low";
  dueDate?: Date;
};

const AdvancedPlanner = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<PlannerTemplate | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [taskInput, setTaskInput] = useState("");
  const [taskPriority, setTaskPriority] = useState<"high" | "medium" | "low">("medium");
  const [taskDueDate, setTaskDueDate] = useState<Date | undefined>(undefined);
  const [showTaskCalendar, setShowTaskCalendar] = useState(false);
  const { toast } = useToast();

  const form = useForm<PlannerFormValues>({
    resolver: zodResolver(plannerSchema),
    defaultValues
  });

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

  const savePlannerMutation = useMutation({
    mutationFn: async (data: PlannerFormValues) => {
      return await apiRequest('POST', '/api/custom-planners', data);
    },
    onSuccess: () => {
      toast({
        title: "Planner Saved",
        description: "Your custom planner has been created successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "Could not save your custom planner. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleDownload = (template: PlannerTemplate) => {
    setSelectedTemplate(template);
    downloadMutation.mutate(template.id);
    
    // Create a link element to download the file
    const link = document.createElement('a');
    link.href = template.fileUrl;
    link.download = template.title.replace(/\\s+/g, '-').toLowerCase() + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: `${template.title} is being downloaded.`,
    });
  };

  const addTask = () => {
    if (taskInput.trim()) {
      const newTask = {
        title: taskInput,
        priority: taskPriority,
        dueDate: taskDueDate
      };
      setTasks([...tasks, newTask]);
      form.setValue('tasks', [...tasks, newTask]);
      setTaskInput("");
      setTaskPriority("medium");
      setTaskDueDate(undefined);
      setShowTaskCalendar(false);
    }
  };

  const removeTask = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    form.setValue('tasks', updatedTasks);
  };

  const onSubmit = (data: PlannerFormValues) => {
    // Include tasks in the submission
    const completeData = {
      ...data,
      tasks: tasks
    };
    savePlannerMutation.mutate(completeData);
  };

  // Color options for the planner
  const colorOptions = [
    { value: "blue", label: "Blue", class: "bg-blue-500" },
    { value: "green", label: "Green", class: "bg-green-500" },
    { value: "purple", label: "Purple", class: "bg-purple-500" },
    { value: "pink", label: "Pink", class: "bg-pink-500" },
    { value: "orange", label: "Orange", class: "bg-orange-500" }
  ];

  // Category options for the planner
  const categoryOptions = [
    { value: "Study", label: "Study Sessions" },
    { value: "Self-Care", label: "Self-Care Routines" },
    { value: "Exercise", label: "Exercise" },
    { value: "Social", label: "Social Time" },
    { value: "Relaxation", label: "Relaxation" },
    { value: "Hobbies", label: "Hobbies" },
    { value: "Projects", label: "Projects" }
  ];

  return (
    <section id="advanced-planner" className="py-16 bg-white dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-poppins font-semibold text-neutral-800 dark:text-white mb-3">Advanced Planner</h2>
          <p className="text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            Choose from our templates or create your own customized planner to organize your academic and wellness activities.
          </p>
        </div>
        
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="templates" className="text-lg">Ready-Made Templates</TabsTrigger>
            <TabsTrigger value="custom" className="text-lg">Create Custom Planner</TabsTrigger>
          </TabsList>
          
          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                // Loading skeleton (reused from original Planner component)
                Array(4).fill(0).map((_, index) => (
                  <Card key={index} className="bg-white dark:bg-neutral-800">
                    <CardHeader className="pb-2">
                      <div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-700 rounded-full mx-auto mb-4"></div>
                      <CardTitle className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mx-auto"></CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full mx-auto mb-2"></div>
                      <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6 mx-auto mb-2"></div>
                    </CardContent>
                    <CardFooter>
                      <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded w-full mx-auto"></div>
                    </CardFooter>
                  </Card>
                ))
              ) : !templates || templates.length === 0 ? (
                <div className="col-span-4 text-center py-10">
                  <p className="text-neutral-600 dark:text-neutral-300">No planner templates available. Check back soon!</p>
                </div>
              ) : (
                templates.map((template) => (
                  <Card key={template.id} className="bg-white dark:bg-neutral-800 hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 mx-auto ${
                        template.iconName === "calendar-alt" ? "bg-primary-light dark:bg-primary-dark" :
                        template.iconName === "mug-hot" ? "bg-secondary-light dark:bg-secondary-dark" :
                        template.iconName === "heart" ? "bg-accent-light dark:bg-accent-dark" : "bg-primary-light dark:bg-primary-dark"
                      }`}>
                        <i className={`fas fa-${template.iconName} text-2xl ${
                          template.iconName === "calendar-alt" ? "text-primary-dark dark:text-primary-light" :
                          template.iconName === "mug-hot" ? "text-secondary-dark dark:text-secondary-light" :
                          template.iconName === "heart" ? "text-accent-dark dark:text-accent-light" : "text-primary-dark dark:text-primary-light"
                        }`}></i>
                      </div>
                      <CardTitle className="text-center text-lg">{template.title}</CardTitle>
                      <CardDescription className="text-center">{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-sm">
                      <p className="text-neutral-500 dark:text-neutral-400">{template.downloadCount} downloads</p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => handleDownload(template)}
                        disabled={downloadMutation.isPending}
                        className="w-full bg-primary hover:bg-primary-dark text-white"
                      >
                        <i className="fas fa-download mr-2"></i>
                        Download PDF
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          {/* Custom Planner Tab */}
          <TabsContent value="custom">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left column */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Planner Title</Label>
                        <Input
                          id="title"
                          placeholder="Enter a title for your planner"
                          {...form.register('title')}
                        />
                        {form.formState.errors.title && (
                          <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe the purpose of this planner"
                          {...form.register('description')}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Controller
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                className="border rounded-md p-3"
                              />
                            )}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Controller
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < form.getValues().startDate}
                                className="border rounded-md p-3"
                              />
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Tasks & Activities</CardTitle>
                      <CardDescription>Add specific tasks to your planner</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add a new task"
                          value={taskInput}
                          onChange={(e) => setTaskInput(e.target.value)}
                          className="flex-1"
                        />
                        <Select value={taskPriority} onValueChange={(value: any) => setTaskPriority(value)}>
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button type="button" onClick={addTask}>Add</Button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="task-due-date">Due date: </Label>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setShowTaskCalendar(!showTaskCalendar)}
                            className="text-xs h-7 px-2"
                          >
                            {taskDueDate ? format(taskDueDate, 'PPP') : 'Set date'}
                          </Button>
                        </div>
                        {showTaskCalendar && (
                          <Calendar
                            mode="single"
                            selected={taskDueDate}
                            onSelect={(date) => setTaskDueDate(date)}
                            className="border rounded-md p-3 my-2"
                          />
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Task List</Label>
                        <div className="border rounded-md p-3 max-h-64 overflow-y-auto">
                          {tasks.length === 0 ? (
                            <p className="text-center text-neutral-500 py-4">No tasks added yet</p>
                          ) : (
                            <ul className="space-y-2">
                              {tasks.map((task, index) => (
                                <li key={index} className="flex items-center justify-between p-2 bg-neutral-100 dark:bg-neutral-800 rounded-md">
                                  <div>
                                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                      task.priority === 'high' ? 'bg-red-500' :
                                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}></span>
                                    <span>{task.title}</span>
                                    {task.dueDate && (
                                      <span className="ml-2 text-xs text-neutral-500">
                                        Due: {format(task.dueDate, 'MMM d')}
                                      </span>
                                    )}
                                  </div>
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => removeTask(index)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <i className="fas fa-times"></i>
                                  </Button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Planner Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Color Theme</Label>
                        <div className="flex flex-wrap gap-3">
                          <Controller
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                              <>
                                {colorOptions.map((color) => (
                                  <div 
                                    key={color.value}
                                    className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center ${color.class} ${
                                      field.value === color.value ? 'ring-2 ring-offset-2 ring-neutral-900' : ''
                                    }`}
                                    onClick={() => field.onChange(color.value)}
                                  >
                                    {field.value === color.value && (
                                      <i className="fas fa-check text-white"></i>
                                    )}
                                  </div>
                                ))}
                              </>
                            )}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Daily Schedule Hours</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="start-time">Start Time</Label>
                            <Input
                              id="start-time"
                              type="time"
                              {...form.register('scheduledHours.start')}
                            />
                          </div>
                          <div>
                            <Label htmlFor="end-time">End Time</Label>
                            <Input
                              id="end-time"
                              type="time"
                              {...form.register('scheduledHours.end')}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Controller
                          control={form.control}
                          name="includeWeekends"
                          render={({ field }) => (
                            <Checkbox
                              id="include-weekends"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <Label htmlFor="include-weekends">Include weekends in planner</Label>
                      </div>

                      <div className="space-y-2">
                        <Label>Categories to Include</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Controller
                            control={form.control}
                            name="categories"
                            render={({ field }) => (
                              <>
                                {categoryOptions.map((category) => (
                                  <div key={category.value} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`category-${category.value}`}
                                      checked={field.value?.includes(category.value)}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...field.value, category.value]
                                          : field.value.filter((value) => value !== category.value);
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                    <Label htmlFor={`category-${category.value}`}>{category.label}</Label>
                                  </div>
                                ))}
                              </>
                            )}
                          />
                        </div>
                        {form.formState.errors.categories && (
                          <p className="text-sm text-red-500">{form.formState.errors.categories.message}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Preview & Generate</CardTitle>
                      <CardDescription>Create your custom planner with the settings above</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-neutral-100 dark:bg-neutral-800 rounded-md p-4 mb-4">
                        <h3 className="font-medium mb-2">{form.getValues().title || "My Custom Planner"}</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                          {form.getValues().description || "No description provided"}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs text-neutral-500">
                          <span>{format(form.getValues().startDate, 'PP')} - {format(form.getValues().endDate, 'PP')}</span>
                          <span>•</span>
                          <span>{form.getValues().scheduledHours.start} - {form.getValues().scheduledHours.end}</span>
                          <span>•</span>
                          <span>{tasks.length} tasks</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary-dark text-white"
                        disabled={savePlannerMutation.isPending}
                      >
                        {savePlannerMutation.isPending ? "Generating..." : "Generate Custom Planner"}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default AdvancedPlanner;