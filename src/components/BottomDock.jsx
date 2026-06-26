import { FloatingDock } from "./ui/floating-dock";
import {
  IconHome,
  IconCalendarEvent,
  IconMessageCircle,
  IconStethoscope,
  IconClipboardHeart,
  IconArticle,
} from "@tabler/icons-react";

export default function BottomDock() {
  const links = [
    {
      title: "Dashboard",
      href: "/",
      icon: <IconHome className="h-full w-full" />,
    },
    {
      title: "Support",
      href: "/specialists",
      icon: <IconStethoscope className="h-full w-full" />,
    },
    {
      title: "Reminders",
      href: "/reminders",
      icon: <IconCalendarEvent className="h-full w-full" />,
    },
    {
      title: "Check-In",
      href: "/dailysurvey",
      icon: <IconClipboardHeart className="h-full w-full" />,
    },
    {
      title: "Articles",
      href: "/articles",
      icon: <IconArticle className="h-full w-full" />,
    },
    {
      title: "Companion",
      href: "/chatbot",
      icon: <IconMessageCircle className="h-full w-full" />,
    },
  ];

  return (
    <div className="fixed bottom-6 left-12 -translate-x-1/2 z-50">
      <FloatingDock items={links} />
    </div>
  );
}