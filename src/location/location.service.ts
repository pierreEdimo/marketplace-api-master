import { Injectable } from "@nestjs/common";
import { LocationModel } from "./location.model";
import axios from "axios";

@Injectable()
export class LocationService {
    async getLocationByUniqueId(locationUniqueId: string): Promise<LocationModel> {
        try {
            const response = await axios.get<LocationModel>(`https://api.houlala.store/discovery-orchestrator/locations/simple/unique/${locationUniqueId}`);
            return response.data;
        }
        catch (error) {
            throw new Error("Error fetching a Location" + error.message);
        }
    }
}