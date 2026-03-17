#!/usr/bin/env node
import { stripVTControlCharacters, styleText } from "node:util";
import { join } from "node:path";
//#region ../node_modules/.pnpm/mri@1.2.0/node_modules/mri/lib/index.mjs
function toArr(any) {
	return any == null ? [] : Array.isArray(any) ? any : [any];
}
function toVal(out, key, val, opts) {
	var x, old = out[key], nxt = !!~opts.string.indexOf(key) ? val == null || val === true ? "" : String(val) : typeof val === "boolean" ? val : !!~opts.boolean.indexOf(key) ? val === "false" ? false : val === "true" || (out._.push((x = +val, x * 0 === 0) ? x : val), !!val) : (x = +val, x * 0 === 0) ? x : val;
	out[key] = old == null ? nxt : Array.isArray(old) ? old.concat(nxt) : [old, nxt];
}
function lib_default(args, opts) {
	args = args || [];
	opts = opts || {};
	var k, arr, arg, name, val, out = { _: [] };
	var i = 0, j = 0, idx = 0, len = args.length;
	const alibi = opts.alias !== void 0;
	const strict = opts.unknown !== void 0;
	const defaults = opts.default !== void 0;
	opts.alias = opts.alias || {};
	opts.string = toArr(opts.string);
	opts.boolean = toArr(opts.boolean);
	if (alibi) for (k in opts.alias) {
		arr = opts.alias[k] = toArr(opts.alias[k]);
		for (i = 0; i < arr.length; i++) (opts.alias[arr[i]] = arr.concat(k)).splice(i, 1);
	}
	for (i = opts.boolean.length; i-- > 0;) {
		arr = opts.alias[opts.boolean[i]] || [];
		for (j = arr.length; j-- > 0;) opts.boolean.push(arr[j]);
	}
	for (i = opts.string.length; i-- > 0;) {
		arr = opts.alias[opts.string[i]] || [];
		for (j = arr.length; j-- > 0;) opts.string.push(arr[j]);
	}
	if (defaults) for (k in opts.default) {
		name = typeof opts.default[k];
		arr = opts.alias[k] = opts.alias[k] || [];
		if (opts[name] !== void 0) {
			opts[name].push(k);
			for (i = 0; i < arr.length; i++) opts[name].push(arr[i]);
		}
	}
	const keys = strict ? Object.keys(opts.alias) : [];
	for (i = 0; i < len; i++) {
		arg = args[i];
		if (arg === "--") {
			out._ = out._.concat(args.slice(++i));
			break;
		}
		for (j = 0; j < arg.length; j++) if (arg.charCodeAt(j) !== 45) break;
		if (j === 0) out._.push(arg);
		else if (arg.substring(j, j + 3) === "no-") {
			name = arg.substring(j + 3);
			if (strict && !~keys.indexOf(name)) return opts.unknown(arg);
			out[name] = false;
		} else {
			for (idx = j + 1; idx < arg.length; idx++) if (arg.charCodeAt(idx) === 61) break;
			name = arg.substring(j, idx);
			val = arg.substring(++idx) || i + 1 === len || ("" + args[i + 1]).charCodeAt(0) === 45 || args[++i];
			arr = j === 2 ? [name] : name;
			for (idx = 0; idx < arr.length; idx++) {
				name = arr[idx];
				if (strict && !~keys.indexOf(name)) return opts.unknown("-".repeat(j) + name);
				toVal(out, name, idx + 1 < arr.length || val, opts);
			}
		}
	}
	if (defaults) {
		for (k in opts.default) if (out[k] === void 0) out[k] = opts.default[k];
	}
	if (alibi) for (k in out) {
		arr = opts.alias[k] || [];
		while (arr.length > 0) out[arr.shift()] = out[k];
	}
	return out;
}
//#endregion
//#region package.json
var name = "rimelight-cli";
var description = "A CLI utility for configuration synchronization across multiple projects.";
var author = {
	"name": "Daniel Marchi",
	"email": "danielmarchi@danielmarchi.dev",
	"url": "https://danielmarchi.dev"
};
var version = "1.0.0";
//#endregion
//#region src/utils/help.ts
function toLines(value) {
	if (!value) return [];
	return Array.isArray(value) ? [...value] : [value];
}
function visibleLength(value) {
	return stripVTControlCharacters(value).length;
}
function padVisible(value, width) {
	const padding = Math.max(0, width - visibleLength(value));
	return `${value}${" ".repeat(padding)}`;
}
function renderRows(rows) {
	if (rows.length === 0) return [];
	const labelWidth = Math.max(...rows.map((row) => visibleLength(row.label)));
	const output = [];
	for (const row of rows) {
		const descriptionLines = toLines(row.description);
		if (descriptionLines.length === 0) {
			output.push(`  ${row.label}`);
			continue;
		}
		const [firstLine, ...rest] = descriptionLines;
		output.push(`  ${padVisible(row.label, labelWidth)}  ${firstLine}`);
		for (const line of rest) output.push(`  ${" ".repeat(labelWidth)}  ${line}`);
	}
	return output;
}
function heading(label, color) {
	if (!color) return `${label}:`;
	return label === "Usage" ? styleText("bold", `${label}:`) : styleText(["blue", "bold"], `${label}:`);
}
function renderCliDoc(doc, options = {}) {
	const color = options.color ?? true;
	const output = [];
	if (doc.usage) {
		const usage = color ? styleText("bold", doc.usage) : doc.usage;
		output.push(`${heading("Usage", color)} ${usage}`);
	}
	const summaryLines = toLines(doc.summary);
	if (summaryLines.length > 0) {
		if (output.length > 0) output.push("");
		output.push(...summaryLines);
	}
	for (const section of doc.sections) {
		if (output.length > 0) output.push("");
		output.push(heading(section.title, color));
		const lines = toLines(section.lines);
		if (lines.length > 0) output.push(...lines);
		if (section.rows && section.rows.length > 0) output.push(...renderRows(section.rows));
	}
	if (doc.documentationUrl) {
		if (output.length > 0) output.push("");
		output.push(`${heading("Documentation", color)} ${doc.documentationUrl}`);
	}
	output.push("");
	return output.join("\n");
}
//#endregion
//#region src/utils/constants.ts
const PROJECT_ROOT = process.cwd();
const CLI_ROOT = import.meta.dirname.endsWith("utils") ? join(import.meta.dirname, "../..") : join(import.meta.dirname, "..");
const IS_SELF = CLI_ROOT === PROJECT_ROOT;
const TEMPLATES_ROOT = join(CLI_ROOT, "templates");
/**
* The directory where necessary object copies go for programmatic merging.
*/
const TEMPLATES_DIR = ".rimelight";
/**
* Workspace synchronization rules grouped by category.
*/
const SYNC_GROUPS = {
	config: [
		{
			mode: "overwrite",
			source: "pnpm-workspace.yaml"
		},
		{
			mode: "overwrite",
			source: "gitignore.template",
			destinations: ".gitignore"
		},
		{
			mode: "overwrite",
			source: "editorconfig.template",
			destinations: ".editorconfig"
		},
		{
			mode: "overwrite",
			source: ".oxlint"
		},
		{
			mode: "overwrite",
			source: "tsconfig.json"
		},
		{
			mode: "overwrite",
			source: "vue-i18n-extract.config.js"
		},
		{
			mode: "merge",
			source: "rimelight.vite.ts",
			patch: {
				target: "nuxt.config.ts",
				key: "vite",
				importName: "rimelightViteConfig"
			}
		}
	],
	agent: [{
		mode: "overwrite",
		source: "AGENTS.md",
		destinations: [
			{
				path: ["AGENTS.md", ".agents/AGENTS.md"],
				replace: { "./.agent": "./.agents" }
			},
			{
				path: ["GEMINI.md", ".gemini/GEMINI.md"],
				replace: { "./.agent": "./.gemini" }
			},
			{
				path: ["ANTIGRAVITY.md", ".antigravity/ANTIGRAVITY.md"],
				replace: { "./.agent": "./.antigravity" }
			},
			{
				path: ["CLAUDE.md", ".claude/CLAUDE.md"],
				replace: { "./.agent": "./.claude" }
			},
			{
				path: [
					"CURSOR.md",
					".cursor/CURSOR.md",
					".cursorrules"
				],
				replace: { "./.agent": "./.cursor" }
			}
		]
	}, {
		mode: "overwrite",
		source: ".agent",
		destinations: [
			".agents",
			".gemini",
			".claude",
			".antigravity",
			".cursor"
		]
	}]
};
//#endregion
//#region src/utils/terminal.ts
function log(message) {
	console.log(message);
}
function accent(text) {
	return styleText("blue", text);
}
function success(text) {
	return styleText("green", text);
}
function infoMsg(msg) {
	console.log(styleText(["blue", "bold"], "info:"), msg);
}
function warnMsg(msg) {
	console.error(styleText(["yellow", "bold"], "warn:"), msg);
}
function errorMsg(msg) {
	console.error(styleText(["red", "bold"], "error:"), msg);
}
//#endregion
//#region src/bin.ts
async function main() {
	let args = process.argv.slice(2);
	if (args[0] === "help" && args[1]) args = [
		args[1],
		"--help",
		...args.slice(2)
	];
	if (args.includes("--version") || args.includes("-v")) args = ["version"];
	const parsed = lib_default(args, {
		boolean: ["help", ...Object.keys(SYNC_GROUPS)],
		alias: { h: "help" }
	});
	const command = parsed._[0];
	if (!command || parsed.help) {
		if (command === "sync") {
			log(renderCliDoc({
				usage: `${name} sync [options]`,
				summary: "Synchronize workspace templates and configurations",
				sections: [{
					title: "Options",
					rows: Object.keys(SYNC_GROUPS).map((group) => ({
						label: accent(`--${group}`),
						description: `Sync ${group}`
					}))
				}]
			}));
			process.exit(0);
		}
		log(renderCliDoc({
			usage: `${name} <command> [options]`,
			summary: `${name} v${version} - ${description}`,
			sections: [{
				title: "Commands",
				rows: [{
					label: accent("sync"),
					description: "Synchronize workspace templates and configurations"
				}, {
					label: accent("version"),
					description: "Show version information"
				}]
			}, {
				title: "Options",
				rows: [{
					label: accent("--help, -h"),
					description: "Show help for command"
				}, {
					label: accent("--version, -v"),
					description: "Show version"
				}]
			}]
		}));
		process.exit(0);
	}
	try {
		if (command === "sync") {
			const { run } = await import("./sync-D3ze2SCi.js");
			await run(parsed);
		} else if (command === "version") {
			const { run } = await import("./version-D1R5tiV1.js");
			await run();
		} else {
			errorMsg(`Unknown command: ${command}`);
			process.exit(1);
		}
	} catch (err) {
		errorMsg(err.message || String(err));
		process.exit(1);
	}
}
main().catch((err) => {
	errorMsg(err.message || String(err));
	process.exit(1);
});
//#endregion
export { warnMsg as a, SYNC_GROUPS as c, renderCliDoc as d, author as f, version as h, success as i, TEMPLATES_DIR as l, name as m, infoMsg as n, IS_SELF as o, description as p, log as r, PROJECT_ROOT as s, accent as t, TEMPLATES_ROOT as u };
