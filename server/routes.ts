import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStudentSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { pool } from "./db";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all students
  app.get("/api/students", async (req, res) => {
    try {
      const students = await storage.getStudents();
      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  // Get student by ID
  app.get("/api/students/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid student ID" });
      }

      const student = await storage.getStudent(id);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.json(student);
    } catch (error) {
      console.error("Error fetching student:", error);
      res.status(500).json({ message: "Failed to fetch student" });
    }
  });

  // Create new student
  app.post("/api/students", async (req, res) => {
    try {
      const studentData = insertStudentSchema.parse(req.body);
      
      // Check if registration number is already in use
      const existingStudent = await storage.getStudentByRegistrationNo(studentData.registrationNo);
      if (existingStudent) {
        return res.status(409).json({ 
          message: "Registration number already in use" 
        });
      }

      const newStudent = await storage.createStudent(studentData);
      res.status(201).json(newStudent);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationError.details 
        });
      }
      
      console.error("Error creating student:", error);
      res.status(500).json({ message: "Failed to create student" });
    }
  });

  // Update student
  app.put("/api/students/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid student ID" });
      }

      const studentData = insertStudentSchema.parse(req.body);
      
      // Check if registration number is already in use by another student
      const existingStudent = await storage.getStudentByRegistrationNo(studentData.registrationNo);
      if (existingStudent && existingStudent.id !== id) {
        return res.status(409).json({ 
          message: "Registration number already in use by another student" 
        });
      }

      const updatedStudent = await storage.updateStudent(id, studentData);
      if (!updatedStudent) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.json(updatedStudent);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationError.details 
        });
      }
      
      console.error("Error updating student:", error);
      res.status(500).json({ message: "Failed to update student" });
    }
  });

  // Delete student
  app.delete("/api/students/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid student ID" });
      }

      const deleted = await storage.deleteStudent(id);
      if (!deleted) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting student:", error);
      res.status(500).json({ message: "Failed to delete student" });
    }
  });
  
  // Execute custom SQL queries for database management
  app.post("/api/db-query", async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ 
          error: "Invalid query parameter", 
          data: [] 
        });
      }
      
      // Execute the query
      const result = await pool.query(query);
      
      // Return the result
      res.json({ 
        data: result.rows,
        message: `Query executed successfully: ${result.rowCount} rows affected.` 
      });
    } catch (error: any) {
      console.error("Database query error:", error);
      res.status(500).json({ 
        error: error.message || "Failed to execute database query", 
        data: [] 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
