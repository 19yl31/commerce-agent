"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { catalog } from "@/data/catalog";
import type { ChatErrorResponse, ChatMessage, ChatResponse } from "@/lib/chat-contract";

const starterPrompts = [
  "A t-shirt for sports",
  "A lightweight rain jacket",
  "Similar items from an image",
];

function AssistantAvatar() {
  return (
    <div className="muse-orb h-10 w-10 rounded-2xl" />
  );
}

type DisplayMessage = ChatMessage & {
  imagePreview?: string;
};

export function CommerceAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([
    {
      role: "assistant",
      content: "Hi, I'm Muse. Tell me what you're looking for and I'll help you narrow it down.",
    },
  ]);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string>();
  const [selectedImageName, setSelectedImageName] = useState<string>();
  const [reply, setReply] = useState<ChatResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const openAssistant = () => setIsOpen(true);
    window.addEventListener("open-shopping-assistant", openAssistant);

    return () => {
      window.removeEventListener("open-shopping-assistant", openAssistant);
    };
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading, error, isOpen]);

  async function fileToDataUrl(file: File) {
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Failed to read image file"));
      reader.readAsDataURL(file);
    });
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const dataUrl = await fileToDataUrl(file);
    setSelectedImage(dataUrl);
    setSelectedImageName(file.name);
    setIsOpen(true);
  }

  async function submit(prompt: string) {
    if (!prompt.trim() && !selectedImage) {
      return;
    }

    setIsOpen(true);

    const nextMessages = [
      ...messages,
      {
        role: "user" as const,
        content: prompt.trim() || `Uploaded image: ${selectedImageName ?? "image"}`,
        imagePreview: selectedImage,
      },
    ];

    setMessages(nextMessages);
    setLoading(true);
    setError(null);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          input: prompt,
          imageDataUrl: selectedImage,
          imageName: selectedImageName,
        }),
      });

      const data = (await response.json()) as ChatResponse | ChatErrorResponse;
      if (!response.ok || "error" in data) {
        throw new Error("error" in data ? data.error : "Request failed.");
      }

      setReply(data);
      setMessages((current) => [...current, { role: "assistant", content: data.answer }]);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Something went wrong.";
      setError(message);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "I hit a problem while handling that request. Please try again with a shorter message or re-upload the image.",
        },
      ]);
    } finally {
      setLoading(false);
      setSelectedImage(undefined);
      setSelectedImageName(undefined);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submit(input);
  }

  async function handleTextareaKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await submit(input);
    }
  }

  const displayedRecommendations = reply?.recommendations ?? catalog.slice(0, 3);
  const hasUserStartedConversation = messages.some((message) => message.role === "user");

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-[linear-gradient(135deg,#3f201d_0%,#b4574d_100%)] px-4 py-3 text-white shadow-[0_22px_54px_rgba(97,45,39,0.34)] transition hover:scale-[1.02] hover:brightness-105"
      >
        <div className="muse-orb h-10 w-10 rounded-full" />
        <div className="text-left">
          <p className="text-sm font-semibold leading-4">Muse</p>
          <p className="mt-0.5 text-xs text-white/70">Your stylist</p>
        </div>
      </button>

      {isOpen ? (
        <section className="fixed inset-x-4 bottom-24 top-4 z-40 overflow-hidden rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,251,248,0.96),rgba(252,245,240,0.96))] shadow-[0_30px_90px_rgba(72,32,26,0.18)] backdrop-blur lg:left-auto lg:right-6 lg:top-auto lg:h-[min(760px,calc(100vh-120px))] lg:w-[min(1080px,calc(100vw-48px))]">
          <div className="flex items-center justify-between border-b border-[#ead9cf] bg-[linear-gradient(180deg,rgba(255,251,248,0.98),rgba(252,244,238,0.96))] px-5 py-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Muse at Avenoir</h3>
              <p className="mt-1 text-sm text-slate-500">
                Ask naturally, like you would with a real stylist.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 transition hover:bg-white"
              >
                Close
              </button>
            </div>
          </div>

          <div className="grid h-[calc(100%-73px)] gap-0 lg:grid-cols-[1fr_1fr]">
            <div className="flex min-h-0 flex-col border-b border-[#ead9cf] bg-white/90 lg:border-b-0 lg:border-r">
              {!hasUserStartedConversation ? (
                <div className="flex flex-wrap gap-2 border-b border-[#efe3db] px-5 py-4">
                  {starterPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void submit(prompt)}
                      className="rounded-full border border-[#ead8cf] bg-[#fff8f3] px-4 py-2 text-sm text-[#5a463b] transition hover:-translate-y-0.5 hover:border-[#d38b61] hover:bg-[#fff1e5] hover:shadow-[0_12px_24px_rgba(121,79,53,0.08)]"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              ) : null}

              <div
                ref={messagesContainerRef}
                className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-white px-5 py-4"
              >
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex gap-3 ${
                      message.role === "assistant" ? "items-start" : "justify-end"
                    }`}
                  >
                    {message.role === "assistant" ? <AssistantAvatar /> : null}
                    <article
                      className={`max-w-[82%] rounded-[22px] px-4 py-3 text-sm leading-6 shadow-sm ${
                        message.role === "assistant"
                          ? "rounded-tl-md bg-[#f8f0ea] text-[#4f433b]"
                          : "rounded-br-md bg-[linear-gradient(135deg,#3f201d_0%,#b4574d_100%)] text-white"
                      }`}
                    >
                      {message.imagePreview ? (
                        <div className="mb-3 overflow-hidden rounded-[16px] bg-white/10">
                          <Image
                            src={message.imagePreview}
                            alt="Uploaded reference"
                            width={320}
                            height={320}
                            className="max-h-56 w-full object-cover"
                          />
                        </div>
                      ) : null}
                      {message.content}
                    </article>
                  </div>
                ))}
                {loading ? (
                  <div className="flex items-start gap-3">
                    <AssistantAvatar />
                    <article className="max-w-[82%] rounded-[22px] rounded-tl-md bg-[#f8f0ea] px-4 py-3 text-sm text-[#7b6a5d] shadow-sm">
                      Give me a second. I am looking through the catalog...
                    </article>
                  </div>
                ) : null}
                {error ? (
                  <div className="flex items-start gap-3">
                    <AssistantAvatar />
                    <article className="max-w-[82%] rounded-[22px] rounded-tl-md bg-[#fff0ec] px-4 py-3 text-sm text-[#9e4f43] shadow-sm">
                      {error}
                    </article>
                  </div>
                ) : null}
              </div>

              <form onSubmit={handleSubmit} className="border-t border-[#efe3db] bg-[#fcf7f2] px-5 py-4">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => void handleTextareaKeyDown(event)}
                  placeholder="Describe what you need, where you plan to wear it, or the style you want."
                  className="min-h-24 w-full resize-none rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#d28d58] focus:ring-4 focus:ring-[#f8d9bd]"
                />
                <p className="mt-2 text-xs text-slate-400">
                  Press Enter to send. Use Shift+Enter for a new line.
                </p>

                {selectedImage ? (
                  <div className="mt-3 flex items-center gap-3 rounded-[18px] border border-slate-200 bg-white p-3">
                    <div className="h-14 w-14 overflow-hidden rounded-[14px] bg-[#eef1f4]">
                      <Image
                        src={selectedImage}
                        alt={selectedImageName ?? "Uploaded preview"}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {selectedImageName ?? "Uploaded image"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        This image will be used as a reference.
                      </p>
                    </div>
                  </div>
                ) : null}

                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(event) => void handleFileChange(event)}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#d28d58] hover:bg-[#fff1e5]"
                    >
                      Upload image
                    </button>
                    <span className="text-sm text-slate-500">
                      {selectedImageName ?? "PNG, JPG, or WebP"}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-full bg-[#d28d58] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#bc7742] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Searching..." : "Send"}
                  </button>
                </div>
              </form>
            </div>

            <div className="min-h-0 overflow-y-auto bg-[linear-gradient(180deg,#fff8f4_0%,#fff2eb_100%)] px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Recommended picks</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {reply?.imageSummary
                      ? "Matched from your uploaded image and the current conversation."
                      : "Updated from the current conversation."}
                  </p>
                </div>
              </div>

              {reply?.imageSummary ? (
                <p className="mt-4 rounded-[18px] bg-white px-4 py-3 text-sm leading-6 text-slate-600">
                  Visual cue: {reply.imageSummary}
                </p>
              ) : null}

              <div className="mt-4 grid gap-4">
                {displayedRecommendations.map((product) => (
                  <article
                    key={product.id}
                    className="rounded-[22px] border border-white bg-white p-4 shadow-sm transition hover:-translate-y-0.5"
                  >
                    <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
                      <div className="overflow-hidden rounded-[18px] bg-[#eef1f4]">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={240}
                          height={240}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="font-semibold text-slate-900">{product.name}</h4>
                            <p className="mt-1 text-sm text-slate-500">
                              {product.category} · {product.color} · {product.audience}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-slate-900">
                            ${product.price}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
