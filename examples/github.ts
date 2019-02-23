import { ResolverEngine } from "@resolver-engine/core";
import { parsers, resolvers } from "@resolver-engine/imports";

const resolver = new ResolverEngine<string>({ debug: true })
  .addParser(parsers.UrlParser())
  .addResolver(resolvers.GithubResolver());

resolver.require("github:crypto-punkers/resolver-engine/examples/github.ts").then(console.log);
