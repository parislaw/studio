'use client';

import { getLeaderboardData } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { CheckCircle2, Footprints } from 'lucide-react';
import { useState } from 'react';

const STEP_TIERS = {
    '15000': 'bg-green-600 dark:bg-green-500',
    '10000': 'bg-green-500 dark:bg-green-400',
    '5000': 'bg-green-400 dark:bg-green-300',
    '1': 'bg-green-300 dark:bg-green-200',
    '0': 'bg-muted/50',
};

function getStepTier(steps: number | null) {
  if (steps === null) return STEP_TIERS['0'];
  if (steps >= 15000) return STEP_TIERS['15000'];
  if (steps >= 10000) return STEP_TIERS['10000'];
  if (steps >= 5000) return STEP_TIERS['5000'];
  if (steps > 0) return STEP_TIERS['1'];
  return STEP_TIERS['0'];
}

export default function LeaderboardPage() {
  const [leaderboardData] = useState(getLeaderboardData());
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Steaks</CardTitle>
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
                    {user.progress.map((day) => (
                        <Tooltip key={`${user.id}-${day.day}`}>
                        <TooltipTrigger asChild>
                            <div
                                className={cn(
                                    'aspect-square rounded-sm flex items-center justify-center border-transparent border transition-all hover:scale-110 hover:border-primary',
                                    getStepTier(day.steps)
                                )}
                            >
                                {day.goalMet && <CheckCircle2 className="h-4 w-4 text-white/80" />}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="font-semibold">{user.name} - Day {day.day}</p>
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
                    ))}
                </TooltipProvider>

              </React.Fragment>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
