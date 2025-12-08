import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Calendar, TrendingUp } from 'lucide-react';
import { Container } from '../components/common/Container';
import { Card, CardBody } from '../components/common/Card';
import { Skeleton } from '../components/common/Skeleton';
import { BannerError } from '../components/common/BannerError';

export default function PlayerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/players/${id}`);
        
        if (!response.ok) {
          throw new Error('Player not found');
        }
        
        const data = await response.json();
        setPlayer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPlayer();
    }
  }, [id]);

  if (loading) {
    return (
      <Container className="py-12">
        <Skeleton className="h-12 w-64 mb-8" />
        <Skeleton className="h-96 w-full" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-12">
        <BannerError>{error}</BannerError>
        <button
          onClick={() => navigate('/player-stats')}
          className="mt-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Back to Player Stats
        </button>
      </Container>
    );
  }

  if (!player) return null;

  const hasBatting = player.batting?.stats?.length > 0;
  const hasPitching = player.pitching?.stats?.length > 0;

  return (
    <Container className="py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate('/player-stats')}
        className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Player Stats
      </button>

      {/* Player Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold text-gray-900">
            {player.player.fullName}
          </h1>
          {player.player.isHallOfFame && (
            <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
              <Trophy size={16} />
              Hall of Fame
            </div>
          )}
        </div>
        {player.player.mlbTeam && (
          <p className="text-lg text-gray-600">
            MLB Alumni: {player.player.mlbTeam}
          </p>
        )}
      </div>

      {/* Teams Played For */}
      <Card className="mb-8">
        <CardBody>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Teams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {player.teams.map((team, idx) => {
              const allYears = [
                ...(team.batting_years || []),
                ...(team.pitching_years || [])
              ].filter((v, i, arr) => arr.indexOf(v) === i).sort();
              
              return (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <h3 className="font-bold text-gray-900">{team.name}</h3>
                  {team.city && team.state && (
                    <p className="text-sm text-gray-600">{team.city}, {team.state}</p>
                  )}
                  <p className="text-sm text-blue-600 mt-2">
                    {allYears.join(', ')}
                  </p>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Batting Stats */}
      {hasBatting && (
        <Card className="mb-8">
          <CardBody>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp size={24} />
              Batting Statistics
            </h2>

            {/* Career Totals */}
            {player.batting.career && player.batting.career.seasons > 0 && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-3">Career Totals</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Seasons:</span>
                    <span className="ml-2 font-bold">{player.batting.career.seasons}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Teams:</span>
                    <span className="ml-2 font-bold">{player.batting.career.teams_count}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Games:</span>
                    <span className="ml-2 font-bold">{player.batting.career.total_gp}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">AVG:</span>
                    <span className="ml-2 font-bold">{player.batting.career.career_avg || '.000'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Hits:</span>
                    <span className="ml-2 font-bold">{player.batting.career.total_h}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">HR:</span>
                    <span className="ml-2 font-bold">{player.batting.career.total_hr}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">RBI:</span>
                    <span className="ml-2 font-bold">{player.batting.career.total_rbi}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Runs:</span>
                    <span className="ml-2 font-bold">{player.batting.career.total_r}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">SB:</span>
                    <span className="ml-2 font-bold">{player.batting.career.total_sb}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">OBP:</span>
                    <span className="ml-2 font-bold">{player.batting.career.career_obp || '.000'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">SLG:</span>
                    <span className="ml-2 font-bold">{player.batting.career.career_slg || '.000'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Year by Year Stats */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">G</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">AB</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">AVG</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">H</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">2B</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">3B</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">HR</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">RBI</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">R</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">BB</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">SO</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">SB</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {player.batting.stats.map((stat, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{stat.year}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{stat.team_name}</td>
                      <td className="px-4 py-3 text-sm text-center">{stat.gp || 0}</td>
                      <td className="px-4 py-3 text-sm text-center">{stat.ab || 0}</td>
                      <td className="px-4 py-3 text-sm text-center font-semibold">{stat.avg || '.000'}</td>
                      <td className="px-4 py-3 text-sm text-center">{stat.h || 0}</td>
                      <td className="px-4 py-3 text-sm text-center">{stat.doubles || 0}</td>
                      <td className="px-4 py-3 text-sm text-center">{stat.triples || 0}</td>
                      <td className="px-4 py-3 text-sm text-center">{stat.hr || 0}</td>
                      <td className="px-4 py-3 text-sm text-center">{stat.rbi || 0}</td>
                      <td className="px-4 py-3 text-sm text-center">{stat.r || 0}</td>
                      <td className="px-4 py-3 text-sm text-center">{stat.bb || 0}</td>
                      <td className="px-4 py-3 text-sm text-center">{stat.so || 0}</td>
                      <td className="px-4 py-3 text-sm text-center">{stat.sb || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Pitching Stats */}
      {hasPitching && (
        <Card>
          <CardBody>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp size={24} />
              Pitching Statistics
            </h2>

            {/* Career Totals */}
            {player.pitching.career && player.pitching.career.seasons > 0 && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-3">Career Totals</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Seasons:</span>
                    <span className="ml-2 font-bold">{player.pitching.career.seasons}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Teams:</span>
                    <span className="ml-2 font-bold">{player.pitching.career.teams_count}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Record:</span>
                    <span className="ml-2 font-bold">{player.pitching.career.total_w}-{player.pitching.career.total_l}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">ERA:</span>
                    <span className="ml-2 font-bold">{player.pitching.career.career_era || '0.00'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">APP:</span>
                    <span className="ml-2 font-bold">{player.pitching.career.total_app}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">IP:</span>
                    <span className="ml-2 font-bold">{player.pitching.career.total_ip}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">SO:</span>
                    <span className="ml-2 font-bold">{player.pitching.career.total_so}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">SV:</span>
                    <span className="ml-2 font-bold">{player.pitching.career.total_sv}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Year by Year Stats */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">W</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">L</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">ERA</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">APP</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">GS</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">IP</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">H</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">R</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">ER</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">BB</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">SO</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">SV</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {player.pitching.stats.map((stat, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{stat.year}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{stat.team_name}</td>
                      <td className="px-4 py-3 text-sm text-center">{stat.w || 0}</td>
                      <td className="px-4 py-3 text-sm text-center">{stat.l || 0}</td>
                      <td className="px-4 py-3 text-sm text-center font-semibold">{stat.era || '0.00'}</td>
                      <td className="px-4 py-3 text-sm text-center">{stat.app || 0}</td>
                      <td className="px-4 py-3 text-sm text-center">{stat.gs || 0}</td>
                      <td className="px-4 py-3 text-sm text-center">{stat.ip || '0.0'}</td>
                      <td className="px-4 py-3 text-sm text-center">{stat.h || 0}</td>
                      <td className="px-4 py-3 text-sm text-center">{stat.r || 0}</td>
                      <td className="px-4 py-3 text-sm text-center">{stat.er || 0}</td>
                      <td className="px-4 py-3 text-sm text-center">{stat.bb || 0}</td>
                      <td className="px-4 py-3 text-sm text-center">{stat.so || 0}</td>
                      <td className="px-4 py-3 text-sm text-center">{stat.sv || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}
    </Container>
  );
}
