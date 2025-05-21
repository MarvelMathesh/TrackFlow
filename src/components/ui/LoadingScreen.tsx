import { Circle as CircleBolt } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center">
        <CircleBolt className="h-12 w-12 text-primary animate-pulse" />
        <h1 className="text-xl font-semibold mt-4">Loading TrackFlow...</h1>
      </div>
    </div>
  );
}