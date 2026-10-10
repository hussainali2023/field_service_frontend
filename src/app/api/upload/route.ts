import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Size limit check: 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: "File exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Attempt backend Multer & Cloudinary upload first
    const backendApi =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "https://field-service-backend-mu.vercel.app/api/v1";
    try {
      const backendFormData = new FormData();
      backendFormData.append("file", file);

      const authHeader = req.headers.get("authorization");
      const backendRes = await fetch(`${backendApi}/upload/single`, {
        method: "POST",
        body: backendFormData,
        headers: authHeader ? { Authorization: authHeader } : undefined,
      });

      if (backendRes.ok) {
        const json = await backendRes.json();
        if (json.success && json.data) {
          return NextResponse.json({
            success: true,
            message: "File uploaded successfully via Multer & Cloudinary",
            data: {
              url: json.data.url,
              name: json.data.originalName || file.name,
              size: json.data.bytes || file.size,
              type: json.data.format || file.type,
            },
          });
        }
      }
    } catch {
      // Fallback below
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert to base64 Data URL so it is universally viewable without external storage credentials
    const mimeType = file.type || "application/octet-stream";
    const base64Data = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      data: {
        url: dataUrl,
        name: file.name,
        size: file.size,
        type: mimeType,
      },
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "File upload failed" },
      { status: 500 }
    );
  }
}
