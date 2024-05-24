import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TaskService } from '../src/task/task.service';
import { Test } from '@nestjs/testing';
import { UserService } from '../src/user/user.service';
import * as request from 'supertest';

describe('TaskController', () => {
    let app: INestApplication;

    let taskService: TaskService;
    let userService: UserService;

    describe('GET /user/:userId', () => {
        beforeEach(async () => {
            app = await createNestApplication();
            app.useGlobalPipes(new ValidationPipe({ transform: true }));
            taskService = app.get(TaskService);
            userService = app.get(UserService);

            await app.init();
        });

        afterEach(async () => {
            await taskService.resetData();
            await userService.resetData();
            await app.close();
        });

        it('should return an HTTP error status 400 when given userId is not valid', async () => {
            const invalidUserIds = ['h e', '-87', 'eeee'];

            for (const userId of invalidUserIds) {
                const response = await request(app.getHttpServer()).get(
                    `/task/user/${userId}`,
                );

                expect(response.status).toBe(400);
            }
        });

        it('should return an HTTP status 200 when given userId is valid', async () => {
            const createdElements = await createTasksFor2DifferentUsers(
                userService,
                taskService,
            );

            for (const created of createdElements) {
                const response = await request(app.getHttpServer()).get(
                    `/task/user/${created.user.id}`,
                );

                expect(response.status).toBe(200);

                const haveAllTasksBeenReturned = response.body.every((task) =>
                    created.tasks.some(
                        (createdTask) => createdTask.id === task.id,
                    ),
                );
                expect(haveAllTasksBeenReturned).toBe(true);
            }
        });
    });

    describe('POST /', () => {
        beforeEach(async () => {
            app = await createNestApplication();
            app.useGlobalPipes(new ValidationPipe({ transform: true }));
            taskService = app.get(TaskService);
            userService = app.get(UserService);

            await app.init();
        });

        afterEach(async () => {
            await taskService.resetData();
            await userService.resetData();
            await app.close();
        });

        it('should return an HTTP error status 400 when given task is not valid', async () => {
            const invalidPayloads = [
                { name: '', userId: '', priority: 'a' },
                { name: 'my task', userId: '', priority: ' ' },
                { name: '', userId: 'userId', priority: '-58' },
                { name: 'my task', userId: 'userId', priority: '-58' },
                { name: 'my task', userId: 'userId', priority: '0' },
            ];

            for (const payload of invalidPayloads) {
                const response = await request(app.getHttpServer())
                    .post('/task')
                    .send(payload);

                expect(response.status).toBe(400);
            }
        });

        it('should return an HTTP status 201 when given task has been created', async () => {
            const createdUser = await createUserUsing(
                userService,
                'email@test.com',
            );
            const validPayloads = [
                {
                    name: 'task1',
                    userId: createdUser.id,
                    priority: '1',
                },
                {
                    name: 'task2',
                    userId: createdUser.id,
                    priority: '1',
                },
                {
                    name: 'task3',
                    userId: createdUser.id,
                    priority: '1',
                },
                {
                    name: 'task4',
                    userId: createdUser.id,
                    priority: '1',
                },
            ];

            for (const payload of validPayloads) {
                const response = await request(app.getHttpServer())
                    .post('/task')
                    .send(payload);

                expect(response.status).toBe(201);

                const task = (await taskService.getTaskByName(
                    payload.name,
                )) as any;

                expect(task).toBeDefined();
                expect(task.name).toBe(payload.name);
                expect(task.priority).toBe(+payload.priority);
            }
        });
    });
});

async function createTasksFor2DifferentUsers(
    userService: UserService,
    taskService: TaskService,
): Promise<{ user: any; tasks: any[] }[]> {
    const createdUser1 = await createUserUsing(userService, 'email_1@test.com');
    for (let count = 0; count < 15; count++) {
        await taskService.addTask(`task #${count}`, createdUser1.id, 1);
    }

    const createdUser2 = await createUserUsing(userService, 'email_2@test.com');
    for (let count = 0; count < 15; count++) {
        await taskService.addTask(`task #${count}`, createdUser2.id, 1);
    }

    return [
        {
            user: createdUser1,
            tasks: await taskService.getUserTasks(createdUser1.id),
        },
        {
            user: createdUser2,
            tasks: await taskService.getUserTasks(createdUser2.id),
        },
    ];
}

async function createNestApplication(): Promise<INestApplication> {
    process.env.DATABASE_NAME = 'test_nestjs-final-test-db_TASKS';

    const module = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    return module.createNestApplication();
}

async function createUserUsing(
    userService: UserService,
    email: string,
): Promise<any> {
    await userService.addUser(email);
    return (await userService.getUser(email)) as any;
}
