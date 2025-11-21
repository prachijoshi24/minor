import React, { useEffect, useState } from "react";
import "../exposure/surface-detection-ar.css";

const ASSET_PATH = process.env.PUBLIC_URL + "/exposure-assets/";

export default function SurfaceDetectionAR() {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [surfaceDetected, setSurfaceDetected] = useState(false);
  const [objectPlaced, setObjectPlaced] = useState(false);
  const [objectPosition, setObjectPosition] = useState("0 0 -1");

  // Load A-Frame + AR.js
  useEffect(() => {
    if (window.AFRAME && window.ARJS) {
      setScriptsLoaded(true);
      return;
    }

    const s1 = document.createElement("script");
    s1.src = "https://aframe.io/releases/1.4.0/aframe.min.js";
    document.head.appendChild(s1);

    const s2 = document.createElement("script");
    s2.src = "https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/aframe/build/aframe-ar.js";
    document.head.appendChild(s2);

    s2.onload = () => setScriptsLoaded(true);
  }, []);

  // Handle surface detection and object placement
  useEffect(() => {
    if (!scriptsLoaded) return;

    const scene = document.querySelector('a-scene');
    if (!scene) return;

    // Show instructions when surface is detected
    scene.addEventListener('markerFound', () => {
      setSurfaceDetected(true);
    });

    // Hide instructions when surface is lost
    scene.addEventListener('markerLost', () => {
      setSurfaceDetected(false);
    });

    // Handle tap to place object
    scene.addEventListener('click', (evt) => {
      if (surfaceDetected && evt.detail.intersection) {
        const point = evt.detail.intersection.point;
        setObjectPosition(`${point.x} ${point.y} ${point.z}`);
        setObjectPlaced(true);
      }
    });
  }, [scriptsLoaded, surfaceDetected]);

  return (
    <div className="ar-container">
      <header className="ar-header">
        <h1>Surface Detection AR</h1>
      </header>

      <div className="ar-body">
        <div className="viewer">
          {!scriptsLoaded && (
            <div className="loading">Loading AR Engine...</div>
          )}

          <a-scene
            vr-mode-ui="enabled: false"
            renderer="logarithmicDepthBuffer: true;"
            arjs="sourceType: webcam; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
            gesture-detector
          >
            {/* Surface detection plane */}
            <a-entity
              id="surface"
              geometry="primitive: plane; width: 100; height: 100;"
              rotation="-90 0 0"
              material="color: #7BC8A4; opacity: 0.5; transparent: true;"
              visible={surfaceDetected}
              static-body
            ></a-entity>

            {/* Object to be placed */}
            {objectPlaced && (
              <a-entity
                id="ar-object"
                position={objectPosition}
                gltf-model={`${ASSET_PATH}spider.gltf`}
                scale="0.05 0.05 0.05"
                shadow
              ></a-entity>
            )}

            {/* Reticle for placement */}
            <a-entity
              id="reticle"
              visible={surfaceDetected && !objectPlaced}
              position="0 0 -1"
              geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
              material="color: cyan; shader: flat"
              cursor="rayOrigin: mouse"
              raycaster="objects: #surface"
            ></a-entity>

            <a-entity camera look-controls wasd-controls="enabled: false"></a-entity>
          </a-scene>

          {/* Instructions overlay */}
          {!objectPlaced && (
            <div className="instructions">
              {!surfaceDetected ? (
                <p>Move your device to detect a flat surface</p>
              ) : (
                <p>Tap to place the object</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
