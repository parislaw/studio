'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Footprints } from 'lucide-react';
import { getAllUsers } from '@/lib/db';
import type { User } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const STEP_COLORS = {
  MOST_STEPS: 'bg-blue-500 hover:bg-blue-600',
  GOAL_MET: 'bg-green-500 hover:bg-green-600',
  GOAL_NOT_MET: 'bg-orange-400 hover:bg-orange-500',
  NO_DATA: 'bg-muted/50',
};

function getStepColor(
  steps: number | null,
  isMax: boolean
) {
  if (steps === null) return STEP_COLORS.NO_DATA;
  if (isMax) return STEP_COLORS.MOST_STEPS;
  if (steps >= 10000) return STEP_COLORS.GOAL_MET;
  return STEP_COLORS.GOAL_NOT_MET;
}

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  useEffect(() => {
    async function fetchLeaderboard() {
      setIsLoading(true);
      const users = await getAllUsers();
      const sortedUsers = users.sort((a, b) => {
        const totalStepsA = a.progress.reduce((acc, p) => acc + (p.steps || 0), 0);
        const totalStepsB = b.progress.reduce((acc, p) => acc + (p.steps || 0), 0);
        return totalStepsB - totalStepsA;
      });
      setLeaderboardData(sortedUsers);
      setIsLoading(false);
    }
    fetchLeaderboard();
  }, []);

  const maxStepsPerDay = useMemo(() => {
    const maxSteps: (number | null)[] = Array(30).fill(null);
    days.forEach(day => {
      let max = 0;
      leaderboardData.forEach(user => {
        const dayProgress = user.progress.find(p => p.day === day);
        if (dayProgress && dayProgress.steps && dayProgress.steps > max) {
          max = dayProgress.steps;
        }
      });
      if (max > 0) {
        maxSteps[day - 1] = max;
      }
    });
    return maxSteps;
  }, [leaderboardData, days]);

  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-64 w-full" />
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Streaks</CardTitle>
        <CardDescription>See everyone's 30-day step journey. Can you keep up the heat?</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="grid gap-x-1 gap-y-2" style={{ gridTemplateColumns: 'minmax(150px, 1fr) repeat(30, minmax(32px, 1fr))' }}>
            {/* Header Row */}
            <div className="sticky left-0 bg-card font-semibold text-sm flex items-end pl-2">Participant</div>
            {days.map(day => (
              <div key={`header-${day}`} className="text-center text-xs text-muted-foreground font-mono">{day}</div>
            ))}

            {/* User Rows */}
            {leaderboardData.map((user) => (
              <React.Fragment key={user.id}>
                <div className="sticky left-0 bg-card flex items-center gap-2 py-1 pl-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person avatar" />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm truncate">{user.name}</span>
                </div>
                
                <TooltipProvider delayDuration={100}>
                    {user.progress.map((day) => {
                       const maxForDay = maxStepsPerDay[day.day - 1];
                       const isMax = !!(day.steps && maxForDay && day.steps === maxForDay && day.steps > 0);

                       return (
                        <Tooltip key={`${user.id}-${day.day}`}>
                        <TooltipTrigger asChild>
                            <div
                                className={cn(
                                    'aspect-square rounded-sm flex items-center justify-center border-transparent border transition-all hover:scale-110 hover:border-primary',
                                    getStepColor(day.steps, isMax)
                                )}
                            >
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="font-semibold">{user.name} - Day {day.day} ({day.date})</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Footprints className="h-4 w-4 text-muted-foreground"/>
                                {day.steps !== null ? (
                                    <span>{day.steps.toLocaleString()} steps</span>
                                ) : (
                                    <span>No submission</span>
                                )}
                            </div>
                        </TooltipContent>
                        </Tooltip>
                       )
                    })}
                </TooltipProvider>

              </React.Fragment>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
