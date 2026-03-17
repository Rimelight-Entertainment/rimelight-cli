import { name as pkgName, version as pkgVersion, author, description } from "../../package.json"
import { renderCliDoc } from "../utils/help.js"
import { accent } from "../utils/terminal.js"

export async function run() {
  console.log(renderCliDoc({
    summary: `${pkgName} v${pkgVersion}`,
    sections: [
      {
        title: "Environment",
        rows: [
          { label: accent("CLI Version"), description: `v${pkgVersion}` },
          { label: accent("Description"), description },
          { label: accent("Author"), description: typeof author === "string" ? author : (author as any).name }
        ]
      }
    ]
  }))
}
