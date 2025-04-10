import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Database, Play, RefreshCw, Save, Trash2, FileText } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface QueryResult {
  data: any[];
  message?: string;
  error?: string;
}

export default function DatabaseManager() {
  const { toast } = useToast();
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM students LIMIT 10;");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedQueries, setSavedQueries] = useState<string[]>([
    "SELECT * FROM students;",
    "SELECT AVG(subject_marks) as average_marks FROM students;",
    "SELECT class, COUNT(*) as student_count FROM students GROUP BY class;",
    "SELECT * FROM students WHERE subject_marks > 40;"
  ]);

  const runQuery = async () => {
    if (!sqlQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter a SQL query",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/db-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sqlQuery }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
        toast({
          title: "Success",
          description: "Query executed successfully",
        });
      } else {
        setResult({ data: [], error: data.message || "Failed to execute query" });
        toast({
          title: "Error",
          description: data.message || "Failed to execute query",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setResult({ data: [], error: error.message || "An error occurred" });
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveQuery = () => {
    if (!sqlQuery.trim()) return;
    if (!savedQueries.includes(sqlQuery)) {
      setSavedQueries([...savedQueries, sqlQuery]);
      toast({
        title: "Success",
        description: "Query saved successfully",
      });
    }
  };

  const loadQuery = (query: string) => {
    setSqlQuery(query);
  };

  const deleteQuery = (index: number) => {
    const newQueries = [...savedQueries];
    newQueries.splice(index, 1);
    setSavedQueries(newQueries);
  };

  const getSampleQueries = () => {
    return [
      "INSERT INTO students (registration_no, name, class, subject_marks) VALUES ('T-22-1234', 'New Student', 'Computer Science', 45);",
      "UPDATE students SET subject_marks = 48 WHERE registration_no = 'T-11-0001';",
      "DELETE FROM students WHERE id = 7;",
      "CREATE TABLE notes (id SERIAL PRIMARY KEY, student_id INTEGER REFERENCES students(id), content TEXT, created_at TIMESTAMP DEFAULT NOW());"
    ];
  };

  const loadSampleQuery = (query: string) => {
    setSqlQuery(query);
  };

  return (
    <div className="py-6 mx-auto px-4 sm:px-6 md:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Database Manager</h1>
        <p className="mt-1 text-sm text-gray-600">
          Execute SQL queries directly against your database
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">SQL Query</CardTitle>
              <Database className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  className="min-h-32 font-mono"
                  placeholder="Enter your SQL query here..."
                />
                
                <div className="flex flex-wrap gap-2">
                  <Button onClick={runQuery} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Run Query
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" onClick={saveQuery}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Query
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {result && (
            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Query Results</CardTitle>
                <Badge variant={result.error ? "destructive" : "outline"}>
                  {result.error ? "Error" : `${result.data.length} rows`}
                </Badge>
              </CardHeader>
              <CardContent>
                {result.error ? (
                  <div className="p-4 bg-red-50 text-red-700 rounded-md">
                    {result.error}
                  </div>
                ) : result.data.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {Object.keys(result.data[0]).map((key) => (
                            <TableHead key={key}>{key}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.data.map((row, i) => (
                          <TableRow key={i}>
                            {Object.values(row).map((value: any, j) => (
                              <TableCell key={j}>
                                {value === null 
                                  ? <span className="text-muted-foreground italic">null</span> 
                                  : typeof value === 'object' 
                                    ? JSON.stringify(value) 
                                    : String(value)}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Query completed successfully. No data returned.
                  </div>
                )}
                
                {result.message && !result.error && (
                  <div className="mt-4 p-2 bg-green-50 text-green-700 rounded">
                    {result.message}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Saved Queries</CardTitle>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {savedQueries.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No saved queries yet</p>
              ) : (
                <ul className="space-y-2">
                  {savedQueries.map((query, index) => (
                    <li key={index} className="p-3 bg-gray-50 rounded-md">
                      <div className="text-sm font-mono truncate">{query}</div>
                      <div className="mt-2 flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => loadQuery(query)}
                        >
                          Load
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteQuery(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Sample Queries</CardTitle>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {getSampleQueries().map((query, index) => (
                  <li key={index} className="p-3 bg-gray-50 rounded-md">
                    <div className="text-sm font-mono truncate">{query}</div>
                    <div className="mt-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => loadSampleQuery(query)}
                      >
                        Load
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}