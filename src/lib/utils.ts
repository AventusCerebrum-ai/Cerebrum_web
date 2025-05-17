import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabaseAdmin } from "./supabase"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Uploads a file to Supabase Storage and returns the public URL.
 * @param file The file to upload
 * @param bucket The storage bucket name
 * @returns The public URL string or null if failed
 */
export async function uploadFileToSupabase(file: File, bucket: string): Promise<string | null> {
  const filePath = `${Date.now()}_${file.name}`;
  const { error } = await supabaseAdmin.storage.from(bucket).upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) {
    return null;
  }
  const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);
  return urlData?.publicUrl || null;
}
