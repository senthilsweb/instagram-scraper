/**
 * @file scrape.post.ts
 * @date 01-Sep-2024
 * @author Senthilnathan Karuppaiah
 * 
 * @description 
 * This Next.js API route scrapes posts from an Instagram profile using the Instagram GraphQL API.
 * It fetches the posts, processes the image data to base64, and returns the data in JSON format.
 * The API expects the profile ID and the number of posts to fetch as input.
 */

import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';

// Interface defining the structure of an Instagram post object
interface InstagramPost {
    id: number;
    text: string;
    thumbnail_src: string;
    display_url: string;
    shortcode: string;
    base64: string;
    created_at: string;
}

// Interface defining the structure of the response data
interface ResponseData {
    first: number;
    total: number;
    result?: any;
}

// Default export of the Next.js API route handler
export default async (req: NextApiRequest, res: NextApiResponse) => {
    // Extracting profile_id and the number of posts to fetch (first) from the request body
    const { profile_id, first } = req.body;

    // Check if profile_id is null or empty
    if (!profile_id) {
        return res.status(400).json({
            error: "Profile ID is required and cannot be empty.",
            message: "Please provide a valid Instagram profile ID."
        });
    }

    // Array to store the processed Instagram posts
    let posts: InstagramPost[] = [];

    // Object to store the response data
    let response: ResponseData = {} as ResponseData;

    // Set default value for 'first' to 10 if it's null or undefined
    const numberOfPosts = first ?? 10;

    // Constructing the URL using template literals to include the profile ID and the number of posts
    const url = `https://www.instagram.com/graphql/query/?query_id=17888483320059182&variables={"id":"${profile_id}","first":${numberOfPosts},"after":null}`;

    console.log(url);

    // Fetching the data from the Instagram GraphQL API
    const result = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
        }
    }).then(res => res.json());
    console.log(JSON.stringify(result));
    // Storing the number of posts retrieved and the total count of posts
    response.first = result.data.user.edge_owner_to_timeline_media.edges.length;
    response.total = result.data.user.edge_owner_to_timeline_media.count;

    // Helper function to fetch and convert image data to base64 format
    async function getData(displayUrl: string): Promise<string> {
        const img = await fetch(displayUrl)
            .then(res => res.arrayBuffer()) // Convert the response to an array buffer
            .then(arrayBuffer => Buffer.from(arrayBuffer)) // Convert the array buffer to a Buffer
            .then(buffer => buffer.toString('base64')); // Convert the buffer to base64 string
        return img;
    }

    // Loop through the retrieved posts and process each one
    for (let i = 0; i < response.first; i++) {
        // Get the display URL for the current post
        const displayUrl = result.data.user.edge_owner_to_timeline_media.edges[i].node.display_url;

        // Fetch the base64 encoded image data
        const base64 = await getData(displayUrl);

        // Create an InstagramPost object with the necessary details
        const post: InstagramPost = {
            id: i,
            text: result.data.user.edge_owner_to_timeline_media.edges[i].node.edge_media_to_caption.edges[0].node.text,
            thumbnail_src: result.data.user.edge_owner_to_timeline_media.edges[i].node.thumbnail_src,
            display_url: displayUrl,
            shortcode: result.data.user.edge_owner_to_timeline_media.edges[i].node.shortcode,
            base64: base64,
            created_at: dayjs.unix(result.data.user.edge_owner_to_timeline_media.edges[i].node.taken_at_timestamp).format('DD-MMM-YYYY') // Formatting the timestamp to a readable date
        };

        // Add the post to the posts array, placing it at the start (newest first)
        posts.unshift(post);
    }

    // Attach the processed posts to the response object
    response.result = posts;

    // Return the response with status 200 (OK)
    return res.status(200).json(response);
};
