import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';

// Función de utilidad para verificar si WebGL está disponible
const isWebGLAvailable = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    // Cualquier error significa que WebGL no está disponible
    return false;
  }
};

// Componente para el modelo 3D específico
function Desk(props) {
  const group = useRef();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // Siempre llamar a los hooks al principio, sin importar las condiciones
  const { scene } = useGLTF('/models/Desk.glb', undefined, (err) => {
    console.error('Error loading model:', err);
    setError(true);
  });
  
  // useEffect para actualizar el estado cuando el modelo esté cargado
  useEffect(() => {
    if (scene) {
      setLoaded(true);
    }
  }, [scene]);

  // Rotación automática suave pero optimizada para evitar pérdida de contexto
  useFrame((state) => {
    if (group.current) {
      const t = state.clock.getElapsedTime();
      // Rotación más suave y menos intensiva para la GPU
      group.current.rotation.y = Math.sin(t / 8) / 16;
    }
  });

  if (error) {
    return (
      <Html center>
        <div className="text-red-500 bg-white/80 p-3 rounded-lg">
          Error al cargar el modelo 3D
        </div>
      </Html>
    );
  }

  if (!loaded) {
    return (
      <Html center>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
      </Html>
    );
  }

  return (
    <group ref={group} {...props}>
      {scene && <primitive object={scene} scale={props.scale || 1} />}
    </group>
  );
}

// Precargar el modelo para mejorar el rendimiento
useGLTF.preload('/models/Desk.glb', undefined, (err) => {
  console.error('Error preloading model:', err);
});

// Componente principal que envuelve el modelo con Canvas
export function DeskModelViewer({ height = '400px', autoRotate = true, controlsEnabled = true, scale = 1 }) {
  const [isMounted, setIsMounted] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [contextLost, setContextLost] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isModelReady, setIsModelReady] = useState(false);
  const canvasRef = useRef(null);
  
  // Verifica el soporte de WebGL y maneja el ciclo de vida del componente
  useEffect(() => {
    // Comprobar soporte de WebGL
    setWebGLSupported(isWebGLAvailable());
    
    // Montar componente
    setIsMounted(true);
    
    // Intentamos precargar el modelo de manera segura
    const preloadModel = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100)); // Pequeño retraso para estabilidad
        await useGLTF.preload('/models/Desk.glb');
        setIsModelReady(true);
      } catch (err) {
        console.warn('Error al precargar modelo:', err);
      }
    };
    
    preloadModel();
    
    // Manejador para detectar pérdida de contexto WebGL
    const handleContextLost = (event) => {
      event.preventDefault(); // Importante para permitir la recuperación 
      console.warn('WebGL context lost detected');
      setContextLost(true);
      
      // Solo incrementamos el contador de intentos si aún no hemos llegado al límite
      if (retryCount < 2) {
        setTimeout(() => {
          setContextLost(false);
          setRetryCount(prev => prev + 1);
        }, 500); // Esperar antes de reintentar
      }
    };
    
    // Manejador para restauración de contexto
    const handleContextRestored = () => {
      console.log('WebGL context restored');
      setContextLost(false);
    };
    
    // Agregamos event listeners
    window.addEventListener('webglcontextlost', handleContextLost, false);
    window.addEventListener('webglcontextrestored', handleContextRestored, false);
    
    return () => {
      window.removeEventListener('webglcontextlost', handleContextLost);
      window.removeEventListener('webglcontextrestored', handleContextRestored);
      setIsMounted(false);
      
      // Importante: limpiar caché de modelos al desmontar
      useGLTF.clear();
    };
  }, [retryCount]);

  // Mostrar mensaje si WebGL no es compatible
  if (!webGLSupported) {
    return (
      <div style={{ width: '100%', height, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
        <div className="text-center p-4">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
            <p><strong>Aviso:</strong> Tu navegador no soporta WebGL, necesario para visualizar modelos 3D.</p>
            <p className="mt-2">Intenta con otro navegador como Chrome o Edge.</p>
          </div>
          <img 
            src="/images/muebledashboard.jpg" 
            alt="Imagen alternativa de escritorio" 
            className="mt-4 max-w-full h-auto rounded-lg" 
            style={{ maxHeight: '300px' }}
          />
        </div>
      </div>
    );
  }
  
  // Mostrar mensaje si se perdió el contexto WebGL y superamos los reintentos
  if (contextLost && retryCount >= 2) {
    return (
      <div style={{ width: '100%', height, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
        <div className="text-center p-4">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
            <p><strong>Oops!</strong> No se pudo establecer la conexión con el modelo 3D.</p>
            <button 
              onClick={() => {
                setRetryCount(0);
                setContextLost(false);
              }} 
              className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Intentar nuevamente
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!isMounted) {
    return (
      <div style={{ width: '100%', height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height, position: 'relative' }}>
      <Canvas 
        ref={canvasRef}
        shadows 
        dpr={[1, 1.5]} // Limitar el ratio de píxeles directamente
        camera={{ position: [0, 2, 5], fov: 50 }}
        gl={{
          powerPreference: "high-performance",
          alpha: false,
          antialias: false,
          stencil: false,
          depth: true,
          failIfMajorPerformanceCaveat: true // No inicializar si el rendimiento esperado es bajo
        }}
        onCreated={({ gl, scene }) => {
          // Configurar renderer
          gl.setClearColor(new THREE.Color('#f5f5f4'));
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
          
          // Optimización de escena
          scene.updateMatrixWorld();
        }}
        frameloop="demand" // Solo renderiza cuando es necesario, ahorra recursos
      >
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow intensity={0.6} />
        
        <Suspense fallback={
          <Html center>
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mb-3"></div>
              <p className="text-sm text-gray-600 bg-white/80 px-3 py-1 rounded">Cargando modelo 3D...</p>
            </div>
          </Html>
        }>
          {isModelReady && <Desk scale={scale} />}
        </Suspense>
        
        {controlsEnabled && <OrbitControls 
          autoRotate={autoRotate}
          autoRotateSpeed={1}
          enablePan={false}
          enableZoom={true}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
        />}
        
        <ContactShadows
          opacity={0.4}
          scale={10}
          blur={2}
          far={10}
          resolution={256}
          color="#000000"
        />
        <Environment preset="sunset" />
      </Canvas>
      <div className="model-controls absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-50 p-2 rounded">
        <p>Arrastra para rotar | Zoom con rueda</p>
      </div>
    </div>
  );
}
