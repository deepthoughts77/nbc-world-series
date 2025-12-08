import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PageShell } from "./layout/PageShell";
import { Container } from "./components/common/Container";
import { Skeleton } from "./components/common/Skeleton";

// Lazy load all pages for better performance (code-splitting)
// This requires each page file to use 'export default function ...'
const Home = React.lazy(() => import("./pages/Home"));
const Championships = React.lazy(() => import("./pages/Championships"));
const ChampionshipDetail = React.lazy(() =>
  import("./pages/ChampionshipDetail")
);
const Teams = React.lazy(() => import("./pages/Teams"));
const TeamDetail = React.lazy(() => import("./pages/TeamDetail"));
const HallOfFame = React.lazy(() => import("./pages/HallOfFame"));
const Records = React.lazy(() => import("./pages/Records"));
const PlayerStatsPage = React.lazy(() => import("./pages/PlayerStatsPage"));
const PlayerProfile = React.lazy(() => import("./pages/PlayerProfile"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

// A simple loading component to show while pages are loading
function PageLoader() {
  return (
    <Container className="py-12">
      <Skeleton className="h-64" />
    </Container>
  );
}

export default function App() {
  return (
    <Router>
      <PageShell>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Core Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/championships" element={<Championships />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/hall-of-fame" element={<HallOfFame />} />
            <Route path="/records" element={<Records />} />
            <Route path="/player-stats" element={<PlayerStatsPage />} />

            {/* Detail Pages */}
            <Route
              path="/championships/:year"
              element={<ChampionshipDetail />}
            />
            <Route path="/teams/:teamSlug" element={<TeamDetail />} />
            <Route path="/players/:id" element={<PlayerProfile />} />

            {/* 404 Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PageShell>
    </Router>
  );
}
