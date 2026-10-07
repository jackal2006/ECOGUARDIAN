import React, { useState, useMemo } from 'react';
import {
  Search,
  ScanLine,
  Upload,
  CheckCircle2,
  XCircle,
  Sparkles,
  Info,
  Package,
  FileText,
  Wine,
  Disc,
  Apple,
  Cpu,
  AlertTriangle,
  ArrowRight,
  Loader2,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { WASTE_CATEGORIES, COMMON_WASTE_SEARCH_ITEMS } from '../data/mockData';
import { AIWasteAnalysisResult, WasteCategory, WasteItem } from '../types';
import { classifyWasteImage } from '../services/wasteClassifier';

const AI_DEMO_PRESETS = [
  {
    name: 'Plastic Bottle',
    fileHint: 'plastic bottle',
    url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Cardboard Box',
    fileHint: 'cardboard box',
    url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Banana Peel',
    fileHint: 'fruit banana peel',
    url: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Alkaline Battery',
    fileHint: 'electronic battery',
    url: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Aluminum Can',
    fileHint: 'aluminum soda can',
    url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
  },
];

export const WasteGuidePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WasteCategory>(WASTE_CATEGORIES[0]);

  // AI Scanner state
  const [scannerImage, setScannerImage] = useState<string>('');
  const [scannerImageHint, setScannerImageHint] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIWasteAnalysisResult | null>(null);

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return COMMON_WASTE_SEARCH_ITEMS.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.disposalMethod.toLowerCase().includes(q) ||
        item.tips.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // File Upload for AI Scanner
  const handleScannerFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScannerImageHint(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setScannerImage(event.target.result as string);
        setAnalysisResult(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRunAIAnalysis = async () => {
    if (!scannerImage) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await classifyWasteImage(scannerImage, scannerImageHint);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'plastic':
        return Package;
      case 'paper':
        return FileText;
      case 'glass':
        return Wine;
      case 'metal':
        return Disc;
      case 'organic':
        return Apple;
      case 'e-waste':
        return Cpu;
      case 'hazardous':
        return AlertTriangle;
      default:
        return Package;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Page Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
          Circular Economy Guide
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight">
          Comprehensive Waste & Recycling Guide
        </h1>
        <p className="text-stone-600 text-sm sm:text-base mt-2">
          Learn correct bin segregation, discover municipal disposal pathways, and use our AI Vision tool to identify unknown waste items instantly.
        </p>
      </div>

      {/* AI Waste Scanner Section */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* AI Intro & Controls */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>AI Vision Material Classification</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Identify My Waste with AI
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Upload a photograph of any discarded item. Our neural vision classifier categorizes it into <strong>Plastic, Paper, Glass, Metal, Organic, E-Waste</strong>, calculates confidence, and gives instant recycling guidance.
            </p>

            {/* Presets for instant evaluation */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                1-Click Test Photos for Presentation:
              </span>
              <div className="flex flex-wrap gap-2">
                {AI_DEMO_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setScannerImage(preset.url);
                      setScannerImageHint(preset.fileHint);
                      setAnalysisResult(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-emerald-100 border border-white/10 transition-colors cursor-pointer"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload Box */}
            <div className="pt-2">
              <input
                type="file"
                accept="image/*"
                id="waste-ai-file"
                onChange={handleScannerFile}
                className="hidden"
              />
              <div className="flex flex-wrap items-center gap-3">
                <label
                  htmlFor="waste-ai-file"
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Waste Photo</span>
                </label>

                {scannerImage && (
                  <button
                    type="button"
                    onClick={handleRunAIAnalysis}
                    disabled={isAnalyzing}
                    className="px-5 py-2.5 bg-white text-emerald-900 font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-md hover:bg-emerald-50 cursor-pointer disabled:opacity-50 transition-colors"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                        <span>Analyzing Vision Features...</span>
                      </>
                    ) : (
                      <>
                        <ScanLine className="w-4 h-4 text-emerald-700" />
                        <span>Classify with AI Vision</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* AI Preview & Result Pane */}
          <div className="lg:col-span-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-5 min-h-[320px] flex flex-col justify-center">
              {!scannerImage ? (
                <div className="text-center py-10 space-y-3">
                  <ScanLine className="w-12 h-12 text-emerald-300/60 mx-auto animate-pulse" />
                  <p className="text-sm font-semibold text-emerald-100">
                    No image uploaded yet
                  </p>
                  <p className="text-xs text-emerald-300/80 max-w-xs mx-auto">
                    Select a test preset above or upload a photo to inspect its recyclability and zero-waste disposal instructions.
                  </p>
                </div>
              ) : isAnalyzing ? (
                <div className="text-center py-12 space-y-4">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin"></div>
                    <Sparkles className="w-6 h-6 text-emerald-300 absolute inset-0 m-auto" />
                  </div>
                  <p className="text-sm font-bold text-white">Neural Vision Processing</p>
                  <p className="text-xs text-emerald-200">
                    Evaluating polymer signatures, material boundaries & disposal registry...
                  </p>
                </div>
              ) : analysisResult ? (
                /* Full AI Result Card */
                <div className="space-y-4 text-stone-900 bg-white rounded-2xl p-5 shadow-xl animate-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                        Classified Waste Type
                      </span>
                      <h4 className="text-base font-extrabold text-stone-900 leading-snug">
                        {analysisResult.wasteType}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-stone-400 block uppercase">Confidence</span>
                      <span className="text-xs font-black px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-md">
                        {analysisResult.confidence}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                      <span className="text-[10px] font-bold text-stone-400 uppercase block">Category</span>
                      <span className="font-extrabold text-emerald-800 text-xs mt-0.5 block">
                        {analysisResult.category}
                      </span>
                    </div>
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                      <span className="text-[10px] font-bold text-stone-400 uppercase block">Recyclable</span>
                      <span className="font-extrabold text-stone-800 text-xs mt-0.5 block">
                        {analysisResult.recyclable ? 'Yes (Follow Steps)' : 'General Trash / Special'}
                      </span>
                    </div>
                  </div>

                  {/* Disposal Method */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                      How to Dispose
                    </span>
                    <p className="text-xs text-stone-800 font-semibold mt-0.5 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
                      {analysisResult.disposalMethod}
                    </p>
                  </div>

                  {/* Environmental Impact */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                      Environmental Impact
                    </span>
                    <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                      {analysisResult.environmentalImpact}
                    </p>
                  </div>

                  {/* Eco-Friendly Alternative */}
                  <div className="pt-2 border-t border-stone-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                      🌱 Eco-Friendly Alternative
                    </span>
                    <p className="text-xs font-bold text-stone-800 mt-0.5">
                      {analysisResult.ecoAlternative}
                    </p>
                  </div>
                </div>
              ) : (
                /* Photo ready to analyze */
                <div className="space-y-4 text-center">
                  <div className="h-44 rounded-xl overflow-hidden bg-black/20 aspect-[16/10] mx-auto border border-white/20">
                    <img
                      src={scannerImage}
                      alt="Selected waste preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={handleRunAIAnalysis}
                    className="w-full py-3 bg-white text-emerald-950 font-extrabold rounded-xl text-xs shadow-md hover:bg-emerald-50 transition-colors cursor-pointer"
                  >
                    Click to Run AI Analysis
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Search Bar Section */}
      <section className="space-y-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-stone-900">
            Search Your Waste Item
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Type common products (e.g. "plastic bottle", "battery", "pizza box", "smartphone") for instant handling tips.
          </p>
        </div>

        <div className="relative max-w-2xl">
          <Search className="w-5 h-5 text-stone-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your waste item..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-stone-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-3.5 text-xs text-stone-400 hover:text-stone-600 font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Search Results Preview */}
        {searchQuery.trim() && (
          <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Search Results ({searchResults.length})
            </h3>

            {searchResults.length === 0 ? (
              <p className="text-xs text-stone-500 py-3">
                No exact match found for "{searchQuery}". Check the category guide tabs below!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-2 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-stone-900">{item.name}</h4>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-xs text-stone-700">
                      <strong>Disposal:</strong> {item.disposalMethod}
                    </p>

                    <p className="text-xs text-emerald-800 bg-white p-2.5 rounded-xl border border-emerald-100">
                      <strong>Tip:</strong> {item.tips}
                    </p>

                    {item.alternative && (
                      <p className="text-[11px] text-stone-500">
                        🌱 <em>Eco Alternative: {item.alternative}</em>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 7 Core Categories Explorer */}
      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">
            Disposal Guidelines by Waste Category
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Select a category to view specific examples, recycling metrics, environmental impacts, and Do's & Don'ts.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {WASTE_CATEGORIES.map((cat) => {
            const Icon = getCategoryIcon(cat.id);
            const isSelected = selectedCategory.id === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-md shadow-emerald-800/20'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-300' : 'text-stone-400'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Category Deep Dive Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-sm space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                Standard Municipal Bin
              </span>
              <h3 className="text-2xl font-extrabold text-stone-900 mt-0.5">
                {selectedCategory.name} Waste
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-stone-500">Designated Bin:</span>
              <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-stone-100 text-stone-800 border border-stone-200">
                {selectedCategory.binColor}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Examples & Disposal */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Common Example Items
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCategory.exampleItems.map((ex) => (
                    <span
                      key={ex}
                      className="px-3 py-1.5 bg-stone-100 text-stone-800 rounded-xl text-xs font-medium"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Correct Disposal Method
                </h4>
                <p className="text-xs sm:text-sm font-semibold text-stone-800 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  {selectedCategory.disposalMethod}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Recycling Information
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {selectedCategory.recyclingInfo}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Environmental Impact
                </h4>
                <p className="text-xs text-rose-700 font-medium leading-relaxed bg-rose-50/70 p-3 rounded-xl border border-rose-100">
                  {selectedCategory.environmentalImpact}
                </p>
              </div>
            </div>

            {/* Dos and Don'ts Checklist */}
            <div className="space-y-6 bg-stone-50/80 p-6 rounded-2xl border border-stone-200/80">
              {/* DOs */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>DO'S - Best Practices</span>
                </h4>
                <ul className="space-y-2 text-xs text-stone-700">
                  {selectedCategory.dos.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* DONTs */}
              <div className="space-y-3 pt-4 border-t border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>DON'TS - Avoid These Mistakes</span>
                </h4>
                <ul className="space-y-2 text-xs text-stone-700">
                  {selectedCategory.donts.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold mt-0.5">✗</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
