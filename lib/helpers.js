import rehypeParse from "rehype-parse";
import { unified } from "unified";
import { createHash } from "crypto";

export const getHash = (data) =>
  createHash("sha1").update(data).digest("base64");

export const toHast = async (htmlStr) => {
  const vfile = await unified()
    .use(rehypeParse, {
      fragment: true,
      emitParseErrors: true
    })
    .use(function collectAstWithErrors() {
      this.Compiler = compiler;
      function compiler(tree, vfile) {
        const parseErrorMessage = vfile.messages.find(
          (m) => m.source && m.source === "parse-error"
        );
        if (parseErrorMessage) {
          const error = new Error("HTML parse error");
          error.vfileMessage = parseErrorMessage;
          throw error;
        }
        return tree;
      }
    })
    .process(htmlStr);
  return vfile.result;
};
