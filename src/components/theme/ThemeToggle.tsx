import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = theme === "dark"

  return (
    <div className="flex items-center gap-2">
      <Sun size={16} className={`transition-all ${isDark ? "opacity-50" : "text-yellow-500"}`} />
      <Switch 
        checked={isDark}
        onCheckedChange={() => setTheme(isDark ? "light" : "dark")}
        aria-label="Toggle dark mode"
      />
      <Moon size={16} className={`transition-all ${isDark ? "text-primary" : "opacity-50"}`} />
    </div>
  )
}

export default ThemeToggle