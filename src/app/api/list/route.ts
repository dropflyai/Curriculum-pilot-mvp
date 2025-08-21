import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dataset = searchParams.get("dataset");
  const label = searchParams.get("label");
  
  if (!dataset || !label) {
    return NextResponse.json({ error: "Missing dataset or label" }, { status: 400 });
  }
  
  const dir = path.join(process.cwd(), "public", "datasets", dataset, label);
  
  try {
    const files = fs
      .readdirSync(dir)
      .filter((f) => /\.(png|jpg|jpeg|webp|svg)$/i.test(f))
      .sort()
      .map((f) => `/datasets/${dataset}/${label}/${encodeURIComponent(f)}`);
    
    return NextResponse.json(files);
  } catch (e) {
    return NextResponse.json({ error: "Not found", detail: String(e) }, { status: 404 });
  }
}