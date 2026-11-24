// Child process for scripts/team-portraits.mjs: removes the background of one image.
// Kept separate because the ONNX runtime and sharp/libvips crash when they share a process.
import fs from 'node:fs';
import { removeBackground } from '@imgly/background-removal-node';

const [input, output] = process.argv.slice(2);
const blob = await removeBackground(new Blob([fs.readFileSync(input)], { type: 'image/png' }), { model: 'medium', output: { format: 'image/png' } });
fs.writeFileSync(output, Buffer.from(await blob.arrayBuffer()));
