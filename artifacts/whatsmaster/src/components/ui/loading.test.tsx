import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingOverlay, Skeleton, CardSkeleton, TableSkeleton } from "./loading";

describe("Loading Components", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("LoadingOverlay", () => {
    it("should not show loading overlay when not loading", () => {
      render(
        <LoadingOverlay isLoading={false}>
          <div data-testid="content">Content</div>
        </LoadingOverlay>
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("should show loading overlay after minDuration when loading", () => {
      render(
        <LoadingOverlay isLoading={true} minDuration={300}>
          <div data-testid="content">Content</div>
        </LoadingOverlay>
      );

      // Avant le minDuration, pas encore d'overlay visible
      expect(screen.queryByText(/chargement/i)).not.toBeInTheDocument();

      // Après le minDuration, l'overlay apparaît
      vi.advanceTimersByTime(300);
      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByLabelText(/chargement en cours/i)).toBeInTheDocument();
    });

    it("should display custom fallback message", () => {
      render(
        <LoadingOverlay isLoading={true} minDuration={0} fallback="Chargement des données...">
          <div>Content</div>
        </LoadingOverlay>
      );

      vi.advanceTimersByTime(100);
      expect(screen.getByText("Chargement des données...")).toBeInTheDocument();
    });

    it("should have proper accessibility attributes", () => {
      render(
        <LoadingOverlay isLoading={true} minDuration={0}>
          <div>Content</div>
        </LoadingOverlay>
      );

      vi.advanceTimersByTime(100);
      const status = screen.getByRole("status");
      expect(status).toHaveAttribute("aria-live", "polite");
      expect(status).toHaveAttribute("aria-busy", "true");
    });

    it("should hide loading and show content when loading completes", () => {
      const { rerender } = render(
        <LoadingOverlay isLoading={true} minDuration={0}>
          <div data-testid="content">Content</div>
        </LoadingOverlay>
      );

      vi.advanceTimersByTime(100);
      expect(screen.getByRole("status")).toBeInTheDocument();

      rerender(
        <LoadingOverlay isLoading={false}>
          <div data-testid="content">Content</div>
        </LoadingOverlay>
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });

  describe("Skeleton", () => {
    it("should render with default props", () => {
      render(<Skeleton />);

      const skeleton = screen.getByRole("img", { hidden: true }) || document.querySelector("div");
      expect(skeleton).toHaveClass("bg-muted");
      expect(skeleton).toHaveClass("animate-pulse");
    });

    it("should accept custom width and height", () => {
      render(<Skeleton width="200px" height="100px" />);

      const skeleton = document.querySelector("div");
      expect(skeleton).toHaveStyle({ width: "200px", height: "100px" });
    });

    it("should accept numeric width and height", () => {
      render(<Skeleton width={150} height={80} />);

      const skeleton = document.querySelector("div");
      expect(skeleton).toHaveStyle({ width: "150px", height: "80px" });
    });

    it("should have custom border radius", () => {
      render(<Skeleton borderRadius="1rem" />);

      const skeleton = document.querySelector("div");
      expect(skeleton).toHaveStyle({ borderRadius: "1rem" });
    });

    it("should disable animation when set to false", () => {
      render(<Skeleton animation={false} />);

      const skeleton = document.querySelector("div");
      expect(skeleton).not.toHaveClass("animate-pulse");
      expect(skeleton).not.toHaveClass("animate-shimmer");
    });

    it("should have aria-hidden attribute", () => {
      render(<Skeleton />);

      const skeleton = document.querySelector("div");
      expect(skeleton).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("CardSkeleton", () => {
    it("should render with all sections by default", () => {
      render(<CardSkeleton />);

      const card = screen.getByLabelText(/chargement de la carte/i);
      expect(card).toBeInTheDocument();
      
      // Devrait avoir une image, un titre et une description
      const skeletons = card.querySelectorAll(".bg-muted");
      expect(skeletons.length).toBeGreaterThan(2);
    });

    it("should hide image when showImage is false", () => {
      const { container } = render(<CardSkeleton showImage={false} />);

      // Le premier skeleton ne devrait pas être une grande image
      const firstSkeleton = container.querySelector(".bg-muted");
      expect(firstSkeleton).not.toHaveStyle({ height: "160px" });
    });

    it("should hide title when showTitle is false", () => {
      render(<CardSkeleton showTitle={false} showDescription={false} showFooter={false} showImage={false} />);

      const card = screen.getByLabelText(/chargement de la carte/i);
      const skeletons = card.querySelectorAll(".bg-muted");
      expect(skeletons.length).toBe(0);
    });

    it("should show footer when showFooter is true", () => {
      render(<CardSkeleton showFooter={true} showImage={false} showTitle={false} showDescription={false} />);

      const card = screen.getByLabelText(/chargement de la carte/i);
      const footerSection = card.querySelector(".flex.justify-between");
      expect(footerSection).toBeInTheDocument();
    });

    it("should have proper accessibility attributes", () => {
      render(<CardSkeleton />);

      const card = screen.getByLabelText(/chargement de la carte/i);
      expect(card).toHaveAttribute("role", "status");
    });
  });

  describe("TableSkeleton", () => {
    it("should render with default 5 rows and 4 columns", () => {
      render(<TableSkeleton />);

      const table = screen.getByLabelText(/chargement du tableau/i);
      expect(table).toBeInTheDocument();

      // Header row
      const headerRow = table.querySelector(".border-b");
      expect(headerRow).toBeInTheDocument();

      // Should have header + 5 data rows
      const rows = table.querySelectorAll(".flex.gap-4");
      expect(rows.length).toBe(6); // 1 header + 5 rows
    });

    it("should accept custom rows and columns", () => {
      render(<TableSkeleton rows={3} columns={6} />);

      const table = screen.getByLabelText(/chargement du tableau/i);
      const rows = table.querySelectorAll(".flex.gap-4");
      
      // 1 header + 3 data rows
      expect(rows.length).toBe(4);
    });

    it("should have proper accessibility attributes", () => {
      render(<TableSkeleton />);

      const table = screen.getByLabelText(/chargement du tableau/i);
      expect(table).toHaveAttribute("role", "status");
    });
  });
});
