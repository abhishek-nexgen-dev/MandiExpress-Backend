// File: src/api/v1/user/user.service.mjs

import geocodingService from "../geocoding/geocoding.service.mjs";
import userConstant from "./user.constant.mjs";
import userSchema from "./user.schema.mjs";
import { createUserValidator } from "./user.validator.mjs";

class User_Service {

  async createUser(data , fileName) {
    try {
  

 
        await createUserValidator.safeParseAsync(data);


        const upload = await uploadOnCloudinary(fileName);

    
        const userData = { ...data, profileImage: upload.url };

       
        const createdUser = await userSchema.create(userData);

     
        SendResponse.success(
            res,
            StatusCodeConstant.CREATED,
            userConstant.USER_CREATED,
            createdUser
        );

    } catch (error) {

        SendResponse.error(res, StatusCodeConstant.INTERNAL_SERVER_ERROR, error.message);
    }
}


 
  _getCoordinates(location) {
    if (Array.isArray(location)) {
      return location;
    } else if (typeof location === 'object' && location.lng !== undefined && location.lat !== undefined) {
      return [location.lng, location.lat];
    } else {
      throw new Error("Invalid location format. Must be [lng, lat] or { lng, lat }");
    }
  }

  async findUserNearLocation(location, distance = 10000) {
    try {
      const coordinates = this._getCoordinates(location);

      const users = await userSchema.find({
        location: {
          $near: {
            $geometry: { type: "Point", coordinates },
            $maxDistance: distance,
          },
        },
      }).select("-password -__v -emailVerified -phoneVerified");

      return users || [];
    } catch (error) {
      throw new Error(error.message || userConstant.FETCH_USERS_FAILED);
    }
  }

 
  async findSupplierNearLocationByLocationName(
    locationName,
    options = { page: 1, limit: 10 },
    distance = 10000
  ) {
    try {

      if (!locationName.includes(",") && locationName.trim().split(" ").length === 1) {
        throw new Error("Please provide a more specific location, such as including the state or country (e.g., 'Chatra, Jharkhand, India').");
      }


      const coordinates = await geocodingService.getCoordinates(locationName);

      if (!coordinates) {
        throw new Error(`Could not find coordinates for location: "${locationName}"`);
      }
      
      const page = parseInt(options.page, 10) || 1;
      const limit = parseInt(options.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const suppliers = await userSchema.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [coordinates.lng, coordinates.lat],
            },
            distanceField: "distance",
            maxDistance: distance,
            spherical: true,
          },
        },
        {
          $match: {
            role: "supplier",
          },
        },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            password: 0,
            __v: 0,
            emailVerified: 0,
            phoneVerified: 0,
          },
        },
      ]);

      

      return suppliers || [];
    } catch (error) {
  
      throw new Error(error.message || userConstant.FETCH_SUPPLIERS_FAILED);
    }
  }
}

export default new User_Service();
