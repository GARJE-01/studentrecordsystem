import { apiRequest } from './queryClient';
import { Student, InsertStudent } from '@shared/schema';

export const API_ENDPOINTS = {
  STUDENTS: '/api/students',
};

export const fetchStudents = async (): Promise<Student[]> => {
  const response = await fetch(API_ENDPOINTS.STUDENTS, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch students: ${response.status}`);
  }
  
  return response.json();
};

export const fetchStudent = async (id: number): Promise<Student> => {
  const response = await fetch(`${API_ENDPOINTS.STUDENTS}/${id}`, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch student: ${response.status}`);
  }
  
  return response.json();
};

export const createStudent = async (student: InsertStudent): Promise<Student> => {
  const response = await apiRequest('POST', API_ENDPOINTS.STUDENTS, student);
  return response.json();
};

export const updateStudent = async (id: number, student: InsertStudent): Promise<Student> => {
  const response = await apiRequest('PUT', `${API_ENDPOINTS.STUDENTS}/${id}`, student);
  return response.json();
};

export const deleteStudent = async (id: number): Promise<void> => {
  await apiRequest('DELETE', `${API_ENDPOINTS.STUDENTS}/${id}`);
};
