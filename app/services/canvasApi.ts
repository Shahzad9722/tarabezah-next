
interface CanvasItem {
  id: string;
  type: string;
  x: number;
  y: number;
  floorId: string;
  rotation: number;
  scale?: number;
  label?: string;
  imagePath?: string;
  status?: string;
}

interface CanvasData {
  items: CanvasItem[];
}

export async function publishCanvas(data: CanvasData): Promise<Response> {
  try {
    const response = await fetch('/api/canvas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to publish: ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    console.error('Error publishing canvas:', error);
    throw error;
  }
}
