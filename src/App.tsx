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
    { id: '1', name: 'Mathematics', attended: 0, total: 1 },
    { id: '2', name: 'Physics', attended: 0, total: 1 },
    { id: '3', name: 'C', attended: 0, total: 1 },
    { id: '4', name: 'EP', attended: 0, total: 1 },
    { id: '5', name: 'EVS', attended: 0, total: 1 },
    { id: '6', name: 'English/Finance', attended: 0, total: 1 },
  ]);
  const [newSubject, setNewSubject] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [studentId, setStudentId] = useState(''); // State for student ID
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status

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

  const updateAttendance = async (id: string, checked: boolean) => {
    const updatedSubjects = subjects.map((subject) =>
      subject.id === id
        ? { ...subject, attended: checked ? subject.attended + 1 : subject.attended - 1 }
        : subject
    );
    setSubjects(updatedSubjects);

    // Send the updated attendance to the backend
    await fetch('http://localhost:5000/attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentId,
        subjectId: id,
        attended: updatedSubjects.find((subject) => subject.id === id)?.attended,
        total: updatedSubjects.find((subject) => subject.id === id)?.total,
      }),
    });
  };

  const handleLogin = () => {
    if (studentId.trim()) {
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <div>
        <h2>Login</h2>
        <Input
          type="text"
          placeholder="Enter your student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <Button onClick={handleLogin}>Login</Button>
      </div>
    );
  }

  return (
    <div>
      <ThemeProvider>
        <ThemeToggle />
        <DateTime />
        <Button onClick={() => setDialogOpen(true)}>
          <Plus /> Add Subject
        </Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus /> Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new subject</DialogTitle>
            </DialogHeader>
            <Input
              type="text"
              placeholder="Subject name"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button onClick={addSubject}>Add</Button>
          </DialogContent>
        </Dialog>
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            updateAttendance={updateAttendance}
          />
        ))}
      </ThemeProvider>
    </div>
  );
}

export default App;