import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserService } from '../src/user/user.service';
import * as request from 'supertest';

describe('UserController', () => {
    let app: INestApplication;
    let userService: UserService;

    describe('POST /', () => {
        beforeEach(async () => {
            app = await createNestApplication();
            app.useGlobalPipes(new ValidationPipe({ transform: true }));
            userService = app.get(UserService);

            await app.init();
        });

        afterEach(async () => {
            await userService.resetData();
            await app.close();
        });

        it('should return an HTTP error status 400 when given user is not valid', async () => {
            const invalidPayloads = [
                { email: '' },
                { email: 'name' },
                { email: 'name@' },
                { email: 'name@test' },
                { email: 'name@test.' },
            ];

            for (const payload of invalidPayloads) {
                const response = await request(app.getHttpServer())
                    .post('/user')
                    .send(payload);

                expect(response.status).toBe(400);
            }
        });

        it('should return an HTTP status 201 when given user has been created', async () => {
            const validPayloads = [
                { email: 'name_1@test.com' },
                { email: 'name_2@test.com' },
                { email: 'name_3@test.com' },
                { email: 'name_4@test.com' },
            ];

            for (const payload of validPayloads) {
                const response = await request(app.getHttpServer())
                    .post('/user')
                    .send(payload);

                expect(response.status).toBe(201);

                const user = (await userService.getUser(payload.email)) as any;
                expect(user).toBeDefined();
                expect(user.email).toBe(payload.email);
            }
        });

        it('should return an HTTP error status 409 when given user already exists', async () => {
            const payload = { email: 'name@test.com' };
            await userService.addUser(payload.email);

            const response = await request(app.getHttpServer())
                .post('/user')
                .send(payload);

            expect(response.status).toBe(409);
        });
    });
});

async function createNestApplication() {
    process.env.DATABASE_NAME = 'test_nestjs-final-test-db_USERS';

    const module = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    return module.createNestApplication();
}
