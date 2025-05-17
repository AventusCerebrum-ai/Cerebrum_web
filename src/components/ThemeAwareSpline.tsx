import { useTheme } from "next-themes";
import DarkSpline from "./spline";
import LightSpline from "./splineLight";

export default function ThemeAwareSpline() {
  const { resolvedTheme } = useTheme();
  
  // Display the appropriate spline component based on the current theme
  return resolvedTheme === "dark" ? <DarkSpline /> : <LightSpline />;
}