// Minimal 3D canvas renderer optimized for low-poly cats and city blocks
class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    
    // Virtual 3D to 2D projection parameters
    this.fov = 60;
    this.near = 0.1;
    this.far = 100;
    this.viewDistance = 20;
    
    // Camera position (cat-eye level)
    this.camera = { x: 0, y: 2, z: 5, rotX: -0.2, rotY: 0 };
    
    // Depth sorting for polygons
    this.polygons = [];
    
    this.resize();
  }
  
  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }
  
  // Simple 3D to 2D projection
  project(x, y, z) {
    // Translate relative to camera
    const dx = x - this.camera.x;
    const dy = y - this.camera.y;
    const dz = z - this.camera.z;
    
    // Simple perspective projection
    if (dz <= 0) return null; // Behind camera
    
    const scale = this.viewDistance / dz;
    const screenX = (dx * scale) + this.width / 2;
    const screenY = (-dy * scale) + this.height / 2;
    
    return { x: screenX, y: screenY, z: dz };
  }
  
  // Add polygon to render queue
  addPolygon(vertices, color, depth) {
    // Project all vertices
    const projectedVerts = vertices.map(v => this.project(v.x, v.y, v.z)).filter(p => p);
    
    if (projectedVerts.length < 3) return; // Not enough visible vertices
    
    this.polygons.push({
      vertices: projectedVerts,
      color: color,
      depth: depth || Math.min(...projectedVerts.map(p => p.z))
    });
  }
  
  // Render frame
  render() {
    // Clear canvas
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Sort polygons by depth (painter's algorithm)
    this.polygons.sort((a, b) => b.depth - a.depth);
    
    // Draw all polygons
    this.polygons.forEach(poly => this.drawPolygon(poly));
    
    // Clear polygon queue
    this.polygons = [];
  }
  
  drawPolygon(poly) {
    if (poly.vertices.length < 3) return;
    
    this.ctx.beginPath();
    this.ctx.moveTo(poly.vertices[0].x, poly.vertices[0].y);
    
    for (let i = 1; i < poly.vertices.length; i++) {
      this.ctx.lineTo(poly.vertices[i].x, poly.vertices[i].y);
    }
    
    this.ctx.closePath();
    this.ctx.fillStyle = poly.color;
    this.ctx.fill();
    
    // Add slight outline for definition
    this.ctx.strokeStyle = this.darkenColor(poly.color);
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }
  
  // Simple color darkening for outlines
  darkenColor(color) {
    // Convert hex to RGB, darken by 30%
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) * 0.7);
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) * 0.7);
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) * 0.7);
    return `rgb(${r},${g},${b})`;
  }
  
  // Move camera (for following player cat)
  updateCamera(x, y, z, rotY) {
    this.camera.x = x;
    this.camera.y = y + 2; // Cat eye level
    this.camera.z = z + 5; // Behind cat
    this.camera.rotY = rotY || 0;
  }
}