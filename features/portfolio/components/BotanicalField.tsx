'use client';

import { useEffect, useMemo, useRef } from 'react';
import styles from './portfolio.module.css';

type BotanicalFieldProps = {
    activeProject: number;
};

type NumericParticle = {
    x: number;
    y: number;
    z: number;
    originX: number;
    originY: number;
    originZ: number;
    size: number;
    alpha: number;
    stage: number;
    duration: number;
    digit: number;
    rotation: number;
    phase: number;
    index: number;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smoothCurve = (value: number) => value * value * (3 - 2 * value);
const ISOTYPE_VIEWBOX_WIDTH = 244;
const ISOTYPE_VIEWBOX_HEIGHT = 243;
const ISOTYPE_WORLD_WIDTH = 0.105;
const ISOTYPE_WORLD_HEIGHT = ISOTYPE_WORLD_WIDTH * (ISOTYPE_VIEWBOX_HEIGHT / ISOTYPE_VIEWBOX_WIDTH);
const ISOTYPE_CENTER_X = -0.015;
const ISOTYPE_CENTER_Y = -0.79;
const ISOTYPE_VISIBLE_PARTICLES = 650;
const BLOOM_DENSITY_INCREASE = 0.35;
const DIGIT_CANVAS_FONT = "500 70px 'Space Grotesk Variable', sans-serif";
const ISOTYPE_PATH = 'M237.726 62.4301C237.962 62.4539 238.194 62.4889 238.422 62.5354C238.876 62.6281 239.315 62.7639 239.732 62.9397C242.24 63.996 244 66.4687 244 69.3509V180.607H197.508C195.655 180.608 193.878 181.341 192.568 182.646L183.397 191.782C182.088 193.087 181.351 194.857 181.351 196.702V243H69.6363C69.1536 243 68.6825 242.95 68.2273 242.857C67.7731 242.765 67.3348 242.629 66.9173 242.453C64.4095 241.397 62.6497 238.924 62.6495 236.042V180.607H165.251C167.104 180.607 168.881 179.873 170.191 178.569L179.304 169.494C180.614 168.189 181.35 166.419 181.351 164.574V62.3927H237.013C237.254 62.3927 237.492 62.4064 237.726 62.4301ZM174.364 0C178.222 1.67984e-07 181.351 3.11529 181.351 6.95819V62.3927H78.7485C76.8959 62.393 75.1187 63.1266 73.8086 64.4313L64.6964 73.5061C63.3863 74.8108 62.6497 76.5807 62.6495 78.4258V180.607H6.98683C3.12818 180.607 0.000115232 177.492 0 173.649V62.3927H46.489C48.3417 62.3924 50.1189 61.6589 51.4289 60.3542L60.6026 51.2182C61.9125 49.9135 62.6491 48.1435 62.6495 46.2985V0H174.364Z';

type IsotypeMask = {
    canvas: HTMLCanvasElement;
    interior: Array<[number, number]>;
    edge: Array<[number, number]>;
};

function createIsotypeMask(): IsotypeMask {
    const canvas = document.createElement('canvas');
    canvas.width = ISOTYPE_VIEWBOX_WIDTH;
    canvas.height = ISOTYPE_VIEWBOX_HEIGHT;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Unable to create the isotype mask.');

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#fff';
    context.fill(new Path2D(ISOTYPE_PATH));
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const interior: Array<[number, number]> = [];
    const edge: Array<[number, number]> = [];
    const alphaAt = (x: number, y: number) => {
        if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return 0;
        return pixels[(y * canvas.width + x) * 4 + 3];
    };

    for (let y = 0; y < canvas.height; y += 1) {
        for (let x = 0; x < canvas.width; x += 1) {
            if (alphaAt(x, y) < 128) continue;
            interior.push([x, y]);
            if (
                alphaAt(x - 2, y) < 128 ||
                alphaAt(x + 2, y) < 128 ||
                alphaAt(x, y - 2) < 128 ||
                alphaAt(x, y + 2) < 128
            ) {
                edge.push([x, y]);
            }
        }
    }

    return { canvas, interior, edge };
}

function createSeededRandom(seed: number) {
    let state = seed >>> 0;
    return () => {
        state += 0x6d2b79f5;
        let value = state;
        value = Math.imul(value ^ (value >>> 15), value | 1);
        value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
        return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
}

const vertexShaderSource = `#version 300 es
precision highp float;

layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec3 aTarget;
layout(location = 2) in vec3 aOrigin;
layout(location = 3) in vec4 aVisual;
layout(location = 4) in vec3 aMeta;
layout(location = 5) in vec4 aLogo;

uniform vec2 uResolution;
uniform vec2 uCenter;
uniform vec2 uScale;
uniform vec2 uRotation;
uniform float uProgress;
uniform float uTime;
uniform float uVisibility;
uniform float uDpr;
uniform float uCompact;

out vec2 vUv;
out vec2 vLogoUv;
out float vAlpha;
out float vLogoPresence;

float smoothCurve(float value) {
    return value * value * (3.0 - 2.0 * value);
}

void main() {
    float localProgress = clamp((uProgress - aVisual.z) / aVisual.w, 0.0, 1.0);
    float smoothProgress = smoothCurve(localProgress);
    float emergence = 1.0 - pow(1.0 - smoothProgress, 3.0);
    float breath = 1.0 + sin(uTime * 0.34 + aMeta.z) * 0.0035 * emergence;
    float logoPresence = 1.0 - smoothCurve(clamp(uProgress / 0.145, 0.0, 1.0));
    float logoRelease = smoothCurve(clamp((uProgress - aMeta.z * 0.0018) / 0.13, 0.0, 1.0));

    vec3 plantWorld = mix(aOrigin, aTarget, emergence);
    plantWorld.x *= breath;
    vec3 world = mix(aLogo.xyz, plantWorld, logoRelease);

    float rotationPresence = 1.0 - logoPresence;
    float cosX = cos(uRotation.x * rotationPresence);
    float sinX = sin(uRotation.x * rotationPresence);
    float cosY = cos(uRotation.y * rotationPresence);
    float sinY = sin(uRotation.y * rotationPresence);
    float rotatedY = world.y * cosX - world.z * sinX;
    float rotatedZFromX = world.y * sinX + world.z * cosX;
    float rotatedX = world.x * cosY + rotatedZFromX * sinY;
    float depth = -world.x * sinY + rotatedZFromX * cosY;
    float perspective = 1.0 / max(0.72, 1.0 - depth * 0.46);
    float depthTone = clamp((depth + 0.22) / 0.62, 0.0, 1.0);

    float logoWeight = aLogo.w * logoPresence;
    float visibleAlpha = max(aVisual.y * smoothProgress, logoWeight * 0.94);
    float alpha = visibleAlpha * uVisibility * (0.62 + depthTone * 0.38) * mix(1.0, 0.82, uCompact);
    float baseSize = mix(aVisual.x, 3.45, logoWeight);
    float size = baseSize * perspective * (0.78 + depthTone * 0.5) * uDpr * mix(1.0, 0.79, uCompact);

    float spriteRotation = aMeta.y + uRotation.y * 0.35;
    float cosine = cos(spriteRotation);
    float sine = sin(spriteRotation);
    vec2 glyphCorner = vec2(aCorner.x * 0.72, aCorner.y);
    vec2 corner = vec2(
        glyphCorner.x * cosine - glyphCorner.y * sine,
        glyphCorner.x * sine + glyphCorner.y * cosine
    ) * size;
    vec2 screen = uCenter + vec2(rotatedX * uScale.x, -rotatedY * uScale.y) * perspective + corner;
    vec2 clip = vec2(
        screen.x / uResolution.x * 2.0 - 1.0,
        1.0 - screen.y / uResolution.y * 2.0
    );

    gl_Position = vec4(clip, 0.0, 1.0);
    vUv = vec2((aMeta.x + aCorner.x + 0.5) / 10.0, aCorner.y + 0.5);
    vec2 screenWorld = vec2(
        (screen.x - uCenter.x) / uScale.x,
        -(screen.y - uCenter.y) / uScale.y
    );
    vLogoUv = vec2(
        (screenWorld.x - (-0.015 - 0.105 * 0.5)) / 0.105,
        ((-0.79 + 0.10456967 * 0.5) - screenWorld.y) / 0.10456967
    );
    vAlpha = alpha;
    vLogoPresence = logoPresence;
}
`;

const fragmentShaderSource = `#version 300 es
precision mediump float;

uniform sampler2D uAtlas;
uniform sampler2D uLogoMask;
uniform float uDark;

in vec2 vUv;
in vec2 vLogoUv;
in float vAlpha;
in float vLogoPresence;

out vec4 outColor;

void main() {
    float glyph = texture(uAtlas, vUv).a;
    float maskAlpha = 1.0;
    if (vLogoPresence > 0.001) {
        float inside = step(0.0, vLogoUv.x) * step(vLogoUv.x, 1.0) * step(0.0, vLogoUv.y) * step(vLogoUv.y, 1.0);
        float logoMask = texture(uLogoMask, clamp(vLogoUv, 0.0, 1.0)).a * inside;
        maskAlpha = mix(1.0, logoMask, vLogoPresence);
    }
    float alpha = glyph * vAlpha * maskAlpha;
    if (alpha < 0.008) discard;
    vec3 ink = mix(vec3(0.035, 0.035, 0.032), vec3(0.94, 0.94, 0.91), uDark);
    outColor = vec4(ink, alpha);
}
`;

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);
    if (!shader) throw new Error('Unable to create WebGL shader.');
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = gl.getShaderInfoLog(shader) ?? 'Unknown shader error.';
        gl.deleteShader(shader);
        throw new Error(message);
    }
    return shader;
}

function createProgram(gl: WebGL2RenderingContext) {
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = gl.createProgram();
    if (!program) throw new Error('Unable to create WebGL program.');
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const message = gl.getProgramInfoLog(program) ?? 'Unknown program error.';
        gl.deleteProgram(program);
        throw new Error(message);
    }
    return program;
}

function createDigitTexture(gl: WebGL2RenderingContext) {
    const cellWidth = 64;
    const cellHeight = 88;
    const atlas = document.createElement('canvas');
    atlas.width = cellWidth * 10;
    atlas.height = cellHeight;
    const context = atlas.getContext('2d');
    if (!context) throw new Error('Unable to create digit atlas.');

    context.clearRect(0, 0, atlas.width, atlas.height);
    context.fillStyle = '#ffffff';
    context.font = DIGIT_CANVAS_FONT;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    for (let digit = 0; digit < 10; digit += 1) {
        context.fillText(String(digit), digit * cellWidth + cellWidth / 2, cellHeight / 2 + 2);
    }

    const texture = gl.createTexture();
    if (!texture) throw new Error('Unable to create digit texture.');
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
    return {
        texture,
        refresh: () => {
            context.clearRect(0, 0, atlas.width, atlas.height);
            context.fillStyle = '#ffffff';
            context.font = DIGIT_CANVAS_FONT;
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            for (let digit = 0; digit < 10; digit += 1) {
                context.fillText(String(digit), digit * cellWidth + cellWidth / 2, cellHeight / 2 + 2);
            }
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
        },
    };
}

function createMaskTexture(gl: WebGL2RenderingContext, mask: HTMLCanvasElement) {
    const texture = gl.createTexture();
    if (!texture) throw new Error('Unable to create isotype mask texture.');
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mask);
    return texture;
}

function getUniform(gl: WebGL2RenderingContext, program: WebGLProgram, name: string) {
    const location = gl.getUniformLocation(program, name);
    if (!location) throw new Error(`Missing WebGL uniform: ${name}`);
    return location;
}

function createAttributeBuffer(
    gl: WebGL2RenderingContext,
    location: number,
    size: number,
    data: Float32Array,
    divisor = 1,
) {
    const buffer = gl.createBuffer();
    if (!buffer) throw new Error('Unable to create WebGL buffer.');
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(location, divisor);
    return buffer;
}

function createBloomParticles() {
    const random = createSeededRandom(20260815);
    const particles: NumericParticle[] = [];
    let particleIndex = 0;

    function addParticle(particle: Omit<NumericParticle, 'digit' | 'index' | 'phase'> & { digit?: number }) {
        particles.push({
            ...particle,
            digit: particle.digit ?? Math.floor(random() * 10),
            phase: random() * Math.PI * 2,
            index: particleIndex,
        });
        particleIndex += 1;
    }

    const stemX = (t: number) => -0.015 + Math.sin(t * Math.PI * 2.3) * 0.022 + t * 0.055;
    const stemY = (t: number) => -0.79 + t * 1.03;

    for (let index = 0; index < 800; index += 1) {
        const t = (index + random()) / 800;
        const angle = random() * Math.PI * 2;
        const radius = Math.sqrt(random()) * (0.018 + (1 - t) * 0.012);
        addParticle({
            x: stemX(t) + Math.cos(angle) * radius,
            y: stemY(t) + Math.sin(angle) * radius * 0.42,
            z: Math.sin(angle) * radius + (random() - 0.5) * 0.012,
            originX: stemX(0),
            originY: stemY(0),
            originZ: 0,
            size: 5.5 + random() * 6.5,
            alpha: 0.46 + random() * 0.5,
            stage: 0.035 + t * 0.34 + random() * 0.018,
            duration: 0.075 + random() * 0.055,
            rotation: (random() - 0.5) * 0.24,
        });
    }

    function addLeaf({
        stemPosition,
        direction,
        length,
        width,
        count,
        start,
    }: {
        stemPosition: number;
        direction: number;
        length: number;
        width: number;
        count: number;
        start: number;
    }) {
        const attachmentX = stemX(stemPosition);
        const attachmentY = stemY(stemPosition);

        for (let index = 0; index < count; index += 1) {
            const u = Math.pow(random(), 0.88);
            const v = random() * 2 - 1;
            const widthProfile = Math.pow(Math.sin(Math.PI * u), 0.72) * width;
            const longitudinal = u * length;
            const lateral = v * widthProfile;
            const x = attachmentX + Math.cos(direction) * longitudinal - Math.sin(direction) * lateral;
            const y = attachmentY + Math.sin(direction) * longitudinal + Math.cos(direction) * lateral;
            const z = Math.sin(Math.PI * u) * 0.1 + (1 - Math.abs(v)) * 0.055 + (random() - 0.5) * 0.025;
            addParticle({
                x,
                y,
                z,
                originX: attachmentX,
                originY: attachmentY,
                originZ: 0,
                size: 5 + random() * 8,
                alpha: 0.35 + random() * 0.58,
                stage: start + u * 0.14 + random() * 0.025,
                duration: 0.12 + random() * 0.07,
                rotation: direction + (random() - 0.5) * 0.42,
            });
        }

        const veinCount = Math.round(count * 0.22);
        for (let index = 0; index < veinCount; index += 1) {
            const u = (index + random()) / veinCount;
            const widthProfile = Math.pow(Math.sin(Math.PI * u), 0.72) * width;
            const lateral = (random() - 0.5) * widthProfile * 0.12;
            const longitudinal = u * length;
            addParticle({
                x: attachmentX + Math.cos(direction) * longitudinal - Math.sin(direction) * lateral,
                y: attachmentY + Math.sin(direction) * longitudinal + Math.cos(direction) * lateral,
                z: Math.sin(Math.PI * u) * 0.13 + 0.055 + (random() - 0.5) * 0.01,
                originX: attachmentX,
                originY: attachmentY,
                originZ: 0,
                size: 3.4 + random() * 4.8,
                alpha: 0.5 + random() * 0.46,
                stage: start + u * 0.14 + random() * 0.014,
                duration: 0.1 + random() * 0.05,
                rotation: direction + (random() - 0.5) * 0.18,
            });
        }
    }

    addLeaf({ stemPosition: 0.36, direction: Math.PI * 0.93, length: 0.41, width: 0.13, count: 450, start: 0.2 });
    addLeaf({ stemPosition: 0.51, direction: Math.PI * 0.08, length: 0.36, width: 0.115, count: 420, start: 0.28 });
    addLeaf({ stemPosition: 0.65, direction: Math.PI * 0.86, length: 0.27, width: 0.085, count: 300, start: 0.34 });

    const flowerX = stemX(1) + 0.005;
    const flowerY = 0.29;
    const discY = flowerY;
    const centralDiscStartIndex = particleIndex;

    for (let index = 0; index < 1500; index += 1) {
        const radius = 0.16 * Math.sqrt((index + random()) / 1500);
        const angle = index * 2.399963229728653 + random() * 0.025;
        const normalizedRadius = radius / 0.16;
        const domeProfile = 1 - normalizedRadius * normalizedRadius;
        addParticle({
            x: flowerX + Math.cos(angle) * radius,
            y: discY + Math.sin(angle) * radius * 0.72,
            z:
                0.095 +
                domeProfile * 0.045 +
                Math.sin(normalizedRadius * Math.PI * 8) * 0.0025 +
                (random() - 0.5) * 0.006,
            originX: flowerX,
            originY: flowerY,
            originZ: 0.08,
            size: 2.35 + random() * 3.9,
            alpha: 0.42 + random() * 0.48,
            stage: 0.4 + normalizedRadius * 0.11 + random() * 0.025,
            duration: 0.11 + random() * 0.065,
            rotation: angle + Math.PI * 0.5 + (random() - 0.5) * 0.35,
        });
    }
    const centralDiscEndIndex = particleIndex;
    const centralDiscParticles = particles.slice(centralDiscStartIndex, centralDiscEndIndex);

    for (let sepal = 0; sepal < 5; sepal += 1) {
        const angle = Math.PI * 0.92 + (sepal / 4) * Math.PI * 1.15 + (random() - 0.5) * 0.16;
        const length = 0.2 + random() * 0.13;
        const width = 0.055 + random() * 0.035;
        for (let index = 0; index < 75; index += 1) {
            const u = Math.pow(random(), 0.9);
            const v = random() * 2 - 1;
            const widthProfile = Math.sin(Math.PI * u) * width;
            const radius = 0.07 + u * length;
            const lateral = v * widthProfile;
            addParticle({
                x: flowerX + Math.cos(angle) * radius - Math.sin(angle) * lateral,
                y: flowerY + Math.sin(angle) * radius * 0.88 + Math.cos(angle) * lateral,
                z: -0.055 + Math.sin(Math.PI * u) * 0.075 + (random() - 0.5) * 0.018,
                originX: flowerX,
                originY: flowerY,
                originZ: 0,
                size: 3.4 + random() * 6.4,
                alpha: 0.2 + random() * 0.48,
                stage: 0.45 + u * 0.1 + random() * 0.018,
                duration: 0.11 + random() * 0.06,
                rotation: angle + (random() - 0.5) * 0.34,
            });
        }
    }

    function addPetalLayer({
        petalCount,
        density,
        minLength,
        maxLength,
        minWidth,
        maxWidth,
        startRadius,
        zBase,
        zLift,
        curl,
        stageStart,
        stageSpread,
        sizeMin,
        sizeRange,
        alphaMin,
        alphaRange,
        angleOffset,
        angleSpan,
    }: {
        petalCount: number;
        density: number;
        minLength: number;
        maxLength: number;
        minWidth: number;
        maxWidth: number;
        startRadius: number;
        zBase: number;
        zLift: number;
        curl: number;
        stageStart: number;
        stageSpread: number;
        sizeMin: number;
        sizeRange: number;
        alphaMin: number;
        alphaRange: number;
        angleOffset: number;
        angleSpan: number;
    }) {
        for (let petal = 0; petal < petalCount; petal += 1) {
            const angle = angleOffset + (petal / petalCount) * angleSpan + (random() - 0.5) * 0.055;
            const length = minLength + random() * (maxLength - minLength);
            const width = minWidth + random() * (maxWidth - minWidth);
            const bend = (random() - 0.5) * 0.018;
            const depthBand = petal % 3;
            const petalDepth = zBase - Math.sin(angle) * 0.085 + depthBand * 0.018;
            const crossTilt = (random() - 0.5) * 0.16;
            const petalTone = 0.82 + depthBand * 0.075;

            for (let index = 0; index < density; index += 1) {
                const placement = random();
                const u = placement < 0.17
                    ? 0.72 + Math.pow(random(), 0.62) * 0.28
                    : Math.pow(random(), 0.82);
                const distribution = random();
                let v: number;
                let structuralTone: number;
                if (distribution < 0.34) {
                    const side = random() < 0.5 ? -1 : 1;
                    v = side * (0.82 + random() * 0.18);
                    structuralTone = 1.34;
                } else if (distribution < 0.52) {
                    v = (random() - 0.5) * 0.16;
                    structuralTone = 1.08;
                } else {
                    v = random() * 2 - 1;
                    structuralTone = 0.98;
                }
                const widthProfile = Math.pow(Math.sin(Math.PI * u), 0.5) * width * (0.92 + u * 0.1);
                const tipRuffle = smoothCurve(clamp01((u - 0.57) / 0.43));
                const rimWave = Math.sin(v * Math.PI * 3.4 + petal * 0.91) * 0.0045 * tipRuffle;
                const radius = startRadius + u * length + rimWave;
                const lateral = v * widthProfile + bend * u * u;
                const petalAngle = angle + Math.sin(u * Math.PI) * bend * 0.12;
                const x = flowerX + Math.cos(petalAngle) * radius - Math.sin(petalAngle) * lateral;
                const layerShiftY = zBase > 0.05 ? -0.012 : 0.008;
                const rawY = flowerY + layerShiftY + Math.sin(petalAngle) * radius * 0.9 + Math.cos(petalAngle) * lateral;
                const z =
                    petalDepth +
                    Math.sin(Math.PI * u) * zLift -
                    u * u * curl +
                    (1 - Math.abs(v)) * 0.036 +
                    lateral * crossTilt +
                    Math.cos(v * Math.PI) * 0.008 +
                    (random() - 0.5) * 0.012;
                const profileTilt = 0.38;
                const localY = rawY - flowerY;
                const localZ = z - 0.08;
                const y = flowerY + localY * Math.cos(profileTilt) + localZ * Math.sin(profileTilt);
                const profileZ = 0.08 - localY * Math.sin(profileTilt) + localZ * Math.cos(profileTilt);
                addParticle({
                    x,
                    y,
                    z: profileZ,
                    originX: flowerX + Math.cos(angle) * startRadius * 0.7,
                    originY: flowerY + Math.sin(angle) * startRadius * 0.62,
                    originZ: Math.max(0.04, zBase),
                    size: sizeMin + random() * sizeRange + u * 0.45 + (structuralTone > 1.2 ? 0.8 : structuralTone > 1 ? 0.35 : 0),
                    alpha: (alphaMin + random() * alphaRange) * structuralTone * petalTone,
                    stage: stageStart + u * stageSpread + random() * 0.018,
                    duration: 0.1 + random() * 0.07,
                    rotation: placement < 0.17
                        ? petalAngle + Math.PI * 0.5 + Math.sin(v * Math.PI * 2) * 0.18 + (random() - 0.5) * 0.32
                        : petalAngle + (random() - 0.5) * 0.44,
                });
            }
        }
    }

    addPetalLayer({
        petalCount: 14,
        density: 620,
        minLength: 0.37,
        maxLength: 0.52,
        minWidth: 0.065,
        maxWidth: 0.1,
        startRadius: 0.12,
        zBase: 0.02,
        zLift: 0.045,
        curl: 0.018,
        stageStart: 0.43,
        stageSpread: 0.13,
        sizeMin: 2.25,
        sizeRange: 3.5,
        alphaMin: 0.66,
        alphaRange: 0.32,
        angleOffset: 0.12,
        angleSpan: Math.PI * 2,
    });
    addPetalLayer({
        petalCount: 12,
        density: 520,
        minLength: 0.2,
        maxLength: 0.3,
        minWidth: 0.055,
        maxWidth: 0.082,
        startRadius: 0.105,
        zBase: 0.09,
        zLift: 0.065,
        curl: 0.024,
        stageStart: 0.51,
        stageSpread: 0.13,
        sizeMin: 2.3,
        sizeRange: 3.45,
        alphaMin: 0.68,
        alphaRange: 0.3,
        angleOffset: 0.42,
        angleSpan: Math.PI * 2,
    });

    for (let index = 0; index < 150; index += 1) {
        const angle = random() * Math.PI * 2;
        const radius = Math.sqrt(random()) * 0.045;
        addParticle({
            x: stemX(0) + Math.cos(angle) * radius,
            y: stemY(0) + Math.sin(angle) * radius * 0.7,
            z: (random() - 0.5) * 0.045,
            originX: stemX(0),
            originY: stemY(0),
            originZ: 0,
            size: 6 + random() * 9,
            alpha: 0.4 + random() * 0.55,
            stage: 0.015 + random() * 0.075,
            duration: 0.08 + random() * 0.05,
            rotation: (random() - 0.5) * 0.45,
            digit: index < 18 ? 0 : undefined,
        });
    }

    // Preserve every original particle and add a tightly offset companion sample.
    // This increases digit density without changing the bloom's geometry or visual ranges.
    const baseParticles = [...particles];
    const densityRandom = createSeededRandom(20260817);
    const additionalParticleCount = Math.round(baseParticles.length * BLOOM_DENSITY_INCREASE);
    for (let index = 0; index < additionalParticleCount; index += 1) {
        const sourceIndex = Math.floor(
            ((index + densityRandom()) / additionalParticleCount) * baseParticles.length,
        );
        const source = baseParticles[sourceIndex];
        const offsetScale = 0.0014;
        const companion: NumericParticle = {
            ...source,
            x: source.x + (densityRandom() - 0.5) * offsetScale,
            y: source.y + (densityRandom() - 0.5) * offsetScale,
            z: source.z + (densityRandom() - 0.5) * offsetScale,
            digit: Math.floor(densityRandom() * 10),
            phase: densityRandom() * Math.PI * 2,
            index: particleIndex,
        };
        particles.push(companion);
        if (source.index >= centralDiscStartIndex && source.index < centralDiscEndIndex) {
            centralDiscParticles.push(companion);
        }
        particleIndex += 1;
    }

    // Double only the current central disc density, including its global density companions.
    const discDensityRandom = createSeededRandom(20260818);
    for (const source of [...centralDiscParticles]) {
        const offsetScale = 0.0014;
        particles.push({
            ...source,
            x: source.x + (discDensityRandom() - 0.5) * offsetScale,
            y: source.y + (discDensityRandom() - 0.5) * offsetScale,
            z: source.z + (discDensityRandom() - 0.5) * offsetScale,
            digit: Math.floor(discDensityRandom() * 10),
            phase: discDensityRandom() * Math.PI * 2,
            index: particleIndex,
        });
        particleIndex += 1;
    }

    return particles;
}

function createIsotypeParticleData(particleCount: number, mask: IsotypeMask) {
    const random = createSeededRandom(20260816);
    const data = new Float32Array(particleCount * 4);

    for (let index = 0; index < particleCount; index += 1) {
        const isVisible = index < ISOTYPE_VISIBLE_PARTICLES;
        const pool = isVisible && index % 3 === 0 && mask.edge.length > 0
            ? mask.edge
            : mask.interior;
        const [pixelX, pixelY] = pool[Math.floor(random() * pool.length)] ?? [122, 121.5];
        const u = (pixelX + (random() - 0.5) * 0.7) / ISOTYPE_VIEWBOX_WIDTH;
        const v = (pixelY + (random() - 0.5) * 0.7) / ISOTYPE_VIEWBOX_HEIGHT;
        const x = ISOTYPE_CENTER_X + (u - 0.5) * ISOTYPE_WORLD_WIDTH;
        const y = ISOTYPE_CENTER_Y + (0.5 - v) * ISOTYPE_WORLD_HEIGHT;
        const z = (random() - 0.5) * 0.004;
        data.set([x, y, z, isVisible ? 1 : 0], index * 4);
    }

    return data;
}

export function BotanicalField({ activeProject }: BotanicalFieldProps) {
    const fieldRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useMemo(() => createBloomParticles(), []);
    const activeProjectRef = useRef(activeProject);

    useEffect(() => {
        activeProjectRef.current = activeProject;
    }, [activeProject]);

    useEffect(() => {
        const field = fieldRef.current;
        const canvas = canvasRef.current;
        if (!field || !canvas) return;
        const gl = canvas.getContext('webgl2', {
            alpha: true,
            antialias: false,
            depth: false,
            powerPreference: 'high-performance',
            premultipliedAlpha: false,
        });
        if (!gl) return;
        const surface: HTMLCanvasElement = canvas;
        const graphics: WebGL2RenderingContext = gl;
        surface.dataset.renderer = 'webgl2-instanced';
        surface.dataset.particles = String(particles.length);

        const program = createProgram(gl);
        const { texture, refresh: refreshDigitTexture } = createDigitTexture(gl);
        const isotypeMask = createIsotypeMask();
        const logoTexture = createMaskTexture(gl, isotypeMask.canvas);
        const logoData = createIsotypeParticleData(particles.length, isotypeMask);
        const vertexArray = gl.createVertexArray();
        const indexBuffer = gl.createBuffer();
        if (!vertexArray || !indexBuffer) return;

        const targets = new Float32Array(particles.length * 3);
        const origins = new Float32Array(particles.length * 3);
        const visuals = new Float32Array(particles.length * 4);
        const metadata = new Float32Array(particles.length * 3);
        particles.forEach((particle, index) => {
            targets.set([particle.x, particle.y, particle.z], index * 3);
            origins.set([particle.originX, particle.originY, particle.originZ], index * 3);
            visuals.set([particle.size, particle.alpha, particle.stage, particle.duration], index * 4);
            metadata.set([particle.digit, particle.rotation, particle.phase], index * 3);
        });

        gl.bindVertexArray(vertexArray);
        const buffers = [
            createAttributeBuffer(
                gl,
                0,
                2,
                new Float32Array([-0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5]),
                0,
            ),
            createAttributeBuffer(gl, 1, 3, targets),
            createAttributeBuffer(gl, 2, 3, origins),
            createAttributeBuffer(gl, 3, 4, visuals),
            createAttributeBuffer(gl, 4, 3, metadata),
            createAttributeBuffer(gl, 5, 4, logoData),
        ];
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);

        const uniforms = {
            resolution: getUniform(gl, program, 'uResolution'),
            center: getUniform(gl, program, 'uCenter'),
            scale: getUniform(gl, program, 'uScale'),
            rotation: getUniform(gl, program, 'uRotation'),
            progress: getUniform(gl, program, 'uProgress'),
            time: getUniform(gl, program, 'uTime'),
            visibility: getUniform(gl, program, 'uVisibility'),
            dpr: getUniform(gl, program, 'uDpr'),
            compact: gl.getUniformLocation(program, 'uCompact'),
            dark: getUniform(gl, program, 'uDark'),
            atlas: getUniform(gl, program, 'uAtlas'),
            logoMask: getUniform(gl, program, 'uLogoMask'),
        };

        gl.useProgram(program);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(uniforms.atlas, 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, logoTexture);
        gl.uniform1i(uniforms.logoMask, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.clearColor(0, 0, 0, 0);
        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(
            gl.SRC_ALPHA,
            gl.ONE_MINUS_SRC_ALPHA,
            gl.ONE,
            gl.ONE_MINUS_SRC_ALPHA,
        );

        let frame = 0;
        let width = 0;
        let height = 0;
        let dpr = 1;
        let targetProgress = 0;
        let progress = 0;
        let sceneVisibility = 1;
        let pointerX = 0.5;
        let pointerY = 0.5;
        let dragRotationY = 0;
        let dragStartX = 0;
        let dragStartRotationY = 0;
        let activePointerId = -1;
        let isDragging = false;
        let darkMode = document.documentElement.dataset.theme === 'dark';
        let previousTimestamp = performance.now();
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let disposed = false;

        function queueFrame() {
            if (frame === 0 && !document.hidden) frame = window.requestAnimationFrame(draw);
        }

        void document.fonts.load(DIGIT_CANVAS_FONT).then(() => {
            if (disposed) return;
            refreshDigitTexture();
            queueFrame();
        });

        function resize() {
            if (!field) return;
            const fieldRect = field.getBoundingClientRect();
            width = fieldRect.width;
            height = fieldRect.height;
            dpr = Math.min(window.devicePixelRatio, 1.75);
            surface.width = Math.round(width * dpr);
            surface.height = Math.round(height * dpr);
            surface.style.width = `${width}px`;
            surface.style.height = `${height}px`;
            graphics.viewport(0, 0, surface.width, surface.height);
            queueFrame();
        }

        function updateProgress() {
            const growthSection = document.getElementById('growth');
            if (!growthSection) return;
            const rect = growthSection.getBoundingClientRect();
            const travel = Math.max(rect.height - window.innerHeight, 1);
            targetProgress = clamp01(-rect.top / travel);
            sceneVisibility = 1;
            queueFrame();
        }

        function updatePointer(event: PointerEvent) {
            if (reducedMotion || !field || isDragging) return;
            const fieldRect = field.getBoundingClientRect();
            pointerX = clamp01((event.clientX - fieldRect.left) / Math.max(fieldRect.width, 1));
            pointerY = clamp01((event.clientY - fieldRect.top) / Math.max(fieldRect.height, 1));
            queueFrame();
        }

        function startDrag(event: PointerEvent) {
            if (event.button !== 0) return;
            isDragging = true;
            activePointerId = event.pointerId;
            dragStartX = event.clientX;
            dragStartRotationY = dragRotationY;
            surface.dataset.dragging = 'true';
            surface.setPointerCapture?.(event.pointerId);
            queueFrame();
        }

        function dragFlower(event: PointerEvent) {
            if (!isDragging || event.pointerId !== activePointerId) return;
            dragRotationY = dragStartRotationY + (event.clientX - dragStartX) * 0.009;
            queueFrame();
        }

        function stopDrag(event: PointerEvent) {
            if (!isDragging || event.pointerId !== activePointerId) return;
            isDragging = false;
            activePointerId = -1;
            delete surface.dataset.dragging;
            if (surface.hasPointerCapture?.(event.pointerId)) surface.releasePointerCapture(event.pointerId);
            queueFrame();
        }

        function handleVisibility() {
            previousTimestamp = performance.now();
            queueFrame();
        }

        const themeObserver = new MutationObserver(() => {
            darkMode = document.documentElement.dataset.theme === 'dark';
            queueFrame();
        });
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });

        function draw(timestamp: number) {
            frame = 0;
            const delta = Math.min(Math.max((timestamp - previousTimestamp) / 1000, 0), 0.1);
            previousTimestamp = timestamp;
            const easing = reducedMotion ? 1 : 1 - Math.exp(-13 * delta);
            progress += (targetProgress - progress) * easing;

            const mobile = width < 640;
            const growthPresence = smoothCurve(clamp01(progress / 0.66));
            const centerX = width * 0.5 * dpr;
            const centerStart = mobile ? 0.62 : 0.46;
            const centerEnd = mobile ? 0.61 : 0.55;
            const centerY = height * (centerStart + (centerEnd - centerStart) * growthPresence) * dpr;
            const finalWorldScale = mobile
                ? Math.min(width * 0.98, height * 0.56)
                : Math.min(width * 0.82, height * 0.78);
            const scalePresence = 0.68 + growthPresence * 0.32;
            const worldScale = finalWorldScale * scalePresence;
            const horizontalScale = mobile ? width * 0.9 * scalePresence : worldScale;
            const elapsed = reducedMotion ? 0 : timestamp * 0.001;
            const activePulse = activeProjectRef.current >= 0
                ? Math.sin(elapsed * 2.2 + activeProjectRef.current) * 0.018
                : 0;
            const rotationY = dragRotationY + (pointerX - 0.5) * 0.34 + Math.sin(elapsed * 0.22) * 0.025 + activePulse;
            const rotationX = (pointerY - 0.5) * -0.12 + Math.sin(elapsed * 0.17) * 0.014;
            surface.dataset.dragRotation = dragRotationY.toFixed(3);
            graphics.clear(graphics.COLOR_BUFFER_BIT);
            graphics.useProgram(program);
            graphics.bindVertexArray(vertexArray);
            graphics.uniform2f(uniforms.resolution, surface.width, surface.height);
            graphics.uniform2f(uniforms.center, centerX, centerY);
            graphics.uniform2f(uniforms.scale, horizontalScale * dpr, worldScale * dpr);
            graphics.uniform2f(uniforms.rotation, rotationX, rotationY);
            graphics.uniform1f(uniforms.progress, progress);
            graphics.uniform1f(uniforms.time, elapsed);
            graphics.uniform1f(uniforms.visibility, sceneVisibility);
            graphics.uniform1f(uniforms.dpr, dpr);
            if (uniforms.compact) graphics.uniform1f(uniforms.compact, mobile ? 1 : 0);
            graphics.uniform1f(uniforms.dark, darkMode ? 1 : 0);
            graphics.drawElementsInstanced(graphics.TRIANGLES, 6, graphics.UNSIGNED_SHORT, 0, particles.length);

            const needsAmbientMotion = sceneVisibility > 0.001 && progress < 0.995;
            if (needsAmbientMotion || Math.abs(progress - targetProgress) > 0.001) queueFrame();
        }

        resize();
        updateProgress();
        window.addEventListener('resize', resize, { passive: true });
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('pointermove', updatePointer, { passive: true });
        surface.addEventListener('pointerdown', startDrag);
        surface.addEventListener('pointermove', dragFlower);
        surface.addEventListener('pointerup', stopDrag);
        surface.addEventListener('pointercancel', stopDrag);
        document.addEventListener('visibilitychange', handleVisibility);
        queueFrame();

        return () => {
            disposed = true;
            if (frame) window.cancelAnimationFrame(frame);
            window.removeEventListener('resize', resize);
            window.removeEventListener('scroll', updateProgress);
            window.removeEventListener('pointermove', updatePointer);
            surface.removeEventListener('pointerdown', startDrag);
            surface.removeEventListener('pointermove', dragFlower);
            surface.removeEventListener('pointerup', stopDrag);
            surface.removeEventListener('pointercancel', stopDrag);
            document.removeEventListener('visibilitychange', handleVisibility);
            themeObserver.disconnect();
            buffers.forEach((buffer) => gl.deleteBuffer(buffer));
            gl.deleteBuffer(indexBuffer);
            gl.deleteTexture(texture);
            gl.deleteTexture(logoTexture);
            gl.deleteVertexArray(vertexArray);
            gl.deleteProgram(program);
        };
    }, [particles]);

    return (
        <div ref={fieldRef} className={styles.field}>
            <canvas ref={canvasRef} className={styles.numericCanvas} aria-hidden="true" />
        </div>
    );
}
