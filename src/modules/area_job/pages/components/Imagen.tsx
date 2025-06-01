import { type ImagenComponent } from '../../models/Components'

interface Props {
  comp: ImagenComponent
}

export default function Imagen({ comp }: Props) {
  return (
    <img
      src={comp.src}
      alt="Imagen"
      className="w-full h-full object-cover rounded-md"
      style={{
        borderRadius: comp.style?.borderRadius ?? 8
      }}
    />
  )
}
