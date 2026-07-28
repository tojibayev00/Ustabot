import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: { id: string; imageUrl: string }[];
}

export function ImageGallery({ images }: ImageGalleryProps): JSX.Element {
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-md bg-secondary-bg text-sm text-hint">
        Rasm mavjud emas
      </div>
    );
  }

  return (
    <>
      <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto rounded-md">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setFullscreenIndex(index)}
            className="aspect-square w-[70%] shrink-0 snap-center overflow-hidden rounded-md bg-secondary-bg sm:w-[45%]"
          >
            <img
              src={image.imageUrl}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {fullscreenIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-fade-in"
          onClick={() => setFullscreenIndex(null)}
        >
          <button
            className="absolute right-4 top-[calc(env(safe-area-inset-top)+16px)] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
            onClick={() => setFullscreenIndex(null)}
            aria-label="Yopish"
          >
            <X className="h-5 w-5" />
          </button>

          {fullscreenIndex > 0 && (
            <button
              className="absolute left-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
              onClick={(e) => {
                e.stopPropagation();
                setFullscreenIndex((i) => (i !== null ? i - 1 : i));
              }}
              aria-label="Oldingi"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          <img
            src={images[fullscreenIndex]?.imageUrl}
            alt=""
            className="max-h-[85vh] max-w-[92vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {fullscreenIndex < images.length - 1 && (
            <button
              className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
              onClick={(e) => {
                e.stopPropagation();
                setFullscreenIndex((i) => (i !== null ? i + 1 : i));
              }}
              aria-label="Keyingi"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
