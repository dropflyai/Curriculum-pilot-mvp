const puppeteer = require('puppeteer');
const fs = require('fs');
const { marked } = require('marked');

async function convertToPDF() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Read the markdown file
    const markdownContent = fs.readFileSync('./CodeFly_Complete_Program.md', 'utf8');
    
    // Convert to HTML
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    max-width: 800px; 
                    margin: 0 auto; 
                    padding: 20px;
                    line-height: 1.6;
                }
                h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
                h2 { color: #1e40af; margin-top: 30px; }
                h3 { color: #3730a3; }
                .pricing-table { 
                    background: #f8fafc; 
                    padding: 20px; 
                    border-radius: 8px; 
                    margin: 20px 0; 
                }
                pre { 
                    background: #f1f5f9; 
                    padding: 15px; 
                    border-radius: 5px; 
                    overflow-x: auto; 
                }
                code { 
                    background: #e2e8f0; 
                    padding: 2px 4px; 
                    border-radius: 3px; 
                }
            </style>
        </head>
        <body>
            ${marked.parse(markdownContent)}
        </body>
        </html>
    `;
    
    await page.setContent(htmlContent);
    
    // Generate PDF
    await page.pdf({
        path: './CodeFly_Complete_Program.pdf',
        format: 'A4',
        margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm'
        }
    });
    
    await browser.close();
    console.log('PDF generated successfully!');
}

convertToPDF().catch(console.error);