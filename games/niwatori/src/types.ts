export interface TiledMap {
  width: number;
  height: number;
  layers: Array<{
    name: string;
    data: Array<number>;
  }>;
}

export interface MapFile {
  width: number;
  height: number;
  layers: Record<string, Array<number>>;
}
