import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TextToImageTool from './features/generators/TextToImageTool';
import TextToVideoTool from './features/generators/TextToVideoTool';
import ImageToVideoTool from './features/generators/ImageToVideoTool';
import RecentGenerationsPanel from './features/history/RecentGenerationsPanel';
import LoginButton from './features/auth/LoginButton';
import { Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('text-to-image');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/generated/logo.dim_512x256.png" 
              alt="Logo" 
              className="h-8 w-auto"
            />
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Creative Studio</h1>
            </div>
          </div>
          <LoginButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Generator Tools */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="text-to-image" className="text-sm">
                  Text to Image
                </TabsTrigger>
                <TabsTrigger value="text-to-video" className="text-sm">
                  Text to Video
                </TabsTrigger>
                <TabsTrigger value="image-to-video" className="text-sm">
                  Image to Video
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text-to-image" className="mt-0">
                <TextToImageTool />
              </TabsContent>

              <TabsContent value="text-to-video" className="mt-0">
                <TextToVideoTool />
              </TabsContent>

              <TabsContent value="image-to-video" className="mt-0">
                <ImageToVideoTool />
              </TabsContent>
            </Tabs>
          </div>

          {/* History Panel */}
          <div className="lg:col-span-1">
            <RecentGenerationsPanel />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            © {new Date().getFullYear()} · Built with{' '}
            <Heart className="w-4 h-4 text-destructive fill-destructive" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'creative-studio'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
