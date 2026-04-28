import { useState } from 'react'
import { 
  Sparkles, Wand2, Languages, Type, 
  Copy, CheckCircle2, RefreshCw, 
  FileText, Layout, ArrowRight,
  Eye, Save, Send, Globe, MessageSquare
} from 'lucide-react'
import { clsx } from 'clsx'

export function ContentStudioPage() {
  const [inputText, setInputText] = useState('Visite guidée du Palais Bahia et des tombeaux Saadiens avec un historien local.')
  const [tone, setTone] = useState<'luxury' | 'adventurous' | 'educational'>('luxury')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState({
    fr: '',
    en: '',
    ar: ''
  })

  const generateStorytelling = () => {
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedContent({
        fr: "Plongez dans l'opulence des siècles passés. Une odyssée privée au cœur du Palais Bahia, où chaque azulejo raconte une histoire de pouvoir et de beauté, guidée par l'expertise d'un érudit de la ville rouge.",
        en: "Immerse yourself in the opulence of past centuries. A private odyssey in the heart of the Bahia Palace, where every tile tells a story of power and beauty, guided by the expertise of a Red City scholar.",
        ar: "انغمس في فخامة القرون الماضية. ملحمة خاصة في قلب قصر الباهية ، حيث تحكي كل بلاطة قصة قوة وجمال ، بتوجيه من خبرة أحد علماء المدينة الحمراء."
      })
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 transition-colors">
      
      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto flex justify-between items-end mb-12">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-rihla uppercase tracking-widest mb-4">
             Studio Créatif IA <Sparkles size={12} /> Storytelling
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-cream tracking-tighter">Magic Content Studio</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium italic">
             Transformez vos notes techniques en récits de voyage immersifs et multilingues.
          </p>
        </div>
        
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm">
              <Layout size={14} /> Templates Luxe
           </button>
           <button className="flex items-center gap-2 px-6 py-3 bg-rihla text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rihla/20">
              <Save size={14} /> Enregistrer en Bibliothèque
           </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8">
        
        {/* ── LEFT: INPUT & CONFIG (5 cols) ───────────────────────── */}
        <div className="col-span-5 space-y-6">
           <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-200 dark:border-white/10 shadow-sm">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Input Technique</h3>
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-40 p-5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl text-sm outline-none focus:border-rihla resize-none font-medium"
                placeholder="Ex: Diner dans le desert d'Agafay au coucher du soleil..."
              />
              
              <div className="mt-8 space-y-6">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ton & Style</h4>
                 <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'luxury', label: 'Luxe', icon: '💎' },
                      { id: 'adventurous', label: 'Aventure', icon: '🏜️' },
                      { id: 'educational', label: 'Culture', icon: '📚' },
                    ].map(t => (
                      <button 
                        key={t.id}
                        onClick={() => setTone(t.id as any)}
                        className={clsx(
                          "py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                          tone === t.id ? "bg-rihla/10 border-rihla text-rihla" : "bg-slate-50 dark:bg-white/5 border-transparent text-slate-400"
                        )}
                      >
                         <span className="text-lg block mb-1">{t.icon}</span>
                         {t.label}
                      </button>
                    ))}
                 </div>
              </div>

              <button 
                onClick={generateStorytelling}
                disabled={isGenerating}
                className="w-full mt-10 py-5 bg-slate-900 dark:bg-rihla text-white rounded-[24px] text-xs font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 hover:-translate-y-1 transition-all disabled:opacity-50"
              >
                 {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : <Wand2 size={18} />}
                 {isGenerating ? 'Enchantement en cours…' : 'Générer le Storytelling'}
              </button>
           </div>

           <div className="bg-indigo-600 rounded-[40px] p-8 text-white shadow-xl shadow-indigo-600/20">
              <Languages size={32} className="mb-4 opacity-50" />
              <h4 className="text-lg font-black mb-2">Traduction Culturelle</h4>
              <p className="text-xs text-white/70 font-medium leading-relaxed">
                 L'IA ne traduit pas mot-à-mot, elle adapte le ton de luxe aux spécificités culturelles de chaque langue.
              </p>
           </div>
        </div>

        {/* ── RIGHT: GENERATED OUTPUT (7 cols) ────────────────────── */}
        <div className="col-span-7 space-y-6">
           
           {/* Output Card */}
           <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden flex flex-col h-[700px]">
              <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                       <CheckCircle2 size={18} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Résultats Générés</span>
                 </div>
                 <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-rihla"><Copy size={16} /></button>
                    <button className="p-2 text-slate-400 hover:text-rihla"><RefreshCw size={16} /></button>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                 
                 {/* French Version */}
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-2 mb-4">
                       <span className="text-[9px] font-black bg-slate-100 dark:bg-white/5 px-2 py-1 rounded uppercase">Français</span>
                    </div>
                    <div className={clsx(
                      "text-xl font-medium leading-relaxed italic text-slate-800 dark:text-slate-200",
                      !generatedContent.fr && "opacity-20 select-none"
                    )}>
                       {generatedContent.fr || "Votre récit apparaîtra ici..."}
                    </div>
                 </div>

                 {/* English Version */}
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-2 mb-4">
                       <span className="text-[9px] font-black bg-slate-100 dark:bg-white/5 px-2 py-1 rounded uppercase">English</span>
                    </div>
                    <div className={clsx(
                      "text-lg font-medium leading-relaxed text-slate-600 dark:text-slate-400",
                      !generatedContent.en && "opacity-20 select-none"
                    )}>
                       {generatedContent.en || "English translation will be here..."}
                    </div>
                 </div>

                 {/* Arabic Version */}
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="flex items-center gap-2 mb-4">
                       <span className="text-[9px] font-black bg-slate-100 dark:bg-white/5 px-2 py-1 rounded uppercase tracking-normal">العربية</span>
                    </div>
                    <div className={clsx(
                      "text-2xl font-bold leading-loose text-slate-600 dark:text-slate-400 text-right font-serif",
                      !generatedContent.ar && "opacity-20 select-none"
                    )} dir="rtl">
                       {generatedContent.ar || "الترجمة العربية ستظهر هنا..."}
                    </div>
                 </div>

              </div>

              {/* Action Footer */}
              <div className="p-8 bg-slate-50 dark:bg-white/2 border-t border-slate-100 dark:border-white/5">
                 <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl">
                    <ArrowRight size={14} /> Injecter dans la Proposition PDF
                 </button>
              </div>
           </div>

        </div>

      </div>
    </div>
  )
}
