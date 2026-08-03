import { CurrentWeather, DailyData, HourlyData, PlanningRecommendation, TemperatureUnit } from '../types';
import { celsiusToFahrenheit } from './unitConversion';

export function generatePlanningRecommendations(
  current: CurrentWeather,
  daily: DailyData,
  hourly: HourlyData,
  unit: TemperatureUnit
): PlanningRecommendation[] {
  const recommendations: PlanningRecommendation[] = [];

  const tempC = current.temperature_2m;
  const tempF = celsiusToFahrenheit(tempC);
  const tempDisplay = unit === 'F' ? `${tempF}°F` : `${Math.round(tempC)}°C`;
  const feelsC = current.apparent_temperature;
  const humidity = current.relative_humidity_2m;
  const windKmh = current.wind_speed_10m;
  const gustsKmh = current.wind_gusts_10m;
  const code = current.weather_code;
  const isDay = Boolean(current.is_day);
  const cloudCover = current.cloud_cover;
  
  // Today max rain prob & max UV
  const todayRainProb = daily.precipitation_probability_max?.[0] ?? 0;
  const todayUv = daily.uv_index_max?.[0] ?? 0;
  const todayMaxTemp = daily.temperature_2m_max?.[0] ?? tempC;
  const todayMinTemp = daily.temperature_2m_min?.[0] ?? tempC;
  const isRainyCondition = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code);
  const isSnowyCondition = [71, 73, 75, 77, 85, 86].includes(code);
  const isThunderstorm = [95, 96, 99].includes(code);

  // 1. CLOTHING RECOMMENDATIONS
  if (tempC < 5) {
    recommendations.push({
      id: 'rec-clothing-heavy-winter',
      category: 'clothing',
      title: 'Heavy Winter Apparel Required',
      description: `Freezing ambient temperatures (${tempDisplay}). Layer up with a heavy insulated coat, thermal base layers, beanie, and gloves.`,
      status: 'caution',
      iconName: 'Shirt',
      metricLabel: `${tempDisplay} Freezing`,
      tags: ['Thermals', 'Heavy Coat', 'Gloves'],
    });
  } else if (tempC >= 5 && tempC < 15) {
    recommendations.push({
      id: 'rec-clothing-cool-layer',
      category: 'clothing',
      title: 'Layered Clothing & Jacket',
      description: `Brisk conditions at ${tempDisplay}. Wear a windproof fleece or medium sweater over a base tee for adaptable comfort.`,
      status: 'good',
      iconName: 'Shirt',
      metricLabel: `${tempDisplay} Brisk`,
      tags: ['Light Jacket', 'Sweater', 'Layers'],
    });
  } else if (tempC >= 15 && tempC <= 25) {
    recommendations.push({
      id: 'rec-clothing-mild',
      category: 'clothing',
      title: 'Comfortable Mild Attire',
      description: `Pleasant thermal range (${tempDisplay}). Breathable long sleeves or light tee with cotton trousers will be ideal today.`,
      status: 'excellent',
      iconName: 'Shirt',
      metricLabel: `${tempDisplay} Optimal`,
      tags: ['T-Shirt', 'Breathable', 'Chinos'],
    });
  } else {
    recommendations.push({
      id: 'rec-clothing-hot',
      category: 'clothing',
      title: 'Lightweight & Airy Apparel',
      description: `High heat environment at ${tempDisplay}. Wear loose, light-colored cotton or linen garments to stay cool and ventilated.`,
      status: 'good',
      iconName: 'Sun',
      metricLabel: `${tempDisplay} Hot`,
      tags: ['Linen', 'Shorts', 'Light Colors'],
    });
  }

  // 2. GEAR & PACKING RECOMMENDATIONS
  if (isRainyCondition || todayRainProb >= 50) {
    recommendations.push({
      id: 'rec-gear-umbrella',
      category: 'gear',
      title: 'Pack an Umbrella & Waterproofs',
      description: `Precipitation likely today (${todayRainProb}% chance). Keep a compact umbrella and water-resistant footwear handy.`,
      status: 'caution',
      iconName: 'Umbrella',
      metricLabel: `${todayRainProb}% Rain Risk`,
      tags: ['Umbrella', 'Waterproof Shoes', 'Rain Cover'],
    });
  } else {
    recommendations.push({
      id: 'rec-gear-dry',
      category: 'gear',
      title: 'No Rain Gear Needed',
      description: `Minimal chance of rain today (${todayRainProb}%). Leave heavy umbrellas at home and enjoy a dry day out.`,
      status: 'excellent',
      iconName: 'CheckCircle2',
      metricLabel: 'Dry Skies',
      tags: ['No Umbrella Required'],
    });
  }

  if (todayUv >= 6) {
    recommendations.push({
      id: 'rec-gear-sun-protection',
      category: 'gear',
      title: 'Apply SPF 30+ & Sunglasses',
      description: `Peak UV index reaching ${todayUv.toFixed(1)} (High). Use broad-spectrum sunscreen, polarized sunglasses, and a wide-brim hat outdoors.`,
      status: 'caution',
      iconName: 'SunMedium',
      metricLabel: `UV Index ${todayUv.toFixed(1)}`,
      tags: ['Sunscreen', 'Sunglasses', 'Hat'],
    });
  }

  // 3. OUTDOOR ACTIVITIES
  // Outdoor Running / Jogging
  if (isThunderstorm || isRainyCondition || tempC > 33 || tempC < -2) {
    recommendations.push({
      id: 'rec-act-running-poor',
      category: 'activity',
      title: 'Outdoor Running: Postpone or Treadmill',
      description: isThunderstorm
        ? 'Thunderstorms present safety hazards. Move workouts indoors.'
        : isRainyCondition
        ? 'Slippery surfaces and steady precipitation make running unpleasant.'
        : 'Extreme temperatures impose physical strain.',
      status: 'poor',
      iconName: 'Activity',
      metricLabel: 'Indoor Suggested',
      tags: ['Running', 'Gym', 'Indoor'],
    });
  } else if (tempC >= 10 && tempC <= 23 && windKmh < 25 && todayRainProb < 30) {
    recommendations.push({
      id: 'rec-act-running-great',
      category: 'activity',
      title: 'Prime Conditions for Outdoor Running',
      description: `Ideal running weather: crisp ${tempDisplay}, low wind (${Math.round(windKmh)} km/h), and zero precipitation interference.`,
      status: 'excellent',
      iconName: 'Zap',
      metricLabel: '10/10 Condition',
      tags: ['Jogging', 'Marathon Prep', 'Trail Run'],
    });
  } else {
    recommendations.push({
      id: 'rec-act-running-moderate',
      category: 'activity',
      title: 'Outdoor Running: Good with Preparation',
      description: `Fair running conditions. Hydrate properly and choose shaded or sheltered routes.`,
      status: 'good',
      iconName: 'Activity',
      metricLabel: 'Moderate',
      tags: ['Running', 'Hydration'],
    });
  }

  // Outdoor Dining / Picnic
  if (!isRainyCondition && todayRainProb < 25 && tempC >= 18 && tempC <= 28 && windKmh < 20) {
    recommendations.push({
      id: 'rec-act-dining-great',
      category: 'activity',
      title: 'Great Day for Patio Dining & Picnics',
      description: `Gentle breeze, clear atmosphere, and mild temperature (${tempDisplay}) create the perfect outdoor dining setting.`,
      status: 'excellent',
      iconName: 'Utensils',
      metricLabel: 'Ideal Picnic',
      tags: ['Patio', 'Al Fresco', 'Picnic'],
    });
  }

  // Stargazing (Night condition)
  if (!isDay && cloudCover < 25 && !isRainyCondition) {
    recommendations.push({
      id: 'rec-act-stargazing',
      category: 'activity',
      title: 'Excellent Stargazing Conditions',
      description: `Clear night sky with low cloud coverage (${cloudCover}%). Perfect window for astronomical observation or astrophotography.`,
      status: 'excellent',
      iconName: 'MoonStar',
      metricLabel: `${cloudCover}% Clouds`,
      tags: ['Telescope', 'Night Sky', 'Astronomy'],
    });
  }

  // Cycling / Biking
  if (gustsKmh > 35) {
    recommendations.push({
      id: 'rec-act-cycling-wind',
      category: 'activity',
      title: 'Cycling Caution: Strong Wind Gusts',
      description: `Wind gusts up to ${Math.round(gustsKmh)} km/h may destabilize lightweight bicycles. Exercise elevated caution on bridges and open terrain.`,
      status: 'caution',
      iconName: 'Wind',
      metricLabel: `${Math.round(gustsKmh)} km/h Gusts`,
      tags: ['Cycling', 'Crosswinds'],
    });
  }

  // 4. HEALTH & COMFORT ADVISORIES
  if (humidity > 80 && tempC > 24) {
    recommendations.push({
      id: 'rec-health-humidity',
      category: 'health',
      title: 'High Muggy Index & Humidity',
      description: `Relative humidity at ${humidity}%. Sweating efficiency is reduced, making it feel warmer than actual temperature. Stay in air-conditioned areas when possible.`,
      status: 'caution',
      iconName: 'Droplets',
      metricLabel: `${humidity}% Humidity`,
      tags: ['Muggy', 'Air Con', 'Hydration'],
    });
  } else if (humidity < 25) {
    recommendations.push({
      id: 'rec-health-dry-air',
      category: 'health',
      title: 'Low Air Moisture Level',
      description: `Dry atmosphere (${humidity}% relative humidity). Apply skin moisturizer and lip balm, and increase water intake.`,
      status: 'good',
      iconName: 'Sparkles',
      metricLabel: `${humidity}% Dry Air`,
      tags: ['Hydration', 'Moisturizer'],
    });
  } else {
    recommendations.push({
      id: 'rec-health-comfort',
      category: 'health',
      title: 'Balanced Thermal Comfort',
      description: `Atmospheric humidity and barometric pressure are within normal optimal zones.`,
      status: 'excellent',
      iconName: 'HeartPulse',
      metricLabel: 'Optimal Index',
      tags: ['Comfort Zone'],
    });
  }

  return recommendations;
}
