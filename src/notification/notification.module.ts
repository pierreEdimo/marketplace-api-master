import { Module } from "@nestjs/common";
import { EmailNotificationService } from "./email.notification.service";
import { LocationModule } from "src/location/location.module";

@Module({
    providers:[EmailNotificationService], 
    imports: [LocationModule], 
    exports:[EmailNotificationService]
})
export class NotificationModule {}