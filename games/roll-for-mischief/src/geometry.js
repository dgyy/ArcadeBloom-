// Procedural geometry generation for low-poly cats and city environment
class GeometryGenerator {
  
  // Generate low-poly cat model (procedural)
  static createCat(color = '#8B4513') {
    const cat = {
      // Body (stretched cube)
      body: [
        // Front face
        {vertices: [{x:-0.8,y:0,z:0.5}, {x:0.8,y:0,z:0.5}, {x:0.8,y:1.2,z:0.5}, {x:-0.8,y:1.2,z:0.5}], color: color},
        // Back face  
        {vertices: [{x:0.8,y:0,z:-1.5}, {x:-0.8,y:0,z:-1.5}, {x:-0.8,y:1.2,z:-1.5}, {x:0.8,y:1.2,z:-1.5}], color: this.darken(color)},
        // Top face
        {vertices: [{x:-0.8,y:1.2,z:0.5}, {x:0.8,y:1.2,z:0.5}, {x:0.8,y:1.2,z:-1.5}, {x:-0.8,y:1.2,z:-1.5}], color: this.lighten(color)},
        // Sides
        {vertices: [{x:-0.8,y:0,z:-1.5}, {x:-0.8,y:0,z:0.5}, {x:-0.8,y:1.2,z:0.5}, {x:-0.8,y:1.2,z:-1.5}], color: this.darken(color)},
        {vertices: [{x:0.8,y:0,z:0.5}, {x:0.8,y:0,z:-1.5}, {x:0.8,y:1.2,z:-1.5}, {x:0.8,y:1.2,z:0.5}], color: this.darken(color)}
      ],
      
      // Head (smaller cube)
      head: [
        // Front face (cat face)
        {vertices: [{x:-0.6,y:1.2,z:0.8}, {x:0.6,y:1.2,z:0.8}, {x:0.6,y:2.4,z:0.8}, {x:-0.6,y:2.4,z:0.8}], color: color},
        // Back
        {vertices: [{x:0.6,y:1.2,z:0.2}, {x:-0.6,y:1.2,z:0.2}, {x:-0.6,y:2.4,z:0.2}, {x:0.6,y:2.4,z:0.2}], color: this.darken(color)},
        // Top
        {vertices: [{x:-0.6,y:2.4,z:0.8}, {x:0.6,y:2.4,z:0.8}, {x:0.6,y:2.4,z:0.2}, {x:-0.6,y:2.4,z:0.2}], color: this.lighten(color)},
        // Sides
        {vertices: [{x:-0.6,y:1.2,z:0.2}, {x:-0.6,y:1.2,z:0.8}, {x:-0.6,y:2.4,z:0.8}, {x:-0.6,y:2.4,z:0.2}], color: this.darken(color)},
        {vertices: [{x:0.6,y:1.2,z:0.8}, {x:0.6,y:1.2,z:0.2}, {x:0.6,y:2.4,z:0.2}, {x:0.6,y:2.4,z:0.8}], color: this.darken(color)}
      ],
      
      // Ears (triangular prisms)
      ears: [
        // Left ear
        {vertices: [{x:-0.5,y:2.4,z:0.6}, {x:-0.3,y:2.4,z:0.6}, {x:-0.4,y:3.0,z:0.6}], color: this.darken(color)},
        {vertices: [{x:-0.3,y:2.4,z:0.4}, {x:-0.5,y:2.4,z:0.4}, {x:-0.4,y:3.0,z:0.4}], color: this.darken(color)},
        // Right ear  
        {vertices: [{x:0.3,y:2.4,z:0.6}, {x:0.5,y:2.4,z:0.6}, {x:0.4,y:3.0,z:0.6}], color: this.darken(color)},
        {vertices: [{x:0.5,y:2.4,z:0.4}, {x:0.3,y:2.4,z:0.4}, {x:0.4,y:3.0,z:0.4}], color: this.darken(color)}
      ],
      
      // Tail (curved segments)
      tail: this.generateTail(color),
      
      // Legs (small cylinders approximated as cubes)
      legs: [
        // Front left
        {vertices: [{x:-0.5,y:0,z:0.2}, {x:-0.3,y:0,z:0.2}, {x:-0.3,y:-0.8,z:0.2}, {x:-0.5,y:-0.8,z:0.2}], color: this.darken(color)},
        // Front right
        {vertices: [{x:0.3,y:0,z:0.2}, {x:0.5,y:0,z:0.2}, {x:0.5,y:-0.8,z:0.2}, {x:0.3,y:-0.8,z:0.2}], color: this.darken(color)},
        // Back left
        {vertices: [{x:-0.5,y:0,z:-1.2}, {x:-0.3,y:0,z:-1.2}, {x:-0.3,y:-0.8,z:-1.2}, {x:-0.5,y:-0.8,z:-1.2}], color: this.darken(color)},
        // Back right
        {vertices: [{x:0.3,y:0,z:-1.2}, {x:0.5,y:0,z:-1.2}, {x:0.5,y:-0.8,z:-1.2}, {x:0.3,y:-0.8,z:-1.2}], color: this.darken(color)}
      ]
    };
    
    return cat;
  }
  
  // Generate curved tail segments
  static generateTail(color) {
    const segments = [];
    const numSegments = 5;
    
    for (let i = 0; i < numSegments; i++) {
      const t = i / numSegments;
      const x = Math.sin(t * Math.PI) * 0.5;
      const y = 1.0 + Math.cos(t * Math.PI * 0.5) * 0.3;
      const z = -1.5 - t * 1.5;
      
      segments.push({
        vertices: [
          {x: x-0.1, y: y, z: z},
          {x: x+0.1, y: y, z: z},
          {x: x+0.1, y: y+0.3, z: z},
          {x: x-0.1, y: y+0.3, z: z}
        ],
        color: this.darken(color)
      });
    }
    
    return segments;
  }
  
  // Generate city block geometry
  static createCityBlock(x, z, width = 8, height = 12, depth = 8) {
    const color = '#666';
    const building = [];
    
    // Main building faces
    building.push(
      // Front
      {vertices: [{x:x,y:0,z:z+depth}, {x:x+width,y:0,z:z+depth}, {x:x+width,y:height,z:z+depth}, {x:x,y:height,z:z+depth}], color: color},
      // Back  
      {vertices: [{x:x+width,y:0,z:z}, {x:x,y:0,z:z}, {x:x,y:height,z:z}, {x:x+width,y:height,z:z}], color: this.darken(color)},
      // Left
      {vertices: [{x:x,y:0,z:z}, {x:x,y:0,z:z+depth}, {x:x,y:height,z:z+depth}, {x:x,y:height,z:z}], color: this.darken(color)},
      // Right
      {vertices: [{x:x+width,y:0,z:z+depth}, {x:x+width,y:0,z:z}, {x:x+width,y:height,z:z}, {x:x+width,y:height,z:z+depth}], color: this.darken(color)},
      // Top
      {vertices: [{x:x,y:height,z:z+depth}, {x:x+width,y:height,z:z+depth}, {x:x+width,y:height,z:z}, {x:x,y:height,z:z}], color: this.lighten(color)}
    );
    
    return building;
  }
  
  // Generate street lamp
  static createStreetLamp(x, z) {
    const pole = '#444';
    const light = '#FFA500';
    
    return [
      // Pole
      {vertices: [{x:x-0.1,y:0,z:z-0.1}, {x:x+0.1,y:0,z:z-0.1}, {x:x+0.1,y:4,z:z-0.1}, {x:x-0.1,y:4,z:z-0.1}], color: pole},
      {vertices: [{x:x+0.1,y:0,z:z+0.1}, {x:x-0.1,y:0,z:z+0.1}, {x:x-0.1,y:4,z:z+0.1}, {x:x+0.1,y:4,z:z+0.1}], color: pole},
      // Light
      {vertices: [{x:x-0.3,y:3.5,z:z-0.3}, {x:x+0.3,y:3.5,z:z-0.3}, {x:x+0.3,y:4.2,z:z-0.3}, {x:x-0.3,y:4.2,z:z-0.3}], color: light},
      {vertices: [{x:x+0.3,y:3.5,z:z+0.3}, {x:x-0.3,y:3.5,z:z+0.3}, {x:x-0.3,y:4.2,z:z+0.3}, {x:x+0.3,y:4.2,z:z+0.3}], color: light}
    ];
  }
  
  // Generate simple tree
  static createTree(x, z) {
    const trunk = '#654321';
    const leaves = '#228B22';
    
    return [
      // Trunk
      {vertices: [{x:x-0.2,y:0,z:z-0.2}, {x:x+0.2,y:0,z:z-0.2}, {x:x+0.2,y:3,z:z-0.2}, {x:x-0.2,y:3,z:z-0.2}], color: trunk},
      {vertices: [{x:x+0.2,y:0,z:z+0.2}, {x:x-0.2,y:0,z:z+0.2}, {x:x-0.2,y:3,z:z+0.2}, {x:x+0.2,y:3,z:z+0.2}], color: trunk},
      // Leaves (simple diamond shape)
      {vertices: [{x:x,y:3,z:z-1}, {x:x+1,y:4,z:z}, {x:x,y:3,z:z+1}, {x:x-1,y:4,z:z}], color: leaves},
      {vertices: [{x:x-1,y:4,z:z}, {x:x,y:5,z:z-1}, {x:x+1,y:4,z:z}, {x:x,y:5,z:z+1}], color: this.lighten(leaves)}
    ];
  }
  
  // Color manipulation utilities
  static lighten(color, factor = 0.3) {
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) * (1 + factor));
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) * (1 + factor));
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) * (1 + factor));
    return `rgb(${r},${g},${b})`;
  }
  
  static darken(color, factor = 0.3) {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) * (1 - factor));
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) * (1 - factor));
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) * (1 - factor));
    return `rgb(${r},${g},${b})`;
  }
}