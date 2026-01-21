import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Text, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { cn } from '@/shared/lib/utils';
import GUI from 'lil-gui';

import { FINANCIAL_DATA } from '@/shared/lib/financial-data';

// Calculate risk pressure (0-1 scale)
const calculateRiskPressure = (overdue: number, vacancy: number, collected: number) => {
    const overdueRatio = overdue / collected;
    const vacancyRatio = vacancy / (collected + vacancy);
    return Math.min(1, (overdueRatio * 0.6 + vacancyRatio * 0.4) * 3);
};

// Layer configuration with colors - ordered bottom to top for visual hierarchy
const LAYER_CONFIG = [
    { key: 'collected', color: '#16a34a', glowColor: '#22c55e', label: 'Collected', opacity: 0.85 },    // Muted green - stable foundation
    { key: 'pending', color: '#2563eb', glowColor: '#3b82f6', label: 'Pending', opacity: 0.9 },        // Bright blue - expected inflow
    { key: 'maintenance', color: '#eab308', glowColor: '#facc15', label: 'Maintenance', opacity: 0.9 }, // Yellow - active expense
    { key: 'overdue', color: '#dc2626', glowColor: '#ef4444', label: 'Overdue', opacity: 0.92 },       // Red - warning
    { key: 'vacancy', color: '#9333ea', glowColor: '#a855f7', label: 'Vacancy', opacity: 0.95 },       // Purple - critical/empty
];

// --- GUI PARAMS TYPE ---
interface GUIParams {
    // Camera
    cameraX: number;
    cameraY: number;
    cameraZ: number;
    cameraZoom: number;
    autoRotate: boolean;
    autoRotateSpeed: number;
    
    // Background
    bgColor: string;
    bgOpacity: number;
    
    // Lighting
    ambientIntensity: number;
    directionalIntensity: number;
    directionalX: number;
    directionalY: number;
    directionalZ: number;
    pointLight1Color: string;
    pointLight1Intensity: number;
    pointLight2Color: string;
    pointLight2Intensity: number;
    backlightIntensity: number;
    
    // Chart
    chartY: number;
    chartZ: number;
    layerOpacity: number;
    layerDepth: number;
    emissiveIntensity: number;
    glowIntensity: number;
    pulseSpeed: number;
    
    // Layer Z Positions
    chartLayersZ: number;
    riskLineZ: number;
    gridlinesZ: number;
    
    // Risk Line
    riskLineThickness: number;
    riskLineEmissive: number;
    showRiskLine: boolean;
}

// Default params
const defaultParams: GUIParams = {
    cameraX: 0,
    cameraY: 0.9,
    cameraZ: 7.5, // Zoomed out slightly for wider chart
    cameraZoom: 1.0,
    autoRotate: false, // Disabled default rotation to check flicker
    autoRotateSpeed: 0.5,
    
    // Light, clean background
    bgColor: '#f6f9fc',
    bgOpacity: 1.0,
    
    ambientIntensity: 0.5,
    directionalIntensity: 1.2,
    directionalX: 2,
    directionalY: 4,
    directionalZ: 5,
    pointLight1Color: '#3b82f6',
    pointLight1Intensity: 0,
    pointLight2Color: '#22c55e',
    pointLight2Intensity: 0,
    backlightIntensity: 1.0,
    
    chartY: -1.0,
    chartZ: 0,
    layerOpacity: 0.35, // Glass opacity handled by transmission
    layerDepth: 0.05,
    emissiveIntensity: 0.5,
    glowIntensity: 0.2,
    pulseSpeed: 0.8,
    
    // Layer Z Positions (flattened to prevent depth complexity)
    chartLayersZ: 0.3,
    riskLineZ: 0.6, // Pushed forward slightly
    gridlinesZ: -0.6,
    
    riskLineThickness: 0.02,
    riskLineEmissive: 1.0,
    showRiskLine: false,
};

// --- GLOWING AREA LAYER ---
interface AreaLayerProps {
    points: THREE.Vector3[];
    basePoints: THREE.Vector3[];
    color: string;
    glowColor: string;
    index: number;
    params: GUIParams;
    layerOpacity: number;
    zPosition: number;
    renderOrder: number;
    dimmed: boolean;
    isHovered: boolean;
}

function AreaLayer({ points, basePoints, color, glowColor, index, params, layerOpacity, zPosition, renderOrder, dimmed, isHovered }: AreaLayerProps) {
    interface ThreeShader {
        uniforms: { [key: string]: { value: any } };
        vertexShader: string;
        fragmentShader: string;
    }

    const meshRef = useRef<THREE.Mesh>(null);
    const shaderRef = useRef<ThreeShader | null>(null);

    // Custom shader for local gradient fade (bottom to top of CURRENT layer)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onBeforeCompile = useMemo(() => (shader: any) => {
        // Init uniform
        shader.uniforms.uMinOpacity = { value: 0.6 };
        
        shader.vertexShader = `
            varying float vLocalAlpha;
            ${shader.vertexShader}
        `.replace(
            '#include <uv_vertex>',
            `
            #include <uv_vertex>
            vLocalAlpha = uv.y;
            `
        );
        shader.fragmentShader = `
            uniform float uMinOpacity;
            varying float vLocalAlpha;
            ${shader.fragmentShader}
        `.replace(
            '#include <color_fragment>',
            `
            #include <color_fragment>
            // Gradient: uMinOpacity at bottom, 1.0 opaque at top
            // Using local UV.y ensures every layer gets the full gradient
            float gradient = mix(uMinOpacity, 1.0, vLocalAlpha); 
            diffuseColor.a *= gradient;
            `
        );
        shaderRef.current = shader as ThreeShader;
    }, []);

    // Update uniform on frame (smooth transition logic could go here, but instant is fine)
    useFrame(() => {
        if (shaderRef.current) {
            // Default 0.6, Interactive 0.33
            const targetMin = isHovered ? 0.33 : 0.6;
            shaderRef.current.uniforms.uMinOpacity.value = targetMin;
        }
    });

    const activeOpacity = dimmed ? 0.1 : layerOpacity;

    // Create custom mesh geometry (Triangle Strip / Quads)
    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const numSegments = points.length - 1;
        
        // 4 vertices per segment (2 triangles)
        const positionCount = numSegments * 4 * 3;
        const uvCount = numSegments * 4 * 2;
        const indexCount = numSegments * 6;
        
        const positions = new Float32Array(positionCount);
        const uvs = new Float32Array(uvCount);
        const indices = []; // Use array for ease, convert to buffer later if needed or just setIndex
        
        let pIdx = 0;
        let uIdx = 0;
        let vIdx = 0;
        
        for (let i = 0; i < numSegments; i++) {
            const p1 = points[i];      // Top Left
            const b1 = basePoints[i];  // Bottom Left
            const p2 = points[i+1];    // Top Right
            const b2 = basePoints[i+1];// Bottom Right
            
            // Vertices
            // 0: BL
            positions[pIdx++] = b1.x; positions[pIdx++] = b1.y; positions[pIdx++] = 0;
            uvs[uIdx++] = 0; uvs[uIdx++] = 0; // y=0 (bottom)
            
            // 1: BR
            positions[pIdx++] = b2.x; positions[pIdx++] = b2.y; positions[pIdx++] = 0;
            uvs[uIdx++] = 1; uvs[uIdx++] = 0; // y=0 (bottom)

            // 2: TL
            positions[pIdx++] = p1.x; positions[pIdx++] = p1.y; positions[pIdx++] = 0;
            uvs[uIdx++] = 0; uvs[uIdx++] = 1; // y=1 (top)

            // 3: TR
            positions[pIdx++] = p2.x; positions[pIdx++] = p2.y; positions[pIdx++] = 0;
            uvs[uIdx++] = 1; uvs[uIdx++] = 1; // y=1 (top)
            
            // Indices (Two triangles: BL-BR-TL, BR-TR-TL)
            // 0, 1, 2
            indices.push(vIdx, vIdx + 1, vIdx + 2);
            // 1, 3, 2
            indices.push(vIdx + 1, vIdx + 3, vIdx + 2);
            
            vIdx += 4;
        }
        
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        geo.setIndex(indices);
        geo.computeVertexNormals();
        
        return geo;
    }, [points, basePoints]);
    
    // Create a vector line (tube) for the top edge
    const lineCurve = useMemo(() => {
         const topPoints = points.map(p => new THREE.Vector3(p.x, p.y, 0)); 
         return new THREE.CatmullRomCurve3(topPoints, false, 'catmullrom', 0.5);
    }, [points]);
    
    const tubeGeometry = useMemo(() => {
        return new THREE.TubeGeometry(lineCurve, 64, 0.015, 8, false); 
    }, [lineCurve]);

    return (
        <group position={[0, 0, zPosition]}>
            {/* Gradient Flat Color Area */}
            <mesh geometry={geometry} renderOrder={renderOrder}>
                <meshBasicMaterial 
                    color={color} 
                    transparent 
                    opacity={activeOpacity}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                    onBeforeCompile={onBeforeCompile}
                />
            </mesh>
            
            {/* Outline Line */}
            <mesh geometry={tubeGeometry} position={[0, 0, 0]} renderOrder={renderOrder + 10}>
                <meshBasicMaterial 
                    color={glowColor}
                    transparent
                    opacity={dimmed ? 0.1 : 1.0}
                />
            </mesh>
        </group>
    );
}

// --- STACKED AREA CHART ---
function StackedAreaChart({ data, params, hoveredLayer }: { data: typeof FINANCIAL_DATA; params: GUIParams; hoveredLayer: string | null }) {
    // 1. Calculate realistic max value and scale
    const { maxDataValue, yAxisMax, yScale, ticks } = useMemo(() => {
        const max = Math.max(...data.months.map((_, i) => 
            data.collected[i] + data.pending[i] + data.maintenance[i] + data.overdue[i] + data.vacancy[i]
        ));
        
        // Round up to nearest 10k for a clean ceiling (e.g. 52k -> 60k)
        const axisMax = Math.ceil(max / 10000) * 10000;
        const scale = 3.5 / axisMax; // Map 0-axisMax to 0-3.5 range
        
        // Generate ticks: 10k, 20k... up to axisMax
        const t = [];
        for (let i = 10000; i <= axisMax; i += 10000) {
            t.push(i);
        }
        
        return { maxDataValue: max, yAxisMax: axisMax, yScale: scale, ticks: t };
    }, [data]);
    
    const xScale = 8;
    
    const layerPoints = useMemo(() => {
        const layers: { points: THREE.Vector3[]; basePoints: THREE.Vector3[] }[] = [];
        
        const numPoints = data.months.length;
        const cumulativeValues: number[][] = [];
        
        for (let i = 0; i < numPoints; i++) {
            cumulativeValues.push([
                0,
                data.collected[i],
                data.collected[i] + data.pending[i],
                data.collected[i] + data.pending[i] + data.maintenance[i],
                data.collected[i] + data.pending[i] + data.maintenance[i] + data.overdue[i],
                data.collected[i] + data.pending[i] + data.maintenance[i] + data.overdue[i] + data.vacancy[i],
            ]);
        }
        
        const interpolate = (values: number[], xPositions: number[], segments: number) => {
            const result: THREE.Vector3[] = [];
            
            for (let i = 0; i < values.length - 1; i++) {
                for (let j = 0; j < segments; j++) {
                    const t = j / segments;
                    const smoothT = (1 - Math.cos(t * Math.PI)) / 2;
                    const x = xPositions[i] + (xPositions[i + 1] - xPositions[i]) * t;
                    const y = values[i] + (values[i + 1] - values[i]) * smoothT;
                    result.push(new THREE.Vector3(x, y * yScale, 0));
                }
            }
            result.push(new THREE.Vector3(xPositions[xPositions.length - 1], values[values.length - 1] * yScale, 0));
            
            return result;
        };
        
        const xPositions = data.months.map((_, i) => (i / (numPoints - 1)) * xScale - xScale / 2);
        const segments = 6;
        
        // Updated loop for 5 layers
        for (let layerIdx = 0; layerIdx < 5; layerIdx++) {
            const topValues = cumulativeValues.map(cv => cv[layerIdx + 1]);
            const bottomValues = cumulativeValues.map(cv => cv[layerIdx]);
            
            layers.push({
                points: interpolate(topValues, xPositions, segments),
                basePoints: interpolate(bottomValues, xPositions, segments),
            });
        }
        
        return layers;
    }, [data, yScale, xScale]);

    const layerZPositions = [
        params.chartLayersZ, 
        params.chartLayersZ, 
        params.chartLayersZ, 
        params.chartLayersZ, 
        params.chartLayersZ
    ];
    
    return (
        <group position={[0, params.chartY, params.chartZ]}>
            {layerPoints.map((layer, i) => (
                <AreaLayer
                    key={LAYER_CONFIG[i].key}
                    points={layer.points}
                    basePoints={layer.basePoints}
                    color={LAYER_CONFIG[i].color}
                    glowColor={LAYER_CONFIG[i].glowColor}
                    index={4 - i} // Updated index for visual pop calculation if used
                    params={params}
                    layerOpacity={LAYER_CONFIG[i].opacity}
                    zPosition={layerZPositions[i]}
                    renderOrder={i}
                    dimmed={hoveredLayer !== null && hoveredLayer !== LAYER_CONFIG[i].key}
                    isHovered={hoveredLayer === LAYER_CONFIG[i].key}
                />
            ))}
            
            {/* Dynamic Gridlines based on ticks */}
            {ticks.map((tickValue) => {
                const y = tickValue * yScale;
                return (
                    <line key={`grid-${tickValue}`}>
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                count={2}
                                array={new Float32Array([-xScale/2, y, params.gridlinesZ, xScale/2, y, params.gridlinesZ])}
                                itemSize={3}
                            />
                        </bufferGeometry>
                        <lineBasicMaterial color="#475569" transparent opacity={0.08} />
                    </line>
                );
            })}
            
            {/* Month labels */}
            {data.months.map((month, i) => {
                const x = (i / (data.months.length - 1)) * xScale - xScale / 2;
                return (
                    <Text
                        key={`${month}-${i}`}
                        position={[x, -0.3, 0.5]}
                        fontSize={0.14}
                        color="#475569" // Slate-600 for visibility on light bg
                        anchorX="center"
                        anchorY="top"
                    >
                        {month}
                    </Text>
                );
            })}
            
            {/* Dynamic Y-Axis Labels */}
            {ticks.map((tickValue) => {
                const y = tickValue * yScale;
                return (
                    <Text 
                        key={`label-${tickValue}`}
                        position={[-xScale/2 - 0.5, y, 0.5]} 
                        fontSize={0.12} 
                        color="#475569" // Slate-600
                        anchorX="right"
                        anchorY="middle"
                    >
                        {`$${tickValue / 1000}K`}
                    </Text>
                );
            })}
        </group>
    );
}

// --- RISK PRESSURE LINE ---
function RiskPressureLine({ data, params }: { data: typeof FINANCIAL_DATA; params: GUIParams }) {
    const points = useMemo(() => {
        const pts: THREE.Vector3[] = [];
        const xScale = 8;
        
        // Calculate Scale EXACTLY as in StackedAreaChart to align
        const max = Math.max(...data.months.map((_, i) => 
            data.collected[i] + data.pending[i] + data.maintenance[i] + data.overdue[i] + data.vacancy[i]
        ));
        const axisMax = Math.ceil(max / 10000) * 10000;
        const yScale = 3.5 / axisMax;
        
        data.months.forEach((_, i) => {
            const x = (i / (data.months.length - 1)) * xScale - xScale / 2;
            const total = data.collected[i] + data.pending[i] + data.maintenance[i] + data.overdue[i] + data.vacancy[i];
            const y = total * yScale + 0.3; // +0.3 offset matches logic (though check if AreaLayer has offset? No, chartY handles it)
            // Wait, RiskPressureLine previously added +0.3. This might be a floating offset. 
            // In StackedAreaChart, points are just y * yScale.
            // If we want the risk line to hover slightly ABOVE the chart, keeping +0.3 is fine.
            
            pts.push(new THREE.Vector3(x, y, params.riskLineZ));
        });
        return pts;
    }, [data, params.riskLineZ]);

    const curve = useMemo(() => new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5), [points]);
    const tubeGeometry = useMemo(() => new THREE.TubeGeometry(curve, 128, params.riskLineThickness, 8, false), [curve, params.riskLineThickness]);

    // Always use amber/yellow color to match legend
    const riskColor = '#f59e0b';

    if (!params.showRiskLine) return null;

    return (
        <Float speed={1.5} rotationIntensity={0} floatIntensity={0.1}>
            <mesh geometry={tubeGeometry} renderOrder={100}>
                <meshBasicMaterial 
                    color={riskColor} 
                />
            </mesh>
            
            <mesh geometry={tubeGeometry} scale={[1.3, 1.3, 1.3]} renderOrder={99}>
                <meshBasicMaterial 
                    color={riskColor} 
                    transparent 
                    opacity={0.15}
                    depthWrite={false}
                />
            </mesh>
            
            {points.map((pt, i) => (
                <group key={i} position={pt}>
                    <mesh renderOrder={101}>
                        <sphereGeometry args={[0.045, 16, 16]} />
                        <meshBasicMaterial 
                            color={riskColor}
                        />
                    </mesh>
                    <mesh renderOrder={101}>
                        <sphereGeometry args={[0.08, 16, 16]} />
                        <meshBasicMaterial 
                            color={riskColor}
                            transparent
                            opacity={0.2}
                            depthWrite={false}
                        />
                    </mesh>
                </group>
            ))}
        </Float>
    );
}

// --- LIGHTING SETUP ---
function Lights({ params }: { params: GUIParams }) {
    return (
        <>
            <ambientLight intensity={1.5} /> {/* Strong, flat ambient light */}
            {/* Removed directional and point lights to eliminate reflections */}
        </>
    );
}

// --- CAMERA SYNC COMPONENT ---
function CameraSync({ params, controlsRef }: { params: GUIParams; controlsRef: React.RefObject<any> }) {
    const { camera } = useThree();
    const prevParams = useRef({ x: params.cameraX, y: params.cameraY, z: params.cameraZ, zoom: params.cameraZoom });
    
    useFrame(() => {
        // Check if GUI params changed (not from OrbitControls)
        if (
            prevParams.current.x !== params.cameraX ||
            prevParams.current.y !== params.cameraY ||
            prevParams.current.z !== params.cameraZ
        ) {
            camera.position.set(params.cameraX, params.cameraY, params.cameraZ);
            if (controlsRef.current) {
                controlsRef.current.update();
            }
            prevParams.current = { x: params.cameraX, y: params.cameraY, z: params.cameraZ, zoom: params.cameraZoom };
        }
        
        // Handle zoom changes
        if (prevParams.current.zoom !== params.cameraZoom) {
            camera.zoom = params.cameraZoom;
            camera.updateProjectionMatrix();
            prevParams.current.zoom = params.cameraZoom;
        }
    });
    
    return null;
}

// --- SCENE COMPONENT ---
function ChartScene({ params, controlsRef, hoveredLayer }: { params: GUIParams; controlsRef: React.RefObject<any>; hoveredLayer: string | null }) {
    return (
        <>
            <CameraSync params={params} controlsRef={controlsRef} />
            <Lights params={params} />
            {/* Removed Environment to prevent reflections */}
            <StackedAreaChart data={FINANCIAL_DATA} params={params} hoveredLayer={hoveredLayer} />
            <RiskPressureLine data={FINANCIAL_DATA} params={params} />
        </>
    );
}

// --- MAIN EXPORT ---
export function FinancialReality3D() {
    const [params, setParams] = useState<GUIParams>({ ...defaultParams });
    const guiRef = useRef<GUI | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const controlsRef = useRef<any>(null);
    const guiConfig = useRef<GUIParams>({ ...defaultParams });
    const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);
    
    // Setup lil-gui
    useEffect(() => {
        if (guiRef.current) return;
        
        const config = guiConfig.current;
        const gui = new GUI({ title: '🎛️ Chart Controls', width: 300 });
        guiRef.current = gui;
        
        // Camera folder
        const cameraFolder = gui.addFolder('📷 Camera');
        cameraFolder.add(config, 'cameraX', -10, 10, 0.1).name('Position X').onChange((v: number) => {
            setParams(p => ({ ...p, cameraX: v }));
        });
        cameraFolder.add(config, 'cameraY', -5, 10, 0.1).name('Position Y').onChange((v: number) => {
            setParams(p => ({ ...p, cameraY: v }));
        });
        cameraFolder.add(config, 'cameraZ', 0, 15, 0.1).name('Position Z').onChange((v: number) => {
            setParams(p => ({ ...p, cameraZ: v }));
        });
        cameraFolder.add(config, 'autoRotate').name('Auto Rotate').onChange((v: boolean) => {
            setParams(p => ({ ...p, autoRotate: v }));
        });
        cameraFolder.add(config, 'autoRotateSpeed', 0.1, 5, 0.1).name('Rotate Speed').onChange((v: number) => {
            setParams(p => ({ ...p, autoRotateSpeed: v }));
        });
        cameraFolder.add(config, 'cameraZoom', 0.5, 3, 0.1).name('Zoom').onChange((v: number) => {
            setParams(p => ({ ...p, cameraZoom: v }));
        });
        
        // Background folder
        const bgFolder = gui.addFolder('🎨 Background');
        bgFolder.addColor(config, 'bgColor').name('Color').onChange((v: string) => {
            setParams(p => ({ ...p, bgColor: v }));
        });
        bgFolder.add(config, 'bgOpacity', 0, 1, 0.05).name('Opacity').onChange((v: number) => {
            setParams(p => ({ ...p, bgOpacity: v }));
        });
        
        // Lighting folder
        const lightFolder = gui.addFolder('💡 Lighting');
        lightFolder.add(config, 'ambientIntensity', 0, 2, 0.05).name('Ambient').onChange((v: number) => {
            setParams(p => ({ ...p, ambientIntensity: v }));
        });
        lightFolder.add(config, 'directionalIntensity', 0, 3, 0.1).name('Directional').onChange((v: number) => {
            setParams(p => ({ ...p, directionalIntensity: v }));
        });
        lightFolder.add(config, 'directionalX', -10, 10, 0.5).name('Dir Light X').onChange((v: number) => {
            setParams(p => ({ ...p, directionalX: v }));
        });
        lightFolder.add(config, 'directionalY', -10, 15, 0.5).name('Dir Light Y').onChange((v: number) => {
            setParams(p => ({ ...p, directionalY: v }));
        });
        lightFolder.add(config, 'directionalZ', -10, 10, 0.5).name('Dir Light Z').onChange((v: number) => {
            setParams(p => ({ ...p, directionalZ: v }));
        });
        lightFolder.addColor(config, 'pointLight1Color').name('Accent 1 Color').onChange((v: string) => {
            setParams(p => ({ ...p, pointLight1Color: v }));
        });
        lightFolder.add(config, 'pointLight1Intensity', 0, 12, 0.1).name('Accent 1 Int').onChange((v: number) => {
            setParams(p => ({ ...p, pointLight1Intensity: v }));
        });
        lightFolder.addColor(config, 'pointLight2Color').name('Accent 2 Color').onChange((v: string) => {
            setParams(p => ({ ...p, pointLight2Color: v }));
        });
        lightFolder.add(config, 'pointLight2Intensity', 0, 12, 0.1).name('Accent 2 Int').onChange((v: number) => {
            setParams(p => ({ ...p, pointLight2Intensity: v }));
        });
        lightFolder.add(config, 'backlightIntensity', 0, 2, 0.1).name('Backlight').onChange((v: number) => {
            setParams(p => ({ ...p, backlightIntensity: v }));
        });
        
        // Chart folder
        const chartFolder = gui.addFolder('📊 Chart');
        chartFolder.add(config, 'chartY', -3, 3, 0.1).name('Chart Y').onChange((v: number) => {
            setParams(p => ({ ...p, chartY: v }));
        });
        chartFolder.add(config, 'chartZ', -3, 3, 0.1).name('Chart Z').onChange((v: number) => {
            setParams(p => ({ ...p, chartZ: v }));
        });
        chartFolder.add(config, 'layerOpacity', 0.1, 1, 0.05).name('Layer Opacity').onChange((v: number) => {
            setParams(p => ({ ...p, layerOpacity: v }));
        });
        chartFolder.add(config, 'layerDepth', 0.05, 0.5, 0.01).name('Layer Depth').onChange((v: number) => {
            setParams(p => ({ ...p, layerDepth: v }));
        });
        chartFolder.add(config, 'emissiveIntensity', 0, 1, 0.05).name('Emissive').onChange((v: number) => {
            setParams(p => ({ ...p, emissiveIntensity: v }));
        });
        chartFolder.add(config, 'glowIntensity', 0, 0.5, 0.01).name('Glow').onChange((v: number) => {
            setParams(p => ({ ...p, glowIntensity: v }));
        });
        chartFolder.add(config, 'pulseSpeed', 0, 5, 0.1).name('Pulse Speed').onChange((v: number) => {
            setParams(p => ({ ...p, pulseSpeed: v }));
        });
        
        // Risk Line folder
        const riskFolder = gui.addFolder('⚠️ Risk Line');
        riskFolder.add(config, 'showRiskLine').name('Show').onChange((v: boolean) => {
            setParams(p => ({ ...p, showRiskLine: v }));
        });
        riskFolder.add(config, 'riskLineThickness', 0.01, 0.1, 0.005).name('Thickness').onChange((v: number) => {
            setParams(p => ({ ...p, riskLineThickness: v }));
        });
        riskFolder.add(config, 'riskLineEmissive', 0, 2, 0.1).name('Glow').onChange((v: number) => {
            setParams(p => ({ ...p, riskLineEmissive: v }));
        });
        
        // Layer Z Positions folder
        const zPosFolder = gui.addFolder('📐 Layer Z Positions');
        zPosFolder.add(config, 'chartLayersZ', -3, 3, 0.05).name('Layers Z').onChange((v: number) => {
            setParams(p => ({ ...p, chartLayersZ: v }));
        });
        zPosFolder.add(config, 'riskLineZ', -3, 3, 0.05).name('Risk Line Z').onChange((v: number) => {
            setParams(p => ({ ...p, riskLineZ: v }));
        });
        zPosFolder.add(config, 'gridlinesZ', -3, 3, 0.05).name('Gridlines Z').onChange((v: number) => {
            setParams(p => ({ ...p, gridlinesZ: v }));
        });
        
        // Open some folders by default
        cameraFolder.open();
        bgFolder.open();
        zPosFolder.open();
        
        return () => {
            gui.destroy();
            guiRef.current = null;
        };
    }, []);
    
    // Dynamic background style
    const bgStyle = useMemo(() => ({
        backgroundColor: params.bgColor,
        opacity: params.bgOpacity,
    }), [params.bgColor, params.bgOpacity]);
    
    return (
        <div 
            ref={containerRef}
            className="relative w-full h-full min-h-[400px] rounded-xl overflow-hidden border border-slate-200"
            style={bgStyle}
        >
            <Canvas
                camera={{ position: [params.cameraX, params.cameraY, params.cameraZ], fov: 50, zoom: params.cameraZoom }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
            >
                <OrbitControls 
                    ref={controlsRef}
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    autoRotate={params.autoRotate}
                    autoRotateSpeed={params.autoRotateSpeed}
                    target={[0, 0.8, 0]}
                    minDistance={2}
                    maxDistance={15}
                />
                <ChartScene params={params} controlsRef={controlsRef} hoveredLayer={hoveredLayer} />
            </Canvas>
            
            {/* Legend */}
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-3 text-[10px]">
                {LAYER_CONFIG.map(item => (
                    <div 
                        key={item.key} 
                        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${hoveredLayer && hoveredLayer !== item.key ? 'text-slate-400 opacity-50' : 'text-slate-600'}`}
                        onMouseEnter={() => setHoveredLayer(item.key)}
                        onMouseLeave={() => setHoveredLayer(null)}
                    >
                        <div 
                            className="w-2 h-2 rounded-sm" 
                            style={{ 
                                backgroundColor: item.color,
                                boxShadow: `0 0 3px ${item.glowColor}`,
                                border: `1px solid ${item.glowColor}40`
                            }} 
                        />
                        {item.label}
                    </div>
                ))}
            </div>

            {/* Risk Indicator */}
            {params.showRiskLine && (
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" style={{ boxShadow: '0 0 8px #f59e0b' }} />
                    <span className="text-[10px] font-medium text-slate-300">Risk Pressure Line</span>
                </div>
            )}
        </div>
    );
}
