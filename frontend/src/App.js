// frontend/src/App.js
import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PageShell } from "./layout/PageShell";
import { Container } from "./components/common/Container";
import { Skeleton } from "./components/common/Skeleton";

import BattingLeadersPage from "./pages/BattingLeadersPage";

// IMPORTANT: These must point to files that DEFAULT EXPORT a component
const Home = React.lazy(() => import("./pages/Home"));
const Championships = React.lazy(() => import("./pages/Championships"));
const ChampionshipDetail = React.lazy(
  () => import("./pages/ChampionshipDetail"),
);
const ChampionshipFinal = React.lazy(() => import("./pages/ChampionshipFinal"));
const ChampionshipMvp = React.lazy(() => import("./pages/ChampionshipMvp"));
const Teams = React.lazy(() => import("./pages/Teams"));
const TeamDetail = React.lazy(() => import("./pages/TeamDetail"));
const HallOfFame = React.lazy(() => import("./pages/HallOfFame"));
const Records = React.lazy(() => import("./pages/Records"));
const PlayerStatsPage = React.lazy(() => import("./pages/PlayerStatsPage"));

// FIX: Your file is PlayerProfilePage.js (from what you pasted)
const PlayerProfilePage = React.lazy(() => import("./pages/PlayerProfilePage"));

// FIX: NotFound must be default export (we fixed that file above)
const NotFound = React.lazy(() => import("./pages/NotFound"));

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

            {/* Leaders */}
            <Route path="/leaders/batting" element={<BattingLeadersPage />} />

            {/* Championship stats routes (must be BEFORE /championships/:year) */}
            <Route
              path="/championships/:year/final"
              element={<ChampionshipFinal />}
            />
            <Route
              path="/championships/:year/mvp"
              element={<ChampionshipMvp />}
            />

            {/* Detail Pages */}
            <Route
              path="/championships/:year"
              element={<ChampionshipDetail />}
            />
            <Route path="/teams/:teamSlug" element={<TeamDetail />} />

            {/* FIX: route to the correct component file */}
            <Route path="/players/:id" element={<PlayerProfilePage />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PageShell>
    </Router>
  );
}
