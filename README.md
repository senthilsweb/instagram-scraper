# Instagram Scraper

A simple, serverless Instagram scraper that pulls Instagram posts—complete with images as base64 encoded strings—without the need for an API key. Designed with 100% edge deployment in mind, it runs efficiently on platforms like Vercel, Supabase, Deno Deploy, and more, making it easy to integrate your Instagram content into your broader content strategy.

## **Features**

- [x] **Repurpose Instagram Content:** Automatically fetch Instagram posts to use in your blogs, websites, etc.
- [x] **No API Key Needed:** Skip the hassle of authentication—just scrape public data directly.
- [x] **Cross-Origin Workaround:** Convert Instagram thumbnails to base64, allowing you to use images across domains.
- [x] **Incremental Loading:** Keep your content fresh by pulling in new posts daily without overwhelming Instagram's servers.
- [x] **Serverless and Cost-Effective:** Deploy on platforms like Vercel, Supabase, Deno deploy to run this scraper as a microservice with minimal overhead.

## **Technology**

- **Edge Deployment:** Written with 100% edge deployment in mind, using V8 isolates to run efficiently at the edge.
- **Simple Microservice:** Built as a microservice following the Single Responsibility Principle (SRP), ensuring focused and efficient functionality.
- **Compliance First:** Designed to be used responsibly without violating Instagram’s terms and conditions.

## **Getting Started**

### **Prerequisites**

- Node.js (version 20.x and above)
- A platform for deployment (e.g., [Vercel](https://vercel.com/))

### **Installation**

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/senthilsweb/instagram-scraper.git
   cd instagram-scraper
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**

  This project does not require specific environment variables, so no additional setup is necessary.

4. **Run Locally:**

   To run the scraper locally, use:

   ```bash
   npm run dev
   ```

   This will start the server on `http://localhost:3000`.

## **API Endpoint**

### **POST /api/instagram/scrape**

Retrieves Instagram posts for a given profile and size limit.

- **URL:** `/api/instagram/scrape`
- **Method:** `POST`
- **Content-Type:** `application/json`

### **Request Payload**

```json
{
  "profile_id": "your-instagram-profile-id",
  "first": 10
}
```

- **profile_id**: The Instagram profile ID you want to scrape.
- **first**: (Optional) Number of posts to fetch. Defaults to 10 if not provided.

### **Response**

#### **Successful Response**

If the request is successful, the API returns a JSON object containing the fetched Instagram posts.

```json
{
  "first": 10,
  "total": 100,
  "result": [
    {
      "id": 0,
      "text": "Your Instagram post caption",
      "thumbnail_src": "https://instagram.com/your-thumbnail-url.jpg",
      "display_url": "https://instagram.com/your-image-url.jpg",
      "shortcode": "shortcode123",
      "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
      "created_at": "01-Jan-2024"
    }
    // More posts...
  ]
}
```

#### **Validation Error Response**

If the `profile_id` is missing or invalid, the API returns a validation error response with a 400 status code.

```json
{
  "error": "Profile ID is required and cannot be empty.",
  "message": "Please provide a valid Instagram profile ID."
}
```

## **Deployment**

Deploy the scraper on platforms like Vercel for serverless and cost-effective operation:


Deploy the scraper on platforms like Vercel for serverless and cost-effective operation:

### **Deploy on Vercel:**

1. **Connect Your GitHub Repository to Vercel:**
   - Follow the steps in Vercel’s dashboard to connect your GitHub repository.

2. **Set Environment Variables:**
   - Although this project doesn’t require specific environment variables, ensure any relevant settings for your deployment environment are configured in Vercel.

3. **Deploy Your Project:**
   - Vercel automatically deploys your project with one click or via continuous integration with GitHub.

### **Warning: Vercel Function Time Limitation**

Vercel imposes a [time limitation](https://vercel.com/docs/concepts/limits/overview) on serverless functions, typically up to 10 seconds for free-tier users. If your request to scrape Instagram takes longer than this, the function may time out.

#### **Workarounds for Vercel Timeout:**

- **Optimize Requests:** Reduce the number of posts (`first`) requested to ensure the function completes within the time limit.
- **Use Incremental Loading:** Fetch posts incrementally (e.g., daily) to avoid large, time-consuming requests.
- **Alternative Deployment:** Consider deploying the scraper on platforms with higher timeout limits (e.g., AWS Lambda, Google Cloud Functions) if you anticipate needing to scrape large amounts of data.

## **Compliance and Usage**

- **Respect Instagram’s Terms of Use:** Use this tool responsibly to avoid account restrictions or legal issues.
- **Avoid Excessive Requests:** Making too many requests in a short period may result in your IP being blocked by Instagram.
- **Obtain Necessary Permissions:** Ensure you have the right to use and repurpose the Instagram content you scrape.

---