import OpenAI from "openai";
import dotenv from "dotenv";
import { handleError } from "../helper/handleError.js";
import Creation from "../model/creation.model.js"
import {v2 as cloudinary} from "cloudinary";
import { extractPdfText } from "../helper/theFile.js";



dotenv.config();

const openrouter = new OpenAI({
  apiKey:  process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export const generateArticle = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { prompt, length } = req.body;

    if (!prompt) {
      return next(handleError(400, "Prompt is required"));
    }
    const MAX_ALLOWED_TOKENS = 700;
    const response = await openrouter.chat.completions.create({
      model: "google/gemini-3-pro-preview",
      messages: [{ role: "user",content: prompt, },],
      max_tokens: Math.min( Number(length) || 200,MAX_ALLOWED_TOKENS),
      temperature: 0.7,
    });

    const content = response?.choices?.[0]?.message?.reasoning || "No content generated";

    const creation = new Creation({
        user:userId,
        prompt,
        content,
        type:"article"
    })

    await creation.save();


    res.status(200).json({
      success: true,
      message:"Article is generated succesfully",
      content,
    });

  } catch (err) {
  
    next(handleError(500, err.message));
  }
};


export const generateBlogTitle = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { prompt } = req.body;

    if (!prompt) {
      return next(handleError(400, "Prompt is required"));
    }

    const response = await openrouter.chat.completions.create({
      model: "google/gemini-3-pro-preview",
      messages: [{ role: "user",content: prompt, },],
      max_tokens: 100,
      temperature: 0.7,
    });

    const content = response?.choices?.[0]?.message?.reasoning || "No content generated";

    const creation = new Creation({
        user:userId,
        prompt,
        content,
        type:"blog-title"
    })

    await creation.save();


    res.status(200).json({
      success: true,
      message:"Generating Title",
      content,
    });

  } catch (err) {
   
    next(handleError(500, err.message));
  }
};


export const generateImage = async (req, res, next) => {
  try {
    const userId  = req.user.id;
    const { prompt, publish } = req.body;

    if (!prompt) {
      return next(handleError(400, "Prompt is required"));
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const response = await fetch(
      "https://clipdrop-api.co/text-to-image/v1",
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to generate image from ClipDrop");
    }

    // Convert response to buffer
    const buffer = Buffer.from(await response.arrayBuffer());

    // Convert to base64
    const base64Image = `data:image/png;base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      folder: "ai-images",
    });

    const secure_url = uploadResult.secure_url;
  
    const creation = new Creation({
      user: userId,
      prompt:prompt,
      content:secure_url,
      type: "image",
      publish:publish ?? false,
    });

    await creation.save();
  

    res.status(200).json({
      success: true,
      message:"Image is generated succesfully",
      secure_url,
    });

  } catch (err) {
    
    next(handleError(500, err.message));
  }
};


export const removeBackground = async (req, res, next) => {
  try {
    const userId  = req.user.id;
    const  image  = req.file;
   

    if (!image) {
      return next(handleError(400, "Image is required"));
    }

  
    const uploadResult = await cloudinary.uploader.upload(image.path, {
      folder: "ai-images",
      transformation:[
        {
          effect:"background_removal",
          background_removal:"remove_the_background"
        }
      ]
    });

    const secure_url = uploadResult.secure_url;
  
    const creation = new Creation({
      user: userId,
      prompt:"Remove background from image",
      content:secure_url,
      type: "image",
    });

    await creation.save();
  

    res.status(200).json({
      success: true,
      message:"Removed Image Background here!",
      content:secure_url,
    });

  } catch (err) {

    next(handleError(500, err.message));
  }
}

export const removeImageObject = async (req, res, next) => {
  try {
    const userId  = req.user.id;
    const {object} = req.body;
    const  image  = req.file;

  
    if (!image || !object) {
      return next(handleError(400, "Image is required"));
    }

  
    const {public_id} = await cloudinary.uploader.upload(image.path, {folder: "ai-images"});

    const imageUrl = cloudinary.url(public_id,{
      transformation:[{effect:`gen_remove:${object}`}],
      resource_type:"image"
    })
  
    const creation = new Creation({
      user: userId,
      prompt:`Removed ${object} from image`,
      content:imageUrl,
      type: "image",
    });

    await creation.save();
  

    res.status(200).json({
      success: true,
      message:"Removed object a successfully",
      content:imageUrl,
    });

  } catch (err) {

    next(handleError(500, err.message));
  }
}

export const reviewResume = async (req, res, next) => {
  try {
    const userId  = req.user.id;
    const resume = req.file;
   
    if (!resume) {
      return next(handleError(400, "resume is required"));
    }

    if(resume.size > 5 * 1024 *1024){
      return res.json({success:false, message:"Resume file is exceed allowed size"})
    }


   const extractedText = await extractPdfText(resume.path);


    const prompt = `You are a senior technical recruiter.

  Review the resume below and give:
- Strengths
- Weaknesses
- ATS optimization tips
- Improved bullet points
- Overall score out of 10

Resume:${extractedText}`

    const response = await openrouter.chat.completions.create({
      model: "google/gemini-3-pro-preview",
      messages: [{ role: "user",content: prompt, },],
      max_tokens: 150,
      temperature: 0.7,
    });

    const content = response?.choices?.[0]?.message?.reasoning || "No content generated";


    const creation = new Creation({
      user: userId,
      prompt:"Review the uploded resume",
      content:content,
      type: "review-resume",
    });

    await creation.save();
  
    res.status(200).json({
      success: true,
      message:"Review resume a successfully",
      content,
    });

  } catch (err) {
  
    next(handleError(500, err.message));
  }
}