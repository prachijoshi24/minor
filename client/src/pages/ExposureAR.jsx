import React, { useEffect, useState } from "react";
import "../exposure/exposure-ar.css";

const ASSET_PATH = process.env.PUBLIC_URL + "/exposure-assets/";

export default function ExposureAR() {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [selected, setSelected] = useState("spider.png");
  const [customUrl, setCustomUrl] = useState(null);
  const [scale, setScale] = useState(0.6);
  const [rotation, setRotation] = useState(0);
  const [yOffset, setYOffset] = useState(0);
  const [visible, setVisible] = useState(true);

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

  // Apply updates to placed object
  useEffect(() => {
    if (!scriptsLoaded) return;
    const el = document.querySelector("#fear-object");
    const container = document.querySelector("#fear-object-container");
    if (!el || !container) return;
    
    const src = customUrl ? customUrl : ASSET_PATH + selected;
    el.setAttribute("src", src);
    container.setAttribute("scale", `${scale} ${scale} ${scale}`);
    container.setAttribute("rotation", `-90 ${rotation} 0`);
    container.setAttribute("position", `0 ${yOffset} -2`);
    el.setAttribute("visible", visible ? "true" : "false");
    
    // Add click handler for placing the object
    const scene = document.querySelector('a-scene');
    if (scene) {
      scene.addEventListener('click', (evt) => {
        const reticle = document.querySelector('#reticle');
        if (reticle && evt.detail.intersection) {
          const point = evt.detail.intersection.point;
          container.setAttribute('position', `${point.x} ${point.y + yOffset} ${point.z}`);
        }
      });
    }
  }, [scriptsLoaded, selected, customUrl, scale, rotation, yOffset, visible]);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCustomUrl(url);
    setSelected(null);
  };

  return (
    <div className="ar-container">
      <header className="ar-header">
        <h1 className="title">Exposure Therapy AR 🌿</h1>
        <button className="btn" onClick={() => window.location.reload()}>
          Reload AR
        </button>
      </header>

      <div className="ar-body">
        <aside className="sidebar">
          <h2>Pick object</h2>

          {["spider.png","snake.png","needle.png","balloon.png","heart-pink.png"].map(a => (
            <label key={a} className={`asset ${selected === a ? "active" : ""}`}>
              <input
                type="radio"
                checked={selected === a && !customUrl}
                onChange={() => { setSelected(a); setCustomUrl(null); }}
              />
              <img src={ASSET_PATH + a} alt="" />
              {a.replace(".png","")}
            </label>
          ))}

          <div style={{marginTop:"12px"}}>
            <div className="label">Upload custom</div>
            <input type="file" accept="image/*" onChange={handleUpload}/>
          </div>

          <div className="ctrl">
            <div className="label">Scale</div>
            <input type="range" min="0.2" max="2" step="0.01"
              value={scale} onChange={e=>setScale(Number(e.target.value))}/>
          </div>

          <div className="ctrl">
            <div className="label">Rotation</div>
            <input type="range" min="0" max="360" value={rotation}
              onChange={e=>setRotation(Number(e.target.value))}/>
          </div>

          <div className="ctrl">
            <div className="label">Vertical Offset</div>
            <input type="range" min="-0.5" max="1" step="0.01" value={yOffset}
              onChange={e=>setYOffset(Number(e.target.value))}/>
          </div>

          <button className="btn ghost" onClick={()=>setVisible(v=>!v)}>
            {visible ? "Hide object" : "Show object"}
          </button>

          <div className="marker-note">
            <p>Tap on surfaces to place objects</p>
            <p>Move your device to detect surfaces</p>
          </div>
        </aside>

        <div className="viewer">
          {!scriptsLoaded && <div className="loading">Loading AR Engine...</div>}

          <a-scene
            embedded
            vr-mode-ui="enabled: false"
            renderer="logarithmicDepthBuffer: true; antialias: true"
            arjs="sourceType: webcam; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
          >
            <a-assets>
              <img id="spiderImg" src={ASSET_PATH + "spider.png"} alt="" />
              <img id="snakeImg" src={ASSET_PATH + "snake.png"} alt="" />
              <img id="needleImg" src={ASSET_PATH + "needle.png"} alt="" />
              <img id="balloonImg" src={ASSET_PATH + "balloon.png"} alt="" />
              <img id="heartImg" src={ASSET_PATH + "heart-pink.png"} alt="" />
            </a-assets>

            {/* Add a reticle for better UX */}
            <a-entity id="reticle" visible="false" position="0 0 -1" geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
              material="color: cyan; shader: flat" cursor="rayOrigin: mouse" raycaster="objects: .clickable">
            </a-entity>

            {/* Add a plane for surface detection */}
            <a-entity id="floor" visible="false" position="0 0 0" rotation="-90 0 0" geometry="primitive: plane; width: 100; height: 100"
              material="color: #222; opacity: 0.5; transparent: true;" static-body>
            </a-entity>

            {/* The fear object that will be placed on surfaces */}
            <a-entity id="fear-object-container" position="0 0 -2">
              <a-image id="fear-object"
                src={ASSET_PATH + "spider.png"}
                rotation="-90 0 0"
                scale="0.6 0.6 0.6"
                transparent="true"
                class="clickable"
                grabbable
                stretchable
              ></a-image>
            </a-entity>

            <a-entity camera look-controls wasd-controls="enabled: false"></a-entity>
          </a-scene>
        </div>
      </div>
    </div>
  );
}