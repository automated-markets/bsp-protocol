import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as nunjucks from 'nunjucks';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const express = app.getHttpAdapter().getInstance();
    const assets = join(__dirname, '..', 'public'); // Directory with static HTML/CSS/JS/other files

    nunjucks.configure([
      "node_modules/govuk-frontend/",
      "src/views"
    ], { express });

    app.useStaticAssets(assets);
    //app.use('/', express.static(assets));
    // serve static assets from the client/dist folder, change this to the correct path for your project
    //app.use(express.static(join(process.cwd(), 'public')));
  
    app.setViewEngine('njk');
    
    
    await app.listen(3000);
}

bootstrap();
