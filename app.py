import cv2
import numpy as np
import gradio as gr

def process_image(image):
    # Convert Gradio image (RGB) to OpenCV format (BGR)
    img = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    # Resize
    resized = cv2.resize(img, None, fx=0.5, fy=0.5, interpolation=cv2.INTER_LINEAR)

    # Grayscale
    gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)

    # Denoising
    denoised = cv2.GaussianBlur(gray, (5, 5), 0)

    # Noise removed visualization
    diff = cv2.absdiff(gray, denoised)

    # CLAHE enhancement
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(denoised)

    # Edge detection
    edges = cv2.Canny(enhanced, 50, 150)

    return (
        cv2.cvtColor(resized, cv2.COLOR_BGR2RGB),
        gray,
        denoised,
        diff,
        enhanced,
        edges
    )

interface = gr.Interface(
    fn=process_image,
    inputs=gr.Image(type="numpy", label="Upload Image"),
    outputs=[
        gr.Image(label="Resized Image"),
        gr.Image(label="Grayscale Image"),
        gr.Image(label="Denoised Image"),
        gr.Image(label="Noise Removed"),
        gr.Image(label="Enhanced Image (CLAHE)"),
        gr.Image(label="Edge Detection")
    ],
    title="Image Processing Pipeline",
    description="Raw Image → Cleaning → Enhancement → Feature Extraction"
)

if __name__ == "__main__":
    interface.launch()
