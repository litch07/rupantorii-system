import {
  answerQuestion,
  createQuestion,
  listProductQuestions,
  listQuestionsForAdmin
} from "../services/question.service.js";

export async function listQuestions(req, res, next) {
  try {
    const questions = await listProductQuestions(req.params.id);
    return res.json({ data: questions });
  } catch (error) {
    return next(error);
  }
}

export async function createQuestionHandler(req, res, next) {
  try {
    const question = await createQuestion(req.params.id, req.user.sub, req.body.question);
    return res.status(201).json(question);
  } catch (error) {
    return next(error);
  }
}

export async function listQuestionsAdmin(req, res, next) {
  try {
    const questions = await listQuestionsForAdmin();
    return res.json({ data: questions });
  } catch (error) {
    return next(error);
  }
}

export async function answerQuestionHandler(req, res, next) {
  try {
    const question = await answerQuestion(req.params.id, req.body.answer);
    return res.json(question);
  } catch (error) {
    return next(error);
  }
}
