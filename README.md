# Lumina: Smart Image Enhancement Analysis System

A multi-stage image processing pipeline designed for automated cleaning, enhancement, and feature extraction. This system leverages advanced OpenCV techniques to transform raw, noisy images into high-contrast, feature-rich data.

## 🚀 Live Demo
Experience the system live on Hugging Face Spaces:
**[Gradio Hub: Image Preprocessing](https://huggingface.co/spaces/Ashvitta/Image_preprocessing)**

---

## 🛠 The Processing Pipeline
The core of this project is a structured flow:
`Raw Image` → `Cleaning` → `Noise Analysis` → `Adaptive Enhancement` → `Feature Extraction`

### 1. Standardized Cleaning
Before any enhancement, images are normalized:
- **Resizing**: Standardizing input dimensions for consistent processing performance.
- **Luminance Extraction**: Converting to Grayscale to focus on structure and intensity rather than color artifacts.

### 2. Intelligent Noise Analysis (Unique Implementation)
Unlike static filters, this project includes a noise-guessing heuristic:
- **Histogram Profiling**: Analyzing the distribution of pixel intensities to identify noise patterns.
- **Spike Detection**: Identifying high-frequency spikes at 0 and 255 to detect **Salt & Pepper noise**.
- **Smooth Profile Analysis**: Recognizing wide, smooth distributions characteristic of **Gaussian noise**.

### 3. Adaptive Denoising
Based on the noise analysis, the system dynamically chooses the optimal filter:
- **Median Blur**: Selected for impulsive (Salt & Pepper) noise to preserve edges.
- **Gaussian Blur**: Applied for white noise, using a kernel size dynamically calculated based on image dimensions (e.g., `1%` of the smallest dimension).

### 4. CLAHE Enhancement
To bring out hidden details without over-amplifying noise, the system uses **Contrast Limited Adaptive Histogram Equalization (CLAHE)**. 
- **localized Contrast**: Unlike standard global equalization, CLAHE operates on `8x8` tiles.
- **Clip Limit**: Prevents extreme contrast stretching in uniform areas, maintaining a natural but sharp output.

### 5. Feature Extraction
The final stage uses **Canny Edge Detection** on the enhanced image. Because the image has been denoised and contrast-optimized, the resulting edge map is significantly cleaner and more representative of actual structural features compared to running Canny on raw data.

---

## 💻 Tech Stack
- **OpenCV**: Core image processing engine.
- **Gradio**: Backend API and model hosting.
- **Javascript (ESM)**: Custom high-end frontend integration.
- **CSS3**: Premium glassmorphism design with backdrop-filter effects.

---

## 🧠 Project Insights
This system mimics a professional computer vision preprocessing stage, where the goal isn't just to make the image "look better" but to prepare it for high-accuracy machine learning tasks like object detection or segmentation.
