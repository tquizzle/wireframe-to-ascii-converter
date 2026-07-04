import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = 3000;

// Security middleware
app.use(helmet());
// CORS middleware - adjust origin as needed for production
app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? ["https://yourdomain.com"] // Update with your actual domain
    : ["http://localhost:5173", "http://localhost:3000"], // Vite dev server and our server
  credentials: true
}));

// Set up JSON body parser with generous limit for base64 image uploads
app.use(express.json({ limit: "15mb" }));

// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes",
  },
});

// Apply rate limiting to API routes
app.use("/api/", apiLimiter);

// Initialize GoogleGenAI with modern SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Endpoint to convert wireframe image to ASCII
app.post("/api/convert-wireframe", async (req, res) => {
  try {
    const { image, mimeType, style, includeAnnotations } = req.body;

    // Input validation
    if (!image) {
      return res.status(400).json({
        error: "No image data provided",
        details: "The image field is required in the request body"
      });
    }

    // Validate image data format (base64 string)
    if (typeof image !== 'string') {
      return res.status(400).json({
        error: "Invalid image data format",
        details: "Image data must be a base64 encoded string"
      });
    }

    // Basic base64 validation (check if it looks like base64)
    if (!/^[A-Za-z0-9+/]+(?:={0,2})$/.test(image.split(',')[1] || image)) {
      return res.status(400).json({
        error: "Invalid image data",
        details: "Image data must be a valid base64 string"
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Server configuration error",
        details: "GEMINI_API_KEY is not configured on the server. Please contact administrator."
      });
    }

    // Validate style parameter
    const validStyles = ["balanced", "boxy", "text-rich"];
    if (style && !validStyles.includes(style)) {
      return res.status(400).json({
        error: "Invalid style parameter",
        details: `Style must be one of: ${validStyles.join(', ')}`
      });
    }

    // Validate includeAnnotations parameter
    if (typeof includeAnnotations !== 'boolean' && includeAnnotations !== undefined) {
      return res.status(400).json({
        error: "Invalid includeAnnotations parameter",
        details: "includeAnnotations must be a boolean value"
      });
    }

    // Prepare prompt according to the requested style
    let styleInstruction = "";
    if (style === "boxy") {
      styleInstruction = `
- Focus heavily on borders, outer frames, boxes, and grids.
- Use standard box-drawing ASCII elements like '+', '-', '|' for borders and separators.
- Mark empty containers or generic placeholders clearly with a cross or blank margins.
- Ensure strict rectangular layout integrity with even padding and alignment.
`;
    } else if (style === "text-rich") {
      styleInstruction = `
- Include descriptive labels inside brackets like [ Button: Submit ], [ Input: Enter Name... ], and list items with clear markers.
- Emphasize content hierarchy: headers, navigation menus, sidebars, main layout, footer.
- Use text markers like '(*)' for selected radio buttons, '[ ]' for checkboxes, 'V' for dropdown arrows.
- Do not let borders crowd the layout; focus on showing content and controls.
`;
    } else {
      // Balanced / default
      styleInstruction = `
- Blend structural boxes with functional element labels.
- Use standard boxes '+-------+' for borders and cards.
- Label controls intuitively: '[ Submit ]' for buttons, '[___________]' or '[ Enter text... ]' for input text, 'v' for selectors, '(o)' for radio buttons.
- Create a clean representation that translates directly to readable text.
`;
    }

    const systemInstruction = `
You are a highly precise UI/UX Engineering Assistant that specializes in converting visual wireframes, mockups, or sketches into beautiful, structured, and syntactically balanced ASCII layouts.

Your goal is to inspect the uploaded wireframe image and produce a flawless ASCII art representation of the layout and UI components. The output must be optimized for text-only LLMs (like GPT or Claude) to perfectly understand the structural composition of the screen for code generation.

RULES FOR THE ASCII ART:
1. Keep the horizontal layout restricted to around 70-80 columns if possible, ensuring it is highly readable.
2. Ensure vertical and horizontal lines align perfectly. If you draw a box, make sure all rows of the box have matching borders.
3. Represent key UI elements cleanly:
   - Buttons: [ Button Label ] or < Button Label >
   - Input fields: [_________________] or [ Placeholder Text... ]
   - Checkboxes: [ ] Unchecked, [X] Checked
   - Radio buttons: ( ) Unselected, (o) Selected
   - Sliders/Progress: [====-------]
   - Images/Icons: [ [Img] ] or [ [Icon: search] ]
   - Text Blocks: Use paragraphs or lines with clean alignment
   - Dropdown selects: [ Select Option v ]
4. Keep the output clean. The response must follow the specified JSON schema exactly.
`;

    const userPrompt = `
Analyze the attached wireframe image.
Style requested: ${style || "balanced"}
Include Annotations: ${typeof includeAnnotations === 'boolean' ? (includeAnnotations ? "Yes" : "No") : "Default"}

${styleInstruction}

Produce the conversion output matching the JSON schema. Ensure the asciiLayout is a single, clean text string with newlines (\\n) separating each line of the ASCII block.
`;

    // Package the image for Gemini API
    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/png",
        data: image.split(",")[1] || image // Strip data prefix if present
      }
    };

    const textPart = {
      text: userPrompt
    };

    // Call the Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction,
        temperature: 0.1, // Low temperature for high structural precision
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            asciiLayout: {
              type: Type.STRING,
              description: "The complete, perfectly formatted ASCII diagram of the screen layout."
            },
            uiType: {
              type: Type.STRING,
              description: "The type or category of screen identified (e.g., Landing Page, Admin Dashboard, Chat Interface)."
            },
            layoutSummary: {
              type: Type.STRING,
              description: "A summary explaining the layout structure, rows, columns, and navigation hierarchy."
            },
            detectedComponents: {
              type: Type.ARRAY,
              description: "Key UI components identified on the screen.",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "A unique slug, e.g., 'navbar_logo' or 'btn_checkout'" },
                  type: { type: Type.STRING, description: "Type of component (Button, Navbar, Sidebar, Form Input, Table, etc.)" },
                  label: { type: Type.STRING, description: "The label, placeholder text, or header content seen on the component." },
                  alignment: { type: Type.STRING, description: "Where it lies on the layout (e.g. Top Center, Left Sidebar, Main panel lower-right)." }
                },
                required: ["id", "type", "label", "alignment"]
              }
            },
            llmPromptReady: {
              type: Type.STRING,
              description: "A custom prompt string that combines the ASCII layout and details, pre-packaged for the user to copy directly into another LLM for code generation."
            }
          },
          required: ["asciiLayout", "uiType", "layoutSummary", "detectedComponents", "llmPromptReady"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini API");
    }

    const resultJson = JSON.parse(resultText);
    res.json(resultJson);

  } catch (error: any) {
    console.error("Conversion failed:", error);

    // Handle specific error types
    if (error.name === "GoogleGenerativeAIError") {
      // Handle AI service specific errors
      res.status(502).json({
        error: "AI service error",
        details: "Failed to process image with AI service. Please try again later."
      });
    } else if (error.name === "SyntaxError" && error.message.includes("Unexpected token")) {
      // Handle JSON parsing errors
      res.status(502).json({
        error: "Invalid response from AI service",
        details: "The AI service returned an invalid response format"
      });
    } else {
      // Generic error handler
      res.status(500).json({
        error: "Failed to convert wireframe",
        details: process.env.NODE_ENV === "development" ? error.message : "Internal server error"
      });
    }
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    aiConfigured: !!process.env.GEMINI_API_KEY
  });
});

// Configure Vite middleware or static files depending on environment
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

initServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});