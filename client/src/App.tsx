import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Router as WouterRouter } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { StudioProvider } from "./contexts/StudioStore";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import Memberships from "./pages/Memberships";
import About from "./pages/About";
import Visit from "./pages/Visit";

const routerBase = import.meta.env.BASE_URL.replace(/\/$/, "");


function AppRoutes() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/services"} component={Services} />
      <Route path={"/book"} component={Booking} />
      <Route path={"/memberships"} component={Memberships} />
      <Route path={"/about"} component={About} />
      <Route path={"/visit"} component={Visit} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          {/* Top-right: on small screens the booking action dock and the
              back-to-top button both live at the bottom edge. */}
          <Toaster position="top-right" richColors closeButton />
          <WouterRouter base={routerBase}><StudioProvider><AppRoutes /></StudioProvider></WouterRouter>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
