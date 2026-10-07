import React, { useState, useRef } from 'react';
import {
  ScanLine,
  Upload,
  Camera,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Info,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Trash2,
  FileCheck,
  ChevronRight,
  HelpCircle,
  Package,
  Layers,
  Leaf,
} from 'lucide-react';
import {
  identifyWasteImage,
  validateWasteImageFile,
  WasteIdentificationResult,
  WasteIdentificationError,
} from '../services/wasteIdentificationService';

interface AIWasteIdentifierPageProps {
  onReportWaste: (prefillData: {
    category: string;
    detectedItem: string;
    imageUrl: string;
    description: string;
  }) => void;
  setCurrentTab: (tab: string) => void;
}

const PRESET_TEST_IMAGES = [
  {
    name: 'Plastic Bottle',
    hint: 'plastic water bottle',
    url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    type: 'Plastic',
  },
  {
    name: 'Delivery Box',
    hint: 'cardboard shipping box',
    url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    type: 'Paper',
  },
  {
    name: 'Banana Peel',
    hint: 'banana peel food organic',
    url: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80',
    type: 'Organic',
  },
  {
    name: 'Soda Can',
    hint: 'aluminum beverage can',
    url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    type: 'Metal',
  },
  {
    name: 'Hazardous Battery',
    hint: 'battery chemical unit',
    url: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=800&q=80',
    type: 'Hazardous',
  },
  {
    name: 'Human Face (Non-Waste)',
    hint: 'human portrait selfie',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    type: 'Non-Waste Test',
  },
];

export const AIWasteIdentifierPage: React.FC<AIWasteIdentifierPageProps> = ({
  onReportWaste,
  setCurrentTab,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<WasteIdentificationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setErrorMessage(null);
    setResult(null);

    try {
      validateWasteImageFile(file);
      setSelectedFileName(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setSelectedImage(e.target.result as string);
        }
      };
      reader.onerror = () => {
        setErrorMessage('Failed to read the selected file. Please try another image.');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      if (err instanceof WasteIdentificationError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Invalid file. Please select a valid JPG, PNG, or WEBP photo under 10MB.');
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleIdentifyWaste = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const data = await identifyWasteImage(selectedImage, selectedFileName);
      setResult(data);
    } catch (err: any) {
      setErrorMessage(err?.message || 'An error occurred during vision analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setSelectedFileName('');
    setResult(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleReportThisWaste = () => {
    if (!result || !selectedImage) return;

    // Map AI Category to Report Pollution Type
    let pollutionType = 'Plastic/Waste';
    if (result.category === 'Hazardous Waste') pollutionType = 'Other';
    else if (result.category === 'Paper' || result.category === 'Metal' || result.category === 'Glass') {
      pollutionType = 'Plastic/Waste';
    }

    const prefillDescription = `AI-Identified Discarded Item: ${result.detectedItem} (${result.category} waste category).\nReason: ${result.reason}\nRecommended disposal: ${result.disposalMethod}\nEnvironmental note: ${result.environmentalImpact}`;

    onReportWaste({
      category: pollutionType,
      detectedItem: result.detectedItem,
      imageUrl: selectedImage,
      description: prefillDescription,
    });
  };

  const categoryColorMap: Record<string, { bg: string; text: string; border: string }> = {
    Plastic: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
    Paper: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
    Glass: { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' },
    Metal: { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' },
    Organic: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
    'E-Waste': { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
    'Hazardous Waste': { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-300' },
    Other: { bg: 'bg-stone-100', text: 'text-stone-800', border: 'border-stone-300' },
  };

  const steps = [
    { num: '1', title: 'Upload waste image', desc: 'Take a clear photo with your camera or select an image from your device.' },
    { num: '2', title: 'AI analyzes the image', desc: "Gemini's multimodal neural vision analyzes surface textures and geometries." },
    { num: '3', title: 'Waste category is identified', desc: 'Material is classified into one of 8 standardized environmental categories.' },
    { num: '4', title: 'Get disposal guidance', desc: 'Receive practical recycling instructions, impact analysis, and alternatives.' },
    { num: '5', title: 'Take responsible action', desc: 'Dispose correctly or file a public environmental report directly into the system.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>Multimodal Vision Technology</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight">
          AI Waste Identifier
        </h1>
        <p className="text-stone-600 text-sm sm:text-base mt-2">
          Unsure how to properly dispose of or recycle an item? Upload a photo or take a picture with your camera to identify the material, avoid landfill contamination, and get instant guidance.
        </p>
      </div>

      {/* Main Interactive Scanning Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Upload / Preview Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-md space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <ScanLine className="w-5 h-5 text-emerald-700" />
              <span>Waste Image Scanner</span>
            </h2>
            {selectedImage && (
              <button
                onClick={handleReset}
                className="text-xs font-bold text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Upload Drop Zone / Image Preview */}
          {!selectedImage ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center transition-all ${
                dragActive
                  ? 'border-emerald-600 bg-emerald-50/80 scale-[1.01]'
                  : 'border-stone-300 hover:border-emerald-500 bg-stone-50/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileInputChange}
                className="hidden"
                id="waste-file-input"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileInputChange}
                className="hidden"
                id="waste-camera-input"
              />

              <div className="w-16 h-16 rounded-2xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center mx-auto mb-4 shadow-xs">
                <Upload className="w-8 h-8 stroke-[2.2]" />
              </div>

              <h3 className="text-base font-bold text-stone-900 mb-1">
                Upload Waste Image
              </h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto mb-5 leading-relaxed">
                Drag and drop your image here, browse your device, or snap a photo directly with your camera.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <label
                  htmlFor="waste-file-input"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-emerald-700/20 active:scale-98 transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose Photo</span>
                </label>

                <label
                  htmlFor="waste-camera-input"
                  className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs flex items-center gap-2 border border-stone-200 active:scale-98 transition-all cursor-pointer sm:flex"
                >
                  <Camera className="w-4 h-4 text-emerald-700" />
                  <span>Use Camera</span>
                </label>
              </div>

              <p className="text-[11px] text-stone-400 mt-4">
                Supported formats: JPG, JPEG, PNG, WEBP (Max 10MB)
              </p>
            </div>
          ) : (
            /* Selected Image Preview with Scanner Overlay */
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/11] bg-black/5 border border-stone-200 shadow-inner group">
                <img
                  src={selectedImage}
                  alt="Waste to be analyzed"
                  className="w-full h-full object-cover"
                />

                {/* Scanning overlay animation when analyzing */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-2xs flex flex-col items-center justify-center text-white p-4 animate-in fade-in">
                    <div className="relative w-20 h-20 mb-4">
                      <div className="absolute inset-0 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin"></div>
                      <ScanLine className="w-8 h-8 text-emerald-300 absolute inset-0 m-auto animate-pulse" />
                    </div>
                    <p className="text-sm font-extrabold text-white tracking-wide">
                      AI is analyzing your waste image...
                    </p>
                    <p className="text-xs text-emerald-200/80 mt-1 max-w-xs text-center">
                      Inspecting visual properties, polymer traits, and environmental guidelines
                    </p>
                  </div>
                )}

                {/* Image info bar */}
                <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/40 text-[11px] font-semibold text-stone-700 flex items-center justify-between">
                  <span className="truncate max-w-[200px]">{selectedFileName || 'Uploaded Photo'}</span>
                  <span className="text-emerald-700 font-bold">Ready to Analyze</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleIdentifyWaste}
                  disabled={isAnalyzing}
                  className="w-full sm:flex-1 py-3.5 bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-600 hover:from-emerald-800 hover:to-green-700 text-white font-extrabold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/25 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing Waste...</span>
                    </>
                  ) : (
                    <>
                      <ScanLine className="w-5 h-5 text-amber-300" />
                      <span>Identify Waste</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isAnalyzing}
                  className="w-full sm:w-auto px-5 py-3.5 border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold rounded-2xl text-xs transition-colors cursor-pointer"
                >
                  Try Another Image
                </button>
              </div>
            </div>
          )}

          {/* Quick Demo Presets */}
          <div className="pt-2 border-t border-stone-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
              Try Sample Photos for Instant Testing:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_TEST_IMAGES.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setSelectedImage(preset.url);
                    setSelectedFileName(preset.hint);
                    setResult(null);
                    setErrorMessage(null);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border border-stone-200 transition-colors cursor-pointer"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Professional Result Card or Empty/Error State */}
        <div className="lg:col-span-6 space-y-6">
          {/* Error Alert Display */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-rose-900 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-sm text-rose-950">Unable to Complete Analysis</h4>
                  <p className="text-xs text-rose-800 mt-1 leading-relaxed">{errorMessage}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-rose-200/60 flex items-center justify-end">
                <button
                  onClick={handleReset}
                  className="text-xs font-bold text-rose-900 hover:underline"
                >
                  Try Another Image →
                </button>
              </div>
            </div>
          )}

          {/* Result Card */}
          {result ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-lg space-y-6 animate-in zoom-in-95 duration-200">
              {/* Card Header & AI Assisted Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>AI-Assisted Classification</span>
                  </span>
                  <h3 className="text-2xl font-black text-stone-900 mt-1 leading-tight">
                    {result.detectedItem}
                  </h3>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span
                    className={`text-xs font-extrabold px-3 py-1 rounded-full border shadow-2xs ${
                      categoryColorMap[result.category]?.bg || 'bg-stone-100'
                    } ${categoryColorMap[result.category]?.text || 'text-stone-800'} ${
                      categoryColorMap[result.category]?.border || 'border-stone-200'
                    }`}
                  >
                    Category: {result.category}
                  </span>
                </div>
              </div>

              {/* Critical Safety Warning (if hazardous) */}
              {result.isHazardous && result.safetyWarning && (
                <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 text-rose-950 space-y-1.5 animate-pulse">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-rose-800">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>Hazardous Material Warning</span>
                  </div>
                  <p className="text-xs font-bold leading-relaxed">{result.safetyWarning}</p>
                </div>
              )}

              {/* Multiple Objects Note (if detected) */}
              {result.multipleObjectsDetected && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Multiple objects detected:</span>{' '}
                    <span>
                      {result.multipleObjectsNote ||
                        'Identified the primary prominent waste item. Please sort multiple materials separately.'}
                    </span>
                  </div>
                </div>
              )}

              {/* Non-Waste Detected Case */}
              {!result.isWaste && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>No Discarded Waste Identified</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    {result.message ||
                      'The AI vision model could not identify a clear waste, recyclable, or discarded item in this image. Please take a clearer photo showing the waste item centered.'}
                  </p>
                </div>
              )}

              {/* Key Metrics: Confidence & Category */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">
                    Confidence Level
                  </span>
                  <span className="font-extrabold text-emerald-800 text-sm mt-0.5 block flex items-center gap-1">
                    <span>{result.confidence}</span>
                    <span className="text-[11px] text-stone-400">({result.estimatedConfidenceScore}%)</span>
                  </span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">
                    Waste Category
                  </span>
                  <span className="font-extrabold text-stone-900 text-sm mt-0.5 block truncate">
                    {result.category}
                  </span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">
                    Classification Model
                  </span>
                  <span className="font-bold text-stone-700 text-xs mt-0.5 block">
                    Gemini 2.5 Flash
                  </span>
                </div>
              </div>

              {/* Reason for Classification */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Reason for Classification
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 p-3.5 bg-stone-50 rounded-2xl border border-stone-200 leading-relaxed">
                  {result.reason}
                </p>
              </div>

              {/* Recommended Disposal Method */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Recommended Disposal Method</span>
                </h4>
                <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-xs sm:text-sm font-semibold text-emerald-950 leading-relaxed">
                  {result.disposalMethod}
                </div>
              </div>

              {/* Environmental Impact */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Environmental Impact
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {result.environmentalImpact}
                </p>
              </div>

              {/* Eco-Friendly Alternative */}
              {result.ecoAlternative && result.ecoAlternative !== 'N/A' && (
                <div className="pt-2 border-t border-stone-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                    🌱 Eco-Friendly Alternative
                  </h4>
                  <p className="text-xs font-bold text-stone-900">
                    {result.ecoAlternative}
                  </p>
                </div>
              )}

              {/* Action Buttons: Try Another Image & Report This Waste */}
              <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleReportThisWaste}
                  className="w-full sm:flex-1 py-3.5 bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-900/20 active:scale-98 transition-all cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-300" />
                  <span>Report this Waste to Wardens</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-5 py-3.5 border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold rounded-2xl text-xs transition-colors cursor-pointer"
                >
                  Try Another Image
                </button>
              </div>

              {/* Legal disclaimer */}
              <p className="text-[10px] text-stone-400 text-center leading-normal">
                * Note: Waste classifications are AI-assisted estimates. Always review local municipal bin colors and neighborhood regulations before final sorting.
              </p>
            </div>
          ) : (
            /* Idle Placeholder Guide */
            <div className="bg-stone-50 rounded-3xl p-8 border border-stone-200/80 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-white text-emerald-700 flex items-center justify-center mx-auto shadow-sm border border-stone-200">
                <Package className="w-8 h-8 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                Awaiting Waste Image
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                Upload or capture an image on the left. The result card will display the detected item, material category, disposal instructions, and environmental footprint.
              </p>

              <div className="pt-4 text-left max-w-sm mx-auto space-y-2 text-xs text-stone-600 border-t border-stone-200/60">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Plastic, Paper, Metal, Glass, Organic, E-Waste</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>Hazardous chemical & battery detection alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>Pre-fills pollution report with 1-click integration</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* "How AI Waste Identification Works" Section */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/90 shadow-sm space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Technical Methodology
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            How AI Waste Identification Works
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            From optical recognition to community remediation in 5 streamlined steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((st) => (
            <div
              key={st.num}
              className="p-5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2 text-left relative flex flex-col justify-between"
            >
              <div>
                <span className="w-7 h-7 rounded-lg bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center mb-3">
                  {st.num}
                </span>
                <h4 className="text-sm font-bold text-stone-900 leading-snug">{st.title}</h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
