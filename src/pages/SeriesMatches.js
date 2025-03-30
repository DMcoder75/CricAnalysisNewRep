import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axiosClient from '../services/axiosClient';
import MatchCard from '../components/matches/MatchCard';
import Loader from '../components/common/Loader';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import theme from '../utils/theme';
import SeriesOverview from '../components/series/SeriesOverview';
import { NavLink } from 'react-router-dom';

const SeriesMatches = () => {
  const [matches, setMatches] = useState([]);
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Extract the series ID or slug from the URL
        const pathParts = location.pathname.split('/');
        let seriesIdOrSlug = pathParts[pathParts.indexOf('series') + 1];
        
        if (!seriesIdOrSlug) {
          throw new Error('Series ID or slug not found in URL');
        }

        // Check if we're using a UUID path
        if (pathParts.includes('uuid')) {
          seriesIdOrSlug = pathParts[pathParts.indexOf('uuid') + 1];
        }

        console.log(`Fetching data for series: ${seriesIdOrSlug}`);
        
        // First, fetch the series details directly from CricAPI
        try {
          const seriesResponse = await axiosClient.get(`series_info?id=${seriesIdOrSlug}`);
          console.log('Series response:', seriesResponse);
          
          if (seriesResponse.data && seriesResponse.data.status === 'success' && seriesResponse.data.data) {
            // Transform the CricAPI response to match our expected format
            const seriesData = seriesResponse.data.data;
            const formattedSeries = {
              id: seriesData.id,
              name: seriesData.name,
              startDate: seriesData.startDate,
              endDate: seriesData.endDate,
              odi: seriesData.odi,
              t20: seriesData.t20,
              test: seriesData.test,
              squads: seriesData.squads || [],
              matches: seriesData.matches || []
            };
            
            setSeries(formattedSeries);
            console.log(`Loaded series details for: ${formattedSeries.name}`);
            
            // If we have matches in the series data, use those
            if (formattedSeries.matches && formattedSeries.matches.length > 0) {
              const formattedMatches = formattedSeries.matches.map(match => ({
                id: match.id,
                name: match.name || `${match.teams?.[0]?.name || 'Team A'} vs ${match.teams?.[1]?.name || 'Team B'}`,
                status: match.status || 'upcoming',
                venue: match.venue || 'TBD',
                date: match.date || match.dateTimeGMT,
                teams: match.teams || [],
                // Include score information if available
                score: match.score ? match.score.map(s => ({
                  team: s.inning ? s.inning.split(' ')[0] : (match.teams?.[match.score.indexOf(s)]?.name || 'Unknown'),
                  score: `${s.r}/${s.w} (${s.o} ov)`
                })) : [],
                statusCategory: match.status?.toLowerCase().includes('live') || match.status?.toLowerCase().includes('ongoing') ? 
                  'live' : 
                  (match.status?.toLowerCase().includes('won') || match.status?.toLowerCase().includes('drawn') || match.status?.toLowerCase().includes('tied') ? 
                    'completed' : 'upcoming')
              }));
              
              setMatches(formattedMatches);
              console.log(`Loaded ${formattedMatches.length} matches from series data`);
            } else {
              // If no matches in series data, try to fetch them separately
              try {
                const matchesResponse = await axiosClient.get(`series_matches?id=${seriesIdOrSlug}`);
                
                if (matchesResponse.data && matchesResponse.data.status === 'success' && matchesResponse.data.data) {
                  const formattedMatches = matchesResponse.data.data.map(match => ({
                    id: match.id,
                    name: match.name || `${match.teams?.[0]?.name || 'Team A'} vs ${match.teams?.[1]?.name || 'Team B'}`,
                    status: match.status || 'upcoming',
                    venue: match.venue || 'TBD',
                    date: match.date || match.dateTimeGMT,
                    teams: match.teams || [],
                    // Include score information if available
                    score: match.score ? match.score.map(s => ({
                      team: s.inning ? s.inning.split(' ')[0] : (match.teams?.[match.score.indexOf(s)]?.name || 'Unknown'),
                      score: `${s.r}/${s.w} (${s.o} ov)`
                    })) : [],
                    statusCategory: match.status?.toLowerCase().includes('live') || match.status?.toLowerCase().includes('ongoing') ? 
                      'live' : 
                      (match.status?.toLowerCase().includes('won') || match.status?.toLowerCase().includes('drawn') || match.status?.toLowerCase().includes('tied') ? 
                        'completed' : 'upcoming')
                  }));
                  
                  setMatches(formattedMatches);
                  console.log(`Loaded ${formattedMatches.length} matches from separate API call`);
                } else {
                  console.warn('No matches found in separate API call');
                  setMatches([]);
                }
              } catch (matchesError) {
                console.error('Error fetching matches separately:', matchesError);
                setMatches([]);
              }
            }
          } else {
            console.error('Invalid series response format:', seriesResponse.data);
            throw new Error('Invalid response format from CricAPI when fetching series details');
          }
        } catch (seriesError) {
          console.error('Error fetching series details:', seriesError);
          throw new Error(`Failed to fetch series details: ${seriesError.message}`);
        }
      } catch (error) {
        console.error('Error fetching series data:', error);
        setError(`Failed to fetch series data: ${error.message}`);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.pathname]);

  if (loading) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
        <BackButton onClick={() => navigate('/series')}>
          Back to Series
        </BackButton>
      </Container>
    );
  }

  return (
    <Container>
      {series && <SeriesOverview series={series} />}
      
      <MatchesHeading>Matches</MatchesHeading>
      
      {matches.length === 0 ? (
        <NoMatchesMessage>No matches found for this series.</NoMatchesMessage>
      ) : (
        <MatchesGrid>
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </MatchesGrid>
      )}
      
      <BackButton onClick={() => navigate('/series')}>
        Back to Series
      </BackButton>
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const MatchesHeading = styled.h2`
  font-size: 1.8rem;
  margin: 2rem 0 1rem;
  color: ${theme.colors.primary};
`;

const MatchesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const NoMatchesMessage = styled.p`
  font-size: 1.2rem;
  color: ${theme.colors.textSecondary};
  text-align: center;
  margin: 2rem 0;
`;

const ErrorMessage = styled.div`
  background-color: ${theme.colors.error};
  color: white;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const BackButton = styled.button`
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 2rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${theme.colors.primaryDark};
  }
`;

export default SeriesMatches;
