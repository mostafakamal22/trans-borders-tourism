import { useEffect } from "react";

type UseDetectClickOutsideProps = {
  element: HTMLDivElement;
  cb: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
};

export const useDetectClickOutside = ({
  element,
  cb,
  isOpen,
}: UseDetectClickOutsideProps): void => {
  useEffect(() => {
    const outsideClickListener = (event: MouseEvent) => {
      const openFilterBtn = document.getElementById("openFilter")!;
      if (
        !element?.contains(event.target as Node) &&
        isOpen &&
        !openFilterBtn?.contains(event.target as Node)
      ) {
        console.log("first");
        cb(false);
      }
    };
    document.addEventListener("click", outsideClickListener);

    return () => {
      document.removeEventListener("click", outsideClickListener);
    };
  }, []);
};
