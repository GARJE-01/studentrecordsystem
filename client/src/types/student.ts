import { z } from "zod";
import { insertStudentSchema } from "@shared/schema";

export const studentFormSchema = insertStudentSchema;

export enum NotificationType {
  SUCCESS = "success",
  ERROR = "error",
  INFO = "info",
}

export interface Notification {
  type: NotificationType;
  title: string;
  message: string;
  show: boolean;
}

// Class options for the dropdown
export const CLASS_OPTIONS = [
  { value: "CS-A", label: "Computer Science - A" },
  { value: "CS-B", label: "Computer Science - B" },
  { value: "IT-SE", label: "IT - SE (Second Year)" },
  { value: "IT-TE", label: "IT - TE (Third Year)" },
  { value: "IT-BE", label: "IT - BE (Final Year)" },
  { value: "EC-A", label: "Electronics & Communication - A" },
];

// Subject name options
export const SUBJECT_NAME_OPTIONS = [
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
