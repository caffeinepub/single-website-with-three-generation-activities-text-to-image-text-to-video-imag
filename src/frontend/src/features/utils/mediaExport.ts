/**
 * Generate a demo video from text prompt
 */
export async function generateVideo(
  prompt: string,
  duration: number,
  motionStyle: string
): Promise<Blob> {
  // Check MediaRecorder support
  if (!window.MediaRecorder) {
    throw new Error('Video recording is not supported in your browser.');
  }

  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d')!;

  // Generate colors from prompt
  const hash = hashString(prompt);
  const hue1 = hash % 360;
  const hue2 = (hash + 120) % 360;

  const fps = 30;
  const totalFrames = duration * fps;
  let currentFrame = 0;

  // Setup MediaRecorder
  const stream = canvas.captureStream(fps);
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
  });

  const chunks: Blob[] = [];

  return new Promise((resolve, reject) => {
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve(blob);
    };

    mediaRecorder.onerror = (e) => {
      reject(new Error('Failed to record video'));
    };

    mediaRecorder.start();

    // Animation loop
    const animate = () => {
      if (currentFrame >= totalFrames) {
        mediaRecorder.stop();
        return;
      }

      const progress = currentFrame / totalFrames;
      drawAnimatedFrame(ctx, canvas.width, canvas.height, progress, hue1, hue2, motionStyle);

      currentFrame++;
      requestAnimationFrame(animate);
    };

    animate();
  });
}

/**
 * Animate an uploaded image into a video
 */
export async function animateImageToVideo(
  imageDataUrl: string,
  duration: number,
  animationStyle: string
): Promise<Blob> {
  if (!window.MediaRecorder) {
    throw new Error('Video recording is not supported in your browser.');
  }

  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d')!;

  // Load image
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = imageDataUrl;
  });

  const fps = 30;
  const totalFrames = duration * fps;
  let currentFrame = 0;

  const stream = canvas.captureStream(fps);
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
  });

  const chunks: Blob[] = [];

  return new Promise((resolve, reject) => {
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve(blob);
    };

    mediaRecorder.onerror = () => {
      reject(new Error('Failed to record video'));
    };

    mediaRecorder.start();

    const animate = () => {
      if (currentFrame >= totalFrames) {
        mediaRecorder.stop();
        return;
      }

      const progress = currentFrame / totalFrames;
      drawAnimatedImage(ctx, img, canvas.width, canvas.height, progress, animationStyle);

      currentFrame++;
      requestAnimationFrame(animate);
    };

    animate();
  });
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function drawAnimatedFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  hue1: number,
  hue2: number,
  motionStyle: string
) {
  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, `oklch(0.8 0.15 ${hue1 + progress * 60})`);
  gradient.addColorStop(1, `oklch(0.6 0.18 ${hue2 + progress * 60})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Animated elements based on motion style
  switch (motionStyle) {
    case 'smooth':
      drawSmoothMotion(ctx, width, height, progress, hue1);
      break;
    case 'dynamic':
      drawDynamicMotion(ctx, width, height, progress, hue2);
      break;
    case 'pulsing':
      drawPulsingMotion(ctx, width, height, progress, hue1, hue2);
      break;
  }
}

function drawSmoothMotion(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  hue: number
) {
  const x = width * progress;
  const y = height / 2 + Math.sin(progress * Math.PI * 4) * 100;

  ctx.beginPath();
  ctx.arc(x, y, 40, 0, Math.PI * 2);
  ctx.fillStyle = `oklch(0.7 0.25 ${hue})`;
  ctx.fill();
}

function drawDynamicMotion(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  hue: number
) {
  for (let i = 0; i < 5; i++) {
    const offset = i * 0.2;
    const x = ((progress + offset) % 1) * width;
    const y = height / 2 + Math.sin((progress + offset) * Math.PI * 6) * 120;

    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fillStyle = `oklch(0.65 0.22 ${hue + i * 30} / 0.7)`;
    ctx.fill();
  }
}

function drawPulsingMotion(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  hue1: number,
  hue2: number
) {
  const scale = 1 + Math.sin(progress * Math.PI * 8) * 0.3;
  const radius = 80 * scale;

  ctx.beginPath();
  ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
  ctx.fillStyle = `oklch(0.7 0.2 ${hue1 + progress * 120})`;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(width / 2, height / 2, radius * 0.6, 0, Math.PI * 2);
  ctx.fillStyle = `oklch(0.8 0.18 ${hue2 + progress * 120})`;
  ctx.fill();
}

function drawAnimatedImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
  progress: number,
  animationStyle: string
) {
  ctx.clearRect(0, 0, width, height);

  // Calculate aspect ratio
  const imgAspect = img.width / img.height;
  const canvasAspect = width / height;
  let drawWidth = width;
  let drawHeight = height;

  if (imgAspect > canvasAspect) {
    drawHeight = width / imgAspect;
  } else {
    drawWidth = height * imgAspect;
  }

  const offsetX = (width - drawWidth) / 2;
  const offsetY = (height - drawHeight) / 2;

  ctx.save();

  switch (animationStyle) {
    case 'zoom':
      const scale = 1 + progress * 0.5;
      ctx.translate(width / 2, height / 2);
      ctx.scale(scale, scale);
      ctx.translate(-width / 2, -height / 2);
      break;
    case 'pan':
      const panX = -progress * drawWidth * 0.2;
      ctx.translate(panX, 0);
      break;
    case 'rotate':
      ctx.translate(width / 2, height / 2);
      ctx.rotate(progress * Math.PI * 2);
      ctx.translate(-width / 2, -height / 2);
      break;
  }

  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  ctx.restore();
}
