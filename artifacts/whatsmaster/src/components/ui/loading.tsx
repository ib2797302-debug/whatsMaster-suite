import { ReactNode, useEffect, useState } from "react";

interface LoadingOverlayProps {
  isLoading: boolean;
  children: ReactNode;
  fallback?: ReactNode;
  minDuration?: number;
}

/**
 * Composant qui affiche un overlay de chargement pendant le chargement des données
 * avec une durée minimale optionnelle pour éviter les flashs
 */
export function LoadingOverlay({
  isLoading,
  children,
  fallback,
  minDuration = 300,
}: LoadingOverlayProps) {
  const [showLoading, setShowLoading] = useState(false);
  const [isReady, setIsReady] = useState(!isLoading);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
      // Afficher le loading après un court délai pour éviter les flashs
      timeoutId = setTimeout(() => {
        setShowLoading(true);
      }, minDuration);
    } else {
      setShowLoading(false);
      setIsReady(true);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading, minDuration]);

  if (!isLoading && isReady) {
    return <>{children}</>;
  }

  if (showLoading) {
    return (
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label="Chargement en cours"
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
          <span className="text-sm font-medium text-muted-foreground sr-only">
            Chargement en cours...
          </span>
          {fallback && (
            <div className="text-sm text-muted-foreground" aria-hidden="true">
              {fallback}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
        <span className="text-sm font-medium text-muted-foreground sr-only">
          Préparation du chargement...
        </span>
      </div>
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  animation?: "pulse" | "shine" | false;
}

/**
 * Composant Skeleton pour les états de chargement
 */
export function Skeleton({
  className = "",
  width = "100%",
  height = "1rem",
  borderRadius = "0.375rem",
  animation = "pulse",
}: SkeletonProps) {
  const animationClass =
    animation === "pulse"
      ? "animate-pulse"
      : animation === "shine"
        ? "animate-shimmer"
        : "";

  return (
    <div
      className={`bg-muted ${animationClass} ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius,
      }}
      aria-hidden="true"
    />
  );
}

interface CardSkeletonProps {
  showImage?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showFooter?: boolean;
}

/**
 * Skeleton pour les cartes
 */
export function CardSkeleton({
  showImage = true,
  showTitle = true,
  showDescription = true,
  showFooter = false,
}: CardSkeletonProps) {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-3" role="status" aria-label="Chargement de la carte">
      {showImage && (
        <Skeleton height="160px" borderRadius="0.5rem" />
      )}
      {showTitle && (
        <div className="space-y-2">
          <Skeleton width="75%" height="1.25rem" />
        </div>
      )}
      {showDescription && (
        <div className="space-y-2">
          <Skeleton width="90%" />
          <Skeleton width="85%" />
          <Skeleton width="95%" />
        </div>
      )}
      {showFooter && (
        <div className="pt-2 flex justify-between items-center">
          <Skeleton width="30%" height="0.875rem" />
          <Skeleton width="20%" height="0.875rem" />
        </div>
      )}
    </div>
  );
}

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

/**
 * Skeleton pour les tableaux
 */
export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="w-full space-y-2" role="status" aria-label="Chargement du tableau">
      {/* Header */}
      <div className="flex gap-4 p-3 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} width={`${100 / columns}%`} height="1rem" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              width={`${100 / columns}%`}
              height="1.25rem"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
