import "./lib/xhr.js";
import "./db/index";
import * as tokenizer from "./lib/tokenizer";
import * as injector from "./injector";

injector.init();
tokenizer.init();
