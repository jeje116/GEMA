import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { LanguageProvider } from '../i18n/LanguageProvider';
import { UIProvider } from '../components/shared/UIContext';

// Pages
import HomePage from '../pages/HomePage';
import MenuPage from '../pages/MenuPage';
import ExperiencePage from '../pages/ExperiencePage';
import PrivateDiningPage from '../pages/PrivateDiningPage';
import EventsPage from '../pages/EventsPage';
import EventDetailPage from '../pages/EventDetailPage';
import AboutPage from '../pages/AboutPage';
import ChefPage from '../pages/ChefPage';
import RecognitionPage from '../pages/RecognitionPage';
import VisitPage from '../pages/VisitPage';
import JournalPage from '../pages/JournalPage';
import JournalDetailPage from '../pages/JournalDetailPage';
import NotFoundPage from '../pages/NotFoundPage';

// Layout
import SiteHeader from '../components/layout/SiteHeader';
import SiteFooter from '../components/layout/SiteFooter';
import AudioControl from '../components/layout/AudioControl';
import ReservationOverlay from '../components/reservation/ReservationOverlay';
import MobileReserveBar from '../components/reservation/MobileReserveBar';
import GatewayExperience from '../components/gateway/GatewayExperience';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    // Only scroll if not navigating via hash/anchor
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
};

const RootLayout = () => {
  return (
    <LanguageProvider>
      <UIProvider>
        <ScrollToTop />
        <GatewayExperience />
        <SiteHeader />
        <main id="main-content" className="flex-1 bg-[var(--background)]">
          <Outlet />
        </main>
        <SiteFooter />
        <AudioControl />
        <MobileReserveBar />
        <ReservationOverlay />
      </UIProvider>
    </LanguageProvider>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'menu', element: <MenuPage /> },
      { path: 'experience', element: <ExperiencePage /> },
      { path: 'private-dining', element: <PrivateDiningPage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'events/:slug', element: <EventDetailPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'chef/mandif-warokka', element: <ChefPage /> },
      { path: 'recognition', element: <RecognitionPage /> },
      { path: 'visit', element: <VisitPage /> },
      { path: 'journal', element: <JournalPage /> },
      { path: 'journal/:slug', element: <JournalDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
