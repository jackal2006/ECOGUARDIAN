import React from 'react';
import {
  Leaf,
  ShieldCheck,
  Globe,
  Sparkles,
  Users,
  Award,
  Lock,
  Heart,
  Code2,
  Cpu,
  Database,
  ScanLine,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Hero */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          CEP Project Initiative
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-emerald-950 tracking-tight leading-tight">
          About Eco Guardian
        </h1>
        <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
          "Small actions. Cleaner communities. A healthier planet."
        </p>
      </div>

      {/* Mission & Purpose */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed">
          <h2 className="text-2xl font-bold text-stone-900">
            Our Purpose & Civic Mission
          </h2>
          <p>
            Eco Guardian was conceived as an environmental awareness and community remediation platform designed for college campuses, student civic bodies, and active neighborhood groups.
          </p>
          <p>
            Traditional environmental reporting often suffers from bureaucratic latency and low public transparency. Eco Guardian solves this by providing:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold">✓</span>
              <span><strong>Geotagged Incident Reporting:</strong> Instant photographic hazard filing with public status tracking.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold">✓</span>
              <span><strong>AI Waste Identifier:</strong> Neural multimodal vision categorization to eradicate recycling contamination.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold">✓</span>
              <span><strong>Gamified Habit Formation:</strong> Meaningful eco challenges with verified points and badge progression.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold">✓</span>
              <span><strong>Open Educational Articles:</strong> Grounded scientific knowledge on watersheds, climate, and urban forestry.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-xl border-4 border-white bg-stone-100">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80"
            alt="Eco Guardian community action"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Technology Architecture */}
      <div className="bg-stone-50 rounded-3xl p-8 sm:p-12 border border-stone-200/90 space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Technical Stack
          </span>
          <h2 className="text-2xl font-extrabold text-stone-900">
            Engineered for Reliability & Scale
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Eco Guardian uses modern cloud and web standards to guarantee real-time synchronization, zero data loss, and sub-second AI inferences.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <Database className="w-6 h-6 text-emerald-700" />
            <h4 className="text-sm font-bold text-stone-900">Firebase Firestore</h4>
            <p className="text-xs text-stone-500">
              Enterprise real-time NoSQL database with strict attribute-based security rules and indexes.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <Lock className="w-6 h-6 text-emerald-700" />
            <h4 className="text-sm font-bold text-stone-900">Firebase Authentication</h4>
            <p className="text-xs text-stone-500">
              Secure OAuth & email authentication protecting private user credentials and RBAC roles.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <Cpu className="w-6 h-6 text-emerald-700" />
            <h4 className="text-sm font-bold text-stone-900">Gemini 2.5 Flash Vision</h4>
            <p className="text-xs text-stone-500">
              Multimodal optical intelligence identifying polymer resins, organic matter, and hazard warnings.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <Code2 className="w-6 h-6 text-emerald-700" />
            <h4 className="text-sm font-bold text-stone-900">React 19 & Tailwind CSS</h4>
            <p className="text-xs text-stone-500">
              Responsive modern interface, animated counters, Recharts metrics, and mobile camera access.
            </p>
          </div>
        </div>
      </div>

      {/* Ethical Data & Privacy */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-sm space-y-4">
        <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <span>Ethics, Privacy & Data Integrity</span>
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl">
          Eco Guardian collects only the minimum necessary geospatial and photographic information required to verify municipal hazards. Normal users can read public content, submit their own reports, and update their personal profiles without compromising privacy. All administrative actions require verified role-based access control.
        </p>
      </div>
    </div>
  );
};
