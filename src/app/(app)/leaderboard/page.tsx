import { getLeaderboardData } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Flame, Award, TrendingUp, Footprints } from 'lucide-react';

export default function LeaderboardPage() {
  const leaderboardData = getLeaderboardData();

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Award className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Award className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-700" />;
    return <span className="font-mono text-muted-foreground">{rank}</span>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Leaderboard</CardTitle>
        <CardDescription>See how you stack up against the competition. Keep stepping!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[50px] text-center">Rank</TableHead>
                <TableHead>Participant</TableHead>
                <TableHead className="text-right">Today's Steps</TableHead>
                <TableHead className="text-right">Total Steps</TableHead>
                <TableHead className="text-right">Best Streak</TableHead>
                <TableHead className="w-[320px] hidden lg:table-cell pl-8">30-Day Progress</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {leaderboardData.map((user, index) => (
                <TableRow key={user.id}>
                    <TableCell className="text-center font-medium">{getRankBadge(index + 1)}</TableCell>
                    <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person avatar"/>
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                    </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                        <div className="flex items-center justify-end gap-2">
                            <Footprints className="h-4 w-4 text-primary" />
                            {user.todaysSteps.toLocaleString()}
                        </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                        <div className="flex items-center justify-end gap-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            {user.totalSteps.toLocaleString()}
                        </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                        <div className="flex items-center justify-end gap-2">
                            <Flame className="h-4 w-4 text-orange-500"/>
                            {user.streak} days
                        </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell pl-8">
                    <TooltipProvider delayDuration={100}>
                        <div className="grid grid-cols-15 gap-1 w-fit">
                        {user.progress.slice(0, 30).map(day => (
                            <Tooltip key={day.day}>
                            <TooltipTrigger asChild>
                                <div className={cn(
                                'h-3 w-3 rounded-full',
                                day.goalMet ? 'bg-accent' : (day.steps ? 'bg-secondary' : 'bg-muted/50')
                                )} />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Day {day.day}: {day.steps?.toLocaleString() ?? 'N/A'} steps</p>
                            </TooltipContent>
                            </Tooltip>
                        ))}
                        </div>
                    </TooltipProvider>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
