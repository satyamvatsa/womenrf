import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const bucket = process.env.S3_BUCKET_NAME || process.env.AWS_S3_BUCKET_NAME || '';
const region = process.env.S3_REGION || process.env.AWS_S3_REGION || 'ap-south-1';
const accessKeyId = process.env.S3_ACCESS_KEY_ID || process.env.AWS_S3_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || process.env.AWS_S3_SECRET_ACCESS_KEY || '';

let _client: S3Client | null = null;

export function isS3Configured(): boolean {
  return !!(bucket && accessKeyId && secretAccessKey);
}

function getClient(): S3Client {
  if (!_client) {
    _client = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return _client;
}

const CONTENT_TYPE_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

function getContentType(filename: string): string {
  const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
  return CONTENT_TYPE_MAP[ext] || 'application/octet-stream';
}

/**
 * Upload a file buffer to S3.
 * @param key - The S3 object key (e.g. "uploads/partners/logo-123.svg")
 * @param body - The file contents as a Buffer
 * @param filename - Original filename (used to detect content type)
 * @returns The public URL of the uploaded object
 */
export async function uploadToS3(key: string, body: Buffer, filename: string): Promise<string> {
  const client = getClient();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: getContentType(filename),
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );

  // If a custom CDN/CloudFront domain is set, use that; otherwise use the default S3 URL
  const cdnDomain = process.env.S3_CDN_DOMAIN || process.env.AWS_S3_CDN_DOMAIN;
  if (cdnDomain) {
    return `https://${cdnDomain}/${key}`;
  }
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}
