"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api from "../../../lib/api";
import { getErrorMessage } from "../../../lib/helpers";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
}

export default function QuestionsClient() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [filter, setFilter] = useState("pending");

  const loadQuestions = async () => {
    try {
      const response = await api.get("/api/admin/questions");
      setQuestions(response.data.data || []);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to load questions."));
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const pendingQuestions = useMemo(
    () => questions.filter((question) => !question.answer),
    [questions]
  );
  const answeredQuestions = useMemo(
    () => questions.filter((question) => question.answer),
    [questions]
  );
  const visibleQuestions = useMemo(() => {
    if (filter === "answered") return answeredQuestions;
    if (filter === "all") return questions;
    return pendingQuestions;
  }, [answeredQuestions, filter, pendingQuestions, questions]);

  const handleAnswer = async (id) => {
    const answer = (answers[id] || "").trim();
    if (!answer) {
      setErrorMessage("Answer is required.");
      return;
    }
    try {
      setErrorMessage("");
      setMessage("");
      await api.patch(`/api/admin/questions/${id}/answer`, { answer });
      setMessage("Answer saved.");
      loadQuestions();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to save answer."));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl text-ink">Product Questions</h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-pine">
            {[
              { key: "pending", label: `Pending (${pendingQuestions.length})` },
              { key: "answered", label: `Answered (${answeredQuestions.length})` },
              { key: "all", label: `All (${questions.length})` }
            ].map((item) => (
              <button
                key={item.key}
                className={filter === item.key ? "btn-primary" : "btn-outline"}
                onClick={() => setFilter(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button className="btn-outline" onClick={loadQuestions}>
            Refresh
          </button>
        </div>
      </div>
      {message ? <p className="text-xs uppercase tracking-[0.3em] text-pine">{message}</p> : null}
      {errorMessage ? <p className="text-sm text-rose">{errorMessage}</p> : null}

      <div className="space-y-4">
        {visibleQuestions.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-mist bg-white/70 p-6 text-sm text-pine">
            No questions to show.
          </div>
        ) : (
          visibleQuestions.map((question) => (
            <div key={question.id} className="glass-card rounded-3xl p-6 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-pine">Product</p>
                  <p className="text-sm text-ink">{question.product?.name}</p>
                  {question.product?.id ? (
                    <Link
                      href={`/admin/products/${question.product.id}/edit`}
                      className="text-xs uppercase tracking-[0.3em] text-pine hover:text-rose"
                    >
                      View product details
                    </Link>
                  ) : null}
                </div>
                <div className="text-right text-xs text-pine">
                  <p>{question.user?.name || "Customer"}</p>
                  <p>{question.user?.email}</p>
                  <p>{formatDate(question.createdAt)}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-mist bg-white/80 p-4 text-sm text-pine">
                {question.question}
              </div>
              {question.answer ? (
                <div className="rounded-2xl border border-mist bg-white/80 p-4 text-sm text-ink">
                  <p className="text-xs uppercase tracking-[0.3em] text-pine">Answer</p>
                  <p>{question.answer}</p>
                  {question.answeredAt ? (
                    <p className="mt-2 text-xs text-pine">
                      Answered on {formatDate(question.answeredAt)}
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={answers[question.id] || ""}
                    onChange={(event) => setAnswers((prev) => ({ ...prev, [question.id]: event.target.value }))}
                    placeholder="Write an answer for the customer..."
                    className="min-h-[110px] w-full rounded-2xl border border-mist bg-white/80 px-4 py-3 text-sm text-ink"
                  />
                  <button className="btn-primary" onClick={() => handleAnswer(question.id)}>
                    Send Answer
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
