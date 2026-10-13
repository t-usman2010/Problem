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
import { Upload, MapPin, X, Image as ImageIcon } from 'lucide-react'
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
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#f0f0f0]">{t('title', { defaultValue: 'Report an Issue' })}</h1>
        <p className="text-sm text-[#8b8fa8] mt-1">Help improve your community by reporting civic problems</p>
      </div>

      {/* Title */}
      <Input
        label={t('issueTitle', { defaultValue: 'Title' })}
        placeholder={t('titlePlaceholder', { defaultValue: 'e.g., Large pothole near main market' })}
        error={errors.title?.message}
        {...register('title')}
      />

      {/* Description */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[#f0f0f0]">
          {t('description', { defaultValue: 'Description (optional)' })}
        </label>
        <textarea
          {...register('description')}
          placeholder={t('descriptionPlaceholder', { defaultValue: 'Describe the issue in detail...' })}
          rows={3}
          className="w-full rounded-lg border border-[#2a2d3e] bg-[#1a1d27] px-4 py-2.5 text-sm text-[#f0f0f0] placeholder-[#8b8fa8] focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 resize-none"
        />
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[#f0f0f0]">{t('category', { defaultValue: 'Category' })}</label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => field.onChange(cat.value)}
                  className={`flex flex-col items-center gap-1.5 rounded-lg p-3 border transition-colors ${
                    field.value === cat.value
                      ? 'border-[#3b82f6] bg-[#3b82f6]/10'
                      : 'border-[#2a2d3e] bg-[#1a1d27] hover:border-[#8b8fa8]'
                  }`}
                >
                  <CategoryIcon category={cat.value} size="md" />
                  <span className="text-xs text-[#f0f0f0]">{cat.label}</span>
                </button>
              ))}
            </div>
          )}
        />
        {errors.category && (
          <p className="text-xs text-red-400" role="alert">{errors.category.message}</p>
        )}
      </div>

      {/* Location */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[#f0f0f0]">{t('location', { defaultValue: 'Location' })}</label>
        <div className="rounded-lg border border-[#2a2d3e] overflow-hidden" style={{ height: '300px' }}>
          <LocationPicker
            onLocationSelect={handleLocationSelect}
            initialLat={latitude}
            initialLng={longitude}
          />
        </div>
        {latitude && longitude && (
          <p className="text-xs text-[#8b8fa8] flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </p>
        )}
        {(errors.latitude || errors.longitude) && (
          <p className="text-xs text-red-400" role="alert">{t('dropPin', { defaultValue: 'Please select a location on the map' })}</p>
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
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[#f0f0f0]">{t('photo', { defaultValue: 'Photo (optional)' })}</label>
        {photoPreview ? (
          <div className="relative rounded-lg overflow-hidden border border-[#2a2d3e]">
            <img src={photoPreview} alt="Preview" className="w-full max-h-48 object-cover" />
            <button
              type="button"
              onClick={removePhoto}
              className="absolute top-2 end-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80 transition-colors"
              aria-label="Remove photo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-lg border-2 border-dashed border-[#2a2d3e] bg-[#1a1d27] p-8 text-center hover:border-[#8b8fa8] transition-colors"
          >
            <ImageIcon className="h-8 w-8 text-[#8b8fa8] mx-auto mb-2" />
            <span className="text-sm text-[#8b8fa8]">{t('uploadPhoto', { defaultValue: 'Click to upload a photo' })}</span>
            <span className="block text-xs text-[#8b8fa8] mt-1">{t('photoFormats', { defaultValue: 'JPEG, PNG, WebP up to 50MB' })}</span>
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
