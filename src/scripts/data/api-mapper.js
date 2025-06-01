import Map from '../utils/map';

export async function reportMapper(report) {
  console.log('Data sebelum mapping:', report);
  const placeName = await Map.getPlaceNameByCoordinate(report.lat, report.lon);
  console.log('Place Name:', placeName);

  return {
    ...report,
    placeName,
  };
}