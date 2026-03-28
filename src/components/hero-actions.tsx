"use client";

export function HeroActions() {
  function openAssistant() {
    window.dispatchEvent(new Event("open-shopping-assistant"));
  }

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <a
        href="#catalog"
        className="rounded-full bg-[linear-gradient(135deg,#d38b61_0%,#b4574d_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(180,87,77,0.24)] transition hover:brightness-105"
      >
        Shop now
      </a>
      <button
        type="button"
        onClick={openAssistant}
        className="rounded-full border border-white/70 bg-[linear-gradient(180deg,rgba(255,252,249,0.92),rgba(255,241,231,0.88))] px-5 py-3 text-sm font-semibold text-[#5a463b] transition hover:border-[#d38b61] hover:bg-[#fff4eb]"
      >
        Ask the AI stylist
      </button>
    </div>
  );
}
