export interface WmoCondition {
  code: number;
  label: string;
  category: 'clear' | 'cloudy' | 'rain' | 'snow' | 'thunderstorm' | 'fog';
  iconName: string;
  bgGradientDay: string;
  bgGradientNight: string;
  badgeBg: string;
  textColor: string;
}

export function getWmoCondition(code: number, isDay: boolean = true): WmoCondition {
  switch (code) {
    case 0:
      return {
        code,
        label: isDay ? 'Clear Sky' : 'Clear Night',
        category: 'clear',
        iconName: isDay ? 'Sun' : 'Moon',
        bgGradientDay: 'from-amber-500/10 via-sky-500/10 to-indigo-500/10',
        bgGradientNight: 'from-indigo-950/40 via-slate-900/40 to-black/40',
        badgeBg: isDay ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30' : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
        textColor: 'text-amber-500',
      };
    case 1:
      return {
        code,
        label: isDay ? 'Mainly Clear' : 'Mostly Clear Night',
        category: 'clear',
        iconName: isDay ? 'SunDim' : 'MoonStar',
        bgGradientDay: 'from-sky-400/10 via-blue-500/10 to-slate-500/10',
        bgGradientNight: 'from-slate-950/40 via-indigo-950/40 to-slate-900/40',
        badgeBg: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
        textColor: 'text-sky-500',
      };
    case 2:
      return {
        code,
        label: 'Partly Cloudy',
        category: 'cloudy',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        bgGradientDay: 'from-blue-400/10 via-sky-300/10 to-slate-400/10',
        bgGradientNight: 'from-slate-900/40 via-slate-950/40 to-indigo-950/40',
        badgeBg: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
        textColor: 'text-blue-500',
      };
    case 3:
      return {
        code,
        label: 'Overcast',
        category: 'cloudy',
        iconName: 'Cloud',
        bgGradientDay: 'from-slate-500/10 via-gray-400/10 to-slate-600/10',
        bgGradientNight: 'from-gray-950/40 via-slate-900/40 to-slate-950/40',
        badgeBg: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30',
        textColor: 'text-slate-500',
      };
    case 45:
    case 48:
      return {
        code,
        label: code === 48 ? 'Depositing Rime Fog' : 'Foggy',
        category: 'fog',
        iconName: 'CloudFog',
        bgGradientDay: 'from-teal-500/10 via-slate-400/10 to-gray-500/10',
        bgGradientNight: 'from-teal-950/40 via-slate-900/40 to-gray-950/40',
        badgeBg: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30',
        textColor: 'text-teal-500',
      };
    case 51:
    case 53:
    case 55:
      return {
        code,
        label: code === 51 ? 'Light Drizzle' : code === 53 ? 'Moderate Drizzle' : 'Dense Drizzle',
        category: 'rain',
        iconName: 'CloudDrizzle',
        bgGradientDay: 'from-cyan-500/10 via-blue-500/10 to-slate-500/10',
        bgGradientNight: 'from-cyan-950/40 via-slate-900/40 to-blue-950/40',
        badgeBg: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
        textColor: 'text-cyan-500',
      };
    case 56:
    case 57:
      return {
        code,
        label: 'Freezing Drizzle',
        category: 'rain',
        iconName: 'CloudHail',
        bgGradientDay: 'from-cyan-600/10 via-indigo-400/10 to-slate-500/10',
        bgGradientNight: 'from-cyan-950/40 via-indigo-950/40 to-slate-900/40',
        badgeBg: 'bg-cyan-600/15 text-cyan-800 dark:text-cyan-200 border-cyan-600/30',
        textColor: 'text-cyan-600',
      };
    case 61:
      return {
        code,
        label: 'Slight Rain',
        category: 'rain',
        iconName: 'CloudRain',
        bgGradientDay: 'from-blue-500/10 via-indigo-500/10 to-slate-600/10',
        bgGradientNight: 'from-blue-950/40 via-indigo-950/40 to-slate-900/40',
        badgeBg: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
        textColor: 'text-blue-500',
      };
    case 63:
      return {
        code,
        label: 'Moderate Rain',
        category: 'rain',
        iconName: 'CloudRain',
        bgGradientDay: 'from-indigo-500/15 via-blue-600/10 to-slate-700/10',
        bgGradientNight: 'from-indigo-950/50 via-slate-900/50 to-blue-950/50',
        badgeBg: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
        textColor: 'text-indigo-500',
      };
    case 65:
      return {
        code,
        label: 'Heavy Rain',
        category: 'rain',
        iconName: 'CloudRainWind',
        bgGradientDay: 'from-blue-700/20 via-slate-700/15 to-indigo-800/15',
        bgGradientNight: 'from-blue-950/60 via-slate-950/60 to-indigo-950/60',
        badgeBg: 'bg-blue-700/20 text-blue-800 dark:text-blue-200 border-blue-700/30',
        textColor: 'text-blue-600',
      };
    case 66:
    case 67:
      return {
        code,
        label: 'Freezing Rain',
        category: 'rain',
        iconName: 'CloudHail',
        bgGradientDay: 'from-indigo-600/15 via-cyan-500/10 to-slate-600/10',
        bgGradientNight: 'from-indigo-950/50 via-cyan-950/50 to-slate-900/50',
        badgeBg: 'bg-indigo-600/15 text-indigo-800 dark:text-indigo-200 border-indigo-600/30',
        textColor: 'text-indigo-600',
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        code,
        label: code === 71 ? 'Light Snow' : code === 73 ? 'Moderate Snow' : code === 75 ? 'Heavy Snow' : 'Snow Grains',
        category: 'snow',
        iconName: 'Snowflake',
        bgGradientDay: 'from-sky-300/20 via-indigo-300/10 to-slate-400/10',
        bgGradientNight: 'from-sky-950/40 via-indigo-950/40 to-slate-900/40',
        badgeBg: 'bg-sky-400/15 text-sky-800 dark:text-sky-200 border-sky-400/30',
        textColor: 'text-sky-600',
      };
    case 80:
    case 81:
    case 82:
      return {
        code,
        label: code === 80 ? 'Light Rain Showers' : code === 81 ? 'Moderate Rain Showers' : 'Violent Rain Showers',
        category: 'rain',
        iconName: 'CloudRain',
        bgGradientDay: 'from-blue-500/15 via-cyan-400/10 to-slate-600/10',
        bgGradientNight: 'from-blue-950/50 via-cyan-950/40 to-slate-900/50',
        badgeBg: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
        textColor: 'text-blue-500',
      };
    case 85:
    case 86:
      return {
        code,
        label: 'Snow Showers',
        category: 'snow',
        iconName: 'Snowflake',
        bgGradientDay: 'from-cyan-400/15 via-indigo-300/10 to-slate-500/10',
        bgGradientNight: 'from-cyan-950/50 via-indigo-950/40 to-slate-900/50',
        badgeBg: 'bg-cyan-400/15 text-cyan-800 dark:text-cyan-200 border-cyan-400/30',
        textColor: 'text-cyan-500',
      };
    case 95:
      return {
        code,
        label: 'Thunderstorm',
        category: 'thunderstorm',
        iconName: 'CloudLightning',
        bgGradientDay: 'from-purple-600/20 via-amber-600/15 to-slate-800/20',
        bgGradientNight: 'from-purple-950/60 via-slate-950/70 to-black/70',
        badgeBg: 'bg-purple-600/20 text-purple-800 dark:text-purple-200 border-purple-600/30',
        textColor: 'text-purple-500',
      };
    case 96:
    case 99:
      return {
        code,
        label: 'Thunderstorm with Hail',
        category: 'thunderstorm',
        iconName: 'CloudLightning',
        bgGradientDay: 'from-purple-700/25 via-red-600/15 to-slate-900/25',
        bgGradientNight: 'from-purple-950/70 via-slate-950/80 to-black/80',
        badgeBg: 'bg-purple-700/20 text-purple-900 dark:text-purple-100 border-purple-700/30',
        textColor: 'text-purple-600',
      };
    default:
      return {
        code,
        label: 'Variable Weather',
        category: 'cloudy',
        iconName: 'CloudSun',
        bgGradientDay: 'from-sky-400/10 via-slate-400/10 to-indigo-500/10',
        bgGradientNight: 'from-slate-950/40 via-slate-900/40 to-black/40',
        badgeBg: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
        textColor: 'text-sky-500',
      };
  }
}
