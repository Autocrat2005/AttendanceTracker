import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';

export function DateTime() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="inline-flex items-center gap-6 px-4 py-2 bg-secondary/50 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-sm">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span>{date.toLocaleDateString('en-US', { 
          weekday: 'short',
          month: 'short', 
          day: 'numeric'
        })}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span>{date.toLocaleTimeString('en-US', { 
          hour: '2-digit',
          minute: '2-digit'
        })}</span>
      </div>
    </Card>
  );
}