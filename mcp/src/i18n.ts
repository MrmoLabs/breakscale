import { setLocale } from '../../src/i18n';

/* ------------------------------------------------------------------ *
 * Language selection for the MCP server.
 *
 * Every tool takes an optional `language` parameter ('en' | 'zh'). When it
 * is absent, BREAKSCALE_LANG decides (so `BREAKSCALE_LANG=zh npx
 * breakscale-mcp --stdio` speaks Chinese throughout), and English is the
 * fallback. setLocale is called per tool call: the HTTP server is
 * stateless and handles one request at a time, and stdio processes calls
 * sequentially, so a per-call set never leaks between answers.
 * ------------------------------------------------------------------ */

export type Lang = 'en' | 'zh';

/** What BREAKSCALE_LANG asks for, or English. */
export function defaultLang(): Lang {
  return process.env.BREAKSCALE_LANG === 'zh' ? 'zh' : 'en';
}

/** Set the locale for this tool call, from the argument or the environment. */
export function applyLang(arg: Lang | undefined): void {
  setLocale(arg ?? defaultLang());
}
