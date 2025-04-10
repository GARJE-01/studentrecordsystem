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
  { value: "IT-A", label: "Information Technology - A" },
  { value: "IT-B", label: "Information Technology - B" },
  { value: "EC-A", label: "Electronics & Communication - A" },
];
