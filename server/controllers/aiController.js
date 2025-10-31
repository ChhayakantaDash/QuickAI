import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from 'cloudinary'
import axios from "axios";
import fs from 'fs'
// // import PdfParse from "pdf-parse";
// import pdf from 'pdf-parse'
import FormData from "form-data";
import { upload } from "../configs/multer.js";
// import PdfParse from "pdf-parse";
import pdf from 'pdf-parse/lib/pdf-parse.js'



const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticle = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { prompt, length } = req.body
        const plan = req.plan
        const free_usage = req.free_usage

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: false, message: 'Free usage limit reached' })
        }
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [

                {
                    role: "user",
                    content: prompt,
                },

            ],
            temperature: 0.7,
            max_tokens: length

        });

        const content = response.choices[0].message.content
        await sql`INSERT INTO creations (user_id, prompt, content,type) VALUES (${userId}, ${prompt}, ${content},'article')`
        if (plan === 'free') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            })

        }
        res.json({ success: true, message: 'Article generated', content })



    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const generateBlogTitle = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { prompt } = req.body
        const plan = req.plan
        const free_usage = req.free_usage

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: false, message: 'Free usage limit reached' })
        }
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [

                {
                    role: "user",
                    content: prompt,
                },

            ],
            temperature: 0.7,
            max_tokens: 100

        });

        const content = response.choices[0].message.content

        await sql`INSERT INTO creations (user_id, prompt, content,type) VALUES (${userId}, ${prompt}, ${content},'blog-title')`
        if (plan === 'free') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            })

        }
        res.json({ success: true, message: 'Article generated', content })



    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const generateImage = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { prompt, publish } = req.body
        const plan = req.plan


        if (plan !== 'premium') {
            return res.json({ success: false, message: 'This feature is available only for premium subscriptions' })
        }

        const formData=new FormData()
        formData.append('prompt', prompt)

        const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API_KEY
            },
            responseType: 'arraybuffer',

        })

        const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;
        const { secure_url } = await cloudinary.uploader.upload(base64Image)



        await sql`INSERT INTO creations (user_id, prompt, content,type,publish) VALUES (${userId}, ${prompt}, ${secure_url},'image',${publish ?? false})`

        res.json({ success: true, message: 'Article generated', content: secure_url })



    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const removeBackgroundImage = async (req, res) => {
    try {
        const { userId } = req.auth();
        const plan = req.plan;

        if (plan !== "premium") {
            return res.json({ success: false, message: "This feature is available only for premium subscriptions" });
        }

        // Upload directly from file path
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "image",
            transformation: [
                {
                    effect: "background_removal",
                    background_removal: "remove_the_background"
                }
            ]
        });

        await sql`
            INSERT INTO creations (user_id, prompt, content, type)
            VALUES (${userId}, 'Remove background from image', ${uploadResult.secure_url}, 'image')
        `;

        res.json({ success: true, message: "Image generated", content: uploadResult.secure_url });

    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const removeImageObject = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { object } = req.body
        const image = req.file
        const plan = req.plan


        if (plan !== 'premium') {
            return res.json({ success: false, message: 'This feature is available only for premium subscriptions' })
        }



        const { public_id } = await cloudinary.uploader.upload(image.path)
        const imageUrl = cloudinary.url(public_id, {
            transformation: [{
                effect: `gen_remove:${object}`

            }],
            resource_type: 'image'


        })


await sql`INSERT INTO creations (user_id, prompt, content,type) VALUES (${userId},${`Remove ${object} from image`}, ${imageUrl},'image')`


res.json({ success: true, message: 'Image generated', content: imageUrl })



    } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message })
}
}

export const resumeReview = async (req, res) => {
    try {
        const { userId } = req.auth();
        const resume = req.file;
        const plan = req.plan;

        if (plan !== "premium") {
            return res.json({
                success: false,
                message: "This feature is available only for premium subscriptions"
            });
        }

        if (!resume) {
            return res.json({
                success: false,
                message: "No resume uploaded"
            });
        }

        if (resume.size > 5 * 1024 * 1024) {
            return res.json({
                success: false,
                message: "Resume file size must be less than 5MB"
            });
        }

        // Read PDF from file path (since using diskStorage)
        const pdfBuffer = fs.readFileSync(resume.path);
        const pdfdata = await pdf(pdfBuffer);

        const prompt = `
        Review the resume and provide detailed feedback on:
        - Candidate's experience
        - Skills
        - Areas of improvement
        - Education

        Resume Content:
        ${pdfdata.text}
        `;

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
        });

        const content = response.choices[0].message.content;

        await sql`
            INSERT INTO creations (user_id, prompt, content, type)
            VALUES (${userId}, ${"Resume review"}, ${content}, 'resume-review')
        `;

        res.json({
            success: true,
            message: "Resume review generated",
            content
        });

    } catch (error) {
        console.error(error.message);
        res.json({
            success: false,
            message: error.message
        });
    }
};



