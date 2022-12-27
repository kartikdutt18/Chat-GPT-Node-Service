import { oraPromise } from 'ora';
import { ChatGPTAPIBrowser } from 'chatgpt'

import express from 'express';
const app = express()
const port = 3000
let api = undefined;

const authenticateUser = async () => {
  const email = "a@gmail.com"
  const password = "a"

  const api = new ChatGPTAPIBrowser({
    email,
    password,
    debug: false,
    minimize: true,
    isGoogleLogin: true
  })
  await api.initSession()
  return api;
}

const getResponse = async (api: typeof ChatGPTAPIBrowser, prompt: string) => {
  const res = await oraPromise((api as any).sendMessage(prompt), {
    text: prompt
  })

  return res;
}

const restartSession = async (api: typeof ChatGPTAPIBrowser | undefined) => {
  if (api) {
    await (api as any).closeSession();
  }

  return authenticateUser();
}

app.get('/restart', async function(req, res){
  api = await restartSession(api);
  res.send('Restarted api');
});

app.get('/get-Dall-E-prompt', async function(req, res){
  if (!api) {
    api = await restartSession(api);
  }

  const response = await getResponse(api, "Generate a futuristic  DALL-E prompt for " + 
  req.query.prompt + " without words in image")
  res.send(response);
});

app.get('/get-titles', async function(req, res){
  if (!api) {
    api = await restartSession(api);
  }

  const response = await getResponse(api, "Write poster quotes for " + 
  req.query.prompt + " in 30 words")
  res.send(response);
});

app.listen(port, () => {
  console.log(`Chat GPT bot listening on port ${port}`)
})