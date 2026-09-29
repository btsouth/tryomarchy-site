import { useState } from 'react'
import { SectionHeading } from '@/components/SectionHeading'
import {
  ArrowUpRightIcon,
  CheckIcon,
  CopyIcon,
  DownloadIcon,
} from '@/components/icons'
import { LinuxIcon } from '@/components/icons/LinuxIcon'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const REPO = 'https://github.com/btsouth/try-omarchy-linux'
const HELP = `${REPO}/blob/master/docs/LINUX-HELP.md`
const INSTALLER = '/linux.flatpakref'
const wrap = 'mx-auto max-w-6xl px-5 sm:px-8'
const section = 'border-t border-border-subtle py-14 sm:py-20'
const link =
  'inline-flex min-h-11 items-center gap-2 text-sm text-text-secondary underline underline-offset-4 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring'
const code =
  'rounded-none bg-bg-deep px-1.5 py-0.5 font-mono text-[0.85em] text-text'

function Command({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="mt-3 flex items-stretch border border-border-subtle bg-bg-deep">
      <pre className="min-w-0 flex-1 overflow-x-auto px-4 py-3 font-mono text-xs leading-relaxed text-text sm:text-sm">
        <code>{text}</code>
      </pre>
      <button
        type="button"
        onClick={() =>
          navigator.clipboard.writeText(text).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          })
        }
        className="flex min-h-11 min-w-11 items-center justify-center border-l border-border-subtle text-text-secondary hover:text-text focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
        aria-label={copied ? 'Copied' : 'Copy command'}
      >
        {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
      </button>
    </div>
  )
}

function Steps({ steps }: { steps: React.ReactNode[] }) {
  return (
    <ol className="mt-6 space-y-5">
      {steps.map((step, index) => (
        <li
          key={index}
          className="flex gap-4 text-sm leading-relaxed text-text-secondary"
        >
          <span aria-hidden="true" className="font-mono text-brand">
            0{index + 1}
          </span>
          <div className="min-w-0 flex-1">{step}</div>
        </li>
      ))}
    </ol>
  )
}

const download = (
  <a className="text-text underline underline-offset-4" href={INSTALLER}>
    Download the installer
  </a>
)
const openApp = (
  <>
    Open <strong className="text-text">Try Omarchy</strong> from your app menu
    and choose <strong className="text-text">Try it now</strong>. Setup
    downloads Omarchy (about 2 GB) and starts it. The trial username and
    password are both <code className={code}>omarchy</code>.
  </>
)

const questions: Array<[string, React.ReactNode]> = [
  [
    'How do I know my PC can run it?',
    <>
      You need a 64-bit x86 PC with hardware virtualization turned on. If{' '}
      <code className={code}>ls /dev/kvm</code> prints{' '}
      <code className={code}>/dev/kvm</code>, you are set. If not, enable
      virtualization (Intel VT-x or AMD-V/SVM) in your firmware settings. ARM
      PCs are not supported.
    </>,
  ],
  [
    'How do updates work?',
    <>
      The installer adds the Try Omarchy update source, so new versions arrive
      through Software like your other apps, or with{' '}
      <code className={code}>flatpak update</code>. Your VM and files carry
      over.
    </>,
  ],
  [
    'How do I get my keyboard back?',
    <>
      While the Omarchy window is focused, Super and your other shortcuts go to
      Omarchy. Press <strong className="text-text">Ctrl+Alt+G</strong> to give
      the keyboard back to your desktop until you click the window again.{' '}
      <strong className="text-text">Ctrl+Alt+F</strong> switches fullscreen.
    </>,
  ],
  [
    'What happens if I uninstall it?',
    <>
      Uninstalling keeps your VM unless you choose{' '}
      <strong className="text-text">Delete</strong> under App Settings & Data,
      so reinstalling picks up where you left off. To remove only the VM, use{' '}
      <strong className="text-text">Delete this VM</strong> in the app’s home
      screen menu.
    </>,
  ],
  [
    'Is it finished?',
    <>
      It is a preview. Core use, files, backups and recovery work. Camera, live
      audio switching, gestures, USB passthrough and bridged networking are not
      in this release yet. Real hardware reports help; the{' '}
      <a
        className="text-text underline underline-offset-4"
        href={`${REPO}/blob/master/docs/LINUX-HARDWARE-TESTING.md`}
      >
        testing checklist
      </a>{' '}
      says what to check.
    </>,
  ],
]

export function LinuxPage() {
  return (
    <main>
      <section className={`${wrap} pt-16 pb-10 text-center sm:pt-24 sm:pb-14`}>
        <p className="mb-6 font-mono text-xs tracking-widest text-text-secondary">
          TRY OMARCHY FOR LINUX
        </p>
        <h1
          style={{ fontFamily: 'var(--font-mono)' }}
          className="mx-auto max-w-3xl text-2xl leading-snug font-medium tracking-tight text-text sm:text-3xl"
        >
          The Omarchy desktop.
          <br />
          In a window on your Linux PC.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base">
          Explore Omarchy’s apps, themes and keyboard-first workflow without
          replacing your distro or repartitioning a drive. Install it like any
          other app.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button nativeButton={false} render={<a href={INSTALLER} />} size="lg">
            <LinuxIcon />
            Download for Linux
            <DownloadIcon />
          </Button>
          <Button
            nativeButton={false}
            render={<a href="#install" />}
            size="lg"
            variant="outline"
          >
            How to install
          </Button>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-text-secondary">
          Free & open source · x86_64 · KVM · Flatpak · Preview
        </p>
      </section>
      <section className={`${wrap} pb-14 sm:pb-20`} aria-label="Product preview">
        <figure>
          <img
            src="/images/linux/desktop.webp"
            width="1280"
            height="800"
            className="aspect-[1280/800] w-full border border-border-subtle bg-bg-deep object-contain"
            alt="Try Omarchy in a window on Ubuntu, showing the Omarchy desktop."
          />
          <figcaption className="mt-3 text-xs text-text-secondary">
            Omarchy running in Try Omarchy on Ubuntu.
          </figcaption>
        </figure>
      </section>
      <section className={`${section} bg-surface`} id="install">
        <div className={wrap}>
          <SectionHeading
            title="Install in three steps."
            description="Most desktop distributions already support Flatpak. Ubuntu needs one command first."
          />
          <Tabs defaultValue="desktop" className="mt-8 flex-col">
            <TabsList aria-label="Install method" className="h-11! self-start">
              <TabsTrigger value="desktop" className="px-4">
                Software
              </TabsTrigger>
              <TabsTrigger value="ubuntu" className="px-4">
                Ubuntu
              </TabsTrigger>
              <TabsTrigger value="terminal" className="px-4">
                Terminal
              </TabsTrigger>
            </TabsList>
            <TabsContent value="desktop" className="max-w-2xl">
              <Steps
                steps={[
                  <>
                    {download} and open it. Your software center (GNOME
                    Software or KDE Discover) shows Try Omarchy. Choose{' '}
                    <strong className="text-text">Install</strong>.
                  </>,
                  openApp,
                  <>
                    Press <strong className="text-text">Super+Space</strong>{' '}
                    for Omarchy’s menu. Updates arrive through your software
                    center.
                  </>,
                ]}
              />
              <p className="mt-6 text-xs leading-relaxed text-text-secondary">
                No Flatpak support yet? Follow{' '}
                <a
                  className="underline underline-offset-4 hover:text-text"
                  href="https://flathub.org/en/setup"
                >
                  Flatpak’s setup guide
                </a>{' '}
                for your distribution first.
              </p>
            </TabsContent>
            <TabsContent value="ubuntu" className="max-w-2xl">
              <Steps
                steps={[
                  <>
                    Ubuntu’s App Center does not install Flatpaks. Add Software
                    with Flatpak support, then log out and back in:
                    <Command text="sudo apt install flatpak gnome-software gnome-software-plugin-flatpak" />
                  </>,
                  <>
                    {download} and open it with{' '}
                    <strong className="text-text">Software</strong>. Choose{' '}
                    <strong className="text-text">Install</strong>.
                  </>,
                  <>
                    {openApp} On Ubuntu 24.04, open it from the app menu rather
                    than Software’s Open button, which can fail with an{' '}
                    <code className={code}>ldconfig</code> error.
                  </>,
                ]}
              />
            </TabsContent>
            <TabsContent value="terminal" className="max-w-2xl">
              <Steps
                steps={[
                  <>
                    With Flatpak installed, run:
                    <Command text="flatpak install --user https://tryomarchy.com/linux.flatpakref" />
                  </>,
                  openApp,
                  <>
                    Update later with <code className={code}>flatpak update</code>,
                    or from your software center.
                  </>,
                ]}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>
      <section className={section}>
        <div className={`${wrap} grid gap-8 md:grid-cols-[1fr_2fr]`}>
          <SectionHeading title="Before you start." />
          <ul className="divide-y divide-border-subtle text-sm leading-relaxed text-text-secondary">
            {[
              'A 64-bit x86 PC with hardware virtualization (KVM). ARM is not supported.',
              'About 15 GB of free disk space. Omarchy sees a 24 GB disk, but only what it uses takes space.',
              'A Wayland or X11 desktop. Tested on GNOME, KDE Plasma and Xfce.',
              'The app runs in the Flatpak sandbox with no access to your home folder. Files reach it through your desktop’s file chooser.',
            ].map((item) => (
              <li key={item} className="flex gap-3 py-3 first:pt-0">
                <span aria-hidden="true" className="text-brand">
                  +
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className={`${section} bg-surface`}>
        <div className={`${wrap} grid gap-8 md:grid-cols-[1fr_2fr]`}>
          <SectionHeading title="Questions." />
          <div>
            {questions.map(([question, answer], index) => (
              <details
                key={question}
                open={index === 0}
                className="border-b border-border-subtle py-5 first:pt-0"
              >
                <summary className="cursor-pointer text-sm font-medium text-text focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
                  {question}
                </summary>
                <div className="mt-4 text-sm leading-relaxed text-text-secondary">
                  {answer}
                </div>
              </details>
            ))}
            <div className="mt-4 flex flex-wrap gap-x-6">
              <a className={link} href={HELP}>
                Help and troubleshooting
                <ArrowUpRightIcon className="size-4" />
              </a>
              <a className={link} href={`${REPO}/releases`}>
                Release notes
              </a>
              <a className={link} href={REPO}>
                Source code
              </a>
              <a className={link} href={`${REPO}/issues`}>
                Report a problem
              </a>
              <a className={link} href="/">
                Mac and Windows
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
