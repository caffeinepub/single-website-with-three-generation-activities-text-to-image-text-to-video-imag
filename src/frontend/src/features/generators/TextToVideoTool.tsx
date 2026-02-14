import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Download, Video } from 'lucide-react';
import { useRecordBuild } from '../history/useBuildHistory';
import { downloadFile } from '../utils/download';
import { generateVideo } from '../utils/mediaExport';

export default function TextToVideoTool() {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState('3');
  const [motionStyle, setMotionStyle] = useState('smooth');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recordBuild = useRecordBuild();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate a video.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedVideo(null);

    try {
      const videoBlob = await generateVideo(prompt, parseInt(duration), motionStyle);
      const videoUrl = URL.createObjectURL(videoBlob);
      setGeneratedVideo(videoUrl);

      // Record to history
      const artifactUri = `text-to-video_${Date.now()}.webm`;
      recordBuild.mutate({ prompt, artifactUri });
    } catch (err: any) {
      setError(err.message || 'Failed to generate video. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedVideo) {
      downloadFile(generatedVideo, `generated-video-${Date.now()}.webm`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="w-5 h-5" />
          Text to Video
        </CardTitle>
        <CardDescription>Generate animated videos from text descriptions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Prompt Input */}
        <div className="space-y-2">
          <Label htmlFor="video-prompt">Prompt</Label>
          <Textarea
            id="video-prompt"
            placeholder="Describe the animation you want to create..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger id="duration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 seconds</SelectItem>
                <SelectItem value="3">3 seconds</SelectItem>
                <SelectItem value="5">5 seconds</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="motion-style">Motion Style</Label>
            <Select value={motionStyle} onValueChange={setMotionStyle}>
              <SelectTrigger id="motion-style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="smooth">Smooth</SelectItem>
                <SelectItem value="dynamic">Dynamic</SelectItem>
                <SelectItem value="pulsing">Pulsing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Generate Button */}
        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Video'
          )}
        </Button>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Preview */}
        {generatedVideo && (
          <div className="space-y-3">
            <div className="relative rounded-lg overflow-hidden border border-border bg-muted">
              <video src={generatedVideo} controls className="w-full h-auto" />
            </div>
            <Button onClick={handleDownload} variant="outline" className="w-full gap-2">
              <Download className="w-4 h-4" />
              Download Video
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
