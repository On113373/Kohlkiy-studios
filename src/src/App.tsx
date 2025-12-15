import { useState, useEffect, useRef } from 'react'
import { 
  FaPlay, FaPause, FaRecord, FaSave, 
  FaWaveSquare, FaMicrophone, FaBolt, FaBrain, FaRobot, FaStar,
  FaFire, FaGem, FaCrown, FaMagic, FaGamepad,
  FaCloud, FaUsers
} from 'react-icons/fa'

function App() {
  // State for everything
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [money, setMoney] = useState(6000000000)
  const [stars, setStars] = useState<Array<{x: number, y: number, size: number}>>([])
  const [audioLevels, setAudioLevels] = useState<number[]>([])
  const [aiMode, setAiMode] = useState('GENIUS')
  
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)

  // Initialize stars
  useEffect(() => {
    const newStars = Array(100).fill(0).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1
    }))
    setStars(newStars)
    
    // Make stars twinkle
    const interval = setInterval(() => {
      setStars(prev => prev.map(star => ({
        ...star,
        size: Math.random() * 3 + 1
      })))
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])

  // Audio visualization
  useEffect(() => {
    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const ctx = new (globalThis.AudioContext || (globalThis as any).webkitAudioContext)()
        const source = ctx.createMediaStreamSource(stream)
        const analyser = ctx.createAnalyser()
        
        analyser.fftSize = 256
        source.connect(analyser)
        
        audioContextRef.current = ctx
        analyserRef.current = analyser
        
        // Update levels
        const updateLevels = () => {
          if (!analyserRef.current) return
          
          const bufferLength = analyserRef.current.frequencyBinCount
          const dataArray = new Uint8Array(bufferLength)
          analyserRef.current.getByteFrequencyData(dataArray)
          
          // Reduce to 8 levels for display
          const reduced = []
          for (let i = 0; i < 8; i++) {
            const start = Math.floor(i * bufferLength / 8)
            const end = Math.floor((i + 1) * bufferLength / 8)
            const slice = dataArray.slice(start, end)
            const avg = slice.reduce((a, b) => a + b, 0) / slice.length
            reduced.push(avg / 255)
          }
          
          setAudioLevels(reduced)
          requestAnimationFrame(updateLevels)
        }
        
        updateLevels()
      } catch (err) {
        console.log('Audio setup failed:', err)
        // Mock data for demo
        const mockInterval = setInterval(() => {
          setAudioLevels(Array(8).fill(0).map(() => Math.random() * 0.5 + 0.3))
        }, 100)
        return () => clearInterval(mockInterval)
      }
    }
    
    initAudio()
    
    // Make money when recording
    if (isRecording) {
      const moneyInterval = setInterval(() => {
        setMoney(prev => prev + 100000)
      }, 100)
      return () => clearInterval(moneyInterval)
    }
  }, [isRecording])

  // Format money with commas
  const formatMoney = (amount: number) => {
    return `$${amount.toLocaleString()}`
  }

  // Record button handler
  const handleRecord = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      setAiMode('SUPER GENIUS')
    } else {
      setAiMode('GENIUS')
    }
  }

  // Play button handler
  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }

  // Tools list
  const tools = [
    { icon: <FaBrain />, name: 'AI Composer', active: true },
    { icon: <FaRobot />, name: 'Auto-Mix', active: true },
    { icon: <FaStar />, name: 'Hit Maker', active: true },
    { icon: <FaGamepad />, name: 'Game Mode', active: false },
    { icon: <FaCloud />, name: 'Cloud Sync', active: true },
    { icon: <FaMagic />, name: 'Magic Master', active: true }
  ]

  // Effects list
  const effects = [
    { name: 'Galaxy Reverb', level: 80, color: 'purple' },
    { name: 'Time Warp', level: 60, color: 'blue' },
    { name: 'Quantum Echo', level: 90, color: 'cyan' },
    { name: 'Neural Distortion', level: 40, color: 'red' },
    { name: 'Crystal Chorus', level: 70, color: 'pink' }
  ]

  return (
    <div className="app-container">
      {/* Animated background */}
      <div className="space-bg">
        {stars.map((star, i) => (
          <div 
            key={i}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>

      {/* Status bar */}
      <div className="status-bar">
        <div className="money-display">
          <FaCrown style={{ color: 'gold', fontSize: '2rem' }} />
          <div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>KOHLKIY VALUATION</div>
            <div className="money-amount">{formatMoney(money)}</div>
          </div>
          <FaGem style={{ color: '#00ffea', fontSize: '2rem' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <FaRobot style={{ color: '#00ff88', fontSize: '1.5rem' }} />
          <div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>AI MODE</div>
            <div style={{ color: '#00ff88', fontWeight: 'bold' }}>{aiMode}</div>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['red', 'yellow', 'green', 'blue', 'purple'].map((color, i) => (
              <div 
                key={i}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: color,
                  opacity: i < 4 ? 1 : 0.5
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main controls grid */}
      <div className="controls-grid">
        {/* Left panel - Tools */}
        <div className="tools-panel">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <FaMagic /> MAGIC TOOLS
          </h3>
          {tools.map((tool, i) => (
            <div key={i} className="tool-item">
              <div style={{ fontSize: '1.2rem' }}>{tool.icon}</div>
              <div style={{ flex: 1 }}>{tool.name}</div>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: tool.active ? '#00ff88' : '#ff0044'
              }} />
            </div>
          ))}
        </div>

        {/* Center - Main controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Giant record button */}
          <div className="mega-record">
            <button 
              className={`record-button ${isRecording ? 'recording' : ''}`}
              onClick={handleRecord}
            >
              <FaRecord style={{ fontSize: '3rem' }} />
            </button>
            <div style={{ marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
              {isRecording ? '● LIVE RECORDING' : 'CLICK TO RECORD'}
            </div>
            {isRecording && (
              <div style={{
                position: 'absolute',
                top: '-20px',
                color: '#ff0044',
                fontSize: '0.9rem',
                animation: 'pulse 1s infinite'
              }}>
                MAKING MONEY...
              </div>
            )}
          </div>

          {/* Visualizer */}
          <div className="visualizer">
            <div className="visualizer-bars">
              {audioLevels.map((level, i) => (
                <div 
                  key={i}
                  className="visualizer-bar"
                  style={{
                    height: `${level * 100}%`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
            <div style={{
              position: 'absolute',
              bottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              opacity: 0.8
            }}>
              <FaWaveSquare /> NEURAL AUDIO WAVES
            </div>
          </div>

          {/* Play controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button 
              onClick={handlePlay}
              style={{
                padding: '1rem 2rem',
                background: isPlaying ? '#00ff88' : 'rgba(0, 255, 234, 0.2)',
                border: '1px solid #00ffea',
                borderRadius: '0.5rem',
                color: 'white',
                fontSize: '1.1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
              {isPlaying ? 'PAUSE' : 'PLAY'}
            </button>
            
            <button style={{
              padding: '1rem 2rem',
              background: 'rgba(255, 0, 255, 0.2)',
              border: '1px solid #ff00ff',
              borderRadius: '0.5rem',
              color: 'white',
              fontSize: '1.1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FaSave /> SAVE
            </button>
          </div>
        </div>

        {/* Right panel - Effects */}
        <div className="tools-panel">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <FaBolt /> SUPER EFFECTS
          </h3>
          {effects.map((effect, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>{effect.name}</span>
                <span>{effect.level}%</span>
              </div>
              <div style={{
                height: '6px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${effect.level}%`,
                  height: '100%',
                  background: effect.color,
                  borderRadius: '3px'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Money machine */}
      <div className="money-machine">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '1rem',
          fontSize: '1.2rem',
          color: 'gold'
        }}>
          <FaFire /> MONEY GENERATOR <FaFire />
        </div>
        
        <div style={{ position: 'relative', height: '100px', overflow: 'hidden' }}>
          {Array(15).fill(0).map((_, i) => (
            <div 
              key={i}
              className="coin"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                top: '-50px'
              }}
            >
              $
            </div>
          ))}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>PER MINUTE</div>
            <div style={{ fontSize: '1.2rem', color: '#00ff88' }}>$500K</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>INVESTORS</div>
            <div style={{ fontSize: '1.2rem', color: '#00ffea' }}>1,234</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>VALUE GROWTH</div>
            <div style={{ fontSize: '1.2rem', color: '#ff00ff' }}>+42%</div>
          </div>
        </div>
      </div>

      {/* Bottom status */}
      <div style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        background: 'rgba(0,0,0,0.9)',
        padding: '0.5rem 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.9rem',
        borderTop: '1px solid rgba(0, 255, 234, 0.2)'
      }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff88' }} />
            <span>AUDIO ENGINE: <strong>ACTIVE</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaMicrophone />
            <span>INPUT: <strong>STEREO 96KHZ</strong></span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span>LATENCY: <strong style={{ color: '#00ff88' }}>2.8ms</strong></span>
          <span>KOHLKIY v1.0.0</span>
          <span style={{ color: '#00ffea' }}>● SYSTEM STABLE</span>
        </div>
      </div>
    </div>
  )
}

export default App
