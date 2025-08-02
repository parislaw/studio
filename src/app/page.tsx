import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Footprints, Target } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <Footprints className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">StepTracker30</h1>
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative pt-16 pb-24 sm:pt-24 sm:pb-32">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-blue-50 dark:from-background dark:to-blue-950/20 opacity-50"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-headline">
                  Join the 30-Day
                  <br />
                  <span className="text-primary">Step Challenge</span>
                </h2>
                <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                  Track your daily steps, compete with the community, and build a healthy habit. All powered by AI to ensure fair play.
                </p>
                <div className="mt-10 flex items-center justify-center lg:justify-start gap-4">
                  <Button size="lg" asChild>
                    <Link href="/register">
                      Start Your Challenge
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="https://placehold.co/600x400.png"
                  alt="A person tracking their steps on a phone"
                  width={600}
                  height={400}
                  className="rounded-xl shadow-2xl"
                  data-ai-hint="fitness tracking app"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">How It Works</h3>
              <p className="mt-4 text-lg text-muted-foreground">A simple and motivating way to reach your fitness goals.</p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="items-center text-center">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Footprints className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>1. Upload Daily Steps</CardTitle>
                  <CardDescription>Submit a picture of your step count from your fitness tracker each day.</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="items-center text-center">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary"><path d="M12 10V22"/><path d="M10.44 12.25a2.5 2.5 0 1 0-4.88 1.5"/><path d="M4.3 10.1a2.5 2.5 0 0 0 3.93 2.56"/><path d="M15.25 15.68a2.5 2.5 0 1 0 1.5-4.88"/><path d="M17.9 13.7a2.5 2.5 0 0 0 2.56 3.93"/><path d="M12 2a4 4 0 0 0-4 4v2.4a.5.5 0 0 0 .3.45l4 2a.5.5 0 0 0 .4 0l4-2a.5.5 0 0 0 .3-.45V6a4 4 0 0 0-4-4Z"/></svg>
                  </div>
                  <CardTitle>2. AI-Powered Verification</CardTitle>
                  <CardDescription>Our AI analyzes your image to verify the step count and check for manipulation.</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="items-center text-center">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>3. Track & Compete</CardTitle>
                  <CardDescription>View your progress on a personal dashboard and see how you stack up on the community leaderboard.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} StepTracker30. All rights reserved.</p>
      </footer>
    </div>
  );
}
