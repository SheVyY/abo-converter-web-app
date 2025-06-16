'use client'

import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/language-context'
import { Languages } from 'lucide-react'

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <Languages className="h-4 w-4 text-gray-600" />
      <div className="flex rounded-lg bg-gray-100 p-1">
        <Button
          variant={language === 'cs' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLanguage('cs')}
          className="h-8 px-3 text-xs font-medium"
        >
          CZ
        </Button>
        <Button
          variant={language === 'en' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLanguage('en')}
          className="h-8 px-3 text-xs font-medium"
        >
          EN
        </Button>
      </div>
    </div>
  )
}