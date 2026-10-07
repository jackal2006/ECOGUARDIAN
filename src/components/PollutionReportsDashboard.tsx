import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  AlertTriangle,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  X,
  Eye,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { PollutionReport, PollutionType, ReportStatus, SeverityLevel } from '../types';

interface PollutionReportsDashboardProps {
  reports: PollutionReport[];
  setCurrentTab: (tab: string) => void;
}

export const PollutionReportsDashboard: React.FC<PollutionReportsDashboardProps> = ({
  reports,
  setCurrentTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedReport, setSelectedReport] = useState<PollutionReport | null>(null);

  const filteredReports = useMemo(() => {
    return reports.filter((rep) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        rep.reportId.toLowerCase().includes(q) ||
        rep.location.toLowerCase().includes(q) ||
        rep.description.toLowerCase().includes(q) ||
        rep.pollutionType.toLowerCase().includes(q);

      // Type
      const matchesType = typeFilter === 'All' || rep.pollutionType === typeFilter;

      // Severity
      const matchesSeverity = severityFilter === 'All' || rep.severity === severityFilter;

      // Status
      const matchesStatus = statusFilter === 'All' || rep.status === statusFilter;

      return matchesSearch && matchesType && matchesSeverity && matchesStatus;
    });
  }, [reports, searchQuery, typeFilter, severityFilter, statusFilter]);

  const severityBadges: Record<SeverityLevel, { bg: string; text: string }> = {
    Low: { bg: 'bg-emerald-100 border-emerald-200', text: 'text-emerald-800' },
    Medium: { bg: 'bg-amber-100 border-amber-200', text: 'text-amber-800' },
    High: { bg: 'bg-orange-100 border-orange-200', text: 'text-orange-900' },
    Critical: { bg: 'bg-rose-100 border-rose-300', text: 'text-rose-900 font-extrabold' },
  };

  const statusBadges: Record<ReportStatus, { bg: string; text: string }> = {
    Pending: { bg: 'bg-amber-50 text-amber-900 border-amber-300', text: 'text-amber-900' },
    'Under Review': { bg: 'bg-blue-50 text-blue-900 border-blue-300', text: 'text-blue-900' },
    Resolved: { bg: 'bg-emerald-50 text-emerald-900 border-emerald-300', text: 'text-emerald-900' },
    Rejected: { bg: 'bg-rose-50 text-rose-900 border-rose-300', text: 'text-rose-900' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            Public Civic Ledger
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight">
            Community Pollution Reports
          </h1>
          <p className="text-stone-600 text-sm mt-1 max-w-2xl">
            Live feed of environmental violations reported by citizens. Filter by pollution category, severity, and remediation status.
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('report')}
          className="self-start md:self-auto flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-md shadow-emerald-700/20 active:scale-98 transition-all cursor-pointer"
        >
          <AlertTriangle className="w-4 h-4 text-amber-300" />
          <span>Report New Hazard</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-stone-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by report ID (EG-...), location, description, or keyword..."
            className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-3.5 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns / Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Pollution Type */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
              Pollution Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full py-2.5 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Types</option>
              <option value="Water">Water Pollution</option>
              <option value="Plastic/Waste">Plastic / Waste</option>
              <option value="Air">Air Pollution</option>
              <option value="Noise">Noise Pollution</option>
              <option value="Deforestation">Deforestation</option>
              <option value="Other">Other Hazards</option>
            </select>
          </div>

          {/* Severity */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
              Severity Level
            </label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full py-2.5 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Severities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
              Remediation Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2.5 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending Review</option>
              <option value="Under Review">Under Review</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Results summary counter */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
          <span>
            Showing <strong>{filteredReports.length}</strong> of {reports.length} reports
          </span>
          {(typeFilter !== 'All' || severityFilter !== 'All' || statusFilter !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setTypeFilter('All');
                setSeverityFilter('All');
                setStatusFilter('All');
                setSearchQuery('');
              }}
              className="text-emerald-700 hover:underline font-bold text-xs"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 shadow-xs space-y-3">
          <AlertTriangle className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-lg font-bold text-stone-800">No matching reports found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search query or filter tags to discover other community environmental incidents.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((rep) => {
            const sevBadge = severityBadges[rep.severity] || severityBadges.Medium;
            const statBadge = statusBadges[rep.status] || statusBadges.Pending;

            return (
              <div
                key={rep.id}
                onClick={() => setSelectedReport(rep)}
                className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
              >
                {/* Image & Badges */}
                <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                  <img
                    src={rep.imageUrl || 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80'}
                    alt={rep.description}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

                  {/* Top Bar on Image */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="bg-emerald-950/80 backdrop-blur-md text-emerald-100 text-[11px] font-extrabold px-2.5 py-1 rounded-full border border-white/20">
                      {rep.reportId}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border shadow-xs ${sevBadge.bg} ${sevBadge.text}`}
                    >
                      {rep.severity} Severity
                    </span>
                  </div>

                  {/* Status Badge Bottom */}
                  <div className="absolute bottom-3 left-3">
                    <span
                      className={`text-[11px] font-extrabold px-3 py-1 rounded-full border shadow-sm ${statBadge.bg} ${statBadge.text}`}
                    >
                      ● {rep.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200">
                        {rep.pollutionType}
                      </span>
                      <span className="text-stone-400">•</span>
                      <span className="flex items-center gap-1 text-stone-500 text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        {rep.date}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                      {rep.location}
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                      {rep.description}
                    </p>
                  </div>

                  {/* Footer note */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-stone-400">
                      By {rep.userName || 'Citizen'}
                    </span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>View Incident</span>
                      <Eye className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-emerald-50/50">
              <div className="flex items-center gap-3">
                <span className="text-xs font-extrabold px-2.5 py-1 bg-emerald-800 text-white rounded-lg">
                  {selectedReport.reportId}
                </span>
                <span className="text-sm font-bold text-emerald-950">
                  {selectedReport.pollutionType} Pollution Incident
                </span>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Image Preview */}
              {selectedReport.imageUrl && (
                <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-stone-100 shadow-xs border border-stone-200">
                  <img
                    src={selectedReport.imageUrl}
                    alt={selectedReport.location}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Status</span>
                  <span className="font-extrabold text-stone-800 mt-0.5 block">{selectedReport.status}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Severity</span>
                  <span className="font-extrabold text-stone-800 mt-0.5 block">{selectedReport.severity}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Date</span>
                  <span className="font-extrabold text-stone-800 mt-0.5 block">{selectedReport.date}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Reporter</span>
                  <span className="font-extrabold text-stone-800 mt-0.5 block truncate">
                    {selectedReport.userName || 'Citizen'}
                  </span>
                </div>
              </div>

              {/* Location */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Location & Coordinates
                </h4>
                <p className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{selectedReport.location}</span>
                </p>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Citizen Observation
                </h4>
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-sm text-stone-700 leading-relaxed">
                  {selectedReport.description}
                </div>
              </div>

              {/* Admin Remediation Notes if any */}
              {selectedReport.adminNotes && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Official Environmental Response</span>
                  </h4>
                  <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
                    {selectedReport.adminNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-5 py-2.5 bg-stone-800 text-white rounded-xl text-xs font-bold hover:bg-stone-900 transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
