import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error: any) {
    console.error("GET /api/users 오류:", error);

    return NextResponse.json(
      {
        message: "사용자 목록 조회 오류",
        name: error?.name ?? null,
        code: error?.code ?? null,
        detail: error?.message ?? String(error),
        meta: error?.meta ?? null,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();

    if (!email) {
      return NextResponse.json(
        { message: "email은 필수입니다." },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name: name || null,
        email,
      },
    });

    return NextResponse.json(
      {
        message: "사용자 등록 성공",
        user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/users 오류:", error);

    if (error?.code === "P2002") {
      return NextResponse.json(
        {
          message: "이미 등록된 이메일입니다.",
          code: error.code,
          detail: error.message,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        message: "사용자 등록 오류",
        name: error?.name ?? null,
        code: error?.code ?? null,
        detail: error?.message ?? String(error),
        meta: error?.meta ?? null,
      },
      { status: 500 }
    );
  }
}
