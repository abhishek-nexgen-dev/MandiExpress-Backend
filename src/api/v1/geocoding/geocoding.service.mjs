import axios from "axios";

class Geocoding_Service {
  /**
   * Uses OpenStreetMap (Nominatim) to fetch coordinates for any location name.
   * @param {String} locationName - The place name, like "Chatra, Jharkhand, India".
   * @returns {Object|null} - { lat: Number, lng: Number } or null if not found.
   */
  async getCoordinates(locationName) {
    if (!locationName) {
      console.error("Location name is required.");
      return null;
    }

    try {
      const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: locationName,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "MandiExpress"
        },
      });

      const data = response.data;
      console.log(`✅ Found coordinates for "${locationName}":`, data);

      if (!data || data.length === 0) {
        console.log(`❌ Could not find coordinates for location: "${locationName}"`);
        return null;
      }

      const { lat, lon } = data[0];
      return {
        lat: parseFloat(lat),
        lng: parseFloat(lon),
      };

    } catch (error) {
      console.error("Geocoding error:", error.message);
      return null;
    }
  }
}

export default new Geocoding_Service();
