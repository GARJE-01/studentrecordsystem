import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import { Student } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import React, { useState } from "react";

interface StudentTableProps {
  students: Student[];
  isLoading: boolean;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export default function StudentTable({ 
  students, 
  isLoading, 
  onEdit, 
  onDelete 
}: StudentTableProps) {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  
  const toggleRowExpansion = (studentId: number) => {
    setExpandedRows(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };
  if (isLoading) {
    return (
      <div className="shadow overflow-x-auto rounded-b-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reg. No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Subjects</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(3)].map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-20 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="shadow overflow-hidden rounded-b-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">No students found. Add a new student to get started.</p>
      </div>
    );
  }

  return (
    <div className="shadow overflow-x-auto rounded-b-lg border border-gray-200">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reg. No.
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Class
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Subjects
            </TableHead>
            <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <React.Fragment key={student.id}>
              <TableRow 
                className={`hover:bg-gray-50 ${expandedRows.includes(student.id) ? 'bg-gray-50' : ''}`}
              >
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {student.registrationNo}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.name}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.class}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-900">
                  <div className="flex items-center">
                    <div className="flex-1">
                      {student.subjects && student.subjects.length > 0 ? (
                        <div className="flex gap-1 flex-wrap">
                          {student.subjects.slice(0, 2).map((subject, index) => (
                            <Badge key={index} variant="outline" className="mr-1">
                              {subject.name}: {subject.marks}/50
                            </Badge>
                          ))}
                          {student.subjects.length > 2 && (
                            <Badge variant="secondary">
                              +{student.subjects.length - 2} more
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span>{student.subjectMarks}/50</span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRowExpansion(student.id)}
                      className="ml-2"
                    >
                      {expandedRows.includes(student.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(student)}
                    className="text-primary hover:text-primary/80 mr-2"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(student)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
              
              {/* Expanded row for showing all subjects */}
              {expandedRows.includes(student.id) && student.subjects && student.subjects.length > 0 && (
                <TableRow className="bg-gray-50">
                  <TableCell colSpan={5} className="px-6 py-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {student.subjects.map((subject, index) => (
                        <div key={index} className="border rounded p-2 bg-white">
                          <div className="font-medium">{subject.name}</div>
                          <div className="text-sm text-gray-600">Marks: {subject.marks}/50</div>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
