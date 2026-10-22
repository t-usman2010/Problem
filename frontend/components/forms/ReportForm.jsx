'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import DuplicateWarning from '@/components/issue/DuplicateWarning'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reportSchema } from '@/lib/validation'
import { useToast } from '@/components/ui/Toast'
import { useRouter } from 'next/navigation'
import { useTranslations } from '@/context/LocaleContext'
import { CATEGORIES } from '@/lib/constants'
import api from '@/lib/api'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import CategoryIcon from '@/components/issue/CategoryIcon'
import { Upload, MapPin, X, Image as ImageIcon, Sparkles } from 'lucide-react'
import dynamic from 'next/dynamic'

const LocationPicker = dynamic(() => import('@/components/map/LocationPicker'), { ssr: false })

export default function ReportForm() {
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef(null)
  const toast = useToast()
  const router = useRouter()
  const t = useTranslations('report')

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: '',
      description: '',
      category: undefined,
      latitude: undefined,
      longitude: undefined,
      address: ''
    }
  })

  const selectedCategory = watch('category')
  const latitude = watch('latitude')
  const longitude = watch('longitude')
  const allValues = watch()

  // Draft persistence
  useEffect(() => {
    const draft = sessionStorage.getItem('report-draft')
    if (draft) {
      try {
        const parsed = JSON.parse(draft)
        Object.keys(parsed).forEach(key => {
          if (parsed[key] !== undefined && parsed[key] !== null) {
            setValue(key, parsed[key])
          }
        })
      } catch (e) {
        console.error('Failed to parse draft', e)
      }
    }
  }, [setValue])

  useEffect(() => {
    const timer = setTimeout(() => {
      sessionStorage.setItem('report-draft', JSON.stringify(allValues))
    }, 1000)
    return () => clearTimeout(timer)
  }, [allValues])

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a JPEG, PNG, or WebP image')
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error('Image must be under 50MB')
      return
    }

    // Compress
    try {
      const imageCompression = (await import('browser-image-compression')).default
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      })
      setPhoto(compressed)
      setPhotoPreview(URL.createObjectURL(compressed))
    } catch {
      setPhoto(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const removePhoto = () => {
    setPhoto(null)
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhotoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleLocationSelect = useCallback((lat, lng) => {
    setValue('latitude', lat, { shouldValidate: true })
    setValue('longitude', lng, { shouldValidate: true })
  }, [setValue])

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      if (data.description) formData.append('description', data.description)
      formData.append('category', data.category)
      formData.append('latitude', data.latitude.toString())
      formData.append('longitude', data.longitude.toString())
      if (data.address) formData.append('address', data.address)
      if (photo) formData.append('photo', photo)

      await api.post('/issues', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      sessionStorage.removeItem('report-draft')
      toast.success(t('reportSuccess', { defaultValue: 'Issue reported successfully!' }))
      router.push('/map')
    } catch (err) {
      toast.error(err.response?.data?.message || t('reportError', { defaultValue: 'Failed to submit report' }))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#58a6ff]/20 to-[#bc8cff]/20 border border-[#58a6ff]/10">
            <Sparkles className="h-5 w-5 text-[#58a6ff]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#f0f6fc]">{t('title', { defaultValue: 'Report an Issue' })}</h1>
            <p className="text-sm text-[#7d8590]">Help improve your community by reporting civic problems</p>
          </div>
        </div>
      </div>

      {/* Title */}
      <Input
        label={t('issueTitle', { defaultValue: 'Title' })}
        placeholder={t('titlePlaceholder', { defaultValue: 'e.g., Large pothole near main market' })}
        error={errors.title?.message}
        {...register('title')}
      />

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#f0f6fc]">
          {t('description', { defaultValue: 'Description (optional)' })}
        </label>
        <textarea
          {...register('description')}
          placeholder={t('descriptionPlaceholder', { defaultValue: 'Describe the issue in detail...' })}
          rows={3}
          className="w-full rounded-xl border border-[#21262d] bg-[#0d1117] px-4 py-3 text-sm text-[#f0f6fc] placeholder-[#484f58] input-glow focus:border-[#58a6ff]/50 focus:outline-none transition-all resize-none"
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#f0f6fc]">{t('category', { defaultValue: 'Category' })}</label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => field.onChange(cat.value)}
                  className={`flex flex-col items-center gap-2 rounded-2xl p-4 border transition-all duration-200 ${
                    field.value === cat.value
                      ? 'border-[#58a6ff]/40 bg-[#58a6ff]/10 shadow-[0_0_20px_rgba(88,166,255,0.1)]'
                      : 'border-[#21262d] bg-[#0d1117] hover:border-[#30363d] hover:bg-[#161b22]'
                  }`}
                >
                  <CategoryIcon category={cat.value} size="md" />
                  <span className="text-xs font-medium text-[#f0f6fc]">{cat.label}</span>
                </button>
              ))}
            </div>
          )}
        />
        {errors.category && (
          <p className="text-xs text-[#f85149]" role="alert">{errors.category.message}</p>
        )}
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#f0f6fc]">{t('location', { defaultValue: 'Location' })}</label>
        <div className="rounded-2xl border border-[#21262d] overflow-hidden" style={{ height: '300px' }}>
          <LocationPicker
            onLocationSelect={handleLocationSelect}
            initialLat={latitude}
            initialLng={longitude}
          />
        </div>
        {latitude && longitude && (
          <p className="text-xs text-[#7d8590] flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-[#58a6ff]" />
            <span className="font-mono">{latitude.toFixed(4)}, {longitude.toFixed(4)}</span>
          </p>
        )}
        {(errors.latitude || errors.longitude) && (
          <p className="text-xs text-[#f85149]" role="alert">{t('dropPin', { defaultValue: 'Please select a location on the map' })}</p>
        )}
      </div>

      {/* Address */}
      <Input
        label="Address (optional)"
        placeholder="e.g. Blue Area, Sector F-6, Islamabad"
        error={errors.address?.message}
        {...register('address')}
      />

      <DuplicateWarning category={selectedCategory} latitude={latitude} longitude={longitude} />

      {/* Photo */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#f0f6fc]">{t('photo', { defaultValue: 'Photo (optional)' })}</label>
        {photoPreview ? (
          <div className="relative rounded-2xl overflow-hidden border border-[#21262d] group">
            <img src={photoPreview} alt="Preview" className="w-full max-h-48 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06080d]/60 via-transparent to-transparent" />
            <button
              type="button"
              onClick={removePhoto}
              className="absolute top-3 end-3 rounded-xl bg-[#06080d]/70 backdrop-blur-sm p-2 text-white hover:bg-[#f85149]/20 hover:text-[#f85149] transition-all border border-white/10"
              aria-label="Remove photo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-2xl border-2 border-dashed border-[#21262d] bg-[#0d1117] p-10 text-center hover:border-[#58a6ff]/30 hover:bg-[#58a6ff]/5 transition-all duration-200 group"
          >
            <div className="p-3 rounded-2xl bg-[#161b22] border border-[#21262d] w-fit mx-auto mb-3 group-hover:border-[#58a6ff]/20 transition-colors">
              <ImageIcon className="h-8 w-8 text-[#7d8590] group-hover:text-[#58a6ff] transition-colors" />
            </div>
            <span className="text-sm text-[#7d8590] font-medium">{t('uploadPhoto', { defaultValue: 'Click to upload a photo' })}</span>
            <span className="block text-xs text-[#484f58] mt-1">{t('photoFormats', { defaultValue: 'JPEG, PNG, WebP up to 50MB' })}</span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handlePhotoChange}
          className="hidden"
        />
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" size="lg" loading={submitting}>
        <Upload className="h-4 w-4" />
        {t('submitReport', { defaultValue: 'Submit Report' })}
      </Button>
    </form>
  )
}
