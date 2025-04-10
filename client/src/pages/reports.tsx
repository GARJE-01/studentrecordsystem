import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/api";
import { Student } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, BarChartHorizontal, LineChart, PieChart } from "lucide-react";

export default function Reports() {
  const { data: students = [], isLoading } = useQuery<Student[]>({
    queryKey: [API_ENDPOINTS.STUDENTS],
  });

  // Function to count students by class
  const getStudentsByClass = () => {
    const classCounts: Record<string, number> = {};
    students.forEach(student => {
      if (classCounts[student.class]) {
        classCounts[student.class]++;
      } else {
        classCounts[student.class] = 1;
      }
    });
    return classCounts;
  };

  // Function to calculate average marks
  const getAverageMarksByClass = () => {
    const classMarks: Record<string, { total: number; count: number }> = {};
    students.forEach(student => {
      if (classMarks[student.class]) {
        classMarks[student.class].total += student.subjectMarks;
        classMarks[student.class].count++;
      } else {
        classMarks[student.class] = { total: student.subjectMarks, count: 1 };
      }
    });

    // Calculate averages
    const averages: Record<string, number> = {};
    Object.entries(classMarks).forEach(([className, { total, count }]) => {
      averages[className] = Math.round(total / count);
    });

    return averages;
  };

  return (
    <div className="py-6 mx-auto px-4 sm:px-6 md:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="mt-1 text-sm text-gray-600">
          Analytics and reports for student performance
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Students by Class Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Students by Class</CardTitle>
            <PieChart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(getStudentsByClass()).map(([className, count]) => (
                  <div key={className} className="flex justify-between items-center">
                    <div className="font-medium">{className}</div>
                    <div className="flex items-center">
                      <div className="h-2.5 bg-primary rounded-full mr-2" style={{ width: `${count * 20}px` }}></div>
                      <span>{count} students</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Average Marks by Class Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Average Marks by Class</CardTitle>
            <BarChartHorizontal className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(getAverageMarksByClass()).map(([className, avg]) => (
                  <div key={className} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{className}</span>
                      <span>{avg}/50</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${(avg / 50) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Distribution Card */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Performance Distribution</CardTitle>
            <BarChart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <div>
                {students.length === 0 ? (
                  <p className="text-center text-muted-foreground">No data available</p>
                ) : (
                  <div className="h-60 flex items-end justify-between gap-2">
                    {[0, 10, 20, 30, 40, 50].map(range => {
                      // Count students in this mark range
                      const count = students.filter(
                        student => 
                          student.subjectMarks >= range && 
                          student.subjectMarks < (range + 10)
                      ).length;
                      
                      // Calculate percentage height (max 100%)
                      const percentage = students.length > 0 
                        ? (count / students.length) * 100 
                        : 0;
                      
                      return (
                        <div key={range} className="flex flex-col items-center flex-1">
                          <div 
                            className="w-full bg-primary rounded-t-md" 
                            style={{ height: `${Math.max(percentage * 2, 4)}%` }}
                          ></div>
                          <div className="mt-2 text-xs text-center">
                            {range}-{range + 9}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {count} students
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}