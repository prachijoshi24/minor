// src/pages/ExposureLab.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Upload, 
  Download, 
  CheckCircle, 
  CheckCircle2,
  Save, 
  ArrowLeft, 
  Maximize2, 
  Minimize2,
  Move,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Scan,
  AlertCircle,
  Target
} from "lucide-react";
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import "../styles/global.css";

const STORAGE_KEY = "cbt_exposure_sessions";

export default function ExposureLab() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("scan"); // scan, place, view
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [objUrl, setObjUrl] = useState(null);
  const [savedSessions, setSavedSessions] = useState([]);
  const [scanStatus, setScanStatus] = useState("Position your device parallel to a flat surface");
  const [isSurfaceDetected, setIsSurfaceDetected] = useState(false);
  const [detectionConfidence, setDetectionConfidence] = useState(0);
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [motionData, setMotionData] = useState({ acceleration: { x: 0, y: 0, z: 0 }, rotationRate: { alpha: 0, beta: 0, gamma: 0 } });
  const [handPoseModel, setHandPoseModel] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [objectPosition, setObjectPosition] = useState({ x: 50, y: 50, scale: 1, rotation: 0 });
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Initialize saved sessions
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setSavedSessions(saved);
  }, []);

  // Initialize handpose model
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const model = await handpose.load();
        setHandPoseModel(model);
        setIsModelLoading(false);
      } catch (error) {
        console.error('Error loading handpose model:', error);
        setScanStatus("Error loading detection model");
      }
    };

    loadModel();

    return () => {
      if (handPoseModel) {
        handPoseModel.dispose();
      }
    };
  }, []);

  // Setup device motion and orientation
  useEffect(() => {
    const handleDeviceOrientation = (event) => {
      setDeviceOrientation({
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma
      });
    };

    const handleDeviceMotion = (event) => {
      setMotionData({
        acceleration: {
          x: event.accelerationIncludingGravity.x,
          y: event.accelerationIncludingGravity.y,
          z: event.accelerationIncludingGravity.z
        },
        rotationRate: {
          alpha: event.rotationRate?.alpha || 0,
          beta: event.rotationRate?.beta || 0,
          gamma: event.rotationRate?.gamma || 0
        }
      });
    };

    window.addEventListener('deviceorientation', handleDeviceOrientation);
    window.addEventListener('devicemotion', handleDeviceMotion);

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, []);

  // Setup camera and detection
  useEffect(() => {
    if (mode === 'scan' && videoRef.current && !isModelLoading) {
      navigator.mediaDevices
        .getUserMedia({ 
          video: { 
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        })
        .then(stream => {
          videoRef.current.srcObject = stream;
          videoRef.current.play().then(() => {
            startSurfaceDetection();
          }).catch(console.error);
        })
        .catch(err => {
          console.error("Camera access error:", err);
          setScanStatus("Camera access denied. Please allow camera permissions.");
        });

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (videoRef.current?.srcObject) {
          videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [mode, isModelLoading]);

  // Advanced surface detection with better validation
  const startSurfaceDetection = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let lastDetectionTime = 0;
    let stableFrames = 0;
    let lastStableConfidence = 0;

    const detectSurface = async () => {
      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        animationFrameRef.current = requestAnimationFrame(detectSurface);
        return;
      }

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      try {
        // 1. Edge Detection (Sobel operator) - More strict parameters
        const edgeAnalysis = await analyzeEdges(canvas, ctx);
        
        // 2. Feature Point Detection (using handpose model)
        const featurePoints = handPoseModel ? await detectFeaturePoints() : [];
        
        // 3. Motion and Orientation Analysis - Stricter requirements
        const motionStability = analyzeMotionStability();
        
        // 4. Calculate confidences with stricter weights
        const edgeConfidence = Math.min(1, edgeAnalysis.density * 1.5);
        const edgeVariance = Math.min(1, edgeAnalysis.variance * 2);
        const featureConfidence = Math.min(1, featurePoints.length / 15); // Require more features
        const motionConfidence = motionStability * 0.8; // Higher weight on stability
        
        // Calculate overall confidence with better validation
        let totalConfidence = (edgeConfidence * 0.3) + 
                             (edgeVariance * 0.2) + // Edge distribution matters
                             (featureConfidence * 0.2) + 
                             (motionConfidence * 0.3);
        
        // Require minimum edge variance to avoid flat colors
        if (edgeVariance < 0.2) {
          totalConfidence *= 0.5; // Penalize low variance (flat colors)
        }
        
        // Check for stability over time
        const now = Date.now();
        const isStable = Math.abs(totalConfidence - lastStableConfidence) < 0.1;
        
        if (isStable) {
          stableFrames++;
        } else {
          stableFrames = Math.max(0, stableFrames - 2);
        }
        
        // Only update confidence if we have stable readings
        if (stableFrames > 5 || now - lastDetectionTime > 1000) {
          setDetectionConfidence(totalConfidence);
          lastStableConfidence = totalConfidence;
          lastDetectionTime = now;
          stableFrames = 0;
        }
        
        // Update UI based on detection confidence with better feedback
        const isSurfaceDetected = totalConfidence > 0.7 && edgeVariance > 0.2;
        setIsSurfaceDetected(isSurfaceDetected);
        
        // Provide more specific feedback
        if (isSurfaceDetected) {
          setScanStatus("Surface detected! Tap to place object");
        } else {
          if (edgeVariance < 0.1) {
            setScanStatus("Move closer to a textured surface");
          } else if (motionConfidence < 0.5) {
            setScanStatus("Hold device steady");
          } else if (edgeConfidence < 0.3) {
            setScanStatus("Find a more defined surface");
          } else {
            const tips = [
              "Move device slowly across the surface",
              "Ensure good lighting conditions",
              "Point at a well-defined surface",
              "Get closer to the surface"
            ];
            setScanStatus(tips[Math.floor(Math.random() * tips.length)]);
          }
        }
      
        // Draw detection overlay with more detailed feedback
        drawDetectionOverlay(ctx, canvas.width, canvas.height, totalConfidence, featurePoints, edgeAnalysis);
      } catch (error) {
        console.error('Detection error:', error);
        setScanStatus("Adjusting detection...");
      }
      
      animationFrameRef.current = requestAnimationFrame(detectSurface);
    };
    
    detectSurface();
  };
  
  // Enhanced edge analysis with variance calculation
  const analyzeEdges = (canvas, ctx) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    const sobelData = new Uint8ClampedArray(data.length);
    
    // Calculate mean and variance of intensity
    let sum = 0;
    let sumSq = 0;
    let count = 0;
    
    // First pass: calculate mean
    for (let y = 1; y < height - 1; y += 2) {
      for (let x = 1; x < width - 1; x += 2) {
        const i = (y * width + x) * 4;
        const gray = getGray(data, x, y, width);
        sum += gray;
        sumSq += gray * gray;
        count++;
      }
    }
    
    const mean = sum / count;
    const variance = (sumSq / count) - (mean * mean);
    
    // Second pass: apply sobel with adaptive threshold
    const edgeThreshold = Math.max(30, mean * 0.5); // Adaptive threshold based on image brightness
    let edgeCount = 0;
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = (y * width + x) * 4;
        
        // Sobel kernels
        const gx = 
          -1 * getGray(data, x-1, y-1, width) + 
          1 * getGray(data, x+1, y-1, width) +
          -2 * getGray(data, x-1, y, width) +
          2 * getGray(data, x+1, y, width) +
          -1 * getGray(data, x-1, y+1, width) +
          1 * getGray(data, x+1, y+1, width);
          
        const gy = 
          -1 * getGray(data, x-1, y-1, width) +
          -2 * getGray(data, x, y-1, width) +
          -1 * getGray(data, x+1, y-1, width) +
          1 * getGray(data, x-1, y+1, width) +
          2 * getGray(data, x, y+1, width) +
          1 * getGray(data, x+1, y+1, width);
          
        const magnitude = Math.min(255, Math.sqrt(gx * gx + gy * gy));
        const edgeValue = magnitude > edgeThreshold ? 255 : 0;
        
        sobelData[i] = edgeValue;
        sobelData[i + 1] = edgeValue;
        sobelData[i + 2] = edgeValue;
        sobelData[i + 3] = 255;
        
        if (edgeValue > 0) edgeCount++;
      }
    }
    
    const edgeDensity = edgeCount / (width * height);
    const edgeVariance = variance / (255 * 255); // Normalize to 0-1 range
    
    return {
      density: edgeDensity,
      variance: edgeVariance,
      threshold: edgeThreshold
    };
  };
  
  // Detect feature points using handpose model
  const detectFeaturePoints = async () => {
    try {
      const predictions = await handPoseModel.estimateHands(videoRef.current);
      return predictions.length > 0 ? predictions[0].landmarks : [];
    } catch (error) {
      console.error('Error detecting feature points:', error);
      return [];
    }
  };
  
  // Analyze device motion and orientation
  const analyzeMotionStability = () => {
    // Check if device is relatively stable
    const { acceleration, rotationRate } = motionData;
    const { beta, gamma } = deviceOrientation;
    
    const accelerationMagnitude = Math.sqrt(
      acceleration.x * acceleration.x + 
      acceleration.y * acceleration.y + 
      acceleration.z * acceleration.z
    );
    
    const rotationMagnitude = Math.sqrt(
      (rotationRate.alpha || 0) ** 2 + 
      (rotationRate.beta || 0) ** 2 + 
      (rotationRate.gamma || 0) ** 2
    );
    
    // Check if device is relatively flat (parallel to ground)
    const isFlat = Math.abs(beta) < 30 && Math.abs(gamma) < 30;
    
    // Check if device is stable (not moving much)
    const isStable = accelerationMagnitude > 9 && accelerationMagnitude < 11; // Close to 1g
    const isNotRotating = rotationMagnitude < 5;
    
    return isFlat && isStable && isNotRotating ? 1 : 0;
  };
  
  // Draw detection overlay with visual feedback
  const drawDetectionOverlay = (ctx, width, height, confidence, featurePoints, edgeAnalysis) => {
    // Draw semi-transparent overlay
    ctx.fillStyle = `rgba(0, 0, 0, ${0.6 * (1 - confidence)})`;
    ctx.fillRect(0, 0, width, height);
    
    // Draw center reticle
    const centerX = width / 2;
    const centerY = height / 2;
    const size = Math.min(width, height) * 0.3;
    
    // Draw reticle
    ctx.strokeStyle = `hsl(${confidence * 120}, 80%, 50%)`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    // Outer circle
    ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
    
    // Crosshairs
    ctx.moveTo(centerX - size, centerY);
    ctx.lineTo(centerX + size, centerY);
    ctx.moveTo(centerX, centerY - size);
    ctx.lineTo(centerX, centerY + size);
    
    ctx.stroke();
    
    // Draw feature points if any
    if (featurePoints && featurePoints.length > 0) {
      ctx.fillStyle = '#4ade80';
      featurePoints.forEach(point => {
        ctx.beginPath();
        ctx.arc(point[0], point[1], 2, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
    
    // Draw confidence indicator
    const barWidth = size * 1.5;
    const barHeight = 8;
    const barX = centerX - barWidth / 2;
    const barY = centerY + size + 20;
    
    // Background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Progress
    ctx.fillStyle = `hsl(${confidence * 120}, 80%, 50%)`;
    ctx.fillRect(barX, barY, barWidth * confidence, barHeight);
    
    // Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.strokeRect(barX, barY, barWidth, barHeight);
  };

  // Helper function to get grayscale value
  const getGray = (data, x, y, width) => {
    const i = (y * width + x) * 4;
    return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  };

  // Calculate edge density in the center of the frame
  const calculateEdgeDensity = (data, width, height) => {
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const radius = Math.min(width, height) * 0.3;
    let edgePixels = 0;
    let totalPixels = 0;
    
    for (let y = centerY - radius; y < centerY + radius; y++) {
      for (let x = centerX - radius; x < centerX + radius; x++) {
        if (x >= 0 && x < width && y >= 0 && y < height) {
          const i = (y * width + x) * 4;
          if (data[i] > 50) { // Threshold for edge pixel
            edgePixels++;
          }
          totalPixels++;
        }
      }
    }
    
    return totalPixels > 0 ? edgePixels / totalPixels : 0;
  };

  // Handle canvas click to place object
  const handleCanvasClick = (e) => {
    if (mode === 'scan' && isSurfaceDetected) {
      setMode('place');
    } else if (mode === 'place') {
      // In place mode, clicking will position the object
      const rect = canvasRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setObjectPosition(prev => ({ ...prev, x, y }));
    }
  };

  // Handle file upload
  const handleUploadClick = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setObjUrl(url);
      setMode('place');
    }
  };

  // Handle download
  const handleDownload = () => {
    if (!objUrl) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = `exposure-${new Date().toISOString()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    
    img.src = objUrl;
  };

  // Save session
  const handleSaveSession = () => {
    if (!objUrl) return;
    
    const newSession = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      objUrl,
      position: objectPosition,
      notes: ""
    };
    
    const updatedSessions = [newSession, ...savedSessions].slice(0, 10);
    setSavedSessions(updatedSessions);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
  };

  // Load a saved session
  const loadSession = (session) => {
    setObjUrl(session.objUrl);
    setObjectPosition(session.position || { x: 50, y: 50, scale: 1, rotation: 0 });
    setMode('view');
  };

  // Adjust object position/scale/rotation
  const adjustObject = (action, value) => {
    setObjectPosition(prev => {
      switch (action) {
        case 'moveX':
          return { ...prev, x: Math.max(0, Math.min(100, prev.x + value)) };
        case 'moveY':
          return { ...prev, y: Math.max(0, Math.min(100, prev.y + value)) };
        case 'scale':
          return { ...prev, scale: Math.max(0.1, Math.min(3, prev.scale + value)) };
        case 'rotate':
          return { ...prev, rotation: (prev.rotation + value) % 360 };
        default:
          return prev;
      }
    });
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="text-slate-600 hover:bg-slate-100"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-slate-800 truncate">Exposure Therapy</h1>
                <p className="text-sm text-slate-500 truncate">
                  {mode === 'scan' ? 'Scan a surface' : mode === 'place' ? 'Place your object' : 'View session'}
                </p>
              </div>
            </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              leftIcon={isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            >
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera/Preview Section */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div 
                className="relative bg-black rounded-lg overflow-hidden"
                style={{ paddingBottom: '75%' }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`absolute inset-0 w-full h-full object-cover ${
                    mode !== 'scan' ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                
                <canvas
                  ref={canvasRef}
                  className={`absolute inset-0 w-full h-full ${
                    mode === 'scan' ? 'opacity-70' : 'opacity-0'
                  }`}
                  onClick={handleCanvasClick}
                />
                
                {mode === 'scan' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 pointer-events-none">
                    <div className="relative w-full h-full">
                      {/* Visual feedback will be drawn on canvas */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className={`p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 ${isSurfaceDetected ? 'bg-green-50 bg-opacity-30' : 'bg-blue-50 bg-opacity-30'}`}>
                          <div className="flex items-center justify-center mb-2">
                            <div className={`p-3 rounded-full ${isSurfaceDetected ? 'bg-green-100' : 'bg-blue-100'} bg-opacity-50`}>
                              {isSurfaceDetected ? (
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                              ) : (
                                <Scan className="h-8 w-8 text-blue-600 animate-pulse" />
                              )}
                            </div>
                          </div>
                          <div className="text-center px-4 py-2 bg-white bg-opacity-80 rounded-lg shadow-sm">
                            <p className="font-medium text-slate-800">{scanStatus}</p>
                            <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5">
                              <div 
                                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" 
                                style={{ width: `${detectionConfidence * 100}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              {Math.round(detectionConfidence * 100)}% surface confidence
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {objUrl && (mode === 'place' || mode === 'view') && (
                  <div 
                    className="absolute"
                    style={{
                      top: `${objectPosition.y}%`,
                      left: `${objectPosition.x}%`,
                      transform: 'translate(-50%, -50%)',
                      width: '50%',
                      maxWidth: '400px',
                      transition: 'all 0.2s ease-out'
                    }}
                  >
                    <img
                      src={objUrl}
                      alt="Exposure object"
                      className="w-full h-auto"
                      style={{
                        transform: `scale(${objectPosition.scale}) rotate(${objectPosition.rotation}deg)`,
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </div>
                )}
              </div>
            </Card>
            
            {mode === 'place' && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  onClick={() => adjustObject('moveY', -5)}
                  className="col-span-2"
                >
                  <Move className="h-4 w-4 mr-2" /> Move Up
                </Button>
                <Button
                  variant="outline"
                  onClick={() => adjustObject('moveY', 5)}
                  className="col-span-2"
                >
                  <Move className="h-4 w-4 mr-2" /> Move Down
                </Button>
                <Button
                  variant="outline"
                  onClick={() => adjustObject('moveX', -5)}
                  className="col-span-2"
                >
                  <Move className="h-4 w-4 mr-2" /> Move Left
                </Button>
                <Button
                  variant="outline"
                  onClick={() => adjustObject('moveX', 5)}
                  className="col-span-2"
                >
                  <Move className="h-4 w-4 mr-2" /> Move Right
                </Button>
                <Button
                  variant="outline"
                  onClick={() => adjustObject('scale', 0.1)}
                  disabled={objectPosition.scale >= 3}
                >
                  <ZoomIn className="h-4 w-4 mr-2" /> Zoom In
                </Button>
                <Button
                  variant="outline"
                  onClick={() => adjustObject('scale', -0.1)}
                  disabled={objectPosition.scale <= 0.2}
                >
                  <ZoomOut className="h-4 w-4 mr-2" /> Zoom Out
                </Button>
                <Button
                  variant="outline"
                  onClick={() => adjustObject('rotate', 15)}
                >
                  <RotateCw className="h-4 w-4 mr-2" /> Rotate
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setObjectPosition(prev => ({ ...prev, rotation: 0, scale: 1 }))}
                >
                  Reset
                </Button>
              </div>
            )}
          </div>
          
          {/* Controls Section */}
          <div className="space-y-4">
            {/* Upload Section */}
            <Card>
              <div className="p-4">
                <h3 className="text-lg font-medium text-slate-800 mb-3">Upload Object</h3>
                <div className="space-y-3">
                  <div>
                    <input
                      type="file"
                      id="upload-input"
                      accept="image/*"
                      onChange={handleUploadClick}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('upload-input').click()}
                      fullWidth
                      leftIcon={<Upload className="h-4 w-4" />}
                    >
                      Upload Image
                    </Button>
                  </div>
                  
                  <Button
                    variant="primary"
                    onClick={handleSaveSession}
                    disabled={!objUrl || mode === 'scan'}
                    fullWidth
                    leftIcon={<Save className="h-4 w-4" />}
                  >
                    Save Session
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleDownload}
                    disabled={!objUrl}
                    fullWidth
                    leftIcon={<Download className="h-4 w-4" />}
                  >
                    Download
                  </Button>
                </div>
              </div>
            </Card>
            
            {/* Saved Sessions */}
            {savedSessions.length > 0 && (
              <Card>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-slate-800">Saved Sessions</h3>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">
                      {savedSessions.length} saved
                    </span>
                  </div>
                  <div className="space-y-2">
                    {savedSessions.map(session => (
                      <div 
                        key={session.id} 
                        className="flex items-center p-3 bg-white rounded-lg hover:bg-slate-50 cursor-pointer transition-colors duration-150 border border-slate-100 shadow-sm"
                        onClick={() => loadSession(session)}
                      >
                        <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                          {session.objUrl && (
                            <img 
                              src={session.objUrl} 
                              alt="Session thumbnail" 
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">
                            Session {new Date(session.timestamp).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {new Date(session.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}