"use client";
import { usePathname, useRouter } from "next/navigation";
import RulemateApp from "../components/RulemateApp";

// Lives in the root layout so app state survives route changes.
export default function AppFrame() {
  const pathname = usePathname();
  const router = useRouter();
  return <RulemateApp pathname={pathname} navigate={path => router.push(path)} />;
}
