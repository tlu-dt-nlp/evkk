// Renders an SVG or canvas element to a PNG and hands it to the browser as a download.
// Shared by ImageDownloadButton (word cloud, word context graph) and the statistics charts.
//
// Note: the SVG path used to pad twice — once here and again by passing the result back
// through the canvas path — so SVG downloads carried 40px of padding. It is now one
// IMAGE_PADDING border, like the canvas path always had.

const IMAGE_PADDING = 20;

const createNewCanvas = (element) => {
  const canvas = document.createElement('canvas');
  canvas.width = element.width + 2 * IMAGE_PADDING;
  canvas.height = element.height + 2 * IMAGE_PADDING;
  return canvas;
};

const saveCanvas = (canvas, fileName) => {
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = fileName;
  link.click();
};

export const downloadCanvasAsImage = (canvasElement, fileName) => {
  const canvas = createNewCanvas(canvasElement);
  const context = canvas.getContext('2d');

  context.drawImage(canvasElement, IMAGE_PADDING, IMAGE_PADDING);

  context.fillStyle = 'white';
  context.fillRect(0, 0, canvas.width, IMAGE_PADDING);
  context.fillRect(0, 0, IMAGE_PADDING, canvas.height);
  context.fillRect(canvas.width - IMAGE_PADDING, 0, IMAGE_PADDING, canvas.height);
  context.fillRect(0, canvas.height - IMAGE_PADDING, canvas.width, IMAGE_PADDING);

  saveCanvas(canvas, fileName);
};

export const downloadSvgAsImage = (svgElement, fileName) => {
  const svgString = new XMLSerializer().serializeToString(svgElement);
  const image = new Image();

  image.onerror = () => {
    console.error(`Could not rasterise SVG for download: ${fileName}`);
  };

  image.onload = () => {
    const canvas = createNewCanvas(image);
    const context = canvas.getContext('2d');

    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, IMAGE_PADDING, IMAGE_PADDING, image.width, image.height);

    saveCanvas(canvas, fileName);
  };

  image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
};
