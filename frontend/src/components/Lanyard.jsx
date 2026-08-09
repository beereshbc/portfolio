/* eslint-disable react/no-unknown-property */
'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

import cardGLB from '../assets/card.glb';
import lanyard from '../assets/lanyard.png';

import * as THREE from 'three';

extend({ MeshLineGeometry, MeshLineMaterial });

const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

/* ───────────────────────────────────────────────────────────────
   Generate a personalized "Beeresh" ID card texture
   ─────────────────────────────────────────────────────────────── */
function generateBeereshCard(w = 512, h = 768) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');

  // Dark gradient background
  const grd = ctx.createLinearGradient(0, 0, w, h);
  grd.addColorStop(0, '#141414');
  grd.addColorStop(1, '#0a0a0a');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, w, h);

  // Top accent bar (warm brown/gold)
  ctx.fillStyle = '#a67c52';
  ctx.fillRect(0, 0, w, 10);

  // Avatar circle with "B"
  ctx.beginPath();
  ctx.arc(w / 2, 170, 70, 0, Math.PI * 2);
  ctx.fillStyle = '#1f1f1f';
  ctx.fill();
  ctx.strokeStyle = '#a67c52';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 56px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('B', w / 2, 190);

  // Name: Beeresh
  ctx.fillStyle = '#fafafa';
  ctx.font = 'bold 68px system-ui, sans-serif';
  ctx.fillText('Beeresh', w / 2, 360);

  // Role
  ctx.fillStyle = '#a3a3a3';
  ctx.font = '500 26px system-ui, sans-serif';
  ctx.fillText('Full Stack Developer', w / 2, 410);

  // Divider
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, 470);
  ctx.lineTo(w - 80, 470);
  ctx.stroke();

  // Details
  ctx.fillStyle = '#737373';
  ctx.font = '400 20px monospace';
  ctx.fillText('github.com/beereshbc', w / 2, 520);
  ctx.fillText('bcbeereshkumar@gmail.com', w / 2, 555);

  // Footer ID
  ctx.fillStyle = '#404040';
  ctx.font = '400 16px monospace';
  ctx.fillText('ID: BEERESH · 2026', w / 2, 720);

  return c;
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1
}) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative z-0 w-full h-full flex justify-center items-center">
      <Canvas
        camera={{ position: position, fov: fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent, antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1);
          gl.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
        }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band
            isMobile={isMobile}
            frontImage={frontImage}
            backImage={backImage}
            imageFit={imageFit}
            lanyardImage={lanyardImage}
            lanyardWidth={lanyardWidth}
          />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({
  maxSpeed = 18,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1
}) {
  const band = useRef();
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();

  const vec = new THREE.Vector3();
  const dir = new THREE.Vector3();

  // Smooth drag state
  const dragTarget = useRef(new THREE.Vector3());
  const dragCurrent = useRef(new THREE.Vector3());
  const isDragging = useRef(false);

  // Stable lerped positions (stored outside physics bodies)
  const lerpedJ1 = useRef(new THREE.Vector3());
  const lerpedJ2 = useRef(new THREE.Vector3());
  const lerpedReady = useRef(false);

  const segmentProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 6,
    linearDamping: 5,
    mass: 0.6
  };

  const { nodes, materials } = useGLTF(cardGLB);
  const texture = useTexture(lanyardImage || lanyard);
  const frontTex = useTexture(frontImage || BLANK_PIXEL);
  const backTex = useTexture(backImage || BLANK_PIXEL);

  // Composite card texture: Beeresh default, or custom frontImage/backImage
  const cardMap = useMemo(() => {
    const baseMap = materials.base.map;
    const baseImg = baseMap.image;
    const W = baseImg.width;
    const H = baseImg.height;

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return baseMap;

    // Start with original baked atlas
    ctx.drawImage(baseImg, 0, 0, W, H);

    const drawFitted = (img, rect) => {
      const rx = rect.x * W;
      const ry = rect.y * H;
      const rw = rect.w * W;
      const rh = rect.h * H;
      const pick = imageFit === 'contain' ? Math.min : Math.max;
      const scale = pick(rw / img.width, rh / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = rx + (rw - dw) / 2;
      const dy = ry + (rh - dh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    };

    // Front face: custom image OR personalized Beeresh card
    if (frontImage && frontTex.image) {
      drawFitted(frontTex.image, FRONT_UV_RECT);
    } else if (!frontImage) {
      const beereshCanvas = generateBeereshCard(512, 768);
      drawFitted(beereshCanvas, FRONT_UV_RECT);
    }

    // Back face: custom image only if provided
    if (backImage && backTex.image) {
      drawFitted(backTex.image, BACK_UV_RECT);
    }

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [frontImage, backImage, imageFit, frontTex, backTex, materials.base.map]);

  const [curve] = useState(
    () => new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3()
    ])
  );

  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.5, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  // Mobile responsive card scale
  const cardScale = isMobile ? 1.5 : 2.25;
  const cardYOffset = isMobile ? -0.85 : -1.2;

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);

    // ── Smooth heavy pointer follow ──
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));

      dragTarget.current.copy(vec).sub(dragged);

      if (!isDragging.current) {
        dragCurrent.current.copy(dragTarget.current);
        isDragging.current = true;
      } else {
        const ease = 1 - Math.exp(-dt * 12);
        dragCurrent.current.lerp(dragTarget.current, ease);
      }

      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());

      card.current?.setNextKinematicTranslation({
        x: dragCurrent.current.x,
        y: dragCurrent.current.y,
        z: dragCurrent.current.z
      });
    } else {
      isDragging.current = false;
    }

    // ── Band curve with stable lerped joints ──
    if (fixed.current && j1.current && j2.current && j3.current && card.current) {
      if (!lerpedReady.current) {
        lerpedJ1.current.copy(j1.current.translation());
        lerpedJ2.current.copy(j2.current.translation());
        lerpedReady.current = true;
      }

      [j1, j2].forEach((ref, idx) => {
        const store = idx === 0 ? lerpedJ1 : lerpedJ2;
        const pos = ref.current.translation();
        const dist = Math.max(0.05, Math.min(1, store.current.distanceTo(pos)));
        const speed = minSpeed + dist * (maxSpeed - minSpeed);
        const factor = 1 - Math.exp(-dt * speed * 0.4);
        store.current.lerp(pos, factor);
      });

      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(lerpedJ2.current);
      curve.points[2].copy(lerpedJ1.current);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 12 : 24));
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
          mass={isMobile ? 1.5 : 2.5}
          angularDamping={8}
          linearDamping={6}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} friction={0.6} restitution={0.05} />
          <group
            scale={cardScale}
            position={[0, cardYOffset, -0.05]}
            onPointerOver={(e) => { e.stopPropagation(); hover(true); }}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              e.stopPropagation();
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              e.target.setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}