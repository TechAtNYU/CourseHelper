import {
  BookOpen,
  Calendar,
  LayoutDashboard,
  MapIcon,
  Send,
  Settings,
  ShieldCheck,
} from "lucide-react";

const config = {
  sidebar: {
    navMain: [
      { title: "Home", url: "/dashboard", icon: LayoutDashboard },
      { title: "Schedule", url: "/dashboard/schedule", icon: Calendar },
      { title: "4-Year Plan", url: "/dashboard/plan", icon: MapIcon },
      { title: "Course Catalog", url: "/dashboard/courses", icon: BookOpen },
    ],
    navBottom: [
      { title: "Settings", url: "/settings", icon: Settings },
      { title: "Feedback", url: "/feedback", icon: Send },
    ],
    navAdmin: [{ title: "Admin", url: "/dashboard/admin", icon: ShieldCheck }],
  },
};

export default config;
