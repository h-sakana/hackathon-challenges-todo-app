import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * スクロール位置の不具合を修正
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
