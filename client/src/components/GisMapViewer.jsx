import React, { useState, useEffect, useRef } from 'react';
import { 
  Map as MapIcon, 
  Layers, 
  Maximize2, 
  RotateCcw, 
  Play, 
  Pause, 
  Sun, 
  Moon, 
  Compass, 
  Navigation, 
  AlertTriangle, 
  LifeBuoy, 
  Building2, 
  Waves, 
  Mountain, 
  PhoneCall, 
  Search, 
  Sliders, 
  Eye, 
  ShieldCheck, 
  Droplets,
  Activity,
  Flame,
  CheckCircle2,
  X,
  Crosshair
} from 'lucide-react';
import { TricolorStrip } from './Emblems';

// Pre-defined Geographic Disaster Hotspots across North East India
export const AFFECTED_AREAS = [
  {
    id: 'all',
    name: 'All North East Region (Regional Overview)',
    state: '8 North Eastern States',
    center: { lat: 26.20, lng: 92.90 },
    zoom: 1,
    baseElevation: 80,
    maxElevation: 1950,
    hazardType: 'Multi-Hazard Disaster Watch',
    waterLevelBaseline: 1.2,
    description: 'Regional monitoring across Brahmaputra basin, Barak valley, and Meghalaya-Nagaland hill corridors.'
  },
  {
    id: 'guwahati',
    name: 'Guwahati & Kamrup Metro (Brahmaputra Flood Plain)',
    state: 'Assam',
    center: { lat: 26.1865, lng: 91.7483 },
    zoom: 2.2,
    baseElevation: 48,
    maxElevation: 280,
    hazardType: 'Severe Inundation & Urban Submersion',
    waterLevelBaseline: 2.4,
    description: 'Brahmaputra running 0.44m above danger level; Hatigaon, Bharalumukh, and Pandu riverbanks submerged.'
  },
  {
    id: 'silchar',
    name: 'Silchar & Cachar Basin (Barak River Valley)',
    state: 'Assam',
    center: { lat: 24.8197, lng: 92.7972 },
    zoom: 2.4,
    baseElevation: 22,
    maxElevation: 140,
    hazardType: 'Extreme River Overtopping (Catastrophic)',
    waterLevelBaseline: 3.8,
    description: 'Barak water level at 20.45m (+0.62m over danger). Rangirkhari and Tarapur urban wards waterlogged 4-6 feet.'
  },
  {
    id: 'sonapur',
    name: 'Sonapur Tunnel & Umkiang (NH-06 Hill Cut)',
    state: 'Meghalaya / Assam border',
    center: { lat: 25.1150, lng: 92.3550 },
    zoom: 2.5,
    baseElevation: 580,
    maxElevation: 1420,
    hazardType: 'Major Landslide & Rockfall Debris Flow',
    waterLevelBaseline: 0.5,
    description: 'Massive slope collapse blocking NH-06 Sonapur Tunnel portal; steep cut slopes continuously sliding.'
  },
  {
    id: 'dhemaji',
    name: 'Dhemaji & Gai River Plain (Breach Inundation)',
    state: 'Assam',
    center: { lat: 27.4812, lng: 94.5786 },
    zoom: 2.3,
    baseElevation: 82,
    maxElevation: 320,
    hazardType: 'Embankment Washout & Flash Inundation',
    waterLevelBaseline: 2.8,
    description: 'Gai River embankment breach of 30 meters has submerged rural link road and downstream agrarian villages.'
  },
  {
    id: 'paglapahar',
    name: 'Paglapahar - Phesama Stretch (NH-29 Nagaland)',
    state: 'Nagaland',
    center: { lat: 25.7500, lng: 93.8800 },
    zoom: 2.4,
    baseElevation: 340,
    maxElevation: 1680,
    hazardType: 'Highway Road Subsidence & Stone Fall',
    waterLevelBaseline: 0.8,
    description: 'Sinking road carriageway between Dimapur and Kohima. Heavy trucks restricted; single-lane escort active.'
  }
];

export default function GisMapViewer({
  shelters = [],
  roads = [],
  requests = [],
  riverGauges = [],
  initialAreaId = 'all',
  onSelectEntity
}) {
  const [selectedAreaId, setSelectedAreaId] = useState(initialAreaId);
  const [viewMode, setViewMode] = useState('2d'); // '2d', '3d', 'split'
  const [activeLayers, setActiveLayers] = useState({
    inundation: true,
    shelters: true,
    requests: true,
    roads: true,
    gauges: true,
    contours: true
  });
  
  // 3D Simulation Controls
  const [simWaterRise, setSimWaterRise] = useState(2.2); // meters above normal
  const [cameraAngle, setCameraAngle] = useState({ azimuth: 35, elevation: 38, zoom: 1.0 });
  const [renderMode, setRenderMode] = useState('topo'); // 'topo', 'satellite', 'thermal'
  const [isRotating, setIsRotating] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);
  const [measureTarget, setMeasureTarget] = useState(null);
  
  // Canvas Refs
  const canvas2dRef = useRef(null);
  const canvas3dRef = useRef(null);
  const animFrameRef = useRef(null);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const activeArea = AFFECTED_AREAS.find(a => a.id === selectedAreaId) || AFFECTED_AREAS[0];

  // Set water level baseline when selected area changes
  useEffect(() => {
    setSimWaterRise(activeArea.waterLevelBaseline);
    setSelectedPin(null);
  }, [selectedAreaId]);

  // Coordinate Conversion Helper for 2D Canvas (Mercator projection window)
  const geoBounds = {
    minLat: 24.0,
    maxLat: 28.5,
    minLng: 90.0,
    maxLng: 96.0
  };

  const projectTo2D = (lat, lng, width, height) => {
    // Focus bounds depending on area
    let minLat = geoBounds.minLat;
    let maxLat = geoBounds.maxLat;
    let minLng = geoBounds.minLng;
    let maxLng = geoBounds.maxLng;

    if (activeArea.id !== 'all') {
      const span = 1.4 / activeArea.zoom;
      minLat = activeArea.center.lat - span;
      maxLat = activeArea.center.lat + span;
      minLng = activeArea.center.lng - span * 1.3;
      maxLng = activeArea.center.lng + span * 1.3;
    }

    const x = ((lng - minLng) / (maxLng - minLng)) * width;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * height;
    return { x, y, visible: x >= 0 && x <= width && y >= 0 && y <= height };
  };

  // --------------------------------------------------------------------------
  // 2D CANVAS GIS RENDERING ENGINE
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (viewMode === '3d') return;
    const canvas = canvas2dRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animTime = 0;
    let frameId;

    const render2D = () => {
      animTime += 0.03;
      const width = canvas.width;
      const height = canvas.height;

      // Clear Canvas Background (Government Map Slate)
      ctx.fillStyle = '#0a192f';
      ctx.fillRect(0, 0, width, height);

      // 1. Grid Lines (Lat/Lng Grid)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      const gridStep = 45;
      for (let x = 0; x < width; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Waterways & Rivers (Brahmaputra & Barak River Corridors)
      const riverPoints = [
        { lat: 28.2, lng: 95.8 },
        { lat: 27.6, lng: 94.8 },
        { lat: 26.9, lng: 93.4 },
        { lat: 26.19, lng: 91.75 },
        { lat: 26.05, lng: 90.6 }
      ];

      ctx.beginPath();
      riverPoints.forEach((p, idx) => {
        const pt = projectTo2D(p.lat, p.lng, width, height);
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = activeArea.id === 'all' ? 8 : 16;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Barak River Path
      const barakPoints = [
        { lat: 25.1, lng: 93.2 },
        { lat: 24.82, lng: 92.8 },
        { lat: 24.65, lng: 92.4 }
      ];
      ctx.beginPath();
      barakPoints.forEach((p, idx) => {
        const pt = projectTo2D(p.lat, p.lng, width, height);
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = activeArea.id === 'all' ? 6 : 14;
      ctx.stroke();

      // 3. Flood Inundation Buffer Overlay (If Layer Active)
      if (activeLayers.inundation) {
        const floodZones = [
          { lat: 26.18, lng: 91.75, radius: 45, name: 'Guwahati Urban Basin' },
          { lat: 24.82, lng: 92.80, radius: 55, name: 'Barak / Silchar Inundation' },
          { lat: 27.48, lng: 94.57, radius: 40, name: 'Dhemaji Submerged Lowlands' },
          { lat: 26.02, lng: 92.85, radius: 35, name: 'Kampur Kopili Flood Zone' }
        ];

        floodZones.forEach(fz => {
          const pt = projectTo2D(fz.lat, fz.lng, width, height);
          if (pt.visible) {
            const pulse = Math.sin(animTime * 2) * 4;
            const grad = ctx.createRadialGradient(pt.x, pt.y, 5, pt.x, pt.y, fz.radius + pulse);
            grad.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
            grad.addColorStop(0.6, 'rgba(249, 115, 22, 0.25)');
            grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, fz.radius + pulse, 0, Math.PI * 2);
            ctx.fill();

            // Label
            ctx.fillStyle = '#fca5a5';
            ctx.font = '10px Inter, sans-serif';
            ctx.fillText(`🌊 ${fz.name}`, pt.x - 40, pt.y - fz.radius - 6);
          }
        });
      }

      // 4. Highway Lines & Blockages (If Layer Active)
      if (activeLayers.roads) {
        roads.forEach(r => {
          // Representative road center
          let lat = 26.0;
          let lng = 92.0;
          if (r.id === 'rd-001') { lat = 25.1150; lng = 92.3550; }
          if (r.id === 'rd-002') { lat = 25.7500; lng = 93.8800; }
          if (r.id === 'rd-003') { lat = 26.1880; lng = 91.7450; }
          if (r.id === 'rd-004') { lat = 27.4600; lng = 94.5500; }
          if (r.id === 'rd-005') { lat = 24.4200; lng = 94.0200; }

          const pt = projectTo2D(lat, lng, width, height);
          if (pt.visible) {
            ctx.fillStyle = r.status === 'CLOSED' ? '#ef4444' : r.status === 'PARTIAL' ? '#f59e0b' : '#10b981';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();

            // Road Marker text
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 9px monospace';
            ctx.fillText(r.roadName.split(' ')[0], pt.x + 10, pt.y + 3);
          }
        });
      }

      // 5. Safe Relief Camps & Shelters (If Layer Active)
      if (activeLayers.shelters) {
        shelters.forEach(s => {
          if (!s.coordinates) return;
          const pt = projectTo2D(s.coordinates.lat, s.coordinates.lng, width, height);
          if (pt.visible) {
            // Draw green shield circle
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Inner icon dot
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
            ctx.fill();

            // Label with bed count
            ctx.fillStyle = '#a7f3d0';
            ctx.font = 'bold 9px Inter, sans-serif';
            ctx.fillText(`🏥 ${s.name.split(' ')[0]} (${s.availableSpace} beds)`, pt.x + 11, pt.y + 3);
          }
        });
      }

      // 6. Citizen SOS Emergency Inquiries (If Layer Active)
      if (activeLayers.requests) {
        requests.forEach(req => {
          if (!req.coordinates) return;
          const pt = projectTo2D(req.coordinates.lat, req.coordinates.lng, width, height);
          if (pt.visible) {
            const isCrit = req.urgency === 'CRITICAL_SOS';
            const pulse = (Math.sin(animTime * 4) + 1) * 3;

            // Outer Pulse Ring
            ctx.strokeStyle = isCrit ? 'rgba(239, 68, 68, 0.7)' : 'rgba(245, 158, 11, 0.7)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 8 + pulse, 0, Math.PI * 2);
            ctx.stroke();

            // Core Pin
            ctx.fillStyle = isCrit ? '#dc2626' : '#d97706';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Victim counter badge
            ctx.fillStyle = '#fef08a';
            ctx.font = 'bold 9px sans-serif';
            ctx.fillText(`🚨 SOS: ${req.requesterName.split(' ')[0]} (${req.peopleCount} ppl)`, pt.x + 10, pt.y - 6);
          }
        });
      }

      // 7. Distance Measurement / Shelter Radial Line
      if (measureTarget) {
        const startPt = projectTo2D(measureTarget.lat, measureTarget.lng, width, height);
        if (measureTarget.nearestShelter && measureTarget.nearestShelter.coordinates) {
          const endPt = projectTo2D(
            measureTarget.nearestShelter.coordinates.lat,
            measureTarget.nearestShelter.coordinates.lng,
            width,
            height
          );
          ctx.strokeStyle = '#38bdf8';
          ctx.setLineDash([5, 4]);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(startPt.x, startPt.y);
          ctx.lineTo(endPt.x, endPt.y);
          ctx.stroke();
          ctx.setLineDash([]);

          // Midpoint distance label
          const midX = (startPt.x + endPt.x) / 2;
          const midY = (startPt.y + endPt.y) / 2;
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(midX - 25, midY - 10, 50, 18);
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 10px monospace';
          ctx.fillText(`${measureTarget.distanceKm} km`, midX - 18, midY + 3);
        }
      }

      frameId = requestAnimationFrame(render2D);
    };

    render2D();
    return () => cancelAnimationFrame(frameId);
  }, [viewMode, activeArea, activeLayers, shelters, roads, requests, measureTarget]);

  // Handle 2D Canvas Click to Identify Nearest Shelter or Pin
  const handleCanvas2DClick = (e) => {
    const canvas = canvas2dRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Check if clicked near an SOS request
    for (let req of requests) {
      if (req.coordinates) {
        const pt = projectTo2D(req.coordinates.lat, req.coordinates.lng, canvas.width, canvas.height);
        const dist = Math.hypot(pt.x - clickX, pt.y - clickY);
        if (dist <= 18) {
          handleSelectPin({ type: 'sos', data: req, lat: req.coordinates.lat, lng: req.coordinates.lng });
          return;
        }
      }
    }

    // Check if clicked near a Shelter
    for (let s of shelters) {
      if (s.coordinates) {
        const pt = projectTo2D(s.coordinates.lat, s.coordinates.lng, canvas.width, canvas.height);
        const dist = Math.hypot(pt.x - clickX, pt.y - clickY);
        if (dist <= 18) {
          handleSelectPin({ type: 'shelter', data: s, lat: s.coordinates.lat, lng: s.coordinates.lng });
          return;
        }
      }
    }
  };

  const handleSelectPin = (pinInfo) => {
    setSelectedPin(pinInfo);
    // Find nearest shelter
    if (shelters.length > 0) {
      let nearest = null;
      let minDistance = Infinity;
      shelters.forEach(s => {
        if (s.coordinates) {
          // Haversine approx
          const d = Math.hypot(s.coordinates.lat - pinInfo.lat, (s.coordinates.lng - pinInfo.lng) * 1.1) * 111;
          if (d < minDistance) {
            minDistance = d;
            nearest = s;
          }
        }
      });
      setMeasureTarget({
        lat: pinInfo.lat,
        lng: pinInfo.lng,
        nearestShelter: nearest,
        distanceKm: Math.round(minDistance * 10) / 10
      });
    }
  };

  // --------------------------------------------------------------------------
  // 3D TOPOGRAPHIC & FLOOD INUNDATION ENGINE
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (viewMode === '2d') return;
    const canvas = canvas3dRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rotAngle = cameraAngle.azimuth;
    let frameId;

    // 3D Terrain Grid Dimensions
    const GRID_SIZE = 28;
    const SPACING = 14;

    const render3D = () => {
      if (isRotating) {
        rotAngle = (rotAngle + 0.35) % 360;
      } else {
        rotAngle = cameraAngle.azimuth;
      }

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background Sky / Space gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (renderMode === 'thermal') {
        bgGrad.addColorStop(0, '#000000');
        bgGrad.addColorStop(1, '#050c1a');
      } else {
        bgGrad.addColorStop(0, '#020617');
        bgGrad.addColorStop(0.7, '#082f49');
        bgGrad.addColorStop(1, '#0f172a');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Isometric Projection transformation math
      const rad = (rotAngle * Math.PI) / 180;
      const cosR = Math.cos(rad);
      const sinR = Math.sin(rad);
      const pitchRad = (cameraAngle.elevation * Math.PI) / 180;
      const cosP = Math.cos(pitchRad);
      const sinP = Math.sin(pitchRad);

      const centerX = width / 2;
      const centerY = height * 0.58;
      const zoom = cameraAngle.zoom;

      // Project 3D World point (x, y, z) into 2D screen coordinates
      const project3D = (wx, wy, wz) => {
        // Rotate around Y (Azimuth)
        const rx = wx * cosR - wy * sinR;
        const ry = wx * sinR + wy * cosR;
        const rz = wz;

        // Tilt around X (Elevation / Pitch)
        const py = ry * cosP - rz * sinP;
        const pz = ry * sinP + rz * cosP;

        const screenX = centerX + rx * SPACING * zoom;
        const screenY = centerY + py * SPACING * zoom * 0.55 - pz * zoom;
        return { x: screenX, y: screenY, depth: ry };
      };

      // Elevation Heightmap Generation based on active area
      const getHeight = (i, j) => {
        const u = (i - GRID_SIZE / 2) / (GRID_SIZE / 2);
        const v = (j - GRID_SIZE / 2) / (GRID_SIZE / 2);

        // Valley and River Trough equation
        const riverTrough = Math.sin(u * 2.5 + v) * 12;
        // Mountain Ridgeline equation
        const ridge = Math.cos(u * 1.8) * Math.sin(v * 2.2) * 35;
        // Hill Slopes
        const slope = (u * 15 - v * 20);

        let h = 20 + ridge - riverTrough + slope;
        if (activeArea.id === 'sonapur' || activeArea.id === 'paglapahar') {
          // Steep hill cuts
          h = 30 + Math.abs(u) * 45 + Math.sin(v * 3) * 20;
        } else if (activeArea.id === 'silchar') {
          // Deep bowl river basin
          h = 14 + (u * u + v * v) * 18 - 8;
        }
        return Math.max(h, 0);
      };

      // Generate 3D Grid Polygons with Depth Sorting
      const polygons = [];
      const waterLevelHeight = 12 + simWaterRise * 6.5;

      for (let i = 0; i < GRID_SIZE - 1; i++) {
        for (let j = 0; j < GRID_SIZE - 1; j++) {
          const x0 = i - GRID_SIZE / 2;
          const y0 = j - GRID_SIZE / 2;

          const h00 = getHeight(i, j);
          const h10 = getHeight(i + 1, j);
          const h11 = getHeight(i + 1, j + 1);
          const h01 = getHeight(i, j + 1);

          const p00 = project3D(x0, y0, h00);
          const p10 = project3D(x0 + 1, y0, h10);
          const p11 = project3D(x0 + 1, y0 + 1, h11);
          const p01 = project3D(x0, y0 + 1, h01);

          const avgDepth = (p00.depth + p10.depth + p11.depth + p01.depth) / 4;
          const avgHeight = (h00 + h10 + h11 + h01) / 4;
          const isSubmerged = avgHeight <= waterLevelHeight;

          polygons.push({
            p0: p00,
            p1: p10,
            p2: p11,
            p3: p01,
            depth: avgDepth,
            height: avgHeight,
            isSubmerged,
            i,
            j
          });
        }
      }

      // Sort polygons from back to front (Painter's Algorithm)
      polygons.sort((a, b) => b.depth - a.depth);

      // Render 3D Terrain Polygons
      polygons.forEach(poly => {
        ctx.beginPath();
        ctx.moveTo(poly.p0.x, poly.p0.y);
        ctx.lineTo(poly.p1.x, poly.p1.y);
        ctx.lineTo(poly.p2.x, poly.p2.y);
        ctx.lineTo(poly.p3.x, poly.p3.y);
        ctx.closePath();

        if (renderMode === 'thermal') {
          // FLIR Infrared Heat Shader
          if (poly.isSubmerged) {
            ctx.fillStyle = '#0f172a'; // Cold water is dark
            ctx.strokeStyle = '#1e293b';
          } else {
            const heat = Math.min(Math.round(poly.height * 4), 255);
            ctx.fillStyle = `rgb(${heat}, ${Math.round(heat * 0.4)}, 40)`;
            ctx.strokeStyle = '#334155';
          }
        } else if (renderMode === 'satellite') {
          // Satellite Earth Texture Shader
          if (poly.isSubmerged) {
            ctx.fillStyle = 'rgba(2, 132, 199, 0.75)'; // Silted flood water
            ctx.strokeStyle = '#0369a1';
          } else if (poly.height > 40) {
            ctx.fillStyle = '#64748b'; // Mountain rock
            ctx.strokeStyle = '#475569';
          } else {
            ctx.fillStyle = '#15803d'; // Valley vegetation
            ctx.strokeStyle = '#166534';
          }
        } else {
          // Topographic Elevation Shader (Hypsometric Tint)
          if (poly.isSubmerged) {
            ctx.fillStyle = 'rgba(14, 165, 233, 0.82)'; // Blue flood water
            ctx.strokeStyle = '#38bdf8';
          } else if (poly.height < 25) {
            ctx.fillStyle = '#059669'; // Low fertile floodplain
            ctx.strokeStyle = '#10b981';
          } else if (poly.height < 45) {
            ctx.fillStyle = '#d97706'; // Terraced foothills
            ctx.strokeStyle = '#f59e0b';
          } else {
            ctx.fillStyle = '#b45309'; // Steep mountain peak
            ctx.strokeStyle = '#d97706';
          }
        }

        ctx.fill();
        ctx.lineWidth = 0.6;
        ctx.stroke();
      });

      // 8. 3D Elevation Markers & Rooftop SOS Pins
      // Place SOS pin at low ground
      const sosPos = project3D(-2, -3, getHeight(12, 11));
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(sosPos.x, sosPos.y - 12, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Pin stem
      ctx.beginPath();
      ctx.moveTo(sosPos.x, sosPos.y - 5);
      ctx.lineTo(sosPos.x, sosPos.y);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('🚨 TRAPPED CITIZENS', sosPos.x - 45, sosPos.y - 24);

      // Place High Ground Relief Camp Pin on peak
      const campPos = project3D(4, 5, getHeight(18, 19));
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(campPos.x, campPos.y - 12, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(campPos.x, campPos.y - 5);
      ctx.lineTo(campPos.x, campPos.y);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#a7f3d0';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('🏥 SAFE SHELTER (HIGH GROUND)', campPos.x - 55, campPos.y - 24);

      frameId = requestAnimationFrame(render3D);
    };

    render3D();
    return () => cancelAnimationFrame(frameId);
  }, [viewMode, cameraAngle, isRotating, simWaterRise, renderMode, activeArea]);

  // Mouse Drag Orbit Controls for 3D View
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    setCameraAngle(prev => ({
      azimuth: (prev.azimuth + deltaX * 0.7) % 360,
      elevation: Math.max(15, Math.min(80, prev.elevation - deltaY * 0.5)),
      zoom: prev.zoom
    }));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="space-y-4">
      {/* Official Government GIS Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gov-navy text-white px-5 py-4 border-b border-gov-blue">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-gov-saffron text-slate-950 font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-wide">
                  GIS & 3D Topography Operations
                </span>
                <span className="text-slate-300 text-xs font-semibold">
                  National Disaster Management Authority • Geoinformatics Cell
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                <span>आपदा प्रभावित क्षेत्र जीआईएस मानचित्र एवं 3D स्थलाकृति</span>
                <span className="text-gov-saffron font-light hidden md:inline">|</span>
                <span className="text-slate-200 text-lg md:text-xl font-bold hidden md:inline">Disaster Area GIS Mapping & 3D Inundation Portal</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Real-time multi-hazard geo-positioning, elevation contour modeling, and 3D flood submersion simulation across North East river basins and hill slopes.
              </p>
            </div>

            {/* Mode Switcher Buttons */}
            <div className="flex items-center gap-1.5 bg-gov-blue/80 p-1.5 rounded-xl border border-white/20">
              <button
                onClick={() => setViewMode('2d')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === '2d'
                    ? 'bg-gov-saffron text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>2D GIS Map</span>
              </button>

              <button
                onClick={() => setViewMode('3d')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === '3d'
                    ? 'bg-gov-saffron text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Mountain className="w-3.5 h-3.5" />
                <span>3D Terrain & Inundation</span>
              </button>

              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all hidden lg:flex ${
                  viewMode === 'split'
                    ? 'bg-gov-saffron text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Split View</span>
              </button>
            </div>
          </div>
        </div>

        <TricolorStrip className="h-1" />

        {/* Affected Area Quick-Flyto Dropdown & Layer Toggles Bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-gov-navy flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-gov-saffron" />
              <span>Locate Affected Hotspot:</span>
            </span>

            <select
              value={selectedAreaId}
              onChange={(e) => setSelectedAreaId(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg text-xs font-bold px-3 py-1.5 text-slate-800 focus:ring-2 focus:ring-gov-navy focus:outline-none"
            >
              {AFFECTED_AREAS.map(a => (
                <option key={a.id} value={a.id}>
                  📍 {a.name} ({a.state})
                </option>
              ))}
            </select>
          </div>

          {/* Layer Checkboxes */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-600 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-gov-navy" />
              <span>GIS Layers:</span>
            </span>

            <label className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded cursor-pointer select-none">
              <input
                type="checkbox"
                checked={activeLayers.inundation}
                onChange={() => setActiveLayers(p => ({ ...p, inundation: !p.inundation }))}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-[11px] font-semibold text-slate-700">Flood Inundation</span>
            </label>

            <label className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded cursor-pointer select-none">
              <input
                type="checkbox"
                checked={activeLayers.requests}
                onChange={() => setActiveLayers(p => ({ ...p, requests: !p.requests }))}
                className="rounded text-red-600 focus:ring-red-500"
              />
              <span className="text-[11px] font-semibold text-slate-700">SOS Distress Pins</span>
            </label>

            <label className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded cursor-pointer select-none">
              <input
                type="checkbox"
                checked={activeLayers.shelters}
                onChange={() => setActiveLayers(p => ({ ...p, shelters: !p.shelters }))}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-[11px] font-semibold text-slate-700">Relief Camps</span>
            </label>

            <label className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded cursor-pointer select-none">
              <input
                type="checkbox"
                checked={activeLayers.roads}
                onChange={() => setActiveLayers(p => ({ ...p, roads: !p.roads }))}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span className="text-[11px] font-semibold text-slate-700">Road Blockages</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main GIS & 3D Interactive Display Container */}
      <div className={`grid gap-4 ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        
        {/* =========================================================================
            PANEL 1: 2D GIS MAP VIEW
           ========================================================================= */}
        {(viewMode === '2d' || viewMode === 'split') && (
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-lg overflow-hidden relative flex flex-col h-[560px]">
            {/* 2D Map Control Bar */}
            <div className="bg-slate-950/80 backdrop-blur px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-white z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-bold">2D GIS Cartographic View</span>
                <span className="text-slate-400 font-mono text-[11px]">| WGS84 Datum</span>
              </div>
              <div className="text-[11px] text-slate-300">
                Click any pin to measure distance to nearest relief camp
              </div>
            </div>

            {/* 2D Canvas */}
            <div className="flex-1 relative cursor-crosshair overflow-hidden">
              <canvas
                ref={canvas2dRef}
                width={800}
                height={500}
                onClick={handleCanvas2DClick}
                className="w-full h-full object-cover"
              />

              {/* Top-Right Mini Compass & Coordinates HUD */}
              <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur border border-slate-700 p-2.5 rounded-xl text-white text-[11px] font-mono space-y-1 pointer-events-none shadow-md">
                <div className="flex items-center justify-between gap-3 text-gov-saffron font-bold">
                  <span>GPS HUD</span>
                  <Compass className="w-3.5 h-3.5 text-gov-saffron" />
                </div>
                <div>Lat: {activeArea.center.lat.toFixed(4)}°N</div>
                <div>Lng: {activeArea.center.lng.toFixed(4)}°E</div>
                <div>Elevation: {activeArea.baseElevation}m MSL</div>
                <div className="text-red-400 font-bold">Risk: {activeArea.hazardType.split(' ')[0]}</div>
              </div>

              {/* Selected Entity Drawer Card (Floating Bottom Overlay) */}
              {selectedPin && (
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur p-4 rounded-xl border border-slate-300 shadow-2xl text-slate-900 text-xs z-20 animate-fadeIn">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          selectedPin.type === 'sos' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
                        }`}>
                          {selectedPin.type === 'sos' ? '🚨 SOS EMERGENCY CALL' : '🏥 VERIFIED RELIEF CAMP'}
                        </span>
                        <span className="text-slate-500 font-mono text-[11px]">
                          Lat: {selectedPin.lat.toFixed(4)}°N, Lng: {selectedPin.lng.toFixed(4)}°E
                        </span>
                      </div>
                      <h4 className="font-extrabold text-base text-slate-950">
                        {selectedPin.type === 'sos' ? selectedPin.data.requesterName : selectedPin.data.name}
                      </h4>
                      <p className="text-slate-600 mt-0.5">
                        {selectedPin.type === 'sos' ? selectedPin.data.description : selectedPin.data.location}
                      </p>
                    </div>

                    <button
                      onClick={() => { setSelectedPin(null); setMeasureTarget(null); }}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {measureTarget && measureTarget.nearestShelter && (
                    <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Crosshair className="w-4 h-4 text-gov-navy" />
                        <span>Nearest Safe Shelter: <strong>{measureTarget.nearestShelter.name}</strong></span>
                        <span className="bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded text-[11px]">
                          {measureTarget.distanceKm} km away (~{Math.round(measureTarget.distanceKm * 4)} mins boat/vehicle)
                        </span>
                      </div>

                      <a
                        href={`tel:${(selectedPin.type === 'sos' ? selectedPin.data.contactPhone : selectedPin.data.contactPhone).replace(/\s+/g, '')}`}
                        className="bg-gov-green hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs shadow-sm"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call Dispatch Coordinator</span>
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            PANEL 2: 3D TOPOGRAPHIC & INUNDATION SIMULATOR
           ========================================================================= */}
        {(viewMode === '3d' || viewMode === 'split') && (
          <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-lg overflow-hidden relative flex flex-col h-[560px]">
            {/* 3D Simulation Top Control Bar */}
            <div className="bg-slate-900/90 backdrop-blur px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-white z-10">
              <div className="flex items-center gap-2">
                <Mountain className="w-4 h-4 text-gov-saffron" />
                <span className="font-bold">3D Topography & Flood Simulation</span>
                <span className="text-[11px] text-slate-400 font-mono">({activeArea.name.split(' ')[0]})</span>
              </div>

              {/* Render Shader Mode Selector */}
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
                <button
                  onClick={() => setRenderMode('topo')}
                  className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                    renderMode === 'topo' ? 'bg-gov-saffron text-slate-950' : 'text-slate-300 hover:text-white'
                  }`}
                  title="Hypsometric Topographic Color Tint"
                >
                  Elevation Map
                </button>
                <button
                  onClick={() => setRenderMode('satellite')}
                  className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                    renderMode === 'satellite' ? 'bg-gov-saffron text-slate-950' : 'text-slate-300 hover:text-white'
                  }`}
                  title="Simulated Satellite Imagery"
                >
                  Satellite
                </button>
                <button
                  onClick={() => setRenderMode('thermal')}
                  className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                    renderMode === 'thermal' ? 'bg-gov-saffron text-slate-950' : 'text-slate-300 hover:text-white'
                  }`}
                  title="FLIR Thermal Infrared Rescue Drone Camera"
                >
                  Thermal FLIR
                </button>
              </div>
            </div>

            {/* 3D Canvas with Mouse Drag Orbit Interaction */}
            <div
              className="flex-1 relative cursor-grab active:cursor-grabbing select-none overflow-hidden"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <canvas
                ref={canvas3dRef}
                width={800}
                height={500}
                className="w-full h-full object-cover"
              />

              {/* Floating Camera Control Buttons */}
              <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
                <button
                  onClick={() => setIsRotating(!isRotating)}
                  className={`p-2 rounded-xl text-xs font-bold border shadow flex items-center justify-center transition-all ${
                    isRotating 
                      ? 'bg-gov-saffron text-slate-950 border-amber-600' 
                      : 'bg-slate-900/80 text-white border-slate-700 hover:bg-slate-800'
                  }`}
                  title={isRotating ? "Pause 360° Drone Flight" : "Auto-Orbit Drone Flight"}
                >
                  {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setCameraAngle(p => ({ ...p, zoom: Math.min(p.zoom + 0.15, 1.8) }))}
                  className="p-2 rounded-xl text-xs font-bold bg-slate-900/80 text-white border border-slate-700 hover:bg-slate-800 shadow"
                  title="Zoom In 3D Terrain"
                >
                  +
                </button>

                <button
                  onClick={() => setCameraAngle(p => ({ ...p, zoom: Math.max(p.zoom - 0.15, 0.6) }))}
                  className="p-2 rounded-xl text-xs font-bold bg-slate-900/80 text-white border border-slate-700 hover:bg-slate-800 shadow"
                  title="Zoom Out 3D Terrain"
                >
                  -
                </button>

                <button
                  onClick={() => setCameraAngle({ azimuth: 35, elevation: 38, zoom: 1.0 })}
                  className="p-2 rounded-xl text-xs font-bold bg-slate-900/80 text-white border border-slate-700 hover:bg-slate-800 shadow"
                  title="Reset 3D Perspective"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* 3D Flood Inundation Slider (Interactive Submersion Simulator) */}
              <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 backdrop-blur p-3.5 rounded-xl border border-slate-800 text-white text-xs z-10 shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    <span className="font-extrabold text-white">Interactive 3D Flood Inundation Level:</span>
                    <span className="text-cyan-300 font-mono font-black text-sm bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                      +{simWaterRise.toFixed(1)} meters above normal
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Drag slider to preview which villages & roads get submerged
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400 font-bold">0.0m (Normal)</span>
                  <input
                    type="range"
                    min="0"
                    max="5.5"
                    step="0.1"
                    value={simWaterRise}
                    onChange={(e) => setSimWaterRise(parseFloat(e.target.value))}
                    className="flex-1 accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                  <span className="text-[11px] text-red-400 font-bold">+5.5m (Catastrophic)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* GIS Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
            <span>Terrain Topography</span>
            <Mountain className="w-4 h-4 text-gov-navy" />
          </div>
          <div className="text-lg font-black text-slate-900">{activeArea.baseElevation}m - {activeArea.maxElevation}m MSL</div>
          <p className="text-[11px] text-slate-500 mt-1">Mean Sea Level Elevation Range</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
            <span>Simulated Flood Inundation</span>
            <Waves className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-lg font-black text-blue-600">+{simWaterRise.toFixed(1)}m Peak Swell</div>
          <p className="text-[11px] text-slate-500 mt-1">Live River Gauge Forecast Model</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
            <span>Critical SOS Coordinates</span>
            <AlertTriangle className="w-4 h-4 text-gov-red" />
          </div>
          <div className="text-lg font-black text-gov-red">{requests.length} Distress Call Pins</div>
          <p className="text-[11px] text-slate-500 mt-1">Geocoded & Plotted on 3D Mesh</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
            <span>Safe Elevation Camps</span>
            <ShieldCheck className="w-4 h-4 text-gov-green" />
          </div>
          <div className="text-lg font-black text-gov-green">{shelters.length} Shelters Verified</div>
          <p className="text-[11px] text-slate-500 mt-1">Above Current Flood Plain</p>
        </div>
      </div>
    </div>
  );
}