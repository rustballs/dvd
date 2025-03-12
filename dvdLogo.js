const canvas = document.getElementById('dvdCanvas');
const ctx = canvas.getContext('2d');
const bounceSound = document.getElementById('bounceSound');
const cornerSound = document.getElementById('cornerSound');

const dvdLogos = [];

class DVDLogo {
    constructor(x, y, width, height, dx, dy, imgSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dx = dx;
        this.dy = dy;
        this.img = new Image();
        this.img.src = imgSrc;
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;

        let bounced = false;
        if (this.x <= 0 || this.x + this.width >= canvas.width) {
            this.dx = -this.dx;
            bounced = true;
        }
        if (this.y <= 0 || this.y + this.height >= canvas.height) {
            this.dy = -this.dy;
            bounced = true;
        }

        if (bounced) {
            bounceSound.play();
        }

        if ((this.x <= 0 && this.y <= 0) || (this.x + this.width >= canvas.width && this.y <= 0) ||
            (this.x <= 0 && this.y + this.height >= canvas.height) || (this.x + this.width >= canvas.width && this.y + this.height >= canvas.height)) {
            cornerSound.play();

            // Spawn a new DVD logo at a random corner
            const corners = [
                { x: 0, y: 0 },
                { x: canvas.width - this.width, y: 0 },
                { x: 0, y: canvas.height - this.height },
                { x: canvas.width - this.width, y: canvas.height - this.height }
            ];
            const randomCorner = corners[Math.floor(Math.random() * corners.length)];
            const randomSpeed = () => (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 + 1);
            const newLogo = new DVDLogo(randomCorner.x, randomCorner.y, this.width, this.height, randomSpeed(), randomSpeed(), this.img.src);
            dvdLogos.push(newLogo);
        }
    }
}

function init() {
    const initialLogo = new DVDLogo(100, 100, 80, 60, 2, 2, 'dvd-logo.png');
    dvdLogos.push(initialLogo);
    animate();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dvdLogos.forEach(logo => {
        logo.draw();
        logo.update();
    });
    requestAnimationFrame(animate);
}

init();
