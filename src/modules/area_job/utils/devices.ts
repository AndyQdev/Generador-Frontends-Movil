export interface Device {
  id: string
  label: string
  width: number
  height: number
}

export const DEVICES: Device[] = [
  { id: 'iphone-14', label: 'iPhone 14 (390 × 844)', width: 390, height: 844 },
  { id: 'pixel-8', label: 'Pixel 8 (412 × 915)', width: 412, height: 915 },
  { id: 'galaxy-s22', label: 'Galaxy S22 (360 × 780)', width: 360, height: 780 },
  { id: 'ipad-mini', label: 'iPad mini (744 × 1133)', width: 744, height: 1133 },
  { id: 'desktop', label: 'Desktop FHD (1537 × 729)', width: 1537, height: 729 } // tu tamaño actual
]
