import { useState } from 'react';
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

function App() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: 'Mathematics', attended: 12, total: 15 },
    { id: '2', name: 'Physics', attended: 8, total: 10 },
    { id: '3', name: 'Computer Science', attended: 14, total: 15 },
  ]);
  const [newSubject, setNewSubject] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const addSubject = () => {
    if (newSubject.trim()) {
      setSubjects([
        ...subjects,
        { id: Date.now().toString(), name: newSubject, attended: 0, total: 0 },
      ]);
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
    setSubjects(
      subjects.map((subject) =>
        subject.id === id
          ? {
              ...subject,
              attended: checked
                ? Math.min(subject.attended + 1, subject.total)
                : Math.max(subject.attended - 1, 0),
            }
          : subject
      )
    );
  };

  const addClassToSubject = (id: string) => {
    setSubjects(
      subjects.map((subject) =>
        subject.id === id
          ? { ...subject, total: subject.total + 1 }
          : subject
      )
    );
  };

  const resetData = () => {
    setSubjects([]);
  };

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