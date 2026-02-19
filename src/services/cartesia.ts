/**
 * Cartesia TTS WebSocket Service
 * Provides streaming text-to-speech with low latency
 */

const CARTESIA_WS_URL = 'wss://api.cartesia.ai/tts/websocket'
const MODEL_ID = 'sonic-english'
const VOICE_ID = 'a0e99841-438c-4a64-b679-ae501e7d6091' // Barbershop Man

interface CartesiaTTSOptions {
  onAudio?: (audioData: ArrayBuffer) => void
  onError?: (error: Error) => void
  onComplete?: () => void
}

export class CartesiaTTS {
  private ws: WebSocket | null = null
  private audioContext: AudioContext | null = null
  private isConnected = false
  private isPlaying = false
  private apiKey: string
  private options: CartesiaTTSOptions
  private currentSource: AudioBufferSourceNode | null = null

  constructor(apiKey: string, options: CartesiaTTSOptions = {}) {
    this.apiKey = apiKey
    this.options = options
  }

  async connect(): Promise<void> {
    if (this.isConnected) return

    return new Promise((resolve, reject) => {
      const ws = new WebSocket(`${CARTESIA_WS_URL}?api_key=${this.apiKey}&cartesia_version=2024-06-10`)

      ws.onopen = () => {
        this.ws = ws
        this.isConnected = true
        console.log('Cartesia WebSocket connected')
        resolve()
      }

      ws.onerror = (error) => {
        console.error('Cartesia WebSocket error:', error)
        this.options.onError?.(new Error('WebSocket connection failed'))
        reject(error)
      }

      ws.onmessage = (event) => {
        this.handleMessage(event)
      }

      ws.onclose = () => {
        this.isConnected = false
        this.ws = null
        console.log('Cartesia WebSocket closed')
      }
    })
  }

  private async handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data)

      if (data.type === 'chunk' && data.data) {
        console.log('[Cartesia] Received audio chunk')
        // Decode base64 audio data
        const audioData = Uint8Array.from(atob(data.data), (c) => c.charCodeAt(0))
        await this.playAudio(audioData.buffer)
        this.options.onAudio?.(audioData.buffer)
      } else if (data.type === 'done') {
        console.log('[Cartesia] TTS complete')
        this.isPlaying = false
        this.options.onComplete?.()
      } else if (data.type === 'error') {
        console.error('[Cartesia] Server error:', data)
      }
    } catch (error) {
      console.error('[Cartesia] Error handling message:', error)
      this.options.onError?.(error as Error)
    }
  }

  async speak(text: string): Promise<void> {
    console.log('[Cartesia] speak() called with text:', text.substring(0, 50))

    if (!this.isConnected) {
      console.log('[Cartesia] Connecting...')
      await this.connect()
    }

    if (!this.ws) {
      throw new Error('WebSocket not connected')
    }

    // Initialize audio context
    if (!this.audioContext) {
      console.log('[Cartesia] Creating AudioContext')
      this.audioContext = new AudioContext({ sampleRate: 44100 })
    }

    // Resume audio context if suspended (browser autoplay policy)
    if (this.audioContext.state === 'suspended') {
      console.log('[Cartesia] Resuming suspended AudioContext')
      await this.audioContext.resume()
    }
    console.log('[Cartesia] AudioContext state:', this.audioContext.state)

    this.isPlaying = true

    // Send TTS request
    const request = {
      model_id: MODEL_ID,
      voice: {
        mode: 'id',
        id: VOICE_ID,
      },
      transcript: text,
      output_format: {
        container: 'raw',
        encoding: 'pcm_f32le',
        sample_rate: 44100,
      },
      language: 'en',
    }

    console.log('[Cartesia] Sending TTS request')
    this.ws.send(JSON.stringify(request))
  }

  private async playAudio(audioData: ArrayBuffer): Promise<void> {
    if (!this.audioContext) return

    try {
      const audioBuffer = await this.audioContext.decodeAudioData(audioData)
      const source = this.audioContext.createBufferSource()
      source.buffer = audioBuffer
      source.connect(this.audioContext.destination)
      source.onended = () => {
        if (this.currentSource === source) {
          this.currentSource = null
        }
      }
      this.currentSource = source
      source.start(0)
    } catch (error) {
      console.error('Error playing audio:', error)
    }
  }

  stop(): void {
    this.isPlaying = false
    // Stop current audio source without closing the AudioContext
    if (this.currentSource) {
      try {
        this.currentSource.stop()
      } catch (error) {
        // Source may already be stopped
      }
      this.currentSource = null
    }
  }

  disconnect(): void {
    this.stop()
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    this.isConnected = false
  }

  getIsPlaying(): boolean {
    return this.isPlaying
  }
}

// Singleton instance
let cartesiaTTS: CartesiaTTS | null = null

export function getCartesiaTTS(): CartesiaTTS {
  if (!cartesiaTTS) {
    const apiKey = import.meta.env.VITE_CARTESIA_API_KEY
    if (!apiKey || apiKey === 'your_cartesia_api_key_here') {
      throw new Error('Cartesia API key not configured')
    }
    cartesiaTTS = new CartesiaTTS(apiKey)
  }
  return cartesiaTTS
}
