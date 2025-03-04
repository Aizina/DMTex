export function convertHTMLToText(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
  
    let resultText = "";

    const paragraph = doc.querySelector('p');
    if (paragraph && paragraph.textContent) {
      resultText += paragraph.textContent + "\n\n";
    }
  
    const listItems = doc.querySelectorAll('ul li');
    if (listItems.length > 0) {
      Array.from(listItems).forEach((item) => {
        resultText += `- ${item.textContent}\n`; 
      });
      resultText += "\n";
    }

    const warning = doc.querySelector('strong');
    if (warning && warning.textContent) {
      let warningText = warning.textContent;
  
      const links = warning.querySelectorAll('a');
      links.forEach((link) => {
        if (link.textContent && link.href) {
          warningText = warningText.replace(link.textContent, `[${link.textContent}](${link.href})`);
        }
      });
  
      resultText += warningText;
    }
  
    return resultText;
  }
  