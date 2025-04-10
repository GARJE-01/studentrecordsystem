import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InsertStudent, Student } from "@shared/schema";
import { studentFormSchema, CLASS_OPTIONS } from "@/types/student";
import { DialogTitle } from "@/components/ui/dialog";

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
  // Initialize form with student data or empty values
  const form = useForm<InsertStudent>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: student ? {
      registrationNo: student.registrationNo,
      name: student.name,
      class: student.class,
      subjectMarks: student.subjectMarks,
    } : {
      registrationNo: "",
      name: "",
      class: "",
      subjectMarks: 0,
    },
  });

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
                  <Input placeholder="e.g. REG2023001" {...field} />
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
          
          <FormField
            control={form.control}
            name="subjectMarks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject-1 IA Marks (Out of 50)</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min={0}
                    max={50}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
