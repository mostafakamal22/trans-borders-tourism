import { useEffect } from "react";

function useDocumentTitle(title: string): void {
  useEffect(() => {
    window.document.title = title;
  }, [title]);
}

export default useDocumentTitle;
