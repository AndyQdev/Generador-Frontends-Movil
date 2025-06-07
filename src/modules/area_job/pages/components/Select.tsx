import { type SelectComponent } from '../../models/Components'

interface Props {
  comp: SelectComponent
}

export default function Select({ comp }: Props) {
  return (
    <div className="w-full h-full flex flex-col justify-center px-2">
      {comp.label && <label className="text-xs text-black mb-1">{comp.label}</label>}
      <select
        className="w-full h-full outline-none transition-all"
        style={{
          backgroundColor: comp.style?.backgroundColor ?? '#ffffff',
          borderRadius: comp.style?.borderRadius ?? 6,
          border: comp.style?.border ?? '1px solid #e5e7eb',
          paddingTop: comp.style?.padding?.top ?? 6,
          paddingBottom: comp.style?.padding?.bottom ?? 6,
          paddingLeft: comp.style?.padding?.left ?? 10,
          paddingRight: comp.style?.padding?.right ?? 10,
          fontSize: comp.style?.textStyle?.fontSize ?? 14,
          color: comp.style?.textStyle?.color ?? '#111827'
        }}
        value={comp.selectedOption}
        onChange={() => {}}
      >
        {comp.options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}
