"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Faq, FaqCategory } from "@/types";
import FaqSearch from "@/components/faq/FaqSearch";
import FaqCategoryTabs from "@/components/faq/FaqCategoryTabs";
import FaqAccordion from "@/components/faq/FaqAccordion";

export default function FaqPage() {
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [search, setSearch] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  // Fetch categories
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/faq-categories");
        if (!res.ok) throw new Error("Failed");
        const data: FaqCategory[] = await res.json();
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategoryId(data[0].id);
        }
      } catch {
        setCategories([]);
      }
    })();
  }, []);

  // Fetch FAQs without flicker
  const fetchFaqs = useCallback(
    async (categoryId: number | null, searchQuery: string) => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const params = new URLSearchParams();
        if (categoryId) params.set("category_id", String(categoryId));
        if (searchQuery.trim()) params.set("search", searchQuery.trim());
        const res = await fetch(`/api/faqs?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed");
        const data: Faq[] = await res.json();
        if (!controller.signal.aborted) {
          setFaqs(data);
          setInitialLoading(false);
        }
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        if (!controller.signal.aborted) {
          setFaqs([]);
          setInitialLoading(false);
        }
      }
    },
    []
  );

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedCategoryId !== null) {
        fetchFaqs(selectedCategoryId, search);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedCategoryId, search, fetchFaqs]);

  const handleCategorySelect = (id: number) => {
    setSelectedCategoryId(id);
  };

  return (
    <div>
      {/* Header Banner */}
      <section className="bg-[#f8f9fa] py-16 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          무엇을 도와드릴까요?
        </h1>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-10">
        {/* Search */}
        <div className="mb-10">
          <FaqSearch value={search} onChange={setSearch} />
        </div>

        {/* Category Tabs */}
        {categories.length > 0 && (
          <div className="mb-8">
            <FaqCategoryTabs
              categories={categories}
              selectedId={selectedCategoryId}
              onSelect={handleCategorySelect}
            />
          </div>
        )}

        {/* FAQ List */}
        {initialLoading ? (
          <div className="py-16 text-center text-gray-400">로딩 중...</div>
        ) : (
          <FaqAccordion faqs={faqs} />
        )}
      </section>
    </div>
  );
}
