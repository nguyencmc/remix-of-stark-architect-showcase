// Script to fix broken JSX closing tags caused by previous script
// Finds patterns like: misindented </> that should close a <div>
const fs = require('fs');
const path = require('path');

// Get all tsx files in src/pages and src/features
const { execSync } = require('child_process');

// Find all problematic patterns
const output = execSync('grep -rn "^    </>" src/pages src/features --include="*.tsx" 2>/dev/null || true', {
    encoding: 'utf-8',
    cwd: process.cwd()
});

const lines = output.trim().split('\n').filter(l => l.length > 0);

console.log(`Found ${lines.length} potential issues\n`);

// Group by file
const fileIssues = {};
for (const line of lines) {
    const match = line.match(/^(.+?):(\d+):/);
    if (match) {
        const filePath = match[1];
        const lineNum = parseInt(match[2]);
        if (!fileIssues[filePath]) {
            fileIssues[filePath] = [];
        }
        fileIssues[filePath].push(lineNum);
    }
}

let fixedCount = 0;

for (const [filePath, lineNumbers] of Object.entries(fileIssues)) {
    console.log(`\nProcessing: ${filePath}`);
    console.log(`  Lines to check: ${lineNumbers.join(', ')}`);

    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    const lines = content.split('\n');

    // Track fixes for this file
    let fileFixed = false;

    // For each problematic line, analyze context
    for (const lineNum of lineNumbers) {
        const idx = lineNum - 1;
        const line = lines[idx];

        if (!line || !line.match(/^\s+<\/>$/)) continue;

        // Look backwards to find what opened this block
        let openingTag = null;
        let depth = 1; // We're at a closing tag, so depth = 1

        for (let i = idx - 1; i >= 0 && i > idx - 100; i--) {
            const prevLine = lines[i];

            // Count closing tags (going backwards means we need to track depth)
            const selfClosing = (prevLine.match(/<[\w]+[^>]*\/>/g) || []).length;
            const closingTags = (prevLine.match(/<\/[\w]+>/g) || []).length - selfClosing;
            const fragmentClose = (prevLine.match(/<\/>/g) || []).length;

            depth += closingTags + fragmentClose;

            // Look for opening tags
            const openingMatches = prevLine.match(/<([\w]+)[^>]*(?<![\/>])>/g);
            if (openingMatches) {
                for (const match of openingMatches) {
                    depth--;
                    if (depth === 0) {
                        // Extract tag name
                        const tagMatch = match.match(/<([\w]+)/);
                        if (tagMatch) {
                            openingTag = tagMatch[1];
                            break;
                        }
                    }
                }
            }

            if (openingTag) break;

            // Check for fragment opening
            const fragmentOpen = (prevLine.match(/<>/g) || []).length;
            depth -= fragmentOpen;
            if (depth === 0) {
                openingTag = ''; // Fragment
                break;
            }
        }

        console.log(`  Line ${lineNum}: Opening tag appears to be: <${openingTag || 'unknown'}>`);

        // If opening tag is a named tag (div, section, etc) but closing is fragment, fix it
        if (openingTag && openingTag !== '' && line.includes('</>')) {
            const indent = line.match(/^(\s*)/)[1];
            lines[idx] = `${indent}</${openingTag}>`;
            fileFixed = true;
            console.log(`  ✓ Fixed line ${lineNum}: </> → </${openingTag}>`);
        }
    }

    if (fileFixed) {
        content = lines.join('\n');
        fs.writeFileSync(filePath, content);
        fixedCount++;
    }
}

console.log(`\n📊 Files fixed: ${fixedCount}`);
