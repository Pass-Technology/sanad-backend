import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

@Injectable()
export class TemplateService {
    private templatesPath = path.join(__dirname, 'templates');

    renderTemplate(templateName: string, data: any): string {
        const filePath = path.join(this.templatesPath, `${templateName}.hbs`);

        if (!fs.existsSync(filePath)) {
            throw new Error(`Template ${templateName} not found`);
        }

        const source = fs.readFileSync(filePath, 'utf-8');
        const compiled = Handlebars.compile(source);

        return compiled(data);
    }
}