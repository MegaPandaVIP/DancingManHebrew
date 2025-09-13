// מיפוי האותיות העבריות לדמויות רוקדות
const HEBREW_LETTERS = {
    'א': { body: 'M 0,0 L 0,-20 M -10,0 L 10,0 M 0,-20 L -10,-10', arms: 'M 0,-15 L -8,-18 M 0,-15 L 8,-12', legs: 'M 0,0 L -8,10 M 0,0 L 8,10', head: 'circle' },
    'ב': { body: 'M 0,0 L 0,-20', arms: 'M 0,-15 L -10,-10 M 0,-15 L 10,-10', legs: 'M 0,0 L -10,8 M 0,0 L 5,10', head: 'rect' },
    'ג': { body: 'M 0,0 L 0,-20', arms: 'M 0,-15 L -8,-20 M 0,-15 L 8,-20', legs: 'M 0,0 L -5,10 M 0,0 L 10,5', head: 'triangle' },
    'ד': { body: 'M 0,0 L 0,-20', arms: 'M 0,-15 L -10,-15 M 0,-15 L 10,-15', legs: 'M 0,0 L -10,0 M 0,0 L 10,0', head: 'diamond' },
    // ... המשך המיפוי לכל האותיות העבריות כולל אותיות סופיות
};

// פונקציה ליצירת SVG של דמות רוקדת
function createDancingFigure(letter, size = 50, happy = true) {
    const figure = HEBREW_LETTERS[letter] || HEBREW_LETTERS['א'];
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', '-15 -25 30 40');

    // יצירת הדמות
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('stroke', '#40e0d0');
    g.setAttribute('stroke-width', '2');
    g.setAttribute('fill', 'none');

    // יצירת חלקי הגוף
    const parts = ['body', 'arms', 'legs'];
    parts.forEach(part => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', figure[part]);
        g.appendChild(path);
    });

    // יצירת הראש
    const head = document.createElementNS('http://www.w3.org/2000/svg', figure.head === 'circle' ? 'circle' : 'path');
    if (figure.head === 'circle') {
        head.setAttribute('cx', '0');
        head.setAttribute('cy', '-22');
        head.setAttribute('r', '3');
    } else {
        // יצירת צורות ראש אחרות בהתאם לסוג
        const headShapes = {
            'rect': 'M -3,-25 L 3,-25 L 3,-19 L -3,-19 Z',
            'triangle': 'M -3,-19 L 0,-25 L 3,-19 Z',
            'diamond': 'M 0,-25 L 3,-22 L 0,-19 L -3,-22 Z'
        };
        head.setAttribute('d', headShapes[figure.head]);
    }
    g.appendChild(head);

    // הוספת פרצוף
    const face = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    face.setAttribute('d', happy ? 'M -2,-22 L -1,-22 M 1,-22 L 2,-22 M -1,-21 C 0,-20 1,-20 1,-21' : 
                                 'M -2,-22 L -1,-22 M 1,-22 L 2,-22 M -1,-20 C 0,-21 1,-21 1,-20');
    g.appendChild(face);

    svg.appendChild(g);
    return svg;
}

// פונקציה ליצירת דגלון
function createFlag(size = 50) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size / 2);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', '0 -25 15 40');

    const flag = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    flag.setAttribute('d', 'M 0,0 L 0,-20 L 10,-15 L 0,-10');
    flag.setAttribute('stroke', '#9370db');
    flag.setAttribute('stroke-width', '2');
    flag.setAttribute('fill', 'none');

    svg.appendChild(flag);
    return svg;
}

// פונקציה להמרת טקסט לצופן
function encodeText() {
    const input = document.getElementById('inputText').value;
    const showFlags = document.getElementById('wordEndFlag').checked;
    const size = parseInt(document.getElementById('figureSize').value);
    const output = document.getElementById('outputSvg');
    output.innerHTML = '';

    const container = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    let currentX = 0;
    const words = input.split(' ');

    words.forEach((word, wordIndex) => {
        [...word].forEach((letter, index) => {
            if (HEBREW_LETTERS[letter]) {
                const figure = createDancingFigure(letter, size);
                figure.style.transform = `translateX(${currentX}px)`;
                output.appendChild(figure);
                currentX += size;
            }
        });

        if (showFlags && wordIndex < words.length - 1) {
            const flag = createFlag(size);
            flag.style.transform = `translateX(${currentX}px)`;
            output.appendChild(flag);
            currentX += size / 2;
        }

        if (wordIndex < words.length - 1) {
            currentX += size / 2; // רווח בין מילים
        }
    });

    output.style.width = `${currentX}px`;
}

// פונקציה להורדת התמונה כ-PNG
function downloadImage() {
    const output = document.getElementById('outputSvg');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(output);
    const img = new Image();
    
    canvas.width = output.scrollWidth;
    canvas.height = output.scrollHeight;
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    img.onload = function() {
        ctx.drawImage(img, 0, 0);
        const link = document.createElement('a');
        link.download = 'dancing-men-cipher.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
}

// יצירת המקרא
function createLegend() {
    const legend = document.getElementById('legendGrid');
    Object.entries(HEBREW_LETTERS).forEach(([letter, figure]) => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        
        const svg = createDancingFigure(letter, 40);
        const label = document.createElement('span');
        label.textContent = letter;
        
        item.appendChild(svg);
        item.appendChild(label);
        legend.appendChild(item);
    });
}

// אתחול
document.addEventListener('DOMContentLoaded', () => {
    createLegend();
    document.getElementById('encodeBtn').addEventListener('click', encodeText);
    document.getElementById('downloadBtn').addEventListener('click', downloadImage);
    document.getElementById('figureSize').addEventListener('input', encodeText);
    document.getElementById('wordEndFlag').addEventListener('change', encodeText);
});
