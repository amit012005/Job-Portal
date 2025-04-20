import {Webhook} from "svix";
import User from "../models/User.js";

//API Controller Function to Manage Clerk User with database
export const clerkWebhooks = async (req, res) => {
    try{
        //create a svix instance with clerk webhook secret
        const whook=new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        //Verifying headers
        await whook.verify(JSON.stringify(req.body),{
            "svix-id":req.headers["svix-id"],
            "svix-timestamp":req.headers["svix-timestamp"],
            "svix-signature":req.headers["svix-signature"]
        })

        //Getting data from request body
        const {data,type} = req.body;

        //Switch case to handle different webhook events
        switch(type){
            case "user.created":
                //Creating a new user in the database
                const newUser = new User({
                    _id:data.id,
                    name:data.first_name + " " + data.last_name,
                    email:data.email_addresses[0].email_address,
                    resume:"",
                    image:data.image_url
                })
                await newUser.save();
                res.json({message:"User Created"});
                break;
            case "user.updated":
                //Updating the user in the database
                await User.findByIdAndUpdate(data.id,{
                    name:data.first_name + " " + data.last_name,
                    email:data.email_addresses[0].email_address,
                    image:data.profile_image_url
                })
                res.json({message:"User Updated"})
                break;

            case "user.deleted":
                //Deleting the user from the database
                await User.findByIdAndDelete(data.id);
                break;
            default:
                console.log("Unknown event type")
                break;
        }

    }
    catch(error){
        console.log("Error in clerk webhook",error.message)
        res.status(500).json({message:"Webhooks Error"});
    }
}