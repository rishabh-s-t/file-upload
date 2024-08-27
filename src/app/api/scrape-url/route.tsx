import {NextResponse} from "next/server";
import {writeFileSync} from "fs";
import {join} from "path";
import * as cheerio from "cheerio";
import axios from "axios";
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {app} from "@/config/firebase";

export const maxDuration = 300; // 5 minutes

export async function POST(req: Request) {
  const requestBody = await req.json();
  const url = requestBody.url;
  try {
    const {data} = await axios.get(url);
    const $ = cheerio.load(data);
    $("script").remove();

    const title = $("title").text().replace(/\n/g, "");
    const text = $("p").text().replace(/\n/g, "");
    let favicon =
      $('link[rel="shortcut icon"]').attr("href") ||
      $('link[rel="icon"]').attr("href") ||
      "/favicon.ico"; // Default to /favicon.ico if no favicon link found

    // Ensure favicon URL is absolute
    if (favicon && !favicon.startsWith("http")) {
      // Construct an absolute URL for the favicon
      const urlObj = new URL(url);
      favicon = urlObj.origin + (favicon.startsWith("/") ? "" : "/") + favicon;
    }

    return NextResponse.json({
      title,
      text,
      favicon,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({message: error});
  }
}

export async function GET() {
  // this is a harcoded value for testing this will be disabled in deployment

  const url =
    "https://www.cnn.com/2024/04/02/politics/biden-white-house-world-central-kitchen/index.html";

  try {
    const {data} = await axios.get(url);
    const $ = cheerio.load(data);
    $("script").remove();

    const title = $("title").text().replace(/\n/g, "");
    const text = $("p").text().replace(/\n/g, "");

    // Attempt to find favicon
    let favicon =
      $('link[rel="shortcut icon"]').attr("href") ||
      $('link[rel="icon"]').attr("href") ||
      "/favicon.ico"; // Default to /favicon.ico if no favicon link found

    // Ensure favicon URL is absolute
    if (favicon && !favicon.startsWith("http")) {
      // Construct an absolute URL for the favicon
      const urlObj = new URL(url);
      favicon = urlObj.origin + (favicon.startsWith("/") ? "" : "/") + favicon;
    }

    return NextResponse.json({
      title,
      text,
      favicon,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({message: error});
  }
}
