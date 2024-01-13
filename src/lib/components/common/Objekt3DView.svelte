<script lang="ts">
    import * as THREE from 'three';
    import { onMount } from 'svelte';

    export let front: string;
    export let back: string;

    const card = new THREE.Object3D();
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer();
    let view: HTMLDivElement;
    let camera: THREE.PerspectiveCamera;
    let dragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let momentumX = 0;
    let momentumY = 0;

    function dragStart(event: MouseEvent | Touch) {
        dragging = true;
        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
        momentumX = 0;
        momentumY = 0;
    }

    function drag(event: MouseEvent | Touch) {
        if (dragging) {
            const deltaX = event.clientX - previousMouseX;
            const deltaY = event.clientY - previousMouseY;
            
            card.rotation.x = (card.rotation.x + deltaY * 0.01) % (Math.PI * 2);

            let multiple = 1;
            if ((Math.PI / 2) < Math.abs(card.rotation.x) && Math.abs(card.rotation.x) < (Math.PI * 1.5))
                multiple = -1;
            card.rotation.y += deltaX * 0.01 * multiple;

            momentumX = deltaX * multiple;
            momentumY = deltaY;

            previousMouseX = event.clientX;
            previousMouseY = event.clientY;
        }
    }

    function stopDrag() {
        if (dragging) {
            dragging = false;
            applyMomentum();
        }
    }

    function applyMomentum() {
        if (Math.abs(momentumX) > 0.1 || Math.abs(momentumY) > 0.1) {
            card.rotation.y += momentumX * 0.002;
            card.rotation.x += momentumY * 0.002;
            momentumX *= 0.98;
            momentumY *= 0.98;
            requestAnimationFrame(applyMomentum);
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    onMount(() => {
        camera = new THREE.PerspectiveCamera(
            30,
            view.clientWidth / view.clientHeight,
            0.1,
            1000
        );
        renderer.setSize(view.clientWidth, view.clientHeight);
        view.appendChild(renderer.domElement);

        const frontTexture = new THREE.TextureLoader().load(front);
        frontTexture.colorSpace = THREE.SRGBColorSpace;

        const backTexture = new THREE.TextureLoader().load(back);
        backTexture.colorSpace = THREE.SRGBColorSpace;
        backTexture.wrapS = THREE.RepeatWrapping;
        backTexture.repeat.x = -1;

        camera.position.z = 10;

        const FOV = camera.fov * (Math.PI / 180);
        const height = 2 * camera.position.z * Math.tan(FOV / 2) * 0.75;
        const geometry = new THREE.PlaneGeometry(height * (2/3), height);

        const frontMaterial = new THREE.MeshBasicMaterial({
            map: frontTexture,
            side: THREE.FrontSide
        });
        const backMaterial = new THREE.MeshBasicMaterial({
            map: backTexture,
            side: THREE.BackSide
        });

        const frontMesh = new THREE.Mesh(geometry, frontMaterial);
        const backMesh = new THREE.Mesh(geometry, backMaterial);

        card.add(frontMesh);
        card.add(backMesh);
        scene.add(card);

        animate();
    });
</script>

<svelte:window on:mouseup={() => stopDrag()} on:touchend={() => stopDrag()}/>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div bind:this={view}
    on:mousedown={(e) => dragStart(e)} on:touchstart={(e) => dragStart(e.touches[0])}
    on:mousemove={(e) => drag(e)} on:touchmove={(e) => drag(e.touches[0])}>
</div>

<style>
    div {
        width: 100%;
        height: 100%;
    }
</style>
