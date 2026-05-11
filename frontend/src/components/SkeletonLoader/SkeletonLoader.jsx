import './SkeletonLoader.scss';

export function MovieCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton--poster" />
      <div className="skeleton-card__info">
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--meta" />
        <div className="skeleton skeleton--rating" />
      </div>
    </div>
  );
}

export function MovieDetailsSkeleton() {
  return (
    <div className="skeleton-details">
      <div className="skeleton skeleton--banner" />
      <div className="skeleton-details__content">
        <div className="skeleton skeleton--title-lg" />
        <div className="skeleton skeleton--text" />
        <div className="skeleton skeleton--text" />
        <div className="skeleton skeleton--text-short" />
      </div>
    </div>
  );
}
