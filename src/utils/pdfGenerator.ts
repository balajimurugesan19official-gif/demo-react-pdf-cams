export const generateMockPDFBlob = (): Blob => {
  const canvas = document.createElement('canvas');
  canvas.width = 595;
  canvas.height = 842;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('Bank Account Application Form', 150, 100);

  ctx.fillStyle = '#334155';
  ctx.font = '14px sans-serif';
  ctx.fillText('Full Name:', 50, 180);
  ctx.strokeStyle = '#cbd5e1';
  ctx.strokeRect(150, 165, 300, 30);
  ctx.fillStyle = '#000000';
  ctx.font = '12px sans-serif';
  ctx.fillText('John Michael Doe', 160, 185);

  ctx.fillStyle = '#334155';
  ctx.font = '14px sans-serif';
  ctx.fillText('Account Number:', 50, 240);
  ctx.strokeStyle = '#cbd5e1';
  ctx.strokeRect(150, 225, 250, 30);
  ctx.fillStyle = '#000000';
  ctx.font = '12px sans-serif';
  ctx.fillText('1234567890', 160, 245);

  ctx.fillStyle = '#334155';
  ctx.font = '14px sans-serif';
  ctx.fillText('Email Address:', 50, 300);
  ctx.strokeStyle = '#cbd5e1';
  ctx.strokeRect(150, 285, 300, 30);
  ctx.fillStyle = '#000000';
  ctx.font = '12px sans-serif';
  ctx.fillText('john.doe@example.com', 160, 305);

  ctx.fillStyle = '#334155';
  ctx.font = '14px sans-serif';
  ctx.fillText('Date of Birth:', 50, 360);
  ctx.strokeStyle = '#cbd5e1';
  ctx.strokeRect(150, 345, 200, 30);
  ctx.fillStyle = '#000000';
  ctx.font = '12px sans-serif';
  ctx.fillText('1990-05-15', 160, 365);

  ctx.fillStyle = '#334155';
  ctx.font = '14px sans-serif';
  ctx.fillText('Branch Code:', 50, 420);
  ctx.strokeStyle = '#cbd5e1';
  ctx.strokeRect(150, 405, 180, 30);
  ctx.fillStyle = '#000000';
  ctx.font = '12px sans-serif';
  ctx.fillText('BR-12345', 160, 425);

  ctx.fillStyle = '#334155';
  ctx.font = '14px sans-serif';
  ctx.fillText('Phone Number:', 50, 480);
  ctx.strokeStyle = '#cbd5e1';
  ctx.strokeRect(150, 465, 220, 30);
  ctx.fillStyle = '#000000';
  ctx.font = '12px sans-serif';
  ctx.fillText('+1-555-123-4567', 160, 485);

  ctx.fillStyle = '#334155';
  ctx.font = '14px sans-serif';
  ctx.fillText('Terms & Conditions:', 50, 540);
  ctx.strokeStyle = '#cbd5e1';
  ctx.strokeRect(150, 525, 20, 20);
  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('✓', 154, 542);

  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      }
    }, 'image/png');
  }) as any;
};
