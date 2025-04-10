import { students, type Student, type InsertStudent } from "@shared/schema";

export interface IStorage {
  getStudents(): Promise<Student[]>;
  getStudent(id: number): Promise<Student | undefined>;
  getStudentByRegistrationNo(registrationNo: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: number, student: Partial<InsertStudent>): Promise<Student | undefined>;
  deleteStudent(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private students: Map<number, Student>;
  currentId: number;

  constructor() {
    this.students = new Map();
    this.currentId = 1;
    
    // Add some sample data
    const sampleData: InsertStudent[] = [
      { registrationNo: "T-11-0001", name: "John Doe", class: "Computer Science", subjectMarks: 42 },
      { registrationNo: "T-11-0002", name: "Jane Smith", class: "Electronics", subjectMarks: 45 },
      { registrationNo: "T-11-0003", name: "Alex Johnson", class: "Mechanical", subjectMarks: 38 },
      { registrationNo: "T-11-0004", name: "Samantha Lee", class: "Civil", subjectMarks: 40 },
      { registrationNo: "T-11-0005", name: "Michael Brown", class: "Computer Science", subjectMarks: 48 }
    ];
    
    // Insert sample data
    sampleData.forEach(student => {
      const id = this.currentId++;
      this.students.set(id, { ...student, id });
    });
  }

  async getStudents(): Promise<Student[]> {
    return Array.from(this.students.values());
  }

  async getStudent(id: number): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async getStudentByRegistrationNo(registrationNo: string): Promise<Student | undefined> {
    return Array.from(this.students.values()).find(
      (student) => student.registrationNo === registrationNo,
    );
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = this.currentId++;
    const student: Student = { ...insertStudent, id };
    this.students.set(id, student);
    return student;
  }

  async updateStudent(
    id: number,
    studentUpdate: Partial<InsertStudent>
  ): Promise<Student | undefined> {
    const existingStudent = this.students.get(id);
    
    if (!existingStudent) {
      return undefined;
    }
    
    const updatedStudent: Student = {
      ...existingStudent,
      ...studentUpdate,
    };
    
    this.students.set(id, updatedStudent);
    return updatedStudent;
  }

  async deleteStudent(id: number): Promise<boolean> {
    return this.students.delete(id);
  }
}

export const storage = new MemStorage();
