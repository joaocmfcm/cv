import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the public directory exists before writing to it
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const outPath = path.join(publicDir, 'strava-data.json');

const CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.STRAVA_REFRESH_TOKEN;

async function fetchStrava() {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    console.error('Missing Strava credentials. Please set STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, and STRAVA_REFRESH_TOKEN.');
    process.exit(1);
  }

  console.log('Fetching new access token...');
  const tokenRes = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN
    })
  });
  
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    console.error('Failed to get access token:', tokenData);
    process.exit(1);
  }

  const accessToken = tokenData.access_token;
  console.log('Access token retrieved successfully.');

  // One year ago timestamp
  const oneYearAgo = Math.floor((Date.now() - 365 * 24 * 60 * 60 * 1000) / 1000);
  
  let page = 1;
  let allActivities = [];
  
  console.log('Fetching activities...');
  while (true) {
    console.log(`Fetching page ${page}...`);
    const res = await fetch(`https://www.strava.com/api/v3/athlete/activities?after=${oneYearAgo}&per_page=200&page=${page}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const activities = await res.json();
    
    if (activities.errors) {
        console.error('API Error', activities);
        break;
    }
    
    if (!Array.isArray(activities) || activities.length === 0) {
      break;
    }
    
    allActivities = allActivities.concat(activities);
    if (activities.length < 200) {
        break;
    }
    page++;
  }

  console.log(`Fetched a total of ${allActivities.length} activities.`);

  // Aggregate logic
  const aggregated = {};
  
  // Track start of 52 weeks ago, aligned to sunday
  // To align with a github-style grid (where rows are Sun-Sat), we need to start on the Sunday 52 weeks ago.
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
  
  const totalDays = (52 * 7) + (dayOfWeek + 1);
  
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - totalDays + 1);
  
  let currentDate = new Date(startDate);
  
  while (currentDate <= today) {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    aggregated[dateStr] = { date: dateStr, count: 0, kcal: 0, duration: 0 };
    currentDate.setDate(currentDate.getDate() + 1);
  }

  allActivities.forEach(activity => {
    // Handle Strava date strings which represent local time e.g., "2024-03-24T10:00:00Z"
    const dateStr = activity.start_date_local.split('T')[0];
    
    if (aggregated[dateStr]) {
      aggregated[dateStr].count += 1;
      
      // Fallback calculation for activities without calories/kilojoules
      let cals = activity.calories || activity.kilojoules || 0;
      if (cals === 0 && activity.moving_time > 0) {
        const minutes = activity.moving_time / 60;
        switch(activity.type) {
            case 'Run': cals = minutes * 11; break;
            case 'Ride': 
            case 'VirtualRide': cals = minutes * 9; break;
            case 'WeightTraining': cals = minutes * 5; break;
            case 'Walk': cals = minutes * 4; break;
            case 'Swim': cals = minutes * 7; break;
            case 'Workout': cals = minutes * 5; break;
            default: cals = minutes * 6; break;
        }
      }
      
      aggregated[dateStr].kcal += Math.round(cals);
      
      aggregated[dateStr].duration += Math.round(activity.moving_time / 60);
    }
  });

  const finalData = Object.values(aggregated);
  
  // Use public directory for vite since it handles static assets natively
  const outPath = path.join(__dirname, '..', 'public', 'strava-data.json');
  fs.writeFileSync(outPath, JSON.stringify(finalData, null, 2));
  console.log(`Successfully wrote ${finalData.length} days of records to strava-data.json`);
}

fetchStrava().catch(console.error);
