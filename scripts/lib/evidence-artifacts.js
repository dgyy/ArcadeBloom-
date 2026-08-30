'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const SUPPORTED_MEDIA_TYPES = new Map([
    ['image/png', '.png'],
    ['image/svg+xml', '.svg'],
]);

function sha256File(filePath) {
    return 'sha256:' + crypto.createHash('sha256')
        .update(fs.readFileSync(filePath)).digest('hex');
}

function createScreenshotArtifact({
    filePath,
    recordDirectory,
    reviewId,
    viewport,
    width,
    height,
    capturedAt,
    mediaType = 'image/png',
}) {
    const relativePath = path.relative(recordDirectory, filePath).replace(/\\/g, '/');
    return {
        viewport,
        width,
        height,
        capturedAt,
        path: relativePath,
        mediaType,
        bytes: fs.statSync(filePath).size,
        sha256: sha256File(filePath),
    };
}

function validateScreenshotArtifact({ screenshot, recordPath, reviewId }) {
    const errors = [];
    const recordDirectory = path.dirname(recordPath);
    if (!screenshot || typeof screenshot.path !== 'string' || !screenshot.path) {
        return ['screenshot artifact path is missing'];
    }
    if (path.isAbsolute(screenshot.path) || screenshot.path.includes('\\')) {
        return ['screenshot artifact path must be a portable record-relative path'];
    }

    const artifactRoot = path.resolve(recordDirectory, reviewId || 'missing-review-id');
    const artifactPath = path.resolve(recordDirectory, screenshot.path);
    const relative = path.relative(artifactRoot, artifactPath);
    if (relative.startsWith('..') || path.isAbsolute(relative) || relative === '') {
        return ['screenshot artifact path must stay under <review-id>/'];
    }

    const expectedExtension = SUPPORTED_MEDIA_TYPES.get(screenshot.mediaType);
    if (!expectedExtension || path.extname(artifactPath).toLowerCase() !== expectedExtension) {
        errors.push('screenshot artifact mediaType or extension is unsupported');
    }
    if (!fs.existsSync(artifactPath) || !fs.statSync(artifactPath).isFile()) {
        errors.push('screenshot artifact file is missing');
        return errors;
    }

    const bytes = fs.statSync(artifactPath).size;
    if (!Number.isInteger(screenshot.bytes) || screenshot.bytes !== bytes) {
        errors.push('screenshot artifact byte size mismatch');
    }
    if (!/^sha256:[a-f0-9]{64}$/.test(String(screenshot.sha256 || '')) ||
        screenshot.sha256 !== sha256File(artifactPath)) {
        errors.push('screenshot artifact sha256 mismatch');
    }

    const head = fs.readFileSync(artifactPath).subarray(0, 256);
    if (screenshot.mediaType === 'image/png' &&
        !head.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
        errors.push('screenshot artifact is not a valid PNG file');
    }
    if (screenshot.mediaType === 'image/svg+xml' &&
        !head.toString('utf8').trimStart().startsWith('<svg')) {
        errors.push('screenshot artifact is not a valid SVG file');
    }
    return errors;
}

module.exports = {
    createScreenshotArtifact,
    sha256File,
    validateScreenshotArtifact,
};
