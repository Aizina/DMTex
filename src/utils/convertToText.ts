import parse, { domToReact, Element, DOMNode } from "html-react-parser";

export function convertHTMLToText(html: string): string {
  return parse(html, {
    replace: (node) => {
      if (node instanceof Element) {
        switch (node.name) {
          case "ul":
            return `\n${domToReact(node.children as DOMNode[])}\n`;
            case "ol":
              return `\n${(node.children as DOMNode[])
                .map((child, index) =>
                  child.type === "tag" && child.name === "li"
                    ? `${index + 1}. ${domToReact((child as Element).children as DOMNode[])}`
                    : null
                )
                .filter(Boolean)
                .join("\n")}\n`;
            case "li":
              return `- ${domToReact(node.children as DOMNode[])}\n`;
          case "p":
            return `\n${domToReact(node.children as DOMNode[])}\n`;
          case "strong":
          case "b":
            return `**${domToReact(node.children as DOMNode[])}**`;
          case "em":
          case "i":
            return `*${domToReact(node.children as DOMNode[])}*`;
          case "a":
            return `[${domToReact(node.children as DOMNode[])}](${node.attribs.href})`;
          default:
            return domToReact(node.children as DOMNode[]);
        }
      }
    },
  }) as string;
}
