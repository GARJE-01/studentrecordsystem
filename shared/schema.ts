import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  registrationNo: text("registration_no").notNull().unique(),
  name: text("name").notNull(),
  class: text("class").notNull(),
  subjectMarks: integer("subject_marks").notNull(),
});

export const insertStudentSchema = createInsertSchema(students).pick({
  registrationNo: true,
  name: true,
  class: true,
  subjectMarks: true,
}).extend({
  registrationNo: z.string()
    .min(1, "Registration number is required")
    .regex(/^REG\d{7}$/, "Registration number must follow the format REGyyyynnn"),
  name: z.string().min(1, "Full name is required"),
  class: z.string().min(1, "Class selection is required"),
  subjectMarks: z.number()
    .min(0, "Marks must be between 0 and 50")
    .max(50, "Marks must be between 0 and 50"),
});

export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;
