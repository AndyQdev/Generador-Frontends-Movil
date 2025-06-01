import { type CardComponent } from '../../models/Components'

interface Props {
  comp: CardComponent
}

export default function Card({ comp }: Props) {
  return (
    <div
      className="w-full h-full flex flex-col justify-start"
      style={{
        backgroundColor: comp.style?.backgroundColor,
        borderRadius: comp.style?.borderRadius,
        paddingTop: comp.style?.padding?.top,
        paddingBottom: comp.style?.padding?.bottom,
        paddingLeft: comp.style?.padding?.left,
        paddingRight: comp.style?.padding?.right
      }}
    >
      <h3
        className="font-semibold mb-2"
        style={{
          fontSize: (comp.style?.textStyle?.fontSize ?? 16) + 2,
          color: comp.style?.textStyle?.color
        }}
      >
        {comp.title}
      </h3>
      <p style={{
        fontSize: comp.style?.textStyle?.fontSize,
        color: comp.style?.textStyle?.color
      }}>
        {comp.content}
      </p>
    </div>
  )
}
