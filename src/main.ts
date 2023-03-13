import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function start() {
    const PORT = process.env.PORT || 5000
    const app = await NestFactory.create(AppModule)
    app.setGlobalPrefix('api')
    app.enableCors()

    const config = new DocumentBuilder()
        .setTitle('SoundCloudAPI')
        .setDescription('Документация по API SoundCloudAPI')
        .setVersion('1.0.0')
        .addTag('SoundCloud')
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('/api/docs', app, document)

    await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`))
}

start()
