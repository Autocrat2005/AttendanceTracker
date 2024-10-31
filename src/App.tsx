import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Plus, GraduationCap, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { SubjectCard } from '@/components/SubjectCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThemeProvider } from '@/components/ThemeProvider';
import { DateTime } from '@/components/DateTime';

interface Subject {
  id: string;
  name: string;
  attended: number;
  total: number;
}

// API functions
const fetchSubjects = async (): Promise<Subject[]> => {
  const { data } = await axios.get('/api/subjects');
  return data;
};

const addSubjectApi = async (subject: Omit<Subject, 'id'>): Promise<Subject> => {
  const { data } = await axios.post('/api/subjects', subject);
  return data;
};

const updateSubjectApi = async (subject: Subject): Promise<Subject> => {
  const { data } = await axios.put(`/api/subjects/${subject.id}`, subject);
  return data;
};

const resetSubjectsApi = async (): Promise<void> => {
  await axios.delete('/api/subjects');
};

function App() {
  const [newSubject, setNewSubject] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: subjects = [], isLoading } = useQuery<Subject[]>(['subjects'], fetchSubjects);

  const addSubjectMutation = useMutation(addSubjectApi, {
    onSuccess: () => {
      queryClient.invalidateQueries(['subjects']);
    },
  });

  const updateSubjectMutation = useMutation(updateSubjectApi, {
    onSuccess: () => {
      queryClient.invalidateQueries(['subjects']);
    },
  });

  const resetDataMutation = useMutation(resetSubjectsApi, {
    onSuccess: () => {
      queryClient.invalidateQueries(['subjects']);
    },
  });

  const addSubject = () => {
    if (newSubject.trim()) {
      addSubjectMutation.mutate({ name: newSubject, attended: 0, total: 0 });
      setNewSubject('');
      setDialogOpen(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addSubject();
    }
  };

  const updateAttendance = (id: string, checked: boolean) => {
    const subject = subjects.find(s => s.id === id);
    if (subject) {
      const updatedSubject = {
        ...subject,
        attended: checked
          ? Math.min(subject.attended + 1, subject.total)
          : Math.max(subject.attended - 1, 0),
      };
      updateSubjectMutation.mutate(updatedSubject);
    }
  };

  const addClassToSubject = (id: string) => {
    const subject = subjects.find(s => s.id === id);
    if (subject) {
      const updatedSubject = {
        ...subject,
        total: subject.total + 1,
      };
      updateSubjectMutation.mutate(updatedSubject);
    }
  };

  const resetData = () => {
    resetDataMutation.mutate();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-background transition-colors duration-300">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center mb-8">
            <DateTime />
          </div>
          
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Attendance Tracker</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={resetData}
                className="h-9 w-9"
                title="Reset Data"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <ThemeToggle />
            </div>
          </header>

          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Your Subjects</h2>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Subject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Subject</DialogTitle>
                  </DialogHeader>
                  <div className="flex gap-2">
                    <Input
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter subject name"
                    />
                    <Button onClick={addSubject}>Add</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {subjects.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No subjects added yet. Click "Add Subject" to get started.
              </div>
            ) : (
              <div className="grid gap-4">
                {subjects.map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    {...subject}
                    onAttendanceChange={updateAttendance}
                    onAddClass={addClassToSubject}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;