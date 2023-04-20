import { useEffect } from "react";

type UseDetectClickOutsideProps = {
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterOpen: boolean;
};

export const useDetectClickOutside = ({
  setIsFilterOpen,
  isFilterOpen,
}: UseDetectClickOutsideProps): void => {
  useEffect(() => {
    const outsideClickListener = (event: MouseEvent) => {
      const openFilterBtn = document.getElementById("openFilters")!;
      const filtersBar = document.getElementById("filters")!;

      if (
        isFilterOpen &&
        !filtersBar?.contains(event.target as Node) &&
        !openFilterBtn?.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("click", outsideClickListener);

    return () => {
      document.removeEventListener("click", outsideClickListener);
    };
  }, [isFilterOpen]);
};
