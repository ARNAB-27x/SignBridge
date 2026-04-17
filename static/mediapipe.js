import {
  HandLandmarker,
  FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";

const video = document.getElementById("webcam");
const canvas = document.getElementById("output_canvas");
const ctx = canvas ? canvas.getContext("2d") : null;

const predictedLetterEl = document.getElementById("predicted-letter");
const statusTextEl = document.getElementById("status-text");
const wordOutputEl = document.getElementById("word-output");

const letterSelect = document.getElementById("letter-select");
const captureTemplateBtn = document.getElementById("capture-template-btn");
const clearTemplatesBtn = document.getElementById("clear-templates-btn");
const templateInfoEl = document.getElementById("template-info");

const spaceBtn = document.getElementById("space-btn");
const backspaceBtn = document.getElementById("backspace-btn");
const clearBtn = document.getElementById("clear-btn");

let handLandmarker = null;
let running = false;
let currentLandmarks = null;

let stableLetter = "";
let stableCount = 0;
let lastAcceptedLetter = "";
let finalWord = "";

const STABLE_FRAMES = 12;
const TEMPLATE_STORAGE_KEY = "signbridge_letter_templates";
const LETTERS = [
  "A","B","C","D","E","F","G","H","I",
  "K","L","M","N","O","P","Q","R","S",
  "T","U","V","W","X","Y"
];
async function startCamera() {
  if (!video) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });

    video.srcObject = stream;

    await new Promise((resolve) => {
      video.onloadedmetadata = () => {
        video.play();
        resolve();
      };
    });

    setStatus("Camera started");
  } catch (error) {
    console.log("Camera error:", error);
    setStatus("Could not open camera");
  }
}
function setStatus(text) {
  if (statusTextEl) statusTextEl.innerText = text;
}

function loadTemplates() {
  try {
    const raw = localStorage.getItem(TEMPLATE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveTemplates(templates) {
  localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
}

let templates = loadTemplates();

function updateTemplateInfo() {
  let lines = [];
  for (const letter of LETTERS) {
    const count = templates[letter] ? templates[letter].length : 0;
    lines.push(`${letter}: ${count}`);
  }
  if (templateInfoEl) {
    templateInfoEl.textContent = lines.join("   ");
  }
}

function distance2D(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function normalizeLandmarks(landmarks) {
  if (!landmarks || landmarks.length !== 21) return null;

  const wrist = landmarks[0];
  const middleMcp = landmarks[9];
  const scale = distance2D(wrist, middleMcp) || 1;

  return landmarks.flatMap(pt => [
    (pt.x - wrist.x) / scale,
    (pt.y - wrist.y) / scale
  ]);
}

function averageTemplateSamples(samples) {
  if (!samples || samples.length === 0) return null;
  const length = samples[0].length;
  const avg = new Array(length).fill(0);

  for (const sample of samples) {
    for (let i = 0; i < length; i++) {
      avg[i] += sample[i];
    }
  }

  for (let i = 0; i < length; i++) {
    avg[i] /= samples.length;
  }

  return avg;
}

function vectorDistance(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

function predictLetterFromTemplates(normalizedVector) {
  let bestLetter = "";
  let bestDistance = Infinity;

  for (const letter of LETTERS) {
    const samples = templates[letter];
    if (!samples || samples.length === 0) continue;

    const avg = averageTemplateSamples(samples);
    const dist = vectorDistance(normalizedVector, avg);

    if (dist < bestDistance) {
      bestDistance = dist;
      bestLetter = letter;
    }
  }

  // simple threshold; you can tune this later
  if (bestDistance > 8.0) {
    return "";
  }

  return bestLetter;
}

function drawLandmarks(landmarks) {
  if (!ctx || !canvas) return;

  for (const point of landmarks) {
    const x = point.x * canvas.width;
    const y = point.y * canvas.height;

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "lime";
    ctx.fill();
  }
}

function updateWord(letter) {
  if (predictedLetterEl) {
    predictedLetterEl.innerText = letter || "-";
  }

  if (!letter) {
    stableLetter = "";
    stableCount = 0;
    lastAcceptedLetter = "";
    return;
  }

  if (letter === stableLetter) {
    stableCount++;
  } else {
    stableLetter = letter;
    stableCount = 1;
  }

  if (stableCount >= STABLE_FRAMES && letter !== lastAcceptedLetter) {
    finalWord += letter;
    lastAcceptedLetter = letter;
    stableCount = 0;
    if (wordOutputEl) wordOutputEl.value = finalWord;
  }
}

async function createHandLandmarker() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
    },
    runningMode: "VIDEO",
    numHands: 1,
    minHandDetectionConfidence: 0.5,
    minHandPresenceConfidence: 0.5,
    minTrackingConfidence: 0.5
  });
}

function predictWebcam() {
  if (!handLandmarker || !video || !canvas || !ctx) {
    requestAnimationFrame(predictWebcam);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const nowInMs = performance.now();
  const results = handLandmarker.detectForVideo(video, nowInMs);

  if (results.landmarks && results.landmarks.length > 0) {
    const landmarks = results.landmarks[0];
    currentLandmarks = landmarks;

    drawLandmarks(landmarks);

    const normalized = normalizeLandmarks(landmarks);
    const letter = normalized ? predictLetterFromTemplates(normalized) : "";

    updateWord(letter);
    setStatus(letter ? `Recognizing: ${letter}` : "No confident match");
  } else {
    currentLandmarks = null;
    updateWord("");
    setStatus("No hand detected");
  }

  requestAnimationFrame(predictWebcam);
}

async function startHandDetection() {
  if (!video || !canvas || !ctx || running) return;

  setStatus("Starting camera...");
  await startCamera();

  setStatus("Loading hand detector...");
  await createHandLandmarker();

  function setupCanvasSize() {
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
  }

  setupCanvasSize();
  running = true;
  setStatus("Ready");
  predictWebcam();
}

function captureCurrentTemplate() {
  if (!currentLandmarks) {
    setStatus("Show your hand first");
    return;
  }

  const normalized = normalizeLandmarks(currentLandmarks);
  if (!normalized) {
    setStatus("Could not normalize landmarks");
    return;
  }

  const selectedLetter = letterSelect ? letterSelect.value : "";
  if (!selectedLetter) return;

  if (!templates[selectedLetter]) {
    templates[selectedLetter] = [];
  }

  templates[selectedLetter].push(normalized);
  saveTemplates(templates);
  updateTemplateInfo();
  setStatus(`Captured template for ${selectedLetter}`);
}

function clearTemplates() {
  templates = {};
  saveTemplates(templates);
  updateTemplateInfo();
  setStatus("All templates cleared");
}

function bindButtons() {
  if (captureTemplateBtn) {
    captureTemplateBtn.addEventListener("click", captureCurrentTemplate);
  }

  if (clearTemplatesBtn) {
    clearTemplatesBtn.addEventListener("click", clearTemplates);
  }

  if (spaceBtn) {
    spaceBtn.addEventListener("click", () => {
      finalWord += " ";
      lastAcceptedLetter = "";
      stableLetter = "";
      stableCount = 0;
      if (wordOutputEl) wordOutputEl.value = finalWord;
    });
  }

  if (backspaceBtn) {
    backspaceBtn.addEventListener("click", () => {
      finalWord = finalWord.slice(0, -1);
      lastAcceptedLetter = "";
      stableLetter = "";
      stableCount = 0;
      if (wordOutputEl) wordOutputEl.value = finalWord;
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      finalWord = "";
      stableLetter = "";
      stableCount = 0;
      lastAcceptedLetter = "";
      if (wordOutputEl) wordOutputEl.value = "";
      if (predictedLetterEl) predictedLetterEl.innerText = "-";
      setStatus("Cleared");
    });
  }
}

function init() {
  updateTemplateInfo();
  bindButtons();
  if (video && canvas) {
    startHandDetection();
  }
}

init();

