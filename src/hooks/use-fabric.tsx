import React from "react";
import { Canvas, FabricImage, PencilBrush } from "fabric";
import { useWindow } from "@/hooks/use-window.tsx";
import { useToast } from "@/hooks/use-toast.ts";

const CANVAS_DIMS = {
  defaultWidth: 500,
  defaultHeight: 700,
  mobileMultiplier: 0.9,
};
const DEFAULT_BACKGROUND_COLOR = "#ffffff";

export interface DrawingPropertiesProps {
  isDrawing: boolean;
  brushSize: number;
  brushColor: string;
}

export function useFabric() {
  const { toast } = useToast();

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = React.useState<Canvas | null>(null);
  const [maskCanvas, setMaskCanvas] = React.useState<Canvas | null>(null);
  const [currentBackgroundColor, setCurrentBackgroundColor] =
    React.useState<string>(DEFAULT_BACKGROUND_COLOR);
  const [isObjectSelected, setIsObjectSelected] =
    React.useState<boolean>(false);
  const [isImageSelected, setIsImageSelected] = React.useState<boolean>(false);
  const { isMobile, windowSize } = useWindow();
  const [drawingSettings, setDrawingSettings] =
    React.useState<DrawingPropertiesProps>({
      isDrawing: false,
      brushSize: 4,
      brushColor: "#ffffff",
    });

  React.useEffect(() => {
    if (!canvasRef.current || !maskCanvasRef.current) return;

    const fabricCanvas = new Canvas(canvasRef.current, {
      width: CANVAS_DIMS.defaultWidth,
      height: CANVAS_DIMS.defaultHeight,
    });

    const fabricMaskCanvas = new Canvas(maskCanvasRef.current, {
      width: CANVAS_DIMS.defaultWidth,
      height: CANVAS_DIMS.defaultHeight,
    });

    console.log(
      "Fabric.js canvas initialized:",
      fabricCanvas,
      fabricMaskCanvas
    );

    fabricCanvas.backgroundColor = currentBackgroundColor;
    fabricMaskCanvas.backgroundColor = "black";

    setCanvas(fabricCanvas);
    setMaskCanvas(fabricMaskCanvas);

    fabricCanvas.on("object:added", (e) => {
      const object = e.target;
      if (object) {
        object.set({
          cornerColor: "#FFF",
          cornerStyle: "circle",
          borderColor: "#8a4fec",
          borderScaleFactor: 1.5,
          transparentCorners: false,
          borderOpacityWhenMoving: 1,
          cornerStrokeColor: "#8a4fec",
        });

        fabricCanvas.renderAll();
      }
    });

    const updateSelectedProperties = () => {
      const activeObject = fabricCanvas.getActiveObject();

      if (activeObject) setIsObjectSelected(true);
      else setIsObjectSelected(false);

      // Update image selection state
      if (activeObject && activeObject.isType("image")) {
        setIsImageSelected(true);
      } else {
        setIsImageSelected(false);
      }
    };

    // Load the brush for drawing
    fabricCanvas.freeDrawingBrush = new PencilBrush(fabricCanvas);
    fabricMaskCanvas.freeDrawingBrush = new PencilBrush(fabricMaskCanvas);

    // Listen to multiple events that might change selection
    fabricCanvas.on("selection:created", updateSelectedProperties);
    fabricCanvas.on("selection:updated", updateSelectedProperties);
    fabricCanvas.on("selection:cleared", updateSelectedProperties);

    // Add a listener for object modifications
    fabricCanvas.on("object:modified", updateSelectedProperties);

    // Synchronize drawing paths
    fabricCanvas.on("path:created", async (e) => {
      const path = e.path;

      if (path) {
        const maskPath = await path.clone();
        maskPath.set({
          stroke: "white",
        });

        fabricMaskCanvas.add(maskPath);
        fabricMaskCanvas.renderAll();
      }
    });

    adjustCanvasSize(fabricCanvas, isMobile); // Initial size adjustment
    adjustCanvasSize(fabricMaskCanvas, isMobile);

    return () => {
      // Remove event listeners
      fabricCanvas.off("selection:created", updateSelectedProperties);
      fabricCanvas.off("selection:updated", updateSelectedProperties);
      fabricCanvas.off("selection:cleared", updateSelectedProperties);
      fabricCanvas.off("object:modified", updateSelectedProperties);
      fabricCanvas.dispose();
      fabricMaskCanvas.dispose();
    };
  }, [canvasRef, maskCanvasRef]);

  React.useEffect(() => {
    if (!canvas || !maskCanvas) return;

    canvas.isDrawingMode = drawingSettings.isDrawing;
    maskCanvas.isDrawingMode = drawingSettings.isDrawing;

    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = drawingSettings.brushColor;
      canvas.freeDrawingBrush.width = drawingSettings.brushSize;
    }

    if (maskCanvas.freeDrawingBrush) {
      maskCanvas.freeDrawingBrush.color = "white";
      maskCanvas.freeDrawingBrush.width = drawingSettings.brushSize;
    }

    canvas.renderAll();
    maskCanvas.renderAll();
  }, [drawingSettings, canvas, maskCanvas]);

  const adjustCanvasSize = (canvas: Canvas, isMobile: boolean) => {
    const size = isMobile
      ? Math.min(
          windowSize.width! * CANVAS_DIMS.mobileMultiplier,
          CANVAS_DIMS.defaultWidth
        )
      : CANVAS_DIMS.defaultWidth;

    canvas.setDimensions({ width: size, height: size });
    canvas.renderAll();
  };

  const deleteSelectedObject = React.useCallback(() => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  }, [canvas]);

  React.useEffect(() => {
    if (!canvas || !maskCanvas) return;
    adjustCanvasSize(canvas, isMobile);
    adjustCanvasSize(maskCanvas, isMobile);
  }, [isMobile, windowSize, canvas]);

  React.useEffect(() => {
    if (!canvas) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete" && canvas.getActiveObject()) {
        deleteSelectedObject();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canvas, deleteSelectedObject]);

  React.useEffect(() => {
    if (!canvas) return;
    canvas.isDrawingMode = drawingSettings.isDrawing;
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = drawingSettings.brushColor;
      canvas.freeDrawingBrush.width = drawingSettings.brushSize;
    }
    canvas.renderAll();
  }, [drawingSettings, canvas]);

  async function setBackgroundImage(imageUrl: string): Promise<Canvas | null> {
    if (!canvas || !maskCanvas) return null;

    try {
      const img = await FabricImage.fromURL(imageUrl);

      if (!img) {
        toast({ description: "Failed to load Image" });
        return null;
      }

      let imgWidth, imgHeight;

      if (windowSize.width! > 768) {
        // Desktop: Adjust canvas width based on the image aspect ratio
        imgWidth = (img.width! * CANVAS_DIMS.defaultWidth) / img.height!;
        imgHeight = CANVAS_DIMS.defaultHeight;
      } else {
        // Mobile: Adjust canvas dimensions to remain square or constrained
        const size = Math.min(
          windowSize.width! * CANVAS_DIMS.mobileMultiplier,
          CANVAS_DIMS.defaultHeight
        );

        imgWidth = size;
        imgHeight = CANVAS_DIMS.defaultHeight;
      }

      canvas.setDimensions({ width: imgWidth, height: imgHeight });
      maskCanvas.setDimensions({ width: imgWidth, height: imgHeight });

      const scaleX = imgWidth / img.width!;
      const scaleY = imgHeight / img.height!;
      const scale = Math.min(scaleX, scaleY); // Fit image inside canvas

      img.scale(scale);
      img.set({
        originX: "center",
        originY: "center",
        left: imgWidth / 2,
        top: imgHeight / 2,
        objectCaching: false,
      });

      canvas.clear();
      maskCanvas.clear();
      canvas.backgroundColor = currentBackgroundColor;
      maskCanvas.backgroundColor = "black";
      canvas.backgroundImage = img;
      canvas.renderAll();
      maskCanvas.renderAll();

      console.log("Image set as background successfully");
      return canvas;
    } catch (error) {
      toast({ description: "Error loading image" });
      console.error("Error loading or setting image:", error);
      return null;
    }
  }

  function flipImage(direction: "horizontal" | "vertical") {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();

    if (activeObject && activeObject.isType("image")) {
      const image = activeObject as FabricImage;
      if (direction === "horizontal") {
        image.set("flipX", !image.flipX);
      } else {
        image.set("flipY", !image.flipY);
      }

      canvas.renderAll();
    }
  }

  function setDrawingMode(set: boolean) {
    setDrawingSettings((prev) => ({
      ...prev,
      isDrawing: set,
    }));
  }

  function setBrushSize(size: number) {
    setDrawingSettings((prev) => {
      let newSize = size;
      if (newSize > 20) {
        newSize = 2;
      }
      return { ...prev, brushSize: newSize };
    });
  }

  function setBrushColor(color: string) {
    setDrawingSettings((prev) => ({
      ...prev,
      brushColor: color,
    }));
  }

  function downloadCanvas() {
    if (!canvas) return;

    const dataUrl = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1,
    });

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function exportMask() {
    if (!maskCanvas) return;

    const maskDataUrl = maskCanvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1,
    });

    const link = document.createElement("a");
    link.href = maskDataUrl;
    link.download = "mask.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function getCurrentState() {
    if (!canvas) return;
    const dataUrl = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1,
    });
    
    return dataUrl;
  }

  function changeBackgroundColor(color: string) {
    if (canvas) {
      setCurrentBackgroundColor(color);
      canvas.backgroundColor = color;
      canvas.renderAll();
    }
  }

  function clearCanvas() {
    if (!canvas || !maskCanvas) return;
    canvas.clear();
    canvas.backgroundColor = DEFAULT_BACKGROUND_COLOR;
    maskCanvas.clear();
    maskCanvas.backgroundColor = "black";
    canvas.renderAll();
    maskCanvas.renderAll();
  }

  return {
    canvasRef,
    maskCanvasRef,
    setBackgroundImage,
    flipImage,
    deleteSelectedObject,
    currentBackgroundColor,
    changeBackgroundColor,
    isObjectSelected,
    isImageSelected,
    setDrawingMode,
    setBrushSize,
    setBrushColor,
    drawingSettings,
    downloadCanvas,
    exportMask,
    getCurrentState,
    clearCanvas,
  };
}
