import "./lib/xhr.js";
import "./db/index";
import "./controller";
import * as tokenizer from "./lib/tokenizer";
import * as injector from "./injector";

injector.init();
tokenizer.init();
