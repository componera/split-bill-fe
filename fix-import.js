const fs = require("fs");
const path = require("path");

// Root directory of your Next.js project
const ROOT_DIR = __dirname;

// Folders to ignore
const IGNORE_DIRS = ["node_modules", ".next", "out"];

// Recursively get all .ts and .tsx files
function getAllTsFiles(dir) {
	let results = [];
	const list = fs.readdirSync(dir);
	list.forEach(file => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			if (!IGNORE_DIRS.includes(file)) {
				results = results.concat(getAllTsFiles(filePath));
			}
		} else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
			results.push(filePath);
		}
	});
	return results;
}

// Fix relative imports
function fixImports(filePath) {
	let content = fs.readFileSync(filePath, "utf8");
	const dir = path.dirname(filePath);

	const importRegex = /import\s+.*\s+from\s+['"](.*)['"]/g;
	let modified = false;

	content = content.replace(importRegex, (match, importPath) => {
		if (importPath.startsWith(".") || importPath.startsWith("/")) {
			const fullPathTs = path.resolve(dir, importPath + ".ts");
			const fullPathTsx = path.resolve(dir, importPath + ".tsx");
			const fullPathIndexTs = path.resolve(dir, importPath, "index.ts");
			const fullPathIndexTsx = path.resolve(dir, importPath, "index.tsx");

			if (!fs.existsSync(fullPathTs) && !fs.existsSync(fullPathTsx)) {
				if (fs.existsSync(fullPathIndexTs)) {
					const fixedPath = importPath.endsWith("/") ? importPath + "index" : importPath + "/index";
					modified = true;
					console.log(`Fixed import in ${filePath}: ${importPath} -> ${fixedPath}`);
					return match.replace(importPath, fixedPath);
				}
				if (fs.existsSync(fullPathIndexTsx)) {
					const fixedPath = importPath.endsWith("/") ? importPath + "index" : importPath + "/index";
					modified = true;
					console.log(`Fixed import in ${filePath}: ${importPath} -> ${fixedPath}`);
					return match.replace(importPath, fixedPath);
				}
			}
		}
		return match;
	});

	if (modified) {
		fs.writeFileSync(filePath, content, "utf8");
	}
}

// Run on all TS and TSX files
const tsFiles = getAllTsFiles(ROOT_DIR);
tsFiles.forEach(fixImports);

console.log("✅ Finished fixing import paths for Next.js project!");
