import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface KatexOptions {
  displayMode?: boolean;
  throwOnError?: boolean;
}

/**
 * Checks if a string contains LaTeX mathematical notation
 * @param text The text to check for LaTeX content
 * @returns boolean indicating if the text contains LaTeX
 */
export const containsLatex = (text: string): boolean => {
  // Common LaTeX delimiters
  const latexPatterns = [
    /\$\$(.*?)\$\$/g,  // Display math mode $$...$$
    /\$(.*?)\$/g,      // Inline math mode $...$
    /\\begin\{.*?\}.*?\\end\{.*?\}/gs,  // Environment blocks
    /\\[a-zA-Z]+\{.*?\}/g  // LaTeX commands
  ];

  return latexPatterns.some(pattern => pattern.test(text));
};

/**
 * Renders text that may contain LaTeX mathematical notation
 * @param text The text to render, which may contain LaTeX
 * @param options Optional KaTeX rendering options
 * @returns JSX element with properly rendered LaTeX
 */
export const renderMathContent = (text: string, options: KatexOptions = { displayMode: false, throwOnError: false }): React.ReactNode => {
  if (!text) return null;
  
  if (!containsLatex(text)) {
    return text;
  }

  // For display mode (centered, larger equations)
  if (text.startsWith('$$') && text.endsWith('$$')) {
    return <BlockMath math={text.slice(2, -2)} />;
  }

  // For inline mode
  if (text.startsWith('$') && text.endsWith('$')) {
    return <InlineMath math={text.slice(1, -1)} />;
  }

  // For mixed content (text and LaTeX), we need to split and render each part
  const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('$$') && part.endsWith('$$')) {
      return <BlockMath key={index} math={part.slice(2, -2)} />;
    }
    if (part.startsWith('$') && part.endsWith('$')) {
      return <InlineMath key={index} math={part.slice(1, -1)} />;
    }
    return part;
  });
};
