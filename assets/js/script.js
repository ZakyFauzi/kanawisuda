/* ==========================================
   🌊 MAIN SCRIPT - Deep Sea Graduation Odyssey
   ========================================== */

// Game State
const gameState = {
    currentStage: 1,
    isTransitioning: false
};

// DOM Elements
let passwordInput;
let diveBtn;
let passwordError;
let replayBtn;
let downloadBtn;
let finalPhotobox;
let memoriesContainer;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        once: true,
        duration: 800
    });

    // Initialize Lucide icons
    lucide.createIcons();

    // Get DOM elements
    passwordInput = document.getElementById('password-input');
    diveBtn = document.getElementById('dive-btn');
    passwordError = document.getElementById('password-error');
    replayBtn = document.getElementById('replay-btn');
    downloadBtn = document.getElementById('download-btn');
    finalPhotobox = document.getElementById('final-photobox');
    memoriesContainer = document.getElementById('memories-container');

    // Setup event listeners
    setupEventListeners();

    console.log('🌊 Deep Sea Odyssey initialized!');
});

// Setup Event Listeners
function setupEventListeners() {
    // Password/Dive button
    diveBtn.addEventListener('click', handlePasswordSubmit);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handlePasswordSubmit();
        }
    });

    // Hide error on input
    passwordInput.addEventListener('input', () => {
        passwordError.classList.add('hidden');
    });

    // Replay button
    replayBtn.addEventListener('click', handleReplay);

    // Download button
    downloadBtn.addEventListener('click', handleDownload);
}

// Handle Password Submit
function handlePasswordSubmit() {
    const password = passwordInput.value.trim().toLowerCase();

    if (password === 'siap') {
        // Correct password
        passwordError.classList.add('hidden');
        goToStage(2);
    } else {
        // Wrong password
        passwordError.classList.remove('hidden');
        passwordInput.classList.add('animate-shake');
        setTimeout(() => {
            passwordInput.classList.remove('animate-shake');
        }, 500);
    }
}

// Go to Stage
function goToStage(stageNumber) {
    if (gameState.isTransitioning) return;
    gameState.isTransitioning = true;

    const currentSection = document.getElementById(`stage-${gameState.currentStage}`);
    const nextSection = document.getElementById(`stage-${stageNumber}`);

    if (!nextSection) {
        gameState.isTransitioning = false;
        return;
    }

    // Enable scrolling
    document.body.classList.remove('overflow-hidden');
    document.body.style.overflowY = 'auto';

    // Hide current stage
    if (currentSection) {
        currentSection.classList.add('hidden-stage');
    }

    // Show next stage
    nextSection.classList.remove('hidden-stage');
    nextSection.classList.add('stage-entering');

    // Scroll to section
    nextSection.scrollIntoView({ behavior: 'smooth' });

    // Update state
    gameState.currentStage = stageNumber;

    // Stage-specific initialization
    setTimeout(() => {
        gameState.isTransitioning = false;
        nextSection.classList.remove('stage-entering');

        switch (stageNumber) {
            case 2:
                // Initialize chat
                if (window.chatModule) {
                    window.chatModule.init();
                }
                break;
            case 3:
                // Initialize camera
                if (window.cameraModule) {
                    window.cameraModule.init();
                }
                // Re-init lucide icons for new elements
                lucide.createIcons();
                break;
            case 4:
                // Setup finale
                setupFinale();
                // Celebration confetti burst
                celebrateFinal();
                break;
        }
    }, 800);
}

// Setup Finale Stage
function setupFinale() {
    // Display final photobox image
    if (window.cameraModule && finalPhotobox) {
        const finalImage = window.cameraModule.getFinalImage();
        if (finalImage) {
            finalPhotobox.innerHTML = `<img src="${finalImage}" alt="Photobox Result" class="w-full rounded-2xl shadow-2xl">`;
        }
    }

    // Display memories
    if (window.chatModule && memoriesContainer) {
        const memories = window.chatModule.getMemories();
        if (memories && memories.length > 0) {
            memoriesContainer.innerHTML = `
                <p class="text-pearl/90 italic leading-relaxed">
                    "${memories}"
                </p>
                <p class="text-turquoise/60 text-sm mt-4">
                    — Cerita dari Kak Kana, ${new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })}
                </p>
            `;
        } else {
            memoriesContainer.innerHTML = `
                <p class="text-pearl/60 italic">
                    Petualangan yang penuh warna! ✨
                </p>
            `;
        }
    }

    // Stop camera to free resources
    if (window.cameraModule) {
        window.cameraModule.stop();
    }

    // Re-init lucide icons
    lucide.createIcons();
}

// Celebrate Final
function celebrateFinal() {
    // Multiple confetti bursts
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#40E0D0', '#FF6B6B', '#FF8FAB', '#F4D03F'];

    (function frame() {
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

// Handle Download
function handleDownload() {
    if (!window.cameraModule) return;

    const finalImage = window.cameraModule.getFinalImage();
    if (!finalImage) {
        alert('Gambar belum tersedia!');
        return;
    }

    // Create download link
    const link = document.createElement('a');
    link.download = `wisuda-kak-kana-${Date.now()}.png`;
    link.href = finalImage;
    link.click();

    // Celebrate download
    confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
    });
}

// Handle Replay
function handleReplay() {
    if (confirm('Yakin mau mulai dari awal? Semua progress akan hilang.')) {
        // Reset all modules
        if (window.chatModule) {
            window.chatModule.reset();
        }
        if (window.cameraModule) {
            window.cameraModule.reset();
        }

        // Reset UI elements
        passwordInput.value = '';
        passwordError.classList.add('hidden');

        // Hide all stages except stage 1
        document.querySelectorAll('.stage').forEach((stage, index) => {
            if (index === 0) {
                stage.classList.remove('hidden-stage');
            } else {
                stage.classList.add('hidden-stage');
            }
        });

        // Lock scroll
        document.body.classList.add('overflow-hidden');
        document.body.style.overflowY = 'hidden';

        // Reset state
        gameState.currentStage = 1;

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Re-init camera for next time
        setTimeout(() => {
            lucide.createIcons();
        }, 500);
    }
}

// Global function for stage navigation (used by modules)
window.goToStage = goToStage;
