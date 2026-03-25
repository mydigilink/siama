import AdminJS from "adminjs";
import * as AdminJSMongoose from "@adminjs/mongoose";
import Appointment from "@/models/Appointment";

AdminJS.registerAdapter(AdminJSMongoose);

export const adminJs = new AdminJS({
  rootPath: "/admin",
  resources: [
    {
      resource: Appointment,
      options: {
        navigation: {
          name: "SIAMA",
          icon: "Calendar",
        },
        listProperties: ["name", "mobile", "category", "date", "timeSlot", "status"],
        editProperties: ["name", "mobile", "category", "concern", "date", "timeSlot", "status"],
        filterProperties: ["name", "mobile", "category", "date", "timeSlot", "status"],
        showProperties: ["name", "mobile", "category", "concern", "date", "timeSlot", "status", "createdAt"],
      },
    },
  ],
  branding: {
    companyName: "SIAMA Admin",
    softwareBrothers: false,
  },
});