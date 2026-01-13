"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function ThreeScene() {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const controlsRef = useRef(null);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Cleanup previous instance if any
        if (rendererRef.current) {
            try {
                containerRef.current.removeChild(rendererRef.current.domElement);
                rendererRef.current.dispose();
            } catch (e) {
                // ignore
            }
        }

        // --- Setup ---
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 6);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.minPolarAngle = Math.PI / 2.5;
        controls.maxPolarAngle = Math.PI / 1.5;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controlsRef.current = controls;

        // --- Lighting ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x60a5fa, 1.5);
        pointLight1.position.set(10, 10, 10);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xffffff, 0.5);
        pointLight2.position.set(-10, -10, -10);
        scene.add(pointLight2);

        // --- Globe Group ---
        const globeGroup = new THREE.Group();
        scene.add(globeGroup);

        // Core Sphere
        const coreGeometry = new THREE.SphereGeometry(2, 64, 64);
        const coreMaterial = new THREE.MeshStandardMaterial({
            color: 0x1e40af, // primary-800
            roughness: 0.7,
            metalness: 0.1,
            transparent: true,
            opacity: 0.3,
        });
        const coreSphere = new THREE.Mesh(coreGeometry, coreMaterial);
        globeGroup.add(coreSphere);

        // Wireframe Overlay
        const wireGeometry = new THREE.SphereGeometry(2.01, 32, 32);
        const wireMaterial = new THREE.MeshBasicMaterial({
            color: 0x60a5fa, // blue-400
            transparent: true,
            opacity: 0.1,
            wireframe: true,
        });
        const wireSphere = new THREE.Mesh(wireGeometry, wireMaterial);
        globeGroup.add(wireSphere);

        // --- Data Points ---
        const pointsCount = 150;
        const pointsGroup = new THREE.Group();
        globeGroup.add(pointsGroup);

        const pointGeometry = new THREE.SphereGeometry(0.02, 16, 16);
        const pointMaterialBlue = new THREE.MeshBasicMaterial({ color: 0x93c5fd });
        const pointMaterialWhite = new THREE.MeshBasicMaterial({ color: 0xffffff });

        const globePoints = []; // store for flight paths

        for (let i = 0; i < pointsCount; i++) {
            const phi = Math.acos(-1 + (2 * i) / pointsCount);
            const theta = Math.sqrt(pointsCount * Math.PI) * phi;
            const x = 2 * Math.cos(theta) * Math.sin(phi);
            const y = 2 * Math.sin(theta) * Math.sin(phi);
            const z = 2 * Math.cos(phi);
            const pos = new THREE.Vector3(x, y, z);
            globePoints.push(pos);

            const mesh = new THREE.Mesh(
                pointGeometry,
                Math.random() > 0.5 ? pointMaterialBlue : pointMaterialWhite
            );
            mesh.position.copy(pos);
            pointsGroup.add(mesh);
        }

        // --- Flight Paths ---
        const createFlightPath = (start, end) => {
            const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(2.5);
            const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
            const points = curve.getPoints(50);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: 0xfacc15,
                transparent: true,
                opacity: 0.6,
                linewidth: 1
            });
            return new THREE.Line(geometry, material);
        };

        if (globePoints.length > 100) {
            globeGroup.add(createFlightPath(globePoints[10], globePoints[50]));
            globeGroup.add(createFlightPath(globePoints[100], globePoints[20]));
            globeGroup.add(createFlightPath(globePoints[60], globePoints[140]));
            globeGroup.add(createFlightPath(globePoints[30], globePoints[90]));
        }

        // --- Stars Background ---
        const starsGeometry = new THREE.BufferGeometry();
        const starsCount = 5000;
        const starsPos = new Float32Array(starsCount * 3);
        for (let i = 0; i < starsCount * 3; i++) {
            starsPos[i] = (Math.random() - 0.5) * 200;
        }
        starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
        const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.8 });
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(stars);


        // --- Animation Loop ---
        const animate = () => {
            animationFrameRef.current = requestAnimationFrame(animate);

            controls.update();

            // Gentle floating
            const time = Date.now() * 0.001;
            globeGroup.position.y = Math.sin(time * 0.5) * 0.1;
            globeGroup.rotation.y += 0.001;

            renderer.render(scene, camera);
        };
        animate();

        // --- Resize ---
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (controlsRef.current) controlsRef.current.dispose();
            if (rendererRef.current) {
                rendererRef.current.dispose();
                if (containerRef.current && rendererRef.current.domElement) {
                    containerRef.current.removeChild(rendererRef.current.domElement);
                }
            }
        };
    }, []);

    return <div ref={containerRef} className="w-full h-full" />;
}
