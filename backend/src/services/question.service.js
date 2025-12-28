import prisma from "../config/database.js";

export async function listProductQuestions(productId) {
  return prisma.productQuestion.findMany({
    where: { productId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function listQuestionsForAdmin() {
  return prisma.productQuestion.findMany({
    include: {
      product: true,
      user: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function createQuestion(productId, userId, question) {
  return prisma.productQuestion.create({
    data: {
      productId,
      userId,
      question
    },
    include: {
      user: {
        select: { id: true, name: true, avatarUrl: true }
      }
    }
  });
}

export async function answerQuestion(questionId, answer) {
  return prisma.productQuestion.update({
    where: { id: questionId },
    data: {
      answer,
      answeredAt: new Date()
    },
    include: {
      product: true,
      user: { select: { id: true, name: true, email: true } }
    }
  });
}
