import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InsertStudent, Student, Subject } from "@shared/schema";
import { studentFormSchema, CLASS_OPTIONS } from "@/types/student";
import { DialogTitle } from "@/components/ui/dialog";
import { PlusCircle, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Subject name options
const SUBJECT_NAME_OPTIONS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Programming",
  "Data Structures",
  "Algorithms",
  "Database Systems",
  "Operating Systems",
  "Computer Networks",
  "Web Development",
  "Software Engineering",
  "Artificial Intelligence",
  "Machine Learning"
];

interface StudentFormProps {
  title: string;
  student?: Student | null;
  onSubmit: (data: InsertStudent) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function StudentForm({ 
  title, 
  student, 
  onSubmit, 
  onCancel, 
  isLoading 
}: StudentFormProps) {
  // Initialize default subjects (minimum 5)
  const getDefaultSubjects = (existingSubjects?: Subject[]): Subject[] => {
    if (existingSubjects && existingSubjects.length >= 5) {
      return existingSubjects;
    }
    
    const defaultSubjectNames = [
      "Mathematics", "Physics", "Chemistry", "Computer Science", "Programming"
    ];
    
    if (existingSubjects && existingSubjects.length > 0) {
      // Add additional subjects to reach the minimum of 5
      const additionalSubjects: Subject[] = [];
      for (let i = existingSubjects.length; i < 5; i++) {
        additionalSubjects.push({
          name: defaultSubjectNames[i] || `Subject-${i+1}`,
          marks: 0
        });
      }
      return [...existingSubjects, ...additionalSubjects];
    }
    
    // No existing subjects, create 5 default ones
    return defaultSubjectNames.map((name, index) => ({
      name,
      marks: 0
    }));
  };

  // Initialize form with student data or empty values
  const form = useForm<InsertStudent>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: student ? {
      registrationNo: student.registrationNo,
      name: student.name,
      class: student.class,
      subjectMarks: student.subjectMarks,
      subjects: getDefaultSubjects(student.subjects),
    } : {
      registrationNo: "",
      name: "",
      class: "",
      subjectMarks: 0,
      subjects: getDefaultSubjects(),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subjects",
  });

  // Keep the subjectMarks field in sync with the first subject (for backward compatibility)
  const updateMainSubjectMarks = (index: number, value: number) => {
    if (index === 0) {
      form.setValue("subjectMarks", value);
    }
  };

  const addSubject = () => {
    append({ name: `Subject-${fields.length + 1}`, marks: 0 });
  };
  
  // Ensure we can't remove subjects below the minimum of 5
  const canRemoveSubject = fields.length > 5;

  return (
    <div>
      <DialogTitle className="mb-4">{title}</DialogTitle>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="registrationNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. T-11-0001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="class"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CLASS_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Subjects and Marks</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addSubject}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Add Subject
              </Button>
            </div>
            
            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id} className="border border-border">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <FormField
                          control={form.control}
                          name={`subjects.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject Name</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value || undefined}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a subject" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {SUBJECT_NAME_OPTIONS.map(option => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex-1">
                        <FormField
                          control={form.control}
                          name={`subjects.${index}.marks`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Marks (Out of 50)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number"
                                  min={0}
                                  max={50}
                                  {...field}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value) || 0;
                                    field.onChange(value);
                                    updateMainSubjectMarks(index, value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {canRemoveSubject && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="mt-6"
                          onClick={() => remove(index)}
                          title={fields.length <= 5 ? "Minimum 5 subjects required" : "Remove subject"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : student ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
