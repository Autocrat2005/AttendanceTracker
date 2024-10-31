import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface SubjectCardProps {
  id: string;
  name: string;
  attended: number;
  total: number;
  onAttendanceChange: (id: string, checked: boolean) => void;
  onAddClass: (id: string) => void;
}

export function SubjectCard({
  id,
  name,
  attended,
  total,
  onAttendanceChange,
  onAddClass,
}: SubjectCardProps) {
  const [isChecked, setIsChecked] = useState(false);
  const percentage = total === 0 ? 0 : Math.round((attended / total) * 100);

  const handleCheckChange = (checked: boolean) => {
    setIsChecked(checked);
    onAttendanceChange(id, checked);
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-lg">{name}</h3>
        <div className="text-sm bg-secondary px-2 py-1 rounded-md">
          {attended}/{total}
        </div>
      </div>
      <div className="space-y-4">
        <div className="relative pt-1">
          <Progress value={percentage} className="h-2" />
          <span className="absolute right-0 -top-1 text-xs font-medium">
            {percentage}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id={`attended-${id}`}
              checked={isChecked}
              onCheckedChange={handleCheckChange}
            />
            <label
              htmlFor={`attended-${id}`}
              className="text-sm font-medium"
            >
              Mark Present
            </label>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onAddClass(id);
              setIsChecked(false);
            }}
            className="ml-auto"
          >
            Add Class
          </Button>
        </div>
      </div>
    </Card>
  );
}