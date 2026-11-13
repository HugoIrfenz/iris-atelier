import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  Sparkles,
  RefreshCw,
  Heart,
  Download,
  Check,
  Copy,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Wifi,
  WifiOff,
  Clock,
  Square,
  Maximize2,
  Sliders,
  ExternalLink,
  Image as ImageIcon,
  Folder,
  Layers,
  Activity,
  Smartphone,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'

interface JobState {
  status: 'idle' | 'queued' | 'loading' | 'sampling' | 'decoding' | 'complete' | 'error' | 'cancelled'
  job_id: string | null
  prompt_id: string | null
  step: number
  total_steps: number
  elapsed: number
  message: string
  image_url: string | null
  metadata: any
  queue_size?: number
  batch_index?: number
  batch_total?: number
  queue_items?: Array<{ job_id: string; seed: number; index: number; total: number; prompt?: string }>
}

interface GenerationItem {
  id: number
  job_id: string
  filename: string
  image_url: string
  prompt: string
  negative_prompt: string
  model: string
  aspect_ratio: string
  width: number
  height: number
  steps: number
  cfg: number
  sampler: string
  scheduler: string
  seed: number
  elapsed_seconds: number
  created_at: string
  favorite: number
}

interface Album {
  id: number
  name: string
  created_at: string
  count: number
}

interface LanCompanionProps {
  onSwitchToDesktop?: () => void
}

export const LanCompanion: React.FC<LanCompanionProps> = ({ onSwitchToDesktop }) => {
  // Live generation state via WebSocket
  const [job, setJob] = useState<JobState>({
    status: 'idle',
    job_id: null,
    prompt_id: null,
    step: 0,
    total_steps: 8,
    elapsed: 0,
    message: '',
    image_url: null,
    metadata: null,
    queue_size: 0,
    batch_index: 0,
    batch_total: 0,
    queue_items: []
  })

  // Connection status
  const [wsConnected, setWsConnected] = useState<boolean>(false)
  const [lanBlocked, setLanBlocked] = useState<boolean>(false)

  // Gallery state
  const [gallery, setGallery] = useState<GenerationItem[]>([])
  const [albums, setAlbums] = useState<Album[]>([])
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null)
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isLoadingGallery, setIsLoadingGallery] = useState<boolean>(false)

  // Lightbox state
  const [selectedItem, setSelectedItem] = useState<GenerationItem | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number>(0)
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  // Feedback notifications
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 2500)
  }

  // Load Gallery
  const loadGallery = async () => {
    setIsLoadingGallery(true)
    try {
      const params = new URLSearchParams()
      params.set('limit', '300')
      if (searchQuery.trim()) params.set('search', searchQuery.trim())
      if (favoritesOnly) params.set('favorites_only', 'true')
      if (selectedAlbumId) params.set('album_id', selectedAlbumId.toString())

      const res = await fetch(`/api/gallery?${params.toString()}`)
      if (res.status === 403) {
        setLanBlocked(true)
        setIsLoadingGallery(false)
        return
      }
      setLanBlocked(false)
      if (res.ok) {
        const items = await res.json()
        setGallery(items)
      }
    } catch (e) {
      console.error('Gallery load error', e)
    } finally {
      setIsLoadingGallery(false)
    }
  }

  // Load Albums
  const loadAlbums = async () => {
    try {
      const res = await fetch('/api/albums')
      if (res.ok) {
        const data = await res.json()
        setAlbums(data)
      }
    } catch (e) {
      console.error('Albums load error', e)
    }
  }

  // Initial load
  useEffect(() => {
    loadGallery()
    loadAlbums()
  }, [favoritesOnly, selectedAlbumId])

  // WebSocket Connection for Live Progress
  useEffect(() => {
    let ws: WebSocket | null = null
    let reconnectTimeout: any = null

    const connectWs = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const host = window.location.host
      ws = new WebSocket(`${protocol}//${host}/api/ws/status`)

      ws.onopen = () => {
        setWsConnected(true)
        setLanBlocked(false)
      }

      ws.onmessage = (event) => {
        try {
          const data: JobState = JSON.parse(event.data)
          setJob(data)
          if (data.status === 'complete') {
            loadGallery()
            showToast('New image generated!')
          }
        } catch (e) {
          console.error('WS parse error', e)
        }
      }

      ws.onclose = (event) => {
        setWsConnected(false)
        if (event.code === 1008) {
          setLanBlocked(true)
        }
        reconnectTimeout = setTimeout(connectWs, 3000)
      }

      ws.onerror = () => {
        setWsConnected(false)
      }
    }

    connectWs()
    return () => {
      if (ws) ws.close()
      if (reconnectTimeout) clearTimeout(reconnectTimeout)
    }
  }, [])

  // Favorite toggle
  const toggleFavorite = async (jobId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    try {
      const res = await fetch(`/api/gallery/${jobId}/favorite`, { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setGallery((prev) =>
          prev.map((item) => (item.job_id === jobId ? { ...item, favorite: data.favorite } : item))
        )
        if (selectedItem && selectedItem.job_id === jobId) {
          setSelectedItem((prev) => (prev ? { ...prev, favorite: data.favorite } : null))
        }
      }
    } catch (e) {
      console.error('Favorite error', e)
    }
  }

  // 1-Tap Mobile Image Download
  const handleDownload = async (item: GenerationItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setDownloadingId(item.job_id)
    try {
      const response = await fetch(item.image_url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = item.filename || `iris_atelier_${item.seed}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(blobUrl)
      showToast('Image saved to downloads!')
    } catch (err) {
      // Fallback: direct window download
      window.open(item.image_url, '_blank')
    } finally {
      setDownloadingId(null)
    }
  }

  // Cancel generation
  const handleCancelGeneration = async () => {
    if (!confirm('Cancel currently active generation?')) return
    try {
      await fetch('/api/cancel', { method: 'POST' })
      showToast('Generation cancelled')
    } catch (e) {
      console.error('Cancel error', e)
    }
  }

  // Lightbox Navigation
  const openLightbox = (item: GenerationItem, index: number) => {
    setSelectedItem(item)
    setLightboxIndex(index)
  }

  const nextLightbox = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (gallery.length === 0) return
    const nextIdx = (lightboxIndex + 1) % gallery.length
    setLightboxIndex(nextIdx)
    setSelectedItem(gallery[nextIdx])
  }

  const prevLightbox = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (gallery.length === 0) return
    const prevIdx = (lightboxIndex - 1 + gallery.length) % gallery.length
    setLightboxIndex(prevIdx)
    setSelectedItem(gallery[prevIdx])
  }

  // Progress Calculation
  const isGenerating =
    job.status === 'sampling' ||
    job.status === 'loading' ||
    job.status === 'decoding' ||
    job.status === 'queued'

  const progressPercent = useMemo(() => {
    if (job.status === 'complete') return 100
    if (job.status === 'sampling' && job.total_steps > 0) {
      return Math.round((job.step / job.total_steps) * 100)
    }
    if (job.status === 'loading') return 15
    if (job.status === 'decoding') return 95
    return 0
  }, [job])

  return (
    <div className="min-h-screen bg-[#0e1117] text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1e2535] border border-[#3b4760] text-white text-xs px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* LAN Blocked Banner */}
      {lanBlocked && (
        <div className="bg-red-500/20 border-b border-red-500/30 px-4 py-3 text-red-200 text-xs flex items-center justify-between gap-3 sticky top-0 z-40 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>LAN Broadcast is turned OFF on your PC. Enable it in desktop studio to resume live updates.</span>
          </div>
          <button
            onClick={() => {
              loadGallery()
            }}
            className="px-3 py-1 bg-red-500/30 hover:bg-red-500/40 text-white rounded font-medium text-[11px] shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#161a23]/95 backdrop-blur-md border-b border-[#252c3c] px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2a3449] to-[#1e2535] border border-[#37445e] flex items-center justify-center shadow-md">
            <svg className="w-4 h-4 text-[#8699b8]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.5 6 4 10.5 4 15.5a8 8 0 0016 0C20 10.5 15.5 6 12 2zm0 18a5.5 5.5 0 01-5.5-5.5c0-3.3 2.8-6.7 5.5-9.8 2.7 3.1 5.5 6.5 5.5 9.8 0 3-2.5 5.5-5.5 5.5z"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-semibold text-white tracking-wide font-serif">Iris Atelier</h1>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                LAN Companion
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              {wsConnected ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-medium">Wi-Fi Connected</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="text-amber-400">Connecting...</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            onClick={() => loadGallery()}
            className="w-8 h-8 rounded-lg bg-[#202634] hover:bg-[#283042] border border-[#2e3748] flex items-center justify-center text-slate-300 active:scale-95 transition"
            title="Refresh images"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingGallery ? 'animate-spin text-[#8699b8]' : ''}`} />
          </button>

          {/* Switch to Full Desktop Studio View */}
          {onSwitchToDesktop && (
            <button
              onClick={onSwitchToDesktop}
              className="text-xs text-slate-300 hover:text-white bg-[#202634] hover:bg-[#283042] border border-[#2e3748] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 active:scale-95 transition"
              title="Switch to full desktop view"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#8699b8]" />
              <span className="hidden sm:inline">Desktop View</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Scroll Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 space-y-4">

        {/* ================= SECTION 1: LIVE PROGRESS CARD ================= */}
        <section className="bg-gradient-to-b from-[#181d27] to-[#141822] border border-[#262e3f] rounded-2xl p-4 shadow-xl relative overflow-hidden">
          {/* Background Ambient Glow when generating */}
          {isGenerating && (
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
          )}

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${isGenerating ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
              <h2 className="text-xs font-semibold tracking-wider uppercase text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#8699b8]" />
                Live Generation Progress
              </h2>
            </div>

            {/* Status Pill */}
            <div>
              {job.status === 'sampling' && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  Sampling {job.step}/{job.total_steps} ({progressPercent}%)
                </span>
              )}
              {job.status === 'loading' && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Loading Model...
                </span>
              )}
              {job.status === 'decoding' && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Decoding VAE...
                </span>
              )}
              {job.status === 'idle' && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  Studio Idle
                </span>
              )}
              {job.status === 'complete' && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Complete
                </span>
              )}
              {job.status === 'cancelled' && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                  Cancelled
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#10131b] border border-[#222836] h-3 rounded-full overflow-hidden mb-3 relative">
            <div
              className={`h-full transition-all duration-300 ${
                job.status === 'complete'
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-[#506385] via-emerald-400 to-[#8699b8]'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Generation Details */}
          {isGenerating ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-slate-300">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Elapsed: <strong className="text-white font-mono">{job.elapsed}s</strong>
                </span>
                {job.queue_size && job.queue_size > 0 ? (
                  <span className="text-amber-300 font-medium text-[11px] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Queue: {job.queue_size} pending
                  </span>
                ) : null}
              </div>

              {/* Prompt Preview */}
              {job.metadata?.prompt && (
                <div className="bg-[#12151e] border border-[#232938] rounded-xl p-2.5">
                  <p className="text-xs text-slate-200 line-clamp-2 italic leading-relaxed">
                    "{job.metadata.prompt}"
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {job.metadata.model && (
                      <span className="text-[10px] bg-[#1d2331] text-slate-300 px-2 py-0.5 rounded border border-[#2d364a]">
                        {job.metadata.model.replace('.gguf', '')}
                      </span>
                    )}
                    {job.metadata.aspect_ratio && (
                      <span className="text-[10px] bg-[#1d2331] text-slate-300 px-2 py-0.5 rounded border border-[#2d364a]">
                        {job.metadata.aspect_ratio}
                      </span>
                    )}
                    {job.metadata.seed && (
                      <span className="text-[10px] bg-[#1d2331] text-slate-400 px-2 py-0.5 rounded border border-[#2d364a] font-mono">
                        Seed: {job.metadata.seed}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Cancel Button */}
              <div className="pt-1 flex justify-end">
                <button
                  onClick={handleCancelGeneration}
                  className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 active:scale-95"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel Generation
                </button>
              </div>
            </div>
          ) : job.status === 'complete' && job.image_url ? (
            /* Freshly Completed Image Card */
            <div className="flex items-center gap-3 bg-[#12151e] border border-emerald-500/30 rounded-xl p-3">
              <img
                src={job.image_url}
                alt="Latest render"
                className="w-16 h-16 object-cover rounded-lg border border-[#2d364a] shadow-md shrink-0 cursor-pointer"
                onClick={() => {
                  const match = gallery.find((g) => g.job_id === job.job_id)
                  if (match) openLightbox(match, 0)
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold mb-0.5">
                  <Check className="w-3.5 h-3.5" /> Render Complete!
                </div>
                <p className="text-[11px] text-slate-300 truncate">
                  {job.metadata?.prompt || 'Freshly generated artwork'}
                </p>
                <span className="text-[10px] text-slate-500">Rendered in {job.elapsed}s</span>
              </div>
              <button
                onClick={() => {
                  const match = gallery.find((g) => g.job_id === job.job_id)
                  if (match) handleDownload(match)
                  else if (job.image_url) {
                    const a = document.createElement('a')
                    a.href = job.image_url
                    a.download = `iris_atelier_${Date.now()}.png`
                    a.click()
                  }
                }}
                className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 active:scale-95 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          ) : (
            /* Idle Notice */
            <div className="text-center py-2 text-slate-400 text-xs flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8699b8]" />
              <span>Studio is ready. Start generations on your PC to track live progress here.</span>
            </div>
          )}
        </section>

        {/* ================= SECTION 2: GALLERY & PICS ================= */}
        <section className="space-y-3">
          {/* Section Header with Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#8699b8]" />
              <h2 className="text-sm font-semibold text-white">Atelier Gallery</h2>
              <span className="text-xs bg-[#1f2533] text-slate-300 px-2 py-0.5 rounded-full border border-[#2d364a] font-mono">
                {gallery.length} pics
              </span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="space-y-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search prompt, character..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadGallery()}
                className="w-full bg-[#161a24] border border-[#262e3e] text-xs text-white pl-9 pr-8 py-2 rounded-xl placeholder:text-slate-500 focus:outline-none focus:border-[#8699b8]"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setTimeout(loadGallery, 50)
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills (All, Favorites, and Albums) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {/* All Filter */}
              <button
                onClick={() => {
                  setFavoritesOnly(false)
                  setSelectedAlbumId(null)
                }}
                className={`text-xs px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition ${
                  !favoritesOnly && selectedAlbumId === null
                    ? 'bg-[#8699b8] text-white shadow-sm'
                    : 'bg-[#181d27] text-slate-400 hover:text-slate-200 border border-[#262d3b]'
                }`}
              >
                All Pics
              </button>

              {/* Favorites Filter */}
              <button
                onClick={() => {
                  setFavoritesOnly(!favoritesOnly)
                  setSelectedAlbumId(null)
                }}
                className={`text-xs px-3 py-1.5 rounded-xl whitespace-nowrap font-medium flex items-center gap-1.5 transition ${
                  favoritesOnly
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-[#181d27] text-slate-400 hover:text-rose-300 border border-[#262d3b]'
                }`}
              >
                <Heart className={`w-3 h-3 ${favoritesOnly ? 'fill-current' : ''}`} />
                <span>Favorites</span>
              </button>

              {/* Albums Filter */}
              {albums.map((album) => (
                <button
                  key={album.id}
                  onClick={() => {
                    setFavoritesOnly(false)
                    setSelectedAlbumId(selectedAlbumId === album.id ? null : album.id)
                  }}
                  className={`text-xs px-3 py-1.5 rounded-xl whitespace-nowrap font-medium flex items-center gap-1.5 transition ${
                    selectedAlbumId === album.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-[#181d27] text-slate-400 hover:text-slate-200 border border-[#262d3b]'
                  }`}
                >
                  <Folder className="w-3 h-3 text-indigo-400" />
                  <span>{album.name}</span>
                  <span className="text-[10px] opacity-75">({album.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pictures Grid (2-column touch layout for mobile) */}
          {gallery.length === 0 ? (
            <div className="bg-[#141822] border border-[#222938] rounded-2xl p-8 text-center space-y-2">
              <ImageIcon className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">No images found for this filter.</p>
              <button
                onClick={() => {
                  setFavoritesOnly(false)
                  setSelectedAlbumId(null)
                  setSearchQuery('')
                }}
                className="text-xs text-[#8699b8] underline font-medium"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {gallery.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => openLightbox(item, index)}
                  className="group relative bg-[#161a24] border border-[#242b3b] rounded-xl overflow-hidden shadow-md cursor-pointer hover:border-[#8699b8]/50 transition-all flex flex-col"
                >
                  {/* Image Aspect Box */}
                  <div className="relative aspect-[2/3] w-full bg-[#0d1017] overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.prompt}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Top Overlay: Aspect Ratio & Favorite Toggle */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                      <span className="text-[10px] font-medium bg-black/60 backdrop-blur-md text-slate-300 px-1.5 py-0.5 rounded">
                        {item.aspect_ratio || '2:3'}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(item.job_id, e)}
                        className={`pointer-events-auto p-1.5 rounded-full backdrop-blur-md transition ${
                          item.favorite
                            ? 'bg-rose-500/90 text-white shadow-md shadow-rose-500/30'
                            : 'bg-black/50 text-slate-300 hover:text-white'
                        }`}
                        title="Toggle Favorite"
                      >
                        <Heart className={`w-3.5 h-3.5 ${item.favorite ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Bottom Quick-Action Bar */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 pt-6 flex items-center justify-between gap-1 pointer-events-auto">
                      <p className="text-[10px] text-slate-300 truncate font-light flex-1">
                        {item.prompt.split(',')[0]}
                      </p>

                      {/* 1-Tap Download Button */}
                      <button
                        type="button"
                        onClick={(e) => handleDownload(item, e)}
                        disabled={downloadingId === item.job_id}
                        className="p-1.5 rounded-lg bg-emerald-500/80 hover:bg-emerald-500 text-white transition active:scale-90 shadow-md shrink-0"
                        title="Save to Phone"
                      >
                        <Download className={`w-3.5 h-3.5 ${downloadingId === item.job_id ? 'animate-bounce' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ================= FULLSCREEN MOBILE LIGHTBOX ================= */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col justify-between"
          onClick={() => setSelectedItem(null)}
        >
          {/* Lightbox Header Bar */}
          <div
            className="p-3 flex items-center justify-between bg-black/40 backdrop-blur-md border-b border-white/10 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs text-slate-400">
              <span className="font-mono text-white font-medium">{lightboxIndex + 1}</span> of {gallery.length}
            </div>

            <div className="flex items-center gap-2">
              {/* Favorite Button */}
              <button
                onClick={(e) => toggleFavorite(selectedItem.job_id, e)}
                className={`p-2 rounded-full transition ${
                  selectedItem.favorite
                    ? 'bg-rose-500 text-white'
                    : 'bg-white/10 text-slate-300 hover:text-white'
                }`}
                title="Favorite"
              >
                <Heart className={`w-4 h-4 ${selectedItem.favorite ? 'fill-current' : ''}`} />
              </button>

              {/* 1-Tap Download Button */}
              <button
                onClick={(e) => handleDownload(selectedItem, e)}
                className="px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
                title="Download full resolution"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>

              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lightbox Main Image + Navigation Arrows */}
          <div
            className="flex-1 relative flex items-center justify-center p-2 min-h-0 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Button */}
            <button
              onClick={prevLightbox}
              className="absolute left-3 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md z-10 active:scale-90 transition"
              title="Previous Image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Displayed Image */}
            <img
              src={selectedItem.image_url}
              alt={selectedItem.prompt}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />

            {/* Next Button */}
            <button
              onClick={nextLightbox}
              className="absolute right-3 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md z-10 active:scale-90 transition"
              title="Next Image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Lightbox Bottom Drawer: Metadata & Copy Prompt */}
          <div
            className="p-4 bg-gradient-to-t from-black via-black/90 to-transparent border-t border-white/10 shrink-0 max-h-48 overflow-y-auto space-y-2 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-slate-200 text-xs italic leading-relaxed line-clamp-3 select-text">
                "{selectedItem.prompt}"
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedItem.prompt)
                  setCopiedPrompt(true)
                  setTimeout(() => setCopiedPrompt(false), 1500)
                }}
                className="shrink-0 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
                title="Copy prompt"
              >
                {copiedPrompt ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 pt-1">
              <span className="bg-white/10 px-2 py-0.5 rounded text-slate-300">
                {selectedItem.model ? selectedItem.model.replace('.gguf', '') : 'Turbo Model'}
              </span>
              <span className="bg-white/10 px-2 py-0.5 rounded text-slate-300">
                {selectedItem.width}×{selectedItem.height} ({selectedItem.aspect_ratio})
              </span>
              <span className="bg-white/10 px-2 py-0.5 rounded text-slate-300 font-mono">
                Seed: {selectedItem.seed}
              </span>
              <span className="bg-white/10 px-2 py-0.5 rounded text-slate-300">
                Steps: {selectedItem.steps}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
