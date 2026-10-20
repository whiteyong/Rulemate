"use client";
import { usePathname } from "next/navigation";
import RulemateApp from "../components/RulemateApp";

// Lives in the root layout so app state survives route changes. Every route renders
// this same app, so in-app navigation only needs to update the address bar:
// history.pushState is instant and never waits on the network (router.push did, and a
// late response could flip the screen back to an earlier page).
export default function AppFrame() {
  const pathname = usePathname();
  return <RulemateApp pathname={pathname} navigate={path => window.history.pushState(null, "", path)} />;
}
