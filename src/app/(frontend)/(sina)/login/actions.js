"use server";

import { getPayload } from "payload";
import config from "@/payload.config";
import { redirect } from "next/navigation";

export async function login(data) {
  const payload = await getPayload({ config });

  try {
    const user = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: data.email,
        },
      },
    });

    if (user.docs.length > 0) {
      // User exists, for now, just log a success message
      console.log("User exists:", user.docs[0]);
      return { success: true, user: user.docs[0] };
    } else {
      // User does not exist, redirect to signup
      return { success: false, error: "User not found" };
    }
  } catch (error) {
    console.error("Error checking user:", error);
    return { success: false, error: "An error occurred." };
  }
}

export async function getGoogleLoginUrl() {
  const params = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: "http://localhost:3000/sina/auth/google/callback",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    response_type: "code",
  };

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams(
    params
  )}`;

  return { url };
}

export async function handleGoogleCallback(code) {
  const payload = await getPayload({ config });

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch(
      "https://oauth2.googleapis.com/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: "http://localhost:3000/sina/auth/google/callback",
          grant_type: "authorization_code",
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      throw new Error(tokenData.error_description);
    }

    // Fetch user information from Google
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const userData = await userResponse.json();

    // Check if user exists
    const user = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: userData.email,
        },
      },
    });

    if (user.docs.length > 0) {
      // User exists, log them in
      return { success: true, user: user.docs[0] };
    } else {
      // User does not exist, create a new user
      const newUser = await payload.create({
        collection: "users",
        data: {
          email: userData.email,
          // You might want to add other fields here
        },
      });
      return { success: true, user: newUser };
    }
  } catch (error) {
    console.error("Error handling Google callback:", error);
    return { success: false, error: "An error occurred." };
  }
} 