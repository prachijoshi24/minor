// client/src/pages/ExposurePage.js
import React, { useRef, useState } from "react";

/*
Simple image placement/scale demo:
- upload an image,
- click to place it on canvas area,
- use sliders to scale and rotate.
*/
export default function ExposurePage() {
  const fileRef = useRef();
  const [imgSrc, setImgSrc] = useState(null);
  const [placed, setPlaced] = useState(null);
  const [scale, setScale] = useState(1);
  const [rot, setRot] = useState(0);

  function onFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setImgSrc(url);
    setPlaced(null);
  }

  function place(ev) {
    if (!imgSrc) return;
    const rect = ev.currentTarget.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    setPlaced({ x, y });
  }

  return (
    <div className="page exposure">
      <h2>Exposure Lab (visual)</h2>
      <p className="muted">Upload an image of a safe replica/object and place/scale it to practice visual exposure.</p>

      <div className="exp-controls">
        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} />
        <div className="slider-row">
          <label>Scale</label>
          <input type="range" min="0.2" max="2.0" step="0.05" value={scale} onChange={e => setScale(e.target.value)} />
        </div>
        <div className="slider-row">
          <label>Rotate</label>
          <input type="range" min="-180" max="180" value={rot} onChange={e => setRot(e.target.value)} />
        </div>
      </div>

      <div className="exp-canvas" onClick={place}>
        {imgSrc && placed && (
          <img
            src={imgSrc}
            alt="placed"
            style={{
              position: "absolute",
              left: placed.x,
              top: placed.y,
              transform: `translate(-50%, -50%) scale(${scale}) rotate(${rot}deg)`,
              maxWidth: 300,
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
              borderRadius: 10,
            }}
          />
        )}

        {imgSrc && !placed && (
          <div className="hint">Click anywhere to place the image</div>
        )}

        {!imgSrc && <div className="hint">Upload an image to begin</div>}
      </div>
    </div>
  );
}