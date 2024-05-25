const imageMimeTypes = [
  'image/jpeg',
  // 'image/jpg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp',
  'image/svg+xml',
];

const videoMimeTypes = [
  'video/mp4',
  'video/mpeg',
  'video/quicktime',
  'video/webm',
  'video/x-ms-wmv',
  'video/x-msvideo',
  'video/3gpp',
  'video/3gpp2',
];

export const allMediaMimeTypes = [...imageMimeTypes, ...videoMimeTypes];
