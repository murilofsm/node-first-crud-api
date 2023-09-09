// import { createServer } from "node:http";

// const server = createServer((request, response) => {
//     response.write('oi');
//     return response.end();
// });

// localhost:3333
// server.listen(3333);

// POST localhost:3333/videos
// DELETE localhost:3333/videos/1

// GET, busca de informação
// POST, criar um registro
// PUT, alteração
// DELETE, exclusão
// PATCH, alterar algo pequeno exemplo: alterar algo de publico para privado

import { fastify } from "fastify";
// import { DatabaseMemory } from "./database_memory.js";
import { DatabasePostgres } from "./database-postges.js";

const server = fastify();

// const database = new DatabaseMemory();

const database = new DatabasePostgres();

// Request Body

server.get("/", () => {
  console.log("server ok");
});

server.post("/videos", async (request, reply) => {
  const { title, description, duration } = request.body;

  await database.create({
    title,
    description,
    duration,
  });
  console.log(database.list());

  return reply.status(201).send();
});

server.get("/videos", async (request) => {
  const search = request.query.search;

  const videos = await database.list(search);

  console.log(videos);

  return videos;
});

// Route Parameter

server.put("/videos/:id", async(request, reply) => {
  const videoId = request.params.id;

  const { title, description, duration } = request.body;

  await database.update(videoId, {
    title,
    description,
    duration,
  });

  return reply.status(204).send();
});

server.delete("/videos/:id", async(request, reply) => {
  const videoId = request.params.id;

  await database.delete(videoId);

  return reply.status(204).send();
});

server.listen({
  port: process.env.PORT ?? 3333,
});
