/* ==========================================
   📸 CAMERA MODULE - Nautical Photobox
   ========================================== */

// Camera State
const cameraState = {
    stream: null,
    photosCaptured: 0,
    photos: [null, null, null],
    maxPhotos: 3,
    isCapturing: false,
    finalImage: null
};

// DOM Elements
let cameraFeed;
let flashOverlay;
let countdownOverlay;
let countdownNumber;
let cameraError;
let captureBtn;
let captureBtnText;
let generateBtn;
let photoboxContainer;
let photoboxPlaceholder;

// Initialize Camera
async function initCamera() {
    cameraFeed = document.getElementById('camera-feed');
    flashOverlay = document.getElementById('flash-overlay');
    countdownOverlay = document.getElementById('countdown-overlay');
    countdownNumber = document.getElementById('countdown-number');
    cameraError = document.getElementById('camera-error');
    captureBtn = document.getElementById('capture-btn');
    captureBtnText = document.getElementById('capture-btn-text');
    generateBtn = document.getElementById('generate-btn');
    photoboxContainer = document.getElementById('photobox-container');
    photoboxPlaceholder = document.getElementById('photobox-placeholder');

    // Event Listeners
    captureBtn.addEventListener('click', startCaptureSequence);
    generateBtn.addEventListener('click', generateFinalImage);

    // Request camera access
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        });

        cameraState.stream = stream;
        cameraFeed.srcObject = stream;
        cameraError.classList.add('hidden');

    } catch (error) {
        console.error('Camera error:', error);
        cameraError.classList.remove('hidden');
        captureBtn.disabled = true;
    }
}

// Start Capture Sequence with Countdown
function startCaptureSequence() {
    if (cameraState.isCapturing || cameraState.photosCaptured >= cameraState.maxPhotos) return;

    cameraState.isCapturing = true;
    captureBtn.disabled = true;

    // Show countdown
    countdownOverlay.classList.remove('hidden');

    let count = 3;
    countdownNumber.textContent = count;

    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownNumber.textContent = count;
        } else {
            clearInterval(countdownInterval);
            countdownOverlay.classList.add('hidden');
            capturePhoto();
        }
    }, 1000);
}

// Capture Photo
function capturePhoto() {
    // Flash effect
    flashOverlay.classList.add('flash-active');
    setTimeout(() => {
        flashOverlay.classList.remove('flash-active');
    }, 150);

    // Create canvas to capture frame
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size (4:3 aspect ratio crop)
    const videoWidth = cameraFeed.videoWidth;
    const videoHeight = cameraFeed.videoHeight;

    // Calculate crop area for 4:3
    let cropWidth, cropHeight, cropX, cropY;
    const targetRatio = 4 / 3;
    const videoRatio = videoWidth / videoHeight;

    if (videoRatio > targetRatio) {
        // Video is wider, crop sides
        cropHeight = videoHeight;
        cropWidth = videoHeight * targetRatio;
        cropX = (videoWidth - cropWidth) / 2;
        cropY = 0;
    } else {
        // Video is taller, crop top/bottom
        cropWidth = videoWidth;
        cropHeight = videoWidth / targetRatio;
        cropX = 0;
        cropY = (videoHeight - cropHeight) / 2;
    }

    canvas.width = 640;
    canvas.height = 480;

    // Mirror the image (selfie mode)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(cameraFeed, cropX, cropY, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = canvas.toDataURL('image/jpeg', 0.9);

    // Store photo
    const photoIndex = cameraState.photosCaptured;
    cameraState.photos[photoIndex] = imageData;
    cameraState.photosCaptured++;

    // Update preview
    updatePhotoPreview(photoIndex, imageData);

    // Update UI
    updateCaptureUI();

    cameraState.isCapturing = false;
}

// Update Photo Preview
function updatePhotoPreview(index, imageData) {
    const photoElement = document.getElementById(`captured-photo-${index + 1}`);
    if (photoElement) {
        photoElement.src = imageData;
        photoElement.classList.add('photo-visible');
    }

    // Update dot indicator
    const dotElement = document.getElementById(`photo-dot-${index + 1}`);
    if (dotElement) {
        dotElement.classList.add('photo-dot-filled');
    }

    // Hide placeholder if any photo exists
    if (photoboxPlaceholder) {
        photoboxPlaceholder.classList.add('hidden');
    }
}

// Update Capture Button UI
function updateCaptureUI() {
    if (cameraState.photosCaptured >= cameraState.maxPhotos) {
        // All photos captured
        captureBtn.disabled = true;
        captureBtnText.textContent = 'Semua Foto Terambil! ✅';
        generateBtn.classList.remove('hidden');
        generateBtn.classList.add('success-bounce');
    } else {
        // More photos to capture
        captureBtn.disabled = false;
        captureBtnText.textContent = `Ambil Foto ${cameraState.photosCaptured + 1}`;
    }
}

// Generate Final Image using Canvas API (manual composite)
async function generateFinalImage() {
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<span class="animate-pulse">Memproses...</span>';

    try {
        // Create canvas for final composite
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size (match photobox container proportions)
        canvas.width = 600;
        canvas.height = 900;

        // Fill background
        ctx.fillStyle = '#001f3f';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Photo positions (scaled to canvas size)
        // Original container: 300x450, canvas: 600x900 (2x scale)
        const photoPositions = [
            { x: 44, y: 44, width: 512, height: 256 },
            { x: 44, y: 320, width: 512, height: 256 },
            { x: 44, y: 596, width: 512, height: 256 }
        ];

        // Draw captured photos
        for (let i = 0; i < 3; i++) {
            if (cameraState.photos[i]) {
                await drawImageToCanvas(ctx, cameraState.photos[i], photoPositions[i]);
            }
        }

        // Use the template image that's already loaded in the DOM
        const templateImg = document.getElementById('photobox-template');

        if (templateImg && templateImg.complete && templateImg.naturalWidth > 0) {
            ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);
        } else {
            console.warn('Template not available in DOM');
        }

        // Convert to image
        cameraState.finalImage = canvas.toDataURL('image/png');

        // Trigger confetti
        if (typeof confetti !== 'undefined') {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#40E0D0', '#FF6B6B', '#FF8FAB', '#F4D03F', '#001f3f']
            });
        }

        // Go to finale stage
        setTimeout(() => {
            goToStage(4);
        }, 1000);

    } catch (error) {
        console.error('Error generating image:', error);
        generateBtn.disabled = false;
        generateBtn.innerHTML = '❌ Error, coba lagi';
    }
}

// Helper: Draw image data URL to canvas at position
function drawImageToCanvas(ctx, imageDataUrl, pos) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, pos.x, pos.y, pos.width, pos.height);
            resolve();
        };
        img.onerror = () => {
            console.warn('Failed to load photo');
            resolve();
        };
        img.src = imageDataUrl;
    });
}

// Get Final Image (for finale)
function getFinalImage() {
    return cameraState.finalImage;
}

// Stop Camera Stream
function stopCamera() {
    if (cameraState.stream) {
        cameraState.stream.getTracks().forEach(track => track.stop());
        cameraState.stream = null;
    }
}

// Reset Camera (for replay)
function resetCamera() {
    // Reset state
    cameraState.photosCaptured = 0;
    cameraState.photos = [null, null, null];
    cameraState.isCapturing = false;
    cameraState.finalImage = null;

    // Reset photo elements
    for (let i = 1; i <= 3; i++) {
        const photoElement = document.getElementById(`captured-photo-${i}`);
        if (photoElement) {
            photoElement.src = '';
            photoElement.classList.remove('photo-visible');
        }

        const dotElement = document.getElementById(`photo-dot-${i}`);
        if (dotElement) {
            dotElement.classList.remove('photo-dot-filled');
        }
    }

    // Reset UI
    if (captureBtn) {
        captureBtn.disabled = false;
    }
    if (captureBtnText) {
        captureBtnText.textContent = 'Ambil Foto 1';
    }
    if (generateBtn) {
        generateBtn.classList.add('hidden');
        generateBtn.classList.remove('success-bounce');
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i data-lucide="sparkles" class="w-6 h-6"></i> Buat Kenangan!';
    }
    if (photoboxPlaceholder) {
        photoboxPlaceholder.classList.remove('hidden');
    }
}

// Export for global access
window.cameraModule = {
    init: initCamera,
    reset: resetCamera,
    stop: stopCamera,
    getFinalImage: getFinalImage
};
