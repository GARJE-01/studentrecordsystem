import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define subject schema for validation
const subjectSchema = z.object({
  name: z.string().min(1, "Subject name is required"),
  marks: z.number()
    .min(0, "Marks must be between 0 and 50")
    .max(50, "Marks must be between 0 and 50"),
});

export type Subject = z.infer<typeof subjectSchema>;

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  registrationNo: text("registration_no").notNull().unique(),
  name: text("name").notNull(),
  class: text("class").notNull(),
  subjectMarks: integer("subject_marks").notNull(), // Keeping for backward compatibility
  subjects: jsonb("subjects").$type<Subject[]>().default([]).notNull(), // Array of subjects
});

export const insertStudentSchema = createInsertSchema(students).pick({
  registrationNo: true,
  name: true,
  class: true,
  subjectMarks: true,
  subjects: true,
}).extend({
  registrationNo: z.string()
    .min(1, "Registration number is required")
    .regex(/^T-\d{2}-\d{4}$/, "Registration number must follow the format T-11-0001"),
  name: z.string().min(1, "Full name is required"),
  class: z.string().min(1, "Class selection is required"),
  subjectMarks: z.number()
    .min(0, "Marks must be between 0 and 50")
    .max(50, "Marks must be between 0 and 50"),
  subjects: z.array(subjectSchema).default([]), // Array of subjects with validation
});

export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;
