import React, { useMemo, useRef, useState } from "react";

const COLORS = ["#2563eb", "#16a34a", "#ea580c"];
const NAMES = ["Cervical", "Axial", "Incisal / occlusal"];

const calculateAngle = (a, vertex, b) => {
  const first = { x: a.x - vertex.x, y: a.y - vertex.y };
  const second = { x: b.x - vertex.x, y: b.y - vertex.y };
  const denominator = Math.hypot(first.x, first.y) * Math.hypot(second.x, second.y);
  if (!denominator) return 0;
  const cosine = (first.x * second.x + first.y * second.y) / denominator;
  return Math.acos(Math.max(-1, Math.min(1, cosine))) * 180 / Math.PI;
};

const AngleImageAnnotator = ({ label, value, onChange }) => {
  const imageRef = useRef(null);
  const [points, setPoints] = useState([]);

  const angles = useMemo(() => [0, 1, 2].map((index) => {
    const triple = points.slice(index * 3, index * 3 + 3);
    return triple.length === 3 ? calculateAngle(triple[0], triple[1], triple[2]) : null;
  }), [points]);

  const chooseImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPoints([]);
      onChange({ image: reader.result, angles: [] });
    };
    reader.readAsDataURL(file);
  };

  const addPoint = (event) => {
    if (points.length >= 9) return;
    const bounds = imageRef.current.getBoundingClientRect();
    const next = [...points, {
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    }];
    setPoints(next);

    if (next.length % 3 === 0) {
      const calculated = [0, 1, 2].map((index) => {
        const triple = next.slice(index * 3, index * 3 + 3);
        return triple.length === 3 ? Number(calculateAngle(triple[0], triple[1], triple[2]).toFixed(2)) : null;
      });
      onChange({ image: value.image, angles: calculated.filter((angle) => angle !== null) });
    }
  };

  const undo = () => {
    const next = points.slice(0, -1);
    setPoints(next);
    const calculated = [0, 1, 2].map((index) => {
      const triple = next.slice(index * 3, index * 3 + 3);
      return triple.length === 3 ? Number(calculateAngle(triple[0], triple[1], triple[2]).toFixed(2)) : null;
    });
    onChange({ image: value.image, angles: calculated.filter((angle) => angle !== null) });
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900">{label} view</h3>
          <p className="text-xs text-gray-500">Click endpoint → vertex → endpoint for each angle.</p>
        </div>
        <label className="cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700">
          Choose image
          <input className="hidden" type="file" accept="image/*" onChange={chooseImage} />
        </label>
      </div>

      {value.image ? (
        <>
          <div className="relative overflow-hidden rounded-lg bg-gray-950">
            <img ref={imageRef} src={value.image} onClick={addPoint}
                 className="block max-h-[420px] w-full cursor-crosshair object-contain"
                 alt={`${label} tooth`} />
            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {[0, 1, 2].map((group) => {
                const triple = points.slice(group * 3, group * 3 + 3);
                const path = triple.map((point) => `${point.x},${point.y}`).join(" ");
                return <polyline key={group} points={path} fill="none" stroke={COLORS[group]} strokeWidth="0.7" />;
              })}
              {points.map((point, index) => (
                <circle key={index} cx={point.x} cy={point.y} r="1.2"
                        fill={COLORS[Math.floor(index / 3)]} stroke="white" strokeWidth="0.35" />
              ))}
            </svg>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            {NAMES.map((name, index) => (
              <div key={name} className="rounded-lg bg-gray-50 p-2">
                <span className="font-medium" style={{ color: COLORS[index] }}>{name}</span>
                <div className="mt-1 text-gray-700">{angles[index] === null ? "3 points required" : `${angles[index].toFixed(1)}°`}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-xs">
            <span className="text-gray-500">{points.length}/9 landmarks selected</span>
            <button type="button" onClick={undo} disabled={!points.length}
                    className="font-medium text-blue-600 disabled:text-gray-300">Undo point</button>
          </div>
        </>
      ) : <div className="grid h-48 place-items-center rounded-lg border-2 border-dashed border-gray-200 text-sm text-gray-400">Select a tooth image</div>}
    </section>
  );
};

export default AngleImageAnnotator;
