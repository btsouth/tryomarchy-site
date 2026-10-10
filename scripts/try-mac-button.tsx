import { useRef, useState } from 'react'
import { t } from '@/i18n/site'
import { Button } from '@/components/ui/button'
import { DownloadIcon } from '@/components/icons'
import { latestMacDownload, MAC_RELEASES } from './try-mac'

export function MacDownloadButton() {
  const [loading, setLoading] = useState(false)
  const pending = useRef(false)

  async function download(event: React.MouseEvent<HTMLAnchorElement>) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return

    event.preventDefault()
    if (pending.current) return
    pending.current = true
    setLoading(true)
    try {
      // A stalled lookup should still lead to the release page.
      const url = await latestMacDownload(AbortSignal.timeout(8000))
      window.location.assign(url)
    } catch {
      // Browsers without AbortSignal.timeout still reach the release page.
      window.location.assign(MAC_RELEASES)
    } finally {
      pending.current = false
      setLoading(false)
    }
  }

  return (
    <Button
      nativeButton={false}
      render={<a href={MAC_RELEASES} onClick={download} />}
      className="mt-auto w-full"
      size="lg"
      disabled={loading}
      aria-busy={loading}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="size-5 rounded-full border-2 border-current border-r-transparent motion-safe:animate-spin"
        />
      ) : (
        <DownloadIcon />
      )}
      <span role="status">
        {loading ? t('Finding download…') : t('Download for Mac')}
      </span>
    </Button>
  )
}
