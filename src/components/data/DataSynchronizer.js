import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import dataFetchService from '../../services/dataFetchService';
import dbService from '../../services/dbService';

const SyncContainer = styled.div`
  padding: 15px;
  background-color: ${props => props.theme.colors.lightBackground};
  border-radius: 8px;
  margin-bottom: 20px;
`;

const SyncHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const SyncButton = styled.button`
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondaryDark};
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.div`
  margin-top: 10px;
  padding: 8px;
  border-radius: 4px;
  background-color: ${props => props.success ? '#e6f7e6' : '#ffebeb'};
  color: ${props => props.success ? '#2e7d32' : '#c62828'};
  display: ${props => props.visible ? 'block' : 'none'};
`;

/**
 * Component for synchronizing match data from the IPL website
 */
const DataSynchronizer = ({ onSyncComplete }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [syncStatus, setSyncStatus] = useState({ message: '', success: true, visible: false });
  const [matchCount, setMatchCount] = useState(0);
  
  // On component mount, check if we need to perform initial data load
  useEffect(() => {
    const checkInitialDataLoad = async () => {
      try {
        // Check if we already have matches in the database
        const matches = await dbService.getAllMatches();
        setMatchCount(matches.length);
        
        // If no matches found, perform initial data load
        if (matches.length === 0) {
          handleSync();
        } else {
          // Set the last sync time from localStorage if available
          const storedSyncTime = localStorage.getItem('lastSyncTime');
          if (storedSyncTime) {
            setLastSyncTime(new Date(storedSyncTime));
          }
        }
      } catch (error) {
        console.error('Error checking initial data load:', error);
        setSyncStatus({
          message: 'Error checking database: ' + error.message,
          success: false,
          visible: true
        });
      }
    };
    
    checkInitialDataLoad();
  }, []);
  
  /**
   * Handle the data synchronization process
   */
  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus({
      message: 'Syncing match data from IPL website...',
      success: true,
      visible: true
    });
    
    try {
      // Fetch match data from the IPL website
      const matches = await dataFetchService.fetchIPLMatches();
      
      // Clear existing matches and store the new ones
      await dbService.clearStore('matches');
      await dbService.storeMatches(matches);
      
      // Update state
      setMatchCount(matches.length);
      const now = new Date();
      setLastSyncTime(now);
      localStorage.setItem('lastSyncTime', now.toISOString());
      
      setSyncStatus({
        message: `Successfully synced ${matches.length} matches from IPL website.`,
        success: true,
        visible: true
      });
      
      // Notify parent component if callback provided
      if (onSyncComplete) {
        onSyncComplete(matches);
      }
    } catch (error) {
      console.error('Error syncing match data:', error);
      setSyncStatus({
        message: 'Error syncing data: ' + error.message,
        success: false,
        visible: true
      });
    } finally {
      setIsSyncing(false);
      
      // Hide status message after 5 seconds
      setTimeout(() => {
        setSyncStatus(prev => ({ ...prev, visible: false }));
      }, 5000);
    }
  };
  
  return (
    <SyncContainer>
      <SyncHeader>
        <div>
          <h3>IPL Match Data Synchronization</h3>
          <p>
            {matchCount > 0 
              ? `${matchCount} matches in database` 
              : 'No matches in database yet'}
            {lastSyncTime && ` (Last sync: ${lastSyncTime.toLocaleString()})`}
          </p>
        </div>
        <SyncButton 
          onClick={handleSync} 
          disabled={isSyncing}
        >
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </SyncButton>
      </SyncHeader>
      
      <StatusMessage 
        success={syncStatus.success} 
        visible={syncStatus.visible}
      >
        {syncStatus.message}
      </StatusMessage>
    </SyncContainer>
  );
};

export default DataSynchronizer;
