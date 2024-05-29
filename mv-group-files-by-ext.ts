#!/usr/bin/env bun
import fs from 'fs'
import path from 'path'
import mime from './mime.json'

const onExit = (msg: string = "Nothing to do. Exit.", exitCode: number = 0) => { console.log(msg); process.exit(exitCode) }
if (!process.env.PWD) onExit("Missing PWD env variable", 1)

type FileItem = { ext: string, basename: string };
const extensions = new Set(Object.keys(mime));

const PWD: string = process.env.PWD as string;
const dir = fs.readdirSync(process.env.PWD as any)
const filenameToObject: (file: string) => FileItem = (file) => ({
    ext: path.extname(file).substring(1),
    basename: path.basename(file)
})
const groupByExt = (eObj = {}, file: FileItem) => {
    if (!eObj[file.ext]) eObj[file.ext] = { ext: file.ext, files: [] };
    eObj[file.ext].files.push(file.basename);
    return eObj;
}
const groups: { [key: string]: { ext: string, files: Array<string> } } | undefined = dir
    .map(filenameToObject)
    .filter(file => extensions.has(file.ext))
    .reduce(groupByExt, Object.create({}))


if (groups === undefined) onExit()
if (groups && Object.keys(groups).length < 1) onExit()
if (groups) Object.values(groups).forEach(group => {
    console.log(`${group.ext.toUpperCase()} (${group.files.length})`)
})

console.log("Continue? [y]")
for await (const line of console) {
    if (line !== "y") onExit()
    if (groups) Object.values(groups).forEach(group => {
        const groupdir = path.join(PWD, group.ext)
        if (!fs.existsSync(groupdir)) fs.mkdirSync(groupdir)
        group.files.forEach(file => fs.renameSync(path.join(PWD, file), path.join(groupdir, file)))
    })
    onExit("Done.")

}

