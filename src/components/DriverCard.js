import { useState, useEffect } from 'react';

const DARK_LOGO_CONSTRUCTORS = new Set([
  'mercedes',
  'haas',
  'williams',
  'audi',
  'cadillac',
  'rb'
]);

const getWikiTitleFromUrl = (url = '') => {
  if (!url) return '';
  const parts = url.split('/wiki/');
  const rawTitle = parts[1] || '';

  try {
    return decodeURIComponent(rawTitle);
  } catch {
    return rawTitle;
  }
};

function DriverCard({ driver = {} }) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const [teamLogoFailed, setTeamLogoFailed] = useState(false);
  const [wikiPhoto, setWikiPhoto] = useState(null);
  const [wikiTeamLogo, setWikiTeamLogo] = useState(null);
  const [wikiLoading, setWikiLoading] = useState(false);
  const [wikiTeamLoading, setWikiTeamLoading] = useState(false);

  useEffect(() => {
    setPhotoFailed(false);
    setTeamLogoFailed(false);
    setWikiPhoto(null);
    setWikiTeamLogo(null);
  }, [driver.driverId, driver.url, driver.constructorId, driver.constructorUrl]);

  useEffect(() => {
    const hasDirectPhoto = Boolean(driver.photo || driver.image || driver.headshotUrl);
    if (hasDirectPhoto || !driver.url) {
      setWikiLoading(false);
      return undefined;
    }

    const title = getWikiTitleFromUrl(driver.url);
    if (!title) {
      setWikiLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    let mounted = true;

    const loadPhoto = async () => {
      try {
        setWikiLoading(true);

        const imageResponse = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=pageimages&piprop=thumbnail&pithumbsize=600&titles=${encodeURIComponent(title)}`,
          { signal: controller.signal }
        );

        if (!imageResponse.ok) return;
        const imageData = await imageResponse.json();
        const pages = imageData?.query?.pages || {};
        const page = Object.values(pages)[0];
        if (mounted && page?.thumbnail?.source) setWikiPhoto(page.thumbnail.source);
      } catch (_error) {
        // Best-effort photo fetch only
      } finally {
        if (mounted) setWikiLoading(false);
        clearTimeout(timeoutId);
      }
    };

    loadPhoto();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [driver.url, driver.photo, driver.image, driver.headshotUrl]);

  useEffect(() => {
    if (!driver.constructorUrl) {
      setWikiTeamLoading(false);
      return undefined;
    }

    const title = getWikiTitleFromUrl(driver.constructorUrl);
    if (!title) {
      setWikiTeamLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    let mounted = true;

    const loadTeamLogo = async () => {
      try {
        setWikiTeamLoading(true);

        const imageResponse = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=pageimages&piprop=thumbnail&pithumbsize=400&titles=${encodeURIComponent(title)}`,
          { signal: controller.signal }
        );

        if (!imageResponse.ok) return;
        const imageData = await imageResponse.json();
        const pages = imageData?.query?.pages || {};
        const page = Object.values(pages)[0];
        if (mounted && page?.thumbnail?.source) setWikiTeamLogo(page.thumbnail.source);
      } catch (_error) {
        // Best-effort team logo fetch only
      } finally {
        if (mounted) setWikiTeamLoading(false);
        clearTimeout(timeoutId);
      }
    };

    loadTeamLogo();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [driver.constructorUrl]);

  const givenName = driver.givenName || driver.firstName || driver.Driver?.givenName || '';
  const familyName = driver.familyName || driver.lastName || driver.Driver?.familyName || '';
  const fullName = `${givenName} ${familyName}`.trim() || 'Unknown Driver';
  const nationality = driver.nationality || driver.country || driver.Driver?.nationality || 'Unknown Nationality';
  const team =
    driver.team ||
    driver.teamName ||
    driver.constructorName ||
    driver.Constructor?.name ||
    driver.constructor?.name ||
    driver.Constructors?.[0]?.name ||
    'Unknown Team';

  const resolvedPhoto = driver.photo || driver.image || driver.headshotUrl || wikiPhoto;
  const resolvedTeamLogo = teamLogoFailed ? wikiTeamLogo : (driver.teamLogo || wikiTeamLogo);
  const darkLogoFallback = /mercedes|haas|williams|aston martin|audi|cadillac|rb f1 team/i.test(team);
  const logoNeedsWhiteBg = DARK_LOGO_CONSTRUCTORS.has(driver.constructorId) || darkLogoFallback;
  const teamInitials = team
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  const showPhoto = Boolean(resolvedPhoto) && !photoFailed;
  const showTeamLogo = Boolean(resolvedTeamLogo);

  return (
    <div className="group relative rounded-3xl overflow-hidden shadow-2xl border border-pink-500/30 hover:border-pink-400/60 transition-all duration-500 hover:-translate-y-2 hover:scale-105 hover:shadow-pink-500/40 aspect-[3/4]">
      {showPhoto ? (
        <img
          src={resolvedPhoto}
          alt={fullName}
          loading="lazy"
          onError={() => setPhotoFailed(true)}
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
        />
      ) : wikiLoading ? (
        <div className="absolute inset-0 bg-gray-800 animate-pulse" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <svg className="w-24 h-24 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>
      )}

      <div className="absolute top-3 left-4 z-10">
        <span className="text-5xl font-black text-white/20 group-hover:text-white/40 transition-colors duration-500 leading-none select-none drop-shadow-2xl">
          {driver.permanentNumber || driver.number || ''}
        </span>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-black/80 group-hover:to-black/90 transition-all duration-500" />

      <div className="absolute inset-y-0 right-0 w-1/2 flex flex-col justify-end items-end p-4 gap-1 z-10">
        <p className="text-white font-black text-lg leading-tight text-right drop-shadow-lg">
          {givenName && (
            <span className="block text-sm font-semibold text-pink-300/90 tracking-widest uppercase">
              {givenName}
            </span>
          )}
          <span className="block text-xl">{familyName || fullName}</span>
        </p>

        <p className="text-white/85 text-xs font-medium tracking-wide uppercase text-right bg-black/40 px-2 py-0.5 rounded">
          {nationality}
        </p>

        <div className="w-10 h-px bg-pink-500/60 my-1 self-end" />

        <div className="flex items-center justify-end gap-2">
          {showTeamLogo ? (
            <img
              src={resolvedTeamLogo}
              alt={team}
              title={team}
              loading="lazy"
              onError={() => setTeamLogoFailed(true)}
              className={`h-7 w-auto max-w-[110px] object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)] ${logoNeedsWhiteBg ? 'bg-white/95 rounded-sm px-1 py-0.5' : ''}`}
            />
          ) : (
            <span
              aria-hidden="true"
              title={team}
              className="text-white/80 text-[10px] font-semibold tracking-wide"
            >
              {wikiTeamLoading ? '...' : teamInitials}
            </span>
          )}
          <span className="text-white/90 text-xs font-semibold tracking-wide bg-black/45 px-2 py-0.5 rounded max-w-[140px] truncate" title={team}>
            {team !== 'Unknown Team' ? team : (wikiTeamLoading ? 'Loading team' : `Team ${teamInitials}`)}
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-pink-500 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
    </div>
  );
}

export default DriverCard;
