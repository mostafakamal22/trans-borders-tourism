import { useEffect } from "react";

export const useScroll = (id: string) => {
  //scroll page back to top when component first mount
  useEffect(() => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
};

export const scrollToTable = () => {
  //scroll page back to table
  const element = document.getElementById("table");
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

export const useScrollWindowToTop = () => {
  useEffect(() => {
    //scroll page back to top when component first mount
    const yOffset = window.pageYOffset;
    window.scrollBy(0, -yOffset);
  }, []);
};
