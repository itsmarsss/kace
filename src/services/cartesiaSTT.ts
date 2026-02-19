/**
 * Cartesia STT WebSocket Service
 * Provides streaming speech-to-text with low latency
 */

const CARTESIA_STT_WS_URL = 'wss://api.cartesia.ai/stt/websocket'

interface CartesiaSTTOptions {
  onTranscript?: (text: string, isFinal: boolean) => void
  onError?: (error: Error) => void
  onComplete?: () => void
}

export class CartesiaSTT {
  private ws: WebSocket | null = null
  private mediaStream: MediaStream | null = null
  private mediaRecorder: MediaRecorder | null = null
  private audioContext: AudioContext | null = null
  private isConnected = false
  private isRecording = false
  private apiKey: string
  private options: CartesiaSTTOptions

  constructor(apiKey: string, options: CartesiaSTTOptions = {}) {
    this.apiKey = apiKey
    this.options = options
  }

  async connect(): Promise<void> {
    if (this.isConnected) return

    const params = new URLSearchParams({
      api_key: this.apiKey,
      cartesia_version: '2024-06-10',
      model: 'ink-whisper',
      language: 'en',
      encoding: 'pcm_s16le',
      sample_rate: '16000',
      min_volume: '0.01',
      max_silence_duration_secs: '2.0',
    })

    const wsUrl = `${CARTESIA_STT_WS_URL}?${params}`
    console.log('[Cartesia STT] Connecting to:', wsUrl.replace(this.apiKey, 'API_KEY'))

    return new Promise((resolve, reject) => {
      const ws = new WebSocket(wsUrl)
      ws.binaryType = 'arraybuffer'

      ws.onopen = () => {
        this.ws = ws
        this.isConnected = true
        console.log('[Cartesia STT] WebSocket connected')
        resolve()
      }

      ws.onerror = (error) => {
        console.error('[Cartesia STT] WebSocket error:', error)
        this.options.onError?.(new Error('WebSocket connection failed'))
        reject(error)
      }

      ws.onmessage = (event) => {
        this.handleMessage(event)
      }

      ws.onclose = () => {
        this.isConnected = false
        this.ws = null
        console.log('[Cartesia STT] WebSocket closed')
      }
    })
  }

  private handleMessage(event: MessageEvent) {
    try {
      console.log('[Cartesia STT] Received message:', event.data)
      const data = JSON.parse(event.data)

      if (data.type === 'transcript') {
        const text = data.text || ''
        const isFinal = data.is_final || false
        console.log('[Cartesia STT] Transcript:', text, 'Final:', isFinal)
        this.options.onTranscript?.(text, isFinal)
      } else if (data.type === 'flush_done') {
        console.log('[Cartesia STT] Flush done')
      } else if (data.type === 'done') {
        console.log('[Cartesia STT] Session done')
        this.options.onComplete?.()
      } else if (data.type === 'error') {
        console.error('[Cartesia STT] Server error:', data)
        this.options.onError?.(new Error(data.message || 'STT error'))
      } else {
        console.log('[Cartesia STT] Unknown message type:', data.type)
      }
    } catch (error) {
      console.error('[Cartesia STT] Error handling message:', error, 'Raw data:', event.data)
      this.options.onError?.(error as Error)
    }
  }

  async startRecording(): Promise<void> {
    if (this.isRecording) return

    console.log('[Cartesia STT] Starting recording')

    // Connect WebSocket
    if (!this.isConnected) {
      await this.connect()
    }

    // Get microphone access with 16kHz constraint
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: { ideal: 16000 },
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    })

    // Create AudioContext to process audio
    this.audioContext = new AudioContext({ sampleRate: 16000 })
    const source = this.audioContext.createMediaStreamSource(this.mediaStream)

    console.log('[Cartesia STT] AudioContext sampleRate:', this.audioContext.sampleRate)

    // Use AudioWorklet if available, otherwise fall back to ScriptProcessor
    const processor = this.audioContext.createScriptProcessor(2048, 1, 1)

    processor.onaudioprocess = (event) => {
      if (!this.isRecording || !this.ws) return

      const inputData = event.inputBuffer.getChannelData(0)

      // Calculate RMS to check volume
      let sum = 0
      for (let i = 0; i < inputData.length; i++) {
        sum += inputData[i] * inputData[i]
      }
      const rms = Math.sqrt(sum / inputData.length)

      // Convert Float32Array to Int16Array (PCM S16LE)
      const pcmData = new Int16Array(inputData.length)
      for (let i = 0; i < inputData.length; i++) {
        const s = Math.max(-1, Math.min(1, inputData[i]))
        pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7fff
      }

      // Send to Cartesia
      if (this.ws.readyState === WebSocket.OPEN) {
        console.log('[Cartesia STT] Sending chunk, size:', pcmData.buffer.byteLength, 'RMS:', rms.toFixed(4))
        this.ws.send(pcmData.buffer)
      }
    }

    source.connect(processor)
    processor.connect(this.audioContext.destination)

    this.isRecording = true
  }

  stopRecording(): void {
    console.log('[Cartesia STT] Stopping recording')

    this.isRecording = false

    // Send finalize command
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send('finalize')
    }

    // Clean up audio processing
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop())
      this.mediaStream = null
    }

    if (this.mediaRecorder) {
      if (this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop()
      }
      this.mediaRecorder = null
    }
  }

  disconnect(): void {
    this.stopRecording()

    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send('done')
      }
      this.ws.close()
      this.ws = null
    }

    this.isConnected = false
  }

  getIsRecording(): boolean {
    return this.isRecording
  }
}

// Singleton instance
let cartesiaSTT: CartesiaSTT | null = null

export function getCartesiaSTT(): CartesiaSTT {
  if (!cartesiaSTT) {
    const apiKey = import.meta.env.VITE_CARTESIA_API_KEY
    if (!apiKey || apiKey === 'your_cartesia_api_key_here') {
      throw new Error('Cartesia API key not configured')
    }
    cartesiaSTT = new CartesiaSTT(apiKey)
  }
  return cartesiaSTT
}
