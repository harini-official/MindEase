import { jsPDF } from 'jspdf';

export interface PlannerOptions {
  title: string;
  startDate?: Date;
  endDate?: Date;
  colorTheme: string;
  scheduleStart: number;
  scheduleEnd: number;
  tasks?: {
    title: string;
    priority: "high" | "medium" | "low";
    dueDate?: Date;
  }[];
  notes?: string;
  studentName?: string;
}

const getThemeColors = (theme: string) => {
  switch (theme) {
    case 'blue':
      return { primary: '#2563eb', secondary: '#93c5fd', text: '#1e3a8a' };
    case 'purple':
      return { primary: '#7c3aed', secondary: '#c4b5fd', text: '#4c1d95' };
    case 'green':
      return { primary: '#10b981', secondary: '#a7f3d0', text: '#065f46' };
    case 'pink':
      return { primary: '#ec4899', secondary: '#fbcfe8', text: '#831843' };
    case 'orange':
      return { primary: '#f97316', secondary: '#fed7aa', text: '#7c2d12' };
    default:
      return { primary: '#2563eb', secondary: '#93c5fd', text: '#1e3a8a' };
  }
};

// Format dates to display nicely
const formatDate = (date?: Date): string => {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric'
  });
};

// Helper to create days of week array between two dates
const getDaysOfWeek = (startDate?: Date, endDate?: Date): Date[] => {
  if (!startDate) {
    startDate = new Date();
  }
  
  const days: Date[] = [new Date(startDate)];
  
  if (!endDate) {
    endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6); // Default to 7 days
  }
  
  let currentDate = new Date(startDate);
  
  while (currentDate < endDate) {
    currentDate.setDate(currentDate.getDate() + 1);
    days.push(new Date(currentDate));
  }
  
  return days;
};

// Generate the weekly planner PDF
export const generateWeeklyPlanner = (options: PlannerOptions): string => {
  const doc = new jsPDF();
  const { title, startDate, endDate, colorTheme, scheduleStart, scheduleEnd, tasks, notes, studentName } = options;
  const { primary, secondary, text } = getThemeColors(colorTheme);
  
  // Set up document
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(text);
  
  // Title
  doc.text(title, 105, 20, { align: 'center' });
  
  // Date range
  if (startDate && endDate) {
    doc.setFontSize(12);
    const dateRange = `${formatDate(startDate)} - ${formatDate(endDate)}`;
    doc.text(dateRange, 105, 30, { align: 'center' });
  }
  
  // Student name
  if (studentName) {
    doc.setFontSize(12);
    doc.text(`Student: ${studentName}`, 20, 40);
  }
  
  // Weekly schedule 
  doc.setFillColor(primary);
  doc.rect(20, 50, 170, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text('WEEKLY SCHEDULE', 105, 57, { align: 'center' });
  
  // Draw days of the week
  const days = getDaysOfWeek(startDate, endDate);
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const columnWidth = 170 / days.length;
  
  days.forEach((day, index) => {
    const x = 20 + (columnWidth * index);
    
    // Day header
    doc.setFillColor(secondary);
    doc.rect(x, 60, columnWidth, 10, 'F');
    
    doc.setTextColor(text);
    doc.setFontSize(10);
    doc.text(daysOfWeek[day.getDay()], x + (columnWidth / 2), 67, { align: 'center' });
    
    // Day date
    doc.setFontSize(8);
    doc.text(formatDate(day), x + (columnWidth / 2), 73, { align: 'center' });
  });
  
  // Time slots
  const hourHeight = 10;
  const scheduleHeight = (scheduleEnd - scheduleStart) * hourHeight;
  
  // Draw time slots
  for (let hour = scheduleStart; hour <= scheduleEnd; hour++) {
    const y = 80 + ((hour - scheduleStart) * hourHeight);
    
    // Time label
    doc.setTextColor(text);
    doc.setFontSize(8);
    doc.text(`${hour}:00`, 15, y + 4);
    
    // Horizontal line for each hour
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, 190, y);
  }
  
  // Vertical lines separating days
  days.forEach((_, index) => {
    const x = 20 + (columnWidth * index);
    doc.line(x, 60, x, 80 + scheduleHeight);
  });
  doc.line(190, 60, 190, 80 + scheduleHeight); // Last vertical line
  
  // Tasks section
  const tasksY = 90 + scheduleHeight;
  
  doc.setFillColor(primary);
  doc.rect(20, tasksY, 170, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text('PRIORITY TASKS', 105, tasksY + 7, { align: 'center' });
  
  // Task headers
  doc.setFillColor(secondary);
  doc.rect(20, tasksY + 10, 110, 10, 'F');
  doc.rect(130, tasksY + 10, 30, 10, 'F');
  doc.rect(160, tasksY + 10, 30, 10, 'F');
  
  doc.setTextColor(text);
  doc.setFontSize(10);
  doc.text('Task', 75, tasksY + 17, { align: 'center' });
  doc.text('Priority', 145, tasksY + 17, { align: 'center' });
  doc.text('Due Date', 175, tasksY + 17, { align: 'center' });
  
  // Add tasks if available
  if (tasks && tasks.length > 0) {
    tasks.forEach((task, index) => {
      const y = tasksY + 20 + (index * 10);
      
      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(20, y, 170, 10, 'F');
      }
      
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(9);
      
      // Task title (truncate if too long)
      let title = task.title;
      if (title.length > 40) {
        title = title.substring(0, 37) + '...';
      }
      doc.text(title, 25, y + 7);
      
      // Priority
      let priorityColor;
      switch (task.priority) {
        case 'high':
          priorityColor = '#ef4444';
          break;
        case 'medium':
          priorityColor = '#f97316';
          break;
        case 'low':
          priorityColor = '#22c55e';
          break;
        default:
          priorityColor = '#22c55e';
      }
      
      doc.setFillColor(priorityColor);
      doc.circle(140, y + 5, 3, 'F');
      doc.text(task.priority, 145, y + 7, { align: 'center' });
      
      // Due date
      if (task.dueDate) {
        doc.text(formatDate(task.dueDate), 175, y + 7, { align: 'center' });
      }
    });
  } else {
    // No tasks placeholder
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(10);
    doc.text('No tasks added', 105, tasksY + 30, { align: 'center' });
  }
  
  // Notes section
  const notesY = tasksY + 20 + (tasks?.length || 1) * 10 + 10;
  
  doc.setFillColor(primary);
  doc.rect(20, notesY, 170, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text('NOTES', 105, notesY + 7, { align: 'center' });
  
  // Notes content
  doc.setDrawColor(200, 200, 200);
  doc.rect(20, notesY + 10, 170, 40);
  
  if (notes) {
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    
    // Split notes into lines to fit the box
    const noteLines = doc.splitTextToSize(notes, 160);
    const maxLines = Math.min(noteLines.length, 7); // Limit to 7 lines
    
    for (let i = 0; i < maxLines; i++) {
      doc.text(noteLines[i], 25, notesY + 20 + (i * 6));
    }
  }
  
  // Footer
  doc.setTextColor(text);
  doc.setFontSize(8);
  doc.text('Generated by MindEase - Student Wellness Platform', 105, 285, { align: 'center' });
  
  // Return as base64 data URL
  return doc.output('datauristring');
};

// Generate template PDFs for the existing template planners
export const generateTemplatePDF = (templateId: number): string => {
  const templates = {
    1: {
      title: "Weekly Study Planner",
      startDate: new Date(),
      colorTheme: "blue",
      scheduleStart: 8,
      scheduleEnd: 22,
      tasks: [
        { title: "Study for Math Quiz", priority: "high", dueDate: new Date(new Date().setDate(new Date().getDate() + 2)) },
        { title: "Complete English Essay", priority: "medium", dueDate: new Date(new Date().setDate(new Date().getDate() + 4)) },
        { title: "Review Chemistry Notes", priority: "low", dueDate: new Date(new Date().setDate(new Date().getDate() + 3)) }
      ],
      notes: "Don't forget to take regular breaks and get enough sleep! Stay hydrated and make time for self-care."
    },
    2: {
      title: "Monthly Goal Planner",
      startDate: new Date(),
      colorTheme: "purple",
      scheduleStart: 6,
      scheduleEnd: 22,
      tasks: [
        { title: "Complete Course Project", priority: "high", dueDate: new Date(new Date().setDate(new Date().getDate() + 25)) },
        { title: "Read 2 Books", priority: "medium", dueDate: new Date(new Date().setDate(new Date().getDate() + 30)) },
        { title: "Practice Meditation (Daily)", priority: "medium" },
        { title: "Exercise 3x Weekly", priority: "medium" }
      ],
      notes: "Monthly goals: 1. Improve study habits 2. Reduce screen time 3. Get more restful sleep 4. Drink more water"
    },
    3: {
      title: "Self-Care Routine Planner",
      startDate: new Date(),
      colorTheme: "green",
      scheduleStart: 7,
      scheduleEnd: 21,
      tasks: [
        { title: "Morning Meditation (15min)", priority: "high" },
        { title: "Afternoon Walk (30min)", priority: "medium" },
        { title: "Evening Journal", priority: "medium" },
        { title: "Digital Detox (1 hour before bed)", priority: "high" },
        { title: "Weekly Check-in with Friend", priority: "low", dueDate: new Date(new Date().setDate(new Date().getDate() + 5)) }
      ],
      notes: "Remember: self-care isn't selfish. It's necessary for your mental health and academic success."
    },
    4: {
      title: "Exam Preparation Planner",
      startDate: new Date(),
      colorTheme: "orange",
      scheduleStart: 8,
      scheduleEnd: 23,
      tasks: [
        { title: "Create Study Flashcards", priority: "high", dueDate: new Date(new Date().setDate(new Date().getDate() + 1)) },
        { title: "Review Last Year's Exam", priority: "high", dueDate: new Date(new Date().setDate(new Date().getDate() + 2)) },
        { title: "Complete Practice Problems", priority: "medium", dueDate: new Date(new Date().setDate(new Date().getDate() + 5)) },
        { title: "Group Study Session", priority: "low", dueDate: new Date(new Date().setDate(new Date().getDate() + 3)) },
        { title: "Final Review", priority: "high", dueDate: new Date(new Date().setDate(new Date().getDate() + 6)) }
      ],
      notes: "Study strategy: 1. Review notes 2. Practice problems 3. Teach concepts to someone else 4. Take practice tests under timed conditions"
    },
    5: {
      title: "Balanced Week Planner",
      startDate: new Date(),
      colorTheme: "pink",
      scheduleStart: 7,
      scheduleEnd: 22,
      tasks: [
        { title: "Class Assignments", priority: "high", dueDate: new Date(new Date().setDate(new Date().getDate() + 4)) },
        { title: "Exercise (3x this week)", priority: "medium" },
        { title: "Call Family", priority: "medium", dueDate: new Date(new Date().setDate(new Date().getDate() + 2)) },
        { title: "Creative Hobby Time", priority: "low" },
        { title: "Meal Prep Sunday", priority: "medium", dueDate: new Date(new Date().setDate(new Date().getDate() + 7)) }
      ],
      notes: "Balance is key! Make time for academics, physical activity, social connections, and personal interests."
    }
  };
  
  // Get template data based on ID, default to Weekly Study Planner if not found
  const templateData = templates[templateId as keyof typeof templates] || templates[1];
  
  // Generate the PDF
  return generateWeeklyPlanner(templateData as PlannerOptions);
};