"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Trash2, Upload } from "lucide-react";
import type { ProjectImage } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function GalleryEditor({
  projectId,
  images: initialImages,
}: {
  projectId: string;
  images: ProjectImage[];
}) {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        toast.error(uploadData.error ?? "Upload failed");
        return;
      }

      const res = await fetch(`/api/admin/projects/${projectId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: uploadData.url, alt: "", order: images.length }),
      });
      const image = await res.json();
      if (res.ok) {
        setImages([...images, image]);
      } else {
        toast.error("Failed to save image");
      }
    } finally {
      setUploading(false);
    }
  }

  async function updateAlt(imageId: string, alt: string) {
    setImages((prev) => prev.map((img) => (img.id === imageId ? { ...img, alt } : img)));
  }

  async function removeImage(imageId: string) {
    const res = await fetch(`/api/admin/projects/${projectId}/images/${imageId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success("Image removed");
    } else {
      toast.error("Failed to remove image");
    }
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {images.map((image) => (
          <div key={image.id} className="overflow-hidden rounded-lg border border-border">
            <div className="relative aspect-video bg-surface">
              <Image src={image.url} alt={image.alt} fill className="object-cover" />
            </div>
            <div className="space-y-2 p-2">
              <Input
                placeholder="Alt text"
                defaultValue={image.alt}
                onBlur={(e) => updateAlt(image.id, e.target.value)}
                className="h-8 text-xs"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full text-red-400 hover:text-red-300"
                onClick={() => removeImage(image.id)}
              >
                <Trash2 className="size-3.5" />
                Remove
              </Button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-video flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"
        >
          {uploading ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
          <span className="text-xs">Add image</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
