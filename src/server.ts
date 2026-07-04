import express, { Request, Response, NextFunction } from "express";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve, join } from "path";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cors()); // Enable CORS for frontend communication
app.use(helmet({ // Security headers
  contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false
}));

// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: "Too many requests from this IP, please try again later.",
    status: 429
  },
});

// Apply rate limiting to API routes
app.use("/api/", apiLimiter);

// Health check endpoint (not rate limited)
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API route for wireframe to ASCII conversion
app.post("/api/convert-wireframe", async (req: Request, res: Response) => {
  try {
    // Import Google AI generative AI
    const { GoogleGenerativeAI } = await import("@google/generative-ai");

    // Get API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }

    // Initialize GenAI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: { temperature: 0.1, maxOutputTokens: 4096 } // low temp for consistent, structured output
    });

    // Get image data from request
    const { imageData } = req.body;

    if (!imageData) {
      return res.status(400).json({
        error: "Missing image data",
        details: "No imageData provided in request body",
        timestamp: new Date().toISOString()
      });
    }

    // Validate image data format (should be base64 data URL)
    if (!imageData.startsWith("data:image/")) {
      return res.status(400).json({
        error: "Invalid image format",
        details: "Image data must be a base64 data URL (e.g., 'data:image/png;base64,...')",
        receivedType: typeof imageData,
        timestamp: new Date().toISOString()
      });
    }

    // Extract mime type and base64 data
    const matches = imageData.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches || !matches[1] || !matches[2]) {
      return res.status(400).json({
        error: "Invalid image data format",
        details: "Unable to parse image data URL",
        timestamp: new Date().toISOString()
      });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    // Validate image type
    const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml", "image/webp", "image/gif"];
    if (!allowedTypes.includes(mimeType)) {
      return res.status(400).json({
        error: "Unsupported image type",
        details: `Supported types: ${allowedTypes.join(", ")}. Received: ${mimeType}`,
        timestamp: new Date().toISOString()
      });
    }

    // Validate image size (base64 string length approximates 4/3 of original size)
    const base64Size = Buffer.byteLength(base64Data, 'base64');
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB limit
    if (base64Size > maxSizeBytes) {
      return res.status(413).json({
        error: "Image too large",
        details: `Image size exceeds ${maxSizeBytes / (1024 * 1024)}MB limit`,
        receivedSize: `${Math.round(base64Size / 1024)} KB`,
        timestamp: new Date().toISOString()
      });
    }

    // Generate content using Gemini
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType
        }
      },
      `
      Analyze this wireframe/screenshot and convert it to a clean, structured ASCII representation.

      Provide a JSON response with:
      1. asciiLayout: A monospaced ASCII art representation of the interface layout
      2. uiType: The type of screen (e.g., Login Form, Dashboard, E-commerce Product Page)
      3. layoutSummary: A brief description of the layout structure
      4. detectedComponents: Array of UI components found with their properties
      5. llmPromptReady: A formatted prompt combining all this info for code generation

      Focus on:
      - Structural layout (rows, columns, sections)
      - Key UI components (buttons, inputs, navbars, cards, etc.)
      - Spatial relationships and alignment
      - Clear, readable ASCII art using box-drawing characters and text symbols

      Example ASCII style:
      +---------------------+
      |  Header / Navbar    |
      +---------------------+
      | Sidebar |  Main     |
      |         |  Content  |
      |         +-----------+
      |         | Sidebar   |
      +---------------------+

      Be precise about component placement and use standard ASCII box-drawing characters.
      `
    ]);

    const resultText = await result.response.text();
    if (!resultText || resultText.trim() === "") {
      throw new Error("Empty response from Gemini API");
    }

    // Parse the JSON response
    let resultJson;
    try {
      // Try to parse as JSON directly
      resultJson = JSON.parse(resultText.trim());
    } catch (parseError) {
      // If that fails, try to extract JSON from the response
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          resultJson = JSON.parse(jsonMatch[0]);
        } catch (e) {
          throw new Error("Invalid JSON response from AI model");
        }
      } else {
        throw new Error("No JSON object found in AI response");
      }
    }

    // Validate required fields
    const requiredFields = ["asciiLayout", "uiType", "layoutSummary", "detectedComponents", "llmPromptReady"];
    for (const field of requiredFields) {
      if (!(field in resultJson)) {
        throw new Error(`Missing required field in AI response: ${field}`);
      }
    }

    // Ensure detectedComponents is an array
    if (!Array.isArray(resultJson.detectedComponents)) {
      resultJson.detectedComponents = [];
    }

    // Send successful response
    res.json({
      asciiLayout: resultJson.asciiLayout,
      uiType: resultJson.uiType,
      layoutSummary: resultJson.layoutSummary,
      detectedComponents: resultJson.detectedComponents,
      llmPromptReady: resultJson.llmPromptReady,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("Wireframe conversion error:", error);

    // Handle specific error types with appropriate status codes
    if (error.name === "APIError" ||
        error.message?.includes("API key") ||
        error.message?.includes("authentication")) {
      return res.status(500).json({
        error: "AI service configuration error",
        details: "Unable to connect to AI service. Please check server configuration.",
        timestamp: new Date().toISOString()
      });
    }

    if (error.message?.includes("quota") ||
        error.message?.includes("429") ||
        error.message?.includes("rate limit") ||
        error.message?.includes("Resource exhausted")) {
      return res.status(429).json({
        error: "AI service rate limit exceeded",
        details: "The AI service has exceeded its quota or rate limit. Please try again later.",
        timestamp: new Date().toISOString()
      });
    }

    if (error.message?.includes("invalid image") ||
        error.message?.includes("Invalid image") ||
        error.message?.includes("mime type") ||
        error.message?.includes("unsupported")) {
      return res.status(400).json({
        error: "Invalid image data",
        details: error.message,
        timestamp: new Date().toISOString()
      });
    }

    // Handle validation errors
    if (error.message?.includes("Missing required field")) {
      return res.status(502).json({
        error: "Invalid AI response",
        details: error.message,
        timestamp: new Date().toISOString()
      });
    }

    // Generic error response
    res.status(500).json({
      error: "Failed to process wireframe",
      details: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === "development" && { stack: error.stack })
    });
  }
});

// Global error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);

  // If headers already sent, delegate to Express's default error handler
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    error: "Internal server error",
    details: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

// 404 handler for undefined routes
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    error: "Not found",
    details: `Route ${req.originalUrl} not found on this server`,
    timestamp: new Date().toISOString()
  });
});

// Start server
async function startServer() {
  try {
    // In development, use Vite middleware
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      // In production, serve static files
      const distPath = resolve(__dirname, "../client/dist");
      if (existsSync(distPath)) {
        app.use(express.static(distPath));
        app.get("*", (req: Request, res: Response) => {
          res.sendFile(join(distPath, "index.html"));
        });
      } else {
        console.warn("Production build not found. Running in development mode.");
        // Fallback to Vite dev middleware
        const vite = await createViteServer({
          server: { middlewareMode: true },
          appType: "spa",
        });
        app.use(vite.middlewares);
      }
    }

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`Rate limiting: 100 requests per 15 minutes per IP`);
      console.log(`CORS enabled for all origins`);
    });

    // Graceful shutdown
    const shutdown = (signal: string) => {
      console.log(`Received ${signal}, shutting down gracefully...`);
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Helper function to check if directory exists
function existsSync(path: string): boolean {
  try {
    return require("fs").existsSync(path);
  } catch {
    return false;
  }
}

startServer().catch(console.error);