import { vol } from "memfs";
import nock from "nock";
import { BrowserCompatibleUrlResolver, FsParser, SubParser, SubResolver } from "../../../src";
import { defaultContext } from "../../utils";

// Debug.enable("resolverengine:main,resolverengine:urlresolver2,resolverengine:fsparser");
console.log("DUPA");

describe("UrlResolver", function() {
  let instance: SubResolver;
  let contentsResolver: SubParser<string>;

  beforeAll(function() {
    console.log(instance, contentsResolver);
    nock.disableNetConnect();
    contentsResolver = FsParser();
  });

  beforeEach(function() {
    instance = BrowserCompatibleUrlResolver();
  });

  afterEach(function() {
    vol.reset();
    // expect(nock.isDone()).toBe(true);
  });

  it("DELETE THIS LATER, OKAY?", () => {
    expect(true).toBeTruthy();
  });

  it("returns null on non-urls", async function() {
    vol.fromJSON({
      "relative/path.file": "wrong",
    });

    expect(await instance("relative/path.file", defaultContext("test"))).toBeNull();
  });

  it("downloads the file", async function() {
    const CONTENTS = "<HTML><HEAD><TITLE>Success</TITLE></HEAD><BODY>Success</BODY></HTML>\n";
    nock("http://captive.apple.com:80")
      .get("/")
      .reply(200, CONTENTS);

    const resolved_url: string = (await instance("http://captive.apple.com/", defaultContext("test")))!; // mind the exclamation mark
    expect(resolved_url).not.toBeNull();
    // console.log(resolved_url);
    console.log("kurwa mać", resolved_url);
    const contents = await contentsResolver(resolved_url);
    expect("DUPA".toLowerCase()).toEqual("dupa");
    console.log("Got contents", contents, CONTENTS);
    // (global as any).asyncDump();
    expect(contents).toEqual(CONTENTS);
    console.log("DONE?");
  });

  it("throws on network error", async function() {
    const ERROR = "test error";
    nock("http://somewebsite.com:80")
      .get("/")
      .replyWithError(ERROR);

    await expect(instance("http://somewebsite.com", defaultContext("test"))).rejects.toThrowError(ERROR);
  });

  it("throws on failure code", async function() {
    nock("http://somewebsite.com:80")
      .get("/")
      .reply(404);

    await expect(instance("http://somewebsite.com", defaultContext("test"))).rejects.toThrow();
  });
});
