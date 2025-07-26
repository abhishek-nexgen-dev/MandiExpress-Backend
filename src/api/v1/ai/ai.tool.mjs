const tools = [{
    functionDeclarations: [{
      name: "findSupplierNearLocation",
      description: "Retrieves a list of nearby suppliers for a given city or location using geocoding and geospatial search.You need to provide a full location name, including state or country for better accuracy with suppliers.",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The full name of the city or area to search for suppliers, e.g., 'Chatra, Jharkhand, India'. Avoid using only a town name—please include the state or region for better accuracy.",
          },
        },
        required: ["location"],
      },
    }],
}];
  
  export default tools;
  