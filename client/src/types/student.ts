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
  { value: "CS-SE", label: "Computer Science - Second Year" },
  { value: "CS-TE", label: "Computer Science - Third Year" },
  { value: "CS-BE", label: "Computer Science - Fourth Year" },
  { value: "IT-SE", label: "IT - Second Year" },
  { value: "IT-TE", label: "IT - Third Year" },
  { value: "IT-BE", label: "IT - Final Year" },
  { value: "EC-SE", label: "Electronics & Communication - Second Year" },
  { value: "EC-TE", label: "Electronics & Communication - Third Year" },
  { value: "EC-BE", label: "Electronics & Communication - Fourth Year" },
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
