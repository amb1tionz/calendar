'use client'

import { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import { useEffect } from 'react';
import useSWR from 'swr';
import { IcalData } from './../models/icaldata.model';

const fetchIcalData = async (url: string) => {
  const response = await fetch(`/api/ical?icalUrl=${encodeURIComponent(url)}`);
  const data: IcalData = await response.json();
  return data;
};

interface Reservation {
  summary: string;
  startDate: string;
  endDate: string;
  description?: string;
}

interface HomeProps {
  reservations: Reservation[];
}

const Home: NextPage<HomeProps> = ({ reservations }) => {
  useEffect(() => {
    // Your side effects here
  }, []);

  const url = 'https://www.airbnb.com/calendar/ical/878069205393298374.ics?s=c3c41f79ecb5d00912e73d15054d7f71';

  const { data: icalData = [], error } = useSWR(url, fetchIcalData);

  useEffect(() => {
    if (error) {
      console.error('Error fetching iCal data:', error);
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {!icalData && !error && <p className="text-gray-500">Loading iCal data...</p>}
      {error && <p className="text-red-500">{`Error: ${error.message}`}</p>}
      {icalData && (
        <pre className="bg-gray-100 p-4 rounded-lg">
          {JSON.stringify(icalData, null, 2)}
        </pre>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const icalUrl = '...';

  try {
    const response = await axios.get('/api/ical', { params: { icalUrl } });
    const { data } = response.data;
    const reservations: Reservation[] = data;

    return { props: { reservations } };
  } catch (error) {
    console.error('Error fetching iCal data:', error);
    return { props: { reservations: [] } };
  }
};

export default Home;