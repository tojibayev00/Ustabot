import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";

interface ImageUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
  min?: number;
  max?: number;
}

export function ImageUploader({ files, onChange, min = 3, max = 20 }: ImageUploaderProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>): void {
    const selected = Array.from(e.target.files ?? []);
    const combined = [...files, ...selected].slice(0, max);
    onChange(combined);
    e.target.value = "";
  }

  function removeAt(index: number): void {
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        {files.map((file, index) => (
          <div key={index} className="relative aspect-square overflow-hidden rounded-md bg-secondary-bg">
            <img
              src={URL.createObjectURL(file)}
              alt=""
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
              aria-label="O'chirish"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {files.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-hint/30 text-hint"
          >
            <ImagePlus className="h-6 w-6" />
            <span className="text-xs">Rasm qo'shish</span>
          </button>
        )}
      </div>

      <p className="text-xs text-hint">
        {files.length}/{max} ta rasm yuklandi. Kamida {min} ta rasm talab qilinadi.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={handleSelect}
      />
    </div>
  );
}
