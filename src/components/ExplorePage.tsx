import React, { useState } from 'react';
import {
  Compass,
  Clock,
  User,
  ArrowRight,
  Search,
  BookOpen,
  X,
  Share2,
  Bookmark,
} from 'lucide-react';
import { Article } from '../types';

interface ExplorePageProps {
  articles: Article[];
}

const TOPICS = [
  'All',
  'Plastic Pollution',
  'Climate Change',
  'Waste Management',
  'Water Conservation',
  'Air Pollution',
  'Biodiversity',
  'Sustainable Living',
];

export const ExplorePage: React.FC<ExplorePageProps> = ({ articles }) => {
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);

  const filteredArticles = articles.filter((art) => {
    const matchesTopic = selectedTopic === 'All' || art.category === selectedTopic;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      art.title.toLowerCase().includes(q) ||
      art.description.toLowerCase().includes(q) ||
      art.content.toLowerCase().includes(q);
    return matchesTopic && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
          Knowledge & Environmental Research
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight">
          Explore Environmental Awareness
        </h1>
        <p className="text-stone-600 text-sm sm:text-base mt-2">
          Evidence-based articles on watershed protection, urban forestry, circular product design, and microplastic science to empower student and citizen action.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Topic Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          {TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedTopic === topic
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search environmental topics..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setReadingArticle(article)}
            className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
          >
            {/* Image */}
            <div className="relative aspect-[16/9] bg-stone-100 overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-emerald-950/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                {article.category}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs text-stone-400">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime}
                  </span>
                  <span>•</span>
                  <span>{article.author}</span>
                </div>

                <h3 className="text-xl font-bold text-stone-900 group-hover:text-emerald-800 transition-colors leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3">
                  {article.description}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>Read Full Article</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full Article Reader Modal */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                {readingArticle.category}
              </span>
              <button
                onClick={() => setReadingArticle(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-stone-800">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs text-stone-400">
                  <span>{readingArticle.author}</span>
                  <span>•</span>
                  <span>{readingArticle.createdAt}</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold">{readingArticle.readTime}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
                  {readingArticle.title}
                </h2>
              </div>

              <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-stone-100">
                <img
                  src={readingArticle.imageUrl}
                  alt={readingArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-base font-semibold text-emerald-950 leading-relaxed border-l-4 border-emerald-500 pl-4 py-1 italic bg-emerald-50/50 rounded-r-xl">
                {readingArticle.description}
              </p>

              <div className="text-sm sm:text-base leading-relaxed text-stone-700 whitespace-pre-line space-y-4">
                {readingArticle.content}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-end">
              <button
                onClick={() => setReadingArticle(null)}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
