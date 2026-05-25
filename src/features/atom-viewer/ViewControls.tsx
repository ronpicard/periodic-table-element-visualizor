import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as ThreeOrbitControls } from 'three/addons/controls/OrbitControls.js';

interface ViewControlsProps {
  viewRadius: number;
}

export function ViewControls({ viewRadius }: ViewControlsProps) {
  const { camera, gl } = useThree();
  const controlsRef = useRef<ThreeOrbitControls | null>(null);

  useEffect(() => {
    const controls = new ThreeOrbitControls(camera, gl.domElement);
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    controlsRef.current = controls;

    return () => {
      controls.dispose();
      controlsRef.current = null;
    };
  }, [camera, gl]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) {
      return;
    }

    controls.minDistance = viewRadius * 0.45;
    controls.maxDistance = viewRadius * 2.6;
    controls.target.set(0, 0, 0);
    camera.position.set(viewRadius * 0.15, viewRadius * 0.3, viewRadius * 1.45);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    controls.update();
  }, [camera, viewRadius]);

  useFrame(() => {
    controlsRef.current?.update();
  });

  return null;
}
