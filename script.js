import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";

// DOM Elements
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const loadingOverlay = document.getElementById('loading-overlay');
const resultsSection = document.getElementById('results-section');
const statusBadge = document.getElementById('api-status');
const resetBtn = document.getElementById('reset-btn');

// Result Image Elements
const imgResized = document.getElementById('res-resized');
const imgGray = document.getElementById('res-gray');
const imgDenoised = document.getElementById('res-denoised');
const imgNoiseMap = document.getElementById('res-noise-map');
const imgEnhanced = document.getElementById('res-enhanced');
const imgEdges = document.getElementById('res-edges');

let client;

// Initialize Gradio Client
async function initClient() {
    try {
        console.log("Connecting to Gradio...");
        client = await Client.connect("Ashvitta/Image_preprocessing");
        statusBadge.textContent = "Connected to Hub";
        statusBadge.classList.add('connected');
        console.log("Connected successfully!");
    } catch (error) {
        console.error("Connection failed:", error);
        statusBadge.textContent = "Connection Error";
        statusBadge.style.borderColor = "#ef4444";
        statusBadge.style.color = "#ef4444";
    }
}

initClient();

// Event Listeners
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleImage(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleImage(e.target.files[0]);
    }
});

resetBtn.addEventListener('click', () => {
    resultsSection.classList.add('hidden');
    dropZone.classList.remove('hidden');
    fileInput.value = '';
});

async function handleImage(file) {
    if (!client) {
        alert("Gradio client not connected yet. Please wait.");
        return;
    }

    if (!file.type.startsWith('image/')) {
        alert("Please upload an image file.");
        return;
    }

    showLoading(true);

    try {
        // Convert file to blob (redundant but safe)
        const imageBlob = new Blob([file], { type: file.type });
        
        console.log("Processing image...");
        const result = await client.predict("/process_image", { 
            image: imageBlob, 
        });

        console.log("Result received:", result.data);
        displayResults(result.data);

    } catch (error) {
        console.error("Processing failed:", error);
        alert("Error processing image. Check console for details.");
    } finally {
        showLoading(false);
    }
}

function showLoading(isLoading) {
    if (isLoading) {
        loadingOverlay.classList.remove('hidden');
    } else {
        loadingOverlay.classList.add('hidden');
    }
}

function displayResults(data) {
    // data is an array of objects for images in current Gradio versions
    // or direct URLs/base64 strings depending on the client version helper
    
    const setImg = (el, val) => {
        if (val && val.url) {
            el.src = val.url;
        } else if (typeof val === 'string') {
            el.src = val;
        }
    };

    setImg(imgResized, data[0]);
    setImg(imgGray, data[1]);
    setImg(imgDenoised, data[2]);
    setImg(imgNoiseMap, data[3]);
    setImg(imgEnhanced, data[4]);
    setImg(imgEdges, data[5]);

    dropZone.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}
