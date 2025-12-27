import { analyzePost } from "@/lib/analyzePost";

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { text, tone, emoji_level } = await req.json();
  try {
    console.log("/api/analyze called with:", { text, tone, emoji_level });
    const analysis = await analyzePost(text, tone, emoji_level);
    try {
      await supabase.from("posts").insert([
        {
          text,
          tone,
          emoji_level,
          analysis,
          reach_score: null,
          risk_level: null,
          blockers: null,
          suggested_hook: null,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (e) {
      console.error("Supabase insert error:", e);
    }
    return NextResponse.json({ analysis });
  } catch (err) {
    console.error("/api/analyze error:", err);
    return NextResponse.json(
      { error: "Failed to call Hugging Face API." },
      { status: 500 }
    );
  }
}
