// Some image processing functions that apply direct on imageData
// applyGaussianBlur, applyOtsuThreshold, otsuThreshold, applyEdgeDetection functions
// where generated using ChatGPT with some minor modifications.
// nms and houghLines where entirily written by Artur Augusto Martins

// MIT License - Copyright 2023 Artur Augusto Martins

// non-maximal supression of matrix or imageData
function nms(image) {
    let nmsSize = 3;
    let nmsHalfSize = Math.floor(nmsSize/2);

    let w;
    let h2;
    let w2;
    let data;
    
    let isImageData = image.constructor === ImageData;
    if (isImageData) {
        data = image.data;
        w = image.width;
        h2 = image.height-nmsSize;
        w2 = image.width-nmsSize;
    } else {
        data = image;
        w = 1;
        h2 = data.length-nmsSize;
        w2 = data[0].length-nmsSize;
    }

    for (let i = 0; i <= h2; i++) {
        for (let j = 0; j <= w2; j++) {
            
            // find max
            let max = 0
            for (let k = nmsSize - 1; k >= 0; k--) {
                for (let l = nmsSize - 1; l >= 0; l--) {
                    let val = isImageData ? getFlatlc(data, i+k, (j+l)*4, w*4) : data[i+k][j+l]
                    val = val || 0
                    if (val > max) max = val
                }
            }
            
            // supress
            let val = isImageData ? getFlatlc(data, i+nmsHalfSize, (j+nmsHalfSize)*4, w*4) : data[i+nmsHalfSize][j+nmsHalfSize]
            if (val !== max) {
                if (isImageData) {
                    setFlatlc(data, i+nmsHalfSize, (j+nmsHalfSize)*4,   w*4, 0)
                    setFlatlc(data, i+nmsHalfSize, (j+nmsHalfSize)*4+1, w*4, 0)
                    setFlatlc(data, i+nmsHalfSize, (j+nmsHalfSize)*4+2, w*4, 0)
                } else {
                    data[i+nmsHalfSize][j+nmsHalfSize] = 0
                }
            }
        }
    }
}


function houghLines(imageData) {

    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;            


    let img = [];

    // Loop through the image data and extract the first channel (red channel) values
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4; // Each pixel consists of 4 values: RGBA
        const redValue = data[index] ? 1 : 0; // Extract the first channel (red channel) value
        row.push(redValue);
      }
      img.push(row);
    }

    
    let H = img.length
    let W = img[0].length

    let parameterSpacePMax = Math.ceil(Math.sqrt(img.length*img.length+img[0].length*img[0].length))*2
    let poffset = Math.ceil(parameterSpacePMax/2)
    let precision = 45 // faster
    // let precision = 90
    let parameterSpace = new Array(parameterSpacePMax).fill(0).map(_ => new Array(precision).fill(0))

    img.forEach((row, y) => {
        row.forEach((val, x) => {
            if (val) {
                parameterSpace[0].forEach((_, thetaStep) => {
                    let theta = (Math.PI/parameterSpace[0].length)*thetaStep
                    let p = Math.round(x*Math.cos(theta)+y*Math.sin(theta))+poffset
                    // console.log(p, thetaStep, theta)
                    parameterSpace[p][thetaStep] += 1
                })
            }
        })
    })

    nms(parameterSpace)

    let lines = []
        for (let i = 0; i < parameterSpace.length; i++) {
        for (let j = 0; j < parameterSpace[0].length; j++) {
            if (parameterSpace[i][j]) {
                let theta = (Math.PI/parameterSpace[0].length)*j
                lines.push({x: j, y: i, theta: theta, p: i - poffset, score: parameterSpace[i][j]})
                // lines.push({theta: theta, p: i - poffset, score: parameterSpace[i][j]})
            }
        }
    }
    lines = lines.sort((a, b) => b["score"] - a["score"])
    
    let lineImg = new Array(H).fill(0).map(_ => new Array(W).fill(0))
    return lines
}



// Function to apply Gaussian blur to the image
function applyGaussianBlur(imageData) {

    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const tempData = new Uint8ClampedArray(data.length);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0;
            let g = 0;
            let b = 0;
            let a = 0;

            for (let j = -1; j <= 1; j++) {
                for (let i = -1; i <= 1; i++) {
                    const index = ((y + j) * width + (x + i)) * 4;
                    const weight = 1 / 9; // 3x3 box blur

                    r += data[index] * weight;
                    g += data[index + 1] * weight;
                    b += data[index + 2] * weight;
                    a += data[index + 3] * weight;
                }
            }

            const index = (y * width + x) * 4;
            tempData[index] = r;
            tempData[index + 1] = g;
            tempData[index + 2] = b;
            tempData[index + 3] = a;
        }
    }

    for (let i = 0; i < data.length; i++) {
        data[i] = tempData[i];
    }

}

// Function to apply Otsu's thresholding to convert grayscale to binary
function applyOtsuThreshold(imageData) {
    const data = imageData.data;
    const threshold = otsuThreshold(data);
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const value = avg > threshold ? 255 : 0;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
    }
}

// Function to calculate Otsu's threshold value
function otsuThreshold(data) {
    const histogram = Array.from({ length: 256 }, () => 0);
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        histogram[Math.floor(avg)]++;
    }

    let sum = 0;
    for (let i = 1; i < 256; i++) {
        sum += i * histogram[i];
    }

    let sumB = 0;
    let wB = 0;
    let wF = 0;
    let mB;
    let mF;
    let max = 0.0;
    let threshold = 0; // Declare the threshold variable here

    for (let i = 0; i < 256; i++) {
        wB += histogram[i];
        if (wB === 0) continue;
        wF = data.length / 4 - wB;
        if (wF === 0) break;

        sumB += i * histogram[i];
        mB = sumB / wB;
        mF = (sum - sumB) / wF;

        between = wB * wF * Math.pow(mB - mF, 2);
        if (between >= max) {
            max = between;
            threshold = i;
        }
    }

    return threshold;
}

// Function to apply the Sobel operator for edge detection
function applyEdgeDetection(imageData) {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;


    // Convolution matrices for the Sobel operator
    const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

    const tempData = new Uint8ClampedArray(data.length);

    // Convolution for the X and Y directions
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let sumX = 0;
            let sumY = 0;

            for (let j = -1; j <= 1; j++) {
                for (let i = -1; i <= 1; i++) {
                    const index = ((y + j) * width + (x + i)) * 4;
                    const weightX = sobelX[(j + 1) * 3 + (i + 1)];
                    const weightY = sobelY[(j + 1) * 3 + (i + 1)];

                    sumX += data[index] * weightX;
                    sumY += data[index] * weightY;
                }
            }

            const index = (y * width + x) * 4;
            const magnitude = Math.sqrt(sumX * sumX + sumY * sumY);

            tempData[index] = magnitude;
            tempData[index + 1] = magnitude;
            tempData[index + 2] = magnitude;
            tempData[index + 3] = 255; // Alpha channel
        }
    }

    // Copy the result back to the original data array
    for (let i = 0; i < data.length; i++) {
        data[i] = tempData[i];
    }
}