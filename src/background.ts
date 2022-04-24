import "./lib/xhr.js";
import "./db/index";
import { init } from "./lib/tokenizer";
import { injectScript } from "./inject";

init();
injectScript();
