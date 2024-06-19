const color1Input = document.getElementById('color1');
const color2Input = document.getElementById('color2');
const color1Hex = document.getElementById('color1-hex');
const color2Hex = document.getElementById('color2-hex');
const resultColorDiv = document.getElementById('result-color');
const mixButton = document.getElementById('mix-button');
const commentDiv = document.getElementById('comment');

function updateHexCodes() {
    color1Hex.value = color1Input.value;
    color2Hex.value = color2Input.value;
}

function updateColorPickers() {
    if(/^#[0-9A-F]{6}$/i.test(color1Hex.value)) {
        color1Input.value = color1Hex.value;
    }
    if(/^#[0-9A-F]{6}$/i.test(color2Hex.value)) {
        color2Input.value = color2Hex.value;
    }
}

function mixColors(color1, color2) {
    const hexToRgb = hex => {
        const bigint = parseInt(hex.slice(1), 16);
        return [bigint >> 16 & 255, bigint >> 8 & 255, bigint & 255];
    };

    const rgbToHex = ([r, g, b]) => {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    };

    const [r1, g1, b1] = hexToRgb(color1);
    const [r2, g2, b2] = hexToRgb(color2);

    const mixedColor = [
        Math.floor((r1 + r2) / 2),
        Math.floor((g1 + g2) / 2),
        Math.floor((b1 + b2) / 2)
    ];

    return rgbToHex(mixedColor);
}

function calculateBrightness([r, g, b]) {
    return Math.sqrt(
        0.299 * (r * r) +
        0.587 * (g * g) +
        0.114 * (b * b)
    );
}


function calculateSaturation([r, g, b]) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return (max - min) / max;
}

function getComment(brightness, saturation) {
    if (brightness > 200) {
        return "Whoa! Someone likes it bright!";
    } else if (brightness < 50) {
        return "Did someone turn off the lights?";
    } else if (saturation > 0.7) {
        return "Flashy flashy!";
    } else {
        return "Hmmm.... Seems good.";
    }
}

function updateResultColor() {
    const color1 = color1Input.value;
    const color2 = color2Input.value;
    const mixedColor = mixColors(color1, color2);

    const rgbMixed = mixedColor.slice(1).match(/.{1,2}/g).map(hex => parseInt(hex, 16));
    const brightness = calculateBrightness(rgbMixed);
    const saturation = calculateSaturation(rgbMixed);
    const comment = getComment(brightness, saturation);

    resultColorDiv.style.backgroundColor = mixedColor;
    commentDiv.textContent = comment;
}

color1Input.addEventListener('input', updateHexCodes);
color2Input.addEventListener('input', updateHexCodes);
color1Hex.addEventListener('input', updateColorPickers);
color2Hex.addEventListener('input', updateColorPickers);

mixButton.addEventListener('click', updateResultColor);

// Initialize
updateHexCodes();
