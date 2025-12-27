export async function analyzePost(
  post: string,
  tone: string,
  emoji: string
): Promise<string> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) throw new Error("HF API key missing");

  const response = await fetch(
    "https://router.huggingface.co/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.1-8B-Instruct",

        messages: [
          {
            role: "system",
            content:
              "You analyze LinkedIn posts and give concise reach optimization advice.",
          },
          {
            role: "user",
            content: `
Analyze this LinkedIn post.

Tone: ${tone}
Emoji usage: ${emoji}

Post:
${post}

Return bullet-point suggestions only.
`,
          },
        ],
        temperature: 0.7,
        max_tokens: 250,
      }),
    }
  );

  const raw = await response.text();

  if (!response.ok) {
    return `Hugging Face API error: ${raw}`;
  }

  try {
    const data = JSON.parse(raw);
    return data.choices[0].message.content.trim();
  } catch {
    return `Could not parse HF response: ${raw}`;
  }
}
