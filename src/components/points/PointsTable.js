import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import dbService from '../../services/dbService';

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  padding: '12px 16px',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const TeamCell = styled(TableCell)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
}));

const TeamLogo = styled('img')({
  width: '30px',
  height: '30px',
  objectFit: 'contain',
});

const PointsTable = () => {
  const theme = useTheme();
  const [pointsData, setPointsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPointsData = async () => {
      try {
        // Fetch teams from the database
        const teams = await dbService.getAllTeams();
        
        // Hardcoded points data for the 2024 IPL season
        // This would ideally come from an API or database
        const pointsData = [
          { 
            teamId: 4, // Kolkata Knight Riders
            matches: 14,
            won: 10,
            lost: 4,
            tied: 0,
            nr: 0,
            points: 20,
            nrr: 1.428,
            lastFive: ['W', 'W', 'L', 'W', 'W']
          },
          { 
            teamId: 7, // Rajasthan Royals
            matches: 14,
            won: 9,
            lost: 5,
            tied: 0,
            nr: 0,
            points: 18,
            nrr: 0.273,
            lastFive: ['L', 'L', 'W', 'L', 'W']
          },
          { 
            teamId: 1, // Mumbai Indians
            matches: 14,
            won: 8,
            lost: 6,
            tied: 0,
            nr: 0,
            points: 16,
            nrr: 0.194,
            lastFive: ['W', 'W', 'W', 'L', 'L']
          },
          { 
            teamId: 2, // Chennai Super Kings
            matches: 14,
            won: 8,
            lost: 6,
            tied: 0,
            nr: 0,
            points: 16,
            nrr: 0.092,
            lastFive: ['L', 'W', 'W', 'W', 'L']
          },
          { 
            teamId: 8, // Sunrisers Hyderabad
            matches: 14,
            won: 7,
            lost: 7,
            tied: 0,
            nr: 0,
            points: 14,
            nrr: 0.406,
            lastFive: ['W', 'L', 'L', 'W', 'L']
          },
          { 
            teamId: 5, // Delhi Capitals
            matches: 14,
            won: 7,
            lost: 7,
            tied: 0,
            nr: 0,
            points: 14,
            nrr: -0.191,
            lastFive: ['W', 'L', 'W', 'L', 'W']
          },
          { 
            teamId: 3, // Royal Challengers Bangalore
            matches: 14,
            won: 6,
            lost: 8,
            tied: 0,
            nr: 0,
            points: 12,
            nrr: -0.356,
            lastFive: ['W', 'W', 'W', 'L', 'L']
          },
          { 
            teamId: 10, // Lucknow Super Giants
            matches: 14,
            won: 6,
            lost: 8,
            tied: 0,
            nr: 0,
            points: 12,
            nrr: -0.467,
            lastFive: ['L', 'L', 'L', 'W', 'L']
          },
          { 
            teamId: 6, // Punjab Kings
            matches: 14,
            won: 5,
            lost: 9,
            tied: 0,
            nr: 0,
            points: 10,
            nrr: -0.446,
            lastFive: ['L', 'W', 'L', 'L', 'L']
          },
          { 
            teamId: 9, // Gujarat Titans
            matches: 14,
            won: 4,
            lost: 10,
            tied: 0,
            nr: 0,
            points: 8,
            nrr: -1.063,
            lastFive: ['L', 'L', 'L', 'W', 'L']
          }
        ];

        // Merge team data with points data
        const mergedData = pointsData.map(pointData => {
          const team = teams.find(team => team.id === pointData.teamId);
          return {
            ...pointData,
            teamName: team ? team.name : `Team ${pointData.teamId}`,
            teamShortName: team ? team.shortName : `T${pointData.teamId}`,
            teamLogo: team ? team.logo : '/assets/images/teams/default.png'
          };
        });

        setPointsData(mergedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching points data:', error);
        setLoading(false);
      }
    };

    fetchPointsData();
  }, []);

  // Function to render the last 5 matches with colored indicators
  const renderLastFive = (lastFive) => {
    return (
      <Box sx={{ display: 'flex', gap: '4px' }}>
        {lastFive.map((result, index) => (
          <Box
            key={index}
            sx={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: result === 'W' ? '#4caf50' : result === 'L' ? '#f44336' : '#9e9e9e',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            {result}
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
        IPL 2024 Points Table
      </Typography>
      
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Pos</StyledTableCell>
              <StyledTableCell>Team</StyledTableCell>
              <StyledTableCell align="center">M</StyledTableCell>
              <StyledTableCell align="center">W</StyledTableCell>
              <StyledTableCell align="center">L</StyledTableCell>
              <StyledTableCell align="center">T</StyledTableCell>
              <StyledTableCell align="center">NR</StyledTableCell>
              <StyledTableCell align="center">Pts</StyledTableCell>
              <StyledTableCell align="center">NRR</StyledTableCell>
              <StyledTableCell align="center">Last 5</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <StyledTableRow>
                <TableCell colSpan={10} align="center">Loading points data...</TableCell>
              </StyledTableRow>
            ) : (
              pointsData.map((team, index) => (
                <StyledTableRow key={team.teamId}>
                  <TableCell>{index + 1}</TableCell>
                  <TeamCell>
                    <TeamLogo src={team.teamLogo} alt={team.teamName} />
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {team.teamName}
                    </Typography>
                  </TeamCell>
                  <TableCell align="center">{team.matches}</TableCell>
                  <TableCell align="center">{team.won}</TableCell>
                  <TableCell align="center">{team.lost}</TableCell>
                  <TableCell align="center">{team.tied}</TableCell>
                  <TableCell align="center">{team.nr}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>{team.points}</TableCell>
                  <TableCell align="center">{team.nrr.toFixed(3)}</TableCell>
                  <TableCell align="center">{renderLastFive(team.lastFive)}</TableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Note:</strong> The top 4 teams qualify for the playoffs.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>M:</strong> Matches, <strong>W:</strong> Won, <strong>L:</strong> Lost, <strong>T:</strong> Tied, <strong>NR:</strong> No Result, <strong>Pts:</strong> Points, <strong>NRR:</strong> Net Run Rate
        </Typography>
      </Box>
    </Box>
  );
};

export default PointsTable;
