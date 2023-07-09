import axios from 'axios';
import ical, { CalendarComponent, VEvent } from 'node-ical';
import { NextApiRequest, NextApiResponse } from 'next';

import { Reservation } from './../../models/reservation.model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { icalUrl } = req.query;

  try {
    const response = await axios.get<string>(icalUrl as string);
    const icalData: string = response.data;

    const parsedData = ical.parseICS(icalData);
    
    const reservations: Reservation[] = Object.values(parsedData).reduce((acc: Reservation[], component: CalendarComponent) => {
      if (component.type === 'VEVENT') {
        const event = component as VEvent;
        const uid = event.uid;
        const summary = event.summary;
        const startDate = event.start;
        const endDate = event.end;
        const description = event.description;

        acc.push({ uid, summary, startDate, endDate, description });
      }
      return acc;
    }, []);
    
    res.status(200).json({
      success: true,
      data: reservations
    });

  } catch (error) {
    console.error('Error fetching iCal data: ', error);
    res.status(500).json({ success: false, error: 'Failed to fetch iCal data'})
  }
}