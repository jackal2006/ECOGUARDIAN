import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Wind,
  Droplets,
  Trash,
  Volume2,
  TreePine,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Compass,
  Trophy,
  ScanLine,
  ChevronRight,
  Flame,
  Calendar,
  MapPin,
} from 'lucide-react';
import { CommunityEvent, PollutionReport } from '../types';

interface HomePageProps {
  setCurrentTab: (tab: string) => void;
  openAuthModal: () => void;
  reports: PollutionReport[];
  events: CommunityEvent[];
  onSelectArticleCategory?: (cat: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setCurrentTab,
  openAuthModal,
  reports,
  events,
}) => {
  // Animated counters
  const [counts, setCounts] = useState({
    reports: 0,
    actions: 0,
    waste: 0,
    guardians: 0,
  });

  useEffect(() => {
    const target = {
      reports: Math.max(148, reports.length + 140),
      actions: 890,
      waste: 2450,
      guardians: 620,
    };

    const duration = 1200;
    const steps = 30;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const factor = step / steps;
      setCounts({
        reports: Math.floor(target.reports * factor),
        actions: Math.floor(target.actions * factor),
        waste: Math.floor(target.waste * factor),
        guardians: Math.floor(target.guardians * factor),
      });
      if (step >= steps) {
        clearInterval(timer);
        setCounts(target);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [reports.length]);

  const environmentalProblems = [
    {
      id: 'air',
      title: 'Air Pollution',
      category: 'Air Pollution',
      desc: 'Toxic exhaust, smog, and fine particulate PM2.5 matter that degrade lung health and worsen global warming.',
      icon: Wind,
      color: 'text-sky-600',
      bg: 'bg-sky-50 border-sky-200',
      badge: 'Atmosphere Hazard',
    },
    {
      id: 'water',
      title: 'Water Pollution',
      category: 'Water Conservation',
      desc: 'Untreated chemical discharge, runoff fertilizers, and sewage jeopardizing vital community aquifers.',
      icon: Droplets,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-200',
      badge: 'Aquatic Ecosystems',
    },
    {
      id: 'plastic',
      title: 'Plastic Pollution',
      category: 'Plastic Pollution',
      desc: 'Non-biodegradable synthetic polymers fragmenting into pervasive microplastics in our soil and water.',
      icon: Trash,
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-200',
      badge: 'Non-Biodegradable',
    },
    {
      id: 'noise',
      title: 'Noise Pollution',
      category: 'Sustainable Living',
      desc: 'Continuous decibel exceedances from uninsulated heavy machinery disturbing local avian and wildlife habitats.',
      icon: Volume2,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200',
      badge: 'Urban Habitat',
    },
    {
      id: 'waste',
      title: 'Waste Management',
      category: 'Waste Management',
      desc: 'Overflowing landfills emitting methane gas and mismanaged toxic electronic and hazardous substances.',
      icon: ScanLine,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200',
      badge: 'Circular Resource',
    },
    {
      id: 'deforestation',
      title: 'Deforestation',
      category: 'Biodiversity',
      desc: 'Rapid clear-cutting of native old-growth canopies leading to catastrophic topsoil erosion and climate instability.',
      icon: TreePine,
      color: 'text-green-700',
      bg: 'bg-green-50 border-green-200',
      badge: 'Canopy Loss',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Identify a problem',
      desc: 'Spot illegal trash dumping, effluent leaks, toxic smog, or tree clearing in your neighborhood or campus.',
      icon: AlertTriangle,
    },
    {
      step: '02',
      title: 'Report it instantly',
      desc: 'Upload a geotagged photo and incident description to notify community wardens and log public records.',
      icon: ShieldCheck,
    },
    {
      step: '03',
      title: 'Take eco action',
      desc: 'Adopt daily sustainable challenges, follow zero-waste guides, and join local restoration drives.',
      icon: Trophy,
    },
    {
      step: '04',
      title: 'Track your impact',
      desc: 'Earn verified Eco Points, level up your environmental guardian rank, and see collective carbon reduction.',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-emerald-50/70 via-white to-stone-50/40">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-emerald-200/40 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-green-200/30 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200/70 text-emerald-900 text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                <span>Civic Environmental Platform for Students & Citizens</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-emerald-950 tracking-tight leading-[1.12]">
                Protect Our Planet.{' '}
                <span className="bg-gradient-to-r from-emerald-700 via-green-600 to-teal-600 bg-clip-text text-transparent">
                  Start With Your Community.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-stone-600 font-normal leading-relaxed max-w-2xl">
                Eco Guardian helps citizens understand environmental problems, report pollution, manage waste responsibly, and take meaningful eco-friendly actions.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setCurrentTab('report')}
                  className="flex items-center gap-2.5 bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-600 hover:from-emerald-800 hover:to-green-700 text-white px-6 py-3.5 rounded-2xl text-base font-bold shadow-lg shadow-emerald-700/25 hover:shadow-xl hover:shadow-emerald-700/35 active:scale-98 transition-all cursor-pointer"
                >
                  <AlertTriangle className="w-5 h-5 text-amber-300" />
                  <span>Report a Problem</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentTab('challenges')}
                  className="flex items-center gap-2.5 bg-white hover:bg-emerald-50/80 border-2 border-emerald-300 text-emerald-900 px-6 py-3.5 rounded-2xl text-base font-bold shadow-xs hover:border-emerald-500 transition-all cursor-pointer"
                >
                  <Trophy className="w-5 h-5 text-emerald-600" />
                  <span>Explore Eco Actions</span>
                </button>

                <button
                  onClick={() => setCurrentTab('waste-guide')}
                  className="flex items-center gap-2 text-stone-600 hover:text-emerald-800 text-sm font-semibold px-2 py-2"
                >
                  <ScanLine className="w-4 h-4 text-emerald-600" />
                  <span>AI Waste Scanner</span>
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-4 flex items-center gap-6 text-xs text-stone-500 border-t border-stone-200/80">
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Public Incidents</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Gamified Eco Points</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Interactive Waste AI</span>
                </div>
              </div>
            </div>

            {/* Visual Hero Card / Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Image Frame */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-stone-100">
                  <img
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80"
                    alt="Eco Guardian community volunteering in green nature"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-black/20"></div>

                  {/* Overlaid Live Alert Badge */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-lg">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-500 mb-1">
                      <span className="flex items-center gap-1 text-emerald-700">
                        <Flame className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                        Live Community Incident
                      </span>
                      <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full text-[10px]">
                        Under Review
                      </span>
                    </div>
                    <p className="text-sm font-bold text-stone-900 truncate">
                      Industrial Drain Runoff in Tidal Canal
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      North Harbor Sector 4 • Verified by Citizen #81
                    </p>
                  </div>
                </div>

                {/* Floating Floating Eco Points Badge */}
                <div className="absolute -top-6 -left-6 bg-white p-3.5 rounded-2xl shadow-xl border border-emerald-100 hidden sm:flex items-center gap-3 animate-bounce duration-1000">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-extrabold text-sm">
                    +25
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-stone-900">Eco Points Earned</p>
                    <p className="text-[11px] text-stone-500">For reporting local hazard</p>
                  </div>
                </div>

                {/* Floating Citizen Status Badge */}
                <div className="absolute -bottom-6 -right-6 bg-white p-3.5 rounded-2xl shadow-xl border border-emerald-100 hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-stone-900">620+ Active Citizens</p>
                    <p className="text-[11px] text-emerald-700 font-semibold">14 Municipal Hubs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section with Animated Counters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl"></div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <div className="pt-4 sm:pt-0">
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-2">
                {counts.reports}+
              </div>
              <p className="text-sm font-semibold text-emerald-200">Pollution Reports</p>
              <p className="text-xs text-emerald-300/70 mt-1">Logged by citizens</p>
            </div>

            <div className="pt-4 sm:pt-0">
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-amber-300 mb-2">
                {counts.actions}+
              </div>
              <p className="text-sm font-semibold text-emerald-200">Eco Actions Completed</p>
              <p className="text-xs text-emerald-300/70 mt-1">Verified challenges</p>
            </div>

            <div className="pt-4 sm:pt-0">
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-emerald-300 mb-2">
                {counts.waste}+
              </div>
              <p className="text-sm font-semibold text-emerald-200">Waste Items Identified</p>
              <p className="text-xs text-emerald-300/70 mt-1">Classified for sorting</p>
            </div>

            <div className="pt-4 sm:pt-0">
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-teal-300 mb-2">
                {counts.guardians}+
              </div>
              <p className="text-sm font-semibold text-emerald-200">Active Eco Guardians</p>
              <p className="text-xs text-emerald-300/70 mt-1">Volunteers & students</p>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Problems Around Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            Critical Threats
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight">
            Environmental Problems Around Us
          </h2>
          <p className="text-stone-600 text-base leading-relaxed">
            Understanding the root causes of ecosystem degradation is the first step toward effective community restoration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {environmentalProblems.map((prob) => {
            const Icon = prob.icon;
            return (
              <div
                key={prob.id}
                className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${prob.bg} ${prob.color}`}>
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
                      {prob.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-stone-900 group-hover:text-emerald-800 transition-colors mb-2">
                    {prob.title}
                  </h3>

                  <p className="text-sm text-stone-600 leading-relaxed mb-6">
                    {prob.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setCurrentTab('explore');
                    }}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                  >
                    <span>Learn More in Articles</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setCurrentTab('report')}
                    className="text-xs text-stone-500 hover:text-rose-600 font-semibold"
                  >
                    Report Incident
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How Eco Guardian Works */}
      <section className="bg-stone-50/80 py-16 border-y border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full">
              Civic Action Blueprint
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              How Eco Guardian Works
            </h2>
            <p className="text-stone-600 text-sm sm:text-base">
              A continuous cycle of awareness, reporting, community remediation, and verified impact tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs relative flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-emerald-800/20">{s.step}</span>
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-stone-900">{s.title}</h4>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Drives Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              Collective Action
            </span>
            <h2 className="text-3xl font-extrabold text-emerald-950 tracking-tight mt-2">
              Eco Guardian Community Drives
            </h2>
            <p className="text-stone-600 text-sm mt-1 max-w-xl">
              Join neighborhood volunteers and campus green teams for upcoming cleanups, tree plantings, and e-waste roundups.
            </p>
          </div>

          <button
            onClick={() => setCurrentTab('challenges')}
            className="self-start md:self-auto flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-900 hover:underline"
          >
            <span>View All Challenges</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.slice(0, 2).map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col sm:flex-row"
            >
              <div className="sm:w-2/5 relative h-48 sm:h-auto bg-stone-100">
                <img
                  src={ev.imageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80'}
                  alt={ev.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-emerald-800/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                  {ev.category}
                </span>
              </div>
              <div className="p-6 sm:w-3/5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{ev.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900 leading-snug">{ev.title}</h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">{ev.description}</p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-600 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    {ev.participantsCount} Guardians Registered
                  </span>
                  <button
                    onClick={() => setCurrentTab('challenges')}
                    className="font-bold text-emerald-700 hover:underline"
                  >
                    Join Drive →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Strong Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-800 p-8 sm:p-14 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Defend Your Community's Natural Resources?
            </h2>
            <p className="text-emerald-100 text-base leading-relaxed">
              Every resolved incident starts with an attentive citizen. Report local pollution, identify recyclable waste with AI, and collect Eco Points for sustainable habits.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setCurrentTab('report')}
                className="bg-white hover:bg-emerald-50 text-emerald-950 font-bold px-7 py-3.5 rounded-2xl text-base shadow-lg shadow-black/10 active:scale-98 transition-all cursor-pointer"
              >
                File an Environmental Report
              </button>
              <button
                onClick={openAuthModal}
                className="bg-emerald-900/60 hover:bg-emerald-900 text-white border border-emerald-400/30 font-bold px-7 py-3.5 rounded-2xl text-base transition-all cursor-pointer"
              >
                Join as Student / Citizen
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
