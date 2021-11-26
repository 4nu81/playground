from asyncio import run, sleep, create_task

async def fetch_data():
    print('start fetching')
    await sleep(1.5)
    print('done fetching')
    return {'data': 1}

async def print_numbers():
    for i in range(10):
        print(i)
        await sleep(.25)

async def main():
    print(await fetch_data())
    task1 = create_task(fetch_data())
    task2 = create_task(print_numbers())

    value = await task1
    print(value)
    await task2

run(main())