<script setup>
import * as THREE from 'three'
</script>

<template>
    <div ref="view"></div>
</template>

<script>
export default {
    mounted() {
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            30,
            this.$refs.view.clientWidth / this.$refs.view.clientHeight,
            0.1,
            1000
        )
        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(this.$refs.view.clientWidth, this.$refs.view.clientHeight)
        this.$refs.view.appendChild(renderer.domElement)

        const frontTexture = new THREE.TextureLoader().load(this.front)
        frontTexture.colorSpace = THREE.SRGBColorSpace

        const backTexture = new THREE.TextureLoader().load(this.back)
        backTexture.colorSpace = THREE.SRGBColorSpace
        backTexture.wrapS = THREE.RepeatWrapping
        backTexture.repeat.x = -1

        camera.position.z = 10

        const FOV = camera.fov * (Math.PI / 180)
        const height = 2 * camera.position.z * Math.tan(FOV / 2) * 0.75
        const geometry = new THREE.PlaneGeometry(height * (2/3), height)

        const frontMaterial = new THREE.MeshBasicMaterial({
            map: frontTexture,
            side: THREE.FrontSide
        })
        const backMaterial = new THREE.MeshBasicMaterial({
            map: backTexture,
            side: THREE.BackSide
        })

        const card = new THREE.Object3D()
        const frontMesh = new THREE.Mesh(geometry, frontMaterial)
        const backMesh = new THREE.Mesh(geometry, backMaterial)

        card.add(frontMesh)
        card.add(backMesh)
        scene.add(card)

        let dragging = false
        let previousMouseX = 0
        let previousMouseY = 0
        let momentumX = 0
        let momentumY = 0

        const dragStart = (event) => {
            dragging = true
            previousMouseX = event.clientX
            previousMouseY = event.clientY
            momentumX = 0
            momentumY = 0
        }
        this.$refs.view.addEventListener('mousedown', (e) => dragStart(e))
        this.$refs.view.addEventListener('touchstart', (e) => dragStart(e.touches[0]))

        const drag = (event) => {
            if (dragging) {
                const deltaX = event.clientX - previousMouseX
                const deltaY = event.clientY - previousMouseY
                
                card.rotation.x = (card.rotation.x + deltaY * 0.01) % (Math.PI * 2)

                let multiple = 1
                if ((Math.PI / 2) < Math.abs(card.rotation.x) && Math.abs(card.rotation.x) < (Math.PI * 1.5))
                    multiple = -1
                card.rotation.y += deltaX * 0.01 * multiple

                momentumX = deltaX * multiple
                momentumY = deltaY

                previousMouseX = event.clientX
                previousMouseY = event.clientY
            }
        }
        this.$refs.view.addEventListener('mousemove', e => drag(e))
        this.$refs.view.addEventListener('touchmove', e => drag(e.touches[0]))

        const stopDrag = () => {
            if (dragging) {
                dragging = false;

                const applyMomentum = () => {
                    if (Math.abs(momentumX) > 0.1 || Math.abs(momentumY) > 0.1) {
                        card.rotation.y += momentumX * 0.002
                        card.rotation.x += momentumY * 0.002
                        momentumX *= 0.98
                        momentumY *= 0.98
                        requestAnimationFrame(applyMomentum)
                    }
                };

                applyMomentum()
            }
        }
        window.addEventListener('mouseup', stopDrag)
        window.addEventListener('touchend', stopDrag)

        const animate = () => {
            requestAnimationFrame(animate)
            renderer.render(scene, camera)
        };

        animate()
    },
    props: {
        front: String,
        back: String
    }
}
</script>
