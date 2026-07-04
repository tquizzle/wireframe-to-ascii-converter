// Predefined high-quality SVG wireframe presets that can be converted to PNG on-the-fly.

export interface PresetWireframe {
  id: string;
  name: string;
  description: string;
  category: string;
  svg: string;
}

export const PRESET_WIREFRAMES: PresetWireframe[] = [
  {
    id: "login",
    name: "Clean Login Card",
    description: "A standard login form with inputs for email and password, a 'Remember me' checkbox, and a primary submit button.",
    category: "Forms",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
  <rect width="600" height="450" fill="#f8fafc" rx="12"/>
  <!-- Outline of screen -->
  <rect x="20" y="20" width="560" height="410" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" rx="8"/>

  <!-- Outer Card container -->
  <rect x="150" y="70" width="300" height="310" fill="#ffffff" stroke="#94a3b8" stroke-width="3" rx="12" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.05))"/>

  <!-- Card Header -->
  <text x="300" y="115" font-family="'Inter', sans-serif" font-size="24" font-weight="700" fill="#1e293b" text-anchor="middle">Welcome Back</text>
  <text x="300" y="135" font-family="'Inter', sans-serif" font-size="12" fill="#64748b" text-anchor="middle">Please enter your credentials to login</text>

  <!-- Form Field: Email -->
  <text x="180" y="175" font-family="'Inter', sans-serif" font-size="12" font-weight="600" fill="#475569">Email Address</text>
  <rect x="180" y="185" width="240" height="36" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" rx="6"/>
  <text x="195" y="207" font-family="'Inter', sans-serif" font-size="12" fill="#94a3b8">name@example.com</text>

  <!-- Form Field: Password -->
  <text x="180" y="250" font-family="'Inter', sans-serif" font-size="12" font-weight="600" fill="#475569">Password</text>
  <rect x="180" y="260" width="240" height="36" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" rx="6"/>
  <text x="195" y="282" font-family="'Inter', sans-serif" font-size="16" fill="#94a3b8">••••••••</text>

  <!-- Remember Me & Forgot Password row -->
  <rect x="180" y="312" width="12" height="12" fill="#ffffff" stroke="#94a3b8" stroke-width="2" rx="2"/>
  <text x="198" y="322" font-family="'Inter', sans-serif" font-size="11" fill="#64748b">Remember me</text>
  <text x="420" y="322" font-family="'Inter', sans-serif" font-size="11" fill="#3b82f6" text-anchor="end" text-decoration="underline">Forgot password?</text>

  <!-- Submit Button -->
  <rect x="180" y="338" width="240" height="34" fill="#1e293b" rx="6"/>
  <text x="300" y="359" font-family="'Inter', sans-serif" font-size="13" font-weight="600" fill="#ffffff" text-anchor="middle">Sign In</text>
</svg>`
  },
  {
    id: "dashboard",
    name: "Admin Dashboard Layout",
    description: "Classic grid-based back-office layout with a top navigation bar, collapsible left sidebar, and three metric card blocks.",
    category: "Dashboards",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
  <rect width="600" height="450" fill="#f1f5f9" rx="12"/>
  <!-- Outline of screen -->
  <rect x="20" y="20" width="560" height="410" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" rx="8"/>

  <!-- Top Navigation Header -->
  <rect x="20" y="20" width="560" height="45" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" rx="0"/>
  <circle cx="45" cy="42" r="10" fill="#3b82f6"/>
  <text x="65" y="46" font-family="'Inter', sans-serif" font-size="14" font-weight="700" fill="#0f172a">SaaSAdmin</text>
  <text x="300" y="46" font-family="'Inter', sans-serif" font-size="12" fill="#64748b" text-anchor="middle">Search wireframes...</text>
  <rect x="230" y="30" width="140" height="22" fill="none" stroke="#cbd5e1" stroke-width="1.5" rx="4"/>
  <rect x="520" y="30" width="40" height="22" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5" rx="4"/>
  <text x="540" y="44" font-family="'Inter', sans-serif" font-size="10" fill="#475569" text-anchor="middle">User</text>

  <!-- Left Sidebar -->
  <rect x="20" y="65" width="120" height="365" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
  <text x="35" y="95" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#3b82f6">📊 Dashboard</text>
  <text x="35" y="125" font-family="'Inter', sans-serif" font-size="11" fill="#475569">👥 Customers</text>
  <text x="35" y="155" font-family="'Inter', sans-serif" font-size="11" fill="#475569">📦 Products</text>
  <text x="35" y="185" font-family="'Inter', sans-serif" font-size="11" fill="#475569">⚙️ Settings</text>

  <!-- Main Panel Header -->
  <text x="160" y="100" font-family="'Inter', sans-serif" font-size="18" font-weight="700" fill="#0f172a">Metrics Overview</text>
  <text x="160" y="116" font-family="'Inter', sans-serif" font-size="11" fill="#64748b">Real-time product performance analytics</text>

  <!-- Metrics Cards Row -->
  <!-- Card 1 -->
  <rect x="160" y="135" width="120" height="80" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" rx="6"/>
  <text x="172" y="158" font-family="'Inter', sans-serif" font-size="11" fill="#64748b">Total Revenue</text>
  <text x="172" y="184" font-family="'Inter', sans-serif" font-size="18" font-weight="700" fill="#0f172a">$48,259</text>
  <text x="172" y="202" font-family="'Inter', sans-serif" font-size="9" fill="#10b981">↑ +12.5%</text>

  <!-- Card 2 -->
  <rect x="295" y="135" width="120" height="80" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" rx="6"/>
  <text x="307" y="158" font-family="'Inter', sans-serif" font-size="11" fill="#64748b">Active Users</text>
  <text x="307" y="184" font-family="'Inter', sans-serif" font-size="18" font-weight="700" fill="#0f172a">10,482</text>
  <text x="307" y="202" font-family="'Inter', sans-serif" font-size="9" fill="#10b981">↑ +4.2%</text>

  <!-- Card 3 -->
  <rect x="430" y="135" width="130" height="80" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" rx="6"/>
  <text x="442" y="158" font-family="'Inter', sans-serif" font-size="11" fill="#64748b">Conversion Rate</text>
  <text x="442" y="184" font-family="'Inter', sans-serif" font-size="18" font-weight="700" fill="#0f172a">2.48%</text>
  <text x="442" y="202" font-family="'Inter', sans-serif" font-size="9" fill="#ef4444">↓ -0.8%</text>

  <!-- Large Chart Area Placeholder -->
  <rect x="160" y="235" width="400" height="180" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5" rx="8"/>
  <text x="360" y="320" font-family="'Inter', sans-serif" font-size="12" font-weight="600" fill="#94a3b8" text-anchor="middle">[ Performance Line Graph Placeholder ]</text>
  <path d="M 180 390 L 230 350 L 280 370 L 330 310 L 380 330 L 430 270 L 480 290 L 530 250" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
</svg>`
  },
  {
    id: "ecommerce",
    name: "E-Commerce Product Detail",
    description: "Product layout showcasing product photo frame, title/price block, rating stars, size options, and an 'Add to Cart' button.",
    category: "Shopping",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
  <rect width="600" height="450" fill="#fafafa" rx="12"/>
  <!-- Outline of screen -->
  <rect x="20" y="20" width="560" height="410" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" rx="8"/>

  <!-- Breadcrumbs -->
  <text x="40" y="55" font-family="'Inter', sans-serif" font-size="11" fill="#94a3b8">Shop > Apparel > Outerwear > Jackets</text>

  <!-- Left Side: Image Gallery -->
  <rect x="40" y="75" width="240" height="240" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5" rx="6"/>
  <text x="160" y="190" font-family="'Inter', sans-serif" font-size="12" font-weight="600" fill="#64748b" text-anchor="middle">[ PRODUCT PHOTO ]</text>
  <path d="M 60 215 L 120 125 L 180 230 L 220 180 L 260 245" fill="none" stroke="#cbd5e1" stroke-width="2"/>

  <!-- Thumbnail Selector row -->
  <rect x="40" y="325" width="50" height="50" fill="#ffffff" stroke="#3b82f6" stroke-width="2" rx="4"/>
  <rect x="100" y="325" width="50" height="50" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" rx="4"/>
  <rect x="160" y="325" width="50" height="50" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" rx="4"/>
  <rect x="220" y="325" width="50" height="50" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" rx="4"/>

  <!-- Right Side: Details -->
  <!-- Title -->
  <text x="310" y="100" font-family="'Inter', sans-serif" font-size="20" font-weight="700" fill="#0f172a">Classic Heritage Parka</text>
  <text x="310" y="122" font-family="'Inter', sans-serif" font-size="11" fill="#64748b">SKU: CHP-2026-X</text>

  <!-- Rating -->
  <text x="310" y="145" font-family="'Inter', sans-serif" font-size="13" fill="#eab308">★★★★★ <tspan fill="#64748b" font-size="11"> (4.8 out of 5 based on 124 reviews)</tspan></text>

  <!-- Price -->
  <text x="310" y="185" font-family="'Inter', sans-serif" font-size="24" font-weight="800" fill="#0f172a">$189.00</text>

  <!-- Description -->
  <text x="310" y="210" font-family="'Inter', sans-serif" font-size="11" fill="#475569">
    <tspan x="310" dy="0">High-performance utility jacket with a weather-resistant outer shell,</tspan>
    <tspan x="310" dy="16">padded quilted lining, deep zippered cargo pockets, and adjustable hood.</tspan>
  </text>

  <!-- Size selector label -->
  <text x="310" y="255" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#0f172a">Select Size</text>
  <rect x="310" y="265" width="30" height="26" fill="#1e293b" rx="4"/>
  <text x="325" y="282" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">S</text>

  <rect x="350" y="265" width="30" height="26" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" rx="4"/>
  <text x="365" y="282" font-family="'Inter', sans-serif" font-size="11" fill="#475569" text-anchor="middle">M</text>

  <rect x="390" y="265" width="30" height="26" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" rx="4"/>
  <text x="405" y="282" font-family="'Inter', sans-serif" font-size="11" fill="#475569" text-anchor="middle">L</text>

  <rect x="430" y="265" width="30" height="26" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" rx="4"/>
  <text x="445" y="282" font-family="'Inter', sans-serif" font-size="11" fill="#475569" text-anchor="middle">XL</text>

  <!-- Buttons -->
  <rect x="310" y="315" width="250" height="40" fill="#2563eb" rx="6"/>
  <text x="435" y="339" font-family="'Inter', sans-serif" font-size="13" font-weight="600" fill="#ffffff" text-anchor="middle">🛒 Add to Cart</text>

  <rect x="310" y="365" width="250" height="34" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" rx="6"/>
  <text x="435" y="386" font-family="'Inter', sans-serif" font-size="12" font-weight="600" fill="#475569" text-anchor="middle">🤍 Add to Wishlist</text>
</svg>`
  }
];

// Optimized SVG to PNG conversion with reused canvas context
let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;

// Initialize canvas once for reuse
function initializeCanvas() {
  if (!canvas) {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }
    // Set to double resolution for crisp text reading by Gemini
    canvas.width = 1200;
    canvas.height = 900;
  }
  return { canvas, ctx };
}

export function svgToPng(svgString: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Initialize or reuse canvas
      const { canvas, ctx } = initializeCanvas();

      // Clear canvas with white background
      ctx!.fillStyle = "#ffffff";
      ctx!.fillRect(0, 0, canvas.width, canvas.height);

      // Create blob URL from SVG string
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const URL = window.URL || window.webkitURL;
      const blobURL = URL.createObjectURL(svgBlob);
      const image = new Image();

      image.onload = () => {
        try {
          // Draw image at original size (it will scale to fit our 1200x900 canvas)
          // Original SVG is 600x450, we're drawing at 2x scale
          ctx!.drawImage(image, 0, 0, 600, 450);
          const png = canvas.toDataURL("image/png");
          resolve(png);
        } catch (drawError) {
          reject(drawError);
        } finally {
          URL.revokeObjectURL(blobURL);
        }
      };

      image.onerror = (err) => {
        URL.revokeObjectURL(blobURL);
        reject(err);
      };

      image.src = blobURL;
    } catch (err) {
      reject(err);
    }
  });
}

// Note: soulURL() is no longer needed as we're using window.URL directly in browser environment.
// This file is only used in the browser, not in Node.js/server-side contexts.