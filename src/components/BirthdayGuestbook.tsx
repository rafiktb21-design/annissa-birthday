import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquareHeart, Send, CheckCircle2, Wifi } from 'lucide-react'
import { websiteConfig, type GuestbookWish } from '../data/websiteConfig'
import { audio } from '../utils/audio'
import {
  db,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  isFirebaseConfigured,
} from '../services/firebase'

const EMOJI_OPTIONS = ['💖', '🎂', '✨', '🌸', '🎁', '🎉']

export default function BirthdayGuestbook() {
  const cfg = websiteConfig.guestbook
  const [wishes, setWishes] = useState<GuestbookWish[]>(cfg.initialWishes)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState('💖')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successNotice, setSuccessNotice] = useState(false)

  // Real-time synchronization with Firebase if configured, otherwise localStorage
  useEffect(() => {
    if (isFirebaseConfigured && db) {
      try {
        const wishesRef = collection(db, 'wishes')
        const q = query(wishesRef, orderBy('createdAt', 'desc'))

        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const remoteWishes: GuestbookWish[] = snapshot.docs.map((doc) => {
              const data = doc.data()
              const ts = data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
              const dateStr = ts.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
              const timeStr = ts.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
              })

              return {
                id: doc.id,
                name: data.name || 'Anonim',
                message: data.message || '',
                emoji: data.emoji || '💖',
                timestamp: `${dateStr} • ${timeStr}`,
              }
            })

            // Combine remote wishes with curated initial wishes if remote is empty
            if (remoteWishes.length > 0) {
              setWishes(remoteWishes)
            } else {
              setWishes(cfg.initialWishes)
            }
          },
          (err) => {
            console.warn('Firestore subscription notice:', err)
          }
        )

        return () => unsubscribe()
      } catch (err) {
        console.warn('Firebase error:', err)
      }
    } else {
      // LocalStorage fallback
      try {
        const saved = localStorage.getItem('annissa_birthday_wishes')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setWishes(parsed)
          }
        }
      } catch {
        // ignore
      }
    }
  }, [cfg.initialWishes])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return

    setIsSubmitting(true)
    audio.playSparkle()

    const now = new Date()
    const dateStr = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    const timeStr = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    })

    const newWish: GuestbookWish = {
      id: Date.now().toString(),
      name: name.trim(),
      message: message.trim(),
      emoji: selectedEmoji,
      timestamp: `${dateStr} • ${timeStr}`,
    }

    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, 'wishes'), {
          name: name.trim(),
          message: message.trim(),
          emoji: selectedEmoji,
          createdAt: serverTimestamp(),
        })
      } catch (err) {
        console.error('Gagal mengirim ke Firebase, menyimpan di lokal:', err)
        // Fallback to local
        const updated = [newWish, ...wishes]
        setWishes(updated)
        localStorage.setItem('annissa_birthday_wishes', JSON.stringify(updated))
      }
    } else {
      // LocalStorage mode
      const updated = [newWish, ...wishes]
      setWishes(updated)
      try {
        localStorage.setItem('annissa_birthday_wishes', JSON.stringify(updated))
      } catch {
        // ignore
      }
    }

    setName('')
    setMessage('')
    setIsSubmitting(false)
    setSuccessNotice(true)
    setTimeout(() => setSuccessNotice(false), 4000)
  }

  return (
    <section id="guestbook" className="relative w-full py-20 sm:py-28 px-4 sm:px-6 bg-[#FFF6F0] overflow-hidden flex flex-col items-center">
      <div className="site-container relative z-10 max-w-xl mx-auto flex flex-col items-center">
        {/* Section Tag */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#F7DCE5]/70 border border-[#D8B77E]/50 text-[#674A49] mb-4">
          <MessageSquareHeart className="w-3.5 h-3.5 text-[#C98299]" />
          <span className="font-quicksand text-xs font-bold tracking-[0.2em] uppercase">
            {cfg.heading}
          </span>
          <MessageSquareHeart className="w-3.5 h-3.5 text-[#C98299]" />
        </div>

        <h2 className="font-playfair text-3xl sm:text-5xl text-[#674A49] font-normal mb-2 text-center">
          Kirim Ucapan & Doa
        </h2>

        <p className="font-cormorant italic text-lg sm:text-xl text-[#C98299] mb-8 text-center">
          "{cfg.subtitle}"
        </p>

        {/* Input Form Card */}
        <div className="w-full bg-[#FFFDFB] rounded-3xl p-6 sm:p-8 border border-[#D8B77E]/50 shadow-xl mb-12">
          {/* Realtime status badge */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#D8B77E]/20 text-[11px] font-quicksand">
            <span className="text-[#674A49]/70 font-semibold">Status Buku Doa:</span>
            {isFirebaseConfigured ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                <Wifi className="w-3 h-3 text-emerald-600 animate-pulse" />
                Online Real-Time (Firebase)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[#674A49]/60 bg-[#F7DCE5]/50 px-2.5 py-0.5 rounded-full">
                Tersimpan di Browser Lokal
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block font-quicksand text-xs font-bold text-[#674A49] uppercase tracking-wider mb-1.5">
                Nama Kamu
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Sahabat, Rafi, Teman..."
                className="w-full px-4 py-3 rounded-xl bg-[#FFF9F5] border border-[#D8B77E]/40 font-dmsans text-sm text-[#594745] placeholder-[#594745]/40 focus:outline-none focus:border-[#C98299] transition-colors"
              />
            </div>

            <div>
              <label className="block font-quicksand text-xs font-bold text-[#674A49] uppercase tracking-wider mb-1.5">
                Ucapan & Doa Ulang Tahun
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan harapan dan doa terbaikmu untuk Annissa..."
                className="w-full px-4 py-3 rounded-xl bg-[#FFF9F5] border border-[#D8B77E]/40 font-dmsans text-sm text-[#594745] placeholder-[#594745]/40 focus:outline-none focus:border-[#C98299] transition-colors resize-none"
              />
            </div>

            {/* Emoji Selection */}
            <div>
              <label className="block font-quicksand text-xs font-bold text-[#674A49] uppercase tracking-wider mb-1.5">
                Pilih Emoji Doa
              </label>
              <div className="flex items-center gap-2">
                {EMOJI_OPTIONS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setSelectedEmoji(em)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                      selectedEmoji === em
                        ? 'bg-[#F7DCE5] border-2 border-[#C98299] scale-110 shadow-xs'
                        : 'bg-[#FFF9F5] border border-[#D8B77E]/30 hover:bg-[#F7DCE5]/40'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              type="submit"
              className="mt-2 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C98299] to-[#A25B72] text-[#FFF9F5] font-quicksand text-xs sm:text-sm font-bold tracking-[0.2em] uppercase shadow-md shadow-[#C98299]/20 border border-[#D8B77E]/50 flex items-center justify-center gap-2 cursor-pointer hover:brightness-105"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Mengirim...' : 'Kirim Ucapan Hangat'}</span>
            </motion.button>
          </form>

          <AnimatePresence>
            {successNotice && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-quicksand font-bold flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Ucapanmu berhasil terkirim dan tersimpan!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Wishes List Feed */}
        <div className="w-full space-y-4">
          <h3 className="font-playfair text-xl text-[#674A49] font-medium mb-4 text-center">
            Pesan & Doa ({wishes.length})
          </h3>

          <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
            {wishes.map((w) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 sm:p-5 rounded-2xl bg-[#FFFDFB] border border-[#D8B77E]/30 shadow-sm text-left flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-full bg-[#F7DCE5]/70 flex items-center justify-center text-lg shrink-0 border border-[#D8B77E]/30">
                  {w.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-playfair text-sm sm:text-base font-semibold text-[#674A49]">
                      {w.name}
                    </span>
                    <span className="font-quicksand text-[10px] text-[#594745]/50">
                      {w.timestamp}
                    </span>
                  </div>
                  <p className="font-dmsans text-xs sm:text-sm text-[#594745]/90 leading-relaxed">
                    {w.message}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
