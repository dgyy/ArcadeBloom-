async function findPath(start, end, width, height, isWall) {
    const startX = start % width;
    const startY = Math.floor(start / width);
    const endX = end % width;
    const endY = Math.floor(end / width);

    const queue = [];
    const visited = new Array(width * height).fill(false);

    const dx = [1, -1, 0, 0];
    const dy = [0, 0, 1, -1];

    queue.push({ x: startX, y: startY, path: [] });
    visited[start] = true;

    while (queue.length > 0) {

        const { x, y, path } = queue.shift();

        if (x === endX && y === endY) {
            return path;
        }


        for (let i = 0; i < 4; i++) {
            const newX = x + dx[i];
            const newY = y + dy[i];
            const newIndex = newY * width + newX;

            if (newX >= 0 && newX < width && newY >= 0 && newY < height && !visited[newIndex]) {
                if (!isWall(newIndex)) {
                    queue.push({ x: newX, y: newY, path: [...path, newIndex] });
                    visited[newIndex] = true;
                }
            }
        }
    }
    return [];
}
export default findPath;
