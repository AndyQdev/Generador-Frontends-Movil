import { useEffect, useRef, useState } from 'react'

export const AudioWaveLive = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null)

  useEffect(() => {
    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const ctx = new AudioContext()
      const source = ctx.createMediaStreamSource(stream)
      const analyserNode = ctx.createAnalyser()

      analyserNode.fftSize = 256
      const bufferLength = analyserNode.frequencyBinCount
      const dataArr = new Uint8Array(bufferLength)

      source.connect(analyserNode)

      setAudioContext(ctx)
      setAnalyser(analyserNode)
      setDataArray(dataArr)
    }

    void init()

    return () => {
      void audioContext?.close()
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !analyser || !dataArray) return

    const ctx = canvas.getContext('2d')!
    const WIDTH = canvas.width
    const HEIGHT = canvas.height

    const draw = () => {
      requestAnimationFrame(draw)
      analyser.getByteTimeDomainData(dataArray)

      ctx.fillStyle = 'transparent'
      ctx.clearRect(0, 0, WIDTH, HEIGHT)

      ctx.lineWidth = 2
      ctx.strokeStyle = '#10b981' // verde Tailwind

      ctx.beginPath()

      const sliceWidth = (WIDTH * 1.0) / dataArray.length
      let x = 0

      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0
        const y = (v * HEIGHT) / 2

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }

        x += sliceWidth
      }

      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()
    }

    draw()
  }, [analyser, dataArray])

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={40}
      className="rounded bg-black/5 dark:bg-white/5"
    />
  )
}
