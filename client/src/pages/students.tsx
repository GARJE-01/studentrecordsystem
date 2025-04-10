import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS, fetchStudents, createStudent, updateStudent, deleteStudent } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Student, InsertStudent } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import StudentTable from "@/components/studentTable";
import StudentForm from "@/components/studentForm";
import Pagination from "@/components/pagination";
import ConfirmDelete from "@/components/confirmDelete";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, Plus } from "lucide-react";

export default function Students() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Queries
  const { data: students = [], isLoading } = useQuery({
    queryKey: [API_ENDPOINTS.STUDENTS],
    queryFn: fetchStudents
  });
  
  // Mutations
  const createMutation = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.STUDENTS] });
      setIsAddModalOpen(false);
      toast({
        title: "Success!",
        description: "Student record has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error!",
        description: error.message || "Failed to create student record.",
        variant: "destructive",
      });
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: InsertStudent }) => 
      updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.STUDENTS] });
      setIsEditModalOpen(false);
      toast({
        title: "Success!",
        description: "Student record has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error!",
        description: error.message || "Failed to update student record.",
        variant: "destructive",
      });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.STUDENTS] });
      setIsDeleteModalOpen(false);
      toast({
        title: "Success!",
        description: "Student record has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error!",
        description: error.message || "Failed to delete student record.",
        variant: "destructive",
      });
    }
  });
  
  // Handlers
  const handleAddStudent = (data: InsertStudent) => {
    createMutation.mutate(data);
  };
  
  const handleEditStudent = (data: InsertStudent) => {
    if (selectedStudent) {
      updateMutation.mutate({ id: selectedStudent.id, data });
    }
  };
  
  const handleDeleteStudent = () => {
    if (selectedStudent) {
      deleteMutation.mutate(selectedStudent.id);
    }
  };
  
  // Filter students based on search
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.registrationNo.toLowerCase().includes(search.toLowerCase()) ||
    student.class.toLowerCase().includes(search.toLowerCase())
  );
  
  // Pagination
  const paginatedStudents = filteredStudents.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  
  const totalPages = Math.ceil(filteredStudents.length / pageSize);
  
  return (
    <div className="py-6 mx-auto px-4 sm:px-6 md:px-8">
      {/* Tabs */}
      <div className="mb-5 border-b border-gray-200">
        <div className="sm:flex sm:items-baseline">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 sm:mb-0">Manage Students</h3>
          <div className="mt-4 sm:mt-0 sm:ml-10">
            <nav className="-mb-px flex space-x-8">
              <a href="#" className="border-b-2 border-primary pb-4 px-1 text-sm font-medium text-primary">Student Records</a>
              <a href="#" className="border-b-2 border-transparent pb-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">Statistics</a>
              <a href="#" className="border-b-2 border-transparent pb-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">Academic Performance</a>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Action Bar */}
      <div className="md:flex md:items-center md:justify-between bg-white p-4 rounded-t-lg shadow-sm">
        <div className="flex-1 min-w-0 mb-4 md:mb-0">
          <h2 className="text-lg font-medium leading-6 text-gray-900">All Students</h2>
          <p className="mt-1 text-sm text-gray-500">
            A list of all students in the system with their details.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </span>
          </div>
        </div>
      </div>
      
      {/* Student Table */}
      <StudentTable 
        students={paginatedStudents}
        isLoading={isLoading}
        onEdit={(student) => {
          setSelectedStudent(student);
          setIsEditModalOpen(true);
        }}
        onDelete={(student) => {
          setSelectedStudent(student);
          setIsDeleteModalOpen(true);
        }}
      />
      
      {/* Pagination */}
      <Pagination 
        currentPage={page}
        totalPages={totalPages}
        totalItems={filteredStudents.length}
        pageSize={pageSize}
        onPageChange={setPage}
      />
      
      {/* Add Student Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <StudentForm
            title="Add New Student"
            onSubmit={handleAddStudent}
            isLoading={createMutation.isPending}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Student Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <StudentForm
            title="Edit Student"
            student={selectedStudent}
            onSubmit={handleEditStudent}
            isLoading={updateMutation.isPending}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Modal */}
      <ConfirmDelete
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteStudent}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
