import {
  Calendar,
  Home,
  MapIcon,
  Send,
  Settings,
  University,
} from "lucide-react";

const config = {
  sidebar: {
    navMain: [
      { title: "Home", url: "/dashboard", icon: Home },
      { title: "Schedule", url: "/dashboard/schedule", icon: Calendar },
      { title: "Register", url: "/dashboard/register", icon: University },
      { title: "Plan", url: "/dashboard/plan", icon: MapIcon },
    ],
    navBottom: [
      { title: "Settings", url: "#settings", icon: Settings },
      { title: "Feedback", url: "/feedback", icon: Send },
    ],
  },
};

export default config;
