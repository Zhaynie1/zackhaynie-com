"use client";

import { usePathname } from "next/navigation";

/**
 * A nav link to a section of the home page.
 *
 * Plain `<a href="#work">` was broken two ways:
 *  1. On any page other than "/", the target id doesn't exist, so the link
 *     did nothing at all.
 *  2. Once the URL already ends in "#work", clicking it again doesn't change
 *     the hash, so the browser has no reason to scroll. Scroll up by hand,
 *     click the same link, and nothing happens.
 *
 * On the home page we scroll explicitly, which works every time regardless of
 * the current hash. Anywhere else the href navigates home and lands on the
 * section normally.
 */
export function NavAnchor({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    // Let modified clicks (new tab, etc.) and off-home clicks behave normally.
    if (pathname !== "/") return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });

    // Keep the URL honest without pushing a history entry the back button
    // would have to chew through.
    history.replaceState(null, "", id === "top" ? "/" : `#${id}`);
  }

  return (
    <a href={`/#${id}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
