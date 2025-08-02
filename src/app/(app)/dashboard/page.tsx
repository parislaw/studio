'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle2, Flame, Loader2, ShieldAlert, Upload } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { MOCK_CURRENT_USER } from '@/lib/mock-data';
import { submitStep } from './actions';
import { cn } from '@/lib/utils';
import type { DailyProgress } from '@/types';

type SubmissionResult = {
  error?: string;
  stepCount?: number;
  fraudProbability?: number;
  isManipulated?: boolean;
  explanation?: string;
};

const STEP_COLORS = {
    GOAL_MET: 'bg-green-500',
    GOAL_NOT_MET: 'bg-orange-400',
    NO_DATA: 'bg-muted/50',
};

function getStepColor(steps: number | null) {
    if (steps === null) return STEP_COLORS.NO_DATA;
    if (steps >= 10000) return STEP_COLORS.GOAL_MET;
    return STEP_COLORS.GOAL_NOT_MET;
}

export default function DashboardPage() {
  const { toast } = useToast();
  const [userProgress, setUserProgress] = useState<DailyProgress[]>(MOCK_CURRENT_USER.progress);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);

  const daysCompleted = userProgress.filter(p => p.goalMet).length;
  const currentStreak = userProgress.reduce((acc, day) => (day.goalMet ? acc + 1 : 0), 0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setSubmissionResult(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile || !previewUrl) {
      toast({
        variant: 'destructive',
        title: 'No image selected',
        description: 'Please select an image to upload.',
      });
      return;
    }

    setIsLoading(true);
    setSubmissionResult(null);

    try {
      const result = await submitStep(previewUrl);
      setSubmissionResult(result);
      if (result.error) {
        toast({ variant: 'destructive', title: 'Submission Failed', description: result.error });
      } else {
        toast({ title: 'Submission Successful', description: `Verified ${result.stepCount?.toLocaleString()} steps.` });
        
        const today = new Date().getDate(); // Simplified for mock data
        const updatedProgress = userProgress.map(p =>
          p.day === today ? { ...p, steps: result.stepCount, goalMet: (result.stepCount || 0) >= 10000 } : p
        );
        setUserProgress(updatedProgress);
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'An unexpected error occurred.', description: 'Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Submit Today's Steps</CardTitle>
            <CardDescription>Upload a screenshot of your step count for today.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="step-image">Step Count Image</Label>
              <Input id="step-image" type="file" accept="image/*" onChange={handleFileChange} className="file:text-primary file:font-semibold" />
            </div>
            {previewUrl && (
              <div className="relative aspect-video w-full rounded-md overflow-hidden border">
                <Image src={previewUrl} alt="Step count preview" fill className="object-contain" />
              </div>
            )}
            {submissionResult && !submissionResult.error && (
               <div className="text-sm p-3 bg-green-500/10 text-green-700 dark:text-green-300 rounded-md">
                <p><strong>Steps Verified:</strong> {submissionResult.stepCount?.toLocaleString()}</p>
                <p><strong>Fraud Probability:</strong> {(submissionResult.fraudProbability! * 100).toFixed(1)}%</p>
               </div>
            )}
            {submissionResult?.isManipulated && (
                <div className="text-sm p-3 bg-destructive/10 text-destructive rounded-md flex gap-2 items-start">
                    <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0" />
                    <div>
                        <p className="font-semibold">Manipulation Detected</p>
                        <p className="text-destructive/80">{submissionResult.explanation}</p>
                    </div>
                </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading || !selectedFile}>
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2" />}
              Verify & Submit
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Your 30-Day Progress</CardTitle>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
             <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <span>{currentStreak} Day Streak</span>
            </div>
            <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>{daysCompleted} / 30 Days Goal Met</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={(daysCompleted / 30) * 100} className="mb-6" />
          <TooltipProvider delayDuration={100}>
            <div className="grid grid-cols-6 gap-2 md:gap-3">
              {userProgress.map((day) => (
                <Tooltip key={day.day}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        'aspect-square rounded-md flex items-center justify-center border-transparent border',
                        getStepColor(day.steps),
                        'transition-all hover:scale-105 hover:shadow-md hover:border-primary'
                      )}
                    >
                        <span className="text-sm font-medium text-white mix-blend-difference">{day.day}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">Day {day.day} ({day.date})</p>
                    {day.steps !== null ? (
                      <p>{day.steps.toLocaleString()} steps</p>
                    ) : (
                      <p>No submission</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
}
