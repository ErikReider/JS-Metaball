"use strict";
function createRadialGradient(ctx, w, h, r, c0, c1) {
    let gradient = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, r);
    gradient.addColorStop(0, c0);
    gradient.addColorStop(1, c1);
    return gradient;
}
class Particles {
    constructor(canvas, numberOfParticles, particleRadius, c1, c2, radiusMultiplier, resolution = 1) {
        let raf = window.requestAnimationFrame;
        canvas.style.filter = "blur(3px)";
        canvas.width = document.body.clientWidth * resolution;
        canvas.height = document.body.clientHeight * resolution;
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        let context = canvas.getContext("2d");
        let canvasGradient = createRadialGradient(context, canvas.width, canvas.height, canvas.height * radiusMultiplier, c1, c2);
        context.fillStyle = canvasGradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        var graidentImageData = context.getImageData(0, 0, canvas.width, canvas.height);
        var gradientData = graidentImageData.data;
        context.clearRect(0, 0, canvas.width, canvas.height);
        var imageData = context.createImageData(canvas.width, canvas.height);
        var data = imageData.data;
        window.addEventListener("resize", () => {
            canvas.width = document.body.clientWidth * resolution;
            canvas.height = document.body.clientHeight * resolution;
            canvasGradient = createRadialGradient(context, canvas.width, canvas.height, canvas.height * radiusMultiplier, c1, c2);
            context.fillStyle = canvasGradient;
            context.fillRect(0, 0, canvas.width, canvas.height);
            graidentImageData = context.getImageData(0, 0, canvas.width, canvas.height);
            gradientData = graidentImageData.data;
            context.clearRect(0, 0, canvas.width, canvas.height);
            imageData = context.createImageData(canvas.width, canvas.height);
            data = imageData.data;
        });
        let particleList = Array(numberOfParticles)
            .fill(Object)
            .map((_) => new Particle(particleRadius * resolution, canvas));
        let last = performance.now();
        let refresh = (time) => {
            raf(refresh);
            for (const particle in particleList) {
                particleList[particle].update(time - last);
            }
            for (let sp = 0; sp < data.length; sp += 4) {
                const index = sp / 4;
                const y = (index / canvas.width) | 0;
                const x = index % canvas.width | 0;
                let color = 0;
                for (let i = 0; i < particleList.length; i++) {
                    const ball = particleList[i];
                    const radius = ball.radius;
                    const posX = ball.x;
                    const posY = ball.y;
                    let dsqr = Math.pow(x - posX, 2) + Math.pow(y - posY, 2);
                    color += (radius * radius * 100) / dsqr;
                    if (color >= 255)
                        break;
                }
                if (color > 254) {
                    data[sp + 0] = gradientData[sp + 0];
                    data[sp + 1] = gradientData[sp + 1];
                    data[sp + 2] = gradientData[sp + 2];
                    data[sp + 3] = 255;
                }
                else {
                    data[sp + 3] = 0;
                }
            }
            context.putImageData(imageData, 0, 0);
            last = time;
        };
        raf(refresh);
    }
}
class Particle {
    constructor(rad, canvas) {
        this.radius = (rad * random(6, 10)) / 10;
        this.canvas = canvas;
        // random direction
        this.speedY = (random(0.6, 1) * 0.01) * (random(0, 2) > 0 ? 1 : -1);
        this.speedX = (random(0.6, 1) * 0.01) * (random(0, 2) > 0 ? 1 : -1);
        this.y = Math.random() * (canvas.height - this.radius);
        if (this.y < this.radius)
            this.y = this.radius;
        this.x = Math.random() * (canvas.width - this.radius);
        if (this.x < this.radius)
            this.x = this.radius;
    }
    update(deltaTime) {
        if (this.y + this.radius > this.canvas.height || this.y - this.radius < 0) {
            this.speedY = -this.speedY;
        }
        if (this.x + this.radius > this.canvas.width || this.x - this.radius < 0) {
            this.speedX = -this.speedX;
        }
        this.y += this.speedY * deltaTime;
        this.x += this.speedX * deltaTime;
    }
}
function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
onload = () => {
    const canvas = document.getElementById("canvas");
    new Particles(canvas, 12, 80, "#9C066B", "#2F004B", 0.4, 0.75);
};
