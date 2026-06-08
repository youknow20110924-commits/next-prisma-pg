"use client";

import { useEffect, useState } from "react";

type Post = {
  id: number;
  title: string;
  content: string | null;
  published: boolean;
  createdAt?: string;
  authorId: number;
};

type User = {
  id: number;
  email: string;
  name: string | null;
  createdAt?: string;
  posts?: Post[];
};

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadUsers() {
    try {
      const response = await fetch("/api/users", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || data.message || "사용자 목록 조회 실패");
        return;
      }

      setUsers(data);
    } catch (error) {
      console.error(error);
      setMessage("사용자 목록 조회 중 오류가 발생했습니다.");
    }
  }

  async function createUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setMessage("이메일을 입력하세요.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || data.message || "사용자 등록 실패");
        return;
      }

      setName("");
      setEmail("");
      setMessage("사용자 등록 완료");

      await loadUsers();
    } catch (error) {
      console.error(error);
      setMessage("사용자 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-lg">
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          사용자 관리
        </h1>
        <p className="mt-3 text-slate-600">
          Next.js + TypeScript + PostgreSQL + Prisma 등록/조회 화면입니다.
        </p>
      </div>

      <form onSubmit={createUser} className="mt-8 rounded-xl border p-6">
        <h2 className="text-xl font-semibold text-slate-900">사용자 등록</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              이름
            </label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="예: 홍길동"
              className="w-full rounded-lg border px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              이메일
            </label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="예: hong@example.com"
              className="w-full rounded-lg border px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-slate-400"
          >
            {loading ? "등록 중..." : "사용자 등록"}
          </button>

          <button
            type="button"
            onClick={loadUsers}
            disabled={loading}
            className="rounded-lg bg-slate-800 px-5 py-3 font-semibold text-white hover:bg-slate-900 disabled:bg-slate-400"
          >
            목록 새로고침
          </button>
        </div>

        {message && (
          <div className="mt-4 rounded-lg bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            {message}
          </div>
        )}
      </form>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">사용자 목록</h2>
          <span className="text-sm text-slate-500">총 {users.length}명</span>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border">
          <table className="w-full border-collapse text-left">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                  ID
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                  이름
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                  이메일
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                  게시글 수
                </th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    등록된 사용자가 없습니다.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-4 py-3 text-slate-700">{user.id}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {user.name || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{user.email}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {user.posts?.length ?? 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
