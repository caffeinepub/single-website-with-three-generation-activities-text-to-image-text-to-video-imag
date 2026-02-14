import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Download, Upload, Film } from 'lucide-react';
import { useRecordBuild } from '../history/useBuildHistory';
import { downloadFile } from '../utils/download';
import { animateImageToVideo } from '../utils/mediaExport';

export default function ImageToVideoTool() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [duration, setDuration] = useState('3');
  const [animationStyle, setAnimationStyle] = useState('zoom');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const recordBuild = useRecordBuild();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setError(null);
        setGeneratedVideo(null);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please upload a valid image file.');
    }
  };

  const handleGenerate = async () => {
    if (!uploadedImage) {
      setError('Please upload an image first.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedVideo(null);

    try {
      const videoBlob = await animateImageToVideo(uploadedImage, parseInt(duration), animationStyle);
      const videoUrl = URL.createObjectURL(videoBlob);
      setGeneratedVideo(videoUrl);

      // Record to history
      const artifactUri = `image-to-video_${Date.now()}.webm`;
      const prompt = `Animated image with ${animationStyle} effect`;
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
      downloadFile(generatedVideo, `animated-video-${Date.now()}.webm`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Film className="w-5 h-5" />
          Image to Video
        </CardTitle>
        <CardDescription>Animate your images into videos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Section */}
        <div className="space-y-2">
          <Label>Upload Image</Label>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full gap-2"
            >
              <Upload className="w-4 h-4" />
              Choose Image
            </Button>
          </div>
        </div>

        {/* Image Preview */}
        {uploadedImage && (
          <div className="relative rounded-lg overflow-hidden border border-border bg-muted">
            <img src={uploadedImage} alt="Uploaded" className="w-full h-auto" />
          </div>
        )}

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="video-duration">Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger id="video-duration">
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
            <Label htmlFor="animation-style">Animation Style</Label>
            <Select value={animationStyle} onValueChange={setAnimationStyle}>
              <SelectTrigger id="animation-style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zoom">Zoom In</SelectItem>
                <SelectItem value="pan">Pan</SelectItem>
                <SelectItem value="rotate">Rotate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Generate Button */}
        <Button onClick={handleGenerate} disabled={isGenerating || !uploadedImage} className="w-full">
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

        {/* Video Preview */}
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
