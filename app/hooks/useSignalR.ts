import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { useQueryClient } from '@tanstack/react-query';

const useSignalR = (queryKey: any[]) => {
  // console.log('queryKey', queryKey);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://nx55w24v-7240.euw.devtunnels.ms/ReservationHub')
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    setConnection(newConnection);

    return () => {
      if (newConnection.state !== signalR.HubConnectionState.Disconnected) {
        newConnection.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log('Connected to SignalR');

          // Listen for a specific event from the backend
          connection.on('ReservationUpdated', () => {
            console.log('Data update received, refetching...');
            queryClient.invalidateQueries({ queryKey: [...queryKey] });
          });
        })
        .catch((err) => console.error('SignalR Connection Error: ', err));
    }
  }, [connection, queryClient, queryKey]);

  return connection;
};

export default useSignalR;
