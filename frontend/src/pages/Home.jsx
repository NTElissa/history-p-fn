import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Compass, Users, MessageSquare, BookOpen, Search, Clock, MapPin, Globe, Crown, Landmark, TreePine, Flag, Scroll, Gem } from 'lucide-react';
import HomeCt from '../assets/HomeCt.jpeg';
import { useLanguage } from '../i18n/LanguageContext';
import { fetchArtifacts, fetchExhibitions, fetchGuides } from '../api';
import { ImigongoBorder, ImigongoDivider, AgasekeIcon, IngomaIcon, IntoreIcon } from '../components/RwandanPatterns';

const quickLinks = [
  { to: '/exhibitions', icon: BookOpen,      labelKey: 'nav.exhibitions', descKey: 'home.linkExhibitions', color: 'from-amber-500 to-orange-500' },
  { to: '/artifacts',   icon: Gem,           labelKey: 'nav.artifacts',   descKey: 'home.linkArtifacts',   color: 'from-emerald-500 to-teal-500' },
  { to: '/trails',      icon: Compass,       labelKey: 'nav.trails',      descKey: 'home.linkTrails',      color: 'from-sky-500 to-blue-500' },
  { to: '/search',      icon: Search,        labelKey: 'nav.search',      descKey: 'home.linkScanner',     color: 'from-violet-500 to-purple-500' },
  { to: '/guides',      icon: Users,         labelKey: 'nav.guides',      descKey: 'home.linkGuides',      color: 'from-rose-500 to-pink-500' },
  { to: '/feedback',    icon: MessageSquare, labelKey: 'nav.feedback',    descKey: 'home.linkFeedback',    color: 'from-amber-600 to-yellow-500' },
];

const Home = () => {
  const { t } = useLanguage();
  const [artifacts, setArtifacts] = useState([]);
  const [exhibitionCount, setExhibitionCount] = useState(0);
  const [guideCount, setGuideCount] = useState(0);

  const getLocalizedText = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field.en || field.fr || field.rw || '';
  };
  const imgUrl = (path) => {
    if (!path) return null;
    const base = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
    return path.startsWith('http') ? path : `${base}${path}`;
  };

  useEffect(() => {
    fetchFeaturedTrails()
      .then(res => {
        const data = res.data;
        setFeaturedTrails(Array.isArray(data) ? data : data?.data || []);
      })
      .catch(() => {});
    fetchExhibitions()
      .then(res => {
        const data = res.data;
        const list = Array.isArray(data) ? data : data?.data || [];
        setExhibitionCount(list.length);
      })
      .catch(() => {});
    fetchGuides()
      .then(res => {
        const data = res.data;
        const list = Array.isArray(data) ? data : data?.data || [];
        setGuideCount(list.length);
      })
      .catch(() => {});
  }, []);

  const stats = [
    { value: exhibitionCount || '—', labelKey: 'home.statExhibitions', icon: BookOpen },
    { value: '119', labelKey: 'home.statYears', icon: Clock },
    { value: guideCount || '—', labelKey: 'nav.guides', icon: Users },
    { value: '3', labelKey: 'home.statLanguages', icon: Globe },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
        <div className="container relative mx-auto px-4 pt-10 pb-16 lg:pt-16 lg:pb-20">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr] items-center">
            <div className="space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
                {t('home.badge')}
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                {t('home.title')}
              </h1>
              <p className="mx-auto max-w-3xl text-lg leading-8 text-slate-700 dark:text-slate-300 lg:mx-0">
                {t('home.subtitle')}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
                <Link
                  to="/exhibitions"
                  className="inline-flex justify-center rounded-full bg-amber-600 px-6 py-3 text-white shadow hover:bg-amber-700 transition font-semibold"
                >
                  {t('home.viewExhibitions')}
                </Link>
                <Link
                  to="/search"
                  className="inline-flex justify-center rounded-full border border-amber-600 px-6 py-3 text-amber-700 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-white/5 transition font-semibold"
                >
                  {t('search.imageSearch') || 'Image Search'}
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                <img src={HomeCt} alt="Kandt House AR experience" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-amber-600 dark:bg-amber-700">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <Icon size={22} className="text-amber-200" />
                  <span className="text-2xl font-extrabold text-white">{stat.value}</span>
                  <span className="text-xs font-medium text-amber-100 uppercase tracking-wider">{t(stat.labelKey)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* QR + Web AR Banner */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-10">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] items-center max-w-4xl mx-auto">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.25em] text-amber-600 dark:text-amber-400 mb-2">
                {t('home.webAr')}
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {t('home.webArDesc')}
              </p>
            </div>
            <div className="flex justify-center">
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4 text-center">
                <QRCodeSVG value={window.location.origin + '/exhibitions'} size={120} />
                <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('home.scanQr')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore the Museum — Grid */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {t('home.exploreTitle')}
          </h2>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-10">
            {t('home.exploreSubtitle')}
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group flex items-start gap-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-xl hover:border-amber-400 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 transition-colors">
                      {t(link.labelKey)}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-1 line-clamp-2">
                      {t(link.descKey)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Trails — Marquee Carousel */}
      {featuredTrails.length > 0 && (
        <section className="bg-gradient-to-b from-white via-amber-50/30 to-white dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800 py-16 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-widest mb-3">
                {t('trail.featured')}
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {t('trail.featured')}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-lg mx-auto">{t('trail.subtitle')}</p>
            </div>

            {/* Marquee track — duplicated cards for seamless infinite scroll */}
            <div className="relative">
              {/* Gradient fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-white dark:from-slate-900 to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-white dark:from-slate-900 to-transparent pointer-events-none" />

              <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused]">
                {[...featuredTrails.slice(0, 6), ...featuredTrails.slice(0, 6)].map((trail, idx) => {
                  const cover = imgUrl(trail.coverImage || trail.previewImage || trail.imageUrl);
                  const title = getLocalizedText(trail.title);
                  const hook = getLocalizedText(trail.introduction || trail.hookSentence);
                  const cta = t('trail.startTrail') || 'Start Trail';
                  const stopCount = trail.stopCount || trail.stops?.length || 0;
                  const linkTo = `/trails/${trail._id}`;
                  const accentColors = [
                    'from-amber-500 to-orange-500',
                    'from-emerald-500 to-teal-500',
                    'from-violet-500 to-purple-500',
                    'from-sky-500 to-blue-500',
                    'from-rose-500 to-pink-500',
                    'from-amber-600 to-yellow-500',
                  ];
                  const accent = accentColors[idx % accentColors.length];
                  return (
                    <Link
                      key={`${trail._id}-${idx}`}
                      to={linkTo}
                      className="group flex-shrink-0 w-[320px] rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-2xl hover:shadow-amber-200/40 dark:hover:shadow-amber-900/20 hover:-translate-y-2 hover:border-amber-400 transition-all duration-500 ease-out"
                    >
                      <div className="relative h-44 overflow-hidden">
                        {cover ? (
                          <img src={cover} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${accent} flex items-center justify-center`}>
                            <Compass size={48} className="text-white/70" />
                          </div>
                        )}
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        {/* Stop count badge */}
                        {stopCount > 0 && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                            {stopCount} stops
                          </span>
                        )}
                        <div className="absolute bottom-3 left-4 right-4">
                          <h3 className="text-white font-bold text-lg drop-shadow-lg leading-tight">{title}</h3>
                        </div>
                        {/* Floating accent bar */}
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      </div>
                      <div className="p-5">
                        {hook && (
                          <p className="text-sm text-slate-600 dark:text-slate-300 italic mb-4 line-clamp-2 leading-relaxed">
                            &ldquo;{hook}&rdquo;
                          </p>
                        )}
                        <span className={`inline-flex items-center gap-2 text-sm font-bold bg-gradient-to-r ${accent} bg-clip-text text-transparent group-hover:gap-3 transition-all duration-300`}>
                          {cta}
                          <span className="text-amber-500 group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="text-center mt-8">
              <Link
                to="/trails"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-lg shadow-amber-600/25 hover:shadow-amber-600/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                {t('common.viewAll')} <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* About the Museum */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 text-center">
              {t('home.aboutTitle')}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-center mb-10">
              {t('home.aboutText')}
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  {t('home.historyTitle')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t('home.historyText')}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-amber-600" />
                  {t('home.visitTitle')}
                </h3>
                <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <p>{t('home.visitAddress')}</p>
                  <p className="flex items-start gap-2">
                    <Clock size={15} className="text-slate-400 mt-0.5 flex-shrink-0" />
                    {t('home.visitHours')}
                  </p>
                  <p>{t('home.visitAdmission')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Museum History & Heritage */}
      <section className="bg-gradient-to-b from-amber-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800">
        <ImigongoBorder />
        <div className="container mx-auto px-4 py-14">
          {/* Section header */}
          <div className="text-center mb-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-widest mb-3">
              Kandt House Museum
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              History &amp; Heritage of Rwanda
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-2xl mx-auto text-sm leading-relaxed">
              Originally the residence of Dr. Richard Kandt, the first German colonial governor, the museum now preserves Rwanda's cultural, political, colonial, and natural history across six major collections.
            </p>
            <ImigongoDivider className="mt-6 text-amber-500 max-w-xs mx-auto" />
          </div>

          {/* Heritage cards grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-10">
            {[
              {
                icon: AgasekeIcon,
                isCustomIcon: true,
                title: 'Pre-Colonial Culture',
                desc: 'Traditional houses, handicrafts, clothing, music, dance, agriculture, and cattle-keeping — showcasing how Rwandan communities lived and preserved traditions for centuries.',
                gradient: 'from-amber-500 to-orange-500',
                highlights: ['Traditional architecture', 'Cultural artifacts', 'Ceremonies & dance'],
              },
              {
                icon: Crown,
                title: 'Kingdom of Rwanda',
                desc: 'One of Africa\'s most organized pre-colonial states — the Mwami (King), royal court, clan structures, governance systems, and the unification of the kingdom.',
                gradient: 'from-violet-500 to-purple-500',
                highlights: ['The Mwami (King)', 'Royal court & clans', 'Justice systems'],
              },
              {
                icon: Landmark,
                title: 'German Colonial Era (1897–1916)',
                desc: 'Dr. Richard Kandt\'s biography, German exploration of Rwanda, establishment of colonial administration, and relations with the Rwandan monarchy — told through maps, photos, and documents.',
                gradient: 'from-sky-500 to-blue-600',
                highlights: ['Dr. Richard Kandt', 'Colonial maps & photos', 'Rwandan monarchy relations'],
              },
              {
                icon: Scroll,
                title: 'Belgian Rule & Independence',
                desc: 'Belgian administration, missionary expansion, identity card policies, ethnic classification, the growth of nationalist movements, and Rwanda\'s path to independence in 1962.',
                gradient: 'from-rose-500 to-pink-600',
                highlights: ['Colonial governance', 'Nationalist movements', 'Independence 1962'],
              },
              {
                icon: TreePine,
                title: 'Natural History & Biodiversity',
                desc: 'Rwanda\'s geological formations, the Albertine Rift, volcanic regions, native plants, wildlife specimens, and environmental conservation — linking nature to society.',
                gradient: 'from-emerald-500 to-teal-500',
                highlights: ['Geological formations', 'Wildlife specimens', 'Conservation efforts'],
              },
              {
                icon: Flag,
                title: 'Modern Rwanda',
                desc: 'Post-independence transformation, the 1994 Genocide against the Tutsi, national unity and reconciliation, and Rwanda\'s remarkable reconstruction and modernization.',
                gradient: 'from-amber-600 to-yellow-500',
                highlights: ['National reconciliation', 'Reconstruction', 'Modernization'],
              },
            ].map((item, i) => {
              const IconComp = item.icon;
              return (
                <div
                  key={i}
                  className="group relative rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-amber-400 transition-all duration-500 overflow-hidden"
                >
                  {/* Top accent bar */}
                  <div className={`h-1 bg-gradient-to-r ${item.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className="p-6">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {item.isCustomIcon ? <IconComp size={24} className="text-white" /> : <IconComp size={22} className="text-white" />}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-amber-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      {item.desc}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.highlights.map((tag, j) => (
                        <span key={j} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Notable artifacts summary */}
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30">
                <Gem size={28} className="text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-amber-300 mb-2">Notable Artifacts &amp; Displays</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Colonial-era maps and administrative documents, historical photographs from German and Belgian periods, traditional farming and household tools, cultural handicrafts, animal specimens, geological collections, and models of traditional royal compounds.
                </p>
              </div>
              <Link
                to="/exhibitions"
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition-colors"
              >
                Explore Exhibitions &rarr;
              </Link>
            </div>
          </div>
        </div>
        <ImigongoBorder />
      </section>
    </main>
  );
};

export default Home;
