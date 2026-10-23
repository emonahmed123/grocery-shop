"use client";

import { ImagePlus, Link2, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useId, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { useImageUpload } from "@/hooks/useImageUpload";
import { UPLOAD_IMAGE_TYPES } from "@/lib/imageUpload";
import { cn } from "@/lib/utils";

type ImageInputProps = {
  label: string;
  /** Saved image links, in order. */
  value: string[];
  /** Gets an update to apply to the latest links, so an upload that ends later never drops a newer change. */
  onChange: (update: (current: string[]) => string[]) => void;
  /** 1 means a single image that a new one replaces. */
  max?: number;
  error?: string | null;
  hint?: string;
  /** Tells the form an upload is running, so it can wait before saving. */
  onBusyChange?: (busy: boolean) => void;
  onBlur?: () => void;
};

const isWebUrl = (value: string) => /^https?:\/\//i.test(value) && URL.canParse(value);

/**
 * An image from a link or from the computer. Uploaded files go to imgbb
 * first; only the live link they get there is kept, same as a pasted link.
 */
const ImageInput = ({ label, value, onChange, max = 1, error, hint, onBusyChange, onBlur }: ImageInputProps) => {
  const id = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { upload, pending, isUploading } = useImageUpload(onBusyChange);

  const single = max === 1;
  const room = single ? 1 : max - value.length;
  const isFull = !single && room <= 0;

  // A single image is replaced; a list grows up to `max`, without repeats.
  const add = (urls: string[]) => {
    if (urls.length === 0) return;
    onChange((current) => (single ? urls.slice(-1) : [...new Set([...current, ...urls])].slice(0, max)));
    onBlur?.();
  };

  const uploadFiles = async (files: File[]) => {
    const images = files.filter((file) => file.type.startsWith("image/"));
    if (images.length < files.length) toast.error("Only image files can be uploaded");
    if (images.length > room) toast.error(`Only ${room} more ${room === 1 ? "image fits" : "images fit"}; the rest were left out`);
    const chosen = images.slice(0, room);
    if (chosen.length === 0) return;
    add(await upload(chosen));
  };

  const addLink = () => {
    const url = link.trim();
    if (!isWebUrl(url)) {
      setLinkError("Enter a full image link starting with https://");
      return;
    }
    setLinkError(null);
    setLink("");
    add([url]);
  };

  const remove = (url: string) => {
    onChange((current) => current.filter((item) => item !== url));
    onBlur?.();
  };

  const shownError = linkError ?? error;
  const describedBy = shownError ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="flex flex-col gap-2.5">
      <Label htmlFor={`${id}-link`}>{label}</Label>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!isFull) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          if (!isFull) void uploadFiles([...event.dataTransfer.files]);
        }}
        className={cn(
          "flex flex-col gap-3 rounded-lg border border-dashed p-3 transition-colors",
          isDragging && "border-brand bg-brand/5",
          shownError && "border-destructive",
        )}
      >
        {(value.length > 0 || isUploading) && (
          <ul className="flex flex-wrap gap-2" aria-label={`${label}: chosen images`}>
            {value.map((url, index) => (
              <li key={url} className="group relative size-20 overflow-hidden rounded-md border bg-fill-thumbnail">
                <Image src={url} alt={`${label} ${index + 1}`} fill sizes="80px" unoptimized className="object-cover" />
                <button
                  type="button"
                  onClick={() => remove(url)}
                  aria-label={`Remove image ${index + 1}`}
                  className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm hover:text-destructive"
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              </li>
            ))}
            {Array.from({ length: single ? Math.min(pending, 1) : pending }, (_, index) => (
              <li
                key={`uploading-${index}`}
                className="flex size-20 items-center justify-center rounded-md border bg-fill-thumbnail"
                aria-label="Uploading image"
              >
                <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden="true" />
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <InputGroup className="h-11 min-w-0 flex-1">
            <InputGroupAddon>
              <Link2 aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              id={`${id}-link`}
              type="url"
              inputMode="url"
              value={link}
              disabled={isFull}
              onChange={(event) => {
                setLink(event.target.value);
                setLinkError(null);
              }}
              onKeyDown={(event) => {
                // Enter adds the link instead of submitting the whole form.
                if (event.key === "Enter") {
                  event.preventDefault();
                  addLink();
                }
              }}
              placeholder="Paste an image link"
              aria-invalid={shownError ? true : undefined}
              aria-describedby={describedBy}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton type="button" onClick={addLink} disabled={isFull || !link.trim()}>
                {single && value.length > 0 ? "Replace" : "Add"}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>

          <input
            ref={fileInput}
            type="file"
            accept={UPLOAD_IMAGE_TYPES.join(",")}
            multiple={!single}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(event) => {
              void uploadFiles([...(event.target.files ?? [])]);
              // Lets the same file be chosen again after a failed upload.
              event.target.value = "";
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-11"
            disabled={isFull || isUploading}
            onClick={() => fileInput.current?.click()}
          >
            {isUploading ? (
              <Loader2 data-icon="inline-start" className="animate-spin" aria-hidden="true" />
            ) : (
              <Upload data-icon="inline-start" aria-hidden="true" />
            )}
            {isUploading ? `Uploading ${pending}...` : single ? "Upload image" : "Upload images"}
          </Button>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ImagePlus className="size-3.5 shrink-0" aria-hidden="true" />
          {isFull
            ? `Maximum ${max} images reached. Remove one to add another.`
            : `Drop ${single ? "an image" : "images"} here, or upload JPG, PNG, WebP or GIF (up to 4 MB${single ? "" : `, ${room} more`}).`}
        </p>
      </div>

      {shownError ? (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {shownError}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )
      )}
    </div>
  );
};

export default ImageInput;
