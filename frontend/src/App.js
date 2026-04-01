// frontend/src/App.js
import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PageShell } from "./layout/PageShell";
import { Container } from "./components/common/Container";
import { Skeleton } from "./components/common/Skeleton";

import BattingLeadersPage from "./pages/BattingLeadersPage";
import TeamYearDetail from "./pages/TeamYearDetail";

const Home = React.lazy(() => import("./pages/Home"));
const Championships = React.lazy(() => import("./pages/Championships"));
const ChampionshipDetail = React.lazy(
  () => import("./pages/ChampionshipDetail"),
);
const ChampionshipFinal = React.lazy(() => import("./pages/ChampionshipFinal"));
const ChampionshipMvp = React.lazy(() => import("./pages/ChampionshipMvp"));
const Teams = React.lazy(() => import("./pages/Teams"));
const TeamDetail = React.lazy(() => import("./pages/TeamDetail"));
const TeamTotalsPage = React.lazy(() => import("./pages/TeamTotalsPage"));
const TeamHistoryTotals = React.lazy(() => import("./pages/TeamHistoryTotals"));
const SearchResults = React.lazy(() => import("./pages/SearchResults"));
const HallOfFame = React.lazy(() => import("./pages/HallOfFame"));
const Records = React.lazy(() => import("./pages/Records"));
const PlayerStatsPage = React.lazy(() => import("./pages/PlayerStatsPage"));
const PlayerProfile = React.lazy(() => import("./pages/PlayerProfile"));
const PlayerComparison = React.lazy(() => import("./pages/PlayerComparison"));
const LeadingPitchers = React.lazy(() => import("./pages/LeadingPitchers"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Archives = React.lazy(() => import("./pages/Archives"));

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
            <Route path="/team-totals" element={<TeamTotalsPage />} />
            <Route path="/hall-of-fame" element={<HallOfFame />} />
            <Route path="/records" element={<Records />} />
            <Route path="/player-stats" element={<PlayerStatsPage />} />
            <Route path="/compare" element={<PlayerComparison />} />
            <Route path="/search" element={<SearchResults />} />

            {/* Leaders */}
            <Route path="/leaders/batting" element={<BattingLeadersPage />} />
            <Route path="/leaders/pitching" element={<LeadingPitchers />} />

            {/* Championship Detail Pages */}
            <Route
              path="/championships/:year/final"
              element={<ChampionshipFinal />}
            />
            <Route
              path="/championships/:year/mvp"
              element={<ChampionshipMvp />}
            />
            <Route
              path="/championships/:year"
              element={<ChampionshipDetail />}
            />

            {/* Team Pages — order matters: /totals before /:year */}
            <Route
              path="/teams/:teamSlug/totals"
              element={<TeamHistoryTotals />}
            />
            <Route path="/teams/:teamSlug/:year" element={<TeamYearDetail />} />
            <Route path="/teams/:teamSlug" element={<TeamDetail />} />

            {/* Player Pages */}
            <Route path="/players/:id" element={<PlayerProfile />} />

            {/* Archives */}
            <Route path="/archives" element={<Archives />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PageShell>
    </Router>
  );
}
