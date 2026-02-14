import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetBuildHistory } from './useBuildHistory';
import { Clock, Image, Video, Film, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function RecentGenerationsPanel() {
  const { identity } = useInternetIdentity();
  const { data: history, isLoading } = useGetBuildHistory();

  const getActivityIcon = (artifactUri: string) => {
    if (artifactUri.startsWith('text-to-image')) {
      return <Image className="w-4 h-4 text-primary" />;
    } else if (artifactUri.startsWith('text-to-video')) {
      return <Video className="w-4 h-4 text-primary" />;
    } else if (artifactUri.startsWith('image-to-video')) {
      return <Film className="w-4 h-4 text-primary" />;
    }
    return <Image className="w-4 h-4 text-muted-foreground" />;
  };

  const getActivityType = (artifactUri: string) => {
    if (artifactUri.startsWith('text-to-image')) return 'Text to Image';
    if (artifactUri.startsWith('text-to-video')) return 'Text to Video';
    if (artifactUri.startsWith('image-to-video')) return 'Image to Video';
    return 'Generation';
  };

  const truncatePrompt = (prompt: string, maxLength: number = 60) => {
    if (prompt.length <= maxLength) return prompt;
    return prompt.substring(0, maxLength) + '...';
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Generations
        </CardTitle>
        <CardDescription>Your generation history</CardDescription>
      </CardHeader>
      <CardContent>
        {!identity ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Please login to view your generation history.</p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : !history || history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No generations yet. Start creating!</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getActivityIcon(item.id)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        {getActivityType(item.id)}
                      </p>
                      <p className="text-sm text-foreground mb-2 break-words">
                        {truncatePrompt(item.prompt)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(Number(item.timestamp) / 1000000), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
