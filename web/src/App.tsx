import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  Square,
  RefreshCw,
  Heart,
  Trash2,
  Sliders,
  Power,
  HardDrive,
  Cpu,
  Image as ImageIcon,
  ExternalLink,
  Copy,
  Check,
  Search,
  Maximize2,
  X,
  Layers,
  Dices,
  Download,
  FolderPlus,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileDown,
  User,
  Users,
  Bookmark,
  RotateCcw,
  Edit2,
  Wand2,
  Tag,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Palette,
  CheckSquare,
  Archive,
  CheckCheck,
  Clock,
  ArrowUpRight,
  Activity,
  Eye,
  ListOrdered,
  Folder,
  FolderCheck,
  Camera,
  FileCode,
  Upload,
  Wifi,
  WifiOff,
  Smartphone,
  QrCode
} from 'lucide-react'
import { LanCompanion } from './LanCompanion'

interface Album {
  id: number
  name: string
  created_at: string
  count: number
}

interface CharacterTemplate {
  id: string
  name: string
  tagline: string
  color: string
  prompt: string
  is_default?: number
  created_at?: string
}

const DEFAULT_CHARACTERS: CharacterTemplate[] = [
  {
    id: 'zaria',
    name: 'Zaria',
    tagline: 'Heterochromia Fashion Model',
    color: 'sky',
    prompt: `masterpiece, best quality, 1girl, adult woman, tall woman, lean athletic body, flat chest, slim hips, long legs, narrow elegant silhouette, pale skin, calm confident expression, slightly detached gaze, subtle smirk, artistic fashion model aura, cool artistic woman, editorial fashion, unconventional styling, effortlessly stylish

short asymmetrical cyan blue hair, messy layered crop cut, uneven side bangs, longer side strand on one side, heterochromia, one golden amber eye and one cyan blue eye,

olive green asymmetrical halter crop top, high neck strap detail, exposed shoulders, oversized black jacket worn loose and slipping off shoulders, high waisted black shorts, black thigh straps, chunky black combat boots, gold hoop earring, intentional asymmetry, avant garde casual outfit,

white background, full body character design, clean anime illustration.`,
    is_default: 1
  },
  {
    id: 'nixia',
    name: 'Nixia',
    tagline: 'Petite Gothic Mesugaki',
    color: 'purple',
    prompt: `masterpiece, best quality, 1girl, bratty, pale skin, flat chest, thick thighs, smug expression, mesugaki look

short silver hair, purple highlights, side bangs, side locks, twin buns, crimson eyes,

black gothic corset and simple short skirt, black thigh highs,

white background.`,
    is_default: 1
  },
  {
    id: 'angela',
    name: 'Angela',
    tagline: 'Curvy Secretary & Lab Coat',
    color: 'cyan',
    prompt: `masterpiece, best quality, Anime girl, amber eyes, secretary look, huge breasts, curvy body,

short light blue hair, messy bob cut, side bangs,

white lab coat, light blue shirt, blue necktie, black pencil skirt, black thighhighs, formal attire, confident expression

white background.`,
    is_default: 1
  },
  {
    id: 'virelia',
    name: 'Virelia',
    tagline: 'Gentle Maid & Pastel Pink',
    color: 'pink',
    prompt: `masterpiece, best quality, 1girl, mature woman, cute elegant maid, golden eyes, freckles, soft blush, gentle smile, warm soft expression

pastel pink hair, long soft hair, low twin tied hair,

pink collared dress, white apron, white frilled maid headpiece, flower hair clip,

white background.`,
    is_default: 1
  },
  {
    id: 'vivianne',
    name: 'Vivianne',
    tagline: 'Sleepy Seductive & Oversized Sweater',
    color: 'slate',
    prompt: `masterpiece, best quality, 1woman, adult woman, tall mature anime woman, elongated adult proportions, natural adult anatomy, pale skin,

extremely long flowing silver-white hair reaching the ankles, silky straight hair, long face framing strands, soft layered bangs, crimson red eyes, sleepy half-lidded eyes, calm expressionless kuudere face,

flat chest, slender upper body, narrow shoulders, defined natural waist, moderately wide hips, noticeably thick rounded thighs, full soft upper legs, naturally thick thighs extending toward the knees, balanced lower body proportions, smooth gradual taper toward the calves, long legs, elegant mature feminine silhouette,

loose oversized black knit sweater ending at upper thighs, matching black thighhigh stockings on both legs, symmetrical stockings, barefoot, relaxed standing pose, full body, white background, clean anime character illustration`,
    is_default: 1
  }
]

interface QuickTag {
  id: string
  category: 'scene' | 'lighting' | 'shot' | 'style'
  label: string
  tag: string
}

const QUICK_TAGS: QuickTag[] = [
  // Scene
  { id: 'cafe', category: 'scene', label: '☕ Cozy Cafe', tag: 'cozy cafe interior, warm ambient background' },
  { id: 'rain', category: 'scene', label: '🌧️ Neon Rain', tag: 'rainy cyberpunk street, puddle reflections, neon city glow' },
  { id: 'sakura', category: 'scene', label: '🌸 Sakura Garden', tag: 'falling cherry blossom petals, spring garden, soft sunshine' },
  { id: 'gothic', category: 'scene', label: '🏰 Gothic Room', tag: 'ornate gothic room, dark aesthetic, stained glass window' },
  { id: 'sunset', category: 'scene', label: '🌅 Sunset Glow', tag: 'golden hour sunset, vibrant warm horizon, evening glow' },
  { id: 'office', category: 'scene', label: '🏢 Luxury Office', tag: 'modern high-rise executive office, panoramic glass window' },
  { id: 'white_bg', category: 'scene', label: '⚪ Clean White', tag: 'simple clean white background, studio backdrop' },

  // Lighting
  { id: 'studio_light', category: 'lighting', label: '💡 Studio Light', tag: 'soft professional studio lighting, rim light' },
  { id: 'volumetric', category: 'lighting', label: '✨ God Rays', tag: 'volumetric light beams, dramatic atmospheric lighting' },
  { id: 'cyber_glow', category: 'lighting', label: '🔮 Cyber Glow', tag: 'dramatic dual-tone neon lighting, cyan and magenta glow' },
  { id: 'moody', category: 'lighting', label: '🕯️ Candlelight', tag: 'warm flickering candlelight, deep soft shadows' },

  // Shot
  { id: 'portrait', category: 'shot', label: '👤 Close-up', tag: 'close-up face portrait, expressive detailed eyes' },
  { id: 'upper', category: 'shot', label: '💃 Upper Body', tag: 'upper body portrait, waist up shot' },
  { id: 'cowboy', category: 'shot', label: '👖 Thigh-up', tag: 'cowboy shot, thigh up view' },
  { id: 'full', category: 'shot', label: '👠 Full Body', tag: 'full body view, stylish pose, head to toe' },
  { id: 'dynamic', category: 'shot', label: '📐 Dynamic Angle', tag: 'dynamic dramatic camera angle, slight low angle' },

  // Style
  { id: 'aesthetic', category: 'style', label: '✨ Masterpiece+', tag: 'masterpiece, best quality, ultra-detailed, sharp focus' },
  { id: 'anime_cel', category: 'style', label: '🎨 Clean Anime Cel', tag: 'clean crisp anime lineart, vibrant rich colors' },
  { id: 'cinematic', category: 'style', label: '🎬 Cinematic Look', tag: 'cinematic still, 35mm film photograph, film grain' }
]

const NEGATIVE_PRESETS = [
  { label: 'Anime Standard', value: 'worst quality, low quality, blurry, deformed, bad anatomy' },
  { label: 'Anti-Bad Hands+', value: 'worst quality, low quality, bad anatomy, bad hands, missing fingers, extra limbs, deformed, disfigured, blurry, cropped, watermark, signature' },
  { label: 'Minimal (Fast)', value: 'worst quality, low quality, blurry' }
]

const PROMPT_SLOT_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

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

interface ModelItem {
  filename: string
  type: 'gguf' | 'checkpoint'
  category: string
  size_gb: number
  path: string
}

interface DownloadItem {
  id: string
  url: string
  target_type: string
  filename: string
  status: 'pending' | 'connecting' | 'downloading' | 'completed' | 'failed' | 'cancelled'
  downloaded_bytes: number
  total_bytes: number
  progress: number
  speed_mb_s: number
  error: string | null
}

interface SystemStatus {
  comfyui_online: boolean
  gpu: {
    available: boolean
    name: string
    vram_used_mb: number
    vram_total_mb: number
    utilization: number
  }
  storage: {
    d_drive: { free_gb: number; total_gb: number }
    c_drive: { free_gb: number; total_gb: number }
  }
}

export default function App() {
  // Generation Mode: Single Prompt vs Multiprompt Queue (1-10) vs JSON to Generate
  const [generationMode, setGenerationMode] = useState<'single' | 'multiprompt' | 'json_batch'>('single')

  // Single mode prompt state
  const [prompt, setPrompt] = useState(DEFAULT_CHARACTERS[0].prompt)
  const [negativePrompt, setNegativePrompt] = useState('worst quality, low quality, blurry, deformed, bad anatomy')
  const [model, setModel] = useState('anima-turbo-v1.1-Q5_K_M.gguf')
  const [aspectRatio, setAspectRatio] = useState('Portrait Lite (768×1152)')
  const [width, setWidth] = useState(768)
  const [height, setHeight] = useState(1152)
  const [steps, setSteps] = useState(8)
  const [cfg, setCfg] = useState(1.0)
  const [sampler, setSampler] = useState('euler')
  const [scheduler, setScheduler] = useState('sgm_uniform')
  const [seed, setSeed] = useState(-1)
  const [randomSeed, setRandomSeed] = useState(true)
  const [batchCount, setBatchCount] = useState<number>(1)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Multiprompt queue mode state (up to 10 sequential prompts A-J)
  const [multiPrompts, setMultiPrompts] = useState<string[]>([
    DEFAULT_CHARACTERS[0].prompt,
    DEFAULT_CHARACTERS[1].prompt,
    DEFAULT_CHARACTERS[2].prompt
  ])
  const [activeSlotIndex, setActiveSlotIndex] = useState<number>(0)

  // Navigation & View tabs
  const [activeTab, setActiveTab] = useState<'canvas' | 'gallery'>('canvas')
  const [navSection, setNavSection] = useState<'studio' | 'gallery' | 'models'>('studio')

  // Live ComfyUI job state
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

  // System & Models state
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [installedModels, setInstalledModels] = useState<ModelItem[]>([])
  const [downloads, setDownloads] = useState<DownloadItem[]>([])
  const [gallery, setGallery] = useState<GenerationItem[]>([])
  const [selectedItem, setSelectedItem] = useState<GenerationItem | null>(null)
  const [displayedGalleryIndex, setDisplayedGalleryIndex] = useState<number>(0)
  const [gallerySearch, setGallerySearch] = useState('')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [copiedPromptSuccess, setCopiedPromptSuccess] = useState(false)
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([])
  const [isExportingZip, setIsExportingZip] = useState(false)
  const [isBatchDeleting, setIsBatchDeleting] = useState(false)

  // Albums state
  const [albums, setAlbums] = useState<Album[]>([])
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null)
  const [showAddToAlbumModal, setShowAddToAlbumModal] = useState(false)
  const [showCreateAlbumModal, setShowCreateAlbumModal] = useState(false)
  const [newAlbumInput, setNewAlbumInput] = useState('')
  const [albumFeedbackMsg, setAlbumFeedbackMsg] = useState('')
  const [targetJobIdsForAlbum, setTargetJobIdsForAlbum] = useState<string[]>([])

  // Angle & Pose Burst Matrix state (10, 50, 100 only)
  const [showAngleBurstModal, setShowAngleBurstModal] = useState(false)
  const [burstCount, setBurstCount] = useState<10 | 50 | 100>(100)
  const [burstAlbumName, setBurstAlbumName] = useState('')
  const [isQueueingBurst, setIsQueueingBurst] = useState(false)

  // JSON Batch Generation state
  const [jsonBatchRaw, setJsonBatchRaw] = useState<string>('')
  const [jsonBatchParsed, setJsonBatchParsed] = useState<any>(null)
  const [jsonBatchError, setJsonBatchError] = useState<string>('')
  const [jsonBatchAlbumName, setJsonBatchAlbumName] = useState<string>('Atelier Concept Showcase')
  const [jsonBatchGenerations, setJsonBatchGenerations] = useState<any[]>([])
  const [jsonBatchStartIndex, setJsonBatchStartIndex] = useState<number>(1)
  const [isQueueingJsonBatch, setIsQueueingJsonBatch] = useState<boolean>(false)
  const [jsonBatchInputMode, setJsonBatchInputMode] = useState<'upload' | 'paste'>('upload')

  // Modals
  const [showShutdownModal, setShowShutdownModal] = useState(false)
  const [isShutDown, setIsShutDown] = useState(false)
  const [showModelModal, setShowModelModal] = useState(false)
  const [modelModalTab, setModelModalTab] = useState<'url' | 'local' | 'installed'>('url')

  // LAN Broadcast & Mobile Companion state
  const [isLanView, setIsLanView] = useState<boolean>(() => {
    return window.location.pathname.startsWith('/lan')
  })
  const [lanStatus, setLanStatus] = useState<{
    enabled: boolean
    local_ip: string
    port: number
    url: string
    qr_code: string
    is_local?: boolean
  }>({
    enabled: true,
    local_ip: '127.0.0.1',
    port: 7860,
    url: 'http://127.0.0.1:7860/lan',
    qr_code: ''
  })
  const [showLanModal, setShowLanModal] = useState<boolean>(false)
  const [isTogglingLan, setIsTogglingLan] = useState<boolean>(false)
  const [copiedLanUrl, setCopiedLanUrl] = useState<boolean>(false)

  const fetchLanStatus = async () => {
    try {
      const res = await fetch('/api/lan/status')
      if (res.ok) {
        const data = await res.json()
        setLanStatus(data)
      }
    } catch (e) {
      console.error('Failed to fetch LAN status', e)
    }
  }

  const handleToggleLan = async (nextEnabled: boolean) => {
    setIsTogglingLan(true)
    try {
      const res = await fetch('/api/lan/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: nextEnabled })
      })
      if (res.ok) {
        const data = await res.json()
        setLanStatus((prev) => ({ ...prev, ...data }))
      }
    } catch (e) {
      alert('Failed to update LAN status: ' + e)
    } finally {
      setIsTogglingLan(false)
    }
  }

  // Importer form states
  const [downloadUrl, setDownloadUrl] = useState('')
  const [downloadType, setDownloadType] = useState('unet')
  const [downloadCustomName, setDownloadCustomName] = useState('')
  const [civitaiToken, setCivitaiToken] = useState('')
  const [localSourcePath, setLocalSourcePath] = useState('')
  const [localTargetType, setLocalTargetType] = useState('checkpoints')
  const [localCustomName, setLocalCustomName] = useState('')
  const [scannedFiles, setScannedFiles] = useState<any[]>([])
  const [importStatusMsg, setImportStatusMsg] = useState('')

  // Character Templates state
  const [characters, setCharacters] = useState<CharacterTemplate[]>(DEFAULT_CHARACTERS)
  const [activeCharacterId, setActiveCharacterId] = useState<string>('zaria')
  const [showCharacterModal, setShowCharacterModal] = useState(false)
  const [editingCharId, setEditingCharId] = useState<string | null>(null)
  const [charFormName, setCharFormName] = useState('')
  const [charFormTagline, setCharFormTagline] = useState('')
  const [charFormColor, setCharFormColor] = useState('sky')
  const [charFormPrompt, setCharFormPrompt] = useState('')

  // Quick Enhancers & Tag state
  const [showQuickTags, setShowQuickTags] = useState(true)
  const [activeQuickCategory, setActiveQuickCategory] = useState<'all' | 'scene' | 'lighting' | 'shot' | 'style'>('all')

  // Canvas zoom & view state
  const [canvasZoom, setCanvasZoom] = useState<'fit' | '100%'>('fit')

  // WebSocket for live progress
  useEffect(() => {
    let ws: WebSocket | null = null
    const connectWs = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const host = window.location.host
      ws = new WebSocket(`${protocol}//${host}/api/ws/status`)

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setJob(data)
          if (data.status === 'complete') {
            loadGallery()
          }
        } catch (e) {
          console.error('WS Parse error', e)
        }
      }

      ws.onclose = () => {
        setTimeout(connectWs, 2000)
      }
    }

    connectWs()
    return () => {
      if (ws) ws.close()
    }
  }, [])

  // Poll system status & active downloads
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/system/status')
        if (res.ok) setSystemStatus(await res.json())

        const dlRes = await fetch('/api/models/downloads')
        if (dlRes.ok) {
          const dlData = await dlRes.json()
          setDownloads(dlData)
          if (dlData.some((d: any) => d.status === 'completed')) {
            loadModels()
          }
        }
      } catch (e) {
        // silent
      }
    }
    fetchStatus()
    const interval = setInterval(fetchStatus, 2500)
    return () => clearInterval(interval)
  }, [])

  // Load installed models
  const loadModels = async () => {
    try {
      const res = await fetch('/api/models')
      if (res.ok) {
        const data = await res.json()
        setInstalledModels(data)
        if (data.length > 0 && !data.some((m: ModelItem) => m.filename === model)) {
          setModel(data[0].filename)
        }
      }
    } catch (e) {
      console.error('Failed to load models', e)
    }
  }

  useEffect(() => {
    loadModels()
    fetchLanStatus()
  }, [])

  // Load albums
  const loadAlbums = async () => {
    try {
      const res = await fetch('/api/albums')
      if (res.ok) {
        setAlbums(await res.json())
      }
    } catch (e) {
      console.error('Failed to load albums', e)
    }
  }

  useEffect(() => {
    loadAlbums()
  }, [])

  // Load gallery
  const loadGallery = async () => {
    try {
      const params = new URLSearchParams()
      params.append('limit', '500')
      if (gallerySearch) params.append('search', gallerySearch)
      if (favoritesOnly) params.append('favorites_only', 'true')
      if (selectedAlbumId !== null) params.append('album_id', selectedAlbumId.toString())
      const res = await fetch(`/api/gallery?${params.toString()}`)
      if (res.ok) {
        const items = await res.json()
        setGallery(items)
      }
    } catch (e) {
      console.error('Failed to load gallery', e)
    }
  }

  useEffect(() => {
    loadGallery()
  }, [gallerySearch, favoritesOnly, selectedAlbumId])

  // Load characters on startup
  const loadCharacters = async () => {
    try {
      const res = await fetch('/api/characters')
      if (res.ok) {
        const data = await res.json()
        if (data && data.length > 0) {
          setCharacters(data)
          return
        }
      }
    } catch (e) {
      console.error('Failed to load characters from API', e)
    }
    const saved = localStorage.getItem('studio_character_templates')
    if (saved) {
      try {
        setCharacters(JSON.parse(saved))
        return
      } catch (e) {}
    }
    setCharacters(DEFAULT_CHARACTERS)
  }

  useEffect(() => {
    loadCharacters()
  }, [])

  const applyCharacter = (char: CharacterTemplate, append = false) => {
    if (generationMode === 'single') {
      if (append) {
        let trimmed = prompt.trim()
        if (!trimmed) {
          setPrompt(char.prompt)
        } else {
          setPrompt(`${trimmed}\n\n${char.prompt}`)
        }
      } else {
        setPrompt(char.prompt)
      }
    } else {
      // In multiprompt mode, update the active slot
      setMultiPrompts((prev) => {
        const next = [...prev]
        if (append && next[activeSlotIndex]) {
          const trimmed = next[activeSlotIndex].trim()
          next[activeSlotIndex] = trimmed ? `${trimmed}\n\n${char.prompt}` : char.prompt
        } else {
          next[activeSlotIndex] = char.prompt
        }
        return next
      })
    }
    setActiveCharacterId(char.id)
  }

  const handleOpenAddCharacter = () => {
    setEditingCharId(null)
    setCharFormName('')
    setCharFormTagline('')
    setCharFormColor('sky')
    setCharFormPrompt(generationMode === 'single' ? prompt : multiPrompts[activeSlotIndex] || '')
    setShowCharacterModal(true)
  }

  const handleOpenEditCharacter = (char: CharacterTemplate, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setEditingCharId(char.id)
    setCharFormName(char.name)
    setCharFormTagline(char.tagline)
    setCharFormColor(char.color)
    setCharFormPrompt(char.prompt)
    setShowCharacterModal(true)
  }

  const handleSaveCharacter = async () => {
    if (!charFormName.trim() || !charFormPrompt.trim()) {
      alert('Please provide both character name and prompt.')
      return
    }
    const id = editingCharId || charFormName.trim().toLowerCase().replace(/\s+/g, '_')
    const charData: CharacterTemplate = {
      id,
      name: charFormName.trim(),
      tagline: charFormTagline.trim(),
      color: charFormColor,
      prompt: charFormPrompt.trim(),
      is_default: editingCharId ? characters.find((c) => c.id === editingCharId)?.is_default || 0 : 0
    }

    try {
      const res = await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(charData)
      })
      if (res.ok) {
        const result = await res.json()
        setCharacters(result.characters)
      } else {
        const updated = editingCharId
          ? characters.map((c) => (c.id === editingCharId ? charData : c))
          : [...characters, charData]
        setCharacters(updated)
        localStorage.setItem('studio_character_templates', JSON.stringify(updated))
      }
    } catch (e) {
      const updated = editingCharId
        ? characters.map((c) => (c.id === editingCharId ? charData : c))
        : [...characters, charData]
      setCharacters(updated)
      localStorage.setItem('studio_character_templates', JSON.stringify(updated))
    }

    setShowCharacterModal(false)
    setEditingCharId(null)
  }

  const handleDeleteCharacter = async (charId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (!confirm('Are you sure you want to delete this character preset?')) return
    try {
      const res = await fetch(`/api/characters/${charId}`, { method: 'DELETE' })
      if (res.ok) {
        const result = await res.json()
        setCharacters(result.characters)
        return
      }
    } catch (e) {}
    const updated = characters.filter((c) => c.id !== charId)
    setCharacters(updated)
    localStorage.setItem('studio_character_templates', JSON.stringify(updated))
  }

  const handleResetCharacters = async () => {
    if (!confirm('Reset character presets back to the default 5 characters (Zaria, Nixia, Angela, Virelia, Vivianne)?'))
      return
    try {
      const res = await fetch('/api/characters/reset', { method: 'POST' })
      if (res.ok) {
        const result = await res.json()
        setCharacters(result.characters)
        localStorage.setItem('studio_character_templates', JSON.stringify(result.characters))
        return
      }
    } catch (e) {}
    setCharacters(DEFAULT_CHARACTERS)
    localStorage.setItem('studio_character_templates', JSON.stringify(DEFAULT_CHARACTERS))
  }

  // Quick Tags
  const toggleQuickTag = (tag: string) => {
    const currentTarget = generationMode === 'single' ? prompt : multiPrompts[activeSlotIndex] || ''
    const lowerPrompt = currentTarget.toLowerCase()
    const lowerTag = tag.toLowerCase()

    let updated = ''
    if (lowerPrompt.includes(lowerTag)) {
      updated = currentTarget
        .replace(new RegExp(`,?\\s*${tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi'), '')
        .replace(/^,\s*/, '')
        .replace(/,\s*,/g, ', ')
        .trim()
    } else {
      let trimmed = currentTarget.trim()
      if (!trimmed) {
        updated = tag
      } else if (trimmed.endsWith(',')) {
        updated = `${trimmed} ${tag}`
      } else if (trimmed.endsWith('.')) {
        updated = `${trimmed.slice(0, -1)}, ${tag}.`
      } else {
        updated = `${trimmed}, ${tag}`
      }
    }

    if (generationMode === 'single') {
      setPrompt(updated)
    } else {
      setMultiPrompts((prev) => {
        const next = [...prev]
        next[activeSlotIndex] = updated
        return next
      })
    }
  }

  // Multiprompt helper functions
  const addPromptSlot = () => {
    if (multiPrompts.length >= 10) return
    const nextIdx = multiPrompts.length
    // Default next slot with a character preset or blank
    const char = characters[nextIdx % characters.length]
    setMultiPrompts([...multiPrompts, char ? char.prompt : ''])
    setActiveSlotIndex(nextIdx)
  }

  const removePromptSlot = (index: number) => {
    if (multiPrompts.length <= 1) return
    const updated = multiPrompts.filter((_, i) => i !== index)
    setMultiPrompts(updated)
    if (activeSlotIndex >= updated.length) {
      setActiveSlotIndex(updated.length - 1)
    }
  }

  const updatePromptSlot = (index: number, val: string) => {
    setMultiPrompts((prev) => {
      const next = [...prev]
      next[index] = val
      return next
    })
  }

  const fill5CharacterPresets = () => {
    const fivePrompts = DEFAULT_CHARACTERS.map((c) => c.prompt)
    setMultiPrompts(fivePrompts)
    setActiveSlotIndex(0)
  }

  const handleCopyActivePrompt = () => {
    const text = generationMode === 'single' ? prompt : multiPrompts[activeSlotIndex] || ''
    navigator.clipboard.writeText(text)
    setCopiedPromptSuccess(true)
    setTimeout(() => setCopiedPromptSuccess(false), 1500)
  }

  const setAspect = (label: string, w: number, h: number) => {
    setAspectRatio(label)
    setWidth(w)
    setHeight(h)
  }

  // Single Generate Action
  const handleGenerateSingle = async () => {
    try {
      const payload = {
        prompt,
        negative_prompt: negativePrompt,
        model,
        aspect_ratio: aspectRatio,
        width,
        height,
        steps,
        cfg,
        sampler,
        scheduler,
        seed: randomSeed ? -1 : seed,
        batch_count: batchCount
      }
      setActiveTab('canvas')
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.detail || 'Generation failed to start')
      }
    } catch (e: any) {
      alert('Error connecting to backend: ' + e.message)
    }
  }

  // Multiprompt Generate Action (Queues up to 10 sequential prompts)
  const handleGenerateMulti = async () => {
    const validPrompts = multiPrompts.map((p) => p.trim()).filter((p) => p.length > 0)
    if (validPrompts.length === 0) {
      alert('Please enter at least one non-empty prompt in the Multiprompt queue slots.')
      return
    }

    try {
      const payload = {
        prompts: validPrompts,
        negative_prompt: negativePrompt,
        model,
        aspect_ratio: aspectRatio,
        width,
        height,
        steps,
        cfg,
        sampler,
        scheduler,
        seed: randomSeed ? -1 : seed
      }
      setActiveTab('canvas')
      const res = await fetch('/api/generate-multiprompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.detail || 'Multiprompt queueing failed')
      }
    } catch (e: any) {
      alert('Error connecting to backend: ' + e.message)
    }
  }

  // Cancel currently active rendering job (queue worker moves to next)
  const handleCancel = async () => {
    try {
      await fetch('/api/cancel', { method: 'POST' })
    } catch (e) {
      console.error(e)
    }
  }

  // Cancel active job AND clear the entire waiting queue
  const handleCancelAll = async () => {
    try {
      await fetch('/api/cancel-all', { method: 'POST' })
    } catch (e) {
      console.error(e)
    }
  }

  // Quick action: Variations (randomize seed and regenerate)
  const handleGenerateVariations = () => {
    setSeed(Math.floor(Math.random() * 9999999999))
    setRandomSeed(true)
    if (generationMode === 'single') {
      handleGenerateSingle()
    } else if (generationMode === 'multiprompt') {
      handleGenerateMulti()
    } else {
      handleGenerateJsonBatch()
    }
  }

  // Launch Pose & Angle Burst Matrix (10, 50, 100 Shots)
  const handleLaunchAngleBurst = async () => {
    const currentPrompt = generationMode === 'single' ? prompt : multiPrompts[activeSlotIndex] || prompt
    if (!currentPrompt.trim()) {
      alert('Please enter or select a character prompt first.')
      return
    }

    try {
      setIsQueueingBurst(true)
      const payload = {
        prompt: currentPrompt.trim(),
        negative_prompt: negativePrompt,
        model,
        aspect_ratio: aspectRatio,
        width,
        height,
        steps,
        cfg,
        sampler,
        scheduler,
        seed: randomSeed ? -1 : seed,
        burst_count: burstCount,
        album_name: burstAlbumName.trim() || undefined
      }

      const res = await fetch('/api/generate-pose-burst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        const data = await res.json()
        setShowAngleBurstModal(false)
        setActiveTab('canvas')
        loadAlbums()
        loadGallery()
        alert(`Queued ${data.burst_count} sequential angle & pose shots in album "${data.album_name}"!`)
      } else {
        const err = await res.json()
        alert('Failed to launch angle burst: ' + (err.detail || 'Unknown error'))
      }
    } catch (e: any) {
      alert('Error launching angle burst: ' + e.message)
    } finally {
      setIsQueueingBurst(false)
    }
  }

  // JSON Batch Helpers
  const parseJsonBatch = (rawText: string) => {
    setJsonBatchRaw(rawText)
    setJsonBatchError('')
    if (!rawText.trim()) {
      setJsonBatchParsed(null)
      setJsonBatchGenerations([])
      return
    }
    try {
      const parsed = JSON.parse(rawText)
      setJsonBatchParsed(parsed)

      let gens: any[] = []
      if (Array.isArray(parsed)) {
        gens = parsed
      } else if (Array.isArray(parsed.generations)) {
        gens = parsed.generations
      } else if (Array.isArray(parsed.jobs)) {
        gens = parsed.jobs
      } else if (Array.isArray(parsed.items)) {
        gens = parsed.items
      } else {
        setJsonBatchError('JSON must contain a "generations" or "jobs" array, or be an array of objects.')
        setJsonBatchGenerations([])
        return
      }

      const validGens = gens.filter((g) => g && typeof g.prompt === 'string' && g.prompt.trim())
      if (validGens.length === 0) {
        setJsonBatchError('No valid items with non-empty "prompt" found in JSON.')
        setJsonBatchGenerations([])
        return
      }

      setJsonBatchGenerations(validGens)
      setJsonBatchStartIndex(1)
      if (parsed.album_name && typeof parsed.album_name === 'string') {
        setJsonBatchAlbumName(parsed.album_name)
      } else if (!jsonBatchAlbumName || jsonBatchAlbumName === 'Atelier Concept Showcase') {
        setJsonBatchAlbumName(`JSON Batch - ${validGens.length} Generations`)
      }
    } catch (e: any) {
      setJsonBatchError(e.message || 'Invalid JSON syntax.')
      setJsonBatchGenerations([])
    }
  }

  const handleJsonFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      parseJsonBatch(content)
    }
    reader.readAsText(file)
  }

  const handleDownloadTemplate = () => {
    const templateData = {
      album_name: "Atelier Concept Showcase",
      defaults: {
        model: "anima-turbo-v1.1-Q5_K_M.gguf",
        negative_prompt: "worst quality, low quality, blurry, deformed, bad anatomy",
        aspect_ratio: "Portrait (2:3)",
        width: 768,
        height: 1152,
        steps: 8,
        cfg: 1.0,
        sampler: "euler",
        scheduler: "sgm_uniform"
      },
      generations: [
        {
          prompt: "masterpiece, best quality, 1girl, Zaria, cyan hair, heterochromia, walking toward camera, dynamic fashion pose, white background",
          aspect_ratio: "Portrait (2:3)",
          seed: -1
        },
        {
          prompt: "masterpiece, best quality, 1girl, Nixia, silver hair, purple highlights, gothic corset, deep flat-footed squat, white background",
          aspect_ratio: "Portrait (2:3)",
          seed: -1
        },
        {
          prompt: "masterpiece, best quality, 1girl, Angela, light blue bob, amber eyes, lab coat, sitting upright with arms crossed, luxury modern office background",
          aspect_ratio: "Landscape (3:2)",
          width: 1152,
          height: 768,
          seed: -1
        },
        {
          prompt: "masterpiece, best quality, 1girl, Virelia, gentle maid, pink twin hair, kneeling seiza formal posture, cozy cafe interior, soft warm sunshine",
          aspect_ratio: "Portrait (2:3)",
          seed: -1
        },
        {
          prompt: "masterpiece, best quality, 1woman, Vivianne, tall mature kuudere, silver-white hair, lying on back looking at camera, inverted angle, white background",
          aspect_ratio: "Square (1:1)",
          width: 896,
          height: 896,
          seed: -1
        }
      ]
    }
    const blob = new Blob([JSON.stringify(templateData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'iris_batch_template.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleLoadSampleJson = async () => {
    try {
      const res = await fetch('/api/template/batch-json')
      if (res.ok) {
        const data = await res.json()
        parseJsonBatch(JSON.stringify(data, null, 2))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleGenerateJsonBatch = async () => {
    if (jsonBatchGenerations.length === 0) {
      alert('Please import or paste a valid JSON batch containing at least 1 generation.')
      return
    }

    const startFrom = Math.max(1, Math.min(jsonBatchGenerations.length, jsonBatchStartIndex || 1))
    const targetGenerations = jsonBatchGenerations.slice(startFrom - 1)

    if (targetGenerations.length === 0) {
      alert(`No generations left from index #${startFrom}.`)
      return
    }

    try {
      setIsQueueingJsonBatch(true)
      const payload = {
        album_name: jsonBatchAlbumName.trim() || undefined,
        defaults: jsonBatchParsed?.defaults || {
          model,
          negative_prompt: negativePrompt,
          aspect_ratio: aspectRatio,
          width,
          height,
          steps,
          cfg,
          sampler,
          scheduler
        },
        generations: targetGenerations
      }

      const res = await fetch('/api/generate-batch-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        const data = await res.json()
        setActiveTab('canvas')
        loadAlbums()
        loadGallery()
        const rangeNotice = startFrom > 1 ? ` (resumed from #${startFrom} of ${jsonBatchGenerations.length})` : ''
        alert(`Queued ${data.batch_count} sequential generations${rangeNotice} into album "${data.album_name}"!`)
      } else {
        const err = await res.json()
        alert('Failed to launch JSON batch: ' + (err.detail || 'Unknown error'))
      }
    } catch (e: any) {
      alert('Error launching JSON batch: ' + e.message)
    } finally {
      setIsQueueingJsonBatch(false)
    }
  }

  // Cycle through gallery in canvas with Chevrons
  const handlePrevImage = () => {
    if (gallery.length === 0) return
    const nextIdx = (displayedGalleryIndex - 1 + gallery.length) % gallery.length
    setDisplayedGalleryIndex(nextIdx)
    setSelectedItem(gallery[nextIdx])
  }

  const handleNextImage = () => {
    if (gallery.length === 0) return
    const nextIdx = (displayedGalleryIndex + 1) % gallery.length
    setDisplayedGalleryIndex(nextIdx)
    setSelectedItem(gallery[nextIdx])
  }

  // Keyboard Arrow navigation (< / > or ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return
      }

      if (e.key === 'ArrowLeft' || e.key === '<' || e.key === ',') {
        e.preventDefault()
        handlePrevImage()
      } else if (e.key === 'ArrowRight' || e.key === '>' || e.key === '.') {
        e.preventDefault()
        handleNextImage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gallery, displayedGalleryIndex, selectedItem])

  // Album actions
  const handleOpenAddToAlbum = (jobIds?: string[] | string) => {
    let targets: string[] = []
    if (typeof jobIds === 'string') {
      targets = [jobIds]
    } else if (Array.isArray(jobIds) && jobIds.length > 0) {
      targets = jobIds
    } else if (selectedJobIds.length > 0) {
      targets = selectedJobIds
    } else if (selectedItem) {
      targets = [selectedItem.job_id]
    }

    if (targets.length === 0) {
      alert('Please select at least one image to categorize into an album.')
      return
    }

    setTargetJobIdsForAlbum(targets)
    setNewAlbumInput('')
    setAlbumFeedbackMsg('')
    setShowAddToAlbumModal(true)
  }

  const handleAddTargetImagesToAlbum = async (albumId: number, albumName: string) => {
    if (targetJobIdsForAlbum.length === 0) return
    try {
      const res = await fetch(`/api/albums/${albumId}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_ids: targetJobIdsForAlbum })
      })
      if (res.ok) {
        setAlbumFeedbackMsg(`Added ${targetJobIdsForAlbum.length} image(s) to "${albumName}"!`)
        loadAlbums()
        loadGallery()
        setTimeout(() => {
          setShowAddToAlbumModal(false)
          setAlbumFeedbackMsg('')
        }, 1000)
      } else {
        const err = await res.json()
        alert('Failed to add to album: ' + (err.detail || 'Unknown error'))
      }
    } catch (e: any) {
      alert('Error adding to album: ' + e.message)
    }
  }

  const handleCreateAlbumAndAdd = async () => {
    const name = newAlbumInput.trim()
    if (!name) {
      alert('Please enter an album name.')
      return
    }
    try {
      const res = await fetch('/api/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })
      if (res.ok) {
        const created = await res.json()
        if (targetJobIdsForAlbum.length > 0) {
          await fetch(`/api/albums/${created.id}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ job_ids: targetJobIdsForAlbum })
          })
          setAlbumFeedbackMsg(`Created "${name}" and added ${targetJobIdsForAlbum.length} image(s)!`)
        } else {
          setAlbumFeedbackMsg(`Album "${name}" created!`)
        }
        loadAlbums()
        loadGallery()
        setNewAlbumInput('')
        setTimeout(() => {
          setShowAddToAlbumModal(false)
          setShowCreateAlbumModal(false)
          setAlbumFeedbackMsg('')
        }, 1000)
      } else {
        const err = await res.json()
        alert('Failed to create album: ' + (err.detail || 'Unknown error'))
      }
    } catch (e: any) {
      alert('Error creating album: ' + e.message)
    }
  }

  const handleRemoveSelectedFromCurrentAlbum = async () => {
    if (selectedAlbumId === null || selectedJobIds.length === 0) return
    const currentAlbum = albums.find((a) => a.id === selectedAlbumId)
    if (
      !confirm(
        `Remove ${selectedJobIds.length} image(s) from "${currentAlbum?.name || 'this album'}"?\n(Images will still remain safely in your main gallery)`
      )
    )
      return

    try {
      const res = await fetch(`/api/albums/${selectedAlbumId}/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_ids: selectedJobIds })
      })
      if (res.ok) {
        setSelectedJobIds([])
        loadAlbums()
        loadGallery()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeleteAlbum = async (albumId: number, albumName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (
      !confirm(
        `Are you sure you want to delete the album "${albumName}"?\n\nImages will NOT be deleted and will remain safely in your gallery.`
      )
    )
      return

    try {
      const res = await fetch(`/api/albums/${albumId}`, { method: 'DELETE' })
      if (res.ok) {
        if (selectedAlbumId === albumId) {
          setSelectedAlbumId(null)
        }
        loadAlbums()
        loadGallery()
      }
    } catch (e) {
      console.error(e)
    }
  }

  // Model Download & Import handlers
  const handleStartDownload = async () => {
    if (!downloadUrl.trim()) return
    try {
      setImportStatusMsg('Initiating download...')
      const res = await fetch('/api/models/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: downloadUrl.trim(),
          target_type: downloadType,
          filename: downloadCustomName.trim() || null,
          api_key: civitaiToken.trim() || null
        })
      })
      if (res.ok) {
        setImportStatusMsg('Download queued in background!')
        setDownloadUrl('')
        setDownloadCustomName('')
      } else {
        const err = await res.json()
        setImportStatusMsg('Error: ' + (err.detail || 'Failed to start download'))
      }
    } catch (e: any) {
      setImportStatusMsg('Error: ' + e.message)
    }
  }

  const handleImportLocal = async (pathOverride?: string, typeOverride?: string) => {
    const src = pathOverride || localSourcePath
    const type = typeOverride || localTargetType
    if (!src.trim()) return
    try {
      setImportStatusMsg('Copying model file to storage...')
      const res = await fetch('/api/models/import-local', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_path: src.trim(),
          target_type: type,
          custom_name: localCustomName.trim() || null
        })
      })
      if (res.ok) {
        setImportStatusMsg('Model imported successfully!')
        setLocalSourcePath('')
        setLocalCustomName('')
        loadModels()
      } else {
        const err = await res.json()
        setImportStatusMsg('Error: ' + (err.detail || 'Import failed'))
      }
    } catch (e: any) {
      setImportStatusMsg('Error: ' + e.message)
    }
  }

  const scanDownloadsFolder = async () => {
    try {
      setImportStatusMsg('Scanning Downloads folder...')
      const res = await fetch('/api/models/scan-downloads')
      if (res.ok) {
        const data = await res.json()
        setScannedFiles(data)
        if (data.length === 0) {
          setImportStatusMsg('No .safetensors or .gguf model files found in Downloads.')
        } else {
          setImportStatusMsg(`Found ${data.length} model file(s) in Downloads.`)
        }
      }
    } catch (e: any) {
      setImportStatusMsg('Error scanning: ' + e.message)
    }
  }

  const handleDeleteModel = async (category: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete ${filename}? This will free disk space on D:.`)) return
    try {
      const res = await fetch(`/api/models/${category}/${encodeURIComponent(filename)}`, { method: 'DELETE' })
      if (res.ok) {
        loadModels()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const cancelDownloadTask = async (id: string) => {
    try {
      await fetch(`/api/models/downloads/${id}/cancel`, { method: 'POST' })
    } catch (e) {
      console.error(e)
    }
  }

  // Reuse settings from gallery
  const reuseSettings = (item: GenerationItem) => {
    setPrompt(item.prompt)
    setNegativePrompt(item.negative_prompt)
    setModel(item.model)
    setWidth(item.width)
    setHeight(item.height)
    setSteps(item.steps)
    setCfg(item.cfg)
    setSampler(item.sampler)
    setScheduler(item.scheduler)
    setSeed(item.seed)
    setRandomSeed(false)
    setSelectedItem(item)
    setActiveTab('canvas')
  }

  const toggleFav = async (jobId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    try {
      await fetch(`/api/gallery/${jobId}/favorite`, { method: 'POST' })
      loadGallery()
      if (selectedItem && selectedItem.job_id === jobId) {
        setSelectedItem({ ...selectedItem, favorite: selectedItem.favorite ? 0 : 1 })
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (jobId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (!confirm('Are you sure you want to delete this render?')) return
    try {
      await fetch(`/api/gallery/${jobId}`, { method: 'DELETE' })
      loadGallery()
      if (selectedItem && selectedItem.job_id === jobId) {
        setSelectedItem(null)
      }
      setSelectedJobIds((prev) => prev.filter((id) => id !== jobId))
    } catch (e) {
      console.error(e)
    }
  }

  const toggleSelect = (jobId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setSelectedJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    )
  }

  const handleSelectAll = () => {
    if (gallery.length === 0) return
    if (selectedJobIds.length === gallery.length) {
      setSelectedJobIds([])
    } else {
      setSelectedJobIds(gallery.map((item) => item.job_id))
    }
  }

  const handleDownloadZip = async () => {
    if (selectedJobIds.length === 0) return
    setIsExportingZip(true)
    try {
      const res = await fetch('/api/gallery/export-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_ids: selectedJobIds })
      })
      if (!res.ok) throw new Error('Failed to generate ZIP archive')

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Iris_Atelier_Export_${Date.now()}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (e: any) {
      alert('Error downloading ZIP: ' + e.message)
    } finally {
      setIsExportingZip(false)
    }
  }

  const handleBatchDelete = async () => {
    if (selectedJobIds.length === 0) return
    const count = selectedJobIds.length
    if (
      !confirm(
        `Are you sure you want to permanently delete ${count} selected render(s)?\nThis will free disk space on D:\\AI.`
      )
    )
      return

    setIsBatchDeleting(true)
    try {
      const res = await fetch('/api/gallery/batch-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_ids: selectedJobIds })
      })
      if (res.ok) {
        setSelectedJobIds([])
        loadGallery()
        if (selectedItem && selectedJobIds.includes(selectedItem.job_id)) {
          setSelectedItem(null)
        }
      } else {
        const err = await res.json()
        alert('Delete failed: ' + (err.detail || 'Unknown error'))
      }
    } catch (e: any) {
      alert('Error deleting images: ' + e.message)
    } finally {
      setIsBatchDeleting(false)
    }
  }

  const handleShutdown = async () => {
    try {
      await fetch('/api/system/shutdown', { method: 'POST' })
      setIsShutDown(true)
      setShowShutdownModal(false)
    } catch (e) {
      setIsShutDown(true)
      setShowShutdownModal(false)
    }
  }

  const isGenerating = ['loading', 'sampling', 'decoding', 'queued'].includes(job.status)
  const progressPercent = job.total_steps > 0 ? Math.round((job.step / job.total_steps) * 100) : 0
  const activeDownloadsList = downloads.filter((d) => ['downloading', 'connecting', 'pending'].includes(d.status))

  // Determine currently displayed image on center canvas
  const currentCanvasImage = job.image_url || (selectedItem ? selectedItem.image_url : (gallery[0] ? gallery[0].image_url : null))
  const currentActiveMeta = selectedItem || (job.metadata ? {
    prompt: job.metadata.prompt,
    negative_prompt: job.metadata.negative_prompt,
    width: job.metadata.width,
    height: job.metadata.height,
    seed: job.metadata.seed,
    steps: job.metadata.steps,
    cfg: job.metadata.cfg,
    model: job.metadata.model,
    elapsed_seconds: job.elapsed,
    favorite: 0,
    job_id: job.job_id || ''
  } : null)

  const activeChar = characters.find((c) => c.id === activeCharacterId) || DEFAULT_CHARACTERS[0]

  if (isShutDown) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#151821] text-slate-100 font-sans">
        <div className="max-w-md p-8 rounded-2xl bg-[#1c212d] border border-[#2e3748] text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 mx-auto flex items-center justify-center mb-4 border border-red-500/20">
            <Power className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mb-2">Iris Atelier AI Engine Suspended</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            ComfyUI and background workers have safely terminated. GPU VRAM has been released back to Windows.
          </p>
          <div className="p-3.5 bg-[#151821] rounded-xl border border-[#2e3748] text-xs text-slate-300">
            To resume generating, launch the <span className="font-semibold text-[#8699b8]">Local Image Studio</span> shortcut on your Desktop.
          </div>
        </div>
      </div>
    )
  }

  if (isLanView) {
    return (
      <LanCompanion
        onSwitchToDesktop={() => {
          window.history.pushState({}, '', '/')
          setIsLanView(false)
        }}
      />
    )
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#151821] text-slate-100 font-sans selection:bg-[#4d6b53] selection:text-white">
      {/* ================= TOP HEADER BAR ================= */}
      <header className="h-14 border-b border-[#262d3b] bg-[#1c212d] px-4 flex items-center justify-between shrink-0 z-30 shadow-sm">
        {/* Logo & Atelier Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2a3449] to-[#1e2535] border border-[#37445e] flex items-center justify-center shadow-md shadow-black/30">
            {/* Atelier Iris Botanical Emblem */}
            <svg className="w-5 h-5 text-[#8699b8]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.5 6 4 10.5 4 15.5a8 8 0 0016 0C20 10.5 15.5 6 12 2zm0 18a5.5 5.5 0 01-5.5-5.5c0-3.3 2.8-6.7 5.5-9.8 2.7 3.1 5.5 6.5 5.5 9.8 0 3-2.5 5.5-5.5 5.5z"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg tracking-wide text-white font-medium">Iris Atelier</span>
              <span className="text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#8699b8]/15 text-[#a8bbdc] border border-[#8699b8]/30">
                ★ Zaria Edition
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-light tracking-wide italic">
              "A higher tomorrow, A wider world."
            </p>
          </div>
        </div>

        {/* System Monitor Pills & Modals Bar */}
        <div className="flex items-center gap-2.5">
          {/* Hardware Telemetry: GPU & VRAM */}
          {systemStatus?.gpu && (
            <div className="hidden sm:flex items-center gap-2 bg-[#151821] border border-[#2e3748] px-3 py-1.5 rounded-lg text-xs">
              <Cpu className="w-3.5 h-3.5 text-[#8699b8]" />
              <span className="text-slate-300 font-medium">
                {Math.round((systemStatus.gpu.vram_used_mb / 1024) * 10) / 10} /{' '}
                {Math.round(systemStatus.gpu.vram_total_mb / 1024)} GB
              </span>
              <div className="w-12 h-1.5 bg-[#262d3b] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#8699b8]"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((systemStatus.gpu.vram_used_mb / systemStatus.gpu.vram_total_mb) * 100)
                    )}%`
                  }}
                />
              </div>
              <span className="text-slate-400 text-[11px]">{systemStatus.gpu.utilization}%</span>
            </div>
          )}

          {/* Storage Telemetry: D: Free */}
          {systemStatus?.storage?.d_drive && (
            <div className="hidden md:flex items-center gap-2 bg-[#151821] border border-[#2e3748] px-3 py-1.5 rounded-lg text-xs">
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300 font-medium">D: {systemStatus.storage.d_drive.free_gb} GB</span>
            </div>
          )}

          {/* LAN Wi-Fi Broadcast Pill */}
          <button
            type="button"
            onClick={() => {
              fetchLanStatus()
              setShowLanModal(true)
            }}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition font-medium border shadow-sm ${
              lanStatus.enabled
                ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : 'bg-[#222836] hover:bg-[#2a3243] text-slate-400 border-[#2e3748]'
            }`}
            title={lanStatus.enabled ? "LAN Broadcast Active - Click for QR code & mobile companion" : "LAN Sharing is OFF - Click to enable"}
          >
            {lanStatus.enabled ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">LAN Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">LAN Off</span>
              </>
            )}
          </button>

          {/* Models & Importer Modal Button */}
          <button
            onClick={() => {
              setShowModelModal(true)
              setImportStatusMsg('')
            }}
            className="flex items-center gap-1.5 text-xs bg-[#222836] hover:bg-[#2a3243] text-[#8699b8] hover:text-white border border-[#2e3748] px-3 py-1.5 rounded-lg transition font-medium relative shadow-sm"
            title="Import or Download Base Models"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Models & Importer</span>
            {activeDownloadsList.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#8699b8] animate-ping absolute -top-0.5 -right-0.5" />
            )}
          </button>

          {/* ComfyUI Graph Link */}
          <a
            href="http://127.0.0.1:8188"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs bg-[#222836] hover:bg-[#2a3243] text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-[#2e3748] transition"
            title="Open Advanced ComfyUI Graph"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-300" />
            <span>Graph</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {/* Turn Off / Power Button */}
          <button
            onClick={() => setShowShutdownModal(true)}
            className="flex items-center gap-1.5 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg transition font-medium"
            title="Turn Off AI Engine"
          >
            <Power className="w-3.5 h-3.5" />
            <span>Turn Off</span>
          </button>
        </div>
      </header>

      {/* ================= MAIN DASHBOARD (DOCK + 3 COLUMNS) ================= */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Dock (Far Left Vertical Bar) */}
        <aside className="w-14 bg-[#181d27] border-r border-[#262d3b] flex flex-col items-center py-3 justify-between shrink-0 z-20">
          <div className="flex flex-col items-center gap-3">
            {/* Dock Emblem */}
            <div className="w-9 h-9 rounded-lg bg-[#222836] border border-[#2e3748] flex items-center justify-center text-[#8699b8]">
              <Sparkles className="w-4 h-4" />
            </div>

            <div className="w-6 h-[1px] bg-[#262d3b] my-1" />

            {/* Studio / Generation Canvas Toggle */}
            <button
              onClick={() => {
                setActiveTab('canvas')
                setNavSection('studio')
              }}
              className={`p-2.5 rounded-xl transition ${
                activeTab === 'canvas'
                  ? 'bg-[#4d6b53]/20 text-[#a3c9aa] border border-[#4d6b53]/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#222836]'
              }`}
              title="Studio & Generation Canvas"
            >
              <Wand2 className="w-4 h-4" />
            </button>

            {/* Full Gallery Tab Toggle */}
            <button
              onClick={() => {
                setActiveTab('gallery')
                setNavSection('gallery')
              }}
              className={`p-2.5 rounded-xl transition relative ${
                activeTab === 'gallery'
                  ? 'bg-[#8699b8]/20 text-[#a8bbdc] border border-[#8699b8]/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#222836]'
              }`}
              title="Full Gallery & Archive"
            >
              <ImageIcon className="w-4 h-4" />
              {gallery.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#8699b8]" />
              )}
            </button>

            {/* Characters Modal Trigger */}
            <button
              onClick={() => setShowCharacterModal(true)}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#222836] transition"
              title="Character Templates"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Models Importer Modal Trigger */}
            <button
              onClick={() => setShowModelModal(true)}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#222836] transition relative"
              title="Base Models & Importer"
            >
              <FolderPlus className="w-4 h-4" />
              {activeDownloadsList.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
              )}
            </button>
          </div>

          {/* Bottom Dock Action */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => setShowShutdownModal(true)}
              className="p-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
              title="Power Off AI Generation"
            >
              <Power className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* ================= COLUMN 1: GENERATION CONTROLS (LEFT PANEL) ================= */}
        <aside className="w-[390px] border-r border-[#262d3b] bg-[#1c212d] flex flex-col shrink-0 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Character Edition Banner & Quick Switcher */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-[#222836] to-[#1c212d] border border-[#2e3748] shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8699b8] ring-4 ring-[#8699b8]/20" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-serif font-bold text-white tracking-wide">
                      {activeChar.name} Edition
                    </span>
                    <span className="text-[10px] text-[#8699b8] bg-[#8699b8]/10 px-1.5 py-0.2 rounded border border-[#8699b8]/20">
                      Active
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate max-w-[190px]">
                    {activeChar.tagline || 'Editorial Atelier Character'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowCharacterModal(true)}
                  className="text-[11px] text-[#8699b8] hover:text-[#a8bbdc] bg-[#151821] hover:bg-[#222836] px-2.5 py-1 rounded-md border border-[#2e3748] transition font-medium"
                >
                  Switch
                </button>
              </div>
            </div>

            {/* Mode Switcher: Single Prompt vs Multiprompt Queue vs JSON Batch */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Generation Mode</label>
                <span className="text-[10px] text-slate-400">
                  {generationMode === 'single'
                    ? 'Single Prompt'
                    : generationMode === 'multiprompt'
                    ? `${multiPrompts.length}/10 Queued Prompts`
                    : `${jsonBatchGenerations.length} Detected from JSON`}
                </span>
              </div>
              <div className="grid grid-cols-3 p-1 rounded-xl bg-[#151821] border border-[#262d3b] gap-1">
                <button
                  type="button"
                  onClick={() => setGenerationMode('single')}
                  className={`py-1.5 text-xs font-medium rounded-lg transition flex items-center justify-center gap-1.5 ${
                    generationMode === 'single'
                      ? 'bg-[#222836] text-white shadow-sm border border-[#2e3748]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#8699b8]" />
                  <span>Single</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGenerationMode('multiprompt')}
                  className={`py-1.5 text-xs font-medium rounded-lg transition flex items-center justify-center gap-1.5 ${
                    generationMode === 'multiprompt'
                      ? 'bg-[#222836] text-white shadow-sm border border-[#2e3748]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ListOrdered className="w-3.5 h-3.5 text-[#a3c9aa]" />
                  <span>Multi (10)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGenerationMode('json_batch')
                    if (!jsonBatchRaw) {
                      handleLoadSampleJson()
                    }
                  }}
                  className={`py-1.5 text-xs font-medium rounded-lg transition flex items-center justify-center gap-1.5 ${
                    generationMode === 'json_batch'
                      ? 'bg-[#222836] text-white shadow-sm border border-[#2e3748]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-amber-400" />
                  <span>JSON Batch</span>
                </button>
              </div>
            </div>

            {/* Scene & Atmosphere Enhancers */}
            <div className="border border-[#262d3b] bg-[#151821] rounded-xl p-3 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowQuickTags(!showQuickTags)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition"
                >
                  <Tag className="w-3.5 h-3.5 text-[#8699b8]" />
                  <span>Scene & Atmosphere Enhancers</span>
                  {showQuickTags ? (
                    <ChevronUp className="w-3 h-3 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  )}
                </button>
                <div className="flex items-center gap-1 text-[10px]">
                  {(['all', 'scene', 'lighting', 'shot', 'style'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setShowQuickTags(true)
                        setActiveQuickCategory(cat)
                      }}
                      className={`px-1.5 py-0.5 rounded uppercase font-medium transition ${
                        activeQuickCategory === cat && showQuickTags
                          ? 'bg-[#8699b8]/20 text-[#a8bbdc] border border-[#8699b8]/40'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {showQuickTags && (
                <div className="flex flex-wrap gap-1.5 pt-1 max-h-32 overflow-y-auto pr-1">
                  {QUICK_TAGS.filter(
                    (t) => activeQuickCategory === 'all' || t.category === activeQuickCategory
                  ).map((t) => {
                    const currentTarget =
                      generationMode === 'single' ? prompt : multiPrompts[activeSlotIndex] || ''
                    const isSelected = currentTarget.toLowerCase().includes(t.tag.toLowerCase())
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleQuickTag(t.tag)}
                        title={isSelected ? `Click to remove: ${t.tag}` : `Click to add: ${t.tag}`}
                        className={`text-[11px] px-2.5 py-1 rounded-md border transition flex items-center gap-1 ${
                          isSelected
                            ? 'bg-[#4d6b53]/25 border-[#4d6b53] text-[#a3c9aa] font-medium'
                            : 'bg-[#1c212d] border-[#2e3748] text-slate-300 hover:text-white hover:border-[#8699b8]/50'
                        }`}
                      >
                        <span>{t.label}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#a3c9aa]" />}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Prompt Input Section: Single Mode vs Multiprompt Mode */}
            {generationMode === 'single' ? (
              /* Single Prompt Box */
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-slate-300">Positive Prompt</label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {prompt.length} chars
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyActivePrompt}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition"
                    >
                      {copiedPromptSuccess ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-medium">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrompt('')}
                      className="text-[11px] text-slate-500 hover:text-slate-300 transition"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={8}
                  placeholder="Describe character, outfit, pose, expression, lighting, background..."
                  className="w-full bg-[#151821] border border-[#262d3b] rounded-xl p-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#8699b8] transition resize-y min-h-[160px] leading-relaxed shadow-inner"
                />
              </div>
            ) : generationMode === 'multiprompt' ? (
              /* Multiprompt Mode (Up to 10 sequential prompt slots A-J) */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Sequential Prompts Queue ({multiPrompts.length}/10)
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={fill5CharacterPresets}
                      className="text-[10px] text-[#8699b8] hover:text-white bg-[#151821] px-2 py-0.5 rounded border border-[#2e3748] transition"
                      title="Instantly load Nixia, Angela, Virelia, Vivianne, Zaria into slots 1-5"
                    >
                      Load 5 Characters
                    </button>
                    <button
                      type="button"
                      onClick={() => setMultiPrompts([''])}
                      className="text-[10px] text-slate-500 hover:text-slate-300 transition"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Prompt Slots List */}
                <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                  {multiPrompts.map((pText, idx) => {
                    const letter = PROMPT_SLOT_LETTERS[idx] || `${idx + 1}`
                    const isFocused = activeSlotIndex === idx
                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveSlotIndex(idx)}
                        className={`p-2.5 rounded-xl border transition cursor-pointer ${
                          isFocused
                            ? 'bg-[#151821] border-[#8699b8] shadow-sm shadow-[#8699b8]/10'
                            : 'bg-[#151821]/80 border-[#262d3b] hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-md bg-[#222836] border border-[#2e3748] flex items-center justify-center text-[10px] font-bold text-[#8699b8]">
                              {letter}
                            </span>
                            <span className="text-xs font-semibold text-white">
                              Prompt {idx + 1} ({letter})
                            </span>
                            {isFocused && (
                              <span className="text-[9px] text-[#a3c9aa] bg-[#4d6b53]/20 px-1.5 py-0.2 rounded border border-[#4d6b53]/40">
                                Active Target
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            {multiPrompts.length > 1 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removePromptSlot(idx)
                                }}
                                className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                                title="Remove this prompt slot"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>

                        <textarea
                          value={pText}
                          onChange={(e) => updatePromptSlot(idx, e.target.value)}
                          rows={6}
                          placeholder={`Enter Prompt ${idx + 1} (${letter})...`}
                          className="w-full bg-[#1c212d] border border-[#262d3b] rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#8699b8] transition resize-y min-h-[120px] leading-relaxed"
                        />
                      </div>
                    )
                  })}
                </div>

                {/* Add Slot Button (Up to 10) */}
                {multiPrompts.length < 10 && (
                  <button
                    type="button"
                    onClick={addPromptSlot}
                    className="w-full py-2 px-3 rounded-xl bg-[#151821] hover:bg-[#222836] border border-[#2e3748] hover:border-[#8699b8]/50 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#8699b8]" />
                    <span>+ Add Next Prompt Slot ({multiPrompts.length + 1}/10)</span>
                  </button>
                )}
              </div>
            ) : (
              /* JSON Batch Mode Panel */
              <div className="space-y-3">
                {/* Header Actions: Template Download & Sample */}
                <div className="flex items-center justify-between pb-1 border-b border-[#262d3b]">
                  <div className="flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-semibold text-slate-200">Import Batch JSON</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleLoadSampleJson}
                      className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-[#1c212d] hover:bg-[#222836] border border-[#2e3748] transition"
                    >
                      Load Sample
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadTemplate}
                      className="text-[10px] text-amber-300 hover:text-amber-200 px-2.5 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 flex items-center gap-1 transition"
                      title="Download iris_batch_template.json"
                    >
                      <FileDown className="w-3 h-3" />
                      <span>Template</span>
                    </button>
                  </div>
                </div>

                {/* Sub-mode Switcher: Upload File vs Paste JSON */}
                <div className="flex rounded-lg bg-[#151821] p-0.5 border border-[#262d3b] text-xs">
                  <button
                    type="button"
                    onClick={() => setJsonBatchInputMode('upload')}
                    className={`flex-1 py-1 rounded text-center transition flex items-center justify-center gap-1.5 ${
                      jsonBatchInputMode === 'upload'
                        ? 'bg-[#222836] text-white shadow-sm font-medium'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload .json File</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setJsonBatchInputMode('paste')}
                    className={`flex-1 py-1 rounded text-center transition flex items-center justify-center gap-1.5 ${
                      jsonBatchInputMode === 'paste'
                        ? 'bg-[#222836] text-white shadow-sm font-medium'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FileCode className="w-3 h-3" />
                    <span>Paste / Edit Code</span>
                  </button>
                </div>

                {/* File Upload Zone */}
                {jsonBatchInputMode === 'upload' ? (
                  <div className="relative border-2 border-dashed border-[#2e3748] hover:border-[#8699b8]/60 rounded-xl p-5 text-center bg-[#151821] hover:bg-[#181d27] transition group cursor-pointer">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleJsonFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Upload className="w-6 h-6 text-[#8699b8] group-hover:text-amber-400 mx-auto mb-2 transition" />
                    <p className="text-xs font-semibold text-white mb-0.5">Drop your batch .json here</p>
                    <p className="text-[11px] text-slate-400">or click to browse from computer</p>
                  </div>
                ) : (
                  <div>
                    <textarea
                      value={jsonBatchRaw}
                      onChange={(e) => parseJsonBatch(e.target.value)}
                      rows={7}
                      placeholder='Paste JSON here (e.g. { "generations": [ { "prompt": "..." } ] })'
                      className="w-full bg-[#151821] border border-[#262d3b] rounded-xl p-2.5 font-mono text-[11px] text-white placeholder-slate-600 focus:outline-none focus:border-[#8699b8] transition resize-y min-h-[140px]"
                    />
                  </div>
                )}

                {/* Error Banner */}
                {jsonBatchError && (
                  <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="line-clamp-2">{jsonBatchError}</span>
                  </div>
                )}

                {/* Detection Summary & Album Name */}
                {jsonBatchGenerations.length > 0 && (
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="font-semibold">Detected {jsonBatchGenerations.length} Generations</span>
                      </div>
                      <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded font-mono">
                        Ready to Queue
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Target Album Name
                        </label>
                        <span className="text-[10px] text-slate-400">Auto-organizes in gallery</span>
                      </div>
                      <input
                        type="text"
                        value={jsonBatchAlbumName}
                        onChange={(e) => setJsonBatchAlbumName(e.target.value)}
                        placeholder="Album name..."
                        className="w-full bg-[#151821] border border-[#262d3b] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#8699b8] transition"
                      />
                    </div>

                    {/* Resume / Start From Item # */}
                    <div className="bg-[#151821] border border-[#262d3b] p-2.5 rounded-xl text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                          <span>Start / Resume From Item #</span>
                        </label>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-slate-500 font-mono">#</span>
                          <input
                            type="number"
                            min={1}
                            max={jsonBatchGenerations.length}
                            value={jsonBatchStartIndex}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1
                              setJsonBatchStartIndex(Math.max(1, Math.min(jsonBatchGenerations.length, val)))
                            }}
                            className="w-16 bg-[#1c212d] border border-[#2e3748] rounded-lg px-2 py-1 text-xs text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400 text-center"
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {jsonBatchStartIndex > 1
                          ? `Will skip #1–#${jsonBatchStartIndex - 1} and queue ${
                              jsonBatchGenerations.length - jsonBatchStartIndex + 1
                            } remaining items (#${jsonBatchStartIndex} to #${jsonBatchGenerations.length}).`
                          : `Queueing all ${jsonBatchGenerations.length} items from start.`}
                      </p>
                    </div>

                    {/* Detected Generations Preview List */}
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Preview Detected Queue ({jsonBatchGenerations.length})
                      </label>
                      <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                        {jsonBatchGenerations.map((g, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-lg bg-[#151821] border border-[#262d3b] text-left text-xs"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono text-[10px] font-bold text-amber-400">#{idx + 1}</span>
                              <div className="flex items-center gap-1 text-[10px]">
                                {g.aspect_ratio && (
                                  <span className="px-1.5 py-0.2 rounded bg-[#222836] text-slate-300 border border-[#2e3748]">
                                    {g.aspect_ratio}
                                  </span>
                                )}
                                <span className="px-1.5 py-0.2 rounded bg-[#222836] text-slate-400 font-mono">
                                  {g.seed && g.seed > 0 ? `Seed: ${g.seed}` : 'Random Seed'}
                                </span>
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                              {g.prompt}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Negative Prompt */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Negative Prompt</label>
                <div className="flex items-center gap-1 text-[10px]">
                  {NEGATIVE_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setNegativePrompt(p.value)}
                      className={`px-1.5 py-0.5 rounded border transition ${
                        negativePrompt === p.value
                          ? 'border-[#8699b8] bg-[#8699b8]/15 text-[#a8bbdc] font-medium'
                          : 'border-[#262d3b] bg-[#151821] text-slate-400 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setNegativePrompt('')}
                    className="text-slate-500 hover:text-slate-300 ml-1"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <textarea
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                rows={2}
                placeholder="Elements to avoid in generation..."
                className="w-full bg-[#151821] border border-[#262d3b] rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#8699b8] transition resize-none leading-relaxed"
              />
            </div>

            {/* 2x2 Visual Aspect Ratio Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Aspect Ratio</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setAspect('Portrait Lite (768×1152)', 768, 1152)}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                    width === 768 && height === 1152
                      ? 'border-[#8699b8] bg-[#8699b8]/10 text-white shadow-sm ring-1 ring-[#8699b8]/30'
                      : 'border-[#262d3b] bg-[#151821] text-slate-400 hover:text-white hover:border-slate-600'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white">Portrait</div>
                    <div className="text-[10px] text-slate-500">768 × 1152 (2:3)</div>
                  </div>
                  <div className="w-3.5 h-5 border border-current rounded-sm shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => setAspect('Portrait HD (832×1216)', 832, 1216)}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                    width === 832 && height === 1216
                      ? 'border-[#8699b8] bg-[#8699b8]/10 text-white shadow-sm ring-1 ring-[#8699b8]/30'
                      : 'border-[#262d3b] bg-[#151821] text-slate-400 hover:text-white hover:border-slate-600'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white">Portrait HD</div>
                    <div className="text-[10px] text-slate-500">832 × 1216</div>
                  </div>
                  <div className="w-3.5 h-5 border border-current rounded-sm shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => setAspect('Square (1024×1024)', 1024, 1024)}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                    width === 1024 && height === 1024
                      ? 'border-[#8699b8] bg-[#8699b8]/10 text-white shadow-sm ring-1 ring-[#8699b8]/30'
                      : 'border-[#262d3b] bg-[#151821] text-slate-400 hover:text-white hover:border-slate-600'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white">Square</div>
                    <div className="text-[10px] text-slate-500">1024 × 1024 (1:1)</div>
                  </div>
                  <div className="w-4 h-4 border border-current rounded-sm shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => setAspect('Landscape (1216×832)', 1216, 832)}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                    width === 1216 && height === 832
                      ? 'border-[#8699b8] bg-[#8699b8]/10 text-white shadow-sm ring-1 ring-[#8699b8]/30'
                      : 'border-[#262d3b] bg-[#151821] text-slate-400 hover:text-white hover:border-slate-600'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white">Landscape</div>
                    <div className="text-[10px] text-slate-500">1216 × 832 (3:2)</div>
                  </div>
                  <div className="w-5 h-3.5 border border-current rounded-sm shrink-0" />
                </button>
              </div>
            </div>

            {/* Seed Control with Dice & Randomize toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Seed</label>
                <label className="text-[11px] text-slate-400 flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={randomSeed}
                    onChange={(e) => setRandomSeed(e.target.checked)}
                    className="rounded bg-[#151821] border-[#2e3748] text-[#4d6b53] focus:ring-0"
                  />
                  <span>Randomize Seed</span>
                </label>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  disabled={randomSeed}
                  value={seed >= 0 ? seed : ''}
                  onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
                  placeholder={randomSeed ? 'Random seed generated at runtime' : 'Enter specific seed'}
                  className={`w-full bg-[#151821] border border-[#262d3b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8699b8] transition ${
                    randomSeed ? 'opacity-50 cursor-not-allowed text-slate-500' : ''
                  }`}
                />
                {!randomSeed && (
                  <button
                    type="button"
                    onClick={() => setSeed(Math.floor(Math.random() * 9999999999))}
                    className="p-2 bg-[#222836] hover:bg-[#2a3243] text-slate-300 rounded-xl border border-[#2e3748] transition"
                    title="Generate new random seed"
                  >
                    <Dices className="w-4 h-4 text-[#8699b8]" />
                  </button>
                )}
              </div>
            </div>

            {/* Advanced Settings Accordion */}
            <div className="border-t border-[#262d3b] pt-3">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-white transition py-1"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <Sliders className="w-3.5 h-3.5 text-[#8699b8]" />
                  Advanced Atelier Parameters
                </span>
                <span className="text-xs">{showAdvanced ? '▲' : '▼'}</span>
              </button>

              {showAdvanced && (
                <div className="mt-3 space-y-3 bg-[#151821] p-3 rounded-xl border border-[#262d3b]">
                  {/* Model Selector */}
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Base Diffusion Model</label>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full bg-[#1c212d] border border-[#2e3748] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#8699b8] transition truncate"
                    >
                      {installedModels.length === 0 ? (
                        <option value="anima-turbo-v1.1-Q5_K_M.gguf">Loading models...</option>
                      ) : (
                        installedModels.map((m) => (
                          <option key={m.filename} value={m.filename}>
                            {m.type === 'gguf' ? '⚡ [GGUF]' : '📦 [Checkpoint]'} {m.filename} ({m.size_gb} GB)
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* Sampling Steps */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Sampling Steps</span>
                      <span className="text-white font-mono">{steps}</span>
                    </div>
                    <input
                      type="range"
                      min={4}
                      max={30}
                      step={1}
                      value={steps}
                      onChange={(e) => setSteps(parseInt(e.target.value))}
                      className="w-full accent-[#4d6b53]"
                    />
                  </div>

                  {/* CFG Scale */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>CFG Scale</span>
                      <span className="text-white font-mono">{cfg.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min={1.0}
                      max={8.0}
                      step={0.5}
                      value={cfg}
                      onChange={(e) => setCfg(parseFloat(e.target.value))}
                      className="w-full accent-[#4d6b53]"
                    />
                  </div>

                  {/* Sampler & Scheduler */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Sampler</label>
                      <select
                        value={sampler}
                        onChange={(e) => setSampler(e.target.value)}
                        className="w-full bg-[#1c212d] border border-[#2e3748] rounded px-2 py-1 text-xs text-white"
                      >
                        <option value="euler">Euler</option>
                        <option value="euler_ancestral">Euler A</option>
                        <option value="dpmpp_2m">DPM++ 2M</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Scheduler</label>
                      <select
                        value={scheduler}
                        onChange={(e) => setScheduler(e.target.value)}
                        className="w-full bg-[#1c212d] border border-[#2e3748] rounded px-2 py-1 text-xs text-white"
                      >
                        <option value="sgm_uniform">SGM Uniform</option>
                        <option value="normal">Normal</option>
                        <option value="karras">Karras</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Generate Button Rail */}
          <div className="mt-auto p-4 border-t border-[#262d3b] bg-[#1c212d] space-y-3">
            {/* If in Single Mode: Batch Count Pills */}
            {generationMode === 'single' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-300">Images</span>
                  <span className="text-[10px] text-[#a3c9aa] bg-[#4d6b53]/20 px-1.5 py-0.5 rounded border border-[#4d6b53]/40 font-medium">
                    Sequential Safe
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 8].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setBatchCount(num)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                        batchCount === num
                          ? 'bg-[#4d6b53] text-white border-[#5c7f63] shadow-sm shadow-[#4d6b53]/40'
                          : 'bg-[#151821] text-slate-400 border-[#262d3b] hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons: Running Progress vs Idle Trigger */}
            {isGenerating ? (
              <div className="space-y-2">
                {/* Active progress summary in left dock */}
                <div className="bg-[#151821] border border-[#262d3b] rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#8699b8] flex items-center gap-1.5 truncate">
                      <span className="w-2 h-2 rounded-full bg-[#8699b8] animate-pulse shrink-0" />
                      <span className="truncate">
                        {job.batch_total && job.batch_total > 1
                          ? `Processing [${job.batch_index || 1}/${job.batch_total}]`
                          : 'Rendering in GPU...'}
                      </span>
                    </span>
                    {(job.queue_size || 0) > 0 && (
                      <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-medium shrink-0">
                        {job.queue_size} queued
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-[#1c212d] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#4d6b53] to-[#8699b8] h-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="text-[11px] text-slate-400 truncate font-mono">
                    {job.message || `Step ${job.step}/${job.total_steps} (${progressPercent}%)`}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium text-xs flex items-center justify-center gap-1.5 transition"
                    title="Skip current render and move to next"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Skip Current</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelAll}
                    className="py-2 px-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 font-medium text-xs flex items-center justify-center gap-1.5 transition"
                    title="Cancel active rendering and clear entire queue"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Cancel All</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={
                    generationMode === 'single'
                      ? handleGenerateSingle
                      : generationMode === 'multiprompt'
                      ? handleGenerateMulti
                      : handleGenerateJsonBatch
                  }
                  disabled={generationMode === 'json_batch' && jsonBatchGenerations.length === 0}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-[#4d6b53] hover:bg-[#5c7f63] text-white font-semibold text-sm shadow-lg shadow-[#4d6b53]/25 flex items-center justify-center gap-2 transition active:scale-[0.99] border border-[#5c7f63]/50 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>
                    {generationMode === 'single'
                      ? batchCount === 1
                        ? 'Generate Image'
                        : `Queue ${batchCount} Images (Sequential)`
                      : generationMode === 'multiprompt'
                      ? `Queue ${multiPrompts.filter((p) => p.trim()).length} Prompts (Sequential)`
                      : jsonBatchStartIndex > 1
                      ? `Queue ${jsonBatchGenerations.length - jsonBatchStartIndex + 1} JSON Generations (from #${jsonBatchStartIndex})`
                      : `Queue ${jsonBatchGenerations.length} JSON Generations (Sequential)`}
                  </span>
                </button>

                {/* Disguised Angle & Pose Matrix Trigger Icon */}
                <button
                  type="button"
                  onClick={() => {
                    const currentPrompt = generationMode === 'single' ? prompt : multiPrompts[activeSlotIndex] || prompt
                    const firstFew = currentPrompt.trim().split(/\s+/).slice(0, 3).join(' ').replace(/[,.]/g, '')
                    setBurstAlbumName(`${firstFew || 'Character'} - ${burstCount} Angles`)
                    setShowAngleBurstModal(true)
                  }}
                  className="h-[48px] px-3.5 rounded-xl bg-[#222836] hover:bg-[#2a3243] text-indigo-300 hover:text-white border border-[#2e3748] hover:border-indigo-400/50 transition shadow-md flex items-center justify-center group relative"
                  title="Angle & Pose Matrix (10, 50, 100 Shots)"
                >
                  <Camera className="w-5 h-5 text-indigo-300 group-hover:scale-110 transition duration-200" />
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                  </span>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* ================= COLUMN 2: CENTER GENERATION CANVAS ================= */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#151821] border-r border-[#262d3b]">
          {/* Subheader: Canvas vs Gallery Mode Tabs */}
          <div className="h-12 border-b border-[#262d3b] px-6 flex items-center justify-between shrink-0 bg-[#181d27]">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('canvas')}
                className={`text-xs font-semibold py-3 border-b-2 transition flex items-center gap-2 ${
                  activeTab === 'canvas'
                    ? 'border-[#8699b8] text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#8699b8]" />
                <span>Generation Canvas</span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`text-xs font-semibold py-3 border-b-2 transition flex items-center gap-2 ${
                  activeTab === 'gallery'
                    ? 'border-[#8699b8] text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-indigo-300" />
                <span>Full Archive & Gallery ({gallery.length})</span>
              </button>
            </div>

            {/* Gallery Search & Multi-Select Bar (When activeTab === 'gallery') */}
            {activeTab === 'gallery' && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={gallerySearch}
                    onChange={(e) => setGallerySearch(e.target.value)}
                    placeholder="Search prompts..."
                    className="bg-[#1c212d] border border-[#2e3748] rounded-lg pl-8 pr-3 py-1 text-xs text-white focus:outline-none focus:border-[#8699b8] w-44"
                  />
                </div>
                <button
                  onClick={() => setFavoritesOnly(!favoritesOnly)}
                  className={`p-1.5 rounded-lg border text-xs transition ${
                    favoritesOnly
                      ? 'bg-red-500/20 border-red-500/50 text-red-400'
                      : 'bg-[#1c212d] border-[#2e3748] text-slate-400 hover:text-white'
                  }`}
                  title="Filter favorites"
                >
                  <Heart className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-current' : ''}`} />
                </button>

                <div className="h-4 w-[1px] bg-[#262d3b] mx-0.5" />

                <button
                  type="button"
                  onClick={handleSelectAll}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition flex items-center gap-1.5 ${
                    selectedJobIds.length === gallery.length && gallery.length > 0
                      ? 'bg-[#8699b8]/20 border-[#8699b8] text-[#a8bbdc]'
                      : 'bg-[#1c212d] border-[#2e3748] text-slate-300 hover:text-white'
                  }`}
                >
                  {selectedJobIds.length === gallery.length && gallery.length > 0 ? (
                    <>
                      <CheckCheck className="w-3.5 h-3.5 text-[#8699b8]" />
                      <span>Deselect All</span>
                    </>
                  ) : (
                    <>
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>Select All</span>
                    </>
                  )}
                </button>

                {selectedJobIds.length > 0 && (
                  <div className="flex items-center gap-1.5 pl-1.5 border-l border-[#262d3b]">
                    <span className="text-[11px] font-semibold text-[#8699b8] bg-[#8699b8]/10 px-2 py-0.5 rounded border border-[#8699b8]/20">
                      {selectedJobIds.length} selected
                    </span>

                    {/* Add to Album Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenAddToAlbum()}
                      className="px-2.5 py-1 rounded-lg bg-[#8699b8]/20 hover:bg-[#8699b8]/30 text-[#a8bbdc] border border-[#8699b8]/40 text-xs font-semibold flex items-center gap-1.5 transition"
                      title="Add selected images to an album"
                    >
                      <FolderPlus className="w-3.5 h-3.5 text-[#8699b8]" />
                      <span>Add to Album</span>
                    </button>

                    {/* If viewing a specific album: Remove from Album Button */}
                    {selectedAlbumId !== null && (
                      <button
                        type="button"
                        onClick={handleRemoveSelectedFromCurrentAlbum}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                        title="Remove from this album (images remain in gallery)"
                      >
                        <Folder className="w-3.5 h-3.5" />
                        <span>Remove from Album</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleDownloadZip}
                      disabled={isExportingZip}
                      className="px-2.5 py-1 rounded-lg bg-[#4d6b53] hover:bg-[#5c7f63] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span>{isExportingZip ? 'Zipping...' : 'Download ZIP'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBatchDelete}
                      disabled={isBatchDeleting}
                      className="px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isBatchDeleting ? 'Deleting...' : 'Delete'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedJobIds([])}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#222836] transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Canvas View */}
          {activeTab === 'canvas' && (
            <div className="flex-1 flex flex-col p-6 overflow-hidden items-center justify-between">
              {/* Framed Image Canvas Box */}
              <div className="relative flex-1 w-full max-w-4xl rounded-2xl border border-[#2e3748] bg-[#1c212d]/90 shadow-2xl overflow-hidden flex items-center justify-center p-4">
                {/* Canvas Floating Top Controls: Chevrons & Zoom */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="p-2 rounded-xl bg-black/60 hover:bg-black text-slate-300 hover:text-white backdrop-blur border border-white/10 transition shadow-lg"
                    title="Previous Image (Keyboard: ◄ or <)"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="p-2 rounded-xl bg-black/60 hover:bg-black text-slate-300 hover:text-white backdrop-blur border border-white/10 transition shadow-lg"
                    title="Next Image (Keyboard: ► or >)"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  {gallery.length > 0 && (
                    <span className="px-2.5 py-1 rounded-xl bg-black/60 text-slate-300 backdrop-blur border border-white/10 text-xs font-mono flex items-center gap-1.5 shadow-lg">
                      <span>{displayedGalleryIndex + 1} / {gallery.length}</span>
                      <span className="text-[10px] text-slate-400 border-l border-white/20 pl-1.5 hidden sm:inline" title="Press ◄ or ► to shuffle images">◄ / ►</span>
                    </span>
                  )}
                </div>

                <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCanvasZoom(canvasZoom === 'fit' ? '100%' : 'fit')}
                    className="px-2.5 py-1.5 rounded-xl bg-black/60 hover:bg-black text-slate-300 hover:text-white backdrop-blur border border-white/10 transition text-xs font-medium"
                    title="Toggle Zoom"
                  >
                    {canvasZoom === 'fit' ? 'Fit Screen' : '100%'}
                  </button>
                  {currentCanvasImage && (
                    <a
                      href={currentCanvasImage}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-black/60 hover:bg-black text-slate-300 hover:text-white backdrop-blur border border-white/10 transition"
                      title="Open Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Canvas Center Image Display */}
                {isGenerating ? (
                  /* Generating Live Indicator */
                  <div className="flex flex-col items-center justify-center p-8 text-center max-w-md">
                    {/* Radial Progress Ring */}
                    <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          stroke="#262d3b"
                          strokeWidth="7"
                          fill="transparent"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          stroke="#4d6b53"
                          strokeWidth="7"
                          strokeDasharray={264}
                          strokeDashoffset={264 - (264 * progressPercent) / 100}
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-300"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-serif font-bold text-white font-mono">
                          {progressPercent}%
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Step {job.step}/{job.total_steps}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-serif text-lg font-medium text-white mb-1">
                      {job.batch_total && job.batch_total > 1
                        ? `Sampling Prompt [${job.batch_index || 1}/${job.batch_total}]`
                        : job.message || 'Sampling Diffusion Model...'}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mb-4">
                      Elapsed: {job.elapsed}s • Active RTX 3050 Runner
                    </p>

                    <div className="w-full bg-[#151821] rounded-xl p-3 text-left border border-[#2e3748] space-y-1">
                      <div className="text-[11px] text-slate-400 truncate">
                        <span className="text-slate-500">Model:</span> {model}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        <span className="text-slate-500">Size:</span> {width} × {height} ({aspectRatio})
                      </div>
                    </div>
                  </div>
                ) : currentCanvasImage ? (
                  /* Rendered Image */
                  <div className="relative max-h-full max-w-full flex items-center justify-center overflow-auto">
                    <img
                      src={currentCanvasImage}
                      alt="Atelier Render"
                      className={`object-contain rounded-xl shadow-2xl transition duration-200 ${
                        canvasZoom === 'fit' ? 'max-h-[calc(100vh-230px)] max-w-full' : 'max-h-none'
                      }`}
                    />
                  </div>
                ) : (
                  /* Atelier Ready State */
                  <div className="flex flex-col items-center text-center max-w-md p-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#222836] border border-[#2e3748] flex items-center justify-center mx-auto mb-4 text-[#8699b8] shadow-inner">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-serif font-medium text-white mb-1">
                      Iris Atelier Studio
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-5">
                      Select your character archetype or enter your custom vision on the left panel, then hit{' '}
                      <strong className="text-[#a3c9aa]">Generate Image</strong> or enqueue a Multiprompt batch.
                    </p>
                    <button
                      type="button"
                      onClick={
                        generationMode === 'single'
                          ? handleGenerateSingle
                          : generationMode === 'multiprompt'
                          ? handleGenerateMulti
                          : handleGenerateJsonBatch
                      }
                      className="px-5 py-2.5 rounded-xl bg-[#4d6b53] hover:bg-[#5c7f63] text-white text-xs font-semibold shadow-md transition"
                    >
                      Begin Rendering
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Atelier Action Toolbar */}
              <div className="mt-4 w-full max-w-4xl flex items-center justify-between bg-[#1c212d] border border-[#2e3748] rounded-xl px-4 py-2.5 shadow-md">
                <div className="flex items-center gap-2">
                  {/* Regenerate Button (Moss Green) */}
                  <button
                    type="button"
                    onClick={
                      generationMode === 'single'
                        ? handleGenerateSingle
                        : generationMode === 'multiprompt'
                        ? handleGenerateMulti
                        : handleGenerateJsonBatch
                    }
                    className="px-3.5 py-1.5 rounded-lg bg-[#4d6b53] hover:bg-[#5c7f63] text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition"
                    title="Regenerate with current settings"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Regenerate</span>
                  </button>

                  {/* Variations Button */}
                  <button
                    type="button"
                    onClick={handleGenerateVariations}
                    className="px-3 py-1.5 rounded-lg bg-[#222836] hover:bg-[#2a3243] text-slate-200 border border-[#2e3748] font-medium text-xs flex items-center gap-1.5 transition"
                    title="Generate variation with new randomized seed"
                  >
                    <Dices className="w-3.5 h-3.5 text-[#8699b8]" />
                    <span>Variations</span>
                  </button>

                  {/* Reuse Settings */}
                  {currentActiveMeta && (
                    <button
                      type="button"
                      onClick={() => reuseSettings(currentActiveMeta as any)}
                      className="px-3 py-1.5 rounded-lg bg-[#222836] hover:bg-[#2a3243] text-slate-200 border border-[#2e3748] font-medium text-xs flex items-center gap-1.5 transition"
                      title="Load prompt and params into form"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-indigo-300" />
                      <span>Reuse Settings</span>
                    </button>
                  )}
                </div>

                {/* Right Action Chips: Add to Album, Favorite & Download */}
                <div className="flex items-center gap-2">
                  {currentActiveMeta?.job_id && (
                    <button
                      type="button"
                      onClick={() => handleOpenAddToAlbum(currentActiveMeta.job_id)}
                      className="px-3 py-1.5 rounded-lg bg-[#222836] hover:bg-[#2a3243] text-slate-200 border border-[#2e3748] font-medium text-xs flex items-center gap-1.5 transition"
                      title="Add to album"
                    >
                      <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Add to Album</span>
                    </button>
                  )}

                  {currentActiveMeta?.job_id && (
                    <button
                      type="button"
                      onClick={(e) => toggleFav(currentActiveMeta.job_id, e)}
                      className={`p-2 rounded-lg border text-xs transition ${
                        currentActiveMeta.favorite
                          ? 'bg-red-500/20 border-red-500/50 text-red-400'
                          : 'bg-[#222836] border-[#2e3748] text-slate-400 hover:text-white'
                      }`}
                      title="Toggle favorite"
                    >
                      <Heart className={`w-3.5 h-3.5 ${currentActiveMeta.favorite ? 'fill-current' : ''}`} />
                    </button>
                  )}

                  {currentCanvasImage && (
                    <a
                      href={currentCanvasImage}
                      download={`IrisAtelier_${Date.now()}.png`}
                      className="px-3.5 py-1.5 rounded-lg bg-[#222836] hover:bg-[#2a3243] text-slate-200 border border-[#2e3748] font-medium text-xs flex items-center gap-1.5 transition"
                      title="Download image"
                    >
                      <Download className="w-3.5 h-3.5 text-[#8699b8]" />
                      <span>Download</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Full Archive & Gallery Tab View */}
          {activeTab === 'gallery' && (
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Albums Filter Navigation Bar */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-[#161a23] p-3 rounded-2xl border border-[#262d3b]">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1.5">
                    <Folder className="w-4 h-4 text-amber-400" />
                    <span>Albums</span>
                  </div>

                  {/* All Renders Tab */}
                  <button
                    type="button"
                    onClick={() => setSelectedAlbumId(null)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                      selectedAlbumId === null
                        ? 'bg-[#4d6b53] text-white shadow-md shadow-[#4d6b53]/20 border border-[#62886a]'
                        : 'bg-[#1c212d] text-slate-300 hover:text-white hover:bg-[#222836] border border-[#2e3748]'
                    }`}
                  >
                    <span>All Renders</span>
                  </button>

                  {/* Individual Album Badges */}
                  {albums.map((album) => {
                    const isSelected = selectedAlbumId === album.id
                    return (
                      <div
                        key={album.id}
                        className={`group relative flex items-center rounded-xl text-xs font-medium transition border ${
                          isSelected
                            ? 'bg-[#8699b8]/20 border-[#8699b8] text-indigo-200'
                            : 'bg-[#1c212d] text-slate-300 hover:text-white hover:bg-[#222836] border-[#2e3748]'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedAlbumId(album.id)}
                          className="px-3 py-1.5 flex items-center gap-1.5"
                        >
                          <Folder className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-300' : 'text-slate-400 group-hover:text-amber-300'}`} />
                          <span>{album.name}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                              isSelected ? 'bg-indigo-500/30 text-indigo-200' : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {album.count}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteAlbum(album.id, album.name, e)}
                          className="pr-2 pl-0.5 text-slate-500 hover:text-red-400 opacity-60 group-hover:opacity-100 transition"
                          title={`Delete album "${album.name}" (images remain in gallery)`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )
                  })}
                </div>

                {/* Right Action: Create New Album */}
                <button
                  type="button"
                  onClick={() => {
                    setTargetJobIdsForAlbum([])
                    setNewAlbumInput('')
                    setAlbumFeedbackMsg('')
                    setShowCreateAlbumModal(true)
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#222836] hover:bg-[#2a3243] text-slate-200 hover:text-white border border-[#2e3748] text-xs font-medium flex items-center gap-1.5 transition ml-auto"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>New Album</span>
                </button>
              </div>

              {gallery.length === 0 ? (
                <div className="text-center text-slate-500 py-24">
                  <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm font-medium">
                    {selectedAlbumId !== null
                      ? 'This album is currently empty. Select images and click "Add to Album" to populate it.'
                      : 'No renders found in your atelier gallery.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {gallery.map((item, idx) => {
                    const isSelected = selectedJobIds.includes(item.job_id)
                    const isCanvasCurrent = selectedItem?.job_id === item.job_id
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (selectedJobIds.length > 0) {
                            toggleSelect(item.job_id)
                          } else {
                            setSelectedItem(item)
                            setDisplayedGalleryIndex(idx)
                            setActiveTab('canvas')
                          }
                        }}
                        className={`group relative rounded-xl overflow-hidden border bg-[#1c212d] cursor-pointer transition-all duration-200 shadow-md aspect-[2/3] ${
                          isSelected
                            ? 'border-[#8699b8] ring-2 ring-[#8699b8] shadow-[#8699b8]/30'
                            : isCanvasCurrent
                            ? 'border-[#4d6b53] ring-2 ring-[#4d6b53]'
                            : 'border-[#262d3b] hover:border-[#8699b8]/60'
                        }`}
                      >
                        {/* Select Checkbox Button */}
                        <button
                          type="button"
                          onClick={(e) => toggleSelect(item.job_id, e)}
                          className={`absolute top-2.5 left-2.5 z-20 w-6 h-6 rounded-md flex items-center justify-center transition backdrop-blur-md ${
                            isSelected
                              ? 'bg-[#4d6b53] text-white shadow-md ring-1 ring-white/50'
                              : 'bg-black/50 text-transparent group-hover:text-white/70 group-hover:bg-black/70 border border-white/20'
                          }`}
                        >
                          <Check className={`w-3.5 h-3.5 ${isSelected ? 'text-white stroke-[3]' : 'text-white/80'}`} />
                        </button>

                        <img
                          src={item.image_url}
                          alt={item.prompt}
                          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition p-3 flex flex-col justify-end">
                          <p className="text-xs text-white line-clamp-2 mb-2 font-medium">{item.prompt}</p>
                          <div className="flex items-center justify-between text-[11px] text-slate-300">
                            <span>
                              {item.width}×{item.height}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedItem(item)
                                }}
                                className="p-1 rounded hover:bg-white/20 text-slate-300 hover:text-white transition"
                                title="Inspect details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => toggleFav(item.job_id, e)}
                                className={`p-1 rounded hover:bg-white/20 transition ${
                                  item.favorite ? 'text-red-400' : 'text-slate-300'
                                }`}
                              >
                                <Heart className={`w-3.5 h-3.5 ${item.favorite ? 'fill-current' : ''}`} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </main>

        {/* ================= COLUMN 3: RIGHT PANEL (QUEUE, TELEMETRY & MINI GALLERY) ================= */}
        <aside className="w-[330px] bg-[#181d27] flex flex-col shrink-0 overflow-y-auto p-4 space-y-4">
          {/* Card 1: Generation Queue Card */}
          <div className="p-4 rounded-2xl bg-[#1c212d] border border-[#262d3b] shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8699b8]" />
                <h3 className="font-serif font-bold text-sm text-white">Generation Queue</h3>
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  isGenerating
                    ? 'bg-[#4d6b53]/20 text-[#a3c9aa] border-[#4d6b53]/40 animate-pulse'
                    : 'bg-[#222836] text-slate-400 border-[#2e3748]'
                }`}
              >
                {isGenerating
                  ? job.batch_total && job.batch_total > 1
                    ? `Active [${job.batch_index || 1}/${job.batch_total}]`
                    : 'Processing'
                  : 'Idle'}
              </span>
            </div>

            {/* Step Progress & ETA */}
            {isGenerating ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium font-mono">
                    Step {job.step}/{job.total_steps}
                  </span>
                  <span className="text-[#8699b8] font-mono">{progressPercent}%</span>
                </div>
                <div className="w-full bg-[#151821] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#4d6b53] to-[#8699b8] h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Elapsed: {job.elapsed}s</span>
                  <span>{job.queue_size ? `${job.queue_size} in queue` : 'Last item'}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 leading-relaxed">
                GPU runner ready. Submitting a single or multiprompt batch will track live execution here.
              </p>
            )}

            {/* Waiting Queue List */}
            {job.queue_items && job.queue_items.length > 0 && (
              <div className="border-t border-[#262d3b] pt-2.5 space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 block">Queued Prompts:</span>
                <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                  {job.queue_items.map((q, idx) => (
                    <div
                      key={q.job_id || idx}
                      className="flex items-center justify-between p-1.5 rounded-lg bg-[#151821] border border-[#262d3b] text-[11px]"
                    >
                      <div className="flex items-center gap-1.5 truncate mr-2">
                        <span className="w-4 h-4 rounded bg-[#222836] text-[9px] font-bold text-[#8699b8] flex items-center justify-center shrink-0">
                          {q.index}
                        </span>
                        <span className="text-slate-300 truncate">{q.prompt || `Prompt ${q.index}`}</span>
                      </div>
                      <span className="text-[9px] text-amber-400/90 font-mono shrink-0">Queued</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card 2: System Status & Hardware Monitor */}
          <div className="p-4 rounded-2xl bg-[#1c212d] border border-[#262d3b] shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="font-serif font-bold text-sm text-white">System Status</h3>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium">
                Online
              </span>
            </div>

            {/* VRAM Gauge */}
            {systemStatus?.gpu && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">GPU VRAM</span>
                  <span className="text-slate-200 font-mono">
                    {Math.round((systemStatus.gpu.vram_used_mb / 1024) * 10) / 10} /{' '}
                    {Math.round(systemStatus.gpu.vram_total_mb / 1024)} GB
                  </span>
                </div>
                <div className="w-full bg-[#151821] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#8699b8] h-full"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((systemStatus.gpu.vram_used_mb / systemStatus.gpu.vram_total_mb) * 100)
                      )}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>NVIDIA RTX 3050 Laptop</span>
                  <span>{systemStatus.gpu.utilization}% Load</span>
                </div>
              </div>
            )}

            {/* Storage Gauge */}
            {systemStatus?.storage?.d_drive && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">D:\ AI Storage</span>
                  <span className="text-emerald-400 font-mono">
                    {systemStatus.storage.d_drive.free_gb} GB Free
                  </span>
                </div>
                <div className="w-full bg-[#151821] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{
                      width: `${Math.round(
                        ((systemStatus.storage.d_drive.total_gb - systemStatus.storage.d_drive.free_gb) /
                          systemStatus.storage.d_drive.total_gb) *
                          100
                      )}%`
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Recent Atelier Gallery & History (Mini Grid) */}
          <div className="p-4 rounded-2xl bg-[#1c212d] border border-[#262d3b] shadow-md space-y-3 flex-1 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#8699b8]" />
                <h3 className="font-serif font-bold text-sm text-white">Gallery & History</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('gallery')}
                className="text-[11px] text-[#8699b8] hover:text-[#a8bbdc] font-medium transition"
              >
                View All ({gallery.length}) →
              </button>
            </div>

            {/* Mini Thumbnails Grid */}
            {gallery.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No images rendered yet.</p>
            ) : (
              <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[300px] pr-1">
                {gallery.slice(0, 12).map((item, idx) => {
                  const isActive =
                    selectedItem?.job_id === item.job_id ||
                    (!selectedItem && idx === 0 && !isGenerating)
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedItem(item)
                        setDisplayedGalleryIndex(idx)
                        setActiveTab('canvas')
                      }}
                      className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border transition shadow-sm group ${
                        isActive
                          ? 'border-[#8699b8] ring-2 ring-[#8699b8] shadow-[#8699b8]/30 scale-[1.02]'
                          : 'border-[#262d3b] hover:border-slate-500'
                      }`}
                    >
                      <img
                        src={item.image_url}
                        alt="Thumbnail"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                      />
                      {item.favorite === 1 && (
                        <div className="absolute top-1 right-1">
                          <Heart className="w-2.5 h-2.5 text-red-400 fill-current" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ================= MODALS ================= */}

      {/* Model Importer Modal */}
      {showModelModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c212d] border border-[#2e3748] rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#262d3b] flex items-center justify-between bg-[#151821]">
              <div className="flex items-center gap-2.5">
                <FolderPlus className="w-5 h-5 text-[#8699b8]" />
                <div>
                  <h3 className="font-serif font-bold text-base text-white">Base Model Importer & Manager</h3>
                  <p className="text-[11px] text-slate-400">Download from CivitAI / HuggingFace or import local files</p>
                </div>
              </div>
              <button
                onClick={() => setShowModelModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#222836]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex border-b border-[#262d3b] px-4 bg-[#1c212d] text-xs font-semibold">
              <button
                onClick={() => setModelModalTab('url')}
                className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 ${
                  modelModalTab === 'url' ? 'border-[#8699b8] text-white' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                Download from Web
              </button>
              <button
                onClick={() => setModelModalTab('local')}
                className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 ${
                  modelModalTab === 'local' ? 'border-[#8699b8] text-white' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <FileDown className="w-3.5 h-3.5" />
                Import from Computer
              </button>
              <button
                onClick={() => setModelModalTab('installed')}
                className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 ${
                  modelModalTab === 'installed' ? 'border-[#8699b8] text-white' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Installed Models ({installedModels.length})
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              {modelModalTab === 'url' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Model Download URL</label>
                    <input
                      type="text"
                      value={downloadUrl}
                      onChange={(e) => setDownloadUrl(e.target.value)}
                      placeholder="https://huggingface.co/... or https://civitai.com/api/download/models/..."
                      className="w-full bg-[#151821] border border-[#262d3b] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#8699b8] transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Destination Category</label>
                      <select
                        value={downloadType}
                        onChange={(e) => setDownloadType(e.target.value)}
                        className="w-full bg-[#151821] border border-[#262d3b] rounded-xl p-2 text-white"
                      >
                        <option value="unet">UNet / GGUF Diffusion (Anima, Flux)</option>
                        <option value="checkpoints">Standard Checkpoint (SD 1.5, SDXL, Pony)</option>
                        <option value="loras">LoRA Adapter</option>
                        <option value="vae">VAE Model</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Custom Filename (Optional)</label>
                      <input
                        type="text"
                        value={downloadCustomName}
                        onChange={(e) => setDownloadCustomName(e.target.value)}
                        placeholder="Auto-detected if empty"
                        className="w-full bg-[#151821] border border-[#262d3b] rounded-xl p-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">CivitAI / HuggingFace Token (Optional)</label>
                    <input
                      type="password"
                      value={civitaiToken}
                      onChange={(e) => setCivitaiToken(e.target.value)}
                      placeholder="Only needed for private or gated models"
                      className="w-full bg-[#151821] border border-[#262d3b] rounded-xl p-2 text-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleStartDownload}
                    className="w-full py-2.5 rounded-xl bg-[#4d6b53] hover:bg-[#5c7f63] text-white font-semibold flex items-center justify-center gap-2 transition shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download to Atelier Storage</span>
                  </button>
                </div>
              )}

              {modelModalTab === 'local' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Local File Path</label>
                    <input
                      type="text"
                      value={localSourcePath}
                      onChange={(e) => setLocalSourcePath(e.target.value)}
                      placeholder="C:\Users\Hugo\Downloads\your_model.safetensors"
                      className="w-full bg-[#151821] border border-[#262d3b] rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleImportLocal()}
                      className="flex-1 py-2.5 rounded-xl bg-[#4d6b53] hover:bg-[#5c7f63] text-white font-semibold flex items-center justify-center gap-2 transition"
                    >
                      <FileDown className="w-4 h-4" />
                      <span>Copy Model to Studio</span>
                    </button>
                    <button
                      type="button"
                      onClick={scanDownloadsFolder}
                      className="py-2.5 px-4 rounded-xl bg-[#222836] hover:bg-[#2a3243] text-slate-200 border border-[#2e3748] font-medium transition"
                    >
                      Scan Downloads
                    </button>
                  </div>

                  {scannedFiles.length > 0 && (
                    <div className="bg-[#151821] p-3 rounded-xl border border-[#262d3b] space-y-2">
                      <span className="text-slate-400 font-semibold block text-[11px]">Found in your Downloads folder:</span>
                      {scannedFiles.map((sf, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-[#1c212d] rounded-lg border border-[#262d3b]">
                          <div className="truncate mr-2">
                            <span className="text-white block truncate">{sf.filename}</span>
                            <span className="text-[10px] text-slate-500">{sf.size_gb} GB • {sf.suggested_type}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleImportLocal(sf.path, sf.suggested_type)}
                            className="px-2.5 py-1 bg-[#4d6b53]/20 hover:bg-[#4d6b53]/30 text-[#a3c9aa] border border-[#4d6b53]/40 rounded text-xs shrink-0"
                          >
                            Import
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {modelModalTab === 'installed' && (
                <div className="space-y-2 text-xs">
                  {installedModels.length === 0 ? (
                    <p className="text-slate-500 text-center py-6">No models installed.</p>
                  ) : (
                    installedModels.map((m) => (
                      <div
                        key={m.filename}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#151821] border border-[#262d3b]"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{m.filename}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#8699b8]/20 text-[#a8bbdc] border border-[#8699b8]/30 uppercase">
                              {m.type}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">{m.size_gb} GB • Category: {m.category}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteModel(m.category, m.filename)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition"
                          title="Delete model to reclaim disk space"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {importStatusMsg && (
                <div className="p-2.5 rounded-xl bg-[#151821] border border-[#262d3b] text-xs text-[#a8bbdc] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8699b8] shrink-0" />
                  <span>{importStatusMsg}</span>
                </div>
              )}

              {downloads.length > 0 && (
                <div className="border-t border-[#262d3b] pt-3">
                  <span className="text-xs font-semibold text-slate-300 block mb-2">Background Downloads</span>
                  <div className="space-y-2">
                    {downloads.map((d) => (
                      <div key={d.id} className="p-3 bg-[#151821] rounded-xl border border-[#262d3b] text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-white truncate max-w-xs">{d.filename}</span>
                          <span className="text-[11px] text-[#8699b8] font-mono">
                            {d.status === 'downloading' ? `${d.progress}% (${d.speed_mb_s} MB/s)` : d.status}
                          </span>
                        </div>
                        {d.status === 'downloading' && (
                          <div className="w-full bg-[#1c212d] rounded-full h-1.5 overflow-hidden mb-2">
                            <div
                              className="bg-[#8699b8] h-full transition-all duration-300"
                              style={{ width: `${d.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Character Templates Modal */}
      {showCharacterModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c212d] border border-[#2e3748] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-[#262d3b] flex items-center justify-between bg-[#151821]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#8699b8]/15 text-[#8699b8] flex items-center justify-center border border-[#8699b8]/30">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-white">Character Archetype Presets</h3>
                  <p className="text-[11px] text-slate-400">1-click prompts for Zaria, Nixia, Angela, Virelia, Vivianne</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowCharacterModal(false)
                  setEditingCharId(null)
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#222836] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              <div className="space-y-2.5">
                {characters.map((char) => {
                  const isActive = activeCharacterId === char.id
                  return (
                    <div
                      key={char.id}
                      className={`p-3.5 bg-[#151821] border rounded-xl flex items-start justify-between gap-3 transition ${
                        isActive ? 'border-[#8699b8] ring-1 ring-[#8699b8]/40' : 'border-[#262d3b]'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#8699b8]" />
                          <span className="font-serif font-bold text-sm text-white">{char.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8699b8]/15 text-[#a8bbdc] border border-[#8699b8]/30">
                            {char.tagline}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {char.prompt}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 self-center">
                        <button
                          type="button"
                          onClick={() => {
                            applyCharacter(char, false)
                            setShowCharacterModal(false)
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#4d6b53] hover:bg-[#5c7f63] text-white text-xs font-semibold transition"
                        >
                          Load
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Image Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c212d] border border-[#2e3748] rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl">
            <div className="flex-1 bg-[#151821] flex items-center justify-center p-4 min-h-[300px]">
              <img
                src={selectedItem.image_url}
                alt={selectedItem.prompt}
                className="max-h-[70vh] w-auto object-contain rounded-xl shadow-lg"
              />
            </div>

            <div className="w-full md:w-80 p-5 flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#262d3b] bg-[#1c212d]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif font-bold text-base text-white">Generation Details</h3>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#222836]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-500 font-semibold block mb-1">Prompt</label>
                    <p className="text-slate-200 bg-[#151821] p-2.5 rounded-xl border border-[#262d3b] leading-relaxed max-h-28 overflow-y-auto">
                      {selectedItem.prompt}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#151821] p-2 rounded-lg border border-[#262d3b]">
                      <span className="text-slate-500 block text-[10px]">Dimensions</span>
                      <span className="text-slate-200 font-medium">
                        {selectedItem.width} × {selectedItem.height}
                      </span>
                    </div>
                    <div className="bg-[#151821] p-2 rounded-lg border border-[#262d3b]">
                      <span className="text-slate-500 block text-[10px]">Seed</span>
                      <span className="text-slate-200 font-mono font-medium">{selectedItem.seed}</span>
                    </div>
                    <div className="bg-[#151821] p-2 rounded-lg border border-[#262d3b]">
                      <span className="text-slate-500 block text-[10px]">Steps & CFG</span>
                      <span className="text-slate-200 font-medium">
                        {selectedItem.steps} st / {selectedItem.cfg} CFG
                      </span>
                    </div>
                    <div className="bg-[#151821] p-2 rounded-lg border border-[#262d3b]">
                      <span className="text-slate-500 block text-[10px]">Render Time</span>
                      <span className="text-slate-200 font-medium">{selectedItem.elapsed_seconds}s</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#262d3b]">
                <button
                  type="button"
                  onClick={() => reuseSettings(selectedItem)}
                  className="w-full py-2.5 rounded-xl bg-[#4d6b53] hover:bg-[#5c7f63] text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reuse Settings in Atelier</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenAddToAlbum(selectedItem.job_id)}
                    className="flex-1 py-2 rounded-xl bg-[#222836] hover:bg-[#2a3243] text-slate-200 border border-[#2e3748] text-xs font-medium flex items-center justify-center gap-1.5 transition"
                  >
                    <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Add to Album</span>
                  </button>
                  <a
                    href={selectedItem.image_url}
                    download={selectedItem.filename}
                    className="flex-1 py-2 rounded-xl bg-[#222836] hover:bg-[#2a3243] text-slate-200 border border-[#2e3748] text-xs font-medium flex items-center justify-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5 text-[#8699b8]" />
                    <span>Download</span>
                  </a>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(selectedItem.job_id, e)}
                    className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs transition"
                    title="Delete render"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shutdown Modal */}
      {showShutdownModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c212d] border border-[#2e3748] rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 mx-auto flex items-center justify-center mb-3 border border-red-500/20">
              <Power className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-white mb-2">Turn Off Iris Atelier?</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              This will stop the local ComfyUI instance and API, freeing all GPU VRAM back to your laptop.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowShutdownModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#222836] hover:bg-[#2a3243] text-slate-300 text-xs font-medium border border-[#2e3748] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleShutdown}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-600/30 transition"
              >
                Yes, Turn Off
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add To Album Modal */}
      {showAddToAlbumModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c212d] border border-[#2e3748] rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#262d3b] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-white">Add to Album</h3>
                  <p className="text-[11px] text-slate-400">
                    Categorizing {targetJobIdsForAlbum.length} image{targetJobIdsForAlbum.length > 1 ? 's' : ''} (images remain in gallery)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddToAlbumModal(false)
                  setAlbumFeedbackMsg('')
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#222836] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {albumFeedbackMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{albumFeedbackMsg}</span>
              </div>
            )}

            {/* Existing Albums List */}
            <div className="mb-4">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Choose Existing Album
              </label>
              {albums.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#151821] border border-[#262d3b] text-center text-xs text-slate-400">
                  No albums created yet. Enter a name below to create your first album!
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {albums.map((album) => (
                    <button
                      key={album.id}
                      type="button"
                      onClick={() => handleAddTargetImagesToAlbum(album.id, album.name)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#151821] hover:bg-[#222836] border border-[#262d3b] hover:border-[#8699b8]/50 text-left transition group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Folder className="w-4 h-4 text-amber-400 group-hover:text-amber-300" />
                        <div>
                          <div className="text-xs font-semibold text-white">{album.name}</div>
                          <div className="text-[10px] text-slate-400">{album.count} items currently</div>
                        </div>
                      </div>
                      <span className="text-[11px] px-2.5 py-1 rounded-lg bg-[#2e3748] text-slate-200 group-hover:bg-[#4d6b53] group-hover:text-white font-medium transition">
                        + Add Here
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Create Album & Add */}
            <div className="pt-4 border-t border-[#262d3b]">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Or Create New Album & Add
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAlbumInput}
                  onChange={(e) => setNewAlbumInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleCreateAlbumAndAdd()
                    }
                  }}
                  placeholder="e.g. Nixia Concept Renders, Anime Portraits..."
                  className="flex-1 bg-[#151821] border border-[#262d3b] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#8699b8] transition"
                />
                <button
                  type="button"
                  onClick={handleCreateAlbumAndAdd}
                  className="px-3.5 py-2 rounded-xl bg-[#4d6b53] hover:bg-[#5c7f63] text-white text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create & Add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create New Album Modal */}
      {showCreateAlbumModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c212d] border border-[#2e3748] rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#262d3b] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Folder className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-white">New Album</h3>
                  <p className="text-[11px] text-slate-400">Organize your studio renders</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCreateAlbumModal(false)
                  setAlbumFeedbackMsg('')
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#222836] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {albumFeedbackMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{albumFeedbackMsg}</span>
              </div>
            )}

            <div className="mb-5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Album Name
              </label>
              <input
                type="text"
                value={newAlbumInput}
                onChange={(e) => setNewAlbumInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleCreateAlbumAndAdd()
                  }
                }}
                placeholder="e.g. Nixia Showcase, Angela Office, Vivianne Kuudere"
                autoFocus
                className="w-full bg-[#151821] border border-[#262d3b] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#8699b8] transition"
              />
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowCreateAlbumModal(false)
                  setAlbumFeedbackMsg('')
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#222836] hover:bg-[#2a3243] text-slate-300 text-xs font-medium border border-[#2e3748] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateAlbumAndAdd}
                className="flex-1 py-2.5 rounded-xl bg-[#4d6b53] hover:bg-[#5c7f63] text-white text-xs font-semibold shadow-md shadow-[#4d6b53]/20 transition flex items-center justify-center gap-1.5"
              >
                <FolderCheck className="w-3.5 h-3.5" />
                <span>Create Album</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Angle & Pose Matrix Modal (10, 50, 100 Shots Only) */}
      {showAngleBurstModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c212d] border border-[#2e3748] rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#262d3b] mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-center justify-center shadow-inner">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">Angle & Pose Matrix</h3>
                  <p className="text-[11px] text-slate-400">
                    Automated multi-angle photoshoot (poses & camera angles only)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAngleBurstModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#222836] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Base Prompt Preview Card */}
            <div className="mb-4 bg-[#151821] p-3 rounded-xl border border-[#262d3b]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Base Character & Scene Prompt
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Zero Place Interference</span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-2 italic">
                {generationMode === 'single' ? prompt : multiPrompts[activeSlotIndex] || prompt}
              </p>
            </div>

            {/* Shot Count Selection (10, 50, 100 only) */}
            <div className="mb-5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Select Shot Count
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { count: 10 as const, title: '10 Shots', desc: 'Quick Preview', time: '~2.5m' },
                  { count: 50 as const, title: '50 Shots', desc: 'Extended Reel', time: '~12m' },
                  { count: 100 as const, title: '100 Shots', desc: 'Master Matrix', time: '~25m' },
                ].map((opt) => (
                  <button
                    key={opt.count}
                    type="button"
                    onClick={() => {
                      setBurstCount(opt.count)
                      const currentPrompt = generationMode === 'single' ? prompt : multiPrompts[activeSlotIndex] || prompt
                      const firstFew = currentPrompt.trim().split(/\s+/).slice(0, 3).join(' ').replace(/[,.]/g, '')
                      setBurstAlbumName(`${firstFew || 'Character'} - ${opt.count} Angles`)
                    }}
                    className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                      burstCount === opt.count
                        ? 'bg-[#4d6b53]/20 border-[#4d6b53] ring-1 ring-[#4d6b53] text-white shadow-md'
                        : 'bg-[#151821] border-[#262d3b] text-slate-400 hover:text-white hover:bg-[#222836]'
                    }`}
                  >
                    <span className="font-serif font-bold text-base block mb-0.5">{opt.title}</span>
                    <span className="text-[10px] text-slate-400 block mb-1">{opt.desc}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-emerald-300 font-mono">
                      {opt.time}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Album Name Input */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Target Album Name
                </label>
                <span className="text-[10px] text-slate-400">Available in normal gallery too</span>
              </div>
              <input
                type="text"
                value={burstAlbumName}
                onChange={(e) => setBurstAlbumName(e.target.value)}
                placeholder="e.g. Zaria - 100 Angles"
                className="w-full bg-[#151821] border border-[#262d3b] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#8699b8] transition"
              />
            </div>

            {/* Hardware Safety Notice */}
            <div className="mb-6 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-slate-300 text-[11px] leading-relaxed flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                <strong>Sequential Queue Safety:</strong> All {burstCount} angle variations will render strictly one-by-one through ComfyUI, keeping GPU VRAM at safe levels (~3.2 GB on RTX 3050). You can cancel at any time.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowAngleBurstModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#222836] hover:bg-[#2a3243] text-slate-300 text-xs font-medium border border-[#2e3748] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLaunchAngleBurst}
                disabled={isQueueingBurst}
                className="flex-1 py-2.5 rounded-xl bg-[#4d6b53] hover:bg-[#5c7f63] text-white text-xs font-semibold shadow-lg shadow-[#4d6b53]/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{isQueueingBurst ? 'Queueing Shots...' : `Queue ${burstCount} Angles & Poses`}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LAN Wi-Fi Sharing Modal */}
      {showLanModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c212d] border border-[#2e3748] rounded-2xl max-w-md w-full p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#262d3b] mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner ${
                  lanStatus.enabled
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">LAN Wi-Fi Sharing</h3>
                  <p className="text-[11px] text-slate-400">
                    Access live progress and pictures from your phone
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLanModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#222836] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Master Toggle Switch */}
            <div className="mb-5 bg-[#151821] p-4 rounded-xl border border-[#262d3b] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">LAN Broadcast</span>
                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                    lanStatus.enabled
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {lanStatus.enabled ? 'ON' : 'OFF'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {lanStatus.enabled
                    ? 'Allow devices on this Wi-Fi to view live progress & gallery'
                    : 'Block remote Wi-Fi devices. Only localhost can connect.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleToggleLan(!lanStatus.enabled)}
                disabled={isTogglingLan}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  lanStatus.enabled ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-md" />
              </button>
            </div>

            {lanStatus.enabled ? (
              <div className="space-y-4">
                {/* QR Code Scannable Card */}
                {lanStatus.qr_code && (
                  <div className="bg-[#12151e] border border-[#262d3b] p-4 rounded-xl text-center space-y-2">
                    <div className="bg-white p-2.5 rounded-xl inline-block shadow-lg mx-auto">
                      <img
                        src={lanStatus.qr_code}
                        alt="Scan to open LAN Companion"
                        className="w-44 h-44 mx-auto"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
                      <QrCode className="w-3.5 h-3.5 text-[#8699b8]" />
                      Scan with your phone's camera on the same Wi-Fi
                    </p>
                  </div>
                )}

                {/* LAN URL with Copy Button */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                    Direct Companion URL
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={lanStatus.url}
                      className="flex-1 bg-[#151821] border border-[#262d3b] rounded-xl px-3 py-2 text-xs text-white font-mono select-all focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(lanStatus.url)
                        setCopiedLanUrl(true)
                        setTimeout(() => setCopiedLanUrl(false), 2000)
                      }}
                      className="px-3 py-2 rounded-xl bg-[#222836] hover:bg-[#2a3243] text-slate-200 text-xs font-medium border border-[#2e3748] transition flex items-center gap-1.5 shrink-0"
                    >
                      {copiedLanUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLanUrl ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Test / Preview Button */}
                <div className="pt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLanModal(false)
                      window.history.pushState({}, '', '/lan')
                      setIsLanView(true)
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#222836] hover:bg-[#2a3243] text-slate-200 text-xs font-medium border border-[#2e3748] transition flex items-center justify-center gap-1.5"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-[#8699b8]" />
                    <span>Preview Mobile Companion</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 px-4 bg-[#141822] border border-[#222938] rounded-xl space-y-2">
                <WifiOff className="w-8 h-8 text-slate-500 mx-auto" />
                <h4 className="text-xs font-semibold text-slate-300">LAN Broadcast is Currently OFF</h4>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Your phone and other Wi-Fi devices will receive a blocked 403 screen. Toggle the switch above to ON to generate a QR code and connect your phone.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
