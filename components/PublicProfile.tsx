
import React, { useState, useEffect, useMemo } from 'react';
import { Icons } from './Icons';
import { AgentProfile, PropertyType, Listing, Review, ReviewerType } from '../types';
import { StatCard } from './StatCard';

interface PublicProfileProps {
  agent: AgentProfile;
}

type SortOption = 'newest' | 'oldest' | 'price-low' | 'price-high';
type ReviewFilter = 'all' | 'great' | 'average' | 'bad';

export const PublicProfile: React.FC<PublicProfileProps> = ({ agent }) => {
  const [filterType, setFilterType] = useState<PropertyType | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set());
  const [showHeaderTooltip, setShowHeaderTooltip] = useState(false);
  
  // Review state
  const [reviews, setReviews] = useState<Review[]>(agent.reviews);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('all');
  const [isReviewing, setIsReviewing] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: '',
    type: ReviewerType.Tenant
  });

  const profileUrl = `${window.location.origin}/agent/${agent.id}`;

  const toggleFavorite = (id: string) => {
    setFavoritedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleProfileShare = () => {
    navigator.clipboard.writeText(profileUrl);
    setShowHeaderTooltip(true);
    setTimeout(() => setShowHeaderTooltip(false), 3000);
  };

  const handleListingShare = (listingId: string) => {
    const listingUrl = `${window.location.origin}/listing/${listingId}`;
    window.prompt("Copy this listing's shareable link:", listingUrl);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;

    const review: Review = {
      id: `r-${Date.now()}`,
      rating: newReview.rating,
      comment: newReview.comment,
      reviewer: newReview.name,
      type: newReview.type,
      date: 'Just now',
    };

    setReviews([review, ...reviews]);
    setNewReview({ name: '', rating: 5, comment: '', type: ReviewerType.Tenant });
    setIsReviewing(false);
  };

  const getSortedFilteredListings = (): Listing[] => {
    let result = agent.listings.filter(
      l => filterType === 'All' || l.type === filterType
    );

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime());
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return result;
  };

  const filteredListings = getSortedFilteredListings();

  const reviewStats = useMemo(() => {
    return {
      all: reviews.length,
      great: reviews.filter(r => r.rating >= 4).length,
      average: reviews.filter(r => r.rating === 3).length,
      bad: reviews.filter(r => r.rating <= 2).length
    };
  }, [reviews]);

  const displayedReviews = useMemo(() => {
    if (reviewFilter === 'all') return reviews;
    if (reviewFilter === 'great') return reviews.filter(r => r.rating >= 4);
    if (reviewFilter === 'average') return reviews.filter(r => r.rating === 3);
    if (reviewFilter === 'bad') return reviews.filter(r => r.rating <= 2);
    return reviews;
  }, [reviews, reviewFilter]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 flex flex-col items-end">
          <button 
            onClick={handleProfileShare}
            className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative group"
            title="Share Profile"
          >
            <Icons.Share2 size={24} />
          </button>
          
          {/* Share Tooltip */}
          {showHeaderTooltip && (
            <div className="absolute top-16 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl relative">
                <p className="font-bold mb-1 flex items-center gap-2">
                  <Icons.CheckCircle2 size={12} className="text-green-400" /> 
                  Link Copied!
                </p>
                <p className="text-slate-400 font-mono truncate max-w-[200px]">{profileUrl}</p>
                <div className="absolute -top-1 right-5 w-2 h-2 bg-slate-900 rotate-45"></div>
              </div>
            </div>
          )}
        </div>
        
        <div className="relative">
          <img 
            src={agent.photo} 
            alt={agent.name} 
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" 
          />
          {agent.isVerified && (
            <div className="absolute bottom-1 right-1 bg-blue-600 text-white p-1 rounded-full border-2 border-white" title="ID and activity verified">
              <Icons.ShieldCheck size={18} />
            </div>
          )}
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
            <h1 className="text-3xl font-extrabold text-slate-900">{agent.name}</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 self-center">
              {agent.title}
            </span>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-slate-500 mb-6">
            <div className="flex items-center gap-1.5">
              <Icons.MapPin size={18} className="text-slate-400" />
              <span>{agent.coverage.join(', ')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icons.Clock size={18} className="text-slate-400" />
              <span>Joined {agent.joined}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icons.CheckCircle2 size={18} className="text-green-500" />
              <span>Active {agent.lastActive}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2">
              <Icons.MessageSquare size={18} />
              Inquire Now
            </button>
            <button className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-xl font-semibold hover:bg-slate-200 transition-all flex items-center gap-2">
              <Icons.Phone size={18} />
              Call Agent
            </button>
          </div>
        </div>
      </section>

      {/* Performance Snapshot */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Active Listings" value={agent.stats.activeListings} icon="LayoutDashboard" color="blue" />
        <StatCard label="Total Posted" value={agent.stats.totalPosted} icon="FileText" color="purple" />
        <StatCard label="Successful" value={agent.stats.successfulRentals} icon="CheckCircle2" color="green" />
        <StatCard label="Rating" value={`${agent.stats.avgRating} / 5`} icon="Star" color="yellow" />
        <StatCard label="Resp. Time" value={agent.stats.responseTime} icon="Clock" color="orange" />
        <StatCard label="Total Views" value={agent.stats.totalListingViews.toLocaleString()} icon="Eye" color="blue" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          {/* Bio Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">About the Agent</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">{agent.bio}</p>
            
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Experience</span>
                <p className="text-slate-900 font-medium">{agent.experience} Years in Rental</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider text-blue-600">Primary Focus Areas (Cities)</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {agent.focusAreas.map(f => (
                    <span key={f} className="px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold rounded-lg">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Badges Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Agent Badges</h3>
            <div className="grid grid-cols-1 gap-3">
              {agent.badges.map(badge => {
                const Icon = Icons[badge.icon as keyof typeof Icons] || Icons.Award;
                return (
                  <div key={badge.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl group hover:bg-slate-100 transition-colors">
                    <div className={`p-2 rounded-lg bg-white shadow-sm text-blue-600`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{badge.label}</h4>
                      <p className="text-xs text-slate-500">{badge.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-900">Active Listings</h2>
            <div className="flex flex-wrap items-center gap-4">
               {/* Filter Dropdown */}
               <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                 <Icons.Filter size={14} className="text-slate-400" />
                 <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="text-xs bg-transparent border-none focus:ring-0 text-slate-600 font-bold cursor-pointer outline-none"
                 >
                   <option value="All">All Types</option>
                   {Object.values(PropertyType).map(t => <option key={t} value={t}>{t}</option>)}
                 </select>
               </div>

               {/* Sort Dropdown */}
               <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                 <Icons.TrendingUp size={14} className="text-slate-400" />
                 <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="text-xs bg-transparent border-none focus:ring-0 text-slate-600 font-bold cursor-pointer outline-none"
                 >
                   <option value="newest">Newest First</option>
                   <option value="oldest">Oldest First</option>
                   <option value="price-low">Price: Low to High</option>
                   <option value="price-high">Price: High to Low</option>
                 </select>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredListings.map(listing => {
              const isFavorited = favoritedIds.has(listing.id);
              return (
                <div key={listing.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group transition-all hover:shadow-md">
                  <div className="relative aspect-[4/3]">
                    <img src={listing.image} alt={listing.location} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    
                    {/* Action Buttons Overlay */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                      {/* Favorite Button */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(listing.id); }}
                        className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-sm ${
                          isFavorited 
                            ? 'bg-red-50 text-red-500' 
                            : 'bg-white/80 text-slate-500 hover:text-red-500 hover:bg-white'
                        }`}
                        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Icons.Heart size={18} fill={isFavorited ? "currentColor" : "none"} />
                      </button>

                      {/* Listing Share Button (Overlay) */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleListingShare(listing.id); }}
                        className="p-2.5 rounded-full bg-white/80 text-slate-500 backdrop-blur-md transition-all shadow-sm hover:text-blue-600 hover:bg-white"
                        aria-label="Share listing"
                        title="Share listing"
                      >
                        <Icons.Share2 size={18} />
                      </button>
                    </div>

                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-blue-600 shadow-sm uppercase tracking-wide">
                      {listing.type}
                    </div>
                    
                    <div className="absolute bottom-3 left-3 bg-green-500 text-white px-2 py-0.5 rounded-lg text-[10px] font-black uppercase shadow-sm">
                      {listing.status}
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xl font-bold text-slate-900">₦{listing.price.toLocaleString()}<span className="text-xs text-slate-500 font-normal"> /year</span></p>
                        <div className="flex items-center gap-1 text-slate-500 text-sm mt-0.5">
                          <Icons.MapPin size={14} />
                          {listing.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pt-3 border-t border-slate-50">
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Icons.Eye size={14} />
                        {listing.views} views
                      </div>
                      <div className="ml-auto flex items-center gap-3">
                        {/* Explicit Functional Share Button in Footer */}
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleListingShare(listing.id); }}
                          className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                          title="Share Listing"
                        >
                          <Icons.Share2 size={16} />
                        </button>
                        <button className="text-blue-600 font-bold text-xs flex items-center gap-1 hover:underline">
                          View Details <Icons.ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredListings.length === 0 && (
            <div className="bg-white py-16 px-4 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                <Icons.Search size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No matching listings</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">Try adjusting your filters or sort order to see more properties.</p>
              <button 
                onClick={() => { setFilterType('All'); setSortBy('newest'); }}
                className="mt-6 text-blue-600 font-bold text-sm hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Reviews Section */}
          <div className="pt-8 border-t border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Reviews & Ratings</h2>
              <button 
                onClick={() => setIsReviewing(!isReviewing)}
                className="text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all flex items-center gap-2"
              >
                <Icons.Star size={16} fill="currentColor" />
                {isReviewing ? 'Cancel Review' : 'Write a Review'}
              </button>
            </div>

            {/* Review Form */}
            {isReviewing && (
              <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-sm mb-8 animate-in slide-in-from-top-4 duration-300">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Share your experience</h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Your Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="John Doe"
                        value={newReview.name}
                        onChange={e => setNewReview({...newReview, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Who are you?</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={newReview.type}
                        onChange={e => setNewReview({...newReview, type: e.target.value as ReviewerType})}
                      >
                        <option value={ReviewerType.Tenant}>Tenant</option>
                        <option value={ReviewerType.Landlord}>Landlord</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button 
                          key={star}
                          type="button"
                          onClick={() => setNewReview({...newReview, rating: star})}
                          className={`p-1 transition-all ${newReview.rating >= star ? 'text-yellow-400 scale-110' : 'text-slate-200'}`}
                        >
                          <Icons.Star size={24} fill="currentColor" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Your Feedback</label>
                    <textarea 
                      required
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="How was your experience working with Sarah?"
                      value={newReview.comment}
                      onChange={e => setNewReview({...newReview, comment: e.target.value})}
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            )}

            {/* Review Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button 
                onClick={() => setReviewFilter('all')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 border ${reviewFilter === 'all' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
              >
                All <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${reviewFilter === 'all' ? 'bg-slate-800' : 'bg-slate-100'}`}>{reviewStats.all}</span>
              </button>
              <button 
                onClick={() => setReviewFilter('great')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 border ${reviewFilter === 'great' ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-green-200'}`}
              >
                Great (4-5★) <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${reviewFilter === 'great' ? 'bg-green-700' : 'bg-green-50 text-green-600'}`}>{reviewStats.great}</span>
              </button>
              <button 
                onClick={() => setReviewFilter('average')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 border ${reviewFilter === 'average' ? 'bg-yellow-500 border-yellow-500 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-yellow-200'}`}
              >
                Average (3★) <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${reviewFilter === 'average' ? 'bg-yellow-600' : 'bg-yellow-50 text-yellow-600'}`}>{reviewStats.average}</span>
              </button>
              <button 
                onClick={() => setReviewFilter('bad')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 border ${reviewFilter === 'bad' ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-red-200'}`}
              >
                Bad (1-2★) <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${reviewFilter === 'bad' ? 'bg-red-600' : 'bg-red-50 text-red-600'}`}>{reviewStats.bad}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {displayedReviews.map(review => (
                <div key={review.id} className="bg-white p-5 rounded-2xl border border-slate-100 space-y-3 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                        {review.reviewer.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{review.reviewer}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                          <span>{review.type}</span>
                          <span>•</span>
                          <span>{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-0.5 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Icons.Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed italic">"{review.comment}"</p>
                  {review.propertyTitle && (
                    <div className="text-[11px] text-blue-600 font-medium bg-blue-50/50 inline-block px-2 py-0.5 rounded-md">
                      Relates to: {review.propertyTitle}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Review Empty State */}
              {displayedReviews.length === 0 && (
                <div className="bg-slate-50 py-12 px-4 rounded-3xl border border-dashed border-slate-200 text-center">
                  <p className="text-slate-500 text-sm font-medium">No {reviewFilter} reviews found for this agent.</p>
                  <button onClick={() => setReviewFilter('all')} className="mt-4 text-blue-600 text-xs font-bold hover:underline">Show all reviews</button>
                </div>
              )}
            </div>
            
            <button className="w-full mt-6 py-3 border border-slate-200 rounded-xl text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors">
              Read All 45 Reviews
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
