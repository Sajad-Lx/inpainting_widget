import React from "react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input.tsx";
import { useFabric } from "@/hooks/use-fabric.tsx";
import {
  Brush,
  MousePointer2,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { HexColorPicker } from "react-colorful";
import { Slider } from "@/components/ui/slider.tsx";
import { PresetSave } from "./components/preset-save";
import { Switch } from "./components/ui/switch";

function App() {
  const {
    canvasRef,
    maskCanvasRef,
    setBackgroundImage,
    // flipImage,
    deleteSelectedObject,
    isObjectSelected,
    // isImageSelected,
    setDrawingMode,
    setBrushSize,
    setBrushColor,
    drawingSettings,
    downloadCanvas,
    exportMask,
    getCurrentState,
    clearCanvas,
  } = useFabric();

  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [diffMode, setDiffMode] = React.useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        console.log("Image loaded, setting background...");
        const result = reader.result as string;
        setBackgroundImage(result).catch((error) => {
          console.log("Error setting background image:", error);
        });
        setImageSrc(result);
      };
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
      };
      reader.readAsDataURL(file);
    }
  };

  // const { isMobile } = useWindow();

  return (
    <>
      <div className="h-full flex-col md:flex">
        <div className="container mx-auto flex items-start justify-between space-y-2 py-4 flex-row sm:items-center sm:space-y-0 md:h-16">
          <h2 className="text-lg font-semibold pl-8">Image Playground</h2>
          <div className="ml-auto flex w-full space-x-2 justify-end mr-2">
            <PresetSave
              downloadCanvas={downloadCanvas}
              exportMask={exportMask}
            />
            <Button
              variant={"destructive"}
              onClick={() => {
                clearCanvas();
                setImageSrc(null);
              }}
            >
              Clear Canvas
            </Button>
          </div>
        </div>
        <Separator />
        <Tabs defaultValue="select_obj" className="flex-1">
          <div className="container mx-auto h-full py-6 px-4">
            <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
              <div className="flex-col space-y-4 sm:flex md:order-2">
                <div className="grid gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="diff-mode"
                      checked={diffMode}
                      disabled={!imageSrc}
                      onCheckedChange={() => setDiffMode(!diffMode)}
                    />
                    <Label htmlFor="diff-mode">See difference</Label>
                  </div>
                  <Separator />
                  <HoverCard openDelay={200}>
                    <HoverCardTrigger asChild>
                      <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Mode
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-[320px] text-sm" side="left">
                      Choose the interface.
                    </HoverCardContent>
                  </HoverCard>
                  <TabsList className="grid grid-cols-2 gap-2">
                    <TabsTrigger
                      value="select_obj"
                      onClick={() => setDrawingMode(false)}
                    >
                      <span className="sr-only">Select Objects</span>
                      <MousePointer2 />
                    </TabsTrigger>
                    <TabsTrigger
                      value="drawing"
                      onClick={() => setDrawingMode(true)}
                    >
                      <span className="sr-only">Draw tool</span>
                      <Brush />
                    </TabsTrigger>
                  </TabsList>
                </div>
                <Separator />

                <TabsContent value="select_obj" className="mt-0 border-0 p-0">
                  <div id="select-objects-tab">
                    <h3 className="text-lg font-medium">Object Options</h3>
                    <Separator />
                    <div className="flex flex-col space-y-4">
                      {/* Flip Image */}
                      {/* <div>
                        <p className="text-sm font-medium pt-4 mb-2">
                          Flip Image
                        </p>
                        <div className="flex flex-col justify-start space-y-2">
                          <Button
                            variant="outline"
                            disabled={!isImageSelected}
                            onClick={() => flipImage("horizontal")}
                          >
                            <FlipHorizontal /> Flip Horizontal
                          </Button>
                          <Button
                            variant="outline"
                            disabled={!isImageSelected}
                            onClick={() => flipImage("vertical")}
                          >
                            <FlipVertical /> Flip Vertical
                          </Button>
                        </div>
                      </div> */}

                      {/* <Separator /> */}
                      {/* Delete Object */}
                      <div className="flex flex-col">
                        <Button
                          disabled={!isObjectSelected}
                          onClick={deleteSelectedObject}
                          className="bg-red-500 text-white hover:bg-red-600"
                        >
                          <Trash />
                          Delete Object
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="drawing" className="mt-0 border-0 p-0">
                  <div id="drawing-tab">
                    <h3 className="text-lg font-medium">Drawing Options</h3>
                    <Separator />
                    <div className="flex flex-col space-y-4">
                      {/* Change Brush Size */}
                      <div>
                        <p className="text-sm font-medium pt-4 mb-2">
                          Brush Size
                        </p>
                        <Slider
                          id="brush-size"
                          min={1}
                          defaultValue={[drawingSettings.brushSize]}
                          step={1}
                          onValueChange={(v) => setBrushSize(v[0])}
                          max={20}
                          aria-label="Brush Size"
                        />
                        <span className="text-sm mt-4">
                          Size: {drawingSettings.brushSize}px
                        </span>
                      </div>

                      {/* Change Brush Color */}
                      <div>
                        <p className="text-sm font-medium">Brush Color</p>
                        <HexColorPicker
                          color={drawingSettings.brushColor}
                          onChange={(color) => setBrushColor(color)}
                        />
                        <span className="text-sm">
                          Selected Color: {drawingSettings.brushColor}
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
              <div className="md:order-1">
                <div
                  className={`flex flex-col space-y-4 ${diffMode && "hidden"}`}
                >
                  <div className="h-full min-h-[700px] rounded-md border relative z-0">
                    <canvas ref={canvasRef} />
                    {!imageSrc && (
                      <div className="w-full max-w-sm place-self-center absolute inset-0 z-10">
                        <Label htmlFor="picture">Insert Picture</Label>
                        <Input
                          id="picture"
                          type="file"
                          accept={"image/png, image/jpg, image/jpeg"}
                          onChange={handleImageUpload}
                        />
                      </div>
                    )}
                  </div>
                  <div className="hidden h-full min-h-[700px] rounded-md border bg-muted relative z-0">
                    <canvas ref={maskCanvasRef} />
                  </div>
                </div>
                <div
                  className={`flex flex-row space-x-4 items-start ${!diffMode && "hidden"}`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <p className="text-center font-semibold">Original</p>
                    <div className="h-full max-h-[700px] rounded-md border relative z-0">
                      {imageSrc && (
                        <img
                          src={imageSrc}
                          alt="Uploaded"
                          className="max-w-full max-h-[700px] object-contain rounded-md"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <p className="text-center font-semibold">Modified</p>
                    <div className="h-full max-h-[700px] rounded-md border bg-muted relative z-0">
                      <img
                        src={getCurrentState()}
                        alt="Canvas result"
                        className="max-w-full max-h-[700px] object-contain rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
}

export default App;
