"use client";
import React, { useState } from "react";
import {
  MessageSquare, Clock, CheckCircle2, Search, Send, X
} from "lucide-react";
import { cn } from "@/lib/utils";

import axiosSecure from "@/lib/axiosSecure";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

type QuestionStatus = "pending" | "answered";

interface ApiQuestion {
  id: string;
  userId: {
    id: string;
    name: string;
    email: string;
  };
  userRole?: "SISTER" | "BROTHER";
  question: string;
  imageUrl?: string;
  status: QuestionStatus;
  createdAt: string;
  updatedAt: string;
  answers?: {
    text: string;
    createdAt: string;
    isActive: boolean;
  }[];
}

type FilterTab = "All" | "Pending" | "Answered";
type RoleFilter = "All" | "BROTHER" | "SISTER";

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
  question: ApiQuestion;
  onClose: () => void;
  onSubmit: (id: string, answer: string) => void;
}) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      await axiosSecure.patch(`/ask-question/${question.id}/answer`, { answer: answer.trim() });
      toast.success("Question answered successfully");
      onSubmit(question.id, answer.trim());
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to submit answer");
    } finally {
      setLoading(false);
    }
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
              <p className="text-sm font-bold text-slate-800 mt-0.5">
                {question.userId?.name || "Unknown User"} 
                {question.userRole && (
                  <span className={cn(
                    "ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider align-middle",
                    question.userRole === "BROTHER" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600"
                  )}>
                    {question.userRole}
                  </span>
                )}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{question.userId?.email || "No email"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Date Submitted</p>
              <p className="text-sm font-semibold text-slate-700 mt-0.5">{new Date(question.createdAt).toLocaleDateString()}</p>
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
            disabled={!answer.trim() || loading}
            className="flex-1 py-3.5 text-sm font-semibold bg-[#C4A052] text-white rounded-2xl hover:bg-[#A8873A] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {loading ? "Sending..." : "Send Answer"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────── */
export default function AskImamPage() {
  const [questions, setQuestions] = useState<ApiQuestion[]>([]);
  const [filter, setFilter] = useState<FilterTab>("All");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("All");
  const [search, setSearch] = useState("");
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuestionsCount, setTotalQuestionsCount] = useState(0);

  const limit = 10;

  const fetchQuestions = React.useCallback(async (page: number) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit };
      if (search) params.searchTerm = search;
      if (filter === "Pending") params.status = "pending";
      if (filter === "Answered") params.status = "answered";
      if (roleFilter !== "All") params.userRole = roleFilter;

      const res = await axiosSecure.get("/ask-question", { params });
      setQuestions(res.data.data.data || res.data.data || []);
      setTotalPages(res.data.data.meta?.totalPages || res.data.meta?.totalPages || 1);
      setTotalQuestionsCount(res.data.data.meta?.total || res.data.meta?.total || 0);
    } catch {
      toast.error("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  }, [search, filter, roleFilter]);

  React.useEffect(() => {
    fetchQuestions(currentPage);
  }, [fetchQuestions, currentPage]);

  const answeringQuestion = questions.find(q => q.id === answeringId) ?? null;

  const handleSubmitAnswer = () => {
    fetchQuestions(currentPage);
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<MessageSquare className="h-6 w-6 text-[#C4A052]" />}
          value={totalQuestionsCount}
          label="Total Questions"
          color="bg-[#F4EFE6]"
        />
        {/* Currently dynamic stats for pending/answered are based on filter or overall total if available */}
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
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <div className="flex items-center gap-1.5 bg-[#FAF7F2] border border-[#E0D4BC] p-1 rounded-xl">
            {(["All", "BROTHER", "SISTER"] as RoleFilter[]).map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setRoleFilter(tab);
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider font-sans",
                  roleFilter === tab
                    ? "bg-[#C4A052] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-[#F4EFE6]"
                )}
              >
                {tab === "All" ? "All Genders" : tab}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-1.5">
            {(["All", "Pending", "Answered"] as FilterTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setFilter(tab);
                  setCurrentPage(1);
                }}
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
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#EAE3D5] rounded-2xl shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1.5fr_1fr_2fr_1fr_1fr_120px] bg-[#FAF7F2] border-b border-[#EAE3D5] px-6 py-3">
          {["User", "Role", "Question", "Date", "Status", "Action"].map(h => (
            <div key={h} className="text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">{h}</div>
          ))}
        </div>

        {/* Rows */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="h-12 w-12 border-4 border-[#C4A052] border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 font-cinzel tracking-widest uppercase text-sm">Loading Questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-16 text-slate-400 font-sans text-sm">
            No questions found.
          </div>
        ) : (
          questions.map((q, i) => (
            <div
              key={q.id}
              className={cn(
                "grid grid-cols-[1.5fr_1fr_2fr_1fr_1fr_120px] px-6 py-4 items-center gap-2",
                i !== questions.length - 1 && "border-b border-[#F0EBE1]",
                "hover:bg-[#FDFAF6] transition-colors"
              )}
            >
              {/* User */}
              <div className="min-w-0 pr-2 flex flex-col justify-center">
                <p className="text-sm font-bold text-slate-800 truncate">{q.userId?.name || "Anonymous"}</p>
                <p className="text-xs text-slate-400 font-sans truncate">{q.userId?.email || "No email"}</p>
              </div>

              {/* Role */}
              <div>
                {q.userRole ? (
                  <span className={cn(
                    "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                    q.userRole === "BROTHER" ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-pink-50 text-pink-600 border border-pink-100"
                  )}>
                    {q.userRole}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 italic">None</span>
                )}
              </div>

              {/* Question */}
              <div className="min-w-0 pr-4">
                <p className="text-sm text-slate-600 font-sans line-clamp-2 leading-relaxed">
                  {q.question}
                </p>
              </div>

              {/* Date */}
              <div>
                <p className="text-sm text-slate-500 font-sans">{new Date(q.createdAt).toLocaleDateString()}</p>
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

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 py-8 border-t border-slate-100 bg-[#FAF7F2]">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-2xl bg-white border border-[#EAE3D5] text-slate-400 hover:text-[#C4A052] hover:border-[#C4A052] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "h-10 w-10 rounded-xl text-sm font-bold transition-all",
                    currentPage === i + 1
                      ? "bg-[#C4A052] text-white shadow-lg shadow-[#C4A052]/20"
                      : "bg-white border border-[#EAE3D5] text-slate-500 hover:border-[#C4A052] hover:text-[#C4A052]"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-3 rounded-2xl bg-white border border-[#EAE3D5] text-slate-400 hover:text-[#C4A052] hover:border-[#C4A052] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
