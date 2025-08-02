
'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllUsers } from '@/lib/db';
import { MOCK_CURRENT_USER } from '@/lib/mock-data';
import type { User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { handleAdminUpdate } from './actions';
import { AlertCircle, Edit } from 'lucide-react';

export default function AdminPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      const allUsers = await getAllUsers();
      setUsers(allUsers);
      setIsLoading(false);
    }
    fetchUsers();
  }, []);

  // Basic authorization check
  if (!MOCK_CURRENT_USER.isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="text-destructive" />
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>You do not have permission to view this page.</p>
        </CardContent>
      </Card>
    );
  }

  const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const result = await handleAdminUpdate(formData);

    if (result.success) {
        toast({ title: "Success", description: result.message });
        const allUsers = await getAllUsers(); // Re-fetch users
        setUsers(allUsers);
        setIsDialogOpen(false); // Close dialog on success
    } else {
        toast({ variant: 'destructive', title: "Error", description: result.message });
    }

    setIsSubmitting(false);
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            View all users and manually edit their step entries if needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Total Steps</TableHead>
                <TableHead>Goals Met</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} data-ai-hint="person avatar" />
                        <AvatarFallback>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p>{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-muted-foreground">{user.isAdmin ? 'Admin' : 'Participant'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.progress.reduce((acc, p) => acc + (p.steps || 0), 0).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {user.progress.filter((p) => p.goalMet).length} / 30
                  </TableCell>
                  <TableCell className="text-right">
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Steps
                      </Button>
                    </DialogTrigger>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedUser && (
         <DialogContent>
            <form onSubmit={onFormSubmit}>
              <DialogHeader>
                <DialogTitle>Edit Steps for {selectedUser.firstName} {selectedUser.lastName}</DialogTitle>
                <DialogDescription>
                  Select a day and enter the new step count. This action will override the existing value.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <input type="hidden" name="userId" value={selectedUser.id} />
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="day" className="text-right">
                    Day
                  </Label>
                  <Select name="day" required>
                      <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a day..." />
                      </SelectTrigger>
                      <SelectContent>
                          {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                              <SelectItem key={day} value={String(day)}>
                                  Day {day} ({selectedUser.progress.find(p => p.day === day)?.date})
                              </SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="steps" className="text-right">
                    Steps
                  </Label>
                  <Input
                    id="steps"
                    name="steps"
                    type="number"
                    className="col-span-3"
                    placeholder="e.g., 12500"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
         </DialogContent>
      )}
    </Dialog>
  );
}
