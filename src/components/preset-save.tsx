import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type PresetSaveProps = {
  downloadCanvas: () => void;
  exportMask: () => void;
};

export function PresetSave({ downloadCanvas, exportMask }: PresetSaveProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Download</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Download options</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Button type="submit" onClick={downloadCanvas}>
              {"Download (Image + Mask)"}
            </Button>
          </div>
          <div className="grid gap-2">
            <Button type="submit" onClick={exportMask}>
              {"Download Mask only"}
            </Button>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant={"destructive"}
              type="button"
              className="mt-4 sm:mt-0"
            >
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
