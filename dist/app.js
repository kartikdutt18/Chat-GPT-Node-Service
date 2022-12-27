"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ora_1 = require("ora");
const chatgpt_1 = require("chatgpt");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
let api = undefined;
const authenticateUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const email = "designerdholki2@gmail.com";
    const password = "Asdfghjkl2";
    const api = new chatgpt_1.ChatGPTAPIBrowser({
        email,
        password,
        debug: false,
        minimize: true,
        isGoogleLogin: true
    });
    yield api.initSession();
    return api;
});
const getResponse = (api, prompt) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield (0, ora_1.oraPromise)(api.sendMessage(prompt), {
        text: prompt
    });
    return res;
});
const restartSession = (api) => __awaiter(void 0, void 0, void 0, function* () {
    if (api) {
        yield api.closeSession();
    }
    return authenticateUser();
});
app.get('/restart', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        api = yield restartSession(api);
        res.send('Restarted api');
    });
});
app.get('/get-Dall-E-prompt', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!api) {
            api = yield restartSession(api);
        }
        const response = yield getResponse(api, "Generate a futuristic  DALL-E prompt for " +
            req.query.prompt + " without words in image");
        res.send(response);
    });
});
app.get('/get-titles', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!api) {
            api = yield restartSession(api);
        }
        const response = yield getResponse(api, "Write poster quotes for " +
            req.query.prompt + " in 30 words");
        res.send(response);
    });
});
app.listen(port, () => {
    console.log(`Chat GPT bot listening on port ${port}`);
});
//# sourceMappingURL=app.js.map