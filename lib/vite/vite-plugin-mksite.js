import { globby } from "globby";
import path from "path";
import DeepProxy from "proxy-deep";
import { getHash, toHast } from '../helpers.js'

const _context = {
  pages: {
    "/about/index.html": {
      id: "sha hash",
      data: {
        title: "About",
        lang: "en",
        dirName: "about",
        path: "/about/"
        /*
        ancestors: Proxy()
        parent: Proxy()
        children: Proxy()
        */
      },
      ancestors: ["index.html"],
      parent: "index.html",
      isDocumentTemplate: false,
      documentTemplate: "/index.html",
      tagTemplates: new Map([["title", "{{title}} | John Loy"], []]),
      getData() {}
    },
    "/index.html": {
      id: "/index.html",
      hash: "sha hash",
      data: {
        title: "John Loy"
        /*
        children: Proxy()
        */
      },
      children: [
        "/about/index.html",
        "/projects/index.html",
        "/stream/index.html",
        "/toolkit/index.html"
      ],
      isDocumentTemplate: false
    }
  },
  components: {},
  astCache: {}
};


const initializeContext = (paths) => {
  paths = paths.map(id => `/${id}`)
  const pages = paths.reduce((accum, id) => {
    if (id === "/index.html") {
      const others = paths.slice(1);
      const descendants = others
      const ancestors = []
      const parent = []
      const siblings = others.filter((p) => !p.includes("/"))
      const relationProps = {
        descendants,
        ancestors,
        parent,
        siblings
      }
      accum[id] = {
        id,
        data: {
          ...relationProps
        },
        ...relationProps
      };
    } else {
      const pathsWithoutRoot = paths.slice(1);
      const dirname = path.dirname(id);
      const index = pathsWithoutRoot.indexOf(id);
      const others = pathsWithoutRoot.splice(index, 1);
      const possibleDescendants = pathsWithoutRoot.slice(index);
      const descendants = possibleDescendants.filter((otherId) =>
        otherId.startsWith(dirname)
      );
      const possibleAncestors = pathsWithoutRoot.slice(0, index);
      const ancestors = possibleAncestors
        .filter((otherId) => id.startsWith(path.dirname(otherId)))
        .reverse()
        .concat("/index.html");
      const parent = ancestors.at(0);
      const siblings = pathsWithoutRoot.filter(
        (otherId) =>
          path.dirname(path.dirname(id)) === path.dirname(path.dirname(otherId))
      );
      const relationProps = {
        descendants,
        ancestors,
        parent,
        siblings
      }
      accum[id] = {
        id,
        data: {
          ...relationProps
        },
        ...relationProps
      };
    }
    return accum;
  }, {});

  const ctxObj = {
    pages,
    astCache: {},
    components: {}
  }

  return DeepProxy(ctxObj, {
    get(target, prop) {
      // console.log(prop)
      const val = Reflect.get(target, prop);
      const pathParent = this.path.at(-1);
      const isRelationAccess =
        ["ancestors", "parent", "descendants", "siblings"].includes(
          pathParent
        ) && prop !== "data";

      const isRelationListAccess = [
        "ancestors",
        "parent",
        "descendants",
        "siblings"
      ].includes(prop);

      if (
        isRelationAccess ||
        isRelationListAccess ||
        (typeof val === "object" && val !== null)
      ) {
        if (isRelationListAccess) {
          const relationList = Reflect.get(target, prop)
          return relationList ? relationList.map((relationId) =>
            this.nest(this.rootTarget[relationId])
          ) : relationList;
        }

        if (isRelationAccess) {
          const relationName = Reflect.get(target, prop);
          const relationObj = Reflect.get(this.rootTarget, relationName);
          return this.nest(relationObj);
        }

        return this.nest(val);
      } else {
        return val;
      }
    }
  });
};


/*
Is the current file in the astCache?
If YES, then use it.
if NO, then parse AST.
Does the title tag for the current page have a no-template attribute?
If YES, then stop.
Is any ancestor's title a title template?
If YES, then get the template string.

What is available?
- page data
  - document template
  - title template
  - document template head data
- build context data
- components

Transforms:
- Merge
  - Render head template tags (e.g. title)
  - Merge document template head
  - Render replacements
- Render components
- Insert design tokens
- Insert critical CSS
  - for site
  - for page
  - for components
- convert filename to index.html
- lint
- (vite) add modulepreloads

*/

const updateContext = async (mksiteContext, pathname, html) => {
  // const hash = getHash(html)
  if (!(pathname in mksiteContext.astCache)) {
    const ast = await toHast(html)
    mksiteContext.astCache[pathname] = ast
  }
  // get the page's document template
  // is the current page a document template?
  // if not, for each ancestor, is that a document template? (parse to ast)
  // when found, save documentTemplate property
  console.log(ast)
  console.log('updateContext', pathname)

}


export const mksitePlugin = () => {
  let mksiteContext
  return {
    name: "mksite",
    enforce: "pre",
    async buildStart(inputOptions) {
      const srcDir = path.join(process.cwd(), "src");
      const paths = await globby("**/*.html", { cwd: srcDir });
      mksiteContext = initializeContext(paths);
    },
    resolveId(source, importer, options) {
      // const { pathname } = new URL(source, "file://");
      // if (pathname.endsWith(".html")) {
      //   updateContext(mksiteContext, pathname)
      // }
    },
    load(id) {
      console.log(id)
    },
    async transformIndexHtml(html, ctx) {
      updateContext(mksiteContext, ctx.path, html)

      // const html = args[0]
      // console.log(ctx.server.moduleGraph)
      // return html.replace(
      //   /<title[^>]*>(.*?)<\/title>/,
      //   `<title>Title replaced!</title>`
      // );
    }
  };
};
