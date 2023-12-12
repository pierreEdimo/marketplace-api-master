import { Injectable } from "@nestjs/common";
import axios from "axios";
import { NotificationModel } from "./notification.model";
import { CartItem } from "src/order/cart.item";
import { LocationService } from "src/location/location.service";
import { UserInformation } from "src/order/user.information";
import * as fs from 'fs';
import * as handlebars from 'handlebars';


@Injectable()
export class EmailNotificationService {

    constructor(private locationService: LocationService) { }


    async sendLocationEmailOnConfirmOrder(locationUniqueId: string, cartItems: CartItem[],
        userInformation: UserInformation,
        totalQuantity: number,
        totalPrice: number,
        payMentMethode: string) {
        const location = await this.locationService.getLocationByUniqueId(locationUniqueId);
        const template = fs.readFileSync('./src/email/order.hbs', 'utf-8');
        const compiledTemplate = handlebars.compile(template);
        const body: string = compiledTemplate({ location, cartItems, userInformation, totalQuantity, totalPrice, payMentMethode }); 

        const notification: NotificationModel = {
            subject: "Vous avez une nouvelle commande.",
            to: location.email,
            htmlBody: body
        } as NotificationModel;

        await this.sendEmailNotification(notification);
    }

    async sendUserEmailConfirmOrder(locationUniqueId: string, cartItems: 
        CartItem[],
        userInformation: UserInformation, 
        totalQuantity: number, 
        totalPrice: number, 
        payMentMethode: string ){
            const location = await this.locationService.getLocationByUniqueId(locationUniqueId); 
            const template = fs.readFileSync('./src/email/confirmation.hbs', 'utf-8'); 
            const compiledTemplate = handlebars.compile(template); 
            const body: string = compiledTemplate({location, cartItems, userInformation, totalPrice, totalQuantity, payMentMethode}); 

            const notification: NotificationModel = {
                subject: "Confirmation de la commande", 
                to: userInformation.email, 
                htmlBody: body
            } as NotificationModel; 

            await this.sendEmailNotification(notification); 
        }


    private async sendEmailNotification(notification: NotificationModel): Promise<void> {
        try {
            await axios.post("https://mail.houlala.store/api/Email", notification);
        }
        catch (error) {
            throw new Error("error sending E-mail: " + error.message);
        }
    }
}