import { d as renderCliDoc, f as author, h as version, m as name, p as description, t as accent } from "./bin.js";
//#region src/commands/version.ts
async function run() {
	console.log(renderCliDoc({
		summary: `${name} v${version}`,
		sections: [{
			title: "Environment",
			rows: [
				{
					label: accent("CLI Version"),
					description: `v${version}`
				},
				{
					label: accent("Description"),
					description
				},
				{
					label: accent("Author"),
					description: typeof author === "string" ? author : author.name
				}
			]
		}]
	}));
}
//#endregion
export { run };
