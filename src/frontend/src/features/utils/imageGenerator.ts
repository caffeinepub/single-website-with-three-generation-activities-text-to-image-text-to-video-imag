/**
 * Generate a demo image based on prompt, aspect ratio, and style
 * This is a local browser-based generator using Canvas2D
 */
export async function generateImage(
  prompt: string,
  aspectRatio: string,
  style: string
): Promise<string> {
  return new Promise((resolve) => {
    // Parse aspect ratio
    const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number);
    const baseSize = 512;
    const width = baseSize * widthRatio;
    const height = baseSize * heightRatio;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    // Generate colors based on prompt hash
    const hash = hashString(prompt);
    const hue1 = hash % 360;
    const hue2 = (hash + 120) % 360;
    const hue3 = (hash + 240) % 360;

    // Apply style
    switch (style) {
      case 'abstract':
        drawAbstract(ctx, width, height, hue1, hue2, hue3);
        break;
      case 'geometric':
        drawGeometric(ctx, width, height, hue1, hue2, hue3);
        break;
      case 'gradient':
        drawGradient(ctx, width, height, hue1, hue2);
        break;
      case 'pattern':
        drawPattern(ctx, width, height, hue1, hue2, hue3);
        break;
    }

    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/png');
    resolve(dataUrl);
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

function drawAbstract(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  hue1: number,
  hue2: number,
  hue3: number
) {
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, `oklch(0.85 0.15 ${hue1})`);
  gradient.addColorStop(1, `oklch(0.65 0.18 ${hue2})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Abstract shapes
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 150 + 50;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `oklch(${0.6 + Math.random() * 0.3} 0.2 ${hue3} / 0.3)`;
    ctx.fill();
  }
}

function drawGeometric(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  hue1: number,
  hue2: number,
  hue3: number
) {
  // Background
  ctx.fillStyle = `oklch(0.95 0.05 ${hue1})`;
  ctx.fillRect(0, 0, width, height);

  // Geometric shapes
  const colors = [
    `oklch(0.7 0.2 ${hue1})`,
    `oklch(0.65 0.22 ${hue2})`,
    `oklch(0.6 0.18 ${hue3})`,
  ];

  for (let i = 0; i < 12; i++) {
    ctx.save();
    ctx.translate(Math.random() * width, Math.random() * height);
    ctx.rotate(Math.random() * Math.PI * 2);

    const size = Math.random() * 100 + 40;
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(-size / 2, -size / 2, size, size);
    ctx.restore();
  }
}

function drawGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  hue1: number,
  hue2: number
) {
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
  gradient.addColorStop(0, `oklch(0.85 0.2 ${hue1})`);
  gradient.addColorStop(0.5, `oklch(0.7 0.22 ${(hue1 + hue2) / 2})`);
  gradient.addColorStop(1, `oklch(0.55 0.18 ${hue2})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  hue1: number,
  hue2: number,
  hue3: number
) {
  // Background
  ctx.fillStyle = `oklch(0.9 0.08 ${hue1})`;
  ctx.fillRect(0, 0, width, height);

  // Pattern
  const spacing = 60;
  const colors = [
    `oklch(0.65 0.2 ${hue1})`,
    `oklch(0.6 0.22 ${hue2})`,
    `oklch(0.7 0.18 ${hue3})`,
  ];

  for (let x = 0; x < width; x += spacing) {
    for (let y = 0; y < height; y += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fillStyle = colors[((x + y) / spacing) % colors.length];
      ctx.fill();
    }
  }
}
