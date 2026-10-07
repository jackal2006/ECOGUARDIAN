import React, { useState } from 'react';
import {
  AlertTriangle,
  Upload,
  MapPin,
  Calendar,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Info,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PollutionReport, PollutionType, SeverityLevel } from '../types';
import { submitPollutionReport } from '../services/firebaseService';

interface ReportPollutionPageProps {
  onReportSubmitted: (report: PollutionReport) => void;
  userReports: PollutionReport[];
  openAuthModal: () => void;
  onNavigateTab?: (tab: string) => void;
  prefillData?: {
    category?: string;
    detectedItem?: string;
    imageUrl?: string;
    description?: string;
  } | null;
}

const SAMPLE_INCIDENT_IMAGES = [
  {
    name: 'Industrial Effluent',
    url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Plastic Dump Site',
    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Black Smoke Exhaust',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Canopy Clear-Cutting',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
  },
];

export const ReportPollutionPage: React.FC<ReportPollutionPageProps> = ({
  onReportSubmitted,
  userReports,
  openAuthModal,
  onNavigateTab,
  prefillData,
}) => {
  const { userProfile, currentUser, isAdmin } = useAuth();

  const [localRecentReports, setLocalRecentReports] = useState<PollutionReport[]>(() => {
    try {
      const raw = localStorage.getItem('eco_user_submitted_reports');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [pollutionType, setPollutionType] = useState<PollutionType>(() => {
    if (prefillData?.category) {
      if (['Water', 'Plastic/Waste', 'Air', 'Noise', 'Deforestation', 'Other'].includes(prefillData.category)) {
        return prefillData.category as PollutionType;
      }
      return 'Plastic/Waste';
    }
    return 'Water';
  });
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState(prefillData?.description || '');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [severity, setSeverity] = useState<SeverityLevel>('Medium');
  const [imageDataUrl, setImageDataUrl] = useState<string>(prefillData?.imageUrl || '');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | undefined>();

  // Synchronize when prefillData changes
  React.useEffect(() => {
    if (prefillData) {
      if (prefillData.category) {
        if (['Water', 'Plastic/Waste', 'Air', 'Noise', 'Deforestation', 'Other'].includes(prefillData.category)) {
          setPollutionType(prefillData.category as PollutionType);
        } else {
          setPollutionType('Plastic/Waste');
        }
      }
      if (prefillData.description) {
        setDescription(prefillData.description);
      }
      if (prefillData.imageUrl) {
        setImageDataUrl(prefillData.imageUrl);
      }
    }
  }, [prefillData]);

  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [latestReportId, setLatestReportId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Geolocation handling
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setIsGettingLocation(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        setLocation(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)} (Community Sector)`);
        setIsGettingLocation(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLocation('Sector 7, North Wetlands District (Defaulted)');
        setIsGettingLocation(false);
      },
      { timeout: 8000 }
    );
  };

  // Image Upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Please choose an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageDataUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!location.trim()) {
      setError('Please provide the incident location.');
      return;
    }
    if (!description.trim() || description.length < 15) {
      setError('Please enter a descriptive summary of at least 15 characters.');
      return;
    }

    setSubmitting(true);

    try {
      const generatedId = `EG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      const fallbackUserUid = currentUser?.uid || userProfile?.uid || 'guest-citizen-01';
      const fallbackUserName = userProfile?.name || 'Concerned Citizen';
      const fallbackUserEmail = userProfile?.email || 'citizen@ecoguardian.org';

      const created = await submitPollutionReport({
        reportId: generatedId,
        userId: fallbackUserUid,
        userName: fallbackUserName,
        userEmail: fallbackUserEmail,
        pollutionType,
        location,
        description,
        date,
        severity,
        imageUrl: imageDataUrl || SAMPLE_INCIDENT_IMAGES[1].url,
        coordinates,
      });

      setSuccessMessage('Your environmental report has been submitted successfully.');
      setLatestReportId(created.reportId);
      // Immediately display locally in state with 0ms delay
      setLocalRecentReports((prev) => [created, ...prev.filter((r) => r.reportId !== created.reportId)]);
      onReportSubmitted(created);

      // Reset form fields
      setLocation('');
      setDescription('');
      setImageDataUrl('');
    } catch (err) {
      console.error(err);
      setError('Submission encountered an issue. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const allDisplayedReports = React.useMemo(() => {
    const map = new Map<string, PollutionReport>();
    localRecentReports.forEach((r) => map.set(r.reportId, r));
    userReports.forEach((r) => {
      if (!map.has(r.reportId)) map.set(r.reportId, r);
    });
    const list = Array.from(map.values());
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  }, [localRecentReports, userReports]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
          Civic Hazard Watch
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight">
          Report Pollution Incident
        </h1>
        <p className="text-stone-600 text-sm sm:text-base mt-2">
          Help environmental wardens locate and verify ecological violations. Every verified report awards <strong>+25 Eco Points</strong> to your profile.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form Container */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-md">
          {successMessage && (
            <div className="mb-6 p-5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl animate-in fade-in duration-300 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-base text-emerald-950">{successMessage}</h4>
                  <p className="text-xs text-emerald-800 mt-1">
                    Assigned Tracking ID: <strong>{latestReportId}</strong>. Status set to <strong>Pending</strong>. Visible immediately in your submitted reports list and the Admin Console.
                  </p>
                  <p className="text-xs font-semibold text-emerald-700 mt-1">
                    🌟 +25 Eco Points added to your profile!
                  </p>
                </div>
              </div>

              {/* Quick links to see it in admin or community feed */}
              <div className="pt-2 border-t border-emerald-200/60 flex flex-wrap items-center gap-2">
                {onNavigateTab && (
                  <>
                    <button
                      type="button"
                      onClick={() => onNavigateTab('admin')}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <span>View in Admin Panel</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigateTab('community-reports')}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <span>View in Community Feed</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pollution Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Pollution Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {(['Water', 'Plastic/Waste', 'Air', 'Noise', 'Deforestation', 'Other'] as PollutionType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPollutionType(type)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between cursor-pointer ${
                      pollutionType === type
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-emerald-50/50'
                    }`}
                  >
                    <span>{type}</span>
                    {pollutionType === type && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Location with "Use My Location" */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Incident Location
                </label>
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  disabled={isGettingLocation}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isGettingLocation ? 'Detecting GPS...' : 'Use My Location'}</span>
                </button>
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. North Harbor Canal near Gate 4 or Trailhead 2"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Description of Violation
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you observed (effluent discharge, odor, discarded bags, machinery, wildlife impact)..."
                className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              ></textarea>
            </div>

            {/* Date & Severity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Observation Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Severity Level
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['Low', 'Medium', 'High', 'Critical'] as SeverityLevel[]).map((lvl) => {
                    const isSelected = severity === lvl;
                    const colors = {
                      Low: isSelected ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800',
                      Medium: isSelected ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800',
                      High: isSelected ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-800',
                      Critical: isSelected ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-800',
                    };
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSeverity(lvl)}
                        className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${colors[lvl]}`}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Upload Image */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Upload Photo Evidence
              </label>

              <div className="border-2 border-dashed border-stone-300 hover:border-emerald-500 rounded-2xl p-4 text-center bg-stone-50/60 transition-colors">
                {imageDataUrl ? (
                  <div className="space-y-3">
                    <img
                      src={imageDataUrl}
                      alt="Uploaded incident preview"
                      className="h-44 mx-auto rounded-xl object-cover shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setImageDataUrl('')}
                      className="text-xs text-rose-600 hover:underline font-semibold"
                    >
                      Remove & Choose Another Photo
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-stone-700">
                      Drop evidence photo here or browse
                    </p>
                    <p className="text-[11px] text-stone-400 mt-0.5">JPEG, PNG, WebP up to 5MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="report-photo-upload"
                    />
                    <label
                      htmlFor="report-photo-upload"
                      className="inline-block mt-3 px-4 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer shadow-2xs"
                    >
                      Select File
                    </label>
                  </div>
                )}
              </div>

              {/* Sample images for quick testing */}
              {!imageDataUrl && (
                <div className="mt-3">
                  <span className="text-[11px] font-semibold text-stone-400">
                    Or select an example photo for testing:
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {SAMPLE_INCIDENT_IMAGES.map((sample) => (
                      <button
                        key={sample.name}
                        type="button"
                        onClick={() => setImageDataUrl(sample.url)}
                        className="text-[11px] bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 px-2.5 py-1 rounded-lg border border-stone-200 transition-colors cursor-pointer"
                      >
                        {sample.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submission CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-emerald-700 to-green-600 hover:from-emerald-800 hover:to-green-700 text-white font-bold rounded-2xl text-base shadow-lg shadow-emerald-700/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting Geotagged Report...</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-amber-300" />
                    <span>Submit Environmental Report (+25 Pts)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Informative Sidebar & User Submitted Reports */}
        <div className="lg:col-span-5 space-y-6">
          {/* Guide Card */}
          <div className="bg-emerald-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
                <Info className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold">What happens next?</h3>
              <p className="text-xs text-emerald-200 leading-relaxed">
                1. <strong>Verification:</strong> Municipal wardens review photographic and geospatial evidence.
              </p>
              <p className="text-xs text-emerald-200 leading-relaxed">
                2. <strong>Remediation:</strong> Inspection citations or cleanup teams are dispatched to site.
              </p>
              <p className="text-xs text-emerald-200 leading-relaxed">
                3. <strong>Status Tracking:</strong> The report status moves from Pending → Under Review → Resolved.
              </p>
            </div>
          </div>

          {/* User's Submitted Reports Section */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>Your Submitted Reports</span>
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                {allDisplayedReports.length} Total
              </span>
            </div>

            {allDisplayedReports.length === 0 ? (
              <div className="text-center py-8 text-stone-400">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">No reports filed yet.</p>
                <p className="text-[11px] mt-0.5">Submit your first report using the form to get started!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {allDisplayedReports.map((rep) => {
                  const isJustSubmitted = rep.reportId === latestReportId;
                  const statusColors = {
                    Pending: 'bg-amber-100 text-amber-900 border-amber-200',
                    'Under Review': 'bg-blue-100 text-blue-900 border-blue-200',
                    Resolved: 'bg-emerald-100 text-emerald-900 border-emerald-200',
                    Rejected: 'bg-rose-100 text-rose-900 border-rose-200',
                  };

                  return (
                    <div
                      key={rep.id}
                      className={`p-3.5 rounded-2xl border transition-all text-left ${
                        isJustSubmitted
                          ? 'border-emerald-500 bg-emerald-50/80 shadow-md ring-2 ring-emerald-400/40 animate-pulse'
                          : 'border-stone-200 bg-stone-50/60 hover:bg-white hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-extrabold text-stone-900">{rep.reportId}</span>
                          {isJustSubmitted && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 bg-emerald-700 text-white rounded-md">
                              NEW
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            statusColors[rep.status] || 'bg-stone-100'
                          }`}
                        >
                          {rep.status}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-emerald-900 truncate">{rep.location}</p>
                      <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{rep.description}</p>
                      <div className="flex items-center justify-between text-[10px] text-stone-400 mt-2 pt-2 border-t border-stone-200/60">
                        <span>Type: {rep.pollutionType}</span>
                        <span>Severity: {rep.severity}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
