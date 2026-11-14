import type { RequestHandler } from "express";

import { getUserId } from "../../lib/request-user.js";

import {
  createTaskSchema,
  listTasksQuerySchema,
  taskIdSchema,
  updateTaskSchema,
} from "./task.schemas.js";

import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateTask,
} from "./task.service.js";

import { toTaskResponse } from "./task.types.js";

export const createTaskController: RequestHandler = async (
  req,
  res,
) => {
  const userId = getUserId(req);

  const input = createTaskSchema.parse(req.body);

  const task = await createTask(userId, input);

  res.status(201).json({
    data: toTaskResponse(task),
  });
};

export const listTasksController: RequestHandler = async (
  req,
  res,
) => {
  const userId = getUserId(req);

  const query = listTasksQuerySchema.parse(
    req.query,
  );

  const tasks = await listTasks(userId, query);

  res.status(200).json({
    data: tasks.map(toTaskResponse),
  });
};

export const getTaskController: RequestHandler = async (
  req,
  res,
) => {
  const userId = getUserId(req);

  const taskId = taskIdSchema.parse(req.params.id);

  const task = await getTask(userId, taskId);

  res.status(200).json({
    data: toTaskResponse(task),
  });
};

export const updateTaskController: RequestHandler = async (
  req,
  res,
) => {
  const userId = getUserId(req);

  const taskId = taskIdSchema.parse(req.params.id);

  const input = updateTaskSchema.parse(req.body);

  const task = await updateTask(
    userId,
    taskId,
    input,
  );

  res.status(200).json({
    data: toTaskResponse(task),
  });
};

export const deleteTaskController: RequestHandler = async (
  req,
  res,
) => {
  const userId = getUserId(req);

  const taskId = taskIdSchema.parse(req.params.id);

  await deleteTask(userId, taskId);

  res.status(204).send();
};