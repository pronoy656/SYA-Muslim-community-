"use client";
import React, { useState } from "react";
import {
  MessageSquare, Clock, CheckCircle2, Search, Send, X
} from "lucide-react";
import { cn } from "@/lib/utils";

type QuestionStatus = "pending" | "answered";

interface ImamQuestion {
  id: string;
  userName: string;
  userEmail: string;
  question: string;
  date: string;
  status: QuestionStatus;
  answer?: string;
  category: string;
}

const initialQuestions: ImamQuestion[] = [
  {
    id: "1", userName: "Omar Hassan",  userEmail: "omar@example.com",
    question: "How can I improve my concentration during Salah? I find my mind wandering and I want to be more present in my prayers.",
    date: "2024-04-30", status: "pending", category: "Prayer",
  },
  {
    id: "2", userName: "Yusuf Ahmed",  userEmail: "yusuf@example.com",
    question: "Is it permissible to miss Jummah prayer due to work commitments?",
    date: "2024-04-29", status: "pending", category: "Fiqh",
  },
  {
    id: "3", userName: "Khalid Said",  userEmail: "khalid@example.com",
    question: "What is the correct pronunciation of Surah Al-Fatiha? I want to make sure I am reciting it correctly.",
    date: "2024-04-26", status: "pending", category: "Quran",
  },
  {
    id: "4", userName: "Maryam Noor",  userEmail: "maryam@example.com",
    question: "What are the conditions for Zakat to become obligatory?",
    date: "2024-04-20", status: "answered",
    answer: "As-salamu alaykum wa rahmatullahi wa barakatuh. Zakat becomes obligatory when a Muslim possesses a minimum amount (nisab) for one lunar year. May Allah bless you.",
    category: "Zakat",
  },
  {
    id: "5", userName: "Bilal Kareem", userEmail: "bilal@example.com",
    question: "Can I perform Wudu with tap water that has a slight odour?",
    date: "2024-04-18", status: "answered",
    answer: "Wa alaykum as-salam. Water that has a slight natural odour is still considered pure and valid for Wudu, as long as it has not been majorly altered. Allahu Akbar.",
    category: "Purification",
  },
];

type FilterTab = "All" | "Pending" | "Answered";

/* ── Stat Card ─────────────────────────────────────────────────── */
function StatCard({ icon, value, label, color }: {
  icon: React.ReactNode; value: number; label: string; color: string;
}) {
  return (
    <div className="bg-white border border-[#EAE3D5] rounded-2xl px-6 py-5 flex items-center gap-5 shadow-sm">
      <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shrink-0", color)}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-bold text-slate-800 leading-none">{value}</p>
        <p className="text-sm text-slate-500 font-sans mt-1">{label}</p>
      </div>
    </div>
  );
}

/* ── Answer Dialog ─────────────────────────────────────────────── */
function AnswerDialog({ question, onClose, onSubmit }: {
  question: ImamQuestion;
  onClose: () => void;
  onSubmit: (id: string, answer: string) => void;
}) {
  const [answer, setAnswer] = useState("");

  const handleSend = () => {
    if (!answer.trim()) return;
    onSubmit(question.id, answer.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden font-sans"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 pt-7 pb-4 flex items-center justify-between border-b border-[#EAE3D5]">
          <h2 className="text-xl font-bold text-slate-800 font-cinzel tracking-wide">Answer Question</h2>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-500 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-8 py-6 space-y-5">
          {/* User info block */}
          <div className="bg-[#FAF7F2] border border-[#EAE3D5] rounded-2xl px-5 py-4 space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">User</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{question.userName}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Date Submitted</p>
              <p className="text-sm font-semibold text-slate-700 mt-0.5">{question.date}</p>
            </div>
          </div>

          {/* Question */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Question</label>
            <div className="bg-[#FAF7F2] border border-[#EAE3D5] rounded-2xl px-5 py-4">
              <p className="text-sm text-slate-700 leading-relaxed">{question.question}</p>
            </div>
          </div>

          {/* Answer */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Your Answer</label>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              rows={6}
              placeholder="Write a detailed, compassionate answer… Remember to greet with 'As-salamu alaykum' and end with a du'a…"
              className="w-full px-5 py-4 rounded-2xl border border-[#E0D4BC] bg-[#FAF7F2] text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C4A052]/40 focus:border-[#C4A052] transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-7 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 text-sm font-semibold border border-[#EAE3D5] rounded-2xl text-slate-600 hover:bg-[#FAF7F2] transition-all"
          >
            Close
          </button>
          <button
            onClick={handleSend}
            disabled={!answer.trim()}
            className="flex-1 py-3.5 text-sm font-semibold bg-[#C4A052] text-white rounded-2xl hover:bg-[#A8873A] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Send className="h-4 w-4" />
            Send Answer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────── */
export default function AskImamPage() {
  const [questions, setQuestions] = useState<ImamQuestion[]>(initialQuestions);
  const [filter, setFilter] = useState<FilterTab>("All");
  const [search, setSearch] = useState("");
  const [answeringId, setAnsweringId] = useState<string | null>(null);

  const answeringQuestion = questions.find(q => q.id === answeringId) ?? null;

  const counts = {
    All: questions.length,
    Pending: questions.filter(q => q.status === "pending").length,
    Answered: questions.filter(q => q.status === "answered").length,
  };

  const filtered = questions.filter(q => {
    const matchesFilter =
      filter === "All" ||
      (filter === "Pending" && q.status === "pending") ||
      (filter === "Answered" && q.status === "answered");
    const matchesSearch =
      q.userName.toLowerCase().includes(search.toLowerCase()) ||
      q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSubmitAnswer = (id: string, answer: string) => {
    setQuestions(prev =>
      prev.map(q => q.id === id ? { ...q, status: "answered", answer } : q)
    );
  };

  return (
    <div className="space-y-6 pb-12 font-cinzel bg-[#FCFAF8] min-h-screen p-8">
      {answeringQuestion && (
        <AnswerDialog
          question={answeringQuestion}
          onClose={() => setAnsweringId(null)}
          onSubmit={handleSubmitAnswer}
        />
      )}

      {/* Header */}
      <div className="border-b border-[#EAE3D5] pb-6">
        <h1 className="text-3xl font-normal text-slate-800 tracking-wider uppercase">
          Ask an Imam Questions
        </h1>
        <p className="text-slate-500 mt-2 text-sm font-sans">
          Manage and answer user questions
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<MessageSquare className="h-6 w-6 text-[#C4A052]" />}
          value={counts.All}
          label="Total Questions"
          color="bg-[#F4EFE6]"
        />
        <StatCard
          icon={<Clock className="h-6 w-6 text-amber-500" />}
          value={counts.Pending}
          label="Pending Answers"
          color="bg-amber-50"
        />
        <StatCard
          icon={<CheckCircle2 className="h-6 w-6 text-emerald-500" />}
          value={counts.Answered}
          label="Answered"
          color="bg-emerald-50"
        />
      </div>

      {/* Search + Filter row */}
      <div className="bg-white border border-[#EAE3D5] rounded-2xl shadow-sm px-5 py-4 flex items-center gap-4 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by user name, question, or category..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E0D4BC] rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C4A052]/30 font-sans"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2">
          {(["All", "Pending", "Answered"] as FilterTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all font-sans",
                filter === tab
                  ? tab === "Pending"
                    ? "bg-amber-500 text-white shadow-sm"
                    : tab === "Answered"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "bg-[#C4A052] text-white shadow-sm"
                  : "bg-[#FAF7F2] border border-[#E0D4BC] text-slate-600 hover:bg-[#F0EBE1]"
              )}
            >
              {tab}
              {tab !== "All" && (
                <span className={cn(
                  "text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                  filter === tab ? "bg-white/25" : "bg-[#E0D4BC] text-slate-600"
                )}>
                  {counts[tab]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#EAE3D5] rounded-2xl shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[180px_1fr_130px_130px_110px] bg-[#FAF7F2] border-b border-[#EAE3D5] px-6 py-3">
          {["User", "Question", "Date", "Status", "Action"].map(h => (
            <div key={h} className="text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">{h}</div>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 font-sans text-sm">
            No questions found.
          </div>
        ) : (
          filtered.map((q, i) => (
            <div
              key={q.id}
              className={cn(
                "grid grid-cols-[180px_1fr_130px_130px_110px] px-6 py-4 items-center gap-2",
                i !== filtered.length - 1 && "border-b border-[#F0EBE1]",
                "hover:bg-[#FDFAF6] transition-colors"
              )}
            >
              {/* User */}
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{q.userName}</p>
                <p className="text-xs text-slate-400 font-sans truncate">{q.userEmail}</p>
              </div>

              {/* Question */}
              <div className="min-w-0 pr-4">
                <p className="text-sm text-slate-600 font-sans line-clamp-2 leading-relaxed">
                  {q.question}
                </p>
              </div>

              {/* Date */}
              <div>
                <p className="text-sm text-slate-500 font-sans">{q.date}</p>
              </div>

              {/* Status */}
              <div>
                {q.status === "pending" ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500 font-sans">
                    <Clock className="h-3.5 w-3.5" /> Pending
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 font-sans">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Answered
                  </span>
                )}
              </div>

              {/* Action */}
              <div>
                {q.status === "pending" ? (
                  <button
                    onClick={() => setAnsweringId(q.id)}
                    className="px-4 py-2 bg-[#C4A052] hover:bg-[#A8873A] text-white text-xs font-bold rounded-xl transition-all shadow-sm font-sans"
                  >
                    Answer
                  </button>
                ) : (
                  <button
                    onClick={() => setAnsweringId(q.id)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-bold rounded-xl transition-all font-sans"
                  >
                    View
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
